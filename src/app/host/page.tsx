'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Event } from '@/lib/api/types';
import { useAuth } from '@/hooks/use-auth';
import DashboardHeader from '@/components/shared/dashboard-header';
import EmptyState from '@/components/shared/empty-state';

const TYPE_ICONS: Record<string, string> = {
  wedding: '💍',
  party: '🎉',
  conference: '🎤',
  other: '✨',
};

/** The host list returns the raw event, so mirror the backend's uploadsOpen rule. */
function isLive(e: Event): boolean {
  if (typeof e.uploadsOpen === 'boolean') return e.uploadsOpen;
  if (e.status !== 'active' || !e.startsAt || !e.endsAt) return false;
  const now = Date.now();
  return now >= Date.parse(e.startsAt) && now <= Date.parse(e.endsAt);
}

export default function HostDashboard() {
  const { token, loading, signOut } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-events'],
    queryFn: () => api.getMyEvents(),
    enabled: !!token,
  });

  const events = data ?? [];
  const live = events.filter(isLive).length;

  if (loading || !token) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="skeleton h-28 w-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader
        title="My events"
        subtitle="Create, run and print"
        onSignOut={signOut}
        actions={
          <Link href="/host/events/new" className="btn btn-primary btn-sm">
            + New event
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Total events</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{events.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Live now</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{live}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Wall enabled</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {events.filter((e) => e.wallEnabled).length}
            </p>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg font-semibold text-white">Your events</h2>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-44" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon="⚠️"
            title="We couldn’t load your events"
            body="Check your connection and try again. If it keeps failing, sign out and back in."
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon="🎪"
            title="No events yet"
            body="Create your first event, pick a package and share the QR with your guests."
            action={
              <Link href="/host/events/new" className="btn btn-primary">
                Create your first event
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev, i) => (
              <Link
                key={ev.id}
                href={`/host/events/${ev.id}`}
                className={`card card-hover group relative overflow-hidden p-0 animate-fade-up animate-delay-${(i % 5) + 1}`}
              >
                <div className="relative h-32 overflow-hidden bg-brand-gradient-soft">
                  {ev.coverUrl ? (
                    <img src={ev.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      {TYPE_ICONS[ev.type] ?? '✨'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
                  <span className="badge absolute left-4 top-4 bg-ink-950/70">
                    {TYPE_ICONS[ev.type] ?? '✨'} {ev.type}
                  </span>
                  {isLive(ev) && (
                    <span className="badge badge-live absolute right-4 top-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> Live
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="truncate font-display text-lg font-bold text-white">{ev.name}</h3>
                  <p className="mt-1 truncate font-mono text-xs text-slate-500">/e/{ev.slug}</p>
                  <p className="mt-3 text-xs text-slate-400 transition group-hover:text-brand-200">
                    Open dashboard →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
