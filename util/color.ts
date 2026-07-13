/** Converts an "R G B" custom-property triplet (e.g. "255 193 16") to #RRGGBB. */
export function rgbTripletToHex(triplet: string): string {
  const [r, g, b] = triplet
    .trim()
    .split(/\s+/)
    .map((n) => Math.max(0, Math.min(255, Number(n) || 0)));

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Formats an "R G B" triplet as an rgb()/rgba() CSS function string. */
export function rgbTripletToCss(triplet: string, alpha?: number): string {
  const [r, g, b] = triplet.trim().split(/\s+/);
  return alpha === undefined
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
