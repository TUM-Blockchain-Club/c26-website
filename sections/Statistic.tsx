import { Text } from "@/components/text";

const Statistic = () => {
  return (
    <section
      className={
        "w-full flex flex-col lg:flex-row justify-center items-center xl:items-start gap-12"
      }
    >
      <div className={"flex flex-col items-center"}>
        <Text textType={"sub_title"} className={""}>
          Last Year's Statistics
        </Text>
        <div className={"flex flex-col items-center lg:flex-row gap-12 mt-12"}>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              1200+
            </Text>
            <Text textType={"sub_title"}>Attendees</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              125+
            </Text>
            <Text textType={"sub_title"}>Speakers</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              18
            </Text>
            <Text textType={"sub_title"}>Sponsors</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              57
            </Text>
            <Text textType={"sub_title"}>Talks</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              12
            </Text>
            <Text textType={"sub_title"}>Panels</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              4
            </Text>
            <Text textType={"sub_title"}>Workshops</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              1
            </Text>
            <Text textType={"sub_title"}>Ideathon</Text>
          </div>
          <div className={"flex flex-col gap-2 items-center lg:items-center"}>
            <Text className={""} textType={"sub_hero"}>
              1
            </Text>
            <Text textType={"sub_title"}>Researchathon</Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistic;
