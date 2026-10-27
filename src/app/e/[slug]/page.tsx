'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { LogoMark } from '@/components/shared/logo';

type Step = 'info' | 'name' | 'selfie' | 'done';

const STEP_ORDER: Step[] = ['info', 'name', 'selfie'];

export default function JoinRoom() {
  const { slug } = useParams<{ slug: string }>();
  const [step, setStep] = useState<Step>('info');
  const [event, setEvent] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [name, setName] = useState('');
  const [faceConsent, setFaceConsent] = useState(true);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    api
      .getEvent(slug)
      .then((data) => active && setEvent(data))
      .catch(() => active && setError('We couldn’t find this event. Check the link or join code.'))
      .finally(() => active && setLoadingEvent(false));
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const prettyDate = useMemo(() => {
    if (!event?.date) return null;
    const d = new Date(event.date);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [event?.date]);

  const onPickSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelfie(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const join = async (withSelfie: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const chosen = withSelfie && faceConsent ? selfie : null;
      const data = await api.createSession(
        slug,
        name.trim() || 'Guest',
        faceConsent,
        chosen ? { contentType: chosen.type || 'image/jpeg', bytes: chosen.size } : undefined
      );
      localStorage.setItem(`pixy_guest_${slug}`, data.token);

      // Best effort: store the event pfp, then finalise it so face matching works.
      if (chosen && data.selfieUpload) {
        try {
          const put = await fetch(data.selfieUpload.url, {
            method: 'PUT',
            headers: data.selfieUpload.headers,
            body: chosen,
          });
          if (put.ok) await api.completeSelfie(slug, data.token);
        } catch {
          /* non-blocking — guest can still shoot */
        }
      }

      setStep('done');
    } catch {
      setError('Something went wrong joining the room. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="glow-blob -left-24 top-10 h-72 w-72 animate-pulse-glow bg-brand-500/25" />
      <div className="glow-blob -right-20 bottom-0 h-72 w-72 animate-pulse-glow bg-iris-500/25 [animation-delay:1.2s]" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {step === 'done' ? 'You’re in' : 'Join the room'}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">
            {loadingEvent ? 'Loading event…' : event?.name ?? 'Event room'}
          </h1>
          {!loadingEvent && (event?.venue || prettyDate) && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {prettyDate && <span className="chip text-xs">📅 {prettyDate}</span>}
              {event?.venue && <span className="chip text-xs">📍 {event.venue}</span>}
            </div>
          )}
        </div>

        {step !== 'done' && (
          <div className="mb-5 flex items-center gap-2">
            {STEP_ORDER.map((s, i) => (
              <span
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? 'bg-brand-gradient' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        )}

        <div className="card animate-fade-up p-6">
          {error && (
            <p className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {step === 'info' && (
            <div className="text-center">
              <span className="icon-tile mx-auto h-14 w-14 text-2xl">📸</span>
              <h2 className="mt-4 text-xl font-semibold text-white">Everyone’s photos, one place</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Upload from your phone, then find every photo you’re in with a selfie. No app, no login.
              </p>
              <button
                onClick={() => setStep('name')}
                disabled={loadingEvent || !!error}
                className="btn btn-primary btn-lg mt-6 w-full"
              >
                {loadingEvent ? 'Loading…' : 'Continue'}
              </button>
            </div>
          )}

          {step === 'name' && (
            <div>
              <h2 className="text-xl font-semibold text-white">What should we call you?</h2>
              <p className="mt-1.5 text-sm text-slate-400">This shows on the live wall and leaderboard.</p>

              <div className="mt-5">
                <label className="label" htmlFor="guest-name">
                  Your name
                </label>
                <input
                  id="guest-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-lg"
                  placeholder="e.g. Tolu"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep('selfie')}
                />
              </div>

              <button
                onClick={() => setStep('selfie')}
                disabled={!name.trim()}
                className="btn btn-primary btn-lg mt-5 w-full"
              >
                Next
              </button>
            </div>
          )}

          {step === 'selfie' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Add a selfie{faceConsent ? '' : ' (optional)'}</h2>
              <p className="mt-1.5 text-sm text-slate-400">
                It becomes your event profile picture and finds every photo you’re in.
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => selfieInputRef.current?.click()}
                  className="group relative h-36 w-36 overflow-hidden rounded-full border-2 border-dashed border-white/15 bg-white/[0.03] transition hover:border-brand-400/60"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Your selfie" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="text-3xl">🤳</span>
                      <span className="text-xs font-medium">Tap to take a selfie</span>
                    </span>
                  )}
                  {previewUrl && (
                    <span className="absolute inset-x-0 bottom-0 bg-ink-950/70 py-1.5 text-[11px] font-medium text-white">
                      Retake
                    </span>
                  )}
                </button>
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={onPickSelfie}
                  className="hidden"
                />
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left">
                <input
                  type="checkbox"
                  checked={faceConsent}
                  onChange={(e) => {
                    setFaceConsent(e.target.checked);
                    if (!e.target.checked) setSelfie(null);
                  }}
                  className="mt-0.5 h-4 w-4 flex-none accent-brand-500"
                />
                <span className="text-xs leading-relaxed text-slate-400">
                  Allow face matching to build my photo gallery. Your selfie is used only inside this
                  event, never shared, and deleted 30 days after it closes.
                </span>
              </label>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => join(true)}
                  disabled={busy || (faceConsent && !selfie)}
                  className="btn btn-primary btn-lg w-full"
                >
                  {busy ? 'Joining…' : 'Join & start shooting'}
                </button>
                <button onClick={() => join(false)} disabled={busy} className="btn btn-ghost w-full text-sm">
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-3xl shadow-glow">
                🎉
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-white">Welcome, {name.trim() || 'Guest'}!</h2>
              <p className="mt-2 text-sm text-slate-400">
                You’re in {event?.name ?? 'the room'}. Start shooting — your photos appear on the wall
                and in your gallery.
              </p>
              <div className="mt-6 space-y-2.5">
                <Link href={`/e/${slug}/upload`} className="btn btn-primary btn-lg w-full">
                  Open the camera
                </Link>
                <Link href={`/e/${slug}/gallery`} className="btn btn-secondary w-full">
                  Browse the gallery
                </Link>
                <Link href={`/wall/${slug}`} className="btn btn-ghost w-full text-sm">
                  Watch the live wall
                </Link>
              </div>
            </div>
          )}
        </div>

        {step !== 'done' && (
          <p className="mt-5 text-center text-xs text-slate-600">
            By joining you agree to our photo consent and privacy policy.
          </p>
        )}
      </div>
    </main>
  );
}
