import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { Text } from "@/components/text";
import { sideEvents26, type SideEvent26 } from "@/constants/sideEvents26";

/**
 * The side events, one compact row each: when it is, what it is, and the way
 * in. A pointer to someone else's event, not a second programme, so the card
 * stays to one line of description and the facts an attendee checks before
 * turning up.
 */

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-DE", {
    ...opts,
    timeZone: "Europe/Berlin",
  });

const SideEventCard = ({ event }: { event: SideEvent26 }) => (
  <article className="card-tbc-soft flex flex-col gap-5 p-5 md:flex-row md:items-start md:gap-7 md:p-6">
    {/* When */}
    <div className="flex shrink-0 items-baseline gap-3 md:w-28 md:flex-col md:items-start md:gap-0.5">
      <Text
        as="p"
        textType="sub_title"
        className="text-gradient font-bold leading-none"
      >
        {fmt(event.date, { month: "short", day: "numeric" }).toUpperCase()}
      </Text>
      <Text as="p" textType="small" className="text-faint">
        {fmt(event.date, { weekday: "short" })} · {event.start}–{event.end}
      </Text>
    </div>

    {/* What */}
    <div className="flex min-w-0 flex-col gap-2">
      <Text as="p" textType="lgsmall" className="font-bold leading-snug">
        {event.title}
      </Text>
      <Text
        as="p"
        textType="small"
        className="text-secondary max-w-2xl leading-relaxed"
      >
        {event.description}
      </Text>
      <Text as="p" textType="small" className="text-faint">
        {[event.free ? "Free entry" : null, event.language, event.venue]
          .filter(Boolean)
          .join(" · ")}
      </Text>
      {event.note && (
        <Text as="p" textType="small" className="text-muted max-w-2xl">
          {event.note}
        </Text>
      )}
    </div>

    {/* Way in */}
    <div className="md:ml-auto md:shrink-0">
      <Button buttonType="cta" asChild className="w-fit px-5">
        <Link href={event.link} target="_blank" rel="noopener noreferrer">
          Register
        </Link>
      </Button>
    </div>
  </article>
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
    <div className="flex flex-col gap-4">
      {sorted.map((event) => (
        <SideEventCard key={event.id} event={event} />
      ))}
      <Text as="p" textType="small" className="text-faint">
        More are added as they are confirmed.
      </Text>
    </div>
  );
};

export default SideEventList;
