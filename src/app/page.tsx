import Link from 'next/link';
import Logo from '@/components/shared/logo';
import JoinCodeForm from '@/components/shared/join-code-form';

const HERO_IMAGES = {
  dance:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Nigerian%20wedding%20guests%20celebrating%20on%20a%20dance%20floor%20at%20night%2C%20colourful%20aso-ebi%20outfits%2C%20confetti%2C%20warm%20party%20lights%2C%20candid%20documentary%20photograph&image_size=portrait_4_3',
  couple:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Elegant%20Nigerian%20bride%20and%20groom%20portrait%20at%20an%20outdoor%20evening%20reception%2C%20golden%20hour%2C%20joyful%2C%20editorial%20photography&image_size=square_hd',
  conference:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Large%20tech%20conference%20audience%20in%20Ibadan%20Nigeria%20smiling%20and%20taking%20photos%20with%20their%20phones%2C%20warm%20stage%20lighting&image_size=square_hd',
};

const STEPS = [
  {
    n: '01',
    title: 'Host creates the event',
    body: 'Pick a package, pay with Paystack and get a QR code plus printable signage for tables, stands and screens.',
    accent: 'from-brand-500/20 to-brand-500/0',
  },
  {
    n: '02',
    title: 'Guests scan and shoot',
    body: 'No app, no login. A name and a selfie, then the camera. Uploads queue and retry on shaky venue networks.',
    accent: 'from-iris-500/20 to-iris-500/0',
  },
  {
    n: '03',
    title: 'The magazine is built',
    body: 'Best shots are picked and laid out automatically. The host approves, we print and deliver to the door.',
    accent: 'from-sun-500/20 to-sun-500/0',
  },
];

const FEATURES = [
  {
    icon: '📷',
    title: 'QR upload, zero friction',
    body: 'Guests land in the room from a scan or a 6-character code and start uploading in seconds. Works on 3G.',
  },
  {
    icon: '🧠',
    title: 'Find every photo you’re in',
    body: 'One selfie becomes their event profile and their face reference — their personal gallery fills up as others upload.',
  },
  {
    icon: '📺',
    title: 'Live wall + leaderboard',
    body: 'A full-screen slideshow for the venue projector. New uploads appear in real time and top uploaders get the spotlight.',
  },
  {
    icon: '📶',
    title: 'Survives bad network',
    body: 'Photos compress on the phone, upload direct to storage and queue in IndexedDB. Interrupted? It resumes on return.',
  },
  {
    icon: '🖼️',
    title: 'Custom event frames',
    body: 'Branded overlays with names, dates and monograms — the thing Snap and Instagram can’t do for your event.',
  },
  {
    icon: '📖',
    title: 'Auto magazine, auto delivery',
    body: 'Dedupe, blur and quality scoring pick the best shots, fill a print-ready template and send the job to our printer.',
  },
];

const PACKAGES = [
  {
    name: 'Party',
    price: '75,000',
    cap: '1,000 images',
    includes: ['1 magazine · 24pp', 'Live wall', 'Face search'],
    featured: false,
  },
  {
    name: 'Owambe',
    price: '200,000',
    cap: '3,000 images',
    includes: ['2 magazines · 40pp', 'Reels + live wall', 'Leaderboard'],
    featured: true,
  },
  {
    name: 'Signature',
    price: '450,000',
    cap: '8,000 images',
    includes: ['3 hardcover premium', 'Reels + premium templates', 'Priority delivery'],
    featured: false,
  },
  {
    name: 'Corporate',
    price: 'From 250,000',
    cap: 'Unlimited images',
    includes: ['Sponsor branding', 'Attendee copy orders', 'Standee + screen slides'],
    featured: false,
  },
];

