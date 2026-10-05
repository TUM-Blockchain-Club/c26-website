import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { LumaTicketButton } from "@/components/luma-ticket-button";
import { ConferenceDayAgenda } from "@/components/agenda/ConferenceDayAgenda";

export const metadata: Metadata = {
  title: "TUM Blockchain Conference Day · TUM Blockchain Conference 26",
  description:
    "The opening day of the TUM Blockchain Conference 26: three stages on research, infrastructure and what builders ship, in Munich on Thursday, October 29, 2026.",
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
        className="font-bold uppercase tracking-[0.2em] eyebrow-tbc"
      >
        {eyebrow}
      </Text>
      <Text textType="sub_hero" className="text-gradient text-left">
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
  "The first conference day opens the TUM Blockchain Conference 26. It is the day the whole field is in one building: researchers presenting work that is weeks old, the teams running the infrastructure underneath it, and the people deciding what gets built next.",
  "Three stages run in parallel from morning to late afternoon. Nakamoto carries the main programme, where exchanges, payment rails, prediction markets and capital meet on one stage. Turing is the research track, with cryptographers walking through proofs, privacy and verification. Hopper is where builders and the community talk about what actually ships: wallets, security, identity and the agentic stack.",
  "You do not have to pick a lane. Everything runs in the same house, the breaks line up across all three stages, and a conference ticket covers all three days.",
];

/** The three rooms, in the order they appear in the grid. */
const STAGES = [
  {
    name: "Nakamoto",
    subtitle: "The main stage",
    blurb:
      "Exchanges and DEXs, cloud rails, regulation in code, prediction markets, agent economies, venture capital and Europe's payment infrastructure.",
  },
  {
    name: "Turing",
    subtitle: "Research and cryptography",
    blurb:
      "Verifiable science, proving systems, privacy on public chains, cryptanalysis and the maths underneath the infrastructure, presented by the people who wrote the papers.",
  },
  {
    name: "Hopper",
    subtitle: "Building, security and community",
    blurb:
      "Dapp anatomy, market manipulation, key compromise and audits, identity for humans and AI, self-custody, tokenization and the agentic payments stack.",
  },
];

export default function ConferenceDayPage() {
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          {/* Header with the brand ring behind the wordmark */}
          <div className="relative overflow-hidden">
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
                />
              </div>
            </div>
            {/* Readability veil */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65"
            />

            <div className="relative z-10 mt-page-top md:mt-page-top-lg flex flex-col gap-8 py-10 lg:py-20">
              <div className="flex flex-col gap-3">
                <Text
                  as="p"
                  textType="small"
                  className="font-bold uppercase tracking-[0.2em] eyebrow-tbc"
                >
                  Day 1
                </Text>
                <Text textType="hero" className="text-gradient text-left">
                  Conference Day
                </Text>
              </div>
              <Text
                as="p"
                textType="sub_title"
                className="max-w-3xl font-semibold leading-snug"
              >
                Three stages, one building: the research, the infrastructure and
                the people shipping on top of it.
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-tbc-yellow/40 bg-tbc-yellow/[0.08] px-4 py-1.5 backdrop-blur-sm">
                  <Text
                    as="span"
                    textType="lgsmall"
                    className="font-bold text-tbc-yellow"
                  >
                    Munich · Thursday, October 29, 2026
                  </Text>
                </span>
                <span className="rounded-full border border-line px-4 py-1.5 backdrop-blur-sm">
                  <Text as="span" textType="small" className="text-secondary">
                    Day 1 · Nakamoto, Turing and Hopper
                  </Text>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-32">
            {/* Vision */}
            <section className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="The day"
                title="What Is the Conference Day?"
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

            {/* Stages */}
            <section className="flex flex-col gap-10">
              <SectionHeader
                eyebrow="Where"
                title="Three Stages"
                intro="The same three rooms carry the Digital Assets Day the next morning under its own names, so wherever you sit on Thursday you already know your way around on Friday."
              />
              <div className="grid gap-5 md:grid-cols-3">
                {STAGES.map((stage) => (
                  <div
                    key={stage.name}
                    className="card-tbc-soft flex flex-col gap-3 p-6"
                  >
                    <Text as="p" textType="sub_title" className="font-bold">
                      {stage.name}
                    </Text>
                    <Text
                      as="p"
                      textType="small"
                      className="font-bold uppercase tracking-widest text-muted"
                    >
                      {stage.subtitle}
                    </Text>
                    <Text
                      as="p"
                      textType="small"
                      className="text-secondary leading-relaxed"
                    >
                      {stage.blurb}
                    </Text>
                  </div>
                ))}
              </div>
            </section>

            {/* Agenda */}
            <section className="flex flex-col gap-10">
              <SectionHeader eyebrow="Programme" title="Agenda" />
              <ConferenceDayAgenda />
              <div>
                <Button buttonType="cta" asChild className="w-fit px-6">
                  <Link href="/agenda">See the full agenda</Link>
                </Button>
              </div>
            </section>

            {/* Tickets */}
            <section className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Join us"
                title="Tickets"
                intro="One conference ticket covers all three days, October 29 to 31 in Munich."
              />
              <div className="card-tbc-soft flex flex-col gap-4 p-7">
                <LumaTicketButton
                  id="luma-ticket-btn-conference-day"
                  className="w-fit px-8 py-4 text-base font-bold"
                >
                  Get Tickets
                </LumaTicketButton>
                <Text
                  as="p"
                  textType="small"
                  className="text-secondary max-w-xl"
                >
                  Day 1 is this conference day, Day 2 the Digital Assets Day by
                  Bundesblock, and the Blockchain &amp; AI Hackathon runs from
                  Day 2 into Day 3.
                </Text>
              </div>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
