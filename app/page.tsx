export const dynamic = "force-static";

import Sparkle from "@/components/Sparkle";
import { Container } from "@/components/container";
import Statistic from "@/sections/Statistic";
import AcademicForum from "@/sections/AcademicForum";
import AfterEvents from "@/sections/AfterEvents";
import FAQSection from "@/sections/FAQ";
import Grants from "@/sections/Grants";
import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import Partners from "@/sections/Partners";
import Speaker from "@/sections/Speaker";
import Sponsors from "@/sections/Sponsors";
import Tickets from "@/sections/Tickets";
import Tracks from "@/sections/Tracks";
import Venue from "@/sections/Venue";
import Video from "@/sections/Video";

export default function Home() {
  return (
    <>
      <div>
        <Sparkle />
        <main
          className={
            "w-full flex justify-center items-center pt-[25px] lg:pt-0 z-20"
          }
        >
          <Container>
            <div className={"flex flex-col max-w-7xl z-10"}>
              <Hero />
              <div className={"flex flex-col pb-24 gap-32"}>
                <Video />
                <Statistic />
                <Manifesto />
                <Tracks />
                {/* <Venue /> */}
                <Tickets />
                {/* <Grants /> */}
                <Speaker />
                <Sponsors />
                <Partners />
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}
