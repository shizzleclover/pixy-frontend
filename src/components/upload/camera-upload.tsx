'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api/client';

export default function CameraUpload({ slug, guestToken }: { slug: string, guestToken: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const presignData = await api.presignUploads(slug, guestToken, 
        files.map(f => ({ contentType: f.type, bytes: f.size, kind: 'photo' as const }))
      );

      const uploadPromises = files.map(async (file, idx) => {
        const item = presignData.items[idx];
        await fetch(item.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        return { mediaId: item.mediaId, framed: false };
      });

      const completed = await Promise.all(uploadPromises);
      await api.completeUploads(slug, guestToken, completed);
      setUploaded(prev => prev + files.length);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
        multiple
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-6 py-4 bg-black text-white rounded-lg text-lg disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Take Photo'}
      </button>
      {uploaded > 0 && (
        <p className="mt-2 text-center text-sm text-gray-600">{uploaded} photo(s) uploaded</p>
      )}
    </div>
  );
}
