import api from '@/lib/api/api-interceptor';
import type { RegisterRequest, LoginRequest, AuthResponse, ApiResponse } from './types';

const BASE_URL = '/auth';

export async function register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await api.post(`${BASE_URL}/register`, data);
  return res.data;
}

export async function login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const res = await api.post(`${BASE_URL}/login`, data);
  return res.data;
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const res = await api.post(`${BASE_URL}/refresh-token`, null, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
  return res.data;
}

export async function forgetPassword(email: string): Promise<ApiResponse<null>> {
  const res = await api.post(`${BASE_URL}/forgot-password`, { email });
  return res.data;
} 