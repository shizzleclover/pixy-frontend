'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toJpeg } from '@/lib/media/compress';
import { PermanentUploadError, uploadPhoto } from '@/lib/media/upload';
import { enqueue, markAttempt, pendingFor, remove } from '@/lib/storage/upload-queue';

const RETRY_EVERY_MS = 20_000;

export interface UploadQueueState {
  /** Photos sent this visit. */
  sent: number;
  /** Photos stored on the phone, waiting to send. */
  waiting: number;
  sending: boolean;
  /** The last photo that was refused, and why. */
  refused: string | null;
}

/**
 * Captured photos go into IndexedDB first, then upload one at a time. The
 * queue drains on load, when the phone comes back online and every 20 s, so a
 * photo taken without signal still arrives.
 */
export function useUploadQueue(slug: string) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<UploadQueueState>({ sent: 0, waiting: 0, sending: false, refused: null });
  const draining = useRef(false);

  const refreshWaiting = useCallback(async () => {
    const waiting = (await pendingFor(slug)).length;
    setState((s) => ({ ...s, waiting }));
  }, [slug]);

  const drain = useCallback(async () => {
    if (draining.current) return;
    draining.current = true;
    setState((s) => ({ ...s, sending: true }));
    let sentAny = false;
    try {
      for (const item of await pendingFor(slug)) {
        try {
          await uploadPhoto(slug, item.blob);
          await remove(item.id);
          sentAny = true;
          setState((s) => ({ ...s, sent: s.sent + 1 }));
        } catch (err) {
          if (err instanceof PermanentUploadError) {
            await remove(item.id);
            setState((s) => ({ ...s, refused: err.message }));
            if (err.code === 'UPLOADS_CLOSED') break;
          } else {
            // Offline or the server is struggling: keep it and stop for now.
            await markAttempt(item);
            break;
          }
        }
        await refreshWaiting();
      }
    } finally {
      draining.current = false;
      setState((s) => ({ ...s, sending: false }));
      await refreshWaiting();
      if (sentAny) {
        void queryClient.invalidateQueries({ queryKey: ['me', slug] });
        void queryClient.invalidateQueries({ queryKey: ['gallery', slug] });
      }
    }
  }, [slug, refreshWaiting, queryClient]);

  /** Compress, store, then try to send. Throws if the phone can't read the photo. */
  const add = useCallback(
    async (files: File[]) => {
      setState((s) => ({ ...s, refused: null }));
      for (const file of files) await enqueue(slug, await toJpeg(file));
      await refreshWaiting();
      void drain();
    },
    [slug, refreshWaiting, drain],
  );

  useEffect(() => {
    void drain();
    const onOnline = () => void drain();
    window.addEventListener('online', onOnline);
    const timer = setInterval(() => void drain(), RETRY_EVERY_MS);
    return () => {
      window.removeEventListener('online', onOnline);
      clearInterval(timer);
    };
  }, [drain]);

  return { ...state, add };
}
