'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGuest } from '@/hooks/use-guest';
import { RoomHeader, Shutter } from './room-chrome';
import { useRoomUploads } from './upload-queue-provider';
import Welcome from './welcome';

/** Room pages that need a guest session; without one, back to the join screen. */
export default function GuestPage({
  slug,
  children,
  shutter = true,
}: {
  slug: string;
  children: React.ReactNode;
  shutter?: boolean;
}) {
  const { loading, isJoined } = useGuest(slug);
  const router = useRouter();
  const uploads = useRoomUploads();

  useEffect(() => {
    if (!loading && !isJoined) router.replace(`/e/${slug}`);
  }, [loading, isJoined, router, slug]);

  return (
    <main className="min-h-dvh pb-32">
      <RoomHeader slug={slug} />
      {isJoined && <Welcome />}
      <div className="mx-auto max-w-3xl">{isJoined ? children : null}</div>
      {uploads && uploads.waiting > 0 && (
        <p
          role="status"
          className="fixed inset-x-4 bottom-28 z-30 mx-auto flex max-w-md items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm text-paper"
        >
          <span className="h-2 w-2 flex-none rounded-full bg-accent-soft" />
          {uploads.waiting} photo{uploads.waiting === 1 ? '' : 's'} waiting to send
          {uploads.sending ? '…' : ' · will retry automatically'}
        </p>
      )}
      {shutter && isJoined && <Shutter slug={slug} />}
    </main>
  );
}
