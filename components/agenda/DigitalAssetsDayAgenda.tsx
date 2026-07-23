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

const dadTalks = agendaEntries.filter(
  (e): e is Talk => e.kind === "talk" && e.event === "digital-assets-day",
);
const byTitle = (title: string) => dadTalks.find((t) => t.title === title);

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
const offsetLabel = (from: string, to: string) => {
  const d = toMin(to) - toMin(from);
  const h = Math.floor(d / 60);
  const m = d % 60;
  return `${[h ? `${h} h` : "", m ? `${m} min` : ""].filter(Boolean).join(" ")} later`;
};

// Each core theme is introduced on the Main Stage and explored in depth on the
// Executive Forum a little later. These pairs drive the connecting arrows.
const THEME_PAIRS = [
  {
    main: "Stablecoins' Main Use Cases",
    forum: "Stablecoins, Treasury & Agentic Payments",
  },
  {
    main: "Portfolio Strategy & Digital Assets",
    forum: "Portfolio Construction & Institutional Allocation",
  },
  { main: "Tokenization Status Quo", forum: "How to Drive Volume Markets" },
  {
    main: "Public Infrastructure Building Blocks",
    forum: "Deutschland- & Euro-Stack (2.0)",
  },
];

// Time axis for the aligned grid.
const GRID_START = 9 * 60;
const GRID_END = 18 * 60;
const PX = 2.4;
const gridHeight = (GRID_END - GRID_START) * PX;
const topFor = (min: number) => (min - GRID_START) * PX;
const centerY = (t: Talk) => topFor(toMin(t.time)) + (t.duration * PX) / 2;
const HOURS = Array.from(
  { length: (GRID_END - GRID_START) / 60 + 1 },
  (_, i) => 9 + i,
);
const LANE = 76; // px width of the arrow lane between the two columns

type Gap = { start: number; end: number; label: string };
const gapsFor = (stageName: string): Gap[] => {
  const talks = dadTalks
    .filter((t) => t.stage === stageName)
    .sort((a, b) => toMin(a.time) - toMin(b.time));
  const gaps: Gap[] = [];
  let prev = GRID_START;
  let leading = true;
  for (const t of talks) {
    const s = toMin(t.time);
    if (s - prev >= 25)
      gaps.push({
        start: prev,
        end: s,
        label:
          leading && stageName === "Executive Forum"
            ? "At the Main Stage"
            : "Break",
      });
    prev = Math.max(prev, s + t.duration);
    leading = false;
  }
  if (GRID_END - prev >= 25)
    gaps.push({ start: prev, end: GRID_END, label: "Break" });
  return gaps;
};

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
        "flex h-full flex-col gap-1 overflow-hidden rounded-lg border border-l-4 bg-black px-4 py-2.5",
        style.accent,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={classNames("h-2 w-2 shrink-0 rounded-full", style.dot)}
            aria-hidden
          />
          <Text
            as="p"
            textType="small"
            className="truncate font-bold text-white"
          >
            {rangeLabel(talk.time, talk.duration)}
          </Text>
        </span>
        {talk.format && (
          <Text as="p" textType="small" className="shrink-0 text-faint">
            {talk.format}
          </Text>
        )}
      </div>
      <Text as="p" textType="lgsmall" className="font-bold leading-snug">
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
    {gapsFor(stage).map((g, i) => (
      <div
        key={`gap-${i}`}
        className="absolute inset-x-0 flex items-center justify-center rounded-md border border-dashed border-line-subtle/60"
        style={{ top: topFor(g.start) + 3, height: (g.end - g.start) * PX - 6 }}
      >
        <Text as="span" textType="small" className="text-faint">
          {g.label}
        </Text>
      </div>
    ))}
    {dadTalks
      .filter((t) => t.stage === stage)
      .map((t, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={{
            top: topFor(toMin(t.time)) + 3,
            height: t.duration * PX - 6,
          }}
        >
          <SessionCard talk={t} />
        </div>
      ))}
  </div>
);

