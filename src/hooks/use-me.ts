'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useGuest } from './use-guest';

/**
 * `GET /e/:slug/me` pages its two lists separately, so each tab keeps its own
 * infinite query: "photos of me" follows photosOfMeNextCursor, "mine" follows
 * uploadsNextCursor. The first page is the same request either way.
 */
export function useMe(slug: string, list: 'photosOfMe' | 'uploads') {
  const { isJoined } = useGuest(slug);
  return useInfiniteQuery({
    queryKey: ['me', slug, list],
    queryFn: ({ pageParam }) => api.getMe(slug, { [list]: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (list === 'uploads' ? last.uploadsNextCursor : last.photosOfMeNextCursor),
    enabled: isJoined,
    // Face matches and processing finish in the background.
    refetchInterval: 30_000,
  });
}
