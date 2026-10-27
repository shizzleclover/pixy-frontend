'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import type { EventType } from '@/lib/api/types';
import { useAuth } from '@/hooks/use-auth';
import DashboardHeader from '@/components/shared/dashboard-header';

const TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'party', label: 'Party / Owambe', icon: '🎉' },
  { value: 'conference', label: 'Conference', icon: '🎤' },
  { value: 'other', label: 'Something else', icon: '✨' },
];

type Form = { name: string; type: EventType; date: string; venue: string; endsAt: string };

export default function CreateEvent() {
  const router = useRouter();
  const { token, loading, signOut } = useAuth();
  const [form, setForm] = useState<Form>({ name: '', type: 'party', date: '', venue: '', endsAt: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startsAt = new Date(form.date);
    const endsAt = new Date(form.endsAt);
    if (!form.date || !form.endsAt || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      setError('Pick both a start time and an uploads-close time.');
      return;
    }
    if (endsAt <= startsAt) {
      setError('Uploads must close after the event starts.');
      return;
    }

    setBusy(true);
    try {
      const venue = form.venue.trim();
      const event = await api.createEvent({
        name: form.name.trim(),
        type: form.type,
        date: startsAt.toISOString(),
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        ...(venue ? { venue } : {}),
      });
      router.push(`/host/events/${event.id}`);
    } catch {
      setError('We couldn’t create the event. Double-check the details and try again.');
      setBusy(false);
    }
  };

  if (loading || !token) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="skeleton h-96 w-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <DashboardHeader
        title="New event"
        subtitle="Set it up in under a minute"
        onSignOut={signOut}
        actions={
          <Link href="/host" className="btn btn-ghost btn-sm">
            ← Back
          </Link>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="card">
            <h2 className="font-display text-lg font-semibold text-white">The basics</h2>
            <p className="mt-1 text-sm text-slate-400">This is what guests see when they scan your QR.</p>

            <div className="mt-5 space-y-5">
              <div>
                <label className="label" htmlFor="name">
                  Event name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input input-lg"
                  placeholder="e.g. Tolu & Ada’s Wedding"
                  required
                />
              </div>

              <div>
                <span className="label">Event type</span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                        form.type === t.value
                          ? 'border-brand-400/60 bg-brand-500/[0.12] text-white shadow-glow'
                          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="date">
                    Starts at
                  </label>
                  <input
                    id="date"
                    type="datetime-local"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="endsAt">
                    Uploads close
                  </label>
                  <input
                    id="endsAt"
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="venue">
                    Venue
                  </label>
                  <input
                    id="venue"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="input"
                    placeholder="e.g. Kakanfo Inn, Ibadan"
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Guests can only upload between these times. The live wall stays on until you close the
                event.
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4 border-brand-400/20 bg-brand-500/[0.06]">
            <span className="icon-tile">💳</span>
            <div className="flex-1">
              <p className="font-medium text-white">Choose your package next</p>
              <p className="text-sm text-slate-400">
                Image credits with the magazine baked in, from ₦75,000. You’ll pay with Paystack before
                launch.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/host" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={busy} className="btn btn-primary btn-lg">
              {busy ? 'Creating…' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
