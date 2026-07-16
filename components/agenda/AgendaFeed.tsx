import classNames from "classnames";
import { Text } from "@/components/text";
import {
  DAD_TRACKS,
  type AgendaEntry,
  type AgendaEventKey,
} from "@/constants/digitalAssetsDayAgenda";

const EVENT_BADGES: Record<
  AgendaEventKey,
  { label: string; className: string }
> = {
  conference: {
    label: "First Conference Day",
    className: "border-tbc-yellow/60 bg-tbc-yellow/10 text-tbc-yellow",
  },
  "digital-assets-day": {
    label: "Digital Assets Day",
    className: "border-blue-400/60 bg-blue-400/10 text-blue-300",
  },
  hackathon: {
    label: "Hackathon",
    className: "border-red-500/60 bg-red-500/10 text-red-400",
  },
};

const trackStyle = (name: string) =>
  DAD_TRACKS.find((t) => t.name === name) ?? DAD_TRACKS[DAD_TRACKS.length - 1];

/** Placeholder headshot until speakers are announced: a black silhouette. */
const SpeakerPlaceholder = () => (
  <span className="flex h-10 w-10 shrink-0 items-end justify-center overflow-hidden rounded-full border border-line bg-white/15">
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
      <circle cx="20" cy="15" r="7.5" fill="#000" />
      <path d="M5 41c2-8.5 8-13 15-13s13 4.5 15 13Z" fill="#000" />
    </svg>
  </span>
);

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });

const EntryRow = ({ entry }: { entry: AgendaEntry }) => {
  if (entry.kind === "milestone") {
    return (
      <div className="flex items-center gap-3 px-1 py-1.5">
        {entry.time && (
          <Text
            as="p"
            textType="small"
            className="shrink-0 font-bold text-white"
          >
            {entry.time}
          </Text>
        )}
        <Text
          as="p"
          textType="small"
          className="uppercase tracking-widest text-muted"
        >
          {entry.label}
        </Text>
      </div>
    );
  }

  if (entry.kind === "break") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line-subtle px-4 py-2.5">
        <Text as="p" textType="small" className="text-faint">
          <span className="font-bold text-muted">{entry.time}</span> ·{" "}
          {entry.label}
          {entry.stage ? ` · ${entry.stage}` : ""} · {entry.duration} min
        </Text>
      </div>
    );
  }

  if (entry.kind === "placeholder") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-line px-5 py-3.5">
        <Text as="p" textType="small" className="text-muted italic">
          <span className="font-bold not-italic">{entry.time}</span> · Slot to
          be announced · {entry.stage}
        </Text>
        <Text as="p" textType="small" className="shrink-0 text-faint">
          {entry.duration} min
        </Text>
      </div>
    );
  }

  const badge = EVENT_BADGES[entry.event];
  const style = trackStyle(entry.track);

  return (
    <div
      className={classNames(
        "flex flex-col gap-3 rounded-lg border border-line border-l-4 bg-white/[0.02] px-5 py-4",
        style.accent,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Text as="p" textType="small" className="mr-1 font-bold text-white">
          {entry.time}
        </Text>
        <span
          className={classNames(
            "rounded-full border px-2.5 py-0.5 text-xs font-bold",
            badge.className,
          )}
        >
          {badge.label}
        </span>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-secondary">
          {entry.stage}
        </span>
        <span className="ml-auto text-xs text-faint">{entry.duration} min</span>
      </div>

      <div className="flex flex-col gap-1">
        <Text as="p" textType="small" className="font-bold text-white">
          {entry.format}
          {entry.formatDetail && (
            <span className="ml-2 font-normal text-faint">
              {entry.formatDetail}
            </span>
          )}
        </Text>
        {entry.title ? (
          <Text as="p" textType="lgsmall" className="font-bold leading-snug">
            {entry.title}
          </Text>
        ) : (
          <Text as="p" textType="lgsmall" className="text-muted italic">
            Title to be announced
          </Text>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="flex items-center gap-3">
          <SpeakerPlaceholder />
          <Text as="span" textType="small" className="text-secondary">
            {entry.speaker ?? "Speaker to be announced"}
          </Text>
        </span>
        <span className="flex items-center gap-2">
          <span
            className={classNames("h-2 w-2 rounded-full", style.dot)}
            aria-hidden
          />
          <Text as="span" textType="small" className="text-secondary">
            {entry.track}
          </Text>
        </span>
      </div>
    </div>
  );
};

/**
 * One chronological feed of individual programme entries. Entries from all
 * events share it; each talk states its event and stage on the card.
 */
export const AgendaFeed = ({ entries }: { entries: AgendaEntry[] }) => {
  let lastDay = "";

  return (
    <div className="flex w-full flex-col gap-2.5">
      {entries.map((entry, index) => {
        const dayHeader =
          entry.day !== lastDay ? (
            <div
              className={classNames(
                "flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3",
                index > 0 && "mt-10",
              )}
            >
              <Text as="p" textType="sub_title" className="font-bold">
                {formatDay(entry.day)}
              </Text>
              <span className="rounded-full border border-line px-3.5 py-1.5">
                <Text as="span" textType="small" className="text-secondary">
                  Speakers to be announced
                </Text>
              </span>
            </div>
          ) : null;
        lastDay = entry.day;

        return (
          <div key={index} className="flex flex-col gap-2.5">
            {dayHeader}
            <EntryRow entry={entry} />
          </div>
        );
      })}
    </div>
  );
};

export default AgendaFeed;
