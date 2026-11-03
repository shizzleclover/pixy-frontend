import type { EventStatus } from './api/types';

const LAGOS = 'Africa/Lagos';

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-NG', { timeZone: LAGOS, ...opts });
}

export function formatTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleTimeString('en-NG', { timeZone: LAGOS, hour: 'numeric', minute: '2-digit' });
}

export function formatNaira(kobo: number) {
  return `₦${Math.round(kobo / 100).toLocaleString('en-NG')}`;
}

export function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${i === 0 || value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  draft: 'Draft',
  active: 'Live',
  closed: 'Closed',
  archived: 'Archived',
};
