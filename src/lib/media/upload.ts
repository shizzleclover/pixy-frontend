import { api } from '@/lib/api/client';
import { ApiError, isApiError } from '@/lib/api/http';

/** Thrown when retrying can't help: the photo is dropped and the guest told why. */
export class PermanentUploadError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'PermanentUploadError';
  }
}

/** Status codes worth retrying: no response, timeouts, rate limits, server errors. */
const transient = (status: number) => status === 0 || status === 408 || status === 429 || status >= 500;

/**
 * presign → PUT straight to storage → complete. Throws PermanentUploadError
 * for refusals (uploads closed, bad file, over the cap); anything else
 * (offline, 5xx) is left for the queue to retry.
 */
export async function uploadPhoto(slug: string, blob: Blob): Promise<void> {
  const contentType = blob.type || 'image/jpeg';
  try {
    const { items } = await api.presignUploads(slug, [{ contentType, bytes: blob.size, kind: 'photo' }]);
    const target = items[0];

    let put: Response;
    try {
      put = await fetch(target.uploadUrl, { method: 'PUT', headers: target.headers, body: blob });
    } catch {
      throw new ApiError(0, 'NETWORK', 'Upload interrupted');
    }
    if (!put.ok) throw new ApiError(put.status, `STORAGE_${put.status}`, 'Storage refused the upload');

    const done = await api.completeUploads(slug, [{ mediaId: target.mediaId, framed: false }]);
    const result = done.items[0];
    if (result && 'error' in result) throw new PermanentUploadError(result.error.code, result.error.message);
  } catch (err) {
    if (err instanceof PermanentUploadError) throw err;
    if (isApiError(err) && !transient(err.status)) throw new PermanentUploadError(err.code, err.message);
    throw err;
  }
}
