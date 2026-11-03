'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import Image from 'next/image';
import { photos } from '@/lib/photos';
import SiteHeader from '@/components/shared/site-header';
import Print from '@/components/visual/print';

/** Only same-site paths, so ?next= can't send people elsewhere. */
function safeNext(next: string | null): string | null {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : null;
}

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.requestOtp(email.trim());
      setStep('code');
    } catch (err) {
      setError(errorMessage(err, 'We couldn’t send a code. Check the email and try again.'));
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { user } = await api.verifyOtp(email.trim(), code);
      router.replace(next ?? (user.role === 'admin' ? '/admin' : '/host'));
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-rise">
      <h1 className="font-serif text-[44px] leading-none">{step === 'email' ? 'Sign in' : 'Check your email'}</h1>
      <p className="mt-3 text-[15px] text-ink-soft">
        {step === 'email' ? 'For hosts. We’ll email you a 6-digit code; no password.' : `We sent a 6-digit code to ${email}.`}
      </p>

      {error && (
        <p role="alert" className="notice notice-error mt-6">
          {error}
        </p>
      )}

      {step === 'email' ? (
        <form onSubmit={requestOtp} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoFocus
              required
            />
          </div>
          <button type="submit" disabled={busy || !email.trim()} className="btn btn-primary w-full">
            {busy ? 'Sending…' : 'Email me a code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-8 space-y-6">
          <div>
            <label htmlFor="otp" className="label">
              Code
            </label>
            <input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="input text-center text-2xl font-semibold tracking-[0.5em]"
              autoFocus
            />
          </div>
          <button type="submit" disabled={busy || code.length !== 6} className="btn btn-primary w-full">
            {busy ? 'Checking…' : 'Sign in'}
          </button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError(null);
              }}
              className="underline underline-offset-4"
            >
              Use another email
            </button>
            <button type="button" onClick={() => requestOtp()} disabled={busy} className="underline underline-offset-4">
              Send a new code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="grid flex-1 lg:grid-cols-2">
        <div className="flex items-start justify-center px-6 py-14 lg:items-center">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <div className="relative hidden overflow-hidden bg-ink lg:block" aria-hidden="true">
          <Image src={photos.coupleEmbrace} alt="" fill sizes="50vw" placeholder="blur" className="animate-kenburns object-cover opacity-80" />
          <div className="absolute bottom-10 left-10 w-56 animate-drop [--tilt:0deg] [animation-delay:400ms]">
            <Print src={photos.coupleSmile} alt="" tilt={-5} caption="Saved for good" sizes="224px" hover={false} />
          </div>
        </div>
      </div>
    </main>
  );
}
