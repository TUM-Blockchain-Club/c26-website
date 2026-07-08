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
      className="w-full flex flex-col items-center justify-center gap-4"
      id="speaker"
    >
      <Text as="p" textType="small" className="eyebrow-tbc text-center">
        Voices from past editions
      </Text>
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Previous Speakers
      </Text>
      <div
        className={
          "w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-8 mt-8 justify-items-center"
        }
      >
        {filteredSpeakers &&
          filteredSpeakers.map((speaker, index) => (
            <SpeakerComponent key={index} {...speaker} />
          ))}
      </div>
    </section>
  );
};

export default Speaker;
