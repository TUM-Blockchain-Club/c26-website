import { buildSpeakerUtmLink } from "@/util/utmLink";
import {
  tbcAccounts,
  bundesblockAccounts,
  digitalAssetsDayAccounts,
} from "@/constants/socialAccounts";
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
const DAD_LI = `@${digitalAssetsDayAccounts.linkedin.handle}`;

/**
 * Builds ready-to-post captions personalised to what the speaker entered
 * (their role, talk and day), with the right accounts tagged per platform.
 *
 * Both hosts are tagged in every post, whichever day the speaker is on: the
 * club on all three platforms, and the Digital Assets Day through Bundesblock
 * on X and through its own page on LinkedIn. Instagram names it in words —
 * neither Bundesblock nor the day has a confirmed account there.
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
  const isDad = day === "day2";

  const dayX = isDad
    ? `the Digital Assets Day by ${BB_X} on October 30`
    : "the First Conference Day on October 29";
  const dayIG = isDad
    ? "the Digital Assets Day by Bundesblock on October 30"
    : "the First Conference Day on October 29";
  const dayLI = isDad
    ? `the ${DAD_LI} on October 30`
    : "the First Conference Day on October 29";

  // A day 1 speaker still names the other day, so both hosts end up tagged.
  const alsoX = isDad
    ? ""
    : `, with the Digital Assets Day by ${BB_X} on Oct 30`;
  const alsoIG = isDad
    ? ""
    : ", with the Digital Assets Day by Bundesblock on October 30";
  const alsoLI = isDad ? "" : `, with the ${DAD_LI} on October 30`;

  const x = `🎤 ${rolePrefix}I'm speaking at the TUM Blockchain Conference 26 — ${dayX}!${talkLine}\n\nThe full conference runs Oct 29 to 31 in Munich, hosted by ${X}${alsoX} → ${LINK}\n\n#TUMBlockchainConference26`;

  // Instagram gets no raw URL: it would not be clickable in a caption, so the
  // post points at the website and at the host's bio link instead.
  const instagram = `🎤 ${rolePrefix}I'm speaking at the TUM Blockchain Conference 26 — ${dayIG}!${talkLine}\n\nThe full conference runs October 29 to 31 in Munich${alsoIG}. Tickets on the website, or via the link in the bio of ${IG} 🚀\n\n#TUMBlockchainConference26 #Web3 #Munich`;

  const linkedin = `I'm honoured to speak at the TUM Blockchain Conference 26.\n\n${rolePrefix}I will be part of ${dayLI}.${talkLine}\n\nThe full conference runs October 29 to 31 in Munich, hosted by ${TBC_LI}${alsoLI}. See the programme: ${LINK}\n\n#TUMBlockchainConference26`;

  return [
    { platform: "X", text: x },
    { platform: "Instagram", text: instagram },
    { platform: "LinkedIn", text: linkedin },
  ];
}
