import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { LumaTicketButton } from "@/components/luma-ticket-button";
import { DigitalAssetsDayAgenda } from "@/components/agenda/DigitalAssetsDayAgenda";
import { BundesblockContactForm } from "@/components/brand/BundesblockContactForm";
import DigitalAssetsDayLogoWhite from "@/public/logos/digital-assets-day-logo-white.png";

export const metadata: Metadata = {
  title: "Digital Assets Day · TUM Blockchain Conference 26",
  description:
    "The curated conference and meeting point for strategists and managers in charge of digital assets, the new money stack and our industrial digital infrastructure. Munich, Friday, October 30, 2026.",
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
  <div className="flex flex-col gap-5">
    <div className="flex flex-col gap-3">
      <Text
        as="p"
        textType="small"
        className="font-bold uppercase tracking-[0.2em] text-blue-300"
      >
        {eyebrow}
      </Text>
      <Text textType="sub_hero" className="text-blue-100">
        {title}
      </Text>
    </div>
    {intro && (
      <Text
        as="p"
        textType="paragraph"
        className="text-secondary max-w-3xl leading-relaxed"
      >
        {intro}
      </Text>
    )}
  </div>
);

const VISION = [
  "The Digital Assets Day wants to pave the way for strategic discussions and hands-on assessments of the building blocks needed to drive European digital sovereignty and economic efficiency. As digital assets become mainstream, we discuss tokenization, stablecoins, digital capital markets, institutional trust infrastructure, and regulation under one roof.",
  "The ambition is to bring together the key players shaping the future of digital finance, from policymakers and financial institutions to technology and industry leaders, investors and innovators.",
  "Participants will gain actionable insights, connect with senior decision-makers, and explore the technologies and policies driving the next generation of financial markets, and the touchpoints between blockchain and AI based innovation in the finance sector and the operational reality of all other industries. Whether you are a forward thinker, a builder, an investor, or in charge of regulation or legal operations, the Digital Assets Day is where strategy, innovation and collaboration converge.",
];

export default function DigitalAssetsDayPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          {/* Header with a large blue conference ring behind a white wordmark */}
          <div className="relative overflow-hidden">
            {/* Huge, blurry blue ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[44%] z-0 h-[175vw] w-[175vw] max-h-[1200px] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[40px]"
            >
              <div className="hero-ring-wobble relative h-full w-full">
                <Image
                  src="/hero/mask-group-1.png"
                  alt=""
                  fill
                  priority
                  sizes="1200px"
                  className="object-contain"
                  style={{
                    filter:
                      "grayscale(1) brightness(1.1) sepia(1) hue-rotate(185deg) saturate(4)",
                  }}
                />
              </div>
            </div>
            {/* Readability veil */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65"
            />

            <div className="relative z-10 mt-page-top md:mt-page-top-lg flex flex-col gap-8 py-10 lg:py-20">
              <Image
                src={DigitalAssetsDayLogoWhite}
                alt="Digital Assets Day by Bundesblock"
                className="h-14 w-auto self-start drop-shadow-[0_2px_28px_rgb(66_133_244_/_0.5)] sm:h-16 lg:h-20"
                priority
              />
              <Text
                as="p"
                textType="sub_title"
                className="max-w-3xl font-semibold leading-snug text-blue-50"
              >
                The curated conference and meeting point for strategists and
                managers in charge of digital assets, the new money stack and
                our industrial digital infrastructure.
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-400/40 bg-blue-400/[0.08] px-4 py-1.5 backdrop-blur-sm">
                  <Text
                    as="span"
                    textType="lgsmall"
                    className="font-bold text-blue-100"
                  >
                    Munich · Friday, October 30, 2026
                  </Text>
                </span>
                <span className="rounded-full border border-blue-400/25 bg-blue-400/[0.04] px-4 py-1.5 backdrop-blur-sm">
                  <Text as="span" textType="small" className="text-secondary">
                    Day 2 · Curated by Bundesblock
                  </Text>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-32">
            {/* Vision */}
            <section className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Our vision"
                title="What Is the Digital Assets Day?"
              />
              <div className="flex flex-col gap-5">
                {VISION.map((paragraph, i) => (
                  <Text
                    key={i}
                    as="p"
                    textType="paragraph"
                    className="text-secondary max-w-3xl leading-relaxed"
                  >
                    {paragraph}
                  </Text>
                ))}
              </div>
            </section>

            {/* Agenda structure */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                eyebrow="Programme"
                title="Agenda Structure"
                intro="A preliminary look at the two stages of the Digital Assets Day. Session titles are excerpts and may still change."
              />
              <DigitalAssetsDayAgenda />
              <div>
                <Button
                  buttonType="cta"
                  asChild
                  className="btn-blue w-fit px-6"
                >
                  <Link href="/agenda">See the full agenda</Link>
                </Button>
              </div>
            </section>

            {/* Speakers & Sponsors */}
            <section className="flex flex-col gap-10">
              <SectionHeader eyebrow="Line-up" title="Speakers & Sponsors" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {["Speakers", "Sponsors"].map((label) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-blue-400/40 bg-blue-400/[0.03] px-6 py-12 text-center"
                  >
                    <Text as="p" textType="lgsmall" className="font-bold">
                      {label}
                    </Text>
                    <Text as="p" textType="small" className="text-muted">
                      To be announced soon
                    </Text>
                  </div>
                ))}
              </div>
            </section>

            {/* Tickets */}
            <section className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Join us"
                title="Tickets"
                intro="The Digital Assets Day is Day 2 of the TUM Blockchain Conference 26 + Hackathon, so one conference ticket gets you into all of it. Early Bird tickets are available until July 31."
              />
              <div className="card-blue flex flex-col gap-4 p-7">
                <LumaTicketButton
                  id="luma-ticket-btn-dad"
                  className="btn-blue w-fit px-8 py-4 text-base font-bold"
                >
                  Get Early Bird Tickets
                </LumaTicketButton>
                <Text
                  as="p"
                  textType="small"
                  className="text-secondary max-w-xl"
                >
                  Your ticket covers the full conference and Hackathon, October
                  29 to 31 in Munich. Bundesblock member? Reach out to the team
                  below for discounts.
                </Text>
              </div>
            </section>

            {/* Contact */}
            <section className="flex flex-col gap-8">
              <SectionHeader eyebrow="Get in touch" title="Contact" />
              <BundesblockContactForm />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
