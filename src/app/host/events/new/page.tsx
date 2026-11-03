'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { errorMessage } from '@/lib/api/errors';
import type { EventType } from '@/lib/api/types';
import AppShell from '@/components/shared/app-shell';

const TYPES: { value: EventType; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'party', label: 'Party or owambe' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Something else' },
];

type Form = { name: string; type: EventType; startsAt: string; endsAt: string; venue: string };

function CreateEventForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Form>({ name: '', type: 'wedding', startsAt: '', endsAt: '', venue: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // datetime-local is in the browser's timezone; toISOString sends UTC.
    const startsAt = new Date(form.startsAt);
    const endsAt = new Date(form.endsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      setError('Pick when uploads open and close.');
      return;
    }
    if (endsAt <= startsAt) {
      setError('Uploads must close after they open.');
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
      void queryClient.invalidateQueries({ queryKey: ['my-events'] });
      router.push(`/host/events/${event.id}`);
    } catch (err) {
      setError(errorMessage(err, 'We couldn’t create the event. Check the details and try again.'));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-7">
      <div>
        <Link href="/host" className="text-sm text-muted hover:text-ink">
          ← Your events
        </Link>
        <h1 className="mt-3 font-serif text-[44px] leading-none">New event</h1>
        <p className="mt-3 text-[15px] text-ink-soft">Guests see the name and date when they scan your QR code.</p>
      </div>

      {error && (
        <p role="alert" className="notice notice-error">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="name" className="label">
          Event name
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          maxLength={120}
          placeholder="e.g. Tolu & Ada’s wedding"
          className="input"
          required
        />
      </div>

      <fieldset>
        <legend className="label">Type</legend>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-[15px] ${
                form.type === t.value ? 'border-ink bg-card font-semibold' : 'border-field'
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={form.type === t.value}
                onChange={() => set({ type: t.value })}
                className="accent-accent"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startsAt" className="label">
            Uploads open
          </label>
          <input
            id="startsAt"
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => set({ startsAt: e.target.value })}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="endsAt" className="label">
            Uploads close
          </label>
          <input
            id="endsAt"
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => set({ endsAt: e.target.value })}
            className="input"
            required
          />
        </div>
      </div>
      <p className="hint -mt-4">Guests can share photos between these times. They can browse after.</p>

      <div>
        <label htmlFor="venue" className="label">
          Venue <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="venue"
          value={form.venue}
          onChange={(e) => set({ venue: e.target.value })}
          maxLength={200}
          placeholder="e.g. Kakanfo Inn, Ibadan"
          className="input"
        />
      </div>

      <div className="flex items-center gap-3 border-t border-rule pt-6">
        <button type="submit" disabled={busy || !form.name.trim()} className="btn btn-primary">
          {busy ? 'Creating…' : 'Create event'}
        </button>
        <Link href="/host" className="btn btn-text">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function NewEventPage() {
  return <AppShell>{() => <CreateEventForm />}</AppShell>;
}
