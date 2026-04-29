import { Text } from "@/components/text";

const Partners = () => {
  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-12 lg:gap-20"
      id="partners"
    >
      <Text textType={"sub_hero"} className="text-gradient text-center">
        Partners
      </Text>
      <Text as="p" textType="paragraph" className="text-center max-w-3xl">
        Partner details are coming soon. We will share the organizations
        collaborating with us once everything is confirmed.
      </Text>
    </section>
  );
};

export default Partners;
