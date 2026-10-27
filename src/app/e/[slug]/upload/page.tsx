'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGuest } from '@/hooks/use-guest';
import CameraUploadEnhanced from '@/components/upload/camera-upload-enhanced';
import { RoomHeader, RoomNav } from '@/components/guest/room-chrome';
import EmptyState from '@/components/shared/empty-state';
import Link from 'next/link';

export default function UploadPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token, loading, isJoined } = useGuest(slug);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isJoined) router.replace(`/e/${slug}`);
  }, [loading, isJoined, router, slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="skeleton h-[26rem] w-full" />
      </main>
    );
  }

  if (!isJoined) return null;

  return (
    <main className="min-h-screen pb-32">
      <RoomHeader slug={slug} />

      <div className="mx-auto max-w-2xl py-5">
        <CameraUploadEnhanced slug={slug} guestToken={token!} />

        <div className="mt-6 px-4">
          <EmptyState
            icon="✨"
            title="Every shot lands in the gallery"
            body="Your photos are matched to you automatically, so your personal gallery fills up as the event goes on."
            action={
              <Link href={`/e/${slug}/me`} className="btn btn-secondary btn-sm">
                See photos of me
              </Link>
            }
          />
        </div>
      </div>

      <RoomNav slug={slug} />
    </main>
  );
}
