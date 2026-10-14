import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/text";
import { speakerLinkFor, roleLine } from "@/util/speakerPortraits";

/**
 * The speaker block under a session, in the shape last year's agenda used: a
 * "Speakers:" label over a two-column grid, each person a 60px portrait beside
 * their name and their role with company.
 *
 * The agenda only carries names; everything else comes from the speaker list,
 * so anyone who never filled in the speaker form shows as a name on a
 * silhouette. Portraits link to that person's card on the speakers page.
 *
 * The session dialog uses the compact size: larger, ringed portraits so the
 * people are what the eye lands on, no label, and the moderation credit
 * folded into the role line. Phones get one column, where
 * a role and company usually fit in full; only on short screens (an iPhone SE
 * in Safari) does a panel of four or more switch to two columns, so a
 * five-person panel still fits on one screen there.
 */
type Size = "regular" | "compact";

const PHOTO: Record<Size, string> = {
  regular: "h-[60px] w-[60px]",
  compact: "h-14 w-14 sm:h-[72px] sm:w-[72px]",
};

/** Lifts a portrait off the black background in the dialog. */
const HIGHLIGHT: Record<Size, string> = {
  regular: "border border-line",
  compact:
    "ring-2 ring-white/40 ring-offset-2 ring-offset-black shadow-[0_0_24px_rgb(255_255_255/0.12)]",
};

const Silhouette = ({ size }: { size: Size }) => (
  <span
    className={classNames(
      "flex shrink-0 items-end justify-center overflow-hidden rounded-full bg-white/15",
      PHOTO[size],
      HIGHLIGHT[size],
    )}
    aria-hidden
  >
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <circle cx="20" cy="15" r="7.5" fill="#000" />
      <path d="M5 41c2-8.5 8-13 15-13s13 4.5 15 13Z" fill="#000" />
    </svg>
  </span>
);

const Person = ({
  name,
  moderator,
  size,
}: {
  name: string;
  moderator?: boolean;
  size: Size;
}) => {
  const speaker = speakerLinkFor(name);
  const role = roleLine(speaker);
  const compact = size === "compact";
  const credit =
    compact && moderator
      ? ["Moderation", role].filter(Boolean).join(" · ")
      : role;
  // Raised above the card's own link, which covers the whole session card so
  // the card opens its dialog wherever it is clicked.
  const portrait = speaker ? (
    <Link
      href={`/speakers#${speaker.anchor}`}
      aria-label={`${name} on the speakers page`}
      className="relative z-10 shrink-0 rounded-full transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
    >
      <Image
        src={speaker.photo}
        alt={name}
        width={120}
        height={120}
        className={classNames(
          "rounded-full object-cover",
          PHOTO[size],
          HIGHLIGHT[size],
        )}
      />
    </Link>
  ) : (
    <Silhouette size={size} />
  );

  return (
    <div
      className={classNames(
        "flex items-center",
        compact ? "gap-3 sm:gap-4" : "gap-3",
      )}
    >
      {portrait}
      <div className="flex min-w-0 flex-col">
        <Text
          as="p"
          textType="lgsmall"
          className={classNames(
            "font-medium leading-tight",
            compact && "line-clamp-2 !text-sm font-semibold sm:!text-base",
          )}
        >
          {name}
        </Text>
        {credit && (
          <Text
            as="p"
            textType="small"
            className={classNames(
              "leading-snug text-secondary",
              compact && "line-clamp-2 !text-xs sm:!text-[13px]",
            )}
          >
            {credit}
          </Text>
        )}
        {moderator && !compact && (
          <Text as="p" textType="small" className="leading-snug text-faint">
            Moderation
          </Text>
        )}
      </div>
    </div>
  );
};

export const AgendaSpeakers = ({
  speakers,
  moderator,
  size = "regular",
}: {
  speakers?: string[];
  moderator?: string;
  size?: Size;
}) => {
  const named = speakers ?? [];
  const total = named.length + (moderator ? 1 : 0);

  const compact = size === "compact";

  // With nobody confirmed the one line says it all, so the label would only
  // repeat the word.
  return (
    <div className="flex flex-col gap-3">
      {total > 0 && !compact && (
        <Text as="p" textType="small" className="text-faint">
          {total === 1 ? "Speaker:" : "Speakers:"}
        </Text>
      )}
      {total === 0 ? (
        <div className="flex items-center gap-3">
          <Silhouette size={size} />
          <Text as="p" textType="small" className="text-secondary">
            Speaker to be announced
          </Text>
        </div>
      ) : (
        <div
          className={classNames(
            "grid",
            compact
              ? classNames(
                  "gap-x-3 gap-y-3.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5",
                  total >= 4 && "[@media(max-height:640px)]:grid-cols-2",
                )
              : "gap-4 sm:grid-cols-2",
          )}
        >
          {named.map((name) => (
            <Person key={name} name={name} size={size} />
          ))}
          {moderator && (
            <Person key={moderator} name={moderator} moderator size={size} />
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaSpeakers;
