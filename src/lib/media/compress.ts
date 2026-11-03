/**
 * Resizes a captured image to a JPEG on the phone before upload. Rejects
 * (rather than hanging) when the browser can't decode the file, e.g. HEIC on
 * most Android and desktop browsers.
 */
export async function toJpeg(file: Blob, maxSide = 2048, quality = 0.85): Promise<Blob> {
  const bitmap = await decode(file);
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(bitmap, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Encode failed'))), 'image/jpeg', quality),
    );
  } finally {
    if ('close' in bitmap) bitmap.close();
  }
}

/** createImageBitmap applies EXIF orientation; <img> is the fallback for older Safari. */
async function decode(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } catch {
    throw new Error('This photo format isn’t supported. Try taking it again.');
  } finally {
    URL.revokeObjectURL(url);
  }
}
