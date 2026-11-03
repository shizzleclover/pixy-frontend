'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, PlayIcon } from '@/components/shared/icons';

export type GridItem = { id: string; thumbUrl: string; url: string; type?: 'photo' | 'video'; caption?: string };

/** Edge-to-edge three-column grid with a full-screen viewer. */
export default function PhotoGrid({ items }: { items: GridItem[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, step]);

  const active = index === null ? null : items[index];

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 md:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setIndex(i)}
            aria-label={item.caption ? `Open photo by ${item.caption}` : 'Open photo'}
            className="group relative aspect-square animate-pop overflow-hidden bg-placeholder"
            style={{ animationDelay: `${Math.min(i % 30, 12) * 40}ms` }}
          >
            <img
              src={item.thumbUrl}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.type === 'video' && (
              <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white">
                <PlayIcon className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex flex-col bg-ink text-paper"
          onClick={close}
        >
          <div className="safe-top flex h-14 flex-none items-center justify-between px-2">
            <span className="px-2 text-sm text-muted-light">{active.caption ?? ''}</span>
            <button onClick={close} aria-label="Close" className="flex h-11 w-11 items-center justify-center">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6">
            {active.type === 'video' ? (
              <video
                src={active.url}
                controls
                playsInline
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full"
              />
            ) : (
              <img
                key={active.id}
                src={active.url}
                alt=""
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full animate-pop object-contain"
              />
            )}
            {items.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous photo"
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next photo"
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink/60"
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 md:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton aspect-square" />
      ))}
    </div>
  );
}
