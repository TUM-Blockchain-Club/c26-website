import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { PartnerTimeline } from "@/components/brand/PartnerTimeline";
import { PartnerNewsletter } from "@/components/brand/PartnerNewsletter";
import { PartnerCommunityPosts } from "@/components/brand/PartnerCommunityPosts";
import { PartnerCardGenerator } from "@/components/brand/PartnerCardGenerator";
import { SideEventInquiryForm } from "@/components/brand/SideEventInquiryForm";
import { LogoDownloads } from "@/components/brand/LogoShowcase";
import ScheduleOverview from "@/components/schedule/ScheduleOverview";
import { partnerGuidelineIntro } from "@/constants/partnerTimeline";

export const metadata: Metadata = {
  title: "Partner Portal · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

const SectionHeader = ({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <Text as="p" textType="small" className="eyebrow-tbc">
        {eyebrow}
      </Text>
      <Text textType="sub_hero" className="text-gradient">
        {title}
      </Text>
    </div>
    {intro && (
      <Text
        as="p"
        textType="paragraph"
        className="text-secondary max-w-2xl leading-relaxed"
      >
        {intro}
      </Text>
    )}
  </div>
);

export default function PartnersPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Partner portal
              </Text>
              <Text textType="hero" className="text-gradient">
                Welcome on Board
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              We&apos;re so happy to have you as a Community Partner of the TUM
              Blockchain Conference 26. Below you&apos;ll find our suggestions
              for spreading the word: two social posts, a newsletter mention,
              quick community messages, a card generator and our logos. Use them
              as they are or adapt everything to your own style, it is entirely
              up to you. Thank you for being part of it!
            </Text>
          </div>

          <div className="mt-24 flex flex-col gap-40">
            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Suggestion 1"
                title="Two Posts"
                intro={partnerGuidelineIntro}
              />
              <PartnerTimeline />
            </section>

            <section
              id="card-generator"
              className="flex flex-col gap-12 scroll-mt-24"
            >
              <SectionHeader
                eyebrow="Tool"
                title="Card Generator"
                intro="Generate an animated partner card in our brand: the conference ring, our colors, the date and location, paired with your logo and name. Download it in 16:9 or 4:5 to go with your announcement post."
              />
              <PartnerCardGenerator />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Suggestion 2"
                title="Newsletter"
                intro="One mention in your own newsletter goes a long way. Here is a full draft with everything about the conference, ready to send if you want it. Copy the subject line and the body, shorten it, rewrite it, or just take the facts, whatever fits your format."
              />
              <PartnerNewsletter />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Optional, very welcome"
                title="Share in Your Communities"
                intro="If you have active Telegram or WhatsApp groups, a quick share there helps a lot. These are optional on top of the two posts, and every one of them is genuinely appreciated."
              />
              <PartnerCommunityPosts />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Go further"
                title="Want to Be Even More Involved?"
                intro="We'd absolutely love that! You can host your own side event around the conference, and we'll give it a highlighted spot in our official side events agenda so it gets even more reach. Below is where side events fit into the four days, so you can see when yours could take place. Tell us what you have in mind and we'll take it from there."
              />
              <ScheduleOverview highlightSideEvents />
              <SideEventInquiryForm />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Our Logos"
                intro="Download our logos for your posts, newsletter and website. SVG and PNG, or grab everything as a zip."
              />
              <LogoDownloads />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
