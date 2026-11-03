'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRoom } from '@/hooks/use-room';
import { CameraIcon } from '@/components/shared/icons';

/** Slim top bar, the three photo tabs, and the floating shutter. */
export function RoomHeader({ slug }: { slug: string }) {
  const { data: room } = useRoom(slug);
  const pathname = usePathname();

  const tabs = [
    { href: `/e/${slug}/gallery`, label: 'Everyone' },
    { href: `/e/${slug}/me`, label: 'Photos of me' },
    { href: `/e/${slug}/mine`, label: 'Mine' },
  ];

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-rule bg-paper">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
        <div className="min-w-0">
          <p className="truncate font-serif text-[22px] leading-tight">{room?.name ?? ' '}</p>
          {room && !room.uploadsOpen && <p className="text-xs text-muted">Uploads are closed</p>}
        </div>
        {room?.wallEnabled && (
          <Link href={`/wall/${slug}`} className="flex-none text-sm font-medium underline underline-offset-4">
            Live wall
          </Link>
        )}
      </div>
      <nav className="mx-auto flex max-w-3xl gap-6 px-4" aria-label="Photos">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`-mb-px border-b-2 py-3 text-[15px] ${
                active ? 'border-accent font-semibold text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function Shutter({ slug }: { slug: string }) {
  const { data: room } = useRoom(slug);
  if (room && !room.uploadsOpen) return null;
  return (
    <div className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pt-3">
      <Link
        href={`/e/${slug}/upload`}
        aria-label="Take a photo"
        className="pointer-events-auto flex h-[76px] w-[76px] items-center justify-center rounded-full border-4 border-card bg-accent text-white shadow-[0_0_0_1px_#D6CEC2] transition-colors hover:bg-accent-hover"
      >
        <CameraIcon className="h-8 w-8" />
      </Link>
    </div>
  );
}
