'use client';

import { createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import { useGuest } from '@/hooks/use-guest';
import { useUploadQueue } from '@/hooks/use-upload-queue';

type Queue = ReturnType<typeof useUploadQueue>;
const UploadQueueContext = createContext<Queue | null>(null);

/** One upload queue per room, alive on every room page so it keeps draining. */
export function UploadQueueProvider({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { isJoined } = useGuest(slug);
  return isJoined ? <Active slug={slug}>{children}</Active> : <>{children}</>;
}

function Active({ slug, children }: { slug: string; children: React.ReactNode }) {
  const queue = useUploadQueue(slug);
  return <UploadQueueContext.Provider value={queue}>{children}</UploadQueueContext.Provider>;
}

export function useRoomUploads(): Queue | null {
  return useContext(UploadQueueContext);
}
