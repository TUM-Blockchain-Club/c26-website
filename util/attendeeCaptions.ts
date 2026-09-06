import { buildAttendeeUtmLink } from "@/util/utmLink";
import { bundesblockAccounts, tbcAccounts } from "@/constants/socialAccounts";

export type AttendeeCaptionInput = {
  job?: string;
  blurb?: string;
  /** Taking part in the Hackathon: the posts talk about the Hackathon
   * instead of the Digital Assets Day. */
  hackathon?: boolean;
};

export type AttendeeCaptions = {
  platform: "X" | "Instagram" | "LinkedIn";
  text: string;
}[];

const LINK = buildAttendeeUtmLink();
const X = tbcAccounts.x.handle; // @tbc_munich
const IG = tbcAccounts.instagram.handle; // @tumblockchain
const TBC_LI = `@${tbcAccounts.linkedin.handle}`; // @TUM Blockchain Club
const BB_X = bundesblockAccounts.x.handle; // @bundesblock
const BB_LI = `@${bundesblockAccounts.linkedin.handle}`; // @Bundesblock

/**
 * Builds ready-to-post captions personalised to what the attendee entered
 * (their role and what they're most excited about), tagging the club on
 * every platform so they can be found and reshared. Every caption names the
 * Digital Assets Day as one of the conference days — people who know the
 * event under that name should recognise it as the same thing.
 */
export function buildAttendeeCaptions({
  job,
  blurb,
  hackathon,
}: AttendeeCaptionInput): AttendeeCaptions {
  const role = job?.trim();
  const excited = blurb?.trim();
  const rolePrefix = role ? `As ${role}, ` : "";
  const excitedLine = excited ? `\n\nMost looking forward to: ${excited}` : "";

  if (hackathon) {
    return [
      {
        platform: "X",
        text: `🚀 ${rolePrefix}I'm building at the Blockchain & AI Hackathon of the TUM Blockchain Conference 26!${excitedLine}\n\nTwo days of hacking, Oct 30 to 31 in Munich, hosted by ${X} → ${LINK}\n\n#TUMBlockchainConference26 #Hackathon`,
      },
      {
        platform: "Instagram",
        text: `🚀 ${rolePrefix}I'm building at the Blockchain & AI Hackathon of the TUM Blockchain Conference 26!${excitedLine}\n\nTwo days of hacking, Oct 30 to 31 in Munich (link in bio: ${LINK}). Hosted by ${IG} 🎉\n\n#TUMBlockchainConference26 #Hackathon #Web3 #Munich`,
      },
      {
        platform: "LinkedIn",
        text: `I'll be taking part in the Blockchain & AI Hackathon of the TUM Blockchain Conference 26.\n\n${rolePrefix}I'm looking forward to two days of building with the other teams, October 30 to 31 in Munich.${excitedLine}\n\nHosted by ${TBC_LI}. See the programme: ${LINK}\n\n#TUMBlockchainConference26 #Hackathon`,
      },
    ];
  }

  const x = `🚀 ${rolePrefix}I'll be at the TUM Blockchain Conference 26 — including the Digital Assets Day by ${BB_X} on Oct 30!${excitedLine}\n\nOct 29 to 31 in Munich, hosted by ${X} → ${LINK}\n\n#TUMBlockchainConference26 #DigitalAssetsDay`;

  const instagram = `🚀 ${rolePrefix}I'll be at the TUM Blockchain Conference 26, including the Digital Assets Day by Bundesblock on Oct 30!${excitedLine}\n\nOct 29 to 31 in Munich (link in bio: ${LINK}). Hosted by ${IG} 🎉\n\n#TUMBlockchainConference26 #DigitalAssetsDay #Web3 #Munich`;

  const linkedin = `I'll be attending the TUM Blockchain Conference 26.\n\n${rolePrefix}I'm looking forward to three days of talks, the Digital Assets Day by ${BB_LI} on October 30 and the Hackathon.${excitedLine}\n\nOctober 29 to 31 in Munich, hosted by ${TBC_LI}. See the programme: ${LINK}\n\n#TUMBlockchainConference26 #DigitalAssetsDay`;

  return [
    { platform: "X", text: x },
    { platform: "Instagram", text: instagram },
    { platform: "LinkedIn", text: linkedin },
  ];
}
