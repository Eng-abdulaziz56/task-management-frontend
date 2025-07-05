import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';
import { refreshTokenApi } from '@/features/auth/api';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const access_token = useAuthStore.getState().access_token;
        if (access_token && config.headers) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log(error.response)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const authStore = useAuthStore.getState();
            const refreshToken = authStore.refresh_token;

            if (!refreshToken) {
    
                authStore.clearTokens();
                window.location.href = '/auth';
                return Promise.reject(error);
            }

            try {
                const response = await refreshTokenApi(refreshToken);
                const { access_token, refresh_token } = response;

                authStore.setTokens(access_token, refresh_token);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }

                processQueue(null, access_token);

                return api(originalRequest);
            } catch (refreshError) {
                console.log("redirect to auth");
                authStore.clearTokens();
                processQueue(refreshError, null);

                window.location.href = '/auth';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        console.log(" not redirect to auth");

        if (error.response && error.response.data) {
            const message = error.response.data.message;
            if (message) {
                return Promise.reject(new Error(message));
            }
        }
        return Promise.reject(error);
    }
);

export default api; 