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
    name: "Finance Loop",
    src: "/extra-partners26/finance-loop.png",
    website: "https://financeloop.de",
    // Dark blue wordmark with a teal ring, supplied on transparent: measured
    // ink luminance 90 of 255, so it belongs on the white card. Trimmed to the
    // mark and scaled to 1200px wide like the others, nothing recoloured.
    background: "light" as LogoBackground,
  },
  {
    // Germany's biggest crypto outlet — media partner.
    name: "BTC-ECHO",
    src: "/extra-partners26/btc-echo.png",
    website: "https://www.btc-echo.de",
    // Their own complete logo: the orange BE mark with the near black
    // BTC-ECHO wordmark, measured ink luminance 87 of 255, so it belongs on
    // the white card. Same artwork as the white header version on their site,
    // same viewBox, only the variant differs. Nothing recoloured.
    background: "light" as LogoBackground,
  },
  {
    // Frankfurt's Web3 community association, the Rhine-Main counterpart to
    // what the club does in Munich.
    name: "GM, FFM!",
    src: "/extra-partners26/gm-ffm.png",
    website: "https://gmffm.de",
    // Their badge is a solid violet block with the wordmark reversed out, so
    // the ink reads dark at 94 of 255 and it belongs on the white card. The
    // file came sitting on white; only that surround is cleared, reached by a
    // flood fill from the edge so the white wordmark inside stays. Nothing
    // recoloured.
    background: "light" as LogoBackground,
  },
  {
    // Events calendar and Telegram bot that lists conferences worldwide —
    // media partner.
    name: "AllConfsBot",
    src: "/extra-partners26/allconfsbot.png",
    website: "https://allconfsbot.website",
    // Black wordmark next to the red mascot badge, supplied on transparent:
    // measured ink luminance 90 of 255, so it belongs on the white card.
    // Trimmed to the mark and scaled to 1200px wide like the others.
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
  {
    // Euro stablecoin issuer backed by DWS, Galaxy and Flow Traders —
    // community partner.
    name: "AllUnity",
    src: "/extra-partners26/allunity.png",
    website: "https://allunity.com",
    // Their black logo on transparent, so it belongs on the white card.
    // Trimmed to the mark and scaled to 1200px wide, nothing recoloured.
    background: "light" as LogoBackground,
  },
  {
    // Community partner. No website supplied.
    name: "Capital & Code",
    src: "/extra-partners26/capital-and-code.png",
    // Black wordmark from their SVG, rasterised and trimmed out of its square
    // canvas, scaled to 1200px wide; belongs on the white card. Nothing
    // recoloured.
    background: "light" as LogoBackground,
  },
];
