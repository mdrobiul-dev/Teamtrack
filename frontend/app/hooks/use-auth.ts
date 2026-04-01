'use client';

import { useTransition } from 'react';
import { logout as logoutAction } from '@/app/actions/auth.actions';

export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const logout = async () => {
    await logoutAction();
  };

  return {
    isPending,
    logout: () => startTransition(async () => logout()),
  };
}