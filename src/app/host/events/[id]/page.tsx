'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import type { HostEvent } from '@/lib/api/types';
import { formatBytes, formatDate, formatTime, STATUS_LABEL } from '@/lib/format';
import AppShell from '@/components/shared/app-shell';
import { CheckIcon, CopyIcon, ExternalIcon } from '@/components/shared/icons';

function NextStep({ event }: { event: HostEvent }) {
  if (event.status === 'draft')
    return (
      <div className="card p-6">
        <p className="text-lg font-semibold">Your room opens once a package is paid</p>
        <p className="mt-1 text-sm text-ink-soft">
          Online checkout is coming soon. Until then, contact the Pixy team to open this room.
        </p>
      </div>
    );
  if (event.status === 'active')
    return (
      <div className="card flex items-start gap-3 p-6">
        <span className="live-dot mt-2" />
        <div>
          <p className="text-lg font-semibold">Your room is open</p>
          <p className="mt-1 text-sm text-ink-soft">
            Guests can share photos from {formatTime(event.startsAt)} on {formatDate(event.startsAt, { day: 'numeric', month: 'long' })} until{' '}
            {formatTime(event.endsAt)} on {formatDate(event.endsAt, { day: 'numeric', month: 'long' })}.
          </p>
        </div>
      </div>
    );
  return null;
}

function Stat({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="p-5">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold">{value ?? '–'}</p>
    </div>
  );
}

function SharePanel({ event }: { event: HostEvent }) {
  const [copied, setCopied] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  useEffect(() => setJoinUrl(`${window.location.origin}/e/${event.slug}`), [event.slug]);

  const { data: qr } = useQuery({
    queryKey: ['event-qr', event.id],
    queryFn: () => api.getEventQr(event.id, 'svg'),
    staleTime: Infinity,
  });
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!qr) return;
    const url = URL.createObjectURL(qr);
    setQrUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [qr]);

  const downloadPng = async () => {
    const blob = await api.getEventQr(event.id, 'png');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug}-qr.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked; the link is visible to copy by hand */
    }
  };

  return (
    <aside className="card space-y-5 self-start p-6">
      <h2 className="text-lg font-semibold">Share with guests</h2>
      <div className="flex aspect-square items-center justify-center rounded-xl border border-rule bg-paper p-4">
        {qrUrl ? <img src={qrUrl} alt="QR code that opens your event room" className="h-full w-full" /> : <div className="skeleton h-full w-full rounded" />}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-muted">Join code</span>
        <span className="text-2xl font-semibold tracking-[0.2em]">{event.joinCode}</span>
      </div>
      <p className="break-all text-sm text-ink-soft">{joinUrl}</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={copy} className="btn btn-secondary btn-sm">
          {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
        <button onClick={downloadPng} className="btn btn-secondary btn-sm">
          QR image
        </button>
      </div>
      <div className="flex flex-col gap-2 border-t border-rule pt-4 text-sm">
        <Link href={`/e/${event.slug}`} target="_blank" className="link inline-flex items-center gap-1.5">
          Open the guest room <ExternalIcon className="h-4 w-4" />
        </Link>
        {event.wallEnabled && (
          <Link href={`/wall/${event.slug}`} target="_blank" className="link inline-flex items-center gap-1.5">
            Open the live wall <ExternalIcon className="h-4 w-4" />
          </Link>
        )}
      </div>
    </aside>
  );
}

function EventDetail({ id }: { id: string }) {
  const { data: event, isLoading, error } = useQuery({ queryKey: ['event', id], queryFn: () => api.getEvent(id) });
  const { data: stats } = useQuery({ queryKey: ['event-stats', id], queryFn: () => api.getEventStats(id), enabled: !!event });

  if (isLoading) return <div className="skeleton h-40 rounded-card" aria-busy="true" />;
  if (error || !event)
    return (
      <p role="alert" className="notice notice-error">
        {errorMessage(error, 'We couldn’t load this event.')}
      </p>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <div>
          <Link href="/host" className="text-sm text-muted hover:text-ink">
            ← Your events
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-[44px] leading-none sm:text-[52px]">{event.name}</h1>
            <span className="chip">
              {event.status === 'active' && <span className="live-dot" />}
              {STATUS_LABEL[event.status]}
            </span>
          </div>
          <p className="mt-3 text-[15px] text-muted">
            {formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {event.venue ? ` · ${event.venue}` : ''}
          </p>
        </div>

        <NextStep event={event} />

        <div className="card grid grid-cols-2 divide-rule sm:grid-cols-4 sm:divide-x [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-rule sm:[&>*:nth-child(-n+2)]:border-b-0">
          <Stat label="Photos" value={stats?.uploads.total} />
          <Stat label="Guests" value={stats?.guests} />
          <Stat label="On the wall" value={stats?.onWall} />
          <Stat label="Storage" value={stats ? formatBytes(stats.storageBytes) : undefined} />
        </div>
      </div>

      <SharePanel event={event} />
    </div>
  );
}

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  return <AppShell>{() => <EventDetail id={id} />}</AppShell>;
}
