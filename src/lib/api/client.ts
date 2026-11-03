import { API_BASE, guestTokens, hostTokens, request, requestBlob } from './http';
import type {
  AdminOverview,
  AuthTokens,
  CompleteItem,
  CreateEventInput,
  EventStats,
  Guest,
  HostEvent,
  LeaderboardEntry,
  MediaItem,
  MeResponse,
  Page,
  PresignFile,
  PresignItem,
  RoomEvent,
  SessionResponse,
  User,
} from './types';

const host = { kind: 'host' } as const;
const guest = (slug: string) => ({ kind: 'guest', slug }) as const;
const enc = encodeURIComponent;

export const api = {
  /* ------------------------------------------------------------ guest room */

  getRoom: (slugOrCode: string) => request<RoomEvent>(`/e/${enc(slugOrCode)}`),

  /** Creates the guest and stores their token under the event's slug. */
  async createSession(slug: string, name: string, faceConsent: boolean): Promise<SessionResponse> {
    const res = await request<SessionResponse>(`/e/${enc(slug)}/session`, {
      method: 'POST',
      body: { name, faceConsent },
    });
    guestTokens.set(slug, res.token);
    return res;
  },

  /** Call after PUTting the selfie: sets the pfp and starts face indexing. */
  completeSelfie: (slug: string) =>
    request<Guest>(`/e/${enc(slug)}/session/selfie-complete`, { method: 'POST', auth: guest(slug) }),

  presignUploads: (slug: string, files: PresignFile[]) =>
    request<{ items: PresignItem[] }>(`/e/${enc(slug)}/uploads/presign`, {
      method: 'POST',
      body: { files },
      auth: guest(slug),
    }),

  completeUploads: (slug: string, items: Array<{ mediaId: string; framed: boolean }>) =>
    request<{ items: CompleteItem[] }>(`/e/${enc(slug)}/uploads/complete`, {
      method: 'POST',
      body: { items },
      auth: guest(slug),
    }),

  getGallery: (slug: string, cursor?: string | null) =>
    request<Page<MediaItem>>(`/e/${enc(slug)}/media`, { query: { cursor }, auth: guest(slug) }),

  getMe: (slug: string, cursors: { uploads?: string | null; photosOfMe?: string | null } = {}) =>
    request<MeResponse>(`/e/${enc(slug)}/me`, {
      query: { cursor: cursors.uploads, photosOfMeCursor: cursors.photosOfMe },
      auth: guest(slug),
    }),

  getLeaderboard: (slug: string) => request<LeaderboardEntry[]>(`/e/${enc(slug)}/leaderboard`),

  /** SSE stream for the projector; public, so no auth header is needed. */
  wallUrl: (slug: string) => `${API_BASE}/e/${enc(slug)}/wall`,

  /* ------------------------------------------------------------ host auth */

  requestOtp: (email: string) =>
    request<void>('/auth/otp/request', { method: 'POST', body: { email } }),

  async verifyOtp(email: string, code: string): Promise<AuthTokens> {
    const res = await request<AuthTokens>('/auth/otp/verify', { method: 'POST', body: { email, code } });
    hostTokens.set(res.accessToken, res.refreshToken);
    return res;
  },

  async signOut(): Promise<void> {
    const refreshToken = hostTokens.refresh();
    if (refreshToken)
      await request<void>('/auth/logout', { method: 'POST', body: { refreshToken } }).catch(() => undefined);
    hostTokens.clear();
  },

  getCurrentUser: () => request<User>('/me', { auth: host }),

  /* ---------------------------------------------------------- host events */

  listMyEvents: (cursor?: string | null) =>
    request<Page<HostEvent>>('/events', { query: { cursor }, auth: host }),

  getEvent: (id: string) => request<HostEvent>(`/events/${enc(id)}`, { auth: host }),

  getEventStats: (id: string) => request<EventStats>(`/events/${enc(id)}/stats`, { auth: host }),

  /** The event's join QR (points at its short link) as an image. */
  getEventQr: (id: string, format: 'svg' | 'png' = 'svg') =>
    requestBlob(`/events/${enc(id)}/qr`, { query: { format }, auth: host }),

  createEvent: (data: CreateEventInput) =>
    request<HostEvent>('/events', { method: 'POST', body: data, auth: host }),

  /* ---------------------------------------------------------------- admin */

  getAdminOverview: () => request<AdminOverview>('/admin/overview', { auth: host }),
};
