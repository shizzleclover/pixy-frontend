'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import { formatNaira } from '@/lib/format';
import AppShell from '@/components/shared/app-shell';

const PRINT_STATUSES = ['queued', 'sent', 'accepted', 'printed', 'ready', 'failed'] as const;

function Overview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: api.getAdminOverview,
    refetchInterval: 60_000,
  });

  if (error)
    return (
      <p role="alert" className="notice notice-error">
        {errorMessage(error)}
      </p>
    );

  const stats = [
    { label: 'Revenue today', value: data && formatNaira(data.revenueToday.kobo), note: data && `${data.revenueToday.orders} orders` },
    { label: 'Last 7 days', value: data && formatNaira(data.revenueLast7Days.kobo), note: data && `${data.revenueLast7Days.orders} orders` },
    { label: 'Live events', value: data?.activeEvents },
    { label: 'Uploads today', value: data?.uploadsToday },
  ];

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-[44px] leading-none">Overview</h1>

      <div className="card grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-rule p-5 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b">
            <p className="text-[13px] text-muted">{s.label}</p>
            {isLoading ? (
              <div className="skeleton mt-2 h-8 w-24 rounded" />
            ) : (
              <p className="mt-1.5 text-3xl font-semibold">{s.value ?? '–'}</p>
            )}
            {s.note && <p className="mt-1 text-xs text-muted">{s.note}</p>}
          </div>
        ))}
      </div>

      {data && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="card p-6">
            <h2 className="text-lg font-semibold">Needs attention</h2>
            <dl className="mt-4 divide-y divide-rule">
              <div className="flex justify-between py-3">
                <dt>Orders in review</dt>
                <dd className={`font-semibold ${data.ordersInReview ? 'text-accent' : ''}`}>{data.ordersInReview}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt>Print jobs with no printer</dt>
                <dd className={`font-semibold ${data.printJobsWithoutPrinter ? 'text-accent' : ''}`}>
                  {data.printJobsWithoutPrinter}
                </dd>
              </div>
            </dl>
          </section>
          <section className="card p-6">
            <h2 className="text-lg font-semibold">Open print jobs</h2>
            <dl className="mt-4 grid grid-cols-3 gap-y-4">
              {PRINT_STATUSES.map((s) => (
                <div key={s}>
                  <dt className="text-[13px] capitalize text-muted">{s}</dt>
                  <dd className="text-xl font-semibold">{data.openPrintJobs[s] ?? 0}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return <AppShell role="admin">{() => <Overview />}</AppShell>;
}
