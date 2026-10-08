import { Button } from "@/components/button";
import Image from "next/image";
import NextLink from "next/link";
import { Text } from "@/components/text";
import { sideEvents26, type SideEvent26 } from "@/constants/sideEvents26";

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
  <div className="flex flex-col overflow-hidden rounded-none border border-white p-6 duration-500 ease-in-out hover:scale-[102%]">
    <div className="relative aspect-square w-full overflow-hidden rounded-none">
      <Visual event={event} />
    </div>

    <Text textType="sub_title" as="p" className="mt-6 line-clamp-2">
      {event.title}
    </Text>
    <Text className="mt-2 underline" textType="small" as="p">
      {fmt(event.date, { weekday: "long", month: "long", day: "numeric" })} |{" "}
      {event.start} - {event.end} CET
    </Text>
    <Text className="mt-2 line-clamp-3 text-gray-400" textType="small" as="p">
      {event.description}
    </Text>
    <Text className="mt-2 text-gray-400" textType="small" as="p">
      {[event.free ? "Free entry" : null, event.language, event.venue]
        .filter(Boolean)
        .join(" · ")}
    </Text>
    {event.note && (
      <Text className="mt-2 text-muted" textType="small" as="p">
        {event.note}
      </Text>
    )}

    <NextLink
      className="mt-auto"
      href={event.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button className="mt-4" buttonType="cta">
        Learn More
      </Button>
    </NextLink>
  </div>
);

export const SideEventList = () => {
  const sorted = [...sideEvents26].sort((a, b) =>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
