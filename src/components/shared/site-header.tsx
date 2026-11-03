import Link from 'next/link';
import Logo from './logo';

/** Header for the public pages (home, login). */
export default function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/#how" className="hidden px-3 py-2 text-sm text-muted hover:text-ink sm:inline">
            How it works
          </Link>
          <Link href="/#pricing" className="hidden px-3 py-2 text-sm text-muted hover:text-ink sm:inline">
            Pricing
          </Link>
          <Link href="/login" className="px-3 py-2 text-sm font-medium hover:text-accent">
            Sign in
          </Link>
          <Link href="/host/events/new" className="btn btn-primary btn-sm">
            Create event
          </Link>
        </div>
      </nav>
    </header>
  );
}
