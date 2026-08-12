import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { ExternalSponsorCardGenerator } from "@/components/brand/ExternalSponsorCardGenerator";

// Unlisted: reachable only with the link, and kept out of search engines.
// Self-serve tool for sponsors to generate their own announcement card.
export const metadata: Metadata = {
  title: "Sponsor Card · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export default function ExternalSponsorCardPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Sponsors
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
              Proud to sponsor the TUM Blockchain Conference 26? Generate an
              animated &ldquo;Official Sponsor&rdquo; card in our brand,
              featuring your logo with the conference logo in the corner.
              Download it as a video in 16:9 or 4:5, or as a still image, and
              share it with your audience. Everything runs in your browser, and
              nothing is uploaded.
            </Text>
          </div>

          <div className="mt-16">
            <ExternalSponsorCardGenerator />
          </div>

          <div className="mt-10 max-w-2xl">
            <Text
              as="p"
              textType="small"
              className="text-faint leading-relaxed"
            >
              This page is unlisted: it is only reachable with this link, so
              feel free to share it directly with sponsors.
            </Text>
          </div>
        </Container>
      </main>
    </div>
  );
}
