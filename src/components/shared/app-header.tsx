'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './logo';

type NavItem = { href: string; label: string };

/** Header for signed-in host and admin pages. */
export default function AppHeader({
  nav,
  email,
  onSignOut,
  homeHref = '/host',
}: {
  nav: NavItem[];
  email?: string | null;
  onSignOut: () => void;
  homeHref?: string;
}) {
  const pathname = usePathname();
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-6 sm:gap-8">
          <Logo href={homeHref} />
          <nav className="flex items-center gap-5">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-sm ${active ? 'font-semibold text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email && <span className="hidden text-sm text-muted sm:inline">{email}</span>}
          <button onClick={onSignOut} className="text-sm font-medium underline underline-offset-4 hover:text-accent">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
