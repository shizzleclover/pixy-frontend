'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useAuth } from '@/hooks/use-auth';
import DashboardHeader from '@/components/shared/dashboard-header';

const SECTIONS = [
  { icon: '📊', title: 'Overview', body: 'Revenue, live events, uploads, print jobs', ready: true },
  { icon: '🎪', title: 'Events', body: 'Search, change status, override caps, extend retention', ready: false },
  { icon: '🛡️', title: 'Moderation', body: 'Recent and flagged media, hide or reject in one tap', ready: false },
  { icon: '🧾', title: 'Orders', body: 'All orders with filters and manual status changes', ready: false },
  { icon: '🖨️', title: 'Print queue', body: 'Jobs by status, resend to printer, reassign', ready: false },
  { icon: '🏭', title: 'Printers', body: 'Add printers, rates and contacts', ready: false },
  { icon: '🎟️', title: 'Coupons', body: 'Single or bulk codes, scope, limits, redemptions', ready: false },
  { icon: '💸', title: 'Pricing', body: 'Edit package and product prices and caps', ready: false },
];

export default function AdminDashboard() {
  const { token, loading, signOut } = useAuth({ redirectTo: '/login' });

  const { data: overview, isLoading, isError } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => api.getAdminOverview(),
    enabled: !!token,
  });

  if (loading || !token) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="skeleton h-28 w-full" />
      </main>
    );
  }

  // Revenue comes back as kobo (1/100 naira).
  const naira = (kobo?: number) =>
    kobo === undefined ? '—' : `₦${Math.round(kobo / 100).toLocaleString('en-NG')}`;

  const stats = [
    { label: 'Revenue today', value: naira(overview?.revenueToday?.kobo) },
    { label: 'Active events', value: overview?.activeEvents ?? '—' },
    { label: 'Uploads today', value: overview?.uploadsToday ?? '—' },
    { label: 'Orders in review', value: overview?.ordersInReview ?? '—' },
  ];

  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader title="Admin" subtitle="Platform overview" homeHref="/admin" onSignOut={signOut} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {isError && (
          <p className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            We couldn’t load the overview. You may not have admin access on this account.
          </p>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <p className="text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
              {isLoading ? (
                <div className="skeleton mt-2 h-8 w-20" />
              ) : (
                <p className="mt-2 font-display text-3xl font-bold text-white">{s.value}</p>
              )}
            </div>
          ))}
        </div>

        <h2 className="mb-4 font-display text-lg font-semibold text-white">Screens</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className={`card card-hover ${
                section.ready ? 'border-brand-400/30 bg-brand-500/[0.06]' : 'opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="icon-tile">{section.icon}</span>
                <span className={`badge ${section.ready ? 'badge-brand' : ''}`}>
                  {section.ready ? 'Ready' : 'Planned'}
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{section.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