export const DigitalAssetsDayAgenda = () => {
  const sortedTalks = [...dadTalks].sort(
    (a, b) => toMin(a.time) - toMin(b.time),
  );
  const arrows = THEME_PAIRS.map((p) => ({
    main: byTitle(p.main),
    forum: byTitle(p.forum),
  })).filter((a) => a.main && a.forum) as { main: Talk; forum: Talk }[];

  return (
    <div className="flex flex-col gap-6">
      <Text
        as="p"
        textType="paragraph"
        className="max-w-3xl leading-relaxed text-secondary"
      >
        Two stages, one storyline. Each core theme is first introduced on the
        Main Stage, then explored in depth on the Executive Forum a little
        later. The connections show how a topic travels from one stage to the
        other. This is a preliminary structure and may still change.
      </Text>

      <Band time="8:00" label="Doors Open & Arrival" />

      {/* Desktop: time-aligned two-column grid with connecting arrows */}
      <div
        className="hidden lg:grid lg:gap-y-4"
        style={{ gridTemplateColumns: `3rem 1fr ${LANE}px 1fr` }}
      >
        <div />
        <StageHeader name="Main Stage" subtitle="Classic conference set up" />
        <div />
        <StageHeader
          name="Executive Forum"
          subtitle="Interactive and curated deep dive formats"
        />

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

        <StageColumn stage="Main Stage" />

        {/* Arrow lane */}
        <div className="relative" style={{ height: gridHeight }} aria-hidden>
          <svg
            width={LANE}
            height={gridHeight}
            className="overflow-visible"
            style={{ display: "block" }}
          >
            <defs>
              <marker
                id="dad-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="rgb(120 170 255 / 0.9)" />
              </marker>
            </defs>
            {arrows.map((a, i) => {
              const y1 = centerY(a.main);
              const y2 = centerY(a.forum);
              const midY = (y1 + y2) / 2;
              return (
                <path
                  key={i}
                  d={`M 0 ${y1} C ${LANE * 0.55} ${y1}, ${LANE * 0.45} ${y2}, ${LANE} ${y2}`}
                  fill="none"
                  stroke="rgb(120 170 255 / 0.7)"
                  strokeWidth="2"
                  markerEnd="url(#dad-arrow)"
                  data-mid={midY}
                />
              );
            })}
          </svg>
        </div>

        <StageColumn stage="Executive Forum" />
      </div>

      {/* Mobile: theme pairs stacked, arrow points down */}
      <div className="flex flex-col gap-5 lg:hidden">
        {arrows.map((a, i) => {
          const style = trackStyle(a.main.track);
          return (
            <div
              key={i}
              className={classNames(
                "flex flex-col gap-3 rounded-xl border border-l-4 bg-white/[0.02] p-4",
                style.accent,
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={classNames(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    style.dot,
                  )}
                  aria-hidden
                />
                <Text as="p" textType="lgsmall" className="font-bold">
                  {a.main.track}
                </Text>
              </div>
              <div className="rounded-lg border border-line bg-black p-3.5">
                <Text
                  as="p"
                  textType="small"
                  className="font-bold uppercase tracking-widest text-blue-200"
                >
                  Main Stage · {rangeLabel(a.main.time, a.main.duration)}
                </Text>
                <Text as="p" textType="lgsmall" className="mt-1 font-bold">
                  {a.main.title}
                </Text>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-blue-300">
                <Text
                  as="span"
                  textType="small"
                  className="font-bold uppercase tracking-wider"
                >
                  {offsetLabel(a.main.time, a.forum.time)}
                </Text>
                <span className="text-xl leading-none" aria-hidden>
                  ↓
                </span>
              </div>
              <div className="rounded-lg border border-line bg-black p-3.5">
                <Text
                  as="p"
                  textType="small"
                  className="font-bold uppercase tracking-widest text-blue-200"
                >
                  Executive Forum · {rangeLabel(a.forum.time, a.forum.duration)}
                </Text>
                <Text as="p" textType="lgsmall" className="mt-1 font-bold">
                  {a.forum.title}
                </Text>
              </div>
            </div>
          );
        })}

        {/* All other Main Stage sessions on mobile */}
        <div className="flex flex-col gap-2.5">
          {sortedTalks
            .filter(
              (t) =>
                !THEME_PAIRS.some(
                  (p) => p.main === t.title || p.forum === t.title,
                ),
            )
            .map((t, i) => {
              const style = trackStyle(t.track);
              return (
                <div
                  key={i}
                  className={classNames(
                    "flex flex-col gap-1 rounded-lg border border-l-4 bg-black px-4 py-3",
                    style.accent,
                  )}
                >
                  <Text
                    as="p"
                    textType="small"
                    className="font-bold text-white"
                  >
                    {rangeLabel(t.time, t.duration)} · {t.stage}
                  </Text>
                  <Text as="p" textType="lgsmall" className="font-bold">
                    {t.title}
                  </Text>
                </div>
              );
            })}
        </div>
      </div>

      <Band time="19:00" label="Evening Event (until 22:00)" />

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
