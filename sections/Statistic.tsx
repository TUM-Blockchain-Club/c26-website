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
    <section
      className={
        "w-full flex flex-col lg:flex-row justify-center items-center xl:items-start gap-12"
      }
    >
      <div className={"flex flex-col items-center"}>
        <Text textType={"sub_hero"} className={"text-gradient text-center"}>
          Last Year&apos;s Statistics
        </Text>
        <div className={"flex flex-wrap justify-center gap-x-10 gap-y-8 mt-12"}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={
                "flex flex-col gap-2 items-center transition-transform duration-300 hover:-translate-y-1"
              }
            >
              <Text className={"stat-value"} textType={"sub_hero"}>
                {stat.value}
              </Text>
              <Text textType={"sub_title"}>{stat.label}</Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistic;
