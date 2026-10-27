import Link from 'next/link';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-2xl bg-brand-gradient shadow-glow ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%] text-white" fill="none" aria-hidden="true">
        <path
          d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.1l.9-1.4A2 2 0 0 1 10.2 3.7h3.6a2 2 0 0 1 1.7.9L16.4 6h1.1A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12.4" r="3.1" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

export default function Logo({
  href = '/',
  size = 'md',
  withWordmark = true,
}: {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
}) {
  const mark = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const text = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <LogoMark className={`${mark} transition-transform duration-300 group-hover:rotate-6`} />
      {withWordmark && (
        <span className={`${text} font-display font-bold tracking-tight text-white`}>
          Pixy
          <span className="text-gradient">.ng</span>
        </span>
      )}
    </Link>
  );
}
