import Image, { type StaticImageData } from 'next/image';

/** A photo printed with a white border, tilted a little, like it was dropped on a table. */
export default function Print({
  src,
  alt,
  tilt = 0,
  caption,
  sizes = '240px',
  aspect = 'aspect-[4/5]',
  hover = true,
  priority,
  className = '',
  style,
}: {
  src: StaticImageData | string;
  alt: string;
  tilt?: number;
  caption?: string;
  sizes?: string;
  aspect?: string;
  hover?: boolean;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure
      className={`print m-0 ${hover ? 'print-hover' : ''} ${caption ? '' : 'pb-2'} ${className}`}
      style={{ '--tilt': `${tilt}deg`, ...style } as React.CSSProperties}
    >
      <div className={`relative overflow-hidden bg-placeholder ${aspect}`}>
        {typeof src === 'string' ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            placeholder="blur"
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
      {caption && <figcaption className="print-caption">{caption}</figcaption>}
    </figure>
  );
}
