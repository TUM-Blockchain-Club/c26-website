import type { StaticImageData } from "next/image";
import { buildMediaUtmLink } from "@/util/utmLink";
import type { PlatformCopy } from "@/constants/partnerTimeline";
import { tbcAccounts, bundesblockAccounts } from "@/constants/socialAccounts";
import prBanner from "@/public/banners/c26-pr-banner-1920x1080.png";
import eventBanner from "@/public/banners/c26-event-banner-1920x1080.png";
import socialPost from "@/public/banners/c26-social-1080x1350.png";
import headerGraphic from "@/public/media/tbc-conference-26-header.png";

export const MEDIA_LINK = buildMediaUtmLink();

export const HEADER_GRAPHIC_SRC = "/media/tbc-conference-26-header.png";

/**
 * Ready-to-use key visuals, free for anyone to download. Each one is imported
 * statically, so Next records its pixel size at build time — the size printed
 * next to a download comes from the file itself and cannot go stale. (This
 * used to be measured with sharp from `public/` at render time, which does
 * not work once the page re-renders on the server, where `public/` is not on
 * disk.) `href` is the plain public path, so the download keeps a readable
 * file name and the untouched original bytes.
 */
export const visualAssets: {
  image: StaticImageData;
  href: string;
  fileName: string;
  title: string;
  note: string;
  /** A ready caption for posting the visual as it is. */
  caption: string;
}[] = [
  {
    image: prBanner,
    href: "/banners/c26-pr-banner-1920x1080.png",
    fileName: "c26-pr-banner-1920x1080.png",
    title: "PR banner",
    note: "Lockup centred, for articles, press coverage and slides.",
    caption: `The TUM Blockchain Conference 26 returns to Munich: October 29 to 31 at the House of Communication. Three days for the entire blockchain ecosystem, from a first conference day to the Digital Assets Day by Bundesblock and a 32 hour Hackathon. Tickets and programme: ${MEDIA_LINK}`,
  },
  {
    image: eventBanner,
    href: "/banners/c26-event-banner-1920x1080.png",
    fileName: "c26-event-banner-1920x1080.png",
    title: "Event banner",
    note: "Lockup to the left, for event pages and cover images.",
    caption: `Save the date: TUM Blockchain Conference 26, October 29 to 31, House of Communication, Munich. Born at TUM and built for the entire blockchain ecosystem: talks, panels, the Digital Assets Day by Bundesblock and a 32 hour Hackathon. ${MEDIA_LINK}`,
  },
  {
    image: socialPost,
    href: "/banners/c26-social-1080x1350.png",
    fileName: "c26-social-1080x1350.png",
    title: "Social post",
    note: "The format Instagram and LinkedIn show largest in the feed.",
    caption: `Munich, October 29 to 31: the TUM Blockchain Conference 26 🚀 Three days of talks and panels, the Digital Assets Day by Bundesblock and a 32 hour Hackathon, open to everyone from the curious to the industry leaders shaping the space. Tickets via the link in the bio of @tumblockchain. #TUMBlockchainConference26 #Web3 #Munich`,
  },
  {
    image: headerGraphic,
    href: HEADER_GRAPHIC_SRC,
    fileName: "tbc-conference-26-header.png",
    title: "Header graphic",
    note: "The wide banner, for the top of an article or a newsletter.",
    caption: `TUM Blockchain Conference 26 · October 29 to 31, 2026 · House of Communication, Munich · ${MEDIA_LINK}`,
  },
];

/** The 2026 conference video, shared with the partner portal. */
export const CONFERENCE_VIDEO_SRC = "/partner/conference-teaser.mp4";

/** The one-page flyer (PDF) and its page-1 preview image, shared with the
 * partner portal — free for anyone to download and share. */
export const FLYER_PDF_SRC = "/media/tbc-conference-26-flyer.pdf";
export const FLYER_PREVIEW_SRC = "/media/tbc-conference-26-flyer-preview.jpg";

/**
 * Press photos from conference 25. The web versions are lightweight for the
 * gallery grid; the full versions are the original high resolution files.
 */
export const galleryImages = Array.from({ length: 11 }, (_, i) => {
  const id = `tbc-conference-25-${String(i + 1).padStart(2, "0")}`;
  return {
    id,
    web: `/media/gallery/web/${id}.jpg`,
    full: `/media/gallery/full/${id}.jpg`,
  };
});

export const AFTERMOVIE_EMBED_URL =
  "https://www.youtube-nocookie.com/embed/jcm7LlyuKss";
export const AFTERMOVIE_WATCH_URL =
  "https://www.youtube.com/watch?v=jcm7LlyuKss";

export const mediaIntro =
  "This page is for our media partners. We are so happy to have you with us, and we would love it if you covered the TUM Blockchain Conference 26 in any form you like: an article, a video, a social post, a podcast episode or a mention in your newsletter. Below you will find the aftermovie and the story of last year's edition, everything about this year, a press release, social media posts, banners with captions and a ready to use newsletter draft. Thank you for helping us spread the word!";

