import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

/** Photos waiting to upload, kept in IndexedDB so they survive a reload or bad signal. */
export interface QueuedUpload {
  id: string;
  slug: string;
  blob: Blob;
  contentType: string;
  attempts: number;
  createdAt: number;
}

interface UploadDB extends DBSchema {
  uploads: { key: string; value: QueuedUpload; indexes: { bySlug: string } };
}

let dbPromise: Promise<IDBPDatabase<UploadDB>> | null = null;

function db() {
  dbPromise ??= openDB<UploadDB>('pixy-uploads', 2, {
    upgrade(database, oldVersion) {
      // v1 stored guest tokens with each file; start clean.
      if (oldVersion < 2 && database.objectStoreNames.contains('uploads')) database.deleteObjectStore('uploads');
      const store = database.createObjectStore('uploads', { keyPath: 'id' });
      store.createIndex('bySlug', 'slug');
    },
  });
  return dbPromise;
}

export async function enqueue(slug: string, blob: Blob): Promise<QueuedUpload> {
  const item: QueuedUpload = {
    // Not crypto.randomUUID: it's missing on plain-http LAN testing.
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    slug,
    blob,
    contentType: blob.type || 'image/jpeg',
    attempts: 0,
    createdAt: Date.now(),
  };
  await (await db()).put('uploads', item);
  return item;
}

export async function pendingFor(slug: string): Promise<QueuedUpload[]> {
  const items = await (await db()).getAllFromIndex('uploads', 'bySlug', slug);
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function markAttempt(item: QueuedUpload): Promise<void> {
  await (await db()).put('uploads', { ...item, attempts: item.attempts + 1 });
}

export async function remove(id: string): Promise<void> {
  await (await db()).delete('uploads', id);
}
