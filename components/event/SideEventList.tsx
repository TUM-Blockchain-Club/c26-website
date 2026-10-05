import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { Text } from "@/components/text";
import { sideEvents26, type SideEvent26 } from "@/constants/sideEvents26";

/**
 * The side events, one wide card each: a date block on the left, the event on
 * the right. Wide rather than a tile grid because these are few and each one
 * carries a practical note an attendee has to read before turning up.
 */

const MONTH = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("en-DE", { month: "short", timeZone: "Europe/Berlin" })
    .toUpperCase();
const DAY = (iso: string) =>
  new Date(iso).toLocaleDateString("en-DE", {
    day: "numeric",
    timeZone: "Europe/Berlin",
  });
const WEEKDAY = (iso: string) =>
  new Date(iso).toLocaleDateString("en-DE", {
    weekday: "long",
    timeZone: "Europe/Berlin",
  });

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-line px-3 py-1">
    <Text as="span" textType="small" className="text-secondary">
      {children}
    </Text>
  </span>
);

const SideEventCard = ({ event }: { event: SideEvent26 }) => (
  <article className="card-tbc-soft flex flex-col gap-7 p-6 md:flex-row md:gap-9 md:p-8">
    {/* Date block */}
    <div className="flex shrink-0 flex-row items-center gap-4 md:w-36 md:flex-col md:items-start md:gap-1">
      <Text
        as="p"
        textType="small"
        className="font-bold uppercase tracking-[0.25em] eyebrow-tbc"
      >
        {MONTH(event.date)}
      </Text>
      <Text
        as="p"
        textType="title"
        className="text-gradient font-bold leading-none"
      >
        {DAY(event.date)}
      </Text>
      <div className="flex flex-col md:mt-2">
        <Text as="p" textType="small" className="text-secondary">
          {WEEKDAY(event.date)}
        </Text>
        <Text as="p" textType="small" className="text-faint">
          {event.start} to {event.end}
        </Text>
      </div>
    </div>

    {/* The event */}
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text as="p" textType="sub_title" className="font-bold leading-snug">
          {event.title}
        </Text>
        <Text as="p" textType="paragraph" className="text-secondary">
          {event.tagline}
        </Text>
      </div>

      <div className="flex flex-wrap gap-2">
        {event.free && <Chip>Free entry</Chip>}
        <Chip>{event.language}</Chip>
        <Chip>{event.venue}</Chip>
      </div>

      <Text
        as="p"
        textType="paragraph"
        className="text-secondary max-w-3xl leading-relaxed"
      >
        {event.description}
      </Text>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {event.topics.map((topic) => (
          <span key={topic} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-tbc"
              aria-hidden
            />
            <Text as="span" textType="small" className="text-faint">
              {topic}
            </Text>
          </span>
        ))}
      </div>

      {event.note && (
        <div className="border-l-2 border-tbc-yellow/60 pl-4">
          <Text
            as="p"
            textType="small"
            className="text-secondary max-w-2xl leading-relaxed"
          >
            {event.note}
          </Text>
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button buttonType="cta" asChild className="w-fit px-6">
          <Link href={event.link} target="_blank" rel="noopener noreferrer">
            Register
          </Link>
        </Button>
        <Text as="p" textType="small" className="text-faint">
          Hosted by {event.host}
        </Text>
      </div>
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
    <div className="flex flex-col gap-6">
      {sorted.map((event) => (
        <SideEventCard key={event.id} event={event} />
      ))}
      <Text as="p" textType="small" className="text-faint max-w-2xl">
        More side events are added here as they are confirmed. Running something
        that week? Tell us and we will list it.
      </Text>
    </div>
  );
};

export default SideEventList;
