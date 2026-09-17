import { LogoBackground } from "@/util/logoTone";
import type { StaticCommunityPartner } from "@/constants/communityPartners";

/**
 * Media partners — outlets covering the conference. Kept separate from the
 * community partners because those come from Strapi: when Strapi answers, its
 * list replaces the committed community snapshot, and anything added there
 * would disappear with it. This list is always shown alongside, whichever
 * source the community partners come from.
 */
export const mediaPartners: StaticCommunityPartner[] = [
  {
    name: "Cryptopolitan",
    src: "/media-partners26/cryptopolitan.png",
    website: "https://www.cryptopolitan.com",
    // Dark navy wordmark on white — belongs on the white card.
    background: "light" as LogoBackground,
  },
];
