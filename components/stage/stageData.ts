import {
  getAgendaEntries,
  getConvertedSlides,
  getSpeakers,
  getSponsors,
} from "@/components/service/conference26";
import { peopleOf } from "@/components/agenda/sessionMeta";
import {
  ROOMS,
  roomOfStage,
  type AgendaEventKey,
} from "@/constants/digitalAssetsDayAgenda";
import { bareName, speakerLinksFrom } from "@/util/speakerPortraits";
import { OPENING_SESSION } from "@/components/stage/OpeningDeck";

/** One of the three rooms, by the slug used in the stage display's URL. */
export const STAGE_ROOMS = ROOMS.map((r) => ({
  slug: r.room.split(" ")[0].toLowerCase(),
  room: r.room,
  labels: r.labels,
}));

export type StageRoom = (typeof STAGE_ROOMS)[number];

export type StagePerson = {
  name: string;
  /** Job title and company, kept apart so the company can stand out. */
  position?: string;
  company?: string;
  photo?: string;
  moderator: boolean;
};

/** One slot on a stage, as the display needs it: absolute times, so the
 * browser can compare them against its own clock. */
/** A sponsor's logo, with whether its dark ink needs a white plate. */
export type StageSponsor = {
  name: string;
  tier: string;
  src: string;
  light: boolean;
};

export type StageSlot = {
  id: string;
  kind: "talk" | "break";
  event: AgendaEventKey;
  /** The stage's name on that day, e.g. "Main Stage" on the Digital Assets Day. */
  stage: string;
  start: number;
  end: number;
  /** Wall-clock times in Munich, for display. */
  startLabel: string;
  endLabel: string;
  title: string;
  format?: string;
  timeTba?: boolean;
  people: StagePerson[];
  /** The Digital Assets Day focus track, and who presents it. */
  track?: string;
  trackSponsors?: { name: string; src: string; light: boolean }[];
  /** Every sponsor, for the opening ceremony's thank-you slide only. */
  sponsors?: StageSponsor[];
  /** Slides from Strapi that the screen can show: PDFs and images. */
  slides?: { src: string; kind: "pdf" | "image"; name: string }[];
  /** Files on the session the screen cannot show (PowerPoint, Keynote…);
   * the studio asks for a PDF export instead. */
  slidesSkipped?: string[];
};

/**
 * Munich wall-clock time on a conference day as an instant. All three days
 * (29 to 31 October 2026) fall after the change back to CET on 25 October,
 * so the offset is a fixed +01:00.
 */
const instant = (day: string, time: string) =>
  Date.parse(`${day}T${time}:00+01:00`);

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (ms: number) => {
  const d = new Date(ms + 60 * 60 * 1000); // to CET wall time
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
};

/** Length given to a slot the programme lists with a start time only. */
const OPEN_ENDED_MIN = 30;

export const getStageSlots = async (room: StageRoom): Promise<StageSlot[]> => {
  const [entries, speakers, sponsors, converted] = await Promise.all([
    getAgendaEntries(),
    getSpeakers(),
    getSponsors(),
    getConvertedSlides(),
  ]);
  const byTrack = new Map<string, StageSlot["trackSponsors"]>();
  for (const sp of sponsors) {
    if (sp.tier !== "track" || !sp.dayTrack) continue;
    const list = byTrack.get(sp.dayTrack) ?? [];
    // "light" means dark ink that needs a white plate behind it.
    list.push({ name: sp.name, src: sp.src, light: sp.background === "light" });
    byTrack.set(sp.dayTrack, list);
  }
  const links = new Map(
    speakerLinksFrom(speakers).map((s) => [bareName(s.name), s]),
  );

  const slots: StageSlot[] = [];
  for (const e of entries) {
    if (e.kind !== "talk" && e.kind !== "break") continue;
    if (roomOfStage(e.stage) !== room.room) continue;
    const start = instant(e.day, e.time);
    const minutes = (e as { duration?: number }).duration ?? OPEN_ENDED_MIN;
    const end = start + minutes * 60 * 1000;
    const base = {
      event: e.event,
      stage: e.stage,
      start,
      end,
      startLabel: clock(start),
      endLabel: clock(end),
    };
    if (e.kind === "break") {
      slots.push({
        ...base,
        id: `break-${e.day}-${e.time}-${e.stage}`,
        kind: "break",
        title: e.label,
        people: [],
      });
      continue;
    }
    slots.push({
      ...base,
      id: e.id,
      kind: "talk",
      title: e.title ?? "To be announced",
      ...(e.format ? { format: e.format } : {}),
      ...(e.track ? { track: e.track } : {}),
      ...(() => {
        // PDFs and images show as they are; PowerPoint, Keynote and ODP show
        // as the PDF the convert-slides workflow made of them, in the same
        // place in the order. Anything else is listed for the studio.
        const files: NonNullable<StageSlot["slides"]> = [];
        const skipped: string[] = [];
        for (const f of e.slides ?? []) {
          const pdf = f.mime === "application/pdf" || /\.pdf$/i.test(f.name);
          const made = f.hash ? converted.get(f.hash) : undefined;
          if (pdf || f.mime.startsWith("image/"))
            files.push({
              src: f.src,
              kind: pdf ? "pdf" : "image",
              name: f.name,
            });
          else if (made) files.push({ src: made, kind: "pdf", name: f.name });
          else skipped.push(f.name);
        }
        return {
          ...(files.length ? { slides: files } : {}),
          ...(skipped.length ? { slidesSkipped: skipped } : {}),
        };
      })(),
      ...(e.track && byTrack.get(e.track)
        ? { trackSponsors: byTrack.get(e.track) }
        : {}),
      // Set once the Hackathon agenda work lands; harmless before that.
      ...((e as { timeTba?: boolean }).timeTba ? { timeTba: true } : {}),
      people: peopleOf(e).map(({ name, moderator }) => {
        const link = links.get(bareName(name));
        return {
          name,
          moderator,
          ...(link?.position ? { position: link.position } : {}),
          ...(link?.company ? { company: link.company } : {}),
          ...(link?.photo ? { photo: link.photo } : {}),
        };
      }),
    });
  }
  const opening = slots.find((sl) => sl.id === OPENING_SESSION);
  if (opening)
    opening.sponsors = sponsors.map((sp) => ({
      name: sp.name,
      tier: sp.tier,
      src: sp.src,
      light: sp.background === "light",
    }));
  return slots.sort((a, b) => a.start - b.start || a.end - b.end);
};
