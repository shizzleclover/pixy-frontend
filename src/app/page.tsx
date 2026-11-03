import Link from 'next/link';
import { API_BASE } from '@/lib/api/http';
import type { CatalogPackage } from '@/lib/api/types';
import { formatNaira } from '@/lib/format';
import SiteHeader from '@/components/shared/site-header';
import JoinCodeForm from '@/components/shared/join-code-form';
import { Wordmark } from '@/components/shared/logo';

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

const STEPS = [
  {
    title: 'You create the event',
    body: 'Pick a package and get a QR code for tables, stands and screens.',
  },
  {
    title: 'Guests scan and shoot',
    body: 'No app and no login: a name, an optional selfie, then the camera. Photos wait and retry when the venue network drops.',
  },
  {
    title: 'We make the magazine',
    body: 'The best shots are chosen and laid out for you. You approve it, we print it and deliver it.',
  },
];

function packageLines(p: CatalogPackage): string[] {
  const lines = [p.imageCap ? `Up to ${p.imageCap.toLocaleString('en-NG')} photos` : 'Unlimited photos'];
  if (p.magazineCount > 0)
    lines.push(`${p.magazineCount} magazine${p.magazineCount === 1 ? '' : 's'}${p.pages ? `, ${p.pages} pages` : ''}`);
  for (const f of p.features) if (f !== 'magazine' && FEATURE_LABELS[f]) lines.push(FEATURE_LABELS[f]);
  return lines;
}

export default async function Home() {
  const packages = await getPackages();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:pt-24">
          <div>
            <h1 className="font-serif text-[56px] leading-[0.95] sm:text-[80px]">
              Every photo from your event. <em className="text-accent">One printed magazine.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Guests scan a QR code, share photos from their phones and find every photo they’re in. Pixy turns the best
              ones into a magazine and delivers it to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/host/events/new" className="btn btn-primary">
                Create your event
              </Link>
              <Link href="/#how" className="btn btn-secondary">
                How it works
              </Link>
            </div>
          </div>
          <div className="self-end border-t border-ink pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="font-serif text-[30px] leading-tight">At an event right now?</p>
            <p className="mt-2 text-[15px] text-ink-soft">Enter the code on the table card or screen.</p>
            <JoinCodeForm className="mt-5" />
          </div>
        </section>

        <section id="how" className="border-t border-rule">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-serif text-[44px] leading-none">How it works</h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="border-t border-ink pt-5">
                  <span className="font-serif text-[40px] leading-none text-accent">{i + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {packages.length > 0 && (
          <section id="pricing" className="border-t border-rule bg-card">
            <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
              <h2 className="font-serif text-[44px] leading-none">Packages</h2>
              <p className="mt-3 text-[15px] text-ink-soft">One payment per event, in naira. Extra copies and delivery are added at checkout.</p>
              <div className="mt-10 grid gap-px overflow-hidden rounded-card border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
                {packages.map((p) => (
                  <div key={p.code} className="flex flex-col bg-paper p-6">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-2 text-3xl font-semibold">{formatNaira(p.priceKobo)}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-[15px] text-ink-soft">
                      {packageLines(p).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <Link href="/host/events/new" className="btn btn-secondary btn-sm mt-6">
                      Start with {p.name.split(' ')[0]}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
