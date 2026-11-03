import Link from 'next/link';

/** The wordmark: "pixy" in the serif, with a tomato full stop. */
export function Wordmark({ className = 'text-[28px]' }: { className?: string }) {
  return (
    <span className={`font-serif leading-none text-ink ${className}`}>
      pixy<span className="text-accent">.</span>
    </span>
  );
}

export default function Logo({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} aria-label="Pixy home" className="inline-flex items-center">
      <Wordmark className={className} />
    </Link>
  );
}