export const lastYearStats = [
  { value: "1,200+", label: "Attendees" },
  { value: "125+", label: "Speakers" },
  { value: "18", label: "Sponsors" },
  { value: "57", label: "Talks" },
  { value: "12", label: "Panels" },
  { value: "4", label: "Workshops" },
];

export const lastYearParagraphs = [
  "The TUM Blockchain Conference 25 brought together more than 1,200 attendees in Munich. Born at TUM, one of Europe's leading universities, and built for the entire blockchain ecosystem, it drew curious newcomers, students, builders, researchers, founders, policymakers and industry leaders for 57 talks, 12 panels and 4 workshops covering the whole spectrum of Web3, from infrastructure and applications to regulation and research, alongside an Ideathon and a Researchathon.",
  "On stage were more than 125 speakers, including Paul Brody (EY), Justin Drake (Ethereum Foundation), Friederike Ernst (Gnosis) and Patrick Hansen (Circle), supported by 18 sponsors from across the ecosystem. The aftermovie above captures the atmosphere better than any summary could, and you are welcome to use it in your coverage.",
];

export const thisYearParagraphs = () => [
  "The TUM Blockchain Conference 26 takes place October 29 to 31, 2026 at the House of Communication in Munich, hosted by TUM Blockchain Club. Born at TUM, the Technical University of Munich and one of Europe's leading universities, it is built for the entire blockchain ecosystem. Three days where curious newcomers, students, builders, researchers, founders, policymakers and industry leaders all come together, and everyone is welcome: you do not need to be a student or an expert to attend.",
  "Day 1 is the First Conference Day: the talks, panels and people shaping Web3, across many tracks. Day 2 is the Digital Assets Day, curated for the first time by Bundesblock, bringing together policymakers, regulators, financial institutions, corporates and digital asset leaders to discuss the future of digital assets in Europe. On Day 2 and 3, the 32 hour Hackathon runs alongside the conference, open to builders of all levels.",
];

export const mediaNewsletter = () => ({
  subject: "The TUM Blockchain Conference returns to Munich this October",
  body: `The TUM Blockchain Conference 26 takes place October 29 to 31 at the House of Communication in Munich. Born at TUM, the Technical University of Munich and one of Europe's leading universities, it is built for the entire blockchain ecosystem. Hosted by TUM Blockchain Club, it is a place where people simply interested in the space and the industry leaders shaping it come together, and everyone is welcome.

Here is what the three days look like:

Day 1, First Conference Day: the talks, panels and people shaping Web3, across many tracks.

Day 2, Digital Assets Day by Bundesblock: where traditional finance meets the onchain economy.

Day 2 and 3, the Hackathon: 32 hours to build, ship and compete across many partner tracks.

Last year's edition brought together more than 1,200 attendees, 125 speakers and 18 sponsors, with a stage that included Paul Brody (EY), Justin Drake (Ethereum Foundation), Friederike Ernst (Gnosis) and Patrick Hansen (Circle).

Tickets and the full programme: ${MEDIA_LINK}

We hope to see you there.`,
});

/**
 * A ready-to-publish press release, written in a neutral voice so a media
 * partner can run it as is, shorten it or take single facts from it. Only
 * facts that are also on the website: dates, venue, structure, last year's
 * numbers and announced speakers.
 */
export const pressRelease = () => ({
  headline:
    "TUM Blockchain Conference 26 brings the blockchain ecosystem to Munich from October 29 to 31",
  subheadline:
    "Three days at the House of Communication: a conference day, the Digital Assets Day curated by Bundesblock, and a 32 hour Blockchain & AI Hackathon",
  dateline: "Munich, September 2026",
  paragraphs: [
    "The TUM Blockchain Conference returns for its 2026 edition from October 29 to 31 at the House of Communication in Munich. Born at TUM, the Technical University of Munich, and organised by the student-run TUM Blockchain Club, the conference is built for the entire blockchain ecosystem: curious newcomers, students, builders, researchers, founders, policymakers and industry leaders. Last year's edition brought together more than 1,200 attendees, 125 speakers and 18 sponsors.",
    "The programme is split across three days. October 29 is the First Conference Day, with talks and panels across many tracks, from research and infrastructure to applications and regulation. October 30 is the Digital Assets Day, curated for the first time by Bundesblock, the German Blockchain Association: three stages bringing together policymakers, regulators, financial institutions, corporates and digital asset leaders to discuss tokenization, stablecoins, digital capital markets and the future of digital assets in Europe. From October 30 to 31, the 32 hour Blockchain & AI Hackathon runs alongside the conference, open to builders of all levels, with partner tracks and prizes.",
    "Speakers announced so far include Vadim Lyubashevsky (IBM Research Europe), co-creator of the post-quantum signature schemes standardised by NIST; Ondřej Kovařík (European Ethereum Institute), Member of the European Parliament from 2019 to 2025; Christoph Jentzsch (beel), author of TheDAO; and Dr. Nina-Luisa Siedler (siedler legal, Bundesblock). The line-up continues to grow and is published at conference26.tum-blockchain.com.",
    "Tickets are available now, including a dedicated student tier with a valid student ID. Side events run around the conference throughout the week.",
  ],
  linkLabel: "Tickets and programme",
  link: MEDIA_LINK,
});

