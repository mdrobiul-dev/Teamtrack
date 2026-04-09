import 'server-only';
import { api } from '@/app/lib/api';
import { cache } from 'react';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/app/types/auth';

export const authService = {
  login: cache(async (credentials: LoginCredentials) => {
    return api.post<AuthResponse>('/auth/login', credentials);
  }),

  register: cache(async (credentials: RegisterCredentials) => {
    return api.post<AuthResponse>('/auth/register', credentials);
  }),


  getMe: cache(async () => {
    return api.get<{ success: true; user: User }>('/auth/me');
  }),

  logout: cache(async () => {
    return api.post<{ success: true; message: string }>('/auth/logout', {});
  }),
};