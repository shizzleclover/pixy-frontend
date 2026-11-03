import Image from 'next/image';
import { photos } from '@/lib/photos';

/** An open printed magazine, laid out the way Pixy lays out an event. Illustrative. */
export default function MagazineSpread() {
  return (
    <div className="group mx-auto w-full max-w-3xl [perspective:1600px]">
      <div className="relative grid grid-cols-2 shadow-lift transition-transform duration-700 [transform:rotateX(14deg)_rotateZ(-2deg)] group-hover:[transform:rotateX(4deg)_rotateZ(0deg)]">
        {/* Left page: a full-bleed photo with a headline */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink">
          <Image src={photos.coupleDance} alt="" fill sizes="(min-width: 768px) 380px, 50vw" placeholder="blur" className="object-cover opacity-90" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-12 sm:p-6 sm:pt-16">
            <p className="text-[10px] uppercase tracking-[0.2em] text-paper/80 sm:text-xs">Chapter one</p>
            <p className="mt-1 font-serif text-2xl leading-none text-paper sm:text-4xl">The first dance</p>
          </div>
        </div>
        {/* Right page: a grid of guests' shots */}
        <div className="relative grid aspect-[3/4] grid-cols-2 grid-rows-3 gap-1.5 bg-card p-3 sm:gap-2 sm:p-5">
          {[photos.guestsDancing, photos.coupleSmile, photos.partyNight, photos.couplePortrait].map((src, i) => (
            <div key={i} className={`relative overflow-hidden bg-placeholder ${i === 0 ? 'col-span-2' : ''} ${i === 3 ? 'col-span-2' : ''}`}>
              <Image src={src} alt="" fill sizes="(min-width: 768px) 200px, 25vw" placeholder="blur" className="object-cover" />
            </div>
          ))}
          <span className="absolute bottom-1 right-3 font-serif text-xs text-muted">14</span>
        </div>
        {/* The fold between the pages */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(26,23,20,0.18),transparent)]" />
      </div>
    </div>
  );
}
