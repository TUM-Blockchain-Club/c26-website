import { Container } from "@/components/container";
import { Speaker as SpeakerComponent } from "@/components/speaker";
import { Text } from "@/components/text";
// import { fetchSpeakers } from "@/components/service/contentStrapi";
import { pastSpeakers } from "@/constants/PastSpeakers";

const SpeakersPage = async () => {
  // const speakers = await fetchSpeakers();
  // const filteredSpeakers = speakers
  //   .filter((speaker) => {
  //     const priority = Number(speaker.priority);
  //     return !isNaN(priority) && priority >= 0;
  //   })
  //   .sort((a, b) => Number(a.priority) - Number(b.priority));

  const filteredSpeakers = pastSpeakers;

  return (
    <div className={"flex justify-center"}>
      <main className={"w-full max-w-7xl pt-[25px] lg:pt-0 z-20 pb-40"}>
        <Container>
          <div className={"mt-[100px] md:mt-[20vh] z-10 max-w-3xl"}>
            <div className="lg:flex items-center">
              <Text textType={"sub_hero"} className="text-gradient text-left">
                Previous Speakers
              </Text>
            </div>
          </div>
          <div
            className={"grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mt-24"}
          >
            {filteredSpeakers &&
              filteredSpeakers.map((speaker) => (
                <SpeakerComponent
                  key={Number(speaker.id)}
                  {...speaker}
                  id={Number(speaker.id)} // Convert id to string
                />
              ))}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default SpeakersPage;
