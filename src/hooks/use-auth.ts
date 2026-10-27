'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth({ redirectTo = '/login' }: { redirectTo?: string } = {}) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('pixy_token');
    setToken(stored);
    setLoading(false);
    if (!stored) router.replace(redirectTo);
  }, [router, redirectTo]);

  const signOut = () => {
    localStorage.removeItem('pixy_token');
    localStorage.removeItem('pixy_refresh');
    router.replace('/login');
  };

  return { token, loading, isAuthed: !!token, signOut };
}
