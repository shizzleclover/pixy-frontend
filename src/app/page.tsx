import Image from 'next/image';
import Link from 'next/link';
import { API_BASE } from '@/lib/api/http';
import type { CatalogPackage } from '@/lib/api/types';
import { formatNaira } from '@/lib/format';
import { photos, reel } from '@/lib/photos';
import SiteHeader from '@/components/shared/site-header';
import JoinCodeForm from '@/components/shared/join-code-form';
import { Wordmark } from '@/components/shared/logo';
import { ArrowRightIcon } from '@/components/shared/icons';
import Print from '@/components/visual/print';
import PhotoMarquee from '@/components/visual/photo-marquee';
import Reveal from '@/components/visual/reveal';
import MagazineSpread from '@/components/visual/magazine-spread';

// Prices live in the backend catalog; refresh the page hourly.
export const revalidate = 3600;

async function getPackages(): Promise<CatalogPackage[]> {
  try {
    const res = await fetch(`${API_BASE}/catalog`, { next: { revalidate } });
    if (!res.ok) return [];
    return ((await res.json()) as { packages: CatalogPackage[] }).packages;
  } catch {
    return [];
  }
}

const FEATURE_LABELS: Record<string, string> = {
  magazine: 'Printed magazine',
  live_wall: 'Live wall',
  face_search: 'Find photos with a selfie',
  reels: 'Highlight reels',
  leaderboard: 'Leaderboard',
  hardcover_premium: 'Hardcover premium print',
  premium_templates: 'Premium templates',
  sponsor_branding: 'Sponsor branding',
  attendee_copy_orders: 'Attendees can order copies',
};

function packageLines(p: CatalogPackage): string[] {
  const lines = [p.imageCap ? `Up to ${p.imageCap.toLocaleString('en-NG')} photos` : 'Unlimited photos'];
  if (p.magazineCount > 0)
    lines.push(`${p.magazineCount} magazine${p.magazineCount === 1 ? '' : 's'}${p.pages ? `, ${p.pages} pages` : ''}`);
  for (const f of p.features) if (f !== 'magazine' && FEATURE_LABELS[f]) lines.push(FEATURE_LABELS[f]);
  return lines;
}

const STEPS = [
  {
    photo: photos.prints,
    title: 'You create the event',
    body: 'Pick a package and get a QR code for tables, stands and screens.',
  },
  {
    photo: photos.phoneCapture,
    title: 'Guests scan and shoot',
    body: 'No app and no login: a name, an optional selfie, then the camera. Photos wait and retry when the venue network drops.',
  },
  {
    photo: photos.guestsDancing,
    title: 'Everyone finds their photos',
    body: 'One selfie finds every photo a guest is in. The live wall shows the best of the night as it happens.',
  },
];

const OCCASIONS = [
  { photo: photos.yorubaCouple, title: 'Weddings', body: 'Every angle of the day, from the aisle to the after-party.' },
  { photo: photos.partyNight, title: 'Parties and owambes', body: 'The whole room shooting, the wall going wild.' },
  { photo: photos.speaker, title: 'Conferences', body: 'Talks, booths and hallway moments, with sponsor branding.' },
];

