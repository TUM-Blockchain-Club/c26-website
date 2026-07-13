/** Client-side SVG → PNG rasterization, so wordmarks only shipped as SVG
 * can still offer a PNG download without a build-time asset pipeline. */
export async function svgToPngBlob(
  svgUrl: string,
  targetWidth: number,
): Promise<Blob> {
  const svgText = await fetch(svgUrl).then((res) => res.text());
  const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });

    const aspect = img.naturalHeight / img.naturalWidth || 1;
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = Math.round(targetWidth * aspect);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) throw new Error("PNG export failed");
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
