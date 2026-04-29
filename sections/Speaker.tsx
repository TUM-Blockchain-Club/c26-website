import { Text } from "@/components/text";

const Speaker = () => {
  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-12 lg:gap-20"
      id="speaker"
    >
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Speakers
      </Text>
      <Text as="p" textType="paragraph" className="text-center max-w-3xl">
        Speaker details will be updated soon. Check back here for the full
        lineup once it is finalized.
      </Text>
    </section>
  );
};

export default Speaker;
