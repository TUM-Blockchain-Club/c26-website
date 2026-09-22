import { LogoBackground } from "@/util/logoTone";
import type { StaticCommunityPartner } from "@/constants/communityPartners";

/**
 * Partners kept in code rather than in Strapi, shown in the Community & Media
 * Partners section alongside whatever the community list resolves to.
 *
 * They live here and not in `staticCommunityPartners` on purpose: that list is
 * only a stand-in and is replaced wholesale the moment Strapi answers, so an
 * entry added there would disappear as soon as the API token gets read access.
 * These are appended either way.
 */
export const extraPartners: StaticCommunityPartner[] = [
  {
    // Media partner.
    name: "Cryptopolitan",
    src: "/extra-partners26/cryptopolitan.png",
    website: "https://www.cryptopolitan.com",
    // Dark navy wordmark on white — belongs on the white card.
    background: "light" as LogoBackground,
  },
  {
    // The club's own 20-week programme, formerly run by the Frankfurt School
    // Blockchain Center.
    name: "Web3 Talents",
    src: "/extra-partners26/web3-talents.png",
    website: "https://www.web3-talents.com",
    // Black wordmark with a colourful mark, on white.
    background: "light" as LogoBackground,
  },
  {
    // German crypto education and comparison platform — media partner.
    name: "LIGHT UP",
    src: "/extra-partners26/light-up.png",
    website: "https://lightupkryptos.de",
    // Black wordmark with an orange mark; the supplied light-background
    // variant, so it belongs on the white card.
    background: "light" as LogoBackground,
  },
];