export default async function Home() {
  const packages = await getPackages();

  return (
    <>
      <SiteHeader />
      <main className="overflow-x-hidden">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pt-20">
          <div className="animate-rise">
            <p className="chip">
              <span className="live-dot" /> Launching at DevFest Ibadan
            </p>
            <h1 className="mt-6 font-serif text-[56px] leading-[0.95] sm:text-[84px]">
              Every photo from your event. <em className="text-accent">One printed magazine.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Guests scan a QR code, share photos from their phones and find every photo they’re in. Pixy turns the best
              ones into a magazine and delivers it to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/host/events/new" className="btn btn-primary">
                Create your event <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/#how" className="btn btn-secondary">
                How it works
              </Link>
            </div>
          </div>

          {/* A loose pile of prints */}
          <div className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[520px]" aria-hidden="true">
            <div className="absolute left-0 top-6 w-[52%] animate-drop [--tilt:0deg] [animation-delay:200ms]">
              <Print src={photos.coupleSmile} alt="" tilt={-7} sizes="240px" priority className="animate-float [animation-delay:0.5s]" />
            </div>
            <div className="absolute right-0 top-0 w-[50%] animate-drop [--tilt:0deg] [animation-delay:350ms]">
              <Print src={photos.partyNight} alt="" tilt={6} aspect="aspect-square" sizes="240px" priority className="animate-float [animation-delay:1.5s]" />
            </div>
            <div className="absolute bottom-0 left-[22%] w-[56%] animate-drop [--tilt:0deg] [animation-delay:500ms]">
              <Print
                src={photos.coupleDance}
                alt=""
                tilt={-2}
                aspect="aspect-[5/4]"
                caption="The first dance"
                sizes="260px"
                className="animate-float [animation-delay:3s]"
              />
            </div>
            <div className="absolute bottom-16 right-2 z-10 flex animate-pop items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm text-paper shadow-lift [animation-delay:1.1s]">
              <span className="live-dot" /> On the live wall
            </div>
          </div>
        </section>

        {/* Join box */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="flex flex-col gap-5 rounded-card border border-rule bg-card p-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-[30px] leading-tight">At an event right now?</p>
              <p className="mt-1 text-[15px] text-ink-soft">Enter the code on the table card or screen.</p>
            </div>
            <JoinCodeForm />
          </Reveal>
        </section>

        <PhotoMarquee items={reel} />

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="font-serif text-[48px] leading-none">How it works</h2>
          </Reveal>
          <ol className="mt-12 grid gap-12 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 120} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-placeholder">
                  <Image src={s.photo} alt="" fill sizes="(min-width: 768px) 360px, 100vw" placeholder="blur" className="zoom-img object-cover" />
                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper font-serif text-2xl text-accent">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* The magazine */}
        <section className="bg-card py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Reveal>
              <p className="eyebrow">The keepsake</p>
              <h2 className="mt-3 font-serif text-[48px] leading-none">A magazine of your day, not a group-chat dump</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
                We pick the sharpest, happiest shots from everyone’s phones, lay them out page by page, and print it. You
                approve it before it goes to press, and it arrives at your door.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <MagazineSpread />
            </Reveal>
          </div>
        </section>

        {/* Occasions */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="font-serif text-[48px] leading-none">Made for Nigerian events</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {OCCASIONS.map((o, i) => (
              <Reveal key={o.title} delay={i * 120} className="group relative aspect-[4/5] overflow-hidden rounded-card bg-ink">
                <Image src={o.photo} alt="" fill sizes="(min-width: 768px) 360px, 100vw" placeholder="blur" className="zoom-img object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6 pt-20 text-paper">
                  <h3 className="font-serif text-[34px] leading-none">{o.title}</h3>
                  <p className="mt-2 text-[15px] text-paper/85">{o.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {packages.length > 0 && (
          <section id="pricing" className="scroll-mt-8 border-t border-rule bg-card">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
              <Reveal>
                <h2 className="font-serif text-[48px] leading-none">Packages</h2>
                <p className="mt-3 text-[15px] text-ink-soft">
                  One payment per event, in naira. Extra copies and delivery are added at checkout.
                </p>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {packages.map((p, i) => (
                  <Reveal
                    key={p.code}
                    delay={i * 100}
                    className="flex flex-col rounded-card border border-rule bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-2 font-serif text-[40px] leading-none">{formatNaira(p.priceKobo)}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-[15px] text-ink-soft">
                      {packageLines(p).map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                          {line}
                        </li>
                      ))}
                    </ul>
                    <Link href="/host/events/new" className="btn btn-secondary btn-sm mt-6">
                      Start with {p.name.split(' ')[0]}
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Closing call to action */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0 grid grid-cols-3 opacity-30 sm:grid-cols-6" aria-hidden="true">
            {reel.slice(0, 6).map((p, i) => (
              <div key={i} className="relative">
                <Image src={p.src} alt="" fill sizes="20vw" className="object-cover grayscale" />
              </div>
            ))}
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
            <Reveal>
              <h2 className="mx-auto max-w-3xl font-serif text-[48px] leading-none sm:text-[64px]">
                Your next event deserves more than a group chat
              </h2>
              <Link href="/host/events/new" className="btn btn-primary mt-8">
                Create your event <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <Wordmark className="text-[22px]" />
          <span>Arcturian Limited · Lagos and Ibadan</span>
          <Link href="/login" className="hover:text-ink">
            Host sign in
          </Link>
        </div>
      </footer>
    </>
  );
}
