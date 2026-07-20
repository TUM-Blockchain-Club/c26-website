import { buildPartnerUtmLink } from "@/util/utmLink";
import { tbcAccounts, bundesblockAccounts } from "@/constants/socialAccounts";

export type Length = "short" | "medium" | "long";

export type PlatformCopy = {
  platform: "X" | "Instagram" | "LinkedIn";
  variants: Record<Length, string>;
};

export type PartnerCheckpoint = {
  id: string;
  date: string; // ISO date — used only for the progress rail position
  periodLabel: string; // shown to partners instead of a fixed date
  label: string;
  channel: "Social Media";
  task: string;
  posts: PlatformCopy[];
  showVideo?: boolean;
  suggestCardGenerator?: boolean;
};

export const partnerGuidelineIntro =
  "Here is what we would suggest: two quick posts. The first announces Early Bird tickets, the second announces your partnership one to two months before the conference. Everything is prepared below, with a teaser video for the first and a card generator for the second, so it only takes a few minutes. But this is just a suggestion. You know your audience best, so feel free to implement the posts however fits your brand and channels.";

// Campaign window used only to position the progress rail.
export const PARTNER_TIMELINE_START = "2026-06-01";
export const PARTNER_TIMELINE_END = "2026-10-29";

const LINK = buildPartnerUtmLink();
const X = tbcAccounts.x.handle;
const IG = tbcAccounts.instagram.handle;
const BB_X = bundesblockAccounts.x.handle;

export const partnerCheckpoints: PartnerCheckpoint[] = [
  {
    id: "early-bird",
    date: "2026-07-17",
    periodLabel:
      "As soon as possible, while Early Bird is live (until 31 July)",
    label: "Post 1 · Early Bird Announcement",
    channel: "Social Media",
    task: "Our suggestion for your first post: share the teaser video below with one of these captions to push Early Bird sign ups while there is still time. Or put it in your own words, whatever feels right for your audience.",
    showVideo: true,
    posts: [
      {
        platform: "X",
        variants: {
          short: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are live! Oct 29 to 31 in Munich. Grab yours before July 31 → ${LINK} #TUMBlockchainConference26`,
          medium: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are live!\n\nOct 29 to 31 in Munich: talks, a Digital Assets Day by ${BB_X} and a 30h Hackathon. Grab yours before July 31 → ${LINK}\n\nHosted by ${X}. #TUMBlockchainConference26`,
          long: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are live!\n\nOct 29 to 31 in Munich, Germany's leading university blockchain conference, an initiative at TUM. Three days of talks, a Digital Assets Day by ${BB_X} and a 30h Hackathon.\n\nGrab yours before Early Bird ends July 31 → ${LINK}\n\nHosted by ${X}. #TUMBlockchainConference26`,
        },
      },
      {
        platform: "Instagram",
        variants: {
          short: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are live! Oct 29 to 31 in Munich. Get yours before July 31, link in bio. Hosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
          medium: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are officially live!\n\nJoin us Oct 29 to 31 in Munich for talks, workshops and a 30h Hackathon. Get yours before July 31 (link in bio: ${LINK}) 🚀\n\nHosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
          long: `🎉 Early Bird tickets for the TUM Blockchain Conference 26 are officially live!\n\nJoin us Oct 29 to 31 in Munich for Germany's leading university blockchain conference, an initiative at TUM. Three days of talks, workshops, a Digital Assets Day by Bundesblock and a 30h Hackathon. Get yours before Early Bird ends July 31 (link in bio: ${LINK}) 🚀\n\nHosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
        },
      },
      {
        platform: "LinkedIn",
        variants: {
          short: `Early Bird tickets for the TUM Blockchain Conference 26 are now open until July 31. Oct 29 to 31 in Munich, hosted by TUM Blockchain Club. Grab yours: ${LINK}\n\n#TUMBlockchainConference26`,
          medium: `Early Bird tickets for the TUM Blockchain Conference 26 are now open, running until July 31.\n\nTaking place October 29 to 31 in Munich, it is Germany's leading university blockchain conference, an initiative at TUM: talks, workshops and a 30 hour Hackathon.\n\nAs a proud Community Partner, we are excited to support this year's edition, hosted by TUM Blockchain Club. Secure your ticket: ${LINK}\n\n#TUMBlockchainConference26`,
          long: `Early Bird tickets for the TUM Blockchain Conference 26 are now open, running until July 31.\n\nTaking place October 29 to 31 in Munich, it is Germany's leading university blockchain conference, an initiative at TUM, the Technical University of Munich: three days of talks, panels, workshops, a Digital Assets Day by Bundesblock and a 30 hour Hackathon. From people simply curious about the space to the industry leaders shaping it, everyone comes together here and everyone is welcome.\n\nAs a proud Community Partner, we are excited to support this year's edition, hosted by TUM Blockchain Club. Secure your ticket before the deadline: ${LINK}\n\n#TUMBlockchainConference26`,
        },
      },
    ],
  },
  {
    id: "partner-announcement",
    date: "2026-09-29",
    periodLabel: "One to two months before the conference",
    label: "Post 2 · Community Partner Announcement",
    channel: "Social Media",
    task: "Our suggestion for your second post: announce that you are a Community Partner and pair it with a card from the generator further down. As always, adapt it however you like.",
    suggestCardGenerator: true,
    posts: [
      {
        platform: "X",
        variants: {
          short: `📣 We're proud to be a Community Partner of the TUM Blockchain Conference 26! Oct 29 to 31 in Munich, hosted by ${X}. See you there → ${LINK} #TUMBlockchainConference26`,
          medium: `📣 We're proud to be a Community Partner of the TUM Blockchain Conference 26!\n\nOct 29 to 31 in Munich: talks, a Digital Assets Day by ${BB_X} and a 30h Hackathon. Hosted by ${X}.\n\nSee you there → ${LINK} #TUMBlockchainConference26`,
          long: `📣 We're proud to be a Community Partner of the TUM Blockchain Conference 26!\n\nJoin us Oct 29 to 31 in Munich, Germany's leading university blockchain conference, an initiative at TUM: talks, a Digital Assets Day by ${BB_X} and a 30h Hackathon. Hosted by ${X}.\n\nSee you there → ${LINK} #TUMBlockchainConference26`,
        },
      },
      {
        platform: "Instagram",
        variants: {
          short: `📣 We're a proud Community Partner of the TUM Blockchain Conference 26! Oct 29 to 31 in Munich, link in bio. Hosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
          medium: `📣 We're a proud Community Partner of the TUM Blockchain Conference 26!\n\nJoin us Oct 29 to 31 in Munich for talks, workshops and a 30h Hackathon (link in bio: ${LINK}) 🎉\n\nHosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
          long: `📣 We're a proud Community Partner of the TUM Blockchain Conference 26!\n\nJoin us Oct 29 to 31 in Munich for Germany's leading university blockchain conference, an initiative at TUM. Three days of talks, workshops, a Digital Assets Day by Bundesblock and a 30h Hackathon (link in bio: ${LINK}) 🎉\n\nHosted by ${IG}. #TUMBlockchainConference26 #Web3 #Munich`,
        },
      },
      {
        platform: "LinkedIn",
        variants: {
          short: `We are proud to be a Community Partner of the TUM Blockchain Conference 26. Oct 29 to 31 in Munich, hosted by TUM Blockchain Club. Join us: ${LINK}\n\n#TUMBlockchainConference26`,
          medium: `We are proud to announce that we are a Community Partner of the TUM Blockchain Conference 26.\n\nTaking place October 29 to 31 in Munich, it is Germany's leading university blockchain conference, an initiative at TUM: talks, workshops and a 30 hour Hackathon, hosted by TUM Blockchain Club.\n\nJoin us: ${LINK}\n\n#TUMBlockchainConference26`,
          long: `We are proud to announce that we are a Community Partner of the TUM Blockchain Conference 26.\n\nTaking place October 29 to 31 in Munich, it is Germany's leading university blockchain conference, an initiative at TUM, the Technical University of Munich: three days of talks, panels, workshops, a Digital Assets Day by Bundesblock and a 30 hour Hackathon, hosted by TUM Blockchain Club. From people simply curious about the space to the industry leaders shaping it, everyone comes together here and everyone is welcome.\n\nWe are excited to support this year's edition. Join us: ${LINK}\n\n#TUMBlockchainConference26`,
        },
      },
    ],
  },
];

