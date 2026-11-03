'use client';

import { useParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import { useGuest } from '@/hooks/use-guest';
import GuestPage from '@/components/guest/guest-page';
import PhotoGrid, { GridSkeleton } from '@/components/guest/photo-grid';
import EmptyState from '@/components/shared/empty-state';

export default function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isJoined } = useGuest(slug);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['gallery', slug],
    queryFn: ({ pageParam }) => api.getGallery(slug, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: isJoined,
  });

  const items = (data?.pages ?? []).flatMap((p) =>
    p.items.map((m) => ({ ...m, caption: m.guest?.displayName ?? undefined })),
  );

  return (
    <GuestPage slug={slug}>
      {isLoading ? (
        <GridSkeleton />
      ) : error ? (
        <EmptyState title="Couldn’t load photos" body={errorMessage(error)} />
      ) : items.length === 0 ? (
        <EmptyState title="No photos yet" body="Be the first. Tap the camera and your shot appears here for everyone." />
      ) : (
        <>
          <PhotoGrid items={items} />
          {hasNextPage && (
            <div className="flex justify-center py-6">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn btn-secondary btn-sm">
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </GuestPage>
  );
}
