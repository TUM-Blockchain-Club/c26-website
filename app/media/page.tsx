import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { PartnerNewsletter } from "@/components/brand/PartnerNewsletter";
import { TimelineRail } from "@/components/brand/TimelineRail";
import { MediaGallery } from "@/components/brand/MediaGallery";
import { LogoDownloads } from "@/components/brand/LogoShowcase";
import {
  mediaIntro,
  lastYearParagraphs,
  lastYearStats,
  thisYearParagraphs,
  mediaNewsletter,
  isEarlyBirdLive,
  MEDIA_LINK,
  AFTERMOVIE_EMBED_URL,
  AFTERMOVIE_WATCH_URL,
  HEADER_GRAPHIC_SRC,
} from "@/constants/mediaPortal";

export const metadata: Metadata = {
  title: "Media Portal · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

// Re-render server side at least hourly so date driven content (the timeline
// and every Early Bird mention) stays current without a redeploy.
export const revalidate = 3600;

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

export default function MediaPage() {
  const earlyBird = isEarlyBirdLive();

  return (
    <div className="flex justify-center">
      <main className="w-full max-w-7xl pt-page-pt lg:pt-0 z-20 pb-40">
        <Container>
          <div className="mt-page-top md:mt-page-top-lg z-10 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Text as="p" textType="small" className="eyebrow-tbc">
                Media portal
              </Text>
              <Text textType="hero" className="text-gradient">
                Tell Our Story
              </Text>
            </div>
            <Text
              as="p"
              textType="paragraph"
              className="text-secondary max-w-2xl leading-relaxed"
            >
              {mediaIntro}
            </Text>
          </div>

          <div className="mt-24 flex flex-col gap-40">
            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Looking back"
                title="TUM Blockchain Conference 25"
                intro="Here is what last year looked like, in moving pictures and in numbers. Everything is free to use in your coverage."
              />

              <div className="card-tbc flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:gap-10">
                <div className="w-full flex-1 lg:max-w-xl">
                  <div
                    className="relative w-full overflow-hidden rounded-md bg-black"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <iframe
                      src={AFTERMOVIE_EMBED_URL}
                      title="TUM Blockchain Conference 25 Aftermovie"
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text as="p" textType="lgsmall" className="font-bold">
                    Aftermovie
                  </Text>
                  <Text as="p" textType="small" className="text-muted max-w-md">
                    TUM Blockchain Conference 25 in under three minutes. Feel
                    free to embed it, link it or use it in your reporting.
                  </Text>
                  <div className="mt-3">
                    <Button buttonType="primary" asChild className="w-fit px-5">
                      <a
                        href={AFTERMOVIE_WATCH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {lastYearParagraphs.map((paragraph, i) => (
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

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {lastYearStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="card-tbc-soft flex min-w-0 flex-col items-center gap-1 px-2 py-6"
                  >
                    <Text
                      textType="title"
                      className="!font-display !text-3xl font-bold"
                    >
                      {stat.value}
                    </Text>
                    <Text
                      textType="small"
                      className="max-w-full break-words text-center uppercase tracking-wide text-muted"
                    >
                      {stat.label}
                    </Text>
                  </div>
                ))}
              </div>

              <MediaGallery />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="This year"
                title="Conference 26"
                intro="And now we are making it even bigger. Here is everything about this year's edition, and how far along the road we already are."
              />

              <div className="flex flex-col gap-4">
                {thisYearParagraphs(earlyBird).map((paragraph, i) => (
                  <Text
                    key={i}
                    as="p"
                    textType="paragraph"
                    className="text-secondary max-w-3xl leading-relaxed"
                  >
                    {paragraph}
                  </Text>
                ))}
                <Text
                  as="p"
                  textType="paragraph"
                  className="text-secondary max-w-3xl leading-relaxed"
                >
                  When you link the conference, this address lets us see how
                  many people your coverage brings in:{" "}
                  <a
                    href={MEDIA_LINK}
                    className="break-all font-bold text-white underline underline-offset-4"
                  >
                    {MEDIA_LINK}
                  </a>
                </Text>
              </div>

              <TimelineRail hideEarlyBirdWhenOver />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Ready to send"
                title="Newsletter"
                intro="If you run a newsletter, here is a draft you can drop straight in. It is written in a neutral voice on purpose, so you can shorten it, rewrite it or just take the facts, whatever fits your format."
              />
              <PartnerNewsletter newsletter={mediaNewsletter(earlyBird)} />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Header Graphic"
                intro="If you need a visual for your article, post or newsletter, here is our official header graphic, ready to download."
              />
              <div className="card-tbc flex flex-col gap-6 p-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HEADER_GRAPHIC_SRC}
                  alt="TUM Blockchain Conference 26 header graphic"
                  className="w-full rounded-md"
                />
                <div>
                  <Button buttonType="primary" asChild className="w-fit px-5">
                    <a
                      href={HEADER_GRAPHIC_SRC}
                      download="tbc-conference-26-header.png"
                    >
                      Download PNG
                    </a>
                  </Button>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Our Logos"
                intro="Download our logos for your articles, posts and videos. SVG and PNG, or grab everything as a zip."
              />
              <LogoDownloads />
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
