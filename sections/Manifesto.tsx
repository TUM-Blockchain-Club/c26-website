import { Text } from "@/components/text";

const Manifesto = () => {
  return (
    <section className="w-full flex justify-center items-center" id="manifesto">
      <div className={"w-full flex flex-col gap-12 lg:gap-20 px-2 lg:px-0"}>
        <div className={"w-full flex justify-center"}>
          <Text textType={"sub_hero"} className="text-gradient">
            Manifesto
          </Text>
        </div>
        <div className="w-full flex justify-center">
          <Text
            as={"p"}
            className="text-center lg:text-left md:text-left max-w-[80%] sm:max-w-[42rem]"
          >
            The 3rd iteration of the TUM Blockchain Conference unites
            <b> visionaries and thought leaders</b> in a non-profit setting to
            transform Web3’s potential from promise to action through
            collaboration and open dialogue. This initiative, organized by the
            TUM Blockchain Club, is fueled by students’ passion for education,
            innovation, and community
            <br />
            <br />
            In a fragmented digital world, where AI undermines identity and
            information, DeFi, governance, and sustainability innovations
            struggle to scale, Web3’s convergence with AI and IoT demands new
            ways to <b> trust, transact, and connect</b>. This conference is our
            response: a platform to break down barriers and drive progress.
            <br />
            <br />
            We’re gathering developers, policymakers, academics, industry
            leaders, and legal experts to advance the Web3 ecosystem across
            industries and borders. Through insightful panels, talks, and
            use-case showcases across <a href="#tracks">five tracks</a>, this
            year’s conference underscores why Web3 is not just a technology—it’s
            a <b>societal imperative</b>.
          </Text>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
