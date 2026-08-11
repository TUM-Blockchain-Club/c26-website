import { buildSpeakerUtmLink } from "@/util/utmLink";
import { tbcAccounts, bundesblockAccounts } from "@/constants/socialAccounts";
import type { SpeakerDay } from "@/util/partnerCardVideo";

export type SpeakerCaptionInput = {
  job?: string;
  blurb?: string;
  day: SpeakerDay;
};

export type SpeakerCaptions = {
  platform: "X" | "Instagram" | "LinkedIn";
  text: string;
}[];

const LINK = buildSpeakerUtmLink();
const X = tbcAccounts.x.handle; // @tbc_munich
const IG = tbcAccounts.instagram.handle; // @tumblockchain
const TBC_LI = `@${tbcAccounts.linkedin.handle}`; // @TUM Blockchain Club
const BB_X = bundesblockAccounts.x.handle; // @bundesblock
// The Digital Assets Day's own LinkedIn page name (provided by the team).
const DAD_LI = "@DIGITAL ASSETS DAY by Bundesblock";

/**
 * Builds ready-to-post captions personalised to what the speaker entered
 * (their role, talk and day), with the right accounts tagged per platform.
 * Day 2 also tags the Digital Assets Day / Bundesblock where an account exists.
 */
export function buildSpeakerCaptions({
  job,
  blurb,
  day,
}: SpeakerCaptionInput): SpeakerCaptions {
  const role = job?.trim();
  const talk = blurb?.trim();
  const rolePrefix = role ? `As ${role}, ` : "";
  const talkLine = talk ? `\n\nMy talk: ${talk}` : "";

  const dayX =
    day === "day2"
      ? `the Digital Assets Day by ${BB_X} on October 30`
      : "the First Conference Day on October 29";
  const dayIG =
    day === "day2"
      ? "the Digital Assets Day on October 30"
      : "the First Conference Day on October 29";
  const dayLI =
    day === "day2"
      ? `the ${DAD_LI} on October 30`
      : "the First Conference Day on October 29";

  const x = `🎤 ${rolePrefix}I'm speaking at the TUM Blockchain Conference 26 — ${dayX}!${talkLine}\n\nThe full conference runs Oct 29 to 31 in Munich. Hosted by ${X} → ${LINK}\n\n#TUMBlockchainConference26`;

  const instagram = `🎤 ${rolePrefix}I'm speaking at the TUM Blockchain Conference 26 — ${dayIG}!${talkLine}\n\nThe full conference runs October 29 to 31 in Munich (link in bio: ${LINK}). Hosted by ${IG} 🚀\n\n#TUMBlockchainConference26 #Web3 #Munich`;

  const linkedin = `I'm honoured to speak at the TUM Blockchain Conference 26.\n\n${rolePrefix}I will be part of ${dayLI}.${talkLine}\n\nThe full conference runs October 29 to 31 in Munich, hosted by ${TBC_LI}. See the programme: ${LINK}\n\n#TUMBlockchainConference26`;

  return [
    { platform: "X", text: x },
    { platform: "Instagram", text: instagram },
    { platform: "LinkedIn", text: linkedin },
  ];
}
