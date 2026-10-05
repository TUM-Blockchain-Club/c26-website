import classNames from "classnames";
import { Text } from "@/components/text";
import { SpeakerFaces, facesOf } from "@/components/agenda/SpeakerFaces";
import { AgendaSpeakers } from "@/components/agenda/AgendaSpeakers";
import {
  AGENDA_TRACKS,
  agendaEntries,
  type AgendaEntry,
  type AgendaEventKey,
} from "@/constants/digitalAssetsDayAgenda";

/**
 * One conference day as a time-aligned grid of parallel stages, falling back
 * to a chronological list on narrow screens. Both the First Conference Day and
 * the Digital Assets Day use it; they differ only in their stages, their
 * accent and their intro, which the page passes in.
 */

/** A session that carries no track still needs a colour for its left edge. */
const NEUTRAL = {
  dot: "bg-[#d9d9d9]",
  accent: "border-l-line-strong",
};
const trackStyle = (name?: string) =>
  AGENDA_TRACKS.find((t) => t.name === name) ?? NEUTRAL;

type Talk = Extract<AgendaEntry, { kind: "talk" }>;
type Break = Extract<AgendaEntry, { kind: "break" }>;

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const endStr = (start: string, dur: number) => {
  const end = toMin(start) + dur;
  return `${Math.floor(end / 60)}:${String(end % 60).padStart(2, "0")}`;
};
const rangeLabel = (start: string, dur: number) =>
  `${start} – ${endStr(start, dur)} · ${dur} min`;

// Time axis for the aligned grid. Both days run inside 8:00 to 18:00; anything
// open-ended after that is a band underneath.
const GRID_START = 8 * 60;
const GRID_END = 18 * 60;
const PX = 2.9;
const HOURS = Array.from(
  { length: (GRID_END - GRID_START) / 60 + 1 },
  (_, i) => GRID_START / 60 + i,
);

/** Smallest readable card: padding and the time line, plus a line per line of
 * title. A 10 minute slot is only 29px at the nominal scale and even a long
 * session can carry a title too long for it, so both get stretched to fit. */
// Measured against both days: at 40 a dozen cards came out one or two pixels
// short of their own content, which is rounding in the line boxes rather than
// a lost line. Four more pixels of slack absorbs it.
const CARD_CHROME = 44;
const LINE = 16;
const CHARS_PER_LINE = 36;
const MIN_BREAK = 24;
/** The flex gap the card puts between title and names. */
const CARD_GAP = 6;
/** Height of the small face row, matching the "sm" size in SpeakerFaces. */
const FACE_ROW = 24;

/** Confirmed speakers, and the moderator after them. Declared rather than
 * assigned because the time scale below is built while the module loads, and
 * that runs before any const in this file is initialised. */
function namesOf(talk: Talk) {
  const parts = [...(talk.speakers ?? [])];
  if (talk.moderator) parts.push(`${talk.moderator} (moderation)`);
  return parts.length ? parts.join(", ") : undefined;
}

const minHeightFor = (title: string | undefined, names?: string) => {
  const lines = Math.min(Math.ceil((title ?? "").length / CHARS_PER_LINE), 4);
  // The names sit under the title on their own lines, so the segment has to
  // grow with them or they are clipped out of the card.
  // Names wrap earlier than a title does — they are long and never break
  // mid-word — and they add one more gap to the card's flex column.
  const nameLines = names ? Math.min(Math.ceil(names.length / 30), 4) : 0;
  const nameRoom = names ? nameLines * LINE + CARD_GAP : 0;
  // A session with names also carries their faces on a row of their own.
  const faceRoom = names ? FACE_ROW + CARD_GAP : 0;
  return CARD_CHROME + Math.max(lines, 1) * LINE + nameRoom + faceRoom;
};

/**
 * A slightly elastic time scale for one day. Every stage of that day maps
 * minutes to pixels through the same function, so the columns stay aligned,
 * but segments holding a session too short to be legible are stretched until
 * it fits. Built once per day, from every session boundary of that day.
 */
