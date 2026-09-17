const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** "16:9" for 1920×1080, "4:5" for 1080×1350; undefined when the reduced
 * ratio is something nobody would recognise (say 1001:733). */
export function aspectRatioLabel(
  width: number,
  height: number,
): string | undefined {
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return w <= 32 && h <= 32 ? `${w}:${h}` : undefined;
}
