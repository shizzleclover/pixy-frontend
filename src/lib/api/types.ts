/** Shapes from the Pixy API (see its OpenAPI at /docs-json). */

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'host' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export type EventType = 'wedding' | 'party' | 'conference' | 'other';
export type EventStatus = 'draft' | 'active' | 'closed' | 'archived';

/** `GET /e/:slugOrCode`: what a guest sees. Only active and closed events. */
export interface RoomEvent {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  date: string;
  coverUrl: string | null;
  uploadsOpen: boolean;
  wallEnabled: boolean;
}

/** `GET /events`, `GET /events/:id`: the host's full event. */
export interface HostEvent {
  id: string;
  slug: string;
  joinCode: string;
  name: string;
  type: EventType;
  status: EventStatus;
  date: string;
  venue: string | null;
  packageCode: string | null;
  startsAt: string;
  endsAt: string;
  uploadCap: number;
  wallEnabled: boolean;
  wallDelaySec: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  name: string;
  type: EventType;
  date: string;
  venue?: string;
  startsAt: string;
  endsAt: string;
}

export interface EventStats {
  uploads: { total: number; byStatus: Record<string, number> };
  guests: number;
  storageBytes: number;
  onWall: number;
}

export interface AdminOverview {
  revenueToday: { kobo: number; orders: number };
  revenueLast7Days: { kobo: number; orders: number };
  activeEvents: number;
  uploadsToday: number;
  openPrintJobs: Record<string, number>;
  printJobsWithoutPrinter: number;
  ordersInReview: number;
}

export interface Guest {
  id: string;
  displayName: string;
  pfpUrl: string | null;
  uploadCount: number;
  hasPhone: boolean;
}

export interface SessionResponse {
  token: string;
  guest: Guest;
  /** Only when faceConsent was true: PUT the selfie here, then call selfie-complete. */
  selfieUpload?: { url: string; key: string; headers: Record<string, string> };
}

export type MediaKind = 'photo' | 'video';

/** A gallery or "photos of me" item. Urls are signed and expire. */
export interface MediaItem {
  id: string;
  type: MediaKind;
  thumbUrl: string;
  url: string;
  takenAt: string | null;
  guest?: { displayName: string | null };
}

/** A guest's own upload, which may still be processing. */
export interface MyUpload {
  id: string;
  type: MediaKind;
  thumbUrl: string;
  url: string;
  status: 'uploading' | 'processing' | 'ready' | 'hidden' | 'rejected';
  takenAt: string | null;
  createdAt: string;
}

export interface MeResponse {
  guest: Guest;
  uploads: MyUpload[];
  uploadsNextCursor: string | null;
  photosOfMe: MediaItem[];
  photosOfMeNextCursor: string | null;
}

/** Live wall item (SSE `init`/`add`). Has no `type`: videos aren't told apart yet. */
export interface WallItem {
  id: string;
  thumbUrl: string;
  url: string;
  takenAt: string | null;
  guest: { displayName: string | null; pfpUrl: string | null };
}

export interface LeaderboardEntry {
  displayName: string;
  pfpUrl: string | null;
  uploadCount: number;
}

export interface PresignFile {
  contentType: string;
  bytes: number;
  kind: MediaKind;
}

export interface PresignItem {
  mediaId: string;
  uploadUrl: string;
  headers: Record<string, string>;
  framedUploadUrl?: string;
  framedHeaders?: Record<string, string>;
}

export type CompleteItem =
  | { mediaId: string; status: 'processing'; framed: boolean }
  | { mediaId: string; error: { code: string; message: string } };

/** `GET /catalog`: active packages, cheapest first. Prices in kobo. */
export interface CatalogPackage {
  code: string;
  name: string;
  priceKobo: number;
  /** null = unlimited */
  imageCap: number | null;
  magazineCount: number;
  pages: number | null;
  features: string[];
}
