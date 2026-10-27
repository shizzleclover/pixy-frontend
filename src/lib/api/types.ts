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

export type EventType = 'wedding' | 'party' | 'conference' | 'other';
export type EventStatus = 'draft' | 'active' | 'closed' | 'archived';

/**
 * The host endpoints (`/events`, `/events/:id`) return the raw event document;
 * the public room route (`/e/:slug`) returns a trimmed view with `coverUrl` and
 * a computed `uploadsOpen`. Fields unique to either shape are optional here.
 */
export interface Event {
  id: string;
  slug: string;
  name: string;
  type: EventType;
  date: string;
  venue?: string | null;
  joinCode?: string;
  status?: EventStatus;
  /** Upload window; `uploadsOpen` is derived from these when absent. */
  startsAt?: string;
  endsAt?: string;
  /** Room route only. */
  coverUrl?: string | null;
  /** Room route only. */
  uploadsOpen?: boolean;
  wallEnabled?: boolean;
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
}

export interface SessionResponse {
  token: string;
  guest: Guest;
  selfieUpload?: {
    url: string;
    key: string;
    headers: Record<string, string>;
  };
}

export interface MediaItem {
  id: string;
  url: string;
  thumbUrl?: string;
  type: 'photo' | 'video';
  onWall?: boolean;
}

export interface LeaderboardEntry {
  displayName: string;
  pfpUrl: string | null;
  uploadCount: number;
}

export interface PresignItem {
  mediaId: string;
  uploadUrl: string;
  key: string;
  headers: Record<string, string>;
}

export interface PresignResponse {
  items: PresignItem[];
}

export interface CompleteResponse {
  items: Array<{
    mediaId: string;
    status: string;
    duplicateOf?: string;
  }>;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
