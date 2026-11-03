'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGuest } from '@/hooks/use-guest';
import { useRoom } from '@/hooks/use-room';
import { useRoomUploads } from '@/components/guest/upload-queue-provider';
import { ArrowLeftIcon, CameraIcon } from '@/components/shared/icons';

export default function CameraPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { loading, isJoined } = useGuest(slug);
  const { data: room } = useRoom(slug);
  const uploads = useRoomUploads();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isJoined) router.replace(`/e/${slug}`);
  }, [loading, isJoined, router, slug]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const onCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length || !uploads) return;
    setError(null);
    setPreview(URL.createObjectURL(files[files.length - 1]));
    try {
      await uploads.add(files);
    } catch (err) {
      setError((err as Error).message || 'We couldn’t read that photo. Try taking it again.');
    }
  };

  const closed = room && !room.uploadsOpen;
  const status = error
    ? error
    : uploads?.refused
      ? uploads.refused
      : uploads?.sending
        ? 'Sending…'
        : uploads && uploads.waiting > 0
          ? `${uploads.waiting} waiting for signal. We’ll keep trying.`
          : preview
            ? 'Sent. It’ll show in the gallery in a moment.'
            : null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="safe-top flex h-14 flex-none items-center justify-between border-b border-rule px-2">
        <Link href={`/e/${slug}/gallery`} className="flex h-11 items-center gap-2 px-2 text-[15px] font-medium">
          <ArrowLeftIcon /> Gallery
        </Link>
        <span className="truncate px-2 font-serif text-[22px]">{room?.name}</span>
      </header>

      <div className="relative m-4 flex flex-1 items-center justify-center overflow-hidden rounded-card bg-placeholder">
        {preview ? (
          <img src={preview} alt="Your last photo" className="h-full w-full object-cover" />
        ) : (
          <p className="max-w-[16rem] text-center text-[15px] text-ink-soft">
            {closed ? 'Uploads are closed for this event.' : 'Tap the button to take a photo. It goes straight to the event.'}
          </p>
        )}
      </div>

      <p role="status" aria-live="polite" className="min-h-6 px-6 text-center text-sm text-ink-soft">
        {status}
      </p>

      <div className="safe-bottom grid flex-none grid-cols-3 items-center px-6 pt-4">
        <div className="text-center">
          <p className="text-xl font-semibold">{uploads?.sent ?? 0}</p>
          <p className="text-xs text-muted">sent</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => input.current?.click()}
            disabled={!uploads || !!closed}
            aria-label="Take a photo"
            className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-card bg-accent text-white shadow-[0_0_0_1px_#D6CEC2] transition-colors hover:bg-accent-hover disabled:bg-rule disabled:text-muted"
          >
            <CameraIcon className="h-8 w-8" />
          </button>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold">{uploads?.waiting ?? 0}</p>
          <p className="text-xs text-muted">waiting</p>
        </div>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={onCapture}
        className="hidden"
      />
    </main>
  );
}
