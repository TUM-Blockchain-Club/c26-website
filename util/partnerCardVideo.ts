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

export type SpeakerDay = "day1" | "day2";

/** Bottom of the card: line 1 is the speaker's own day, line 2 is the whole
 * conference (which always runs October 29 to 31), shown on every card. */
const DAY_PRIMARY: Record<SpeakerDay, string> = {
  day1: "FIRST CONFERENCE DAY · OCT 29",
  day2: "DIGITAL ASSETS DAY · OCT 30",
};
const CONFERENCE_SPAN =
  "TUM BLOCKCHAIN CONFERENCE 26 · OCTOBER 29 TO 31, 2026 · MUNICH";

// Digital Assets Day accent, matching the .card-blue / .btn-blue tokens.
// Kept within that same light-to-mid blue range on purpose — earlier drafts
// darkened the third stop into a navy, which read as too dark on the card.
const DAD_COLORS = {
  yellow: "rgb(130,180,255)",
  red: "rgb(66,133,244)",
  purple: "rgb(96,155,255)",
};

/**
 * What differs between the partner card and the speaker card: the eyebrow line
 * and whether the uploaded image is a logo (auto light chip) or a photo (always
 * contained on the subtle glass panel, never a white chip).
 */
export type CardConfig = {
  kind: "partner" | "speaker" | "attendee";
  eyebrow: string;
  /** Force the glass panel instead of a white chip — used for photos. */
  photo?: boolean;
};

export const PARTNER_CARD_CONFIG: CardConfig = {
  kind: "partner",
  eyebrow: "COMMUNITY PARTNER",
};

export const SPEAKER_CARD_CONFIG: CardConfig = {
  kind: "speaker",
  eyebrow: "I'M SPEAKING AT",
  photo: true,
};

/** Generic attendee card: no day split, always the conference brand and logo. */
export const ATTENDEE_CARD_CONFIG: CardConfig = {
  kind: "attendee",
  eyebrow: "I'M ATTENDING",
  photo: true,
};

/**
 * The text on the card. Partners only fill `name`; speakers also add their
 * `job` and a short `blurb` about their talk.
 */
export type CardContent = {
  name: string;
  job?: string;
  blurb?: string;
  /** Which day the speaker is on. Day 2 is the Digital Assets Day (blue). */
  day?: SpeakerDay;
};

/** How many characters each field can hold and still lay out cleanly. */
export const SPEAKER_LIMITS = {
  name: 26,
  job: 40,
  blurb: 160,
} as const;

