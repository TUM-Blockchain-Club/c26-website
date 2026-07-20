import { buildMediaUtmLink } from "@/util/utmLink";

export const MEDIA_LINK = buildMediaUtmLink();

export const HEADER_GRAPHIC_SRC = "/media/tbc-conference-26-header.png";

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

/** Early Bird runs through 31 July 2026; afterwards every mention disappears. */
export const isEarlyBirdLive = (now: number = Date.now()) =>
  now <= new Date("2026-07-31").getTime();

export const mediaIntro =
  "This page is for our media partners. We are so happy to have you with us, and we would love it if you covered the TUM Blockchain Conference 26 in any form you like: an article, a video, a social post, a podcast episode or a mention in your newsletter. Below you will find the aftermovie and the story of last year's edition, everything about this year, and a ready to use newsletter draft. Thank you for helping us spread the word!";

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

export const thisYearParagraphs = (earlyBird: boolean) => {
  const paragraphs = [
    "The TUM Blockchain Conference 26 takes place October 29 to 31, 2026 at the House of Communication in Munich, hosted by TUM Blockchain Club. Born at TUM, the Technical University of Munich and one of Europe's leading universities, it is built for the entire blockchain ecosystem. Three days where curious newcomers, students, builders, researchers, founders, policymakers and industry leaders all come together, and everyone is welcome: you do not need to be a student or an expert to attend.",
    "Day 1 is the First Conference Day: the talks, panels and people shaping Web3, across many tracks. Day 2 is the Digital Assets Day, curated for the first time by Bundesblock, bringing together policymakers, regulators, financial institutions, corporates and digital asset leaders to discuss the future of digital assets in Europe. On Day 2 and 3, the 30 hour Hackathon runs alongside the conference, open to builders of all levels.",
  ];
  if (earlyBird) {
    paragraphs.push(
      "Early Bird tickets are available until July 31, so it is a great moment to point your audience to the conference.",
    );
  }
  return paragraphs;
};

export const mediaNewsletter = (earlyBird: boolean) => ({
  subject: "The TUM Blockchain Conference returns to Munich this October",
  body: `The TUM Blockchain Conference 26 takes place October 29 to 31 at the House of Communication in Munich. Born at TUM, the Technical University of Munich and one of Europe's leading universities, it is built for the entire blockchain ecosystem. Hosted by TUM Blockchain Club, it is a place where people simply interested in the space and the industry leaders shaping it come together, and everyone is welcome.

Here is what the three days look like:

Day 1, First Conference Day: the talks, panels and people shaping Web3, across many tracks.

Day 2, Digital Assets Day by Bundesblock: where traditional finance meets the onchain economy.

Day 2 and 3, the Hackathon: 30 hours to build, ship and compete across many partner tracks.

Last year's edition brought together more than 1,200 attendees, 125 speakers and 18 sponsors, with a stage that included Paul Brody (EY), Justin Drake (Ethereum Foundation), Friederike Ernst (Gnosis) and Patrick Hansen (Circle).
${earlyBird ? "\nEarly Bird tickets are the best value and run until July 31. " : "\n"}Tickets and the full programme: ${MEDIA_LINK}

We hope to see you there.`,
});
