'use client';

import { useParams } from 'next/navigation';
import { errorMessage } from '@/lib/api/errors';
import { useMe } from '@/hooks/use-me';
import GuestPage from '@/components/guest/guest-page';
import PhotoGrid, { GridSkeleton } from '@/components/guest/photo-grid';
import EmptyState from '@/components/shared/empty-state';

export default function PhotosOfMePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMe(slug, 'photosOfMe');

  const guest = data?.pages[0]?.guest;
  const items = (data?.pages ?? []).flatMap((p) =>
    p.photosOfMe.map((m) => ({ ...m, caption: m.guest?.displayName ?? undefined })),
  );

  return (
    <GuestPage slug={slug}>
      {guest && (
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-placeholder font-serif text-xl">
            {guest.pfpUrl ? (
              <img src={guest.pfpUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              guest.displayName.charAt(0).toUpperCase()
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{guest.displayName}</p>
            <p className="text-[13px] text-muted">
              {guest.pfpUrl ? 'Matched with your selfie' : 'No selfie yet, so we can’t match photos to you'}
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <GridSkeleton />
      ) : error ? (
        <EmptyState title="Couldn’t load your photos" body={errorMessage(error)} art={false} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No photos of you yet"
          body={
            guest?.pfpUrl
              ? 'As people share, the ones you’re in show up here.'
              : 'Join with a selfie and the photos you’re in will show up here.'
          }
        />
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
