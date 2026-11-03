'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** Goes to /e/<code>; the room page swaps the code for the event's slug. */
export default function JoinCodeForm({ className = '' }: { className?: string }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.replace(/\s+/g, '').toUpperCase();
    if (!value) return;
    setBusy(true);
    router.push(`/e/${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={submit} className={`flex w-full max-w-sm items-end gap-2 ${className}`}>
      <div className="flex-1">
        <label htmlFor="join-code" className="label">
          Join code
        </label>
        <input
          id="join-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. DVF26K"
          autoCapitalize="characters"
          autoComplete="off"
          maxLength={12}
          className="input font-semibold tracking-[0.2em] placeholder:font-normal placeholder:tracking-normal"
        />
      </div>
      <button type="submit" disabled={busy || !code.trim()} className="btn btn-secondary">
        {busy ? 'Opening…' : 'Join'}
      </button>
    </form>
  );
}
