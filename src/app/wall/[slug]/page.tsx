'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useRoom } from '@/hooks/use-room';
import type { LeaderboardEntry, WallItem } from '@/lib/api/types';

/** Newest first; one large slot plus eight small ones. */
const SHOWN = 9;
/** With no new photo for this long, the big slot starts cycling. */
const IDLE_MS = 15_000;
const CYCLE_MS = 8_000;
const TILTS = [-1.5, 1, -0.5, 1.5, -1, 0.5, -2, 1];

export default function LiveWall() {
  const { slug } = useParams<{ slug: string }>();
  const { data: room } = useRoom(slug);
  const [items, setItems] = useState<WallItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  // Which item is in the big slot, and whether it's there because it's new.
  const [spotlight, setSpotlight] = useState<{ id: string | null; fresh: boolean }>({ id: null, fresh: false });
  const lastAdd = useRef(0);
  const itemsRef = useRef<WallItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => setJoinUrl(`${window.location.host}/e/${room?.slug ?? slug}`), [room?.slug, slug]);

  useEffect(() => {
    // EventSource reconnects by itself; every reconnect starts with a fresh `init`.
    const source = new EventSource(api.wallUrl(slug));
    source.onerror = () => setConnected(false);
    source.addEventListener('init', (e) => {
      const data: { items: WallItem[]; leaderboard: LeaderboardEntry[] } = JSON.parse((e as MessageEvent).data);
      setItems(data.items.slice(0, SHOWN));
      setLeaderboard(data.leaderboard);
      setSpotlight({ id: data.items[0]?.id ?? null, fresh: false });
      setConnected(true);
    });
    source.addEventListener('add', (e) => {
      const { item }: { item: WallItem } = JSON.parse((e as MessageEvent).data);
      lastAdd.current = Date.now();
      setItems((prev) => [item, ...prev.filter((p) => p.id !== item.id)].slice(0, SHOWN));
      setSpotlight({ id: item.id, fresh: true });
    });
    source.addEventListener('remove', (e) => {
      const { id }: { id: string } = JSON.parse((e as MessageEvent).data);
      setItems((prev) => prev.filter((p) => p.id !== id));
    });
    source.addEventListener('leaderboard', (e) => {
      setLeaderboard(JSON.parse((e as MessageEvent).data));
    });
    return () => source.close();
  }, [slug]);

  // A quiet room still has a moving wall: cycle the big slot through recent photos.
  useEffect(() => {
    const timer = setInterval(() => {
      const current = itemsRef.current;
      if (Date.now() - lastAdd.current < IDLE_MS || current.length < 2) return;
      setSpotlight((s) => {
        const i = current.findIndex((p) => p.id === s.id);
        return { id: current[(i + 1) % current.length].id, fresh: false };
      });
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  const featured = items.find((p) => p.id === spotlight.id) ?? items[0];
  const rest = items.filter((p) => p !== featured).slice(0, SHOWN - 1);

  return (
    <main className="grid h-dvh grid-cols-[minmax(0,1fr)_320px] gap-8 overflow-hidden bg-ink p-8 text-paper">
      <section aria-label="Latest photos" className="grid min-h-0 grid-cols-4 grid-rows-3 gap-3">
        {featured ? (
          <figure
            key={featured.id}
            className={`relative col-span-2 row-span-2 m-0 overflow-hidden rounded-md bg-ink-line ${spotlight.fresh ? 'animate-drop [--tilt:0deg]' : 'animate-develop'}`}
          >
            <img src={featured.url} alt="" className="h-full w-full animate-kenburns object-cover" />
            {featured.guest.displayName && (
              <figcaption className="absolute bottom-4 left-4 flex animate-pop items-center gap-2.5 rounded-full bg-ink py-2 pl-2 pr-4 [animation-delay:500ms]">
                <Avatar name={featured.guest.displayName} url={featured.guest.pfpUrl} />
                <span className="text-base font-medium">
                  {featured.guest.displayName} {spotlight.fresh ? 'just shared this' : 'shared this'}
                </span>
              </figcaption>
            )}
            {spotlight.fresh && (
              <span className="absolute right-4 top-4 flex animate-pop items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white">
                New
              </span>
            )}
          </figure>
        ) : (
          <div className="col-span-4 row-span-3 flex flex-col items-center justify-center rounded-md border border-ink-line text-center">
            <span className="relative mb-8 flex h-16 w-16 items-center justify-center" aria-hidden="true">
              <span className="absolute inset-0 animate-ping2 rounded-full border-2 border-accent-live" />
              <span className="h-4 w-4 rounded-full bg-accent-live" />
            </span>
            <p className="font-serif text-6xl">Waiting for the first photo</p>
            <p className="mt-4 text-xl text-muted-light">Open the link on the right and share yours.</p>
          </div>
        )}
        {rest.map((item, i) => (
          <div
            key={item.id}
            className="animate-pop overflow-hidden rounded-md bg-ink-line transition-transform duration-700"
            style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
          >
            <img src={item.thumbUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </section>

      <aside className="flex min-h-0 flex-col gap-8">
        <div>
          <p className="flex items-center gap-2 text-sm text-muted-light">
            <span className={connected ? 'live-dot animate-pulse' : 'inline-block h-2 w-2 rounded-full bg-muted'} />
            {connected ? 'Live' : 'Reconnecting…'}
          </p>
          <h1 className="mt-2 font-serif text-[48px] leading-none">{room?.name ?? ''}</h1>
        </div>

        <div>
          <h2 className="eyebrow mb-2 text-muted-light">Top sharers</h2>
          {leaderboard.length === 0 ? (
            <p className="text-muted-light">No photos yet.</p>
          ) : (
            <ol>
              {leaderboard.slice(0, 6).map((entry, i) => (
                <li
                  key={`${entry.displayName}-${entry.uploadCount}`}
                  className={`flex h-12 animate-pop items-center gap-3 border-b border-ink-line ${i === 0 ? 'text-accent-soft' : ''}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={`w-6 text-sm ${i === 0 ? 'font-serif text-2xl text-accent-soft' : 'text-muted-light'}`}>{i + 1}</span>
                  <Avatar name={entry.displayName} url={entry.pfpUrl} />
                  <span className="min-w-0 flex-1 truncate text-base">{entry.displayName}</span>
                  <span className="text-base font-semibold">{entry.uploadCount}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-auto rotate-[-1.5deg] rounded-card bg-paper p-5 text-ink shadow-lift">
          <p className="text-sm text-ink-soft">Add your photos at</p>
          <p className="mt-1 break-all font-serif text-[30px] leading-tight">{joinUrl}</p>
        </div>
      </aside>
    </main>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  return (
    <span className="flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-full bg-placeholder text-sm font-semibold text-ink">
      {url ? <img src={url} alt="" className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}
    </span>
  );
}
