'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useGuest } from '@/hooks/use-guest';
import { api } from '@/lib/api/client';
import { RoomHeader, RoomNav } from '@/components/guest/room-chrome';
import PhotoGrid from '@/components/guest/photo-grid';
import EmptyState from '@/components/shared/empty-state';

export default function GalleryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token, loading: guestLoading, isJoined } = useGuest(slug);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', slug],
    queryFn: () => api.getGallery(slug, token!),
    enabled: !!token,
  });

  const items = data?.items ?? [];

  return (
    <main className="min-h-screen pb-32">
      <RoomHeader slug={slug} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Event gallery</h1>
            <p className="mt-1 text-sm text-slate-400">
              {items.length > 0 ? `${items.length} moment${items.length === 1 ? '' : 's'} so far` : 'Fresh from the room'}
            </p>
          </div>
          <Link href={`/e/${slug}/upload`} className="btn btn-primary btn-sm flex-none">
            Add yours
          </Link>
        </div>

        {guestLoading || (isJoined && isLoading) ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square" />
            ))}
          </div>
        ) : !isJoined ? (
          <EmptyState
            icon="🔓"
            title="Join the room to see the gallery"
            body="Add your name and a selfie, then every photo from the event unlocks."
            action={
              <Link href={`/e/${slug}`} className="btn btn-primary">
                Join the room
              </Link>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon="📷"
            title="No photos yet — be the first"
            body="Yours will appear here the moment they upload, alongside everyone else’s."
            action={
              <Link href={`/e/${slug}/upload`} className="btn btn-primary">
                Open the camera
              </Link>
            }
          />
        ) : (
          <PhotoGrid items={items} />
        )}
      </div>

      <RoomNav slug={slug} />
    </main>
  );
}
