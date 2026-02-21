'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import type { User } from '@/app/types/auth';

export function useAuth() {
  // Compute initial user synchronously (no effect needed)
  const getInitialUser = (): User | null => {
    const userCookie = Cookies.get('user');
    if (!userCookie) return null;
    try {
      return JSON.parse(userCookie) as User;
    } catch {
      Cookies.remove('user'); // clean up invalid cookie
      return null;
    }
  };

  const [user, setUser] = useState<User | null>(getInitialUser());
  const [loading, setLoading] = useState(false); // almost never loading now
  const router = useRouter();

  // Optional: watch for cookie changes in other tabs
  useEffect(() => {
    const handleChange = () => {
      setUser(getInitialUser());
    };

    window.addEventListener('storage', handleChange);
    // Custom event if you want same-tab updates
    window.addEventListener('auth-change', handleChange);

    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('auth-change', handleChange);
    };
  }, []);

  const logout = () => {
    // Trigger server action
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/auth/logout';
    document.body.appendChild(form);
    form.submit();

    // Optimistic UI update
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}