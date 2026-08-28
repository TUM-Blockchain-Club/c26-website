import sharp from "sharp";

/** Which card background a logo should sit on. */
export type LogoBackground = "light" | "dark";

const LUMINANCE = (r: number, g: number, b: number) =>
  (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/**
 * Picks the card background for a partner logo by looking at the pixels.
 *
 * Two cases, because partners send both kinds of file:
 *  - Logo on a transparent canvas: only the visible ink counts, and the card
 *    takes the opposite tone so the ink stays readable (white ink → dark card).
 *  - Logo with a baked-in background: the card copies that background's tone
 *    instead, so the image edge does not show as a hard rectangle.
 *
 * Falls back to "light" (the white card) if the image cannot be read.
 */
export const detectLogoBackground = async (
  image: Buffer,
): Promise<LogoBackground> => {
  try {
    const { data, info } = await sharp(image, { density: 200 })
      .resize(64, 64, { fit: "inside" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    let transparent = 0;
    let inkWeight = 0;
    let inkLuminance = 0;
    let edgeCount = 0;
    let edgeLuminance = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels;
        const alpha = data[i + 3];
        const luminance = LUMINANCE(data[i], data[i + 1], data[i + 2]);

        if (alpha < 32) {
          transparent++;
          continue;
        }

        inkWeight += alpha;
        inkLuminance += luminance * alpha;

        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          edgeCount++;
          edgeLuminance += luminance;
        }
      }
    }

    const transparentRatio = transparent / (width * height);

    if (transparentRatio > 0.05) {
      if (inkWeight === 0) return "light";
      // Bright ink needs a dark card, dark ink a white one.
      return inkLuminance / inkWeight > 0.6 ? "dark" : "light";
    }

    if (edgeCount === 0) return "light";
    // Opaque file: match the baked-in background instead of fighting it.
    return edgeLuminance / edgeCount > 0.5 ? "light" : "dark";
  } catch (error) {
    console.error("Could not analyse logo:", error);
    return "light";
  }
};
