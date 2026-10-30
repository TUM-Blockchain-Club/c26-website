/**
 * This year's content, read from Strapi at build time and refreshed while the
 * site is live.
 *
 * Everything the conference team edits — the agenda, the speakers, the side
 * events — lives in Strapi and is fetched here. The hardcoded lists under
 * `constants/` stay in the repo as a fallback: if Strapi is unreachable, the
 * token is wrong or a collection comes back empty, the page renders the last
 * known good programme instead of an empty one. That has already saved the
 * site once, when the production token lost read access to the partners.
 *
 * The fallback is loud, not silent: every failure logs what went wrong and
 * which list it fell back to, so a broken token shows up in the build log.
 *
 * Shapes are deliberately the ones the pages already use (`AgendaEntry`,
 * `Speaker`, `SideEvent26`), so Strapi feeds the existing components without
 * changing how anything renders.
 *
 * Freshness: each request is cached for REVALIDATE seconds and tagged, so
 * Strapi's webhook can push a change through immediately via
 * /api/revalidate. See docs/strapi.md.
 *
 * Server side only. It reads STRAPI_API_TOKEN, which has no NEXT_PUBLIC
 * prefix and so never reaches the browser; importing this from a client
 * component would hand it an undefined token and a failed fetch. The browser
 * side of the agenda gets its data as props, through AgendaDataProvider.
 */
import type {
  AgendaEntry,
  AgendaEventKey,
  AgendaTrackName,
} from "@/constants/digitalAssetsDayAgenda";
import { agendaEntries as fallbackAgenda } from "@/constants/digitalAssetsDayAgenda";
import { speakers26 as fallbackSpeakers } from "@/constants/Speakers26";
import { sideEvents26 as fallbackSideEvents } from "@/constants/sideEvents26";
import type { SideEvent26 } from "@/constants/sideEvents26";
import type {
  Speaker,
  ProfilePicture,
} from "@/components/service/contentStrapi";
import type { Sponsor26, Sponsor26Tier } from "@/constants/sponsors26";
import { sponsors26 as fallbackSponsors } from "@/constants/sponsors26";
import { detectLogoBackground } from "@/util/logoTone";
import { bareName } from "@/util/speakerPortraits";

const STRAPI = "https://strapi.rbg.tum-blockchain.com";

/** How long a cached answer is served before Strapi is asked again. Short
 * enough that an edit appears on its own within the minute, long enough that
 * a busy page does not hammer Strapi. The webhook makes it immediate. */
export const REVALIDATE = 60;

/** Cache tags, so /api/revalidate can refresh one kind of content. */
export const TAGS = {
  agenda: "agenda-26",
  speakers: "speakers-26",
  sideEvents: "side-events-26",
  partners: "community-partners-26",
  sponsors: "sponsors-26",
} as const;

type StrapiList<T> = {
  data: T[];
  meta?: { pagination?: { page: number; pageCount: number } };
};

/**
 * Reads every page of a collection. Returns null — not an empty array — when
 * anything goes wrong, so the caller can tell "Strapi says there is nothing"
 * from "Strapi did not answer" and only fall back in the second case.
 */
const fetchAll = async <T>(
  endpoint: string,
  query: string,
  tag: string,
): Promise<T[] | null> => {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.warn(`[strapi] no STRAPI_API_TOKEN, skipping ${endpoint}`);
    return null;
  }

  const rows: T[] = [];
  for (let page = 1; page < 50; page++) {
    const url =
      `${STRAPI}/api/${endpoint}?${query}` +
      `&pagination[page]=${page}&pagination[pageSize]=100`;
    let body: StrapiList<T>;
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: REVALIDATE, tags: [tag] },
      });
      if (!res.ok) {
        console.error(`[strapi] ${endpoint} answered ${res.status}`);
        return null;
      }
      body = await res.json();
    } catch (err) {
      console.error(`[strapi] ${endpoint} unreachable:`, err);
      return null;
    }
    rows.push(...(body.data ?? []));
    const pagination = body.meta?.pagination;
    if (!pagination || pagination.page >= pagination.pageCount) break;
  }
  return rows;
};

/** Says which list is in use, once per build, so a silent fallback is visible. */
const announce = (what: string, from: "strapi" | "code", count: number) =>
  console.log(
    from === "strapi"
      ? `[strapi] ${what}: ${count} from Strapi`
      : `[strapi] ${what}: falling back to the ${count} in the repo`,
  );

// --------------------------------------------------------------- speakers

