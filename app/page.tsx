export const dynamic = "force-static";
// Re-render every 10 minutes so newly published Strapi content (community
// partners) appears without a redeploy.
export const revalidate = 600;

import Sparkle from "@/components/Sparkle";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/container";
import Statistic from "@/sections/Statistic";
import AcademicForum from "@/sections/AcademicForum";
import AfterEvents from "@/sections/AfterEvents";
import FAQSection from "@/sections/FAQ";
import Grants from "@/sections/Grants";
import Hero from "@/sections/Hero";
import LastYearGallery from "@/sections/LastYearGallery";
import Manifesto from "@/sections/Manifesto";
import Partners from "@/sections/Partners";
import Speaker from "@/sections/Speaker";
import CommunityPartners from "@/sections/CommunityPartners";
import CurrentSponsors from "@/sections/CurrentSponsors";
import Sponsors from "@/sections/Sponsors";
import GetInvolved from "@/sections/GetInvolved";
import ThreeDays from "@/sections/ThreeDays";
import Tickets from "@/sections/Tickets";
import Tracks from "@/sections/Tracks";
import Venue from "@/sections/Venue";
import Video from "@/sections/Video";
import WhatsNew from "@/sections/WhatsNew";

export default function Home() {
  return (
    <>
      <div>
        <Sparkle />
        <main
          className={
            "w-full flex justify-center items-center pt-page-pt lg:pt-0 z-20"
          }
        >
          <Container className={"w-full"}>
            <div className={"flex flex-col w-full max-w-7xl mx-auto z-10"}>
              <Hero />
              {/* Order follows the question a visitor asks next: what are
                  the three days and what is new, who backs it, how do I get
                  in, what was last year like, who else is behind it, and
                  finally how do I take part myself. */}
              <div className={"flex flex-col pb-24 gap-32"}>
                <Reveal>
                  <ThreeDays />
                </Reveal>
                <Reveal>
                  <WhatsNew />
                </Reveal>
                {/* Who backs it, once and in tiers: the credibility beat
                    right before the ticket ask. */}
                <Reveal>
                  <CurrentSponsors />
                </Reveal>
                {/* <Manifesto /> */}
                {/* <Tracks /> */}
                {/* <Venue /> */}
                <Reveal>
                  <Tickets />
                </Reveal>
                {/* <Grants /> */}
                {/* Last year, as proof: the aftermovie, the numbers, the
                    photos and the speakers who were on stage. */}
                <Reveal>
                  <Video />
                </Reveal>
                <Reveal>
                  <Statistic />
                </Reveal>
                <Reveal>
                  <LastYearGallery />
                </Reveal>
                <Reveal>
                  <Speaker />
                </Reveal>
                {/* This year's ecosystem first, the history after it. */}
                <Reveal>
                  <CommunityPartners />
                </Reveal>
                <Reveal>
                  <Sponsors />
                </Reveal>
                <Reveal>
                  <GetInvolved />
                </Reveal>
                {/* <Partners /> */}
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}
