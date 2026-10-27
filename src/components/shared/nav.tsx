'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './logo';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Guest rooms and the live wall are distraction-free surfaces.
  const hidden = pathname?.startsWith('/e/') || pathname?.startsWith('/wall/');
  if (hidden) return null;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.07] bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/#how" className="nav-link">
            How it works
          </Link>
          <Link href="/#features" className="nav-link">
            Features
          </Link>
          <Link href="/#pricing" className="nav-link">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
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
