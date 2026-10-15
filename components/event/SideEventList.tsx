import { Button } from "@/components/button";
import Image from "next/image";
import NextLink from "next/link";
import { Text } from "@/components/text";
import { type SideEvent26 } from "@/constants/sideEvents26";
import { getSideEvents } from "@/components/service/conference26";

/**
 * The side events, in the card shape last year's page used: a square visual on
 * top, then the title, the date line, what it is, and the way in.
 *
 * Last year every event came with its own picture. Where an organiser has none,
 * the card draws its own tile from the date rather than borrowing a photo that
 * is not theirs, which keeps the row even.
 */

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-DE", {
    ...opts,
    timeZone: "Europe/Berlin",
  });

const Visual = ({ event }: { event: SideEvent26 }) =>
  event.image ? (
    <Image
      className="object-cover"
      src={event.image}
      alt={event.title}
      title={event.title}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
      fill
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a1118] via-black to-[#101a22] px-6 text-center">
      <Text
        as="p"
        textType="small"
        className="font-bold uppercase tracking-[0.3em] eyebrow-tbc"
      >
        {fmt(event.date, { weekday: "long" })}
      </Text>
      <Text
        as="p"
        textType="title"
        className="text-gradient font-bold leading-none"
      >
        {fmt(event.date, { day: "numeric", month: "short" }).toUpperCase()}
      </Text>
      <Text as="p" textType="small" className="text-secondary">
        {event.start} to {event.end}
      </Text>
    </div>
  );

const SideEventCard = ({ event }: { event: SideEvent26 }) => (
  <div className="card-tbc group flex flex-col overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1">
    <div className="relative aspect-square w-full overflow-hidden">
      <Visual event={event} />
      {/* The date sits on the picture so it reads before anything else, and a
          scrim underneath keeps it legible over whatever the organiser sent. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 backdrop-blur-sm">
        <Text as="p" textType="small" className="font-bold tracking-wide">
          {fmt(event.date, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </Text>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <Text textType="sub_title" as="p" className="line-clamp-2 font-bold">
        {event.title}
      </Text>
      <Text className="mt-1 text-muted" textType="small" as="p">
        {event.start} to {event.end} CET · {event.venue}
      </Text>
      <Text
        className="mt-3 line-clamp-3 text-secondary"
        textType="small"
        as="p"
      >
        {event.description}
      </Text>

      {/* Already in the data and never shown: the topic words say at a glance
          whether the evening is worth the trip. */}
      {event.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {event.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      <Text className="mt-4 text-faint" textType="small" as="p">
        {[event.free ? "Free entry" : "Paid", event.language, event.host]
          .filter(Boolean)
          .join(" · ")}
      </Text>
      {event.note && (
        <Text className="mt-2 text-faint" textType="small" as="p">
          {event.note}
        </Text>
      )}

      <NextLink
        className="mt-auto pt-6"
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button buttonType="cta" className="w-full sm:w-auto">
          Register
        </Button>
      </NextLink>
    </div>
  </div>
);

/** Tailwind needs the whole class name in the source, so these are spelled out. */
const LAYOUT: Record<number, string> = {
  1: "max-w-md",
  2: "sm:grid-cols-2 max-w-4xl",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

export const SideEventList = async () => {
  // From Strapi, so an event can be added without a deploy; falls back to the
  // list in the repo when Strapi is unreachable.
  const events = await getSideEvents();
  const sorted = [...events].sort((a, b) =>
    `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`),
  );

  if (!sorted.length) {
    return (
      <Text textType="sub_title" className="text-gradient">
        Individual side events will be announced soon
      </Text>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Fewer events than columns used to leave a third of the row empty, so
          the track narrows to what there actually is. */}
      <div
        className={`grid grid-cols-1 gap-6 ${LAYOUT[Math.min(sorted.length, 3)]}`}
      >
        {sorted.map((event) => (
          <SideEventCard key={event.id} event={event} />
        ))}
      </div>
      <Text as="p" textType="small" className="text-faint">
        More are added as they are confirmed.
      </Text>
    </div>
  );
};

export default SideEventList;