type Assets = {
  confLogo: HTMLImageElement;
  dadLogo: HTMLImageElement;
  ring: HTMLImageElement | HTMLCanvasElement;
  partnerLogo: HTMLImageElement;
  useLightChip: boolean;
  /** Whether the uploaded image has real transparency (a cut-out subject). */
  photoHasAlpha: boolean;
  kind: CardConfig["kind"];
  eyebrow: string;
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
  content: CardContent,
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

  if (a.kind === "speaker" || a.kind === "attendee") {
    if (orientation === "landscape") {
      drawPersonLandscape(ctx, dims, a, p, gradient, content);
    } else {
      drawPersonPortrait(ctx, dims, a, p, gradient, content);
    }
  } else if (orientation === "landscape") {
    drawLandscape(ctx, dims, a, p, gradient, content.name);
  } else {
    drawPortrait(ctx, dims, a, p, gradient, content.name);
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
  drawSpacedText(ctx, a.eyebrow, P, h * 0.13 + (1 - eyebrowIn) * 14, {
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
  drawSpacedText(ctx, a.eyebrow, w / 2, h * 0.09 + (1 - eyebrowIn) * 14, {
    size: 44,
    spacing: 14,
    color: "#ffffff",
    alpha: eyebrowIn,
    align: "center",
    weight: 800,
    font: brandFont(),
    maxWidth: w - P * 2,
  });

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

/** Cover-fills an opaque photo into a rounded rect. */
function drawPhotoCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  box: { x: number; y: number; w: number; h: number },
  radius: number,
  alpha: number,
) {
  if (alpha <= 0) return;
  const iw = img.naturalWidth || img.width || box.w;
  const ih = img.naturalHeight || img.height || box.h;
  const scale = Math.max(box.w / iw, box.h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 18;
  roundRectPath(ctx, box.x, box.y, box.w, box.h, radius);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  roundRectPath(ctx, box.x, box.y, box.w, box.h, radius);
  ctx.clip();
  ctx.drawImage(
    img,
    box.x + (box.w - dw) / 2,
    box.y + (box.h - dh) / 2,
    dw,
    dh,
  );
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  roundRectPath(ctx, box.x, box.y, box.w, box.h, radius);
  ctx.stroke();
  ctx.restore();
}

/**
 * The speaker's photo. A cut-out (transparent) image floats straight on the
 * brand background; a normal photo is cover-filled into a rounded tile.
 */
function drawSpeakerPhoto(
  ctx: CanvasRenderingContext2D,
  a: Assets,
  box: { x: number; y: number; w: number; h: number },
  alpha: number,
  radius: number,
) {
  if (alpha <= 0) return;
  if (a.photoHasAlpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    drawContain(ctx, a.partnerLogo, box);
    ctx.restore();
  } else {
    drawPhotoCover(ctx, a.partnerLogo, box, radius, alpha);
  }
}

/** Wraps text into lines that fit maxWidth, capped at maxLines. */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  o: { size: number; weight: number; maxWidth: number; maxLines: number },
): string[] {
  setFont(ctx, o.weight, o.size, brandFont());
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width <= o.maxWidth || !line) {
      line = trial;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === o.maxLines - 1) break;
    }
  }
  if (line && lines.length < o.maxLines) lines.push(line);
  return lines;
}

/** Draws a wrapped paragraph. */
function drawParagraph(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  o: {
    size: number;
    weight: number;
    color: string;
    alpha: number;
    maxWidth: number;
    maxLines: number;
    align?: "left" | "center";
    lineGap?: number;
  },
) {
  if (o.alpha <= 0 || !text) return;
  const lines = wrapLines(ctx, text, {
    size: o.size,
    weight: o.weight,
    maxWidth: o.maxWidth,
    maxLines: o.maxLines,
  });
  const gap = o.lineGap ?? o.size * 1.34;
  let cy = y;
  for (const line of lines) {
    drawFittedText(ctx, line, x, cy, {
      size: o.size,
      color: o.color,
      alpha: o.alpha,
      weight: o.weight,
      align: o.align ?? "left",
      maxWidth: o.maxWidth,
    });
    cy += gap;
  }
}

