'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useAuth } from '@/hooks/use-auth';
import DashboardHeader from '@/components/shared/dashboard-header';

function ActionCard({
  icon,
  title,
  body,
  children,
}: {
  icon: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card card-hover">
      <span className="icon-tile">{icon}</span>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{body}</p>
      {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** i;
  return `${i === 0 || value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { token, loading, signOut } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-detail', id],
    queryFn: () => api.getEventDetail(id),
    enabled: !!token,
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['event-stats', id],
    queryFn: () => api.getEventStats(id),
    enabled: !!token,
    retry: false,
  });

  if (loading || !token || isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="skeleton h-40 w-full" />
      </main>
    );
  }

  const slug = event?.slug ?? '';
  const name = event?.name ?? 'Event';

  const copyJoinLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/e/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const uploads = stats?.uploads?.total;
  const storageBytes = stats?.storageBytes;

  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader
        title={name}
        subtitle={slug ? `/e/${slug}` : 'Event dashboard'}
        onSignOut={signOut}
        actions={
          <Link href="/host" className="btn btn-ghost btn-sm">
            ← All events
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Hero */}
        <div className="panel mb-8 overflow-hidden">
          <div className="relative h-36 bg-brand-gradient-soft sm:h-44">
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{name}</h1>
                <p className="mt-1 text-sm text-slate-400">
                  {event?.venue ? `${event.venue} · ` : ''}
                  {event?.joinCode ? `Join code ${event.joinCode}` : 'Share the QR with your guests'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/e/${slug}`} className="btn btn-secondary btn-sm">
                  Guest room
                </Link>
                <Link href={`/wall/${slug}`} className="btn btn-primary btn-sm">
                  Live wall
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] p-5">
            <span className="badge badge-brand">{event?.status ?? 'draft'}</span>
            <code className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-slate-300">
              /e/{slug}
            </code>
            <button onClick={copyJoinLink} className="btn btn-secondary btn-sm">
              {copied ? '✓ Copied' : 'Copy join link'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Uploads</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{uploads ?? '—'}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Guests</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{stats?.guests ?? '—'}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">Storage used</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {storageBytes === undefined ? '—' : formatBytes(storageBytes)}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-wider text-slate-500">On the wall</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">{stats?.onWall ?? '—'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-5 md:grid-cols-3">
          <ActionCard
            icon="🔳"
            title="QR code & signage"
            body="Download a table card, A3 poster and screen slide, all pointing at your event room."
          >
            <button className="btn btn-secondary btn-sm">Download signage</button>
          </ActionCard>

          <ActionCard
            icon="🖼️"
            title="Media"
            body="Review everything guests uploaded, hide what shouldn’t be on the wall and export the lot."
          >
            <button className="btn btn-secondary btn-sm">View all photos</button>
            <button className="btn btn-secondary btn-sm">Download ZIP</button>
          </ActionCard>

          <ActionCard
            icon="📖"
            title="Magazine"
            body="Auto-select the best shots, preview the layout, swap pages and approve for printing."
          >
            <button className="btn btn-primary btn-sm">Build magazine</button>
            <button className="btn btn-secondary btn-sm">Preview & approve</button>
          </ActionCard>
        </div>
      </div>
    </main>
  );
}
