'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { LogoMark } from '@/components/shared/logo';
import type { LeaderboardEntry, MediaItem } from '@/lib/api/types';

export default function LiveWall() {
  const { slug } = useParams<{ slug: string }>();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [count, setCount] = useState(0);

  const { data: event } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => api.getEvent(slug),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    const eventSource = new EventSource(api.getWallUrl(slug));

    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.addEventListener('init', (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      setItems(data.items || []);
      setLeaderboard(data.leaderboard || []);
      setCount(data.items?.length || 0);
      setConnected(true);
    });

    eventSource.addEventListener('add', (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      setItems((prev) => [data.item, ...prev].slice(0, 24));
      setCount((c) => c + 1);
    });

    eventSource.addEventListener('remove', (e) => {
      const data = JSON.parse((e as MessageEvent).data);
      setItems((prev) => prev.filter((item) => item.id !== data.id));
    });

    eventSource.addEventListener('leaderboard', (e) => {
      setLeaderboard(JSON.parse((e as MessageEvent).data));
    });

    return () => eventSource.close();
  }, [slug]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 p-6 sm:p-10">
      <div className="glow-blob -left-32 -top-24 h-96 w-96 animate-pulse-glow bg-brand-500/25" />
      <div className="glow-blob -bottom-32 -right-24 h-96 w-96 animate-pulse-glow bg-iris-500/25 [animation-delay:1.6s]" />

      {/* Top bar */}
      <header className="relative z-10 mb-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <LogoMark className="h-14 w-14" />
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              {event?.name ?? 'Live wall'}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    connected ? 'animate-ping bg-brand-400' : 'bg-slate-500'
                  }`}
                />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${connected ? 'bg-brand-400' : 'bg-slate-500'}`} />
              </span>
              {connected ? 'Live' : 'Connecting…'} · {count} photo{count === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <span className="hidden text-gradient font-display text-2xl font-bold sm:block">pixy.ng</span>
      </header>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Wall */}
        <div>
          {items.length === 0 ? (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-4xl border border-dashed border-white/10 bg-white/[0.02] text-center">
              <span className="text-6xl">📸</span>
              <p className="mt-5 font-display text-2xl font-bold text-white">Waiting for the first photo</p>
              <p className="mt-2 max-w-sm text-slate-400">
                Scan the event QR or enter the join code to put your photos up here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-card animate-scale-in"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                >
                  <img src={item.thumbUrl || item.url} alt="" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Leaderboard</h2>
              <span className="badge badge-brand">Top uploaders</span>
            </div>

            {leaderboard.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No uploads yet. Be the first on the board.</p>
            ) : (
              <ol className="mt-4 space-y-2.5">
                {leaderboard.slice(0, 8).map((entry, i) => (
                  <li
                    key={`${entry.displayName}-${i}`}
                    className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                      i === 0
                        ? 'border-brand-400/40 bg-brand-500/[0.12]'
                        : 'border-white/[0.06] bg-white/[0.03]'
                    }`}
                  >
                    <span className="w-6 flex-none text-center text-sm font-bold text-slate-400">
                      {medals[i] ?? i + 1}
                    </span>
                    <span className="flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-sm font-bold text-white">
                      {entry.pfpUrl ? (
                        <img src={entry.pfpUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (entry.displayName || 'G').charAt(0).toUpperCase()
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-white">{entry.displayName}</span>
                    <span className="flex-none text-sm font-semibold text-brand-200">{entry.uploadCount}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-slate-600">
            Photos appear here as guests upload. Hosts can pull any photo in one tap.
          </p>
        </aside>
      </div>
    </main>
  );
}
