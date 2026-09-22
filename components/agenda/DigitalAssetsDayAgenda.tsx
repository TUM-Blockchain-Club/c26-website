import classNames from "classnames";
import { Text } from "@/components/text";
import {
  DAD_TRACKS,
  agendaEntries,
  type AgendaEntry,
} from "@/constants/digitalAssetsDayAgenda";

const trackStyle = (name: string) =>
  DAD_TRACKS.find((t) => t.name === name) ?? DAD_TRACKS[DAD_TRACKS.length - 1];

type Talk = Extract<AgendaEntry, { kind: "talk" }>;
type Break = Extract<AgendaEntry, { kind: "break" }>;
type Milestone = Extract<AgendaEntry, { kind: "milestone" }>;

const isDad = (e: AgendaEntry) => e.event === "digital-assets-day";
const dadTalks = agendaEntries.filter(
  (e): e is Talk => e.kind === "talk" && isDad(e),
);
const dadBreaks = agendaEntries.filter(
  (e): e is Break => e.kind === "break" && isDad(e),
);
const dadMilestones = agendaEntries.filter(
  (e): e is Milestone => e.kind === "milestone" && isDad(e),
);

/** The three stages, in the order Bundesblock publishes them. */
const STAGES = [
  { name: "Main Stage", subtitle: "Classic conference set up" },
  { name: "Executive Forum", subtitle: "Curated deep dive formats" },
  { name: "Future Stage", subtitle: "Industry and technology in practice" },
];

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

// Time axis for the aligned grid. The programme runs 8:00 to 18:00; anything
// open-ended after that (closing remarks, afterparty) is a band underneath.
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
const CARD_CHROME = 40;
const LINE = 16;
const CHARS_PER_LINE = 36;
const MIN_BREAK = 24;
const minHeightFor = (title: string | undefined) => {
  const lines = Math.min(Math.ceil((title ?? "").length / CHARS_PER_LINE), 4);
  return CARD_CHROME + Math.max(lines, 1) * LINE;
};

/**
 * A shared, slightly elastic time scale. Every stage maps minutes to pixels
 * through the same function, so the three columns stay aligned, but segments
 * holding a session too short to be legible are stretched until it fits. The
 * scale is built once from every session boundary of the day.
 */
const buildScale = () => {
  const blocks = [
    ...dadTalks.map((t) => ({
      start: toMin(t.time),
      end: toMin(t.time) + t.duration,
      min: minHeightFor(t.title),
    })),
    ...dadBreaks.map((b) => ({
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

  return {
    height: y,
    /** Pixel offset of a point in time, interpolated inside its segment. */
    at: (min: number) => {
      const clamped = Math.min(Math.max(min, GRID_START), GRID_END);
      const seg = segments.find((s) => clamped >= s.from && clamped < s.to);
      if (!seg) return tops.get(GRID_END) ?? 0;
      const top = tops.get(seg.from) ?? 0;
      return top + ((clamped - seg.from) / (seg.to - seg.from)) * seg.height;
    },
  };
};

const scale = buildScale();
const gridHeight = scale.height;
const topFor = (min: number) => scale.at(min);
/** Height of a block on the elastic scale, minus the gap between two cards. */
const boxFor = (start: string, duration: number) => ({
  top: topFor(toMin(start)) + 3,
  height: topFor(toMin(start) + duration) - topFor(toMin(start)) - 6,
});

const Band = ({ time, label }: { time: string; label: string }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-blue-400/40 bg-blue-400/[0.07] px-4 py-3 text-center">
    <Text as="span" textType="small" className="font-bold text-blue-200">
      {time}
    </Text>
    <Text
      as="span"
      textType="small"
      className="uppercase tracking-widest text-secondary"
    >
      {label}
    </Text>
  </div>
);

const StageHeader = ({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) => (
  <div className="flex flex-col gap-1 border-b border-blue-400/30 pb-3">
    <Text as="p" textType="sub_title" className="font-bold text-blue-200">
      {name}
    </Text>
    <Text as="p" textType="small" className="text-muted">
      {subtitle}
    </Text>
  </div>
);

const SessionCard = ({ talk }: { talk: Talk }) => {
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
    </div>
  );
};

const StageColumn = ({ stage }: { stage: string }) => (
  <div className="relative" style={{ height: gridHeight }}>
    {HOURS.map((h) => (
      <div
        key={h}
        className="absolute inset-x-0 border-t border-line-subtle/40"
        style={{ top: topFor(h * 60) }}
        aria-hidden
      />
    ))}
    {dadBreaks
      .filter((b) => b.stage === stage)
      .map((b, i) => (
        <div
          key={`break-${i}`}
          className="absolute inset-x-0 flex items-center justify-center rounded-md border border-dashed border-line-subtle/60"
          style={boxFor(b.time, b.duration)}
        >
          <Text as="span" textType="small" className="truncate text-faint">
            {b.label}
          </Text>
        </div>
      ))}
    {dadTalks
      .filter((t) => t.stage === stage)
      .map((t, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={boxFor(t.time, t.duration)}
        >
          <SessionCard talk={t} />
        </div>
      ))}
  </div>
);

export const DigitalAssetsDayAgenda = () => {
  const sorted = [...dadTalks, ...dadBreaks].sort(
    (a, b) => toMin(a.time) - toMin(b.time),
  );
  // Open-ended entries (no end time) close the day below the grid; the
  // afterparty is listed once even though all three stages carry it.
  const closing = dadMilestones.filter(
    (m) => m.time && toMin(m.time) >= 17 * 60,
  );
  const closingUnique = closing.filter(
    (m, i) => closing.findIndex((o) => o.label === m.label) === i,
  );

  return (
    <div className="flex flex-col gap-6">
      <Text
        as="p"
        textType="paragraph"
        className="max-w-3xl leading-relaxed text-secondary"
      >
        Three stages running in parallel: the Main Stage sets the agenda, the
        Executive Forum goes deep in curated formats, and the Future Stage shows
        what industry already builds. All three open together with the joint
        opening session. This is Bundesblock&apos;s working draft and may still
        change; speakers are announced as they are confirmed.
      </Text>

      {/* Desktop: time-aligned three-column grid */}
      <div
        className="hidden overflow-x-auto pb-2 lg:grid lg:gap-x-4 lg:gap-y-4"
        style={{ gridTemplateColumns: "3rem repeat(3, minmax(0, 1fr))" }}
      >
        <div />
        {STAGES.map((s) => (
          <StageHeader key={s.name} name={s.name} subtitle={s.subtitle} />
        ))}

        {/* Time gutter */}
        <div className="relative" style={{ height: gridHeight }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute right-1 -translate-y-1/2"
              style={{ top: topFor(h * 60) }}
            >
              <Text as="span" textType="small" className="text-faint">
                {h}:00
              </Text>
            </div>
          ))}
        </div>

        {STAGES.map((s) => (
          <StageColumn key={s.name} stage={s.name} />
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
              <Text as="p" textType="lgsmall" className="font-bold">
                {e.title ?? "Title to be announced"}
              </Text>
            </div>
          ),
        )}
      </div>

      {closingUnique.map((m) => (
        <Band key={m.label} time={`from ${m.time}`} label={m.label} />
      ))}

      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
        {DAD_TRACKS.map((track) => (
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
    </div>
  );
};

export default DigitalAssetsDayAgenda;
