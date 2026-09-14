import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type ImageDimensions = {
  width: number;
  height: number;
  /** Aspect ratio like "16:9", or undefined when it reduces to something
   * nobody would recognise (say 1001:733). */
  ratio?: string;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * Reads the pixel size of a file in `public/`, so the size printed next to a
 * download is measured from the file itself and cannot drift from it.
 * Returns null when the file is missing, which lets a listed asset that has
 * not been added yet simply be skipped instead of breaking the build.
 */
export async function readImageDimensions(
  publicSrc: string,
): Promise<ImageDimensions | null> {
  try {
    const file = await readFile(
      path.join(process.cwd(), "public", publicSrc.replace(/^\//, "")),
    );
    const { width, height } = await sharp(file).metadata();
    if (!width || !height) return null;

    const divisor = gcd(width, height);
    const w = width / divisor;
    const h = height / divisor;
    return {
      width,
      height,
      ratio: w <= 32 && h <= 32 ? `${w}:${h}` : undefined,
    };
  } catch {
    return null;
  }
}
