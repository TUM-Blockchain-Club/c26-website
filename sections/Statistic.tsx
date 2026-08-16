import { Text } from "@/components/text";

/**
 * Last edition's numbers as a bento grid: the headline figure (attendees)
 * anchors a 2×2 tile, speakers get a wide tile, the rest fill in around
 * them — hierarchy instead of eight identical boxes.
 */
const stats = [
  { value: "1200+", label: "Attendees" },
  { value: "125+", label: "Speakers" },
  { value: "18", label: "Sponsors" },
  { value: "57", label: "Talks" },
  { value: "12", label: "Panels" },
  { value: "4", label: "Workshops" },
  { value: "1", label: "Ideathon" },
  { value: "1", label: "Researchathon" },
];

const Tile = ({
  value,
  label,
  className = "",
  big = false,
}: {
  value: string;
  label: string;
  className?: string;
  big?: boolean;
}) => (
  <div
    className={`${
      big ? "card-tbc" : "card-tbc-soft"
    } flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-6 ${className}`}
  >
    <Text
      className={
        big
          ? "text-gradient !font-display font-bold !text-6xl lg:!text-8xl"
          : "stat-value !font-display font-bold !text-3xl lg:!text-5xl"
      }
      textType={"title"}
    >
      {value}
    </Text>
    <Text
      textType={big ? "lgsmall" : "small"}
      className="uppercase tracking-wide text-muted text-center break-words max-w-full"
    >
      {label}
    </Text>
  </div>
);

const Statistic = () => {
  const [attendees, speakers, ...rest] = stats;
  return (
    <section className="w-full flex flex-col items-center gap-4">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Last edition in numbers
      </Text>
      <Text textType={"sub_hero"} className={"text-gradient text-center"}>
        Last Year&apos;s Statistics
      </Text>
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-8">
        <Tile
          value={attendees.value}
          label={attendees.label}
          className="col-span-2 row-span-2 min-h-[220px]"
          big
        />
        <Tile
          value={speakers.value}
          label={speakers.label}
          className="col-span-2"
        />
        {rest.map((stat) => (
          <Tile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
};

export default Statistic;
