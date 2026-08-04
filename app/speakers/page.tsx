import { Container } from "@/components/container";
import { Speaker as SpeakerComponent } from "@/components/speaker";
import { Text } from "@/components/text";
import { SpeakerApplicationForm } from "@/components/brand/SpeakerApplicationForm";
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
      <main className={"w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40"}>
        <Container>
          <section
            id="apply"
            className="mt-page-top md:mt-page-top-lg z-10 scroll-mt-28 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3 max-w-3xl">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Call for speakers
              </Text>
              <Text textType={"sub_hero"} className="text-gradient text-left">
                Apply to Speak
              </Text>
              <Text
                as="p"
                textType="paragraph"
                className="text-secondary max-w-2xl leading-relaxed"
              >
                Want to share your work on stage at the TUM Blockchain
                Conference 26? Tell us who you are, what you would like to talk
                about and a bit about your background. We review every
                application and get back to you.
              </Text>
            </div>
            <div className="max-w-2xl">
              <SpeakerApplicationForm />
            </div>
          </section>

          <div className={"mt-32 z-10 max-w-3xl"}>
            <div className="lg:flex items-center">
              <Text textType={"sub_hero"} className="text-gradient text-left">
                Previous Speakers
              </Text>
            </div>
          </div>
          <div
            className={
              "grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-6 mt-24 justify-items-center"
            }
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
