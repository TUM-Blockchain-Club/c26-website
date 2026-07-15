import { readCssTokenRgb } from "@/util/cssTokens";

export type CardOrientation = "landscape" | "portrait";

const DIMENSIONS: Record<CardOrientation, { w: number; h: number }> = {
  landscape: { w: 1920, h: 1080 },
  portrait: { w: 1080, h: 1350 },
};

const FPS = 30;
const DURATION_MS = 9000;

const CONFERENCE_DATE = "OCTOBER 29 TO 31, 2026";
const CONFERENCE_LOCATION = "MUNICH · HOUSE OF COMMUNICATION";
const CONFERENCE_URL = "conference26.tum-blockchain.com";
const ORGANISED_BY = "ORGANISED BY TUM BLOCKCHAIN CLUB";

type Assets = {
  confLogo: HTMLImageElement;
  ring: HTMLImageElement;
  partnerLogo: HTMLImageElement;
  useLightChip: boolean;
  colors: { yellow: string; red: string; purple: string };
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Decides whether the partner logo needs a light chip behind it. Samples the
 * logo's opaque pixels: dark ink would vanish on the dark card, so it gets a
 * white chip; light ink reads fine on a subtle glass panel.
 */
function partnerNeedsLightChip(img: HTMLImageElement): boolean {
  const s = 48;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const cx = c.getContext("2d");
  if (!cx) return true;

  const iw = img.naturalWidth || img.width || s;
  const ih = img.naturalHeight || img.height || s;
  const scale = Math.min(s / iw, s / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  cx.drawImage(img, (s - dw) / 2, (s - dh) / 2, dw, dh);

  let lumSum = 0;
  let count = 0;
  try {
    const data = cx.getImageData(0, 0, s, s).data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (alpha > 40) {
        lumSum +=
          0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        count++;
      }
    }
  } catch {
    return true;
  }

  if (count === 0) return true;
  return lumSum / count < 140; // dark ink → needs light chip
}

const MONO_FONT = "ui-monospace, Menlo, monospace";
const FALLBACK_SANS = '"Helvetica Neue", Arial, sans-serif';

let cachedBrandFont: string | null = null;
/** The site's own sans (Montserrat via next/font) so canvas text matches the
 * brand. Resolved from the body's computed style because next/font uses
 * hashed family names. */
function brandFont(): string {
  if (cachedBrandFont) return cachedBrandFont;
  try {
    const family = getComputedStyle(document.body).fontFamily;
    cachedBrandFont = family || FALLBACK_SANS;
  } catch {
    cachedBrandFont = FALLBACK_SANS;
  }
  return cachedBrandFont;
}

/** Sets ctx.font, falling back to a safe stack if the family fails to parse. */
function setFont(
  ctx: CanvasRenderingContext2D,
  weight: number,
  size: number,
  family: string,
) {
  const before = ctx.font;
  ctx.font = `${weight} ${size}px ${family}`;
  if (ctx.font === before && !before.includes(`${size}px`)) {
    ctx.font = `${weight} ${size}px ${FALLBACK_SANS}`;
  }
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const phase = (p: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  box: { x: number; y: number; w: number; h: number },
) {
  // SVGs without an intrinsic size report 0 — fall back to the box so they
  // still render instead of vanishing.
  const iw = img.naturalWidth || img.width || box.w;
  const ih = img.naturalHeight || img.height || box.h;
  const scale = Math.min(box.w / iw, box.h / ih);
  const w = iw * scale;
  const h = ih * scale;
  ctx.drawImage(img, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
}

/** Uppercase mono label with manual letter spacing. */
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: {
    size: number;
    spacing: number;
    color: string;
    alpha: number;
    align?: "left" | "center" | "right";
    weight?: number;
    maxWidth?: number;
    font?: string;
  },
) {
  if (o.alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = o.alpha;
  ctx.fillStyle = o.color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  let size = o.size;
  let spacing = o.spacing;
  const measure = () => {
    setFont(ctx, o.weight ?? 500, size, o.font ?? MONO_FONT);
    const chars = [...text];
    const widths = chars.map((ch) => ctx.measureText(ch).width);
    const total =
      widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    return { chars, widths, total };
  };

  let m = measure();
  if (o.maxWidth && m.total > o.maxWidth) {
    const k = o.maxWidth / m.total;
    size *= k;
    spacing *= k;
    m = measure();
  }

  let cx =
    o.align === "center"
      ? x - m.total / 2
      : o.align === "right"
        ? x - m.total
        : x;
  for (let i = 0; i < m.chars.length; i++) {
    ctx.fillText(m.chars[i], cx, y);
    cx += m.widths[i] + spacing;
  }
  ctx.restore();
}

/** Normal (non-mono) bold text that scales down to fit maxWidth. */
function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: {
    size: number;
    color: string;
    alpha: number;
    align?: "left" | "center" | "right";
    weight?: number;
    maxWidth?: number;
  },
) {
  if (o.alpha <= 0 || !text) return;
  ctx.save();
  ctx.globalAlpha = o.alpha;
  ctx.fillStyle = o.color;
  ctx.textBaseline = "middle";
  ctx.textAlign = o.align ?? "left";
  let size = o.size;
  setFont(ctx, o.weight ?? 700, size, brandFont());
  if (o.maxWidth) {
    const tw = ctx.measureText(text).width;
    if (tw > o.maxWidth) {
      size *= o.maxWidth / tw;
      setFont(ctx, o.weight ?? 700, size, brandFont());
    }
  }
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** The partner's organisation name. Long names wrap onto two balanced lines
 * instead of shrinking into unreadably small type. */
function drawOrgName(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: {
    size: number;
    alpha: number;
    align?: "left" | "center";
    maxWidth: number;
  },
) {
  if (o.alpha <= 0 || !text) return;

  setFont(ctx, 800, o.size, brandFont());
  const fullWidth = ctx.measureText(text).width;
  const words = text.split(/\s+/);

  // One comfortable line? Draw it as-is (fitted).
  if (fullWidth <= o.maxWidth || words.length === 1) {
    drawFittedText(ctx, text, x, y, {
      size: o.size,
      color: "#ffffff",
      alpha: o.alpha,
      weight: 800,
      align: o.align,
      maxWidth: o.maxWidth,
    });
    return;
  }

  // Split into two lines, balanced by character count.
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const diff = Math.abs(a - b);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  const line1 = words.slice(0, best).join(" ");
  const line2 = words.slice(best).join(" ");

  // Both lines share one size so they look uniform.
  const w1 = ctx.measureText(line1).width;
  const w2 = ctx.measureText(line2).width;
  const scale = Math.min(1, o.maxWidth / Math.max(w1, w2));
  const size = o.size * scale * 0.92;
  const lineGap = size * 1.18;

  drawFittedText(ctx, line1, x, y - lineGap / 2, {
    size,
    color: "#ffffff",
    alpha: o.alpha,
    weight: 800,
    align: o.align,
    maxWidth: o.maxWidth,
  });
  drawFittedText(ctx, line2, x, y + lineGap / 2, {
    size,
    color: "#ffffff",
    alpha: o.alpha,
    weight: 800,
    align: o.align,
    maxWidth: o.maxWidth,
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Soft color washes in opposite corners, for depth behind the ring. */
function drawAurora(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: Assets["colors"],
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  let g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.55);
  g.addColorStop(0, colors.yellow);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = alpha * 0.1;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  g = ctx.createRadialGradient(w, h, 0, w, h, w * 0.6);
  g.addColorStop(0, colors.purple);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = alpha * 0.16;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

/** Fine dot grid, like the site's texture. Very subtle. */
function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#ffffff";
  const gap = 64;
  const r = 1.6;
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawPartnerChip(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  box: { x: number; y: number; w: number; h: number },
  alpha: number,
  useLightChip: boolean,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = Math.min(box.w, box.h) * 0.11;
  if (useLightChip) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "rgba(255,255,255,0.97)";
    roundRectPath(ctx, box.x, box.y, box.w, box.h, r);
    ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    roundRectPath(ctx, box.x, box.y, box.w, box.h, r);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    roundRectPath(ctx, box.x, box.y, box.w, box.h, r);
    ctx.stroke();
  }
  const pad = Math.min(box.w, box.h) * 0.17;
  drawContain(ctx, logo, {
    x: box.x + pad,
    y: box.y + pad,
    w: box.w - pad * 2,
    h: box.h - pad * 2,
  });
  ctx.restore();
}

function drawDivider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  gradient: CanvasGradient,
  alpha: number,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.font = `800 ${size}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("×", x, y);
  ctx.restore();
}

/** Short gradient rule, used as an accent under the eyebrow. */
function drawAccentRule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  gradient: CanvasGradient,
  alpha: number,
  centered = false,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  roundRectPath(ctx, centered ? x - w / 2 : x, y, w * alpha, 5, 2.5);
  ctx.fill();
  ctx.restore();
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  dims: { w: number; h: number },
  a: Assets,
  p: number,
  elapsed: number,
  orientation: CardOrientation,
  partnerName: string,
) {
  const { w, h } = dims;

  // Base
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  const sceneIn = easeOut(phase(p, 0.0, 0.1));

  drawAurora(ctx, w, h, a.colors, sceneIn);
  drawDotGrid(ctx, w, h, sceneIn * 0.09);

  // Rotating brand ring — big, slow, hypnotic
  if (sceneIn > 0) {
    ctx.save();
    ctx.globalAlpha = sceneIn * 0.55;
    ctx.translate(w / 2, h * 0.5);
    ctx.rotate((elapsed / 1000) * 0.055);
    const pulse = 1 + Math.sin(elapsed / 1500) * 0.012;
    const ringSize = (orientation === "portrait" ? h * 1.3 : h * 2.6) * pulse;
    const ringW = ringSize * (a.ring.width / a.ring.height);
    ctx.drawImage(a.ring, -ringW / 2, -ringSize / 2, ringW, ringSize);
    ctx.restore();
  }

  // Vignette keeps the foreground legible over the ring
  const vignette = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.1,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.65,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0.62)");
  vignette.addColorStop(1, "rgba(0,0,0,0.08)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, a.colors.yellow);
  gradient.addColorStop(0.49, a.colors.red);
  gradient.addColorStop(1, a.colors.purple);

  // Gradient frame
  const frameAlpha = easeOut(phase(p, 0.02, 0.12));
  ctx.save();
  ctx.globalAlpha = frameAlpha;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = w * 0.0042;
  const fi = w * 0.024;
  roundRectPath(ctx, fi, fi, w - fi * 2, h - fi * 2, w * 0.022);
  ctx.stroke();
  ctx.restore();

  if (orientation === "landscape") {
    drawLandscape(ctx, dims, a, p, gradient, partnerName);
  } else {
    drawPortrait(ctx, dims, a, p, gradient, partnerName);
  }

  // Gentle fade in from black at the very start
  const intro = phase(p, 0, 0.05);
  if (intro < 1) {
    ctx.fillStyle = `rgba(0,0,0,${1 - easeOut(intro)})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawLandscape(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number },
  a: Assets,
  p: number,
  gradient: CanvasGradient,
  partnerName: string,
) {
  const P = 150;

  // Eyebrow + accent rule, in the brand's own type
  const eyebrowIn = easeOut(phase(p, 0.08, 0.18));
  drawAccentRule(
    ctx,
    P,
    h * 0.13 - 62,
    116,
    gradient,
    easeOut(phase(p, 0.06, 0.16)),
  );
  drawSpacedText(ctx, "COMMUNITY PARTNER", P, h * 0.13 + (1 - eyebrowIn) * 14, {
    size: 58,
    spacing: 18,
    color: "#ffffff",
    alpha: eyebrowIn,
    weight: 800,
    font: brandFont(),
    maxWidth: w - P * 2,
  });

  const cy = h * 0.52;

  // Partner logo (left)
  const chipIn = easeOut(phase(p, 0.14, 0.3));
  drawPartnerChip(
    ctx,
    a.partnerLogo,
    { x: P - (1 - chipIn) * 36, y: cy - 180, w: 530, h: 350 },
    chipIn,
    a.useLightChip,
  );

  // Partner organisation name under the chip
  drawOrgName(ctx, partnerName, P, cy + 245, {
    size: 62,
    alpha: easeOut(phase(p, 0.26, 0.38)),
    maxWidth: 530,
  });

  // × divider
  drawDivider(ctx, w * 0.5, cy, 155, gradient, easeOut(phase(p, 0.32, 0.42)));

  // Conference logo (right)
  const confIn = easeOut(phase(p, 0.38, 0.5));
  if (confIn > 0) {
    ctx.save();
    ctx.globalAlpha = confIn;
    drawContain(ctx, a.confLogo, {
      x: w * 0.58 + (1 - confIn) * 36,
      y: cy - 160,
      w: w * 0.34,
      h: 320,
    });
    ctx.restore();
  }

  drawSpacedText(ctx, ORGANISED_BY, w * 0.58, cy + 230, {
    size: 27,
    spacing: 6,
    color: "rgba(255,255,255,0.6)",
    alpha: easeOut(phase(p, 0.46, 0.55)),
    maxWidth: w * 0.34,
  });

  // Bottom bar: separator + info
  const infoIn = easeOut(phase(p, 0.5, 0.6));
  ctx.save();
  ctx.globalAlpha = infoIn * 0.18;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(P, h - 196, (w - P * 2) * infoIn, 2);
  ctx.restore();

  const by = h - 132 + (1 - infoIn) * 16;
  drawSpacedText(
    ctx,
    `${CONFERENCE_DATE}  ·  ${CONFERENCE_LOCATION}`,
    w / 2,
    by,
    {
      size: 40,
      spacing: 5,
      color: "rgba(255,255,255,0.95)",
      alpha: infoIn,
      align: "center",
      weight: 700,
      font: brandFont(),
      maxWidth: w - P * 2,
    },
  );
}

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number },
  a: Assets,
  p: number,
  gradient: CanvasGradient,
  partnerName: string,
) {
  const P = 110;

  const eyebrowIn = easeOut(phase(p, 0.08, 0.18));
  drawAccentRule(
    ctx,
    w / 2,
    h * 0.09 - 54,
    104,
    gradient,
    easeOut(phase(p, 0.06, 0.16)),
    true,
  );
  drawSpacedText(
    ctx,
    "COMMUNITY PARTNER",
    w / 2,
    h * 0.09 + (1 - eyebrowIn) * 14,
    {
      size: 44,
      spacing: 14,
      color: "#ffffff",
      alpha: eyebrowIn,
      align: "center",
      weight: 800,
      font: brandFont(),
      maxWidth: w - P * 2,
    },
  );

  const chipW = w - P * 2;
  const chipH = 290;
  const chipY = h * 0.155;

  const chipIn = easeOut(phase(p, 0.14, 0.3));
  drawPartnerChip(
    ctx,
    a.partnerLogo,
    { x: P, y: chipY - (1 - chipIn) * 24, w: chipW, h: chipH },
    chipIn,
    a.useLightChip,
  );

  drawOrgName(ctx, partnerName, w / 2, chipY + chipH + 64, {
    size: 54,
    alpha: easeOut(phase(p, 0.26, 0.38)),
    align: "center",
    maxWidth: chipW,
  });

  const dividerY = chipY + chipH + 168;
  drawDivider(
    ctx,
    w / 2,
    dividerY,
    100,
    gradient,
    easeOut(phase(p, 0.32, 0.42)),
  );

  const confIn = easeOut(phase(p, 0.38, 0.5));
  if (confIn > 0) {
    ctx.save();
    ctx.globalAlpha = confIn;
    drawContain(ctx, a.confLogo, {
      x: P,
      y: dividerY + 66 + (1 - confIn) * 24,
      w: w - P * 2,
      h: 210,
    });
    ctx.restore();
  }

  drawSpacedText(ctx, ORGANISED_BY, w / 2, dividerY + 330, {
    size: 25,
    spacing: 5,
    color: "rgba(255,255,255,0.6)",
    alpha: easeOut(phase(p, 0.46, 0.55)),
    align: "center",
    maxWidth: w - P * 2,
  });

  const infoIn = easeOut(phase(p, 0.5, 0.6));
  ctx.save();
  ctx.globalAlpha = infoIn * 0.16;
  ctx.fillStyle = "#ffffff";
  const sepW = (w - P * 2) * infoIn;
  ctx.fillRect(w / 2 - sepW / 2, h - 236, sepW, 2);
  ctx.restore();

  const by = h - 188 + (1 - infoIn) * 16;
  drawSpacedText(ctx, CONFERENCE_LOCATION, w / 2, by, {
    size: 32,
    spacing: 3,
    color: "rgba(255,255,255,0.95)",
    alpha: infoIn,
    align: "center",
    weight: 700,
    font: brandFont(),
    maxWidth: w - P * 2,
  });
  drawSpacedText(ctx, CONFERENCE_DATE, w / 2, by + 56, {
    size: 32,
    spacing: 3,
    color: "rgba(255,255,255,0.95)",
    alpha: infoIn,
    align: "center",
    weight: 700,
    font: brandFont(),
    maxWidth: w - P * 2,
  });
  drawSpacedText(ctx, CONFERENCE_URL, w / 2, by + 108, {
    size: 26,
    spacing: 2,
    color: "rgba(255,255,255,0.55)",
    alpha: infoIn,
    align: "center",
    maxWidth: w - P * 2,
  });
}

async function loadAssets(partnerLogoUrl: string): Promise<Assets> {
  const [confLogo, ring, partnerLogo] = await Promise.all([
    loadImage("/logos/c26-wordmark.svg"),
    loadImage("/hero/mask-group-1.png"),
    loadImage(partnerLogoUrl),
  ]);
  return {
    confLogo,
    ring,
    partnerLogo,
    useLightChip: partnerNeedsLightChip(partnerLogo),
    colors: {
      yellow: readCssTokenRgb("--color-brand-yellow-rgb", "255 193 16"),
      red: readCssTokenRgb("--color-brand-red-rgb", "244 67 54"),
      purple: readCssTokenRgb("--color-brand-purple-rgb", "111 61 226"),
    },
  };
}

/** Renders one frame at progress p / elapsed ms. Exposed for previews. */
export async function renderPartnerCardFrame(
  partnerLogoUrl: string,
  orientation: CardOrientation,
  partnerName: string,
  p: number,
  elapsedMs: number,
): Promise<HTMLCanvasElement> {
  const dims = DIMENSIONS[orientation];
  const canvas = document.createElement("canvas");
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  try {
    await document.fonts.ready;
  } catch {
    // System fonts are fine as a fallback.
  }

  const assets = await loadAssets(partnerLogoUrl);
  drawCard(ctx, dims, assets, p, elapsedMs, orientation, partnerName);
  return canvas;
}

/** Renders a single still (the fully composed end state) as a PNG. */
export async function renderPartnerCardStill(
  partnerLogoUrl: string,
  orientation: CardOrientation,
  partnerName: string,
): Promise<Blob> {
  const canvas = await renderPartnerCardFrame(
    partnerLogoUrl,
    orientation,
    partnerName,
    1,
    6500,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG export failed"));
    }, "image/png");
  });
}

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "video/mp4;codecs=avc1",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

