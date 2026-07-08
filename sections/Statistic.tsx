import { Text } from "@/components/text";

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

const Statistic = () => {
  return (
    <section className="w-full flex flex-col items-center gap-4">
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Last edition in numbers
      </Text>
      <Text textType={"sub_hero"} className={"text-gradient text-center"}>
        Last Year&apos;s Statistics
      </Text>
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card-tbc-soft flex flex-col items-center gap-1 py-6 px-2 hover:-translate-y-1 min-w-0"
          >
            <Text
              className="stat-value !font-display font-bold !text-3xl lg:!text-5xl"
              textType={"title"}
            >
              {stat.value}
            </Text>
            <Text
              textType={"small"}
              className="uppercase tracking-wide text-white/60 text-center break-words max-w-full"
            >
              {stat.label}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistic;