function drawPersonLandscape(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number },
  a: Assets,
  p: number,
  gradient: CanvasGradient,
  content: CardContent,
) {
  const P = 150;
  const day: SpeakerDay = content.day ?? "day1";
  const isAttendee = a.kind === "attendee";
  const topLogo = !isAttendee && day === "day2" ? a.dadLogo : a.confLogo;

  // Small logo, top-right corner only (Digital Assets Day mark on day 2).
  const logoIn = easeOut(phase(p, 0.06, 0.18));
  if (logoIn > 0) {
    ctx.save();
    ctx.globalAlpha = logoIn;
    drawContain(ctx, topLogo, { x: w - P - 430, y: 92, w: 430, h: 116 });
    ctx.restore();
  }

  // Eyebrow, top-left.
  const eyebrowIn = easeOut(phase(p, 0.1, 0.2));
  drawAccentRule(
    ctx,
    P,
    156 - 40,
    116,
    gradient,
    easeOut(phase(p, 0.08, 0.18)),
  );
  drawSpacedText(ctx, a.eyebrow, P, 156 + (1 - eyebrowIn) * 14, {
    size: 46,
    spacing: 14,
    color: "#ffffff",
    alpha: eyebrowIn,
    weight: 800,
    font: brandFont(),
    maxWidth: w * 0.5,
  });

  // Photo, left.
  const photoIn = easeOut(phase(p, 0.16, 0.32));
  drawSpeakerPhoto(
    ctx,
    a,
    { x: P - (1 - photoIn) * 30, y: 250, w: 560, h: 660 },
    photoIn,
    40,
  );

  // Text column, right of the photo.
  const colX = P + 560 + 80;
  const colW = w - colX - P;

  drawFittedText(ctx, content.name, colX, 430, {
    size: 100,
    color: "#ffffff",
    alpha: easeOut(phase(p, 0.28, 0.4)),
    weight: 800,
    align: "left",
    maxWidth: colW,
  });

  if (content.job) {
    drawFittedText(ctx, content.job, colX, 524, {
      size: 46,
      color: a.colors.yellow,
      alpha: easeOut(phase(p, 0.36, 0.46)),
      weight: 700,
      align: "left",
      maxWidth: colW,
    });
  }

  if (content.blurb) {
    drawParagraph(ctx, content.blurb, colX, 620, {
      size: 40,
      weight: 500,
      color: "rgba(255,255,255,0.82)",
      alpha: easeOut(phase(p, 0.44, 0.56)),
      maxWidth: colW,
      maxLines: 4,
      align: "left",
      lineGap: 56,
    });
  }

  // Date and location along the bottom.
  const infoIn = easeOut(phase(p, 0.52, 0.64));
  ctx.save();
  ctx.globalAlpha = infoIn * 0.16;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(P, h - 196, (w - P * 2) * infoIn, 2);
  ctx.restore();
  if (isAttendee) {
    // No day split for attendees — just the whole conference, one line.
    drawSpacedText(ctx, CONFERENCE_SPAN, w / 2, h - 112, {
      size: 32,
      spacing: 5,
      color: "rgba(255,255,255,0.95)",
      alpha: infoIn,
      align: "center",
      weight: 800,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
  } else {
    drawSpacedText(ctx, DAY_PRIMARY[day], w / 2, h - 138, {
      size: 36,
      spacing: 6,
      color: "rgba(255,255,255,0.95)",
      alpha: infoIn,
      align: "center",
      weight: 800,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
    drawSpacedText(ctx, CONFERENCE_SPAN, w / 2, h - 90, {
      size: 26,
      spacing: 4,
      color: "rgba(255,255,255,0.62)",
      alpha: infoIn,
      align: "center",
      weight: 600,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
  }
}

function drawPersonPortrait(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number },
  a: Assets,
  p: number,
  gradient: CanvasGradient,
  content: CardContent,
) {
  const P = 110;
  const day: SpeakerDay = content.day ?? "day1";
  const isAttendee = a.kind === "attendee";
  const topLogo = !isAttendee && day === "day2" ? a.dadLogo : a.confLogo;

  const logoIn = easeOut(phase(p, 0.06, 0.18));
  if (logoIn > 0) {
    ctx.save();
    ctx.globalAlpha = logoIn;
    drawContain(ctx, topLogo, { x: w - P - 300, y: 96, w: 300, h: 88 });
    ctx.restore();
  }

  const eyebrowIn = easeOut(phase(p, 0.1, 0.2));
  drawAccentRule(
    ctx,
    w / 2,
    240 - 40,
    104,
    gradient,
    easeOut(phase(p, 0.08, 0.18)),
    true,
  );
  drawSpacedText(ctx, a.eyebrow, w / 2, 240 + (1 - eyebrowIn) * 14, {
    size: 40,
    spacing: 12,
    color: "#ffffff",
    alpha: eyebrowIn,
    align: "center",
    weight: 800,
    font: brandFont(),
    maxWidth: w - P * 2,
  });

  const photoIn = easeOut(phase(p, 0.16, 0.32));
  const pw = 560;
  drawSpeakerPhoto(
    ctx,
    a,
    { x: (w - pw) / 2, y: 300 - (1 - photoIn) * 20, w: pw, h: 560 },
    photoIn,
    44,
  );

  drawFittedText(ctx, content.name, w / 2, 950, {
    size: 74,
    color: "#ffffff",
    alpha: easeOut(phase(p, 0.3, 0.42)),
    weight: 800,
    align: "center",
    maxWidth: w - P * 2,
  });

  if (content.job) {
    drawFittedText(ctx, content.job, w / 2, 1018, {
      size: 38,
      color: a.colors.yellow,
      alpha: easeOut(phase(p, 0.38, 0.48)),
      weight: 700,
      align: "center",
      maxWidth: w - P * 2,
    });
  }

  if (content.blurb) {
    drawParagraph(ctx, content.blurb, w / 2, 1082, {
      size: 34,
      weight: 500,
      color: "rgba(255,255,255,0.82)",
      alpha: easeOut(phase(p, 0.46, 0.58)),
      maxWidth: w - P * 2,
      maxLines: 3,
      align: "center",
      lineGap: 46,
    });
  }

  const infoIn = easeOut(phase(p, 0.54, 0.66));
  if (isAttendee) {
    drawSpacedText(ctx, CONFERENCE_SPAN, w / 2, h - 96, {
      size: 26,
      spacing: 3,
      color: "rgba(255,255,255,0.95)",
      alpha: infoIn,
      align: "center",
      weight: 800,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
  } else {
    drawSpacedText(ctx, DAY_PRIMARY[day], w / 2, h - 122, {
      size: 30,
      spacing: 4,
      color: "rgba(255,255,255,0.95)",
      alpha: infoIn,
      align: "center",
      weight: 800,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
    drawSpacedText(ctx, CONFERENCE_SPAN, w / 2, h - 78, {
      size: 22,
      spacing: 2,
      color: "rgba(255,255,255,0.62)",
      alpha: infoIn,
      align: "center",
      weight: 600,
      font: brandFont(),
      maxWidth: w - P * 2,
    });
  }
}

/** Samples an image's alpha to tell a cut-out subject from an opaque photo. */
function detectHasAlpha(img: HTMLImageElement): boolean {
  const s = 48;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const cx = c.getContext("2d");
  if (!cx) return false;
  const iw = img.naturalWidth || img.width || s;
  const ih = img.naturalHeight || img.height || s;
  const scale = Math.min(s / iw, s / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  cx.clearRect(0, 0, s, s);
  cx.drawImage(img, (s - dw) / 2, (s - dh) / 2, dw, dh);
  try {
    const data = cx.getImageData(0, 0, s, s).data;
    let transparent = 0;
    const total = s * s;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 16) transparent++;
    }
    // The letterbox around a contained image is transparent too; only count
    // transparency beyond that as a genuine cut-out.
    const letterbox = 1 - (dw * dh) / (s * s);
    return transparent / total - letterbox > 0.06;
  } catch {
    return false;
  }
}

/** Recolours the brand ring into the Digital Assets Day blue gradient, keeping
 * its shape and alpha, so the background graphic matches the day 2 theme. */
function tintRingBlue(
  img: HTMLImageElement,
): HTMLImageElement | HTMLCanvasElement {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) return img;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const cx = c.getContext("2d");
  if (!cx) return img;
  cx.drawImage(img, 0, 0, w, h);
  cx.globalCompositeOperation = "source-in";
  const g = cx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, DAD_COLORS.yellow);
  g.addColorStop(0.5, DAD_COLORS.red);
  g.addColorStop(1, DAD_COLORS.purple);
  cx.fillStyle = g;
  cx.fillRect(0, 0, w, h);
  return c;
}

async function loadAssets(
  partnerLogoUrl: string,
  config: CardConfig,
  day: SpeakerDay = "day1",
): Promise<Assets> {
  const [confLogo, dadLogo, ring, partnerLogo] = await Promise.all([
    loadImage("/logos/c26-wordmark.svg"),
    loadImage("/logos/digital-assets-day-logo.png"),
    loadImage("/hero/mask-group-1.png"),
    loadImage(partnerLogoUrl),
  ]);
  const brandColors = {
    yellow: readCssTokenRgb("--color-brand-yellow-rgb", "255 193 16"),
    red: readCssTokenRgb("--color-brand-red-rgb", "244 67 54"),
    purple: readCssTokenRgb("--color-brand-purple-rgb", "111 61 226"),
  };
  // Only the speaker card has a per-day theme; attendees always see the
  // conference brand, regardless of what `day` defaults to.
  const isDad = config.kind === "speaker" && day === "day2";
  return {
    confLogo,
    dadLogo,
    ring: isDad ? tintRingBlue(ring) : ring,
    partnerLogo,
    // Photos always sit on the glass panel; only logos may get a white chip.
    useLightChip: config.photo ? false : partnerNeedsLightChip(partnerLogo),
    photoHasAlpha: config.photo ? detectHasAlpha(partnerLogo) : false,
    kind: config.kind,
    eyebrow: config.eyebrow,
    colors: isDad ? DAD_COLORS : brandColors,
  };
}

/** A plain name (partner) or the full content object (speaker). */
const toContent = (x: string | CardContent): CardContent =>
  typeof x === "string" ? { name: x } : x;

/** Renders one frame at progress p / elapsed ms. Exposed for previews. */
export async function renderPartnerCardFrame(
  partnerLogoUrl: string,
  orientation: CardOrientation,
  nameOrContent: string | CardContent,
  p: number,
  elapsedMs: number,
  config: CardConfig = PARTNER_CARD_CONFIG,
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

  const content = toContent(nameOrContent);
  const assets = await loadAssets(partnerLogoUrl, config, content.day);
  drawCard(ctx, dims, assets, p, elapsedMs, orientation, content);
  return canvas;
}

/** Renders a single still (the fully composed end state) as a PNG. */
export async function renderPartnerCardStill(
  partnerLogoUrl: string,
  orientation: CardOrientation,
  nameOrContent: string | CardContent,
  config: CardConfig = PARTNER_CARD_CONFIG,
): Promise<Blob> {
  const canvas = await renderPartnerCardFrame(
    partnerLogoUrl,
    orientation,
    nameOrContent,
    1,
    6500,
    config,
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
  nameOrContent: string | CardContent,
  onProgress?: (p: number) => void,
  config: CardConfig = PARTNER_CARD_CONFIG,
): Promise<VideoResult> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("Your browser does not support video recording.");
  }
  const content = toContent(nameOrContent);

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

  const assets = await loadAssets(partnerLogoUrl, config, content.day);

  // Draw the first frame before capturing so the stream starts populated.
  drawCard(ctx, dims, assets, 0, 0, orientation, content);

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
      drawCard(ctx, dims, assets, p, elapsed, orientation, content);
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

/** Speaker card: same brand animation, "I'M SPEAKING AT", photo + name/job/blurb. */
export const renderSpeakerCardVideo = (
  photoUrl: string,
  orientation: CardOrientation,
  content: CardContent,
  onProgress?: (p: number) => void,
): Promise<VideoResult> =>
  renderPartnerCardVideo(
    photoUrl,
    orientation,
    content,
    onProgress,
    SPEAKER_CARD_CONFIG,
  );

export const renderSpeakerCardStill = (
  photoUrl: string,
  orientation: CardOrientation,
  content: CardContent,
): Promise<Blob> =>
  renderPartnerCardStill(photoUrl, orientation, content, SPEAKER_CARD_CONFIG);

/** Attendee card: same brand animation, "I'M ATTENDING", no day split. */
export const renderAttendeeCardVideo = (
  photoUrl: string,
  orientation: CardOrientation,
  content: CardContent,
  onProgress?: (p: number) => void,
): Promise<VideoResult> =>
  renderPartnerCardVideo(
    photoUrl,
    orientation,
    content,
    onProgress,
    ATTENDEE_CARD_CONFIG,
  );

export const renderAttendeeCardStill = (
  photoUrl: string,
  orientation: CardOrientation,
  content: CardContent,
): Promise<Blob> =>
  renderPartnerCardStill(photoUrl, orientation, content, ATTENDEE_CARD_CONFIG);
