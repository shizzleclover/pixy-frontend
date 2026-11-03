'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useRoom } from '@/hooks/use-room';
import type { LeaderboardEntry, WallItem } from '@/lib/api/types';

/** Newest first; one large slot plus eight small ones. */
const SHOWN = 9;

export default function LiveWall() {
  const { slug } = useParams<{ slug: string }>();
  const { data: room } = useRoom(slug);
  const [items, setItems] = useState<WallItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');

  useEffect(() => setJoinUrl(`${window.location.host}/e/${room?.slug ?? slug}`), [room?.slug, slug]);

  useEffect(() => {
    // EventSource reconnects by itself; every reconnect starts with a fresh `init`.
    const source = new EventSource(api.wallUrl(slug));
    source.onerror = () => setConnected(false);
    source.addEventListener('init', (e) => {
      const data: { items: WallItem[]; leaderboard: LeaderboardEntry[] } = JSON.parse((e as MessageEvent).data);
      setItems(data.items.slice(0, SHOWN));
      setLeaderboard(data.leaderboard);
      setConnected(true);
    });
    source.addEventListener('add', (e) => {
      const { item }: { item: WallItem } = JSON.parse((e as MessageEvent).data);
      setItems((prev) => [item, ...prev.filter((p) => p.id !== item.id)].slice(0, SHOWN));
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

  const [featured, ...rest] = items;

  return (
    <main className="grid h-dvh grid-cols-[minmax(0,1fr)_320px] gap-8 overflow-hidden bg-ink p-8 text-paper">
      <section aria-label="Latest photos" className="grid min-h-0 grid-cols-4 grid-rows-3 gap-2">
        {featured ? (
          <figure className="relative col-span-2 row-span-2 m-0 overflow-hidden rounded-md bg-ink-line">
            <img src={featured.url} alt="" className="h-full w-full object-cover" />
            {featured.guest.displayName && (
              <figcaption className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full bg-ink py-2 pl-2 pr-4">
                <Avatar name={featured.guest.displayName} url={featured.guest.pfpUrl} />
                <span className="text-base font-medium">{featured.guest.displayName} just shared this</span>
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="col-span-4 row-span-3 flex flex-col items-center justify-center rounded-md border border-ink-line text-center">
            <p className="font-serif text-5xl">Waiting for the first photo</p>
            <p className="mt-3 text-lg text-muted-light">Scan the code on the right and share yours.</p>
          </div>
        )}
        {rest.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-md bg-ink-line">
            <img src={item.thumbUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </section>

      <aside className="flex min-h-0 flex-col gap-8">
        <div>
          <p className="flex items-center gap-2 text-sm text-muted-light">
            <span className={connected ? 'live-dot' : 'inline-block h-2 w-2 rounded-full bg-muted'} />
            {connected ? 'Live' : 'Reconnecting…'}
          </p>
          <h1 className="mt-2 font-serif text-[44px] leading-none">{room?.name ?? ''}</h1>
        </div>

        <div>
          <h2 className="eyebrow mb-2 text-muted-light">Top sharers</h2>
          {leaderboard.length === 0 ? (
            <p className="text-muted-light">No photos yet.</p>
          ) : (
            <ol>
              {leaderboard.slice(0, 6).map((entry, i) => (
                <li key={`${entry.displayName}-${i}`} className="flex h-12 items-center gap-3 border-b border-ink-line">
                  <span className="w-5 text-sm text-muted-light">{i + 1}</span>
                  <Avatar name={entry.displayName} url={entry.pfpUrl} />
                  <span className="min-w-0 flex-1 truncate text-base">{entry.displayName}</span>
                  <span className="text-base font-semibold">{entry.uploadCount}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mt-auto rounded-card bg-paper p-5 text-ink">
          <p className="text-sm text-ink-soft">Add your photos at</p>
          <p className="mt-1 break-all text-2xl font-semibold">{joinUrl}</p>
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
