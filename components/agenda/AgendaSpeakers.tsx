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
 */
const PHOTO = 60;

const Silhouette = () => (
  <span
    className="flex shrink-0 items-end justify-center overflow-hidden rounded-full border border-line bg-white/15"
    style={{ width: PHOTO, height: PHOTO }}
    aria-hidden
  >
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <circle cx="20" cy="15" r="7.5" fill="#000" />
      <path d="M5 41c2-8.5 8-13 15-13s13 4.5 15 13Z" fill="#000" />
    </svg>
  </span>
);

const Person = ({ name, moderator }: { name: string; moderator?: boolean }) => {
  const speaker = speakerLinkFor(name);
  const role = roleLine(speaker);
  const portrait = speaker ? (
    <Link
      href={`/speakers#${speaker.anchor}`}
      aria-label={`${name} on the speakers page`}
      className="shrink-0 rounded-full transition-transform duration-200 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none"
    >
      <Image
        src={speaker.photo}
        alt={name}
        width={PHOTO * 2}
        height={PHOTO * 2}
        style={{ width: PHOTO, height: PHOTO }}
        className="rounded-full border border-line object-cover"
      />
    </Link>
  ) : (
    <Silhouette />
  );

  return (
    <div className="flex items-center gap-3">
      {portrait}
      <div className="flex min-w-0 flex-col">
        <Text as="p" textType="lgsmall" className="font-medium leading-tight">
          {name}
        </Text>
        {role && (
          <Text as="p" textType="small" className="leading-snug text-secondary">
            {role}
          </Text>
        )}
        {moderator && (
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
}: {
  speakers?: string[];
  moderator?: string;
}) => {
  const named = speakers ?? [];
  const total = named.length + (moderator ? 1 : 0);

  // With nobody confirmed the one line says it all, so the label would only
  // repeat the word.
  return (
    <div className="flex flex-col gap-3">
      {total > 0 && (
        <Text as="p" textType="small" className="text-faint">
          {total === 1 ? "Speaker:" : "Speakers:"}
        </Text>
      )}
      {total === 0 ? (
        <div className="flex items-center gap-3">
          <Silhouette />
          <Text as="p" textType="small" className="text-secondary">
            Speaker to be announced
          </Text>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {named.map((name) => (
            <Person key={name} name={name} />
          ))}
          {moderator && <Person key={moderator} name={moderator} moderator />}
        </div>
      )}
    </div>
  );
};

export default AgendaSpeakers;