const buildDay = (event: AgendaEventKey) => {
  const mine = agendaEntries.filter((e) => e.event === event);
  const talks = mine.filter((e): e is Talk => e.kind === "talk");
  const breaks = mine.filter((e): e is Break => e.kind === "break");

  const blocks = [
    ...talks.map((t) => ({
      start: toMin(t.time),
      end: toMin(t.time) + t.duration,
      min: minHeightFor(t.title, namesOf(t)),
    })),
    ...breaks.map((b) => ({
      start: toMin(b.time),
      end: toMin(b.time) + b.duration,
      min: MIN_BREAK,
    })),
  ].filter((b) => b.end > GRID_START && b.start < GRID_END);

  const marks = new Set<number>([GRID_START, GRID_END]);
  HOURS.forEach((h) => marks.add(h * 60));
  blocks.forEach(({ start, end }) => {
    marks.add(Math.max(start, GRID_START));
    marks.add(Math.min(end, GRID_END));
  });
  const bounds = [...marks].sort((a, b) => a - b);

  const segments = bounds.slice(0, -1).map((from, i) => ({
    from,
    to: bounds[i + 1],
    height: (bounds[i + 1] - from) * PX,
  }));
  const spanOf = ({ start, end }: { start: number; end: number }) =>
    segments.filter((s) => s.from >= start && s.to <= end);

  // Grow the segments under any block that is still too short, repeatedly:
  // stretching one block can only help the others, never shrink them.
  for (let pass = 0; pass < 12; pass += 1) {
    let changed = false;
    blocks.forEach((block) => {
      const span = spanOf(block);
      if (!span.length) return;
      const current = span.reduce((sum, s) => sum + s.height, 0);
      const deficit = block.min - current;
      if (deficit <= 0.5) return;
      span.forEach((s) => {
        s.height += (deficit * s.height) / current;
      });
      changed = true;
    });
    if (!changed) break;
  }

  const tops = new Map<number, number>();
  let y = 0;
  segments.forEach((s) => {
    tops.set(s.from, y);
    y += s.height;
  });
  tops.set(GRID_END, y);

  /** Pixel offset of a point in time, interpolated inside its segment. */
  const at = (min: number) => {
    const clamped = Math.min(Math.max(min, GRID_START), GRID_END);
    const seg = segments.find((s) => clamped >= s.from && clamped < s.to);
    if (!seg) return tops.get(GRID_END) ?? 0;
    const top = tops.get(seg.from) ?? 0;
    return top + ((clamped - seg.from) / (seg.to - seg.from)) * seg.height;
  };

  /** Height of a block on the elastic scale, minus the gap between two cards. */
  const boxFor = (start: string, duration: number) => ({
    top: at(toMin(start)) + 3,
    height: at(toMin(start) + duration) - at(toMin(start)) - 6,
  });

  return { talks, breaks, height: y, at, boxFor };
};

type Day = ReturnType<typeof buildDay>;
const DAYS = new Map<AgendaEventKey, Day>();
const dayFor = (event: AgendaEventKey) => {
  const cached = DAYS.get(event);
  if (cached) return cached;
  const built = buildDay(event);
  DAYS.set(event, built);
  return built;
};

export type StageSpec = { name: string; subtitle: string };
export type GridAccent = {
  /** Rule under each stage name. */
  rule: string;
  /** The stage name itself. */
  title: string;
};

const StageHeader = ({
  name,
  subtitle,
  accent,
}: {
  name: string;
  subtitle: string;
  accent: GridAccent;
}) => (
  <div className={classNames("flex flex-col gap-1 border-b pb-3", accent.rule)}>
    <Text
      as="p"
      textType="sub_title"
      className={classNames("font-bold", accent.title)}
    >
      {name}
    </Text>
    <Text as="p" textType="small" className="text-muted">
      {subtitle}
    </Text>
  </div>
);