export type VideoResult = { blob: Blob; extension: "mp4" | "webm" };

/** Renders the animated partner card and records it to a downloadable video. */
export async function renderPartnerCardVideo(
  partnerLogoUrl: string,
  orientation: CardOrientation,
  partnerName: string,
  onProgress?: (p: number) => void,
): Promise<VideoResult> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Your browser does not support video recording.");
  }

  const dims = DIMENSIONS[orientation];
  const canvas = document.createElement("canvas");
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  try {
    await document.fonts.ready;
  } catch {
    // System fonts are fine as a fallback.
  }

  const assets = await loadAssets(partnerLogoUrl);

  // Draw the first frame before capturing so the stream starts populated.
  drawCard(ctx, dims, assets, 0, 0, orientation, partnerName);

  const stream = canvas.captureStream(FPS);
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(
    stream,
    mimeType ? { mimeType, videoBitsPerSecond: 9_000_000 } : undefined,
  );
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const finalType = mimeType ?? "video/webm";
  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: finalType }));
  });

  recorder.start();
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / DURATION_MS);
      drawCard(ctx, dims, assets, p, elapsed, orientation, partnerName);
      onProgress?.(p);
      if (elapsed < DURATION_MS) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
  recorder.stop();

  const blob = await stopped;
  stream.getTracks().forEach((t) => t.stop());

  return {
    blob,
    extension: finalType.startsWith("video/mp4") ? "mp4" : "webm",
  };
}
