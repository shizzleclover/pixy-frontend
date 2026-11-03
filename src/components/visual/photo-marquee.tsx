import type { Photo } from '@/lib/photos';
import Print from './print';

const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5];

/** An endless strip of prints drifting sideways. Pauses on hover. */
export default function PhotoMarquee({ items }: { items: Photo[] }) {
  // Two copies side by side; the animation moves exactly one copy's width.
  const strip = [...items, ...items];
  return (
    <div className="group relative overflow-hidden py-8" aria-label="Photos from events">
      <div className="flex w-max animate-drift gap-6 group-hover:[animation-play-state:paused]">
        {strip.map((p, i) => (
          <Print
            key={i}
            src={p.src}
            alt={i < items.length ? p.alt : ''}
            tilt={TILTS[i % TILTS.length]}
            sizes="200px"
            className="w-40 flex-none sm:w-52"
          />
        ))}
      </div>
    </div>
  );
}
