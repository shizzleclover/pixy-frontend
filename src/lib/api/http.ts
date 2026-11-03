/**
 * The one way the app talks to the Pixy API: JSON in and out, the backend's
 * `{ error: { code, message } }` shape turned into ApiError, host tokens
 * refreshed once on 401, expired guest sessions cleared.
 */

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    /** HTTP status; 0 when the request never got a response (offline, CORS, DNS). */
    readonly status: number,
    readonly code: string,
    message: string,
    /** The API's x-request-id, to quote in bug reports. */
    readonly requestId: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isApiError = (err: unknown): err is ApiError => err instanceof ApiError;

/* ----------------------------------------------------------- host tokens */

const ACCESS_KEY = 'pixy_token';
const REFRESH_KEY = 'pixy_refresh';
export const SIGNED_OUT_EVENT = 'pixy:signed-out';

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode or blocked storage: the session just won't persist */
  }
}

export const hostTokens = {
  access: () => storageGet(ACCESS_KEY),
  refresh: () => storageGet(REFRESH_KEY),
  set(access: string, refresh: string) {
    storageSet(ACCESS_KEY, access);
    storageSet(REFRESH_KEY, refresh);
  },
  clear() {
    storageSet(ACCESS_KEY, null);
    storageSet(REFRESH_KEY, null);
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
  },
};

let refreshing: Promise<boolean> | null = null;

/** Swaps the refresh token for new tokens. Concurrent 401s share one call. */
function refreshHostTokens(): Promise<boolean> {
  refreshing ??= (async () => {
    const refreshToken = hostTokens.refresh();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const body: { accessToken: string; refreshToken: string } = await res.json();
      hostTokens.set(body.accessToken, body.refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/* ---------------------------------------------------------- guest tokens */

export const GUEST_EXPIRED_EVENT = 'pixy:guest-expired';
const guestKey = (slug: string) => `pixy_guest_${slug.toLowerCase()}`;

export const guestTokens = {
  get: (slug: string) => storageGet(guestKey(slug)),
  set: (slug: string, token: string) => storageSet(guestKey(slug), token),
  clear(slug: string) {
    storageSet(guestKey(slug), null);
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent(GUEST_EXPIRED_EVENT, { detail: { slug } }));
  },
};

/* ---------------------------------------------------------------- request */

export type Auth = { kind: 'none' } | { kind: 'host' } | { kind: 'guest'; slug: string };

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** Sent as JSON, unless it's FormData. */
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  auth?: Auth;
  signal?: AbortSignal;
}

function authHeader(auth: Auth): string | null {
  if (auth.kind === 'host') {
    const token = hostTokens.access();
    return token ? `Bearer ${token}` : null;
  }
  if (auth.kind === 'guest') {
    const token = guestTokens.get(auth.slug);
    return token ? `Guest ${token}` : null;
  }
  return null;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(query ?? {}))
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  return url.toString();
}

async function send(path: string, opts: RequestOptions, auth: Auth): Promise<Response> {
  const headers: Record<string, string> = {};
  const header = authHeader(auth);
  if (header) headers.Authorization = header;
  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) body = opts.body;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  try {
    return await fetch(buildUrl(path, opts.query), {
      method: opts.method ?? 'GET',
      headers,
      body,
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err;
    throw new ApiError(0, 'NETWORK', 'Couldn’t reach Pixy. Check your connection and try again.');
  }
}

async function toApiError(res: Response): Promise<ApiError> {
  const requestId = res.headers.get('x-request-id');
  let code = `HTTP_${res.status}`;
  let message = res.statusText || 'Something went wrong';
  try {
    const body = await res.json();
    if (body?.error?.code) code = body.error.code;
    if (body?.error?.message) message = body.error.message;
  } catch {
    /* not JSON */
  }
  return new ApiError(res.status, code, message, requestId);
}

/** Sends with auth, refreshing or clearing tokens on 401; throws ApiError unless 2xx. */
async function perform(path: string, opts: RequestOptions): Promise<Response> {
  const auth = opts.auth ?? { kind: 'none' };
  let res = await send(path, opts, auth);

  if (res.status === 401 && auth.kind === 'host') {
    if (await refreshHostTokens()) res = await send(path, opts, auth);
    if (res.status === 401) hostTokens.clear();
  } else if (res.status === 401 && auth.kind === 'guest') {
    guestTokens.clear(auth.slug);
  }

  if (!res.ok) throw await toApiError(res);
  return res;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await perform(path, opts);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** For non-JSON responses such as images. */
export async function requestBlob(path: string, opts: RequestOptions = {}): Promise<Blob> {
  return (await perform(path, opts)).blob();
}
