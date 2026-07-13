/**
 * Reads a design token defined in app/globals.css `:root` at runtime, so
 * non-CSS contexts (Canvas 2D, inline SVG attributes) stay wired to the
 * same source of truth instead of hardcoding a copy of the color.
 *
 * Token custom properties are stored as "R G B" triplets (e.g. "255 59 88"),
 * matching the `rgb(var(--x) / <alpha>)` convention used everywhere else.
 */
export function readCssTokenRgb(varName: string, fallbackRgb: string): string {
  const [r, g, b] = readCssTokenRgbTuple(varName, fallbackRgb);
  return `rgb(${r},${g},${b})`;
}

/** Same as readCssTokenRgb, but returns the [r, g, b] numbers directly. */
export function readCssTokenRgbTuple(
  varName: string,
  fallbackRgb: string,
): [number, number, number] {
  const triplet =
    typeof window === "undefined"
      ? fallbackRgb
      : getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim() || fallbackRgb;

  const [r, g, b] = triplet.trim().split(/\s+/).map(Number);
  return [r, g, b];
}
