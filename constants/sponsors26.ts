import { LogoBackground } from "@/util/logoTone";

/** Only the tiers that actually have a sponsor so far. The sponsorship deck
 * also has Platinum, Silver, Standard and Travel; they are left out until one
 * is signed rather than shown empty. */
export type Sponsor26Tier = "premium" | "gold" | "bronze";

export type Sponsor26 = {
  name: string;
  tier: Sponsor26Tier;
  src: string;
  website: string;
  /** Which card the logo needs — see util/logoTone.ts. All four are dark ink
   * on a transparent canvas, so they all sit on the white card. */
  background: LogoBackground;
};

/** Highest tier first; the section renders one row per tier in this order. */
export const SPONSOR26_TIERS: { key: Sponsor26Tier; label: string }[] = [
  { key: "premium", label: "Premium" },
  { key: "gold", label: "Gold" },
  { key: "bronze", label: "Bronze" },
];

export const sponsors26: Sponsor26[] = [
  {
    name: "BSV Association",
    tier: "premium",
    src: "/sponsors26/bsv-association.png",
    website: "https://bsvassociation.org",
    background: "light",
  },
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
];
