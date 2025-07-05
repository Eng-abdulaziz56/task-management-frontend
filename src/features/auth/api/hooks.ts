import { useMutation } from '@tanstack/react-query';
import { register, login, refreshTokenApi, forgetPassword } from './index';
import type { RegisterRequest, LoginRequest, AuthResponse, ApiResponse } from './types';

export function useRegister() {
  return useMutation<ApiResponse<AuthResponse>, Error, RegisterRequest>({
    mutationFn: register,
  });
}

export function useLogin() {
  return useMutation<ApiResponse<AuthResponse>, Error, LoginRequest>({
    mutationFn: login,
  });
}

export function useRefreshToken() {
  return useMutation<AuthResponse, Error, string>({
    mutationFn: refreshTokenApi,
  });
}

export function useForgetPassword() {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: forgetPassword,
  });
} 