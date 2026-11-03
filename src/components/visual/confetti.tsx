'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#C93A22', '#1A1714', '#E9B44C', '#F2B8A8', '#FFFFFF'];

type Piece = { left: number; dx: number; spin: number; dur: number; delay: number; color: string; w: number; h: number };

/** A short burst of paper confetti over the page. Renders nothing with reduced motion. */
export default function Confetti({ count = 70, onDone }: { count?: number; onDone?: () => void }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onDone?.();
    setPieces(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 200,
        spin: (Math.random() - 0.5) * 1440,
        dur: 2.2 + Math.random() * 1.8,
        delay: Math.random() * 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
      })),
    );
    const t = setTimeout(() => {
      setPieces(null);
      onDone?.();
    }, 4800);
    return () => clearTimeout(t);
  }, [count, onDone]);

  if (!pieces) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block animate-confetti rounded-[1px]"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.color,
              boxShadow: p.color === '#FFFFFF' ? '0 0 0 1px #E8E2D9' : undefined,
              '--dx': `${p.dx}px`,
              '--spin': `${p.spin}deg`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
