import { create } from 'zustand';

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  setTokens: (access_token: string, refresh_token: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  setTokens: (access_token, refresh_token) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    set({ access_token, refresh_token });
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ access_token: null, refresh_token: null });
  },
})); 