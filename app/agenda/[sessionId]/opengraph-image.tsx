import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { dayLabel, peopleOf, timeRange } from "@/components/agenda/sessionMeta";
import {
  getAgendaTalks,
  getSpeakers,
  getTalkById,
} from "@/components/service/conference26";
import { roleLine, speakerLinksFrom, bareName } from "@/util/speakerPortraits";

/**
 * The preview LinkedIn, X, WhatsApp and the rest show for a session's link:
 * day, time and stage, the title, and every confirmed speaker with portrait,
 * name and role. Rendered once per session at build time.
 */
export const alt = "Session at the TUM Blockchain Conference 26";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A literal, because Next reads segment config statically. Keep it in step
// with the cache lifetime in components/service/conference26.ts.
export const revalidate = 60;

export const generateStaticParams = async () =>
  (await getAgendaTalks()).map((t) => ({ sessionId: t.id }));

const ACCENT = {
  conference: {
    label: "TUM Blockchain Conference Day",
    color: "#ffc110",
    glow: "radial-gradient(circle at 92% 0%, rgba(255,193,16,0.28), transparent 45%), radial-gradient(circle at 100% 100%, rgba(111,61,226,0.32), transparent 50%), radial-gradient(circle at 0% 100%, rgba(244,67,54,0.18), transparent 45%)",
  },
  "digital-assets-day": {
    label: "Digital Assets Day",
    color: "#7aa7ff",
    glow: "radial-gradient(circle at 92% 0%, rgba(66,133,244,0.4), transparent 50%), radial-gradient(circle at 0% 100%, rgba(66,133,244,0.2), transparent 50%)",
  },
  hackathon: {
    label: "Hackathon",
    color: "#f87171",
    glow: "radial-gradient(circle at 92% 0%, rgba(239,68,68,0.35), transparent 50%)",
  },
} as const;

// Only ever runs during the build, where the whole project is on disk.
const fromRoot = (...path: string[]) =>
  join(/*turbopackIgnore: true*/ process.cwd(), ...path);

const dataUrl = async (path: string, type: string) =>
  `data:${type};base64,${(await readFile(path)).toString("base64")}`;

/**
 * A portrait, whether it comes from Strapi or from the copy in `public`.
 *
 * Satori cannot load a URL itself, so the bytes have to be inlined either
 * way. The type comes from the file rather than being assumed: the portraits
 * are a mix of JPEG, PNG and WebP, and declaring the wrong one leaves the
 * preview with a blank circle.
 */
const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

const portraitDataUrl = async (photo: string) => {
  const ext = photo.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  const type = MIME[ext] ?? "image/jpeg";
  if (!photo.startsWith("http"))
    return dataUrl(fromRoot("public", photo), type);
  try {
    const res = await fetch(photo);
    if (!res.ok) throw new Error(`${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:${res.headers.get("content-type") ?? type};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error(`[og] portrait ${photo} could not be loaded:`, err);
    return undefined;
  }
};

const Silhouette = ({ px }: { px: number }) => (
  <div
    style={{
      display: "flex",
      width: px,
      height: px,
      borderRadius: px,
      overflow: "hidden",
      background: "rgba(255,255,255,0.15)",
      border: "2px solid rgba(255,255,255,0.25)",
    }}
  >
    <svg viewBox="0 0 40 40" width={px} height={px}>
      <circle cx="20" cy="15" r="7.5" fill="#000" />
      <path d="M5 41c2-8.5 8-13 15-13s13 4.5 15 13Z" fill="#000" />
    </svg>
  </div>
);

export default async function Image({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const talk = await getTalkById((await params).sessionId);
  if (!talk) return new Response("Not found", { status: 404 });

  const accent = ACCENT[talk.event];
  const [medium, bold, wordmark] = await Promise.all([
    readFile(fromRoot("assets/fonts/Montserrat-500.ttf")),
    readFile(fromRoot("assets/fonts/Montserrat-700.ttf")),
    dataUrl(fromRoot("public/logos/c26-wordmark.svg"), "image/svg+xml"),
  ]);

  const byName = new Map(
    speakerLinksFrom(await getSpeakers()).map((s) => [bareName(s.name), s]),
  );
  const people = await Promise.all(
    peopleOf(talk).map(async ({ name, moderator }) => {
      const link = byName.get(bareName(name));
      return {
        name,
        moderator,
        role: roleLine(link),
        photo: link ? await portraitDataUrl(link.photo) : undefined,
      };
    }),
  );

  // One or two people get a row each with room for their full role; a panel
  // gets a column each.
  const wide = people.length <= 2;
  const photoPx = wide ? 112 : 80;
  // Columns share the content width (1072px) between however many there are.
  const gap = wide ? 48 : 24;
  const columnPx = wide
    ? 520
    : Math.floor((1072 - gap * (people.length - 1)) / people.length);
  const title = talk.title ?? "Title to be announced";
  // A panel's column of names needs more height, so its title gives way.
  const titleSize =
    title.length > 80 ? (wide ? 46 : 42) : title.length > 50 ? 52 : 60;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        backgroundImage: accent.glow,
        color: "#fff",
        fontFamily: "Montserrat",
        padding: "52px 64px 56px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={wordmark} height={68} width={132} />
        <div
          style={{
            display: "flex",
            border: `2px solid ${accent.color}`,
            color: accent.color,
            borderRadius: 999,
            padding: "8px 22px",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {accent.label}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 34,
          fontSize: 27,
          fontWeight: 700,
          color: accent.color,
        }}
      >
        {`${dayLabel(talk.day)} · ${timeRange(talk.time, talk.duration)} · ${talk.stage}`}
      </div>

      <div
        style={{
          display: "block",
          marginTop: 14,
          fontSize: titleSize,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: -1,
          lineClamp: 3,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "auto",
          paddingTop: 20,
          gap,
        }}
      >
        {people.map((p) => (
          <div
            key={p.name}
            style={{
              display: "flex",
              flexDirection: wide ? "row" : "column",
              alignItems: wide ? "center" : "flex-start",
              gap: wide ? 22 : 12,
              width: columnPx,
            }}
          >
            {p.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.photo}
                alt={p.name}
                width={photoPx}
                height={photoPx}
                style={{
                  borderRadius: photoPx,
                  border: "2px solid rgba(255,255,255,0.25)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Silhouette px={photoPx} />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // Grows sideways next to the photo; under it, flex: 1 would
                // squeeze the text block to no height at all.
                ...(wide ? { flex: 1, minWidth: 0 } : { width: "100%" }),
              }}
            >
              {/* Capped at two lines by height: Satori's lineClamp is
                  unreliable inside flex columns. */}
              <div
                style={{
                  display: "flex",
                  fontSize: wide ? 30 : 20,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxHeight: (wide ? 30 : 20) * 1.2 * 2,
                  overflow: "hidden",
                }}
              >
                {p.name}
              </div>
              {p.role && (
                <div
                  style={{
                    display: "flex",
                    marginTop: 4,
                    fontSize: wide ? 21 : 15,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    maxHeight: (wide ? 21 : 15) * 1.3 * 2,
                    overflow: "hidden",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {p.role}
                </div>
              )}
              {p.moderator && (
                <div
                  style={{
                    display: "flex",
                    marginTop: 4,
                    fontSize: wide ? 18 : 15,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Moderation
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: medium, weight: 500, style: "normal" },
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