type StrapiSpeaker = {
  documentId: string;
  /** The anchor of the card on /speakers, carried in Strapi because the
   * hand-made ones cannot be derived from the name. */
  slug: string | null;
  name: string;
  position: string | null;
  company_name: string | null;
  url: string | null;
  priority: number | null;
  profile_photo?: { url: string; ext?: string } | null;
};

/**
 * Fallback anchor for a speaker Strapi carries without a slug, built the way
 * the hand-made ones were: `c26-`, academic titles dropped, German umlauts
 * written out the German way, accents folded. Four of the ninety-eight
 * hand-made anchors still differ from any rule, which is why the real one is
 * a field in Strapi rather than a derivation.
 */
export const speakerAnchor = (name: string) =>
  "c26-" +
  name
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^(?:(?:Prof\.|Dr\.(?:-Ing\.)?)\s+)+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const toSpeaker = (s: StrapiSpeaker, index: number): Speaker => ({
  id: index + 1,
  // Not Strapi's own documentId: that one is random, and the anchors are
  // links people have shared.
  documentId: s.slug || speakerAnchor(s.name),
  name: s.name,
  position: s.position ?? "",
  company_name: s.company_name ?? "",
  url: s.url ?? "",
  priority: s.priority ?? index + 1,
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
  profile_photo: s.profile_photo?.url
    ? ({ url: STRAPI + s.profile_photo.url } as ProfilePicture)
    : null,
});

export const getSpeakers = async (): Promise<Speaker[]> => {
  const rows = await fetchAll<StrapiSpeaker>(
    "speakers26",
    "sort=priority:asc&populate=profile_photo",
    TAGS.speakers,
  );
  if (!rows || rows.length === 0) {
    announce("speakers", "code", fallbackSpeakers.length);
    return fallbackSpeakers;
  }
  announce("speakers", "strapi", rows.length);
  return rows.map(toSpeaker);
};

// ----------------------------------------------------------------- agenda

type StrapiSession = {
  documentId: string;
  sessionId: string | null;
  /** Which of the three parts the session belongs to, chosen in the admin. */
  event: AgendaEventKey | null;
  title: string | null;
  /** The abstract, plain text. Empty for most sessions, panels included. */
  description?: string | null;
  type: string | null;
  startTime: string;
  /** Missing where the programme gives only a start time. */
  endTime: string | null;
  /** Missing where the programme names no room. */
  room: string | null;
  /** Planned slot whose time is not confirmed yet. */
  timeTba?: boolean | null;
  track: string | null;
  /** The names as the organisers' export spells them, kept for anyone who
   * has no speaker card of their own. */
  speakerNames?: Record<string, string> | null;
  /** The linked speaker records, which is what the admin edits. */
  speakers?: { name: string }[] | null;
  /** The speaker's slides, uploaded on the session: PDFs and images. */
  slides?:
    | {
        url: string;
        mime?: string | null;
        name?: string | null;
        hash?: string | null;
        /** kB, as Strapi reports it. */
        size?: number | null;
      }[]
    | null;
};

/** Only for a session saved before `event` existed: the two conference days
 * have their own dates, anything else is the Hackathon. */
const eventOfDay = (day: string): AgendaEventKey =>
  day === "2026-10-29"
    ? "conference"
    : day === "2026-10-30"
      ? "digital-assets-day"
      : "hackathon";

/**
 * Strapi stores an instant, the agenda shows a wall clock. Both conference
 * days are in CET, so the date and time are read back in Europe/Berlin rather
 * than UTC, where 09:00 would become 08:00.
 */
const berlin = (iso: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    day: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};

