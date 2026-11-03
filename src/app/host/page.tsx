'use client';

import Link from 'next/link';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import { formatDate, STATUS_LABEL } from '@/lib/format';
import AppShell from '@/components/shared/app-shell';
import EmptyState from '@/components/shared/empty-state';
import { ArrowRightIcon } from '@/components/shared/icons';

function EventList() {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['my-events'],
    queryFn: ({ pageParam }) => api.listMyEvents(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
  const events = (data?.pages ?? []).flatMap((p) => p.items);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-6">
        <h1 className="font-serif text-[44px] leading-none">Your events</h1>
        <Link href="/host/events/new" className="btn btn-primary">
          New event
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-16 rounded-card" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="notice notice-error mt-6">
          {errorMessage(error)}
        </p>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          body="Create one, share the QR code, and every photo from the day lands in one place."
          action={
            <Link href="/host/events/new" className="btn btn-primary">
              Create your first event
            </Link>
          }
        />
      ) : (
        <ul>
          {events.map((ev) => (
            <li key={ev.id}>
              <Link
                href={`/host/events/${ev.id}`}
                className="flex items-center justify-between gap-4 border-b border-rule py-5 hover:bg-card"
              >
                <span className="min-w-0">
                  <span className="block truncate text-lg font-semibold">{ev.name}</span>
                  <span className="block text-sm text-muted">
                    {formatDate(ev.date)}
                    {ev.venue ? ` · ${ev.venue}` : ''}
                  </span>
                </span>
                <span className="flex flex-none items-center gap-4">
                  <span className={`chip ${ev.status === 'active' ? '' : 'text-muted'}`}>
                    {ev.status === 'active' && <span className="live-dot" />}
                    {STATUS_LABEL[ev.status]}
                  </span>
                  <ArrowRightIcon className="h-5 w-5 text-muted" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="btn btn-secondary btn-sm mt-6">
          {isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  );
}

export default function HostHome() {
  return <AppShell>{() => <EventList />}</AppShell>;
}
