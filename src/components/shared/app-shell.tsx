'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/api/types';
import AppHeader from './app-header';

const HOST_NAV = [{ href: '/host', label: 'Events' }];
const ADMIN_NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/host', label: 'My events' },
];

/** Signed-in page frame: checks the session (and role), then the header. */
export default function AppShell({
  role,
  children,
}: {
  /** Required role; hosts' pages are open to admins too. */
  role?: User['role'];
  children: (user: User) => React.ReactNode;
}) {
  const { user, loading, forbidden, signOut } = useAuth({ role });
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-dvh">
      <AppHeader
        nav={isAdmin ? ADMIN_NAV : HOST_NAV}
        email={user?.email}
        onSignOut={signOut}
        homeHref={isAdmin ? '/admin' : '/host'}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {loading ? (
          <div className="space-y-4" aria-busy="true">
            <div className="skeleton h-10 w-72 rounded" />
            <div className="skeleton h-32 w-full rounded-card" />
          </div>
        ) : forbidden ? (
          <div className="py-16">
            <h1 className="font-serif text-[40px] leading-none">Not available</h1>
            <p className="mt-3 text-[15px] text-ink-soft">This page needs an admin account.</p>
            <Link href="/host" className="btn btn-secondary mt-6">
              Go to my events
            </Link>
          </div>
        ) : user ? (
          children(user)
        ) : null}
      </main>
    </div>
  );
}
