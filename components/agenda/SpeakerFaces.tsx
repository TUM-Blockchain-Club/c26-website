import classNames from "classnames";
import Image from "next/image";
import { portraitFor } from "@/util/speakerPortraits";

/**
 * The row of faces a session shows for its confirmed speakers. Shared by both
 * agendas: the chronological feed on /agenda and the stage grid on
 * /digital-assets-day, which needs the smaller size to fit its cards.
 */
type Size = "sm" | "md";

const BOX: Record<Size, string> = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
};
/** How far each face slides over the one before it. */
const OVERLAP: Record<Size, string> = {
  sm: "-space-x-2",
  md: "-space-x-3",
};
/** The ring separates overlapping faces, so it has to be the page's own
 * background rather than a translucent border. */
const RING = "ring-2 ring-black";

/** Used where a session has no confirmed speaker yet, and for the confirmed
 * names the speaker list has no portrait of, because they never filled in the
 * speaker form. A silhouette keeps a missing face reading as missing. */
export const SpeakerPlaceholder = ({
  title,
  size = "md",
}: {
  title?: string;
  size?: Size;
}) => (
  <span
    title={title}
    className={classNames(
      "flex shrink-0 items-end justify-center overflow-hidden rounded-full border border-line bg-white/15",
      BOX[size],
      RING,
    )}
  >
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
      <circle cx="20" cy="15" r="7.5" fill="#000" />
      <path d="M5 41c2-8.5 8-13 15-13s13 4.5 15 13Z" fill="#000" />
    </svg>
  </span>
);

const SpeakerFace = ({ name, size }: { name: string; size: Size }) => {
  const photo = portraitFor(name);
  if (!photo) return <SpeakerPlaceholder title={name} size={size} />;
  return (
    <Image
      src={photo}
      alt={name}
      title={name}
      width={80}
      height={80}
      className={classNames(
        "shrink-0 rounded-full border border-line object-cover",
        BOX[size],
        RING,
      )}
    />
  );
};

/** The largest panel in the agenda is five people, so five faces fit without
 * anyone being summarised away. The overflow chip is the guard for a larger
 * panel appearing in a later export; the names are written out next to the
 * faces either way. */
const FACE_LIMIT = 5;

export const SpeakerFaces = ({
  names,
  size = "md",
}: {
  names: string[];
  size?: Size;
}) => {
  if (!names.length) return <SpeakerPlaceholder size={size} />;
  const shown = names.slice(0, FACE_LIMIT);
  const rest = names.length - shown.length;
  return (
    <span
      className={classNames("flex shrink-0 items-center", OVERLAP[size])}
      aria-hidden
    >
      {shown.map((name) => (
        <SpeakerFace key={name} name={name} size={size} />
      ))}
      {rest > 0 && (
        <span
          className={classNames(
            "flex shrink-0 items-center justify-center rounded-full border border-line bg-white/10 font-bold text-secondary",
            size === "sm" ? "text-[9px]" : "text-xs",
            BOX[size],
            RING,
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
};

/** Confirmed speakers, then the moderator, in the order they are credited. */
export const facesOf = (talk: {
  speakers?: string[];
  moderator?: string;
}): string[] => [
  ...(talk.speakers ?? []),
  ...(talk.moderator ? [talk.moderator] : []),
];
