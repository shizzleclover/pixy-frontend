'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';

export function useGuest(slug: string) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = api.getGuestToken(slug);
    setToken(t);
    setLoading(false);
  }, [slug]);

  return { token, loading, isJoined: !!token };
}
