'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGuest } from '@/hooks/use-guest';
import { api } from '@/lib/api/client';
import { RoomHeader, RoomNav } from '@/components/guest/room-chrome';
import PhotoGrid from '@/components/guest/photo-grid';
import EmptyState from '@/components/shared/empty-state';

export default function MyPhotosPage() {
  const { slug } = useParams<{ slug: string }>();
  const { token, loading: guestLoading, isJoined } = useGuest(slug);
  const [tab, setTab] = useState<'of-me' | 'mine'>('of-me');

  const { data, isLoading } = useQuery({
    queryKey: ['me', slug],
    queryFn: () => api.getMe(slug, token!),
    enabled: !!token,
  });

  const ofMe = data?.photosOfMe ?? [];
  const mine = data?.uploads ?? [];
  const guest = data?.guest;
  const items = tab === 'of-me' ? ofMe : mine;

  return (
    <main className="min-h-screen pb-32">
      <RoomHeader slug={slug} />

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Profile card */}
        <div className="card mb-6 flex items-center gap-4 p-5">
          <span className="relative flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-xl font-bold text-white shadow-glow">
            {guest?.pfpUrl ? (
              <img src={guest.pfpUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (guest?.displayName || 'G').charAt(0).toUpperCase()
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-bold text-white">
              {guest?.displayName || 'Your photos'}
            </p>
            <p className="mt-0.5 text-sm text-slate-400">
              {guest?.uploadCount ?? mine.length} upload{((guest?.uploadCount ?? mine.length) === 1) ? '' : 's'} ·{' '}
              {ofMe.length} photo{ofMe.length === 1 ? '' : 's'} of you
            </p>
          </div>
          <Link href={`/e/${slug}/upload`} className="btn btn-primary btn-sm flex-none">
            Shoot
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          <button
            onClick={() => setTab('of-me')}
            className={`tab flex-1 justify-center ${tab === 'of-me' ? 'tab-active' : ''}`}
          >
            Photos I’m in
            <span className="rounded-full bg-white/10 px-1.5 text-[11px]">{ofMe.length}</span>
          </button>
          <button
            onClick={() => setTab('mine')}
            className={`tab flex-1 justify-center ${tab === 'mine' ? 'tab-active' : ''}`}
          >
            My uploads
            <span className="rounded-full bg-white/10 px-1.5 text-[11px]">{mine.length}</span>
          </button>
        </div>

        {guestLoading || (isJoined && isLoading) ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square" />
            ))}
          </div>
        ) : !isJoined ? (
          <EmptyState
            icon="🔓"
            title="Join the room first"
            body="Add your name and a selfie so we can match photos of you automatically."
            action={
              <Link href={`/e/${slug}`} className="btn btn-primary">
                Join the room
              </Link>
            }
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={tab === 'of-me' ? '🤳' : '📷'}
            title={tab === 'of-me' ? 'No photos of you yet' : 'You haven’t uploaded yet'}
            body={
              tab === 'of-me'
                ? 'This fills up automatically as guests upload. Make sure your selfie consent is on for the best matches.'
                : 'Shoot a few moments and they’ll show up here — and on the live wall.'
            }
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
