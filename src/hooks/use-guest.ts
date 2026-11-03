'use client';

import { useSyncExternalStore } from 'react';
import { GUEST_EXPIRED_EVENT, guestTokens } from '@/lib/api/http';

/** Fired by the join page after storing a token, so open hooks update. */
export const GUEST_JOINED_EVENT = 'pixy:guest-joined';

function subscribe(onChange: () => void) {
  window.addEventListener(GUEST_EXPIRED_EVENT, onChange);
  window.addEventListener(GUEST_JOINED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(GUEST_EXPIRED_EVENT, onChange);
    window.removeEventListener(GUEST_JOINED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * The guest session for one event. `loading` is true only before hydration;
 * a 401 from the API clears the token, so `isJoined` flips to false.
 */
export function useGuest(slug: string) {
  const token = useSyncExternalStore(
    subscribe,
    () => guestTokens.get(slug),
    () => undefined,
  );
  return { token: token ?? null, loading: token === undefined, isJoined: !!token };
}
