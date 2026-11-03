import { isApiError } from './http';

/** Copy for the error codes people actually hit; otherwise the API's message. */
const MESSAGES: Record<string, string> = {
  NETWORK: 'Couldn’t reach Pixy. Check your connection and try again.',
  RATE_LIMITED: 'Too many tries. Wait a few minutes, then try again.',
  EVENT_NOT_FOUND: 'We couldn’t find this event. Check the link or join code.',
  INVALID_CODE: 'That code didn’t work. Check it, or send a new one.',
  UPLOADS_CLOSED: 'Uploads are closed for this event.',
  UNAUTHORIZED: 'Your session has ended. Please sign in again.',
};

/** A sentence to show the person, plus the request id when there is one. */
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!isApiError(err)) return fallback;
  const text = MESSAGES[err.code] ?? (err.status >= 500 ? fallback : err.message || fallback);
  return err.requestId && err.status >= 500 ? `${text} (ref ${err.requestId.slice(0, 8)})` : text;
}
