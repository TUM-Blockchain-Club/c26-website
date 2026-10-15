import {
  AGENDA_TRACKS,
  type AgendaEventKey,
  type AgendaTalk,
} from "@/constants/digitalAssetsDayAgenda";

/**
 * What the agenda cards, the session dialog and the session's share image all
 * say about a session, kept in one place so the three never disagree.
 */

export const EVENT_BADGES: Record<
  AgendaEventKey,
  {
    label: string;
    className: string;
    /** Colour of the dialog's edge where the session carries no track. */
    edge: string;
    /** The event's colour as text, for the stage pin in the dialog. */
    text: string;
  }
> = {
  conference: {
    label: "TUM Blockchain Conference Day",
    className: "border-tbc-yellow/60 bg-tbc-yellow/10 text-tbc-yellow",
    edge: "bg-gradient-tbc",
    text: "text-tbc-yellow",
  },
  "digital-assets-day": {
    label: "Digital Assets Day",
    className: "border-blue-400/60 bg-blue-400/10 text-blue-300",
    edge: "bg-blue-400",
    text: "text-blue-300",
  },
  hackathon: {
    label: "Hackathon",
    className: "border-red-500/60 bg-red-500/10 text-red-400",
    edge: "bg-red-500",
    text: "text-red-400",
  },
};

/** Most First Conference Day sessions carry no track, so this is only called
 * where one exists. */
export const trackStyle = (name: string) =>
  AGENDA_TRACKS.find((t) => t.name === name) ??
  AGENDA_TRACKS[AGENDA_TRACKS.length - 1];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** "09:20" plus 40 minutes is "10:00". */
export const endTime = (start: string, duration: number) => {
  const end = toMin(start) + duration;
  return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(
    end % 60,
  ).padStart(2, "0")}`;
};

/** "09:20 – 10:00" */
export const timeRange = (start: string, duration: number) =>
  `${start} – ${endTime(start, duration)}`;

/** "09:20 – 10:00 · 40 min", where the grid has room for the length. */
export const rangeLabel = (start: string, duration: number) =>
  `${start} – ${endTime(start, duration)} · ${duration} min`;

/** "Thursday, October 29", or "Thu, Oct 29" where room is short. */
export const dayLabel = (iso: string, style: "long" | "short" = "long") =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: style,
    month: style,
    day: "numeric",
    timeZone: "Europe/Berlin",
  });

/** Confirmed speakers, then the moderator, in the order they are credited. */
export const peopleOf = (talk: AgendaTalk) => [
  ...(talk.speakers ?? []).map((name) => ({ name, moderator: false })),
  ...(talk.moderator ? [{ name: talk.moderator, moderator: true }] : []),
];

/** A session is worth sharing once it has a title or a confirmed name; an
 * empty slot would only advertise that nothing is known yet. */
export const isShareable = (talk: AgendaTalk) =>
  !!talk.title || peopleOf(talk).length > 0;

export const sessionPath = (id: string) => `/agenda/${id}`;

/** The names a session shows faces for: its confirmed speakers, then the
 * moderator. Lives here rather than beside the faces because the stage grid
 * renders on the server and the faces do not. */
export const facesOf = (talk: {
  speakers?: string[];
  moderator?: string;
}): string[] => [
  ...(talk.speakers ?? []),
  ...(talk.moderator ? [talk.moderator] : []),
];
