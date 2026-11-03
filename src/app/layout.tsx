import type { Metadata, Viewport } from 'next';
import { DM_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/lib/query-client';

// Self-hosted at build time: no request to Google from guests' phones.
const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pixy.ng'),
  title: {
    default: 'Pixy: every photo from your event, one printed magazine',
    template: '%s · Pixy',
  },
  description:
    'Guests scan a QR code, share photos from their phones and find every photo they’re in. Pixy turns the best shots into a printed magazine for the host.',
  openGraph: {
    title: 'Pixy: every photo from your event, one printed magazine',
    description: 'QR photo sharing, selfie search, a live wall and a printed magazine. Built for Nigerian events.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
