import { Text } from "@/components/text";

const Sponsors = () => {
  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-12 lg:gap-20"
      id="sponsors"
    >
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Sponsors
      </Text>
      <Text as="p" textType="paragraph" className="text-center max-w-3xl">
        Sponsor placement is being finalized. Visit again soon for details on
        our sponsors and support partners.
      </Text>
    </section>
  );
};

export default Sponsors;
