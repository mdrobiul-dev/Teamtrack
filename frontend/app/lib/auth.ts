// app/lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies(); // ← async!
  const userCookie = cookieStore.get('user');

  if (!userCookie?.value) return null;

  try {
    return JSON.parse(userCookie.value) as SessionUser;
  } catch {
    console.error('Invalid user cookie');
    return null;
  }
});

export const requireAuth = cache(async (): Promise<SessionUser> => {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
});

// ... keep the other functions, but make them async where they use cookies()
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

