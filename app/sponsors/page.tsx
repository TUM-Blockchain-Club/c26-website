import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import CurrentSponsors from "@/sections/CurrentSponsors";
import CommunityPartners from "@/sections/CommunityPartners";
import Sponsors from "@/sections/Sponsors";

export const metadata: Metadata = {
  title: "Sponsors & Partners · TUM Blockchain Conference 26",
  description:
    "The companies backing the TUM Blockchain Conference 26, and the communities and outlets helping spread the word.",
};

// The community partners come from Strapi, so re-render hourly to pick up
// new ones without a redeploy (the same cadence as the media portal).
export const revalidate = 3600;

const SponsorsPage = () => (
  <div className="flex justify-center">
    <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
      <Container>
        <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Text as="p" textType="small" className="eyebrow-tbc">
              Making it happen
            </Text>
            <Text textType="hero" className="text-gradient">
              Sponsors &amp; Partners
            </Text>
          </div>
          <Text
            as="p"
            textType="paragraph"
            className="text-secondary max-w-2xl leading-relaxed"
          >
            The conference is carried by the companies backing it and by the
            communities and outlets helping spread the word. Everyone on this
            page is part of this year&apos;s edition.
          </Text>
        </div>

        <div className="mt-24 flex flex-col gap-32">
          <CurrentSponsors />
          <CommunityPartners />
          <Sponsors displayMode="carousel" />

          <section className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Get involved
              </Text>
              <Text textType="sub_hero" className="text-gradient">
                Join Them
              </Text>
            </div>
            <Text
              as="p"
              textType="small"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              There is still room on this page. Sponsor the conference, join as
              a community or media partner, and help make this year&apos;s
              edition happen.
            </Text>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button buttonType="primary" asChild className="px-5">
                <Link href="/become-partner">Become a Sponsor</Link>
              </Button>
              <Button buttonType="secondary" asChild className="px-5">
                <Link href="/become-partner?type=community">
                  Become a Community Partner
                </Link>
              </Button>
              <Button buttonType="secondary" asChild className="px-5">
                <Link href="/become-partner?type=media">
                  Become a Media Partner
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </Container>
    </main>
  </div>
);

export default SponsorsPage;