// The newsletter mention (a full, ready to send blurb).
export const partnerNewsletter = {
  subject: "Join us at the TUM Blockchain Conference 26 in Munich",
  body: `We are proud to be a Community Partner of the TUM Blockchain Conference 26, and we wanted to share it with you directly.

Taking place October 29 to 31 at the House of Communication in Munich, it is Germany's leading university blockchain conference, an initiative at TUM, the Technical University of Munich, one of the leading universities in Europe. Over three days you can expect talks, panels, workshops and a 30 hour Hackathon, where curious newcomers, students, builders, researchers, founders, policymakers and industry leaders all come together.

Whether you are simply interested in the space or leading a team in the industry, everyone is welcome. You do not need to be a student or an expert to take part.

Here is what the three days look like:

Day 1, First Conference Day: the talks, panels and people shaping Web3, across many tracks.

Day 2, Digital Assets Day by Bundesblock: where traditional finance meets the onchain economy.

Day 2 and 3, the Hackathon: 30 hours to build, ship and compete across many partner tracks.

Last year's edition brought together more than 1,200 attendees, 125 speakers and 18 sponsors, with a stage that included Paul Brody (EY), Justin Drake (Ethereum Foundation), Friederike Ernst (Gnosis) and Patrick Hansen (Circle).

Not based in Munich? Travel support is in the works, so keep an eye out.

Early Bird tickets are the best value while they last. You can see the full programme and grab your ticket here: ${LINK}

We hope to see you there.`,
};

// Community group shares (optional, very welcome).
export type CommunityPost = {
  channel: string;
  hint: string;
  text: string;
};

export const communityPosts: CommunityPost[] = [
  {
    channel: "Telegram",
    hint: "For crypto and web3 group chats.",
    text: `gm 👋 The TUM Blockchain Conference 26 is coming to Munich, Oct 29 to 31.\n\nGermany's blockchain flagship at TUM: talks, a Digital Assets Day by Bundesblock and a 30h Hackathon. 1,200+ attendees last year.\n\nWe're a proud Community Partner. Grab your ticket 👉 ${LINK}`,
  },
  {
    channel: "WhatsApp",
    hint: "For friendlier, general group chats.",
    text: `Hi everyone! We are proud to be a Community Partner of the TUM Blockchain Conference 26, taking place October 29 to 31 in Munich.\n\nThree days of talks, workshops and a 30 hour Hackathon, hosted by TUM Blockchain Club. If you are into blockchain, it is well worth it.\n\nTickets and full programme here: ${LINK}`,
  },
  {
    channel: "Quick one liner",
    hint: "For bios, story text or a fast share.",
    text: `Proud Community Partner of the TUM Blockchain Conference 26 · Munich · Oct 29 to 31 · ${LINK}`,
  },
];
