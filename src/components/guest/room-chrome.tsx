'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { LogoMark } from '@/components/shared/logo';

function CameraIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l.9-1.4A2 2 0 0 1 9.3 3.7h5.4a2 2 0 0 1 1.7.9l.9 1.4h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" strokeLinejoin="round" />
      <circle cx="12" cy="12.3" r="3.2" />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={active ? 2 : 1.7}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

export function RoomHeader({ slug }: { slug: string }) {
  const { data } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => api.getEvent(slug),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/e/${slug}`} className="flex min-w-0 items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold text-white">
              {data?.name ?? 'Event room'}
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              {data && data.uploadsOpen === false ? 'Uploads are closed' : 'Uploads are open'}
            </span>
          </span>
        </Link>

        <Link href={`/wall/${slug}`} className="btn btn-secondary btn-sm flex-none">
          Live wall
        </Link>
      </div>
    </header>
  );
}

export function RoomNav({ slug }: { slug: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/e/${slug}/upload`, label: 'Camera', icon: CameraIcon, match: '/upload' },
    { href: `/e/${slug}/gallery`, label: 'Gallery', icon: GridIcon, match: '/gallery' },
    { href: `/e/${slug}/me`, label: 'My photos', icon: UserIcon, match: '/me' },
  ];

  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4">
      <div className="pointer-events-auto mb-2 flex w-full max-w-md items-center gap-1 rounded-full border border-white/10 bg-ink-900/85 p-1.5 shadow-card backdrop-blur-xl">
        {tabs.map((tab) => {
          const active = pathname?.endsWith(tab.match) ?? false;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2.5 text-[11px] font-medium transition ${
                active ? 'bg-brand-gradient text-white shadow-glow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon active={active} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
