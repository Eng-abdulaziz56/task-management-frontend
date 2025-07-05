import type { ApiResponse as CommonApiResponse } from '@/common/types/api-response';

export type ApiResponse<T = unknown> = CommonApiResponse<T>;

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
} 