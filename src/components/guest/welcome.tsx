'use client';

import { useCallback, useEffect, useState } from 'react';
import Confetti from '@/components/visual/confetti';

/** Set by the join page; read once by the first room page after joining. */
export const JUST_JOINED_KEY = 'pixy:just-joined';

/** Confetti and a short hello, once, right after a guest joins. */
export default function Welcome() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const joined = sessionStorage.getItem(JUST_JOINED_KEY);
      if (joined !== null) {
        sessionStorage.removeItem(JUST_JOINED_KEY);
        setName(joined || 'friend');
      }
    } catch {
      /* storage blocked: no welcome */
    }
  }, []);

  const done = useCallback(() => setName(null), []);
  if (name === null) return null;

  return (
    <>
      <Confetti onDone={done} />
      <div
        role="status"
        className="fixed inset-x-4 top-24 z-50 mx-auto max-w-sm animate-pop rounded-card bg-ink px-5 py-4 text-paper shadow-lift"
      >
        <p className="font-serif text-[26px] leading-tight">You’re in, {name}!</p>
        <p className="mt-1 text-sm text-paper/80">Tap the camera to share your first photo.</p>
      </div>
    </>
  );
}
