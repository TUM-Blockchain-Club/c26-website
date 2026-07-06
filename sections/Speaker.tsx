import { Text } from "@/components/text";
import { Speaker as SpeakerComponent } from "@/components/speaker";
// import { useSpeaker } from "@/hooks/useSpeaker";
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
    </section>
  );
};

export default Speaker;
