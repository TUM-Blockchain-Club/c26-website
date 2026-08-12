import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { SponsorCardGenerator } from "@/components/brand/SponsorCardGenerator";

// Unlisted: reachable only with the link, and kept out of search engines.
// Internal tool for preparing sponsor announcement posts.
export const metadata: Metadata = {
  title: "Sponsor Card · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export default function SponsorCardPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Internal tool
              </Text>
              <Text textType="hero" className="text-gradient">
                Sponsor Card
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              Prepare a sponsor announcement post. Pick the tier — Platinum,
              Gold, Silver or Bronze, each with its own colour and ring — and
              upload that post&apos;s sponsor logos. Download it as a video in
              16:9 or 4:5, or as a still image. It always reads as an official
              TUM Blockchain Conference 26 sponsor announcement, however many
              logos are on it.
            </Text>
          </div>

          <div className="mt-16">
            <SponsorCardGenerator />
          </div>

          <div className="mt-10 max-w-2xl">
            <Text
              as="p"
              textType="small"
              className="text-faint leading-relaxed"
            >
              This page is unlisted: it is only reachable with this link, so
              feel free to share it directly with whoever prepares sponsor
              posts.
            </Text>
          </div>
        </Container>
      </main>
    </div>
  );
}
