import { Button } from "@/components/button";
import { Text } from "@/components/text";
import { Speaker as SpeakerComponent } from "@/components/speaker";
// import { useSpeaker } from "@/hooks/useSpeaker";
import { Link } from "@/components/link";
// import { fetchSpeakers } from "@/components/service/contentStrapi";
import { featuredPastSpeakers } from "@/constants/PastSpeakers";

const Speaker = async () => {
  // const speakers = await fetchSpeakers();
  // const filteredSpeakers = speakers
  //   .filter((speaker) => {
  //     const priority = Number(speaker.priority);
  //     return !isNaN(priority) && priority <= 3;
  //   })
  //   .sort((a, b) => Number(a.priority) - Number(b.priority));

  const filteredSpeakers = featuredPastSpeakers;

  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-12 lg:gap-20"
      id="speaker"
    >
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Previous Speakers
      </Text>
      <div className={"grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6"}>
        {filteredSpeakers &&
          filteredSpeakers.map((speaker, index) => (
            <SpeakerComponent key={index} {...speaker} />
          ))}
      </div>
      <div className="md:flex space-x-0 md:space-x-4 space-y-4 md:space-y-0">
        {/* <div>
          <div className="w-full flex justify-center">
            <Button disabled>Apply as speaker</Button>
          </div>
        </div> */}
        <div>
          <div className="w-full flex gap-4 justify-center">
            <Button buttonType={"secondary"} asChild>
              <Link href={"/speakers"}>All speakers</Link>
              {/* <Link href={""}>All 2024 speakers</Link> */}
            </Button>
            <Button buttonType={"cta"} asChild>
              <Link href={"https://tally.so/r/w8EB0o"}>Apply as Speaker</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speaker;
