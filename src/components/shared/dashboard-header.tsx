'use client';

import Link from 'next/link';
import Logo from '@/components/shared/logo';

export default function DashboardHeader({
  title,
  subtitle,
  homeHref = '/host',
  actions,
  onSignOut,
}: {
  title: string;
  subtitle?: string;
  homeHref?: string;
  actions?: React.ReactNode;
  onSignOut?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-4">
          <Logo href={homeHref} size="sm" />
          <span className="hidden h-6 w-px bg-white/10 sm:block" />
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold text-white">{title}</p>
            {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {onSignOut && (
            <button onClick={onSignOut} className="btn btn-ghost btn-sm">
              Sign out
            </button>
          )}
          <Link href="/" className="btn btn-secondary btn-sm">
            Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 sm:hidden sm:px-6">
        <p className="font-display text-sm font-bold text-white">{title}</p>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
    </header>
  );
}
