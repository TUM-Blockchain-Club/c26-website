export const dynamic = "force-static";
// Re-render every 10 minutes so newly published Strapi content (community
// partners) appears without a redeploy.
export const revalidate = 600;

import Sparkle from "@/components/Sparkle";
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
                  in, where is it, who else is behind it, how do I take part
                  myself — and only then what last year looked like. */}
              <div className={"flex flex-col pb-24 gap-32"}>
                <ThreeDays />
                <WhatsNew />
                {/* Who backs it, once and in tiers: the credibility beat
                    right before the ticket ask. */}
                <CurrentSponsors />
                {/* <Manifesto /> */}
                {/* <Tracks /> */}
                <Tickets />
                {/* Where to go, right after the ticket ask. */}
                <Venue />
                {/* <Grants /> */}
                <CommunityPartners />
                <Sponsors />
                <GetInvolved />
                {/* Last year, as proof, and last on the page: the aftermovie,
                    the numbers, the photos and the speakers who were on stage.
                    It sells tickets, but this year has to come first. */}
                <Video />
                <Statistic />
                <LastYearGallery />
                <Speaker />
                {/* <Partners /> */}
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
}
