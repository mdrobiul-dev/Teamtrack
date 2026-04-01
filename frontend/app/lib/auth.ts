import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { User } from '@/app/types/auth';
import { authService } from '@/app/services/auth.service';

export const getSession = cache(async (): Promise<User | null> => {
  try {
    const res = await authService.getMe();
    return res.user;
  } catch {
    return null;
  }
});

export const requireAuth = cache(async (): Promise<User> => {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
});

export const getTokens = cache(async () => {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get('accessToken')?.value,
    refreshToken: cookieStore.get('refreshToken')?.value,
  };
});

export const isAuthenticated = cache(async () => {
  return !!(await getSession());
});

