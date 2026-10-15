import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { PartnerCardGenerator } from "@/components/brand/PartnerCardGenerator";
import { ASSOCIATION_CARD_CONFIG } from "@/util/partnerCardVideo";

// Unlisted: reachable only with the link, and kept out of search engines.
// Self-serve tool for the associations and federations backing the
// conference, kept apart from the community partner card because the
// audience is the banking and industry bodies rather than the Web3 scene.
export const metadata: Metadata = {
  title: "Association Card · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

export default function AssociationCardPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Associations and federations
              </Text>
              <Text textType="hero" className="text-gradient">
                Association Card
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              Standing with the TUM Blockchain Conference 26 as an association
              or federation? Generate an animated &ldquo;Association
              Partner&rdquo; card carrying your logo next to the conference
              marks. Download it as a video in 16:9 or 4:5, or as a still image.
              Everything runs in your browser, and nothing is uploaded.
            </Text>
          </div>

          <div className="mt-16">
            <PartnerCardGenerator
              config={ASSOCIATION_CARD_CONFIG}
              slug="association"
            />
          </div>

          <div className="mt-10 max-w-2xl">
            <Text
              as="p"
              textType="small"
              className="text-faint leading-relaxed"
            >
              This page is unlisted: it is only reachable with this link, so
              feel free to share it directly with the associations.
            </Text>
          </div>
        </Container>
      </main>
    </div>
  );
}
