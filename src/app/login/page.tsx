'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { LogoMark } from '@/components/shared/logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.requestOtp(email.trim());
      setStep('code');
    } catch {
      setError('We couldn’t send a code to that email. Check it and try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await api.verifyOtp(email.trim(), code.trim());
      localStorage.setItem('pixy_token', data.accessToken);
      localStorage.setItem('pixy_refresh', data.refreshToken);
      window.location.href = data.user?.role === 'admin' ? '/admin' : '/host';
    } catch {
      setError('That code didn’t work. Request a fresh one and try again.');
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="glow-blob -left-24 top-10 h-72 w-72 animate-pulse-glow bg-brand-500/25" />
      <div className="glow-blob -right-24 bottom-10 h-72 w-72 animate-pulse-glow bg-iris-500/25 [animation-delay:1.2s]" />

      <div className="relative w-full max-w-md">
        <div className="mb-7 flex flex-col items-center text-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 font-display text-2xl font-bold text-white">
            {step === 'email' ? 'Sign in to Pixy' : 'Check your inbox'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {step === 'email'
              ? 'Hosts and admins sign in with a one-time code. No passwords.'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        <div className="card animate-fade-up p-6">
          {error && (
            <p className="mb-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          {step === 'email' ? (
            <>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-lg"
                placeholder="you@example.com"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && email.trim() && requestOtp()}
              />
              <button
                onClick={requestOtp}
                disabled={busy || !email.trim()}
                className="btn btn-primary btn-lg mt-5 w-full"
              >
                {busy ? 'Sending…' : 'Send me a code'}
              </button>
            </>
          ) : (
            <>
              <label className="label" htmlFor="otp">
                One-time code
              </label>
              <input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input input-lg text-center font-mono text-2xl tracking-[0.5em]"
                placeholder="000000"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && verifyOtp()}
              />
              <button
                onClick={verifyOtp}
                disabled={busy || code.length < 4}
                className="btn btn-primary btn-lg mt-5 w-full"
              >
                {busy ? 'Verifying…' : 'Verify & continue'}
              </button>
              <div className="mt-4 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setError(null);
                  }}
                  className="text-slate-400 transition hover:text-white"
                >
                  ← Change email
                </button>
                <button onClick={requestOtp} disabled={busy} className="text-brand-300 transition hover:text-white">
                  Resend code
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Hosting an event?{' '}
          <Link href="/host/events/new" className="text-brand-300 hover:text-white">
            Create one instead
          </Link>
        </p>
      </div>
    </main>
  );
}
