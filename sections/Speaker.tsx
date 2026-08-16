import { Text } from "@/components/text";
import { Speaker as SpeakerComponent } from "@/components/speaker";
import { pastSpeakers } from "@/constants/PastSpeakers";

/**
 * Previous speakers as an endless marquee: one slow row drifting left,
 * duplicated for a seamless loop, pausing on hover (CSS in globals.css,
 * reduced-motion safe). Edge fade via mask keeps it feeling embedded.
 */
const Speaker = async () => {
  const speakers = pastSpeakers;

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex gap-8 pr-8" aria-hidden={hidden || undefined}>
      {speakers.map((speaker, index) => (
        <div key={index} className="w-[170px] shrink-0">
          <SpeakerComponent {...speaker} />
        </div>
      ))}
    </div>
  );

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
      <div className="marquee w-full mt-8">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
};

export default Speaker;
