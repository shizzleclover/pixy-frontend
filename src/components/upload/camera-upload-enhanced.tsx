'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '@/lib/api/client';
import { queueUpload, getPendingCount } from '@/lib/storage/upload-queue';

export default function CameraUploadEnhanced({ slug, guestToken }: { slug: string; guestToken: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'queued'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshPending = useCallback(async () => {
    setPendingCount(await getPendingCount());
  }, []);

  useEffect(() => {
    refreshPending();
    const interval = setInterval(refreshPending, 2000);
    return () => clearInterval(interval);
  }, [refreshPending]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(
                blob
                  ? new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() })
                  : file
              );
            },
            'image/jpeg',
            0.8
          );
        };
      };
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(files[0]);

    setUploading(true);
    setStatus('sending');
    let queuedAny = false;

    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        try {
          const presignData = await api.presignUploads(slug, guestToken, [
            { contentType: 'image/jpeg', bytes: compressed.size, kind: 'photo' },
          ]);

          await fetch(presignData.items[0].uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/jpeg' as const },
            body: compressed,
          });

          await api.completeUploads(slug, guestToken, [
            { mediaId: presignData.items[0].mediaId, framed: false },
          ]);
          setUploaded((prev) => prev + 1);
        } catch {
          await queueUpload(slug, guestToken, compressed);
          queuedAny = true;
        }
      } catch {
        queuedAny = true;
      }
    }

    await refreshPending();
    setUploading(false);
    setStatus(queuedAny ? 'queued' : 'done');
    setTimeout(() => {
      setPreview(null);
      setStatus('idle');
    }, 2600);
  };

  return (
    <div className="space-y-5 px-4">
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-sun-500/25 bg-sun-500/10 px-4 py-3 text-sm text-sun-300">
          <span className="relative flex h-2 w-2 flex-none">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sun-400" />
          </span>
          {pendingCount} photo{pendingCount > 1 ? 's' : ''} still sending — we’ll retry automatically
        </div>
      )}

      <div className="relative aspect-[4/5] overflow-hidden rounded-4xl border border-white/10 bg-ink-900/60">
        {preview ? (
          <>
            <img src={preview} alt="Your last shot" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              {status === 'sending' && (
                <span className="badge">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" /> Sending…
                </span>
              )}
              {status === 'done' && <span className="badge badge-brand">✓ Uploaded to the wall</span>}
              {status === 'queued' && <span className="badge">⏳ Queued — will send when network returns</span>}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="text-5xl">📸</span>
            <p className="max-w-[16rem] text-sm text-slate-400">
              Tap the shutter to capture. Photos compress on your phone and upload straight to the event.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
        multiple
      />

      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="font-display text-xl font-bold text-white">{uploaded}</p>
          <p className="text-[11px] text-slate-500">this session</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Take photo"
          className="group relative flex h-24 w-24 flex-none items-center justify-center rounded-full bg-brand-gradient shadow-glow transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
        >
          <span className="absolute inset-2 rounded-full border-2 border-white/40" />
          {uploading ? (
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="relative h-9 w-9 text-white" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2l.9-1.4A2 2 0 0 1 9.3 3.7h5.4a2 2 0 0 1 1.7.9l.9 1.4h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" strokeLinejoin="round" />
              <circle cx="12" cy="12.3" r="3.2" />
            </svg>
          )}
        </button>

        <div className="text-center">
          <p className="font-display text-xl font-bold text-white">{pendingCount}</p>
          <p className="text-[11px] text-slate-500">in queue</p>
        </div>
      </div>
    </div>
  );
}