const X = tbcAccounts.x.handle;
const IG = tbcAccounts.instagram.handle;
const BB_X = bundesblockAccounts.x.handle;
const TBC_LI = `@${tbcAccounts.linkedin.handle}`;
const DAD_LI = "@DIGITAL ASSETS DAY by Bundesblock";

/**
 * Ready-to-post captions for media partners, per platform in three lengths,
 * all linking with the media UTM so coverage is attributable.
 */
export const mediaPosts: PlatformCopy[] = [
  {
    platform: "X",
    variants: {
      short: `TUM Blockchain Conference 26 · Munich · Oct 29 to 31. Talks, the Digital Assets Day by ${BB_X} and a 32h Hackathon. Hosted by ${X} → ${MEDIA_LINK}`,
      medium: `📣 The TUM Blockchain Conference 26 is coming to Munich, Oct 29 to 31!\n\nThree days of talks, a Digital Assets Day by ${BB_X} and a 32h Hackathon, built for the entire blockchain ecosystem. We are on board as media partner.\n\nHosted by ${X} → ${MEDIA_LINK} #TUMBlockchainConference26`,
      long: `📣 The TUM Blockchain Conference 26 is coming to Munich, Oct 29 to 31!\n\nBorn at TUM, one of Europe's leading universities, and built for the entire blockchain ecosystem: talks and panels on Oct 29, the Digital Assets Day by ${BB_X} on Oct 30, and a 32h Blockchain & AI Hackathon on Oct 30 to 31. Last edition: 1,200+ attendees, 125+ speakers.\n\nWe are on board as media partner and will be covering it. Tickets and programme → ${MEDIA_LINK}\n\nHosted by ${X}. #TUMBlockchainConference26`,
    },
  },
  {
    platform: "Instagram",
    variants: {
      short: `TUM Blockchain Conference 26 · Munich · Oct 29 to 31 🚀 Tickets via the link in the bio of ${IG} #TUMBlockchainConference26`,
      medium: `📣 The TUM Blockchain Conference 26 is coming to Munich, Oct 29 to 31!\n\nThree days of talks, panels, the Digital Assets Day by Bundesblock and a 32h Hackathon, for everyone from the curious to the people building it. We are on board as media partner 🎉\n\nTickets via the link in the bio of ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
      long: `📣 The TUM Blockchain Conference 26 is coming to Munich, Oct 29 to 31!\n\nBorn at TUM, one of Europe's leading universities, and built for the entire blockchain ecosystem. Oct 29: talks and panels across many tracks. Oct 30: the Digital Assets Day by Bundesblock, where regulators, banks and corporates meet builders. Oct 30 to 31: a 32h Blockchain & AI Hackathon, open to all levels. Last edition: 1,200+ attendees and 125+ speakers.\n\nWe are on board as media partner and will be covering it 🎉 Tickets via the link in the bio of ${IG}.\n\n#TUMBlockchainConference26 #Web3 #Blockchain #Munich`,
    },
  },
  {
    platform: "LinkedIn",
    variants: {
      short: `The TUM Blockchain Conference 26 takes place October 29 to 31 in Munich: talks, the ${DAD_LI} and a 32 hour Hackathon, hosted by ${TBC_LI}. We are a media partner this year. Programme and tickets: ${MEDIA_LINK}`,
      medium: `We are a media partner of the TUM Blockchain Conference 26, taking place October 29 to 31 at the House of Communication in Munich.\n\nBorn at TUM, one of Europe's leading universities, and built for the entire blockchain ecosystem: talks and panels, the ${DAD_LI} and a 32 hour Hackathon, hosted by ${TBC_LI}.\n\nProgramme and tickets: ${MEDIA_LINK}\n\n#TUMBlockchainConference26`,
      long: `We are a media partner of the TUM Blockchain Conference 26, taking place October 29 to 31 at the House of Communication in Munich, and we will be covering it.\n\nBorn at TUM, the Technical University of Munich and one of Europe's leading universities, the conference is built for the entire blockchain ecosystem. October 29 is the First Conference Day with talks and panels across many tracks. October 30 is the ${DAD_LI}, bringing policymakers, regulators, financial institutions and corporates together with builders. From October 30 to 31, a 32 hour Blockchain & AI Hackathon runs alongside the conference, open to all levels. Last year's edition brought together more than 1,200 attendees and 125 speakers, hosted by ${TBC_LI}.\n\nProgramme and tickets: ${MEDIA_LINK}\n\n#TUMBlockchainConference26`,
    },
  },
];
