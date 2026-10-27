import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface UploadDB extends DBSchema {
  uploads: {
    key: string;
    value: {
      id: string;
      slug: string;
      guestToken: string;
      file: Blob;
      fileName: string;
      contentType: string;
      status: 'pending' | 'uploading' | 'completed' | 'failed';
      attempts: number;
      createdAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<UploadDB>>;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<UploadDB>('pixy-uploads', 1, {
      upgrade(db) {
        db.createObjectStore('uploads', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export async function queueUpload(slug: string, guestToken: string, file: File) {
  const db = await getDB();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  await db.add('uploads', {
    id,
    slug,
    guestToken,
    file,
    fileName: file.name,
    contentType: file.type,
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
  });
  return id;
}

export async function getPendingUploads() {
  const db = await getDB();
  const all = await db.getAll('uploads');
  return all.filter(u => u.status === 'pending' || u.status === 'failed');
}

export async function updateUploadStatus(id: string, status: 'pending' | 'uploading' | 'completed' | 'failed', attempts?: number) {
  const db = await getDB();
  const upload = await db.get('uploads', id);
  if (upload) {
    await db.put('uploads', { ...upload, status, attempts: attempts ?? upload.attempts });
  }
}

export async function removeUpload(id: string) {
  const db = await getDB();
  await db.delete('uploads', id);
}

export async function getPendingCount() {
  const pending = await getPendingUploads();
  return pending.length;
}
