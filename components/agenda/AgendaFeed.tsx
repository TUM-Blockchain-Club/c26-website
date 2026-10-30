import classNames from "classnames";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Text } from "@/components/text";
import { AgendaSpeakers } from "@/components/agenda/AgendaSpeakers";
import {
  SessionTrigger,
  clickableCard,
} from "@/components/agenda/SessionDialog";
import { EVENT_BADGES, trackStyle } from "@/components/agenda/sessionMeta";
import { type AgendaEntry } from "@/constants/digitalAssetsDayAgenda";

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });

const EntryRow = ({ entry }: { entry: AgendaEntry }) => {
  // Breaks and milestones are both one quiet line; a break additionally says
  // which stage it belongs to, because the three stages pause at their own
  // times and would otherwise look like duplicated rows.
  if (entry.kind === "milestone" || entry.kind === "break") {
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
        {entry.stage && (
          <Text as="p" textType="small" className="truncate text-faint">
            {entry.stage}
          </Text>
        )}
      </div>
    );
  }

  const badge = EVENT_BADGES[entry.event];
  const style = entry.track ? trackStyle(entry.track) : undefined;

  return (
    <div
      className={classNames(
        "group flex flex-col gap-3 rounded-lg border border-l-4 bg-white/[0.02] px-5 py-4",
        clickableCard,
        style ? style.accent : "border-l-line-strong",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Text as="p" textType="small" className="mr-1 font-bold text-white">
          {entry.timeTba ? "Time TBA" : entry.time}
        </Text>
        <span
          className={classNames(
            "rounded-full border px-2.5 py-0.5 text-xs font-bold",
            badge.className,
          )}
        >
          {badge.label}
        </span>
        {entry.stage && (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-secondary">
            {entry.stage}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-faint">
          {entry.format}
          {/* Says the card opens; the whole card is the link. */}
          <ChevronRightIcon
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
            aria-hidden
          />
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <SessionTrigger id={entry.id}>
          {entry.title ? (
            <Text
              as="span"
              textType="paragraph"
              className="block font-bold leading-snug"
            >
              {entry.title}
            </Text>
          ) : (
            <Text
              as="span"
              textType="paragraph"
              className="block text-muted italic"
            >
              Title to be announced
            </Text>
          )}
        </SessionTrigger>
      </div>

      <AgendaSpeakers speakers={entry.speakers} moderator={entry.moderator} />

      {style && entry.track && (
        <div className="flex items-center gap-2">
          <span
            className={classNames("h-2 w-2 rounded-full", style.dot)}
            aria-hidden
          />
          <Text as="span" textType="small" className="text-secondary">
            {entry.track}
          </Text>
        </div>
      )}
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
