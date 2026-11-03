import type { StaticImageData } from 'next/image';
import type { EventType } from './api/types';
import audience from '@/assets/photos/audience.jpg';
import coupleBlue from '@/assets/photos/couple-blue.jpg';
import coupleDance from '@/assets/photos/couple-dance.jpg';
import coupleEmbrace from '@/assets/photos/couple-embrace.jpg';
import couplePortrait from '@/assets/photos/couple-portrait.jpg';
import coupleSmile from '@/assets/photos/couple-smile.jpg';
import guestsDancing from '@/assets/photos/guests-dancing.jpg';
import partyNight from '@/assets/photos/party-night.jpg';
import phoneCapture from '@/assets/photos/phone-capture.jpg';
import prints from '@/assets/photos/prints.jpg';
import speaker from '@/assets/photos/speaker.jpg';
import yorubaCouple from '@/assets/photos/yoruba-couple.jpg';

/**
 * Stock photos (Pexels, see src/assets/photos/CREDITS.md) for marketing and
 * decoration. Never shown as if they were an event's own photos.
 */
export const photos = {
  audience,
  coupleBlue,
  coupleDance,
  coupleEmbrace,
  couplePortrait,
  coupleSmile,
  guestsDancing,
  partyNight,
  phoneCapture,
  prints,
  speaker,
  yorubaCouple,
} satisfies Record<string, StaticImageData>;

export type Photo = { src: StaticImageData; alt: string };

/** A reel for the scrolling strip on the home page. */
export const reel: Photo[] = [
  { src: partyNight, alt: 'Guests celebrating at a night party' },
  { src: coupleDance, alt: 'A couple dancing at their wedding' },
  { src: speaker, alt: 'A speaker at a conference' },
  { src: yorubaCouple, alt: 'A Yoruba couple at their traditional wedding' },
  { src: guestsDancing, alt: 'Guests dancing outdoors' },
  { src: coupleSmile, alt: 'A smiling couple' },
  { src: audience, alt: 'A conference audience' },
  { src: couplePortrait, alt: 'A couple in traditional attire' },
  { src: phoneCapture, alt: 'A guest filming on a phone' },
  { src: coupleEmbrace, alt: 'A couple embracing' },
];

/** A fallback cover for an event without its own, by type. */
export const coverFor: Record<EventType, Photo> = {
  wedding: { src: yorubaCouple, alt: '' },
  party: { src: partyNight, alt: '' },
  conference: { src: audience, alt: '' },
  other: { src: guestsDancing, alt: '' },
};
