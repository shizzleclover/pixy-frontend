import type { 
  AdminOverview,
  AuthTokens, 
  CreateEventInput,
  Event, 
  EventStats,
  SessionResponse, 
  PresignResponse, 
  CompleteResponse,
  MediaItem,
  LeaderboardEntry,
  Guest
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

class ApiClient {
  private getHeaders(includeAuth = false, guestToken?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (includeAuth && typeof window !== "undefined") {
      const token = localStorage.getItem("pixy_token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (guestToken) {
      headers["Authorization"] = `Guest ${guestToken}`;
    }
    
    return headers;
  }

  async getEvent(slugOrCode: string): Promise<Event> {
    const res = await fetch(`${API_BASE}/e/${slugOrCode}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async createSession(
    slug: string,
    name: string,
    faceConsent: boolean,
    selfie?: { contentType: string; bytes: number }
  ): Promise<SessionResponse> {
    const body: Record<string, unknown> = { name, faceConsent };
    if (selfie) body.selfie = selfie;

    const res = await fetch(`${API_BASE}/e/${slug}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  /**
   * Must be called after PUTting the selfie to `selfieUpload.url` — it is what
   * sets the guest's pfp and enqueues face indexing.
   */
  async completeSelfie(slug: string, guestToken: string): Promise<Guest> {
    const res = await fetch(`${API_BASE}/e/${slug}/session/selfie-complete`, {
      method: "POST",
      headers: this.getHeaders(false, guestToken),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  getGuestToken(slug: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(`pixy_guest_${slug}`);
  }

  async presignUploads(slug: string, guestToken: string, files: Array<{ contentType: string, bytes: number, kind: 'photo' | 'video' }>): Promise<PresignResponse> {
    const res = await fetch(`${API_BASE}/e/${slug}/uploads/presign`, {
      method: "POST",
      headers: this.getHeaders(false, guestToken),
      body: JSON.stringify({ files }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async completeUploads(slug: string, guestToken: string, items: Array<{ mediaId: string, framed: boolean }>): Promise<CompleteResponse> {
    const res = await fetch(`${API_BASE}/e/${slug}/uploads/complete`, {
      method: "POST",
      headers: this.getHeaders(false, guestToken),
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async getGallery(slug: string, guestToken: string, cursor?: string): Promise<{ items: MediaItem[], nextCursor: string | null }> {
    const url = cursor ? `${API_BASE}/e/${slug}/media?cursor=${cursor}` : `${API_BASE}/e/${slug}/media`;
    const res = await fetch(url, {
      headers: this.getHeaders(false, guestToken),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async getMe(slug: string, guestToken: string): Promise<{ guest: Guest, uploads: MediaItem[], photosOfMe: MediaItem[] }> {
    const res = await fetch(`${API_BASE}/e/${slug}/me`, {
      headers: this.getHeaders(false, guestToken),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async getLeaderboard(slug: string): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${API_BASE}/e/${slug}/leaderboard`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async requestOtp(email: string): Promise<void> {
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
  }

  async verifyOtp(email: string, code: string): Promise<AuthTokens> {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  /** `GET /events` is paginated; the dashboard shows the first page. */
  async getMyEvents(): Promise<Event[]> {
    const res = await fetch(`${API_BASE}/events`, {
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const page: { items?: Event[] } = await res.json();
    return page.items ?? [];
  }

  async getEventDetail(id: string): Promise<Event> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async getEventStats(id: string): Promise<EventStats> {
    const res = await fetch(`${API_BASE}/events/${id}/stats`, {
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async createEvent(data: CreateEventInput): Promise<Event> {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  async getAdminOverview(): Promise<AdminOverview> {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  getWallUrl(slug: string): string {
    return `${API_BASE}/e/${slug}/wall`;
  }
}

export const api = new ApiClient();
