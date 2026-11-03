'use client';

import { useParams } from 'next/navigation';
import { errorMessage } from '@/lib/api/errors';
import { useMe } from '@/hooks/use-me';
import GuestPage from '@/components/guest/guest-page';
import PhotoGrid, { GridSkeleton } from '@/components/guest/photo-grid';
import EmptyState from '@/components/shared/empty-state';

export default function MyUploadsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMe(slug, 'uploads');

  const uploads = (data?.pages ?? []).flatMap((p) => p.uploads);
  const processing = uploads.filter((u) => u.status === 'processing' || u.status === 'uploading').length;

  return (
    <GuestPage slug={slug}>
      {processing > 0 && (
        <p className="px-4 py-3 text-[13px] text-muted">
          {processing} still processing. They’ll appear for everyone in a moment.
        </p>
      )}
      {isLoading ? (
        <GridSkeleton />
      ) : error ? (
        <EmptyState title="Couldn’t load your uploads" body={errorMessage(error)} art={false} />
      ) : uploads.length === 0 ? (
        <EmptyState title="Nothing shared yet" body="Tap the camera to share your first photo." />
      ) : (
        <>
          <PhotoGrid items={uploads} />
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
