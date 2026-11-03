'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

/**
 * The public event for a room URL. People arrive by slug (QR) or by join code
 * (typed); once loaded, the URL is swapped to the slug so the guest session,
 * stored per slug, is the same either way. Works for /e/… and /wall/… URLs.
 */
export function useRoom(slugOrCode: string) {
  const router = useRouter();
  const pathname = usePathname();
  const query = useQuery({
    queryKey: ['room', slugOrCode.toLowerCase()],
    queryFn: () => api.getRoom(slugOrCode),
    staleTime: 5 * 60_000,
  });

  const slug = query.data?.slug;
  useEffect(() => {
    if (!slug || slug === slugOrCode) return;
    // /e/<code>/… or /wall/<code>: swap the second segment for the slug.
    const parts = pathname.split('/');
    parts[2] = slug;
    router.replace(parts.join('/'));
  }, [slug, slugOrCode, pathname, router]);

  return query;
}
