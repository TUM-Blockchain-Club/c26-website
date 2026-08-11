import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { SpeakerCardGenerator } from "@/components/brand/SpeakerCardGenerator";

// Unlisted: reachable only with the link, and kept out of search engines.
export const metadata: Metadata = {
  title: "Speaker Card · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export default function SpeakerCardPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Speakers
              </Text>
              <Text textType="hero" className="text-gradient">
                Speaker Card
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              Speaking at the TUM Blockchain Conference 26? Generate an animated
              &ldquo;I&apos;m speaking at&rdquo; card in our brand, featuring
              your photo, name, role and a line about your talk. Download it as
              a video in 16:9 or 4:5, and copy a ready-made post for X,
              Instagram or LinkedIn, personalised to what you entered and
              tagging the right accounts. Everything runs in your browser, and
              nothing is uploaded.
            </Text>
          </div>

          <div className="mt-16">
            <SpeakerCardGenerator />
          </div>

          <div className="mt-10 max-w-2xl">
            <Text
              as="p"
              textType="small"
              className="text-faint leading-relaxed"
            >
              This page is unlisted: it is only reachable with this link, so
              feel free to share it directly with confirmed speakers.
            </Text>
          </div>
        </Container>
      </main>
    </div>
  );
}
