'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { toJpeg } from '@/lib/media/compress';
import { errorMessage } from '@/lib/api/errors';
import { useGuest, GUEST_JOINED_EVENT } from '@/hooks/use-guest';
import { useRoom } from '@/hooks/use-room';
import Image from 'next/image';
import { coverFor } from '@/lib/photos';
import { JUST_JOINED_KEY } from '@/components/guest/welcome';
import { Wordmark } from '@/components/shared/logo';
import { CameraIcon } from '@/components/shared/icons';
import JoinCodeForm from '@/components/shared/join-code-form';

const NAME_MAX = 30;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function JoinRoom() {
  const { slug: param } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: room, isLoading, error: roomError } = useRoom(param);
  const slug = room?.slug;
  const { isJoined } = useGuest(slug ?? param);

  const [name, setName] = useState('');
  const [faceConsent, setFaceConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selfieInput = useRef<HTMLInputElement>(null);

  // Already in this room: straight to the photos.
  useEffect(() => {
    if (slug && isJoined) router.replace(`/e/${slug}/gallery`);
  }, [slug, isJoined, router]);

  const join = async (selfie: File | null) => {
    if (!slug) return;
    setBusy(true);
    setError(null);
    try {
      const consent = faceConsent && !!selfie;
      const session = await api.createSession(slug, name.trim(), consent);
      if (selfie && session.selfieUpload) {
        // Best effort: the guest can still join and shoot if the selfie fails.
        try {
          const put = await fetch(session.selfieUpload.url, {
            method: 'PUT',
            headers: session.selfieUpload.headers,
            body: await toJpeg(selfie, 1280),
          });
          if (put.ok) await api.completeSelfie(slug);
        } catch {
          /* selfie search on the "Photos of me" tab still works later */
        }
      }
      try {
        sessionStorage.setItem(JUST_JOINED_KEY, name.trim());
      } catch {
        /* the welcome is a nicety */
      }
      window.dispatchEvent(new Event(GUEST_JOINED_EVENT));
      router.replace(`/e/${slug}/gallery`);
    } catch (err) {
      setError(errorMessage(err, 'We couldn’t get you in. Please try again.'));
      setBusy(false);
    }
  };

  const onSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = '';
    if (file) void join(file);
  };

  const nameOk = name.trim().length > 0;

  if (roomError) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
        <Wordmark />
        <h1 className="mt-16 font-serif text-[40px] leading-none">We couldn’t find that event</h1>
        <p className="mt-3 text-[15px] text-ink-soft">{errorMessage(roomError)}</p>
        <JoinCodeForm className="mt-8" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-paper">
      <div className="relative h-[38vh] min-h-[240px] flex-none overflow-hidden bg-placeholder">
        {room?.coverUrl ? (
          <img src={room.coverUrl} alt="" className="h-full w-full animate-kenburns object-cover" />
        ) : (
          room && (
            <Image
              src={coverFor[room.type].src}
              alt=""
              fill
              sizes="(min-width: 448px) 448px, 100vw"
              placeholder="blur"
              priority
              className="animate-kenburns object-cover"
            />
          )
        )}
        <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1.5 shadow-print">
          <Wordmark className="text-[20px]" />
        </span>
      </div>

      <div className="relative -mt-6 flex flex-1 animate-rise flex-col gap-6 rounded-t-[22px] bg-paper px-6 pb-8 pt-7">
        <div>
          {isLoading ? (
            <>
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton mt-3 h-10 w-64 rounded" />
            </>
          ) : (
            room && (
              <>
                <p className="text-[13px] text-muted">{formatDate(room.date)}</p>
                <h1 className="mt-2 font-serif text-[44px] leading-none">{room.name}</h1>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {room.uploadsOpen
                    ? 'Share what you shoot, and find every photo you’re in.'
                    : 'Uploads are closed, but you can still find every photo you’re in.'}
                </p>
              </>
            )
          )}
        </div>

        {error && (
          <p role="alert" className="notice notice-error">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="guest-name" className="label">
            Your name
          </label>
          <input
            id="guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            autoComplete="given-name"
            placeholder="As friends know you"
            className="input"
          />
          <p className="hint">Shown on the live wall.</p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-rule bg-card p-4 text-[13px] leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            checked={faceConsent}
            onChange={(e) => setFaceConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-none accent-accent"
          />
          <span>
            Find photos of me with a selfie. It’s used only for this event and deleted 30 days after it ends.
          </span>
        </label>

        <div className="mt-auto space-y-1">
          {faceConsent ? (
            <>
              <button
                onClick={() => selfieInput.current?.click()}
                disabled={!room || !nameOk || busy}
                className="btn btn-primary w-full"
              >
                <CameraIcon />
                {busy ? 'Joining…' : 'Take a selfie and join'}
              </button>
              <button onClick={() => join(null)} disabled={!room || !nameOk || busy} className="btn btn-text w-full">
                Join without a selfie
              </button>
            </>
          ) : (
            <button onClick={() => join(null)} disabled={!room || !nameOk || busy} className="btn btn-primary w-full">
              {busy ? 'Joining…' : 'Join'}
            </button>
          )}
          <input
            ref={selfieInput}
            type="file"
            accept="image/*"
            capture="user"
            onChange={onSelfie}
            className="hidden"
          />
        </div>
      </div>
    </main>
  );
}
