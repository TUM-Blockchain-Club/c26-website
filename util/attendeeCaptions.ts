import { buildAttendeeUtmLink } from "@/util/utmLink";
import { tbcAccounts } from "@/constants/socialAccounts";

export type AttendeeCaptionInput = {
  job?: string;
  blurb?: string;
};

export type AttendeeCaptions = {
  platform: "X" | "Instagram" | "LinkedIn";
  text: string;
}[];

const LINK = buildAttendeeUtmLink();
const X = tbcAccounts.x.handle; // @tbc_munich
const IG = tbcAccounts.instagram.handle; // @tumblockchain
const TBC_LI = `@${tbcAccounts.linkedin.handle}`; // @TUM Blockchain Club

/**
 * Builds ready-to-post captions personalised to what the attendee entered
 * (their role and what they're most excited about), tagging the club on
 * every platform so they can be found and reshared.
 */
export function buildAttendeeCaptions({
  job,
  blurb,
}: AttendeeCaptionInput): AttendeeCaptions {
  const role = job?.trim();
  const excited = blurb?.trim();
  const rolePrefix = role ? `As ${role}, ` : "";
  const excitedLine = excited ? `\n\nMost looking forward to: ${excited}` : "";

  const x = `🚀 ${rolePrefix}I'll be at the TUM Blockchain Conference 26!${excitedLine}\n\nOct 29 to 31 in Munich, hosted by ${X} → ${LINK}\n\n#TUMBlockchainConference26`;

  const instagram = `🚀 ${rolePrefix}I'll be at the TUM Blockchain Conference 26!${excitedLine}\n\nOct 29 to 31 in Munich (link in bio: ${LINK}). Hosted by ${IG} 🎉\n\n#TUMBlockchainConference26 #Web3 #Munich`;

  const linkedin = `I'll be attending the TUM Blockchain Conference 26.\n\n${rolePrefix}I'm looking forward to three days of talks, the Digital Assets Day and the Hackathon.${excitedLine}\n\nOctober 29 to 31 in Munich, hosted by ${TBC_LI}. See the programme: ${LINK}\n\n#TUMBlockchainConference26`;

  return [
    { platform: "X", text: x },
    { platform: "Instagram", text: instagram },
    { platform: "LinkedIn", text: linkedin },
  ];
}