const SessionCard = ({ talk }: { talk: Talk }) => {
  const names = namesOf(talk);
  const style = trackStyle(talk.track);
  return (
    <div
      className={classNames(
        "flex h-full flex-col gap-1 overflow-hidden rounded-lg border border-l-4 bg-black px-3 py-2",
        style.accent,
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={classNames("h-2 w-2 shrink-0 rounded-full", style.dot)}
          aria-hidden
        />
        <Text as="p" textType="small" className="truncate font-bold text-white">
          {rangeLabel(talk.time, talk.duration)}
        </Text>
      </span>
      <Text as="p" textType="small" className="font-bold leading-snug">
        {talk.title ?? "Title to be announced"}
      </Text>
      {names && (
        <>
          <SpeakerFaces names={facesOf(talk)} size="sm" />
          <Text as="p" textType="small" className="leading-snug text-secondary">
            {names}
          </Text>
        </>
      )}
    </div>
  );
};

const StageColumn = ({ stage, day }: { stage: string; day: Day }) => (
  <div className="relative" style={{ height: day.height }}>
    {HOURS.map((h) => (
      <div
        key={h}
        className="absolute inset-x-0 border-t border-line-subtle/40"
        style={{ top: day.at(h * 60) }}
        aria-hidden
      />
    ))}
    {day.breaks
      .filter((b) => b.stage === stage)
      .map((b, i) => (
        <div
          key={`break-${i}`}
          className="absolute inset-x-0 flex items-center justify-center rounded-md border border-dashed border-line-subtle/60"
          style={day.boxFor(b.time, b.duration)}
        >
          <Text as="span" textType="small" className="truncate text-faint">
            {b.label}
          </Text>
        </div>
      ))}
    {day.talks
      .filter((t) => t.stage === stage)
      .map((t, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={day.boxFor(t.time, t.duration)}
        >
          <SessionCard talk={t} />
        </div>
      ))}
  </div>
);

export const StageGridAgenda = ({
  event,
  stages,
  accent,
  intro,
}: {
  event: AgendaEventKey;
  stages: StageSpec[];
  accent: GridAccent;
  intro: React.ReactNode;
}) => {
  const day = dayFor(event);
  const sorted = [...day.talks, ...day.breaks].sort(
    (a, b) => toMin(a.time) - toMin(b.time),
  );
  // Only the tracks this day actually sorts its sessions into.
  const used = AGENDA_TRACKS.filter((t) =>
    day.talks.some((s) => s.track === t.name),
  );

  return (
    <div className="flex flex-col gap-6">
      <Text
        as="p"
        textType="paragraph"
        className="max-w-3xl leading-relaxed text-secondary"
      >
        {intro}
      </Text>

      {/* Desktop: time-aligned grid, one column per stage */}
      <div
        className="hidden overflow-x-auto pb-2 lg:grid lg:gap-x-4 lg:gap-y-4"
        style={{
          gridTemplateColumns: `3rem repeat(${stages.length}, minmax(0, 1fr))`,
        }}
      >
        <div />
        {stages.map((s) => (
          <StageHeader
            key={s.name}
            name={s.name}
            subtitle={s.subtitle}
            accent={accent}
          />
        ))}

        {/* Time gutter */}
        <div className="relative" style={{ height: day.height }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute right-1 -translate-y-1/2"
              style={{ top: day.at(h * 60) }}
            >
              <Text as="span" textType="small" className="text-faint">
                {h}:00
              </Text>
            </div>
          ))}
        </div>

        {stages.map((s) => (
          <StageColumn key={s.name} stage={s.name} day={day} />
        ))}
      </div>

      {/* Mobile: one chronological list, each entry stating its stage */}
      <div className="flex flex-col gap-2.5 lg:hidden">
        {sorted.map((e, i) =>
          e.kind === "break" ? (
            <div
              key={i}
              className="flex flex-wrap items-center gap-x-3 rounded-lg border border-dashed border-line-subtle/60 px-4 py-2.5"
            >
              <Text as="p" textType="small" className="font-bold text-faint">
                {rangeLabel(e.time, e.duration)}
              </Text>
              <Text as="p" textType="small" className="text-faint">
                {e.label} · {e.stage}
              </Text>
            </div>
          ) : (
            <div
              key={i}
              className={classNames(
                "flex flex-col gap-1 rounded-lg border border-l-4 bg-black px-4 py-3",
                trackStyle(e.track).accent,
              )}
            >
              <Text as="p" textType="small" className="font-bold text-white">
                {rangeLabel(e.time, e.duration)} · {e.stage}
              </Text>
              <Text as="p" textType="paragraph" className="font-bold">
                {e.title ?? "Title to be announced"}
              </Text>
              {namesOf(e) && (
                <div className="mt-2">
                  <AgendaSpeakers
                    speakers={e.speakers}
                    moderator={e.moderator}
                  />
                </div>
              )}
            </div>
          ),
        )}
      </div>

      {used.length > 0 && (
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {used.map((track) => (
            <span key={track.name} className="flex items-center gap-2">
              <span
                className={classNames("h-2.5 w-2.5 rounded-full", track.dot)}
                aria-hidden
              />
              <Text as="span" textType="small" className="text-secondary">
                {track.name}
              </Text>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default StageGridAgenda;
