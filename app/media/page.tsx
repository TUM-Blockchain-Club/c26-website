import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/container";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { PartnerNewsletter } from "@/components/brand/PartnerNewsletter";
import { TimelineRail } from "@/components/brand/TimelineRail";
import { MediaGallery } from "@/components/brand/MediaGallery";
import { LogoDownloads } from "@/components/brand/LogoShowcase";
import { PressRelease } from "@/components/brand/PressRelease";
import { MediaPosts } from "@/components/brand/MediaPosts";
import { CopyButton } from "@/components/brand/CopyButton";
import WhatsNew from "@/sections/WhatsNew";
import { aspectRatioLabel } from "@/util/aspectRatio";
import {
  mediaIntro,
  visualAssets,
  lastYearParagraphs,
  lastYearStats,
  thisYearParagraphs,
  mediaNewsletter,
  MEDIA_LINK,
  AFTERMOVIE_EMBED_URL,
  AFTERMOVIE_WATCH_URL,
  CONFERENCE_VIDEO_SRC,
  FLYER_PDF_SRC,
  FLYER_PREVIEW_SRC,
} from "@/constants/mediaPortal";

export const metadata: Metadata = {
  title: "Media Portal · TUM Blockchain Conference 26",
  robots: { index: false, follow: false },
};

// Re-render server side at least hourly so date driven content (the progress
// timeline) stays current without a redeploy.
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
  const visuals = visualAssets.map((visual) => ({
    ...visual,
    ratio: aspectRatioLabel(visual.image.width, visual.image.height),
  }));

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

              <WhatsNew />

              <div className="flex flex-col gap-4">
                {thisYearParagraphs().map((paragraph, i) => (
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

              <TimelineRail />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Ready to publish"
                title="Press Release"
                intro="The official announcement of the 2026 edition, written to be published as it is: dates, venue, the three days, announced speakers and sponsors, and a press contact. Shorten it, quote from it or run it in full."
              />
              <PressRelease />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Ready to post"
                title="Social Media"
                intro="Post templates for X, Instagram and LinkedIn in three lengths, each linking with your media address so we can see what your coverage brings in. Pair them with a banner from below. Adapt them however fits your channels."
              />
              <MediaPosts />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Ready to send"
                title="Newsletter"
                intro="If you run a newsletter, here is a draft you can drop straight in. It is written in a neutral voice on purpose, so you can shorten it, rewrite it or just take the facts, whatever fits your format."
              />
              <PartnerNewsletter newsletter={mediaNewsletter()} />
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Flyer"
                intro="A one-page overview of the conference: dates, programme and last year's numbers. Ready to share, attach or post."
              />
              <div className="card-tbc flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:gap-10">
                <div className="w-full flex-1 lg:max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={FLYER_PREVIEW_SRC}
                    alt="TUM Blockchain Conference 26 flyer"
                    className="w-full rounded-md border border-line"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text as="p" textType="lgsmall" className="font-bold">
                    Conference 26 flyer
                  </Text>
                  <Text as="p" textType="small" className="text-muted max-w-md">
                    Two pages, ready to share. Free to use in your coverage,
                    attach to an article or post as is.
                  </Text>
                  <div className="mt-3">
                    <Button buttonType="primary" asChild className="w-fit px-5">
                      <a
                        href={FLYER_PDF_SRC}
                        download="tbc-conference-26-flyer.pdf"
                      >
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Visuals & Ad Banners"
                intro="Our key visuals for your article, post, newsletter or ad placement, in the formats you are most likely to need. Every file is free to use as it is; the size is listed so you can pick the right one, and each comes with a caption you can post it with."
              />
              {/* items-start so a tall portrait visual does not stretch the
                  card beside it into a block of empty space. */}
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                {visuals.map((visual) => (
                  <div
                    key={visual.href}
                    className="card-tbc flex flex-col gap-5 p-7"
                  >
                    {/* Preview goes through the optimizer — the originals
                        are up to 4MB, and the download link below still
                        points at the untouched file. */}
                    <Image
                      src={visual.image}
                      alt={`TUM Blockchain Conference 26 — ${visual.title}`}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-auto w-full rounded-md"
                    />
                    <div className="flex flex-col gap-1.5">
                      <Text textType="lgsmall" className="font-bold">
                        {visual.title}
                      </Text>
                      <Text as="p" textType="small" className="text-muted">
                        {visual.image.width} × {visual.image.height} px
                        {visual.ratio ? ` · ${visual.ratio}` : ""} · PNG
                      </Text>
                      <Text as="p" textType="small" className="text-faint">
                        {visual.note}
                      </Text>
                    </div>
                    <div className="flex flex-col gap-2 rounded-md border border-line-subtle bg-white/[0.03] p-4">
                      <Text
                        as="p"
                        textType="small"
                        className="text-faint uppercase tracking-widest"
                      >
                        Caption
                      </Text>
                      <Text
                        as="p"
                        textType="small"
                        className="text-secondary break-words"
                      >
                        {visual.caption}
                      </Text>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <Button
                        buttonType="primary"
                        asChild
                        className="w-fit px-5"
                      >
                        <a href={visual.href} download={visual.fileName}>
                          Download PNG
                        </a>
                      </Button>
                      <CopyButton value={visual.caption} label="Copy caption" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-12">
              <SectionHeader
                eyebrow="Assets"
                title="Conference Video"
                intro="Our 2026 conference video, ready to embed, link or use in your coverage."
              />
              <div className="card-tbc flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:gap-10">
                <div className="w-full flex-1 overflow-hidden rounded-md bg-black lg:max-w-md">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full"
                    src={CONFERENCE_VIDEO_SRC}
                  >
                    Your browser doesn&apos;t support embedded video.{" "}
                    <a
                      href={CONFERENCE_VIDEO_SRC}
                      download
                      className="underline"
                    >
                      Download it directly
                    </a>
                    .
                  </video>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <Text as="p" textType="lgsmall" className="font-bold">
                    Conference 26 video
                  </Text>
                  <Text as="p" textType="small" className="text-muted max-w-md">
                    Free to use in your reporting, posts or newsletter.
                  </Text>
                  <div className="mt-3">
                    <Button buttonType="primary" asChild className="w-fit px-5">
                      <a
                        href={CONFERENCE_VIDEO_SRC}
                        download="tbc-conference-26-video.mp4"
                      >
                        Download video
                      </a>
                    </Button>
                  </div>
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