const FACTS = [
  { value: '< 10s', label: 'to join and shoot' },
  { value: '0', label: 'apps to install' },
  { value: '9', label: 'steps from payment to print' },
  { value: '100%', label: 'hands-off magazine' },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="glow-blob -left-24 top-0 h-72 w-72 animate-pulse-glow bg-brand-500/30" />
        <div className="glow-blob -right-20 top-24 h-80 w-80 animate-pulse-glow bg-iris-500/25 [animation-delay:1.5s]" />

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="badge badge-brand animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              Launching at DevFest Ibadan
            </span>

            <h1 className="mt-6 animate-fade-up font-display text-4xl font-extrabold leading-[1.05] text-white animate-delay-1 sm:text-5xl lg:text-6xl">
              Every photo from your event.
              <span className="block text-gradient">One printed magazine.</span>
            </h1>

            <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-slate-400 animate-delay-2">
              Guests scan a QR code, upload from their phones and find every photo they’re in with a
              single selfie. Pixy lays the best shots into a print-ready magazine and delivers it to
              the host — no one designing pages by hand.
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 animate-delay-3">
              <Link href="/host/events/new" className="btn btn-primary btn-lg">
                Create your event
                <span aria-hidden>→</span>
              </Link>
              <Link href="/#how" className="btn btn-secondary btn-lg">
                See how it works
              </Link>
            </div>

            <div className="mt-8 max-w-lg animate-fade-up animate-delay-4">
              <p className="label">Got a code from your host?</p>
              <JoinCodeForm />
            </div>

            <dl className="mt-12 grid animate-fade-up grid-cols-2 gap-6 animate-delay-5 sm:grid-cols-4">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="font-display text-2xl font-bold text-white">{f.value}</dt>
                  <dd className="mt-1 text-xs text-slate-500">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Collage */}
          <div className="relative animate-scale-in animate-delay-2">
            <div className="absolute inset-6 rounded-[3rem] bg-brand-gradient opacity-25 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="relative col-span-2 overflow-hidden rounded-4xl border border-white/10 shadow-card">
                <img src={HERO_IMAGES.dance} alt="Guests celebrating at a Nigerian event" className="h-56 w-full object-cover sm:h-72" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4">
                  <span className="badge badge-live">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> Live wall · 412 photos
                  </span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-4xl border border-white/10 shadow-card">
                <img src={HERO_IMAGES.couple} alt="Bride and groom portrait" className="h-44 w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-4xl border border-white/10 shadow-card">
                <img src={HERO_IMAGES.conference} alt="Conference audience" className="h-44 w-full object-cover" />
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 hidden animate-float items-center gap-3 rounded-3xl border border-white/10 bg-ink-900/90 px-4 py-3 shadow-card backdrop-blur-xl sm:flex">
              <span className="icon-tile">🏆</span>
              <div>
                <p className="text-xs text-slate-400">Top uploader</p>
                <p className="text-sm font-semibold text-white">Tolu · 128 photos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <span className="badge">The flow</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Nine steps. No human in the loop.
          </h2>
          <p className="mt-3 text-slate-400">
            From payment to a magazine at the door, the pipeline runs itself. These are the three
            moments that matter.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className={`card card-hover relative overflow-hidden animate-fade-up animate-delay-${i + 1}`}>
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${s.accent}`} />
              <div className="relative">
                <span className="font-display text-4xl font-extrabold text-white/15">{s.n}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <span className="badge">Why it lands</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Built for the way Nigerian events actually run.
          </h2>
          <p className="mt-3 text-slate-400">
            FOMO is the hook. Live walls, leaderboards and personal copies give every guest a reason
            to shoot — and to outdo the last party.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`card card-hover animate-fade-up animate-delay-${(i % 5) + 1}`}>
              <span className="icon-tile">{f.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ Live wall */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          <div className="glow-blob -right-10 -top-10 h-64 w-64 bg-brand-500/30" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="badge badge-live">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> Real time
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                The live wall makes it a party the room can watch.
              </h2>
              <p className="mt-4 text-slate-400">
                Point the venue projector at a single URL. Photos stream in over SSE as guests upload,
                with a moderator able to pull anything off the wall in one tap.
              </p>
              <Link href="/host/events/new" className="btn btn-primary mt-6">
                Get your wall running
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[HERO_IMAGES.couple, HERO_IMAGES.conference, HERO_IMAGES.dance, HERO_IMAGES.conference, HERO_IMAGES.couple, HERO_IMAGES.dance].map(
                (src, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-2xl border border-white/10 animate-fade-in"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <span className="badge">Packages</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Image credits with the magazine baked in.
          </h2>
          <p className="mt-3 text-slate-400">
            Prices in Naira. Add-ons like extra copies, guest mini mags and delivery tiers stack on top.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {PACKAGES.map((p, i) => (
            <div
              key={p.name}
              className={`card card-hover relative flex flex-col animate-fade-up animate-delay-${i + 1} ${
                p.featured ? 'border-brand-400/40 bg-brand-500/[0.07] shadow-glow' : ''
              }`}
            >
              {p.featured && (
                <span className="badge badge-brand absolute -top-3 left-6">Most popular</span>
              )}
              <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-3">
                <span className="font-display text-3xl font-extrabold text-white">₦{p.price}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{p.cap}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-400">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-400">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/host/events/new"
                className={`btn mt-6 w-full ${p.featured ? 'btn-primary' : 'btn-secondary'}`}
              >
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-5xl border border-white/10 bg-brand-gradient-soft p-10 text-center shadow-card sm:p-16">
          <div className="glow-blob left-1/2 top-0 h-64 w-64 -translate-x-1/2 bg-brand-500/40" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
              Your next event deserves a magazine, not a group chat dump.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Set up a room, share the code and watch the wall fill up. Printing is our problem.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/host/events/new" className="btn btn-primary btn-lg">
                Create your event
              </Link>
              <Link href="/login" className="btn btn-secondary btn-lg">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- Footer */}
      <footer className="border-t border-white/[0.07] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Logo size="sm" />
            <p className="text-xs text-slate-500">Built by Arcturian Limited · Lagos & Ibadan, Nigeria</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link href="/#how" className="hover:text-white">How it works</Link>
            <Link href="/#pricing" className="hover:text-white">Pricing</Link>
            <Link href="/login" className="hover:text-white">Host login</Link>
            <span className="text-slate-600">© {new Date().getFullYear()} Pixy.ng</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
