/**
 * Client-side image compression shared by every card generator's upload
 * step. Large files are downscaled and re-encoded — losslessly (PNG) when
 * the image has real transparency, since JPEG has no alpha channel and would
 * silently turn a cut-out's transparent background solid; otherwise as a
 * high-quality JPEG, small enough to be practical without visible artefacts.
 * SVGs are vector and already tiny, so they pass through untouched.
 */

export type PreparedImage = { url: string; file: File };

// Skip processing entirely if the file is already this modest.
const KEEP_ORIGINAL_UNDER = 5 * 1024 * 1024;

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Not a decodable image"));
    img.src = url;
  });
}

/** True if the image contains any non-fully-opaque pixel — a real cut-out,
 * not just an image that happens to be a PNG. */
function hasTransparency(img: HTMLImageElement): boolean {
  const s = 48;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const cx = c.getContext("2d");
  if (!cx) return false;

  const iw = img.naturalWidth || img.width || s;
  const ih = img.naturalHeight || img.height || s;
  // Cover-fit, not contain: fills the whole sample so a non-square opaque
  // image can't read as "transparent" just from its own letterboxed margin.
  const scale = Math.max(s / iw, s / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  cx.drawImage(img, (s - dw) / 2, (s - dh) / 2, dw, dh);

  try {
    const data = cx.getImageData(0, 0, s, s).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true;
    }
    return false;
  } catch {
    // Cross-origin or otherwise unreadable — assume opaque rather than
    // silently forcing PNG for every image.
    return false;
  }
}

/**
 * Downscales an oversized image to `maxDim` and re-encodes it. Pass
 * `jpegQuality` to allow a lossy JPEG fallback for opaque photos (smaller
 * files); omit it to always keep PNG (for logos, where crisp edges and any
 * transparency must never be touched).
 */
export async function prepareImage(
  file: File,
  { maxDim, jpegQuality }: { maxDim: number; jpegQuality?: number },
): Promise<PreparedImage> {
  if (file.type === "image/svg+xml") {
    return { url: URL.createObjectURL(file), file };
  }

  const srcUrl = URL.createObjectURL(file);
  let img: HTMLImageElement;
  try {
    img = await loadImageElement(srcUrl);
  } catch (err) {
    URL.revokeObjectURL(srcUrl);
    throw err;
  }

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const scale = Math.min(1, maxDim / Math.max(w, h || 1));

  if (scale === 1 && file.size <= KEEP_ORIGINAL_UNDER) {
    return { url: srcUrl, file };
  }

  const transparent = hasTransparency(img);
  const usePng = transparent || !jpegQuality;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return { url: srcUrl, file };
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(srcUrl);

  const mime = usePng ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), mime, usePng ? undefined : jpegQuality),
  );
  if (!blob) throw new Error("Could not compress the image");

  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  const ext = usePng ? "png" : "jpg";
  const compressed = new File([blob], `${base}.${ext}`, { type: mime });
  return { url: URL.createObjectURL(blob), file: compressed };
}