const toEntry = (s: StrapiSession): AgendaEntry | null => {
  if (!s.startTime) return null;
  const { day, time } = berlin(s.startTime);
  // The Hackathon gives some entries a start time only; they show it alone.
  const duration = s.endTime
    ? Math.round((Date.parse(s.endTime) - Date.parse(s.startTime)) / 60000)
    : undefined;
  const stage = s.room ?? "";
  const common = { event: s.event ?? eventOfDay(day), day };
  // A field cleared in the admin comes back as "" or whitespace rather than
  // null, and should render as no abstract at all.
  const description =
    typeof s.description === "string" ? s.description.trim() : "";

  // A milestone ("Hackathon Starts"), or a meal given only a start time, is
  // one quiet line in the feed, like a break, but without a length.
  if (
    s.type === "Milestone" ||
    (s.type === "Break" && duration === undefined)
  ) {
    return {
      ...common,
      kind: "milestone",
      time,
      ...(stage ? { stage } : {}),
      label: s.title ?? "",
    };
  }

  if (s.type === "Break") {
    return {
      ...common,
      kind: "break",
      time,
      duration: duration ?? 0,
      stage,
      label: s.title ?? "Break",
    };
  }

  // The linked speakers are the record; the name field is only consulted for
  // people without a card, so a session never shows a name twice.
  // The moderator is carried separately, and is also among the linked
  // speakers, so they have to come out of the list or the session credits
  // them twice.
  const moderator = s.speakerNames?.moderator;
  const linked = (s.speakers ?? []).map((x) => x.name).filter(Boolean);
  // "remote" is no person of its own: it names, comma-separated, who joins
  // the session by video, for the stage screens to say so.
  const remote = (s.speakerNames?.remote ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const named = Object.entries(s.speakerNames ?? {})
    .filter(([key]) => key !== "moderator" && key !== "remote")
    .map(([, value]) => value)
    .filter(Boolean);

  // Both sources describe the same people: the relation spells a speaker the
  // way their own card does, the name field the way the organisers' export
  // does, down to an academic title or an accent. Comparing them folded keeps
  // "Dr. Hagen Weiss" and "Hagen Weiss" from both ending up on the card.
  // The name field leads, because its order is the order the organisers put
  // the panel in, and the relation comes back in Strapi's own. Speakers only
  // linked in the admin are appended after it.
  const seen = new Set<string>();
  if (moderator) seen.add(bareName(moderator));
  const speakers = [...named, ...linked].filter((name) => {
    const key = bareName(name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    ...common,
    kind: "talk",
    id: s.sessionId || s.documentId,
    time,
    ...(duration !== undefined ? { duration } : {}),
    ...(s.timeTba ? { timeTba: true } : {}),
    stage,
    ...(s.track ? { track: s.track as AgendaTrackName } : {}),
    ...(s.title ? { title: s.title } : {}),
    ...(description ? { description } : {}),
    ...(s.type ? { format: s.type } : {}),
    ...(speakers.length ? { speakers } : {}),
    ...(moderator ? { moderator } : {}),
    ...(remote.length ? { remote } : {}),
    ...(s.slides?.length
      ? {
          slides: s.slides.map((f) => ({
            src: STRAPI + f.url,
            mime: f.mime ?? "",
            name: f.name ?? "",
            hash: f.hash ?? "",
            ...(f.size ? { size: f.size } : {}),
          })),
        }
      : {}),
  };
};

/**
 * The speakers' slides are not public: only the stage screens ask for them
 * with `withSlides`. Everything the public agenda renders goes without, so
 * the file links never reach the page or its payload.
 */
export const getAgendaEntries = async ({
  withSlides = false,
}: { withSlides?: boolean } = {}): Promise<AgendaEntry[]> => {
  const [rows, converted] = await Promise.all([
    fetchAll<StrapiSession>(
      "agenda-26s",
      "sort=startTime:asc&populate=*",
      TAGS.agenda,
    ),
    withSlides ? getConvertedSlides() : new Map<string, string>(),
  ]);
  if (!rows || rows.length === 0) {
    announce("agenda", "code", fallbackAgenda.length);
    return fallbackAgenda;
  }
  const entries = rows
    .map(toEntry)
    .filter((e): e is AgendaEntry => e !== null)
    .map((e): AgendaEntry => {
      if (e.kind !== "talk" || !e.slides) return e;
      if (!withSlides) {
        const { slides: _slides, ...rest } = e;
        return rest;
      }
      // A PowerPoint, Keynote or ODP file gets the PDF made of it, so the
      // stage can open it in the browser.
      return {
        ...e,
        slides: e.slides.map((f) => {
          const pdf = f.hash ? converted.get(f.hash) : undefined;
          return pdf ? { ...f, pdf } : f;
        }),
      };
    });
  if (entries.length === 0) {
    console.error("[strapi] agenda: every session was unusable");
    announce("agenda", "code", fallbackAgenda.length);
    return fallbackAgenda;
  }
  announce("agenda", "strapi", entries.length);
  return entries;
};

/** Every talk of the live programme, in order. */
/**
 * PDFs made from uploaded PowerPoint, Keynote or ODP slides by the
 * convert-slides workflow (`scripts/convert_slides.py`). Each is named
 * `slides-pdf-<hash of the original>.pdf`; returns hash -> PDF URL.
 */
export const getConvertedSlides = async (): Promise<Map<string, string>> => {
  const token = process.env.STRAPI_API_TOKEN;
  const out = new Map<string, string>();
  if (!token) return out;
  try {
    const res = await fetch(
      `${STRAPI}/api/upload/files?filters[name][$startsWith]=slides-pdf-&fields[0]=name&fields[1]=url`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: REVALIDATE, tags: ["converted-slides"] },
      },
    );
    if (!res.ok) return out;
    const files: { name: string; url: string }[] = await res.json();
    for (const f of files) {
      const m = /^slides-pdf-(.+)\.pdf$/.exec(f.name);
      if (m) out.set(m[1], STRAPI + f.url);
    }
  } catch {
    // No converted slides: the originals are reported in the studio.
  }
  return out;
};

export const getAgendaTalks = async () =>
  (await getAgendaEntries()).filter(
    (e): e is Extract<AgendaEntry, { kind: "talk" }> => e.kind === "talk",
  );

export const getTalkById = async (id: string) =>
  (await getAgendaTalks()).find((t) => t.id === id);

// ------------------------------------------------------------ side events

type StrapiSideEvent = {
  documentId: string;
  eventId: string | null;
  title: string;
  tagline: string | null;
  description: string | null;
  host: string | null;
  venue: string | null;
  language: "German" | "English" | null;
  free: boolean | null;
  topics: string[] | null;
  note: string | null;
  startTime: string;
  endTime: string;
  link: string;
  image?: { url: string } | null;
};

const toSideEvent = (e: StrapiSideEvent): SideEvent26 => {
  const start = berlin(e.startTime);
  const end = berlin(e.endTime);
  return {
    id: e.eventId || e.documentId,
    title: e.title,
    tagline: e.tagline ?? "",
    description: e.description ?? "",
    host: e.host ?? "",
    date: start.day,
    start: start.time,
    end: end.time,
    venue: e.venue ?? "",
    language: e.language ?? "English",
    free: e.free ?? false,
    topics: Array.isArray(e.topics) ? e.topics : [],
    link: e.link,
    ...(e.note ? { note: e.note } : {}),
    ...(e.image?.url ? { image: STRAPI + e.image.url } : {}),
  };
};

export const getSideEvents = async (): Promise<SideEvent26[]> => {
  const rows = await fetchAll<StrapiSideEvent>(
    "side-events-26",
    "sort=startTime:asc&populate=image",
    TAGS.sideEvents,
  );
  if (!rows || rows.length === 0) {
    announce("side events", "code", fallbackSideEvents.length);
    return fallbackSideEvents;
  }
  announce("side events", "strapi", rows.length);
  return rows.map(toSideEvent);
};

// -------------------------------------------------------------- sponsors

type StrapiSponsor = {
  documentId: string;
  name: string;
  tier: Sponsor26Tier | null;
  website: string | null;
  /** Only meaningful for the "track" tier: the Digital Assets Day track they
   * back, spelled as the agenda spells it. */
  dayTrack: string | null;
  logo?: { url: string } | null;
};

/**
 * Which card a logo belongs on is measured from its own pixels rather than
 * typed in, the same way the community partner logos are handled: a light
 * wordmark would disappear on the white card. The artwork itself is never
 * touched.
 */
const sponsorBackground = async (url: string) => {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) throw new Error(`${res.status}`);
    return await detectLogoBackground(Buffer.from(await res.arrayBuffer()));
  } catch (err) {
    console.error(`[strapi] logo tone for ${url} could not be measured:`, err);
    // The white card is the common case, so an unmeasured logo lands there.
    return "light" as const;
  }
};

export const getSponsors = async (): Promise<Sponsor26[]> => {
  const rows = await fetchAll<StrapiSponsor>(
    "sponsor-26s",
    "sort=name:asc&populate=logo",
    TAGS.sponsors,
  );
  const usable = (rows ?? []).filter((s) => s.tier && s.logo?.url);
  if (!rows || usable.length === 0) {
    announce("sponsors", "code", fallbackSponsors.length);
    return fallbackSponsors;
  }
  announce("sponsors", "strapi", usable.length);
  return Promise.all(
    usable.map(async (s) => {
      const src = STRAPI + s.logo!.url;
      return {
        name: s.name,
        tier: s.tier as Sponsor26Tier,
        src,
        website: s.website ?? "",
        ...(s.dayTrack ? { dayTrack: s.dayTrack } : {}),
        background: await sponsorBackground(src),
      };
    }),
  );
};
