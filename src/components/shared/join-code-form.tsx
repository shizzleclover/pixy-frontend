'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function JoinCodeForm({
  size = 'md',
  className = '',
}: {
  size?: 'md' | 'lg';
  className?: string;
}) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.trim().replace(/\s+/g, '');
    if (!value) return;
    setBusy(true);
    router.push(`/e/${encodeURIComponent(value.toUpperCase())}`);
  };

  return (
    <form onSubmit={submit} className={`flex w-full items-center gap-2 ${className}`}>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter join code e.g. DVF26K"
        aria-label="Event join code"
        maxLength={12}
        className={`input flex-1 font-mono uppercase tracking-[0.2em] ${
          size === 'lg' ? 'input-lg' : ''
        }`}
      />
      <button type="submit" disabled={busy || !code.trim()} className={`btn btn-secondary ${size === 'lg' ? 'btn-lg' : ''}`}>
        {busy ? 'Opening…' : 'Join'}
      </button>
    </form>
  );
}
