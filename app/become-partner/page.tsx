import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import {
  BecomePartnerForm,
  type PartnerType,
} from "@/components/brand/BecomePartnerForm";

export const metadata: Metadata = {
  title: "Become a Partner · TUM Blockchain Conference 26",
};

export default async function BecomePartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialType: PartnerType = type === "media" ? "media" : "community";

  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Partner with us
              </Text>
              <Text textType="hero" className="text-gradient">
                Become a Partner
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              You run a community or a media outlet and want to be part of the
              TUM Blockchain Conference 26? We would love that! Pick what fits
              you best, tell us a little about yourself and we will get back to
              you quickly.
            </Text>
          </div>

          <div className="mt-24">
            <BecomePartnerForm initialType={initialType} />
          </div>
        </Container>
      </main>
    </div>
  );
}
