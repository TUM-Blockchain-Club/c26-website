import { LogoBackground } from "@/util/logoTone";

/**
 * The tiers from the sponsorship deck. They belong to two separate tracks —
 * Platinum to Bronze sponsor the conference, Premium to Travel the Hackathon —
 * so a Premium sponsor does not outrank a Gold one; they are simply not in
 * the same list. The tier a sponsor is in decides which track it shows under.
 */
export type Sponsor26Tier =
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "premium"
  | "standard"
  | "travel";

export type Sponsor26 = {
  name: string;
  tier: Sponsor26Tier;
  src: string;
  website: string;
  /** Which card the logo needs — see util/logoTone.ts. All four are dark ink
   * on a transparent canvas, so they all sit on the white card. */
  background: LogoBackground;
};

export type Sponsor26Track = {
  key: "conference" | "hackathon";
  label: string;
  /** Highest tier first; one row per tier. */
  tiers: { key: Sponsor26Tier; label: string }[];
};

export const SPONSOR26_TRACKS: Sponsor26Track[] = [
  {
    key: "conference",
    label: "Conference",
    tiers: [
      { key: "platinum", label: "Platinum" },
      { key: "gold", label: "Gold" },
      { key: "silver", label: "Silver" },
      { key: "bronze", label: "Bronze" },
    ],
  },
  {
    key: "hackathon",
    label: "Hackathon",
    tiers: [
      { key: "premium", label: "Premium" },
      { key: "standard", label: "Standard" },
      { key: "travel", label: "Travel" },
    ],
  },
];

export const sponsors26: Sponsor26[] = [
  {
    name: "Crypto Finance",
    tier: "gold",
    src: "/sponsors26/crypto-finance.png",
    website: "https://www.crypto-finance.com",
    background: "light",
  },
  {
    name: "softstack",
    tier: "bronze",
    src: "/sponsors26/softstack.svg",
    website: "https://softstack.io",
    background: "light",
  },
  {
    name: "Cake Wallet",
    tier: "bronze",
    src: "/sponsors26/cake-wallet.svg",
    website: "https://cakewallet.com",
    background: "light",
  },
  {
    name: "Tangany",
    tier: "bronze",
    src: "/sponsors26/tangany.png",
    website: "https://tangany.com",
    background: "light",
  },
  {
    name: "Fnality",
    tier: "bronze",
    src: "/sponsors26/fnality.svg",
    website: "https://fnality.com",
    background: "light",
  },
  {
    name: "BSV Association",
    tier: "premium",
    src: "/sponsors26/bsv-association.png",
    website: "https://bsvassociation.org",
    background: "light",
  },
];
