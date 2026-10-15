import { LogoBackground } from "@/util/logoTone";

export type StaticCommunityPartner = {
  name: string;
  src: string;
  website?: string;
  background: LogoBackground;
};

/**
 * Snapshot of the partners published in Strapi. This is what the live site
 * actually renders: the production API token cannot read the collection, so
 * fetchCommunityPartners returns nothing there and the section falls back to
 * this list. It was verified by comparing the live page against both sources,
 * name for name. Locally, where the token works, Strapi wins and this list is
 * ignored entirely — see sections/CommunityPartners.tsx.
 *
 * So anything added in Strapi and not mirrored here is invisible to visitors,
 * which is how four partners went missing for a week. Until the token is
 * fixed in the Vercel project settings, every new partner has to be copied in
 * here by hand: name and website from the API, the logo cached under
 * public/community-partners26/ as the partner's documentId, which is the
 * filename the build's own logo cache writes.
 *
 * `background` is measured from the logo's pixels with the same rule as
 * util/logoTone.ts. The four SVGs carry the value checked when they were
 * added, because that measurement needs a raster.
 *
 * START Munich is published in Strapi but is not a community partner of the
 * conference, so it is left out here as well as filtered in the section.
 */
export const staticCommunityPartners: StaticCommunityPartner[] = [
  {
    name: "Academy Consult",
    src: "/community-partners26/lf5cmstgy5638wv26z0mvrhb.png",
    website: "https://academyconsult.de",
    background: "light",
  },
  {
    name: "Association for Women in Cryptocurrency (AWIC)",
    src: "/community-partners26/women-in-crypto.png",
    website: "https://www.womenincrypto.org/",
    background: "light",
  },
  {
    name: "Blockchain Learning Foundation",
    src: "/community-partners26/qmreblmbmr1fvwapuc51dhtd.png",
    website: "https://blockchainlearningfoundation.org/",
    background: "light",
  },
  {
    name: "Blockchain Student Association EPFL",
    src: "/community-partners26/hexlutkw3o8z264ptts18pcu.png",
    website: "https://www.bsaepfl.ch/",
    background: "dark",
  },
  {
    name: "Bundesverband Alternative Investments e.V.",
    src: "/community-partners26/bp5i0f3op3unuo2fkug324kx.jpe",
    website: "https://www.bvai.de/",
    background: "light",
  },
  {
    name: "CTU Blockchain Lab",
    src: "/community-partners26/n939yxoc46fgm361pqb3bj3g.png",
    website: "https://czm.fel.cvut.cz/en/blockchain-lab",
    background: "light",
  },
  {
    name: "Cambridge Blockchain Society",
    src: "/community-partners26/n8r2qwqitsr4prwniae9t4vo.svg",
    website: "https://cambridgeblockchain.org",
    background: "light",
  },
  {
    name: "DLT Talents Alumni",
    src: "/community-partners26/xxvb9yi7yglt7ztz9xfmee3g.png",
    background: "dark",
  },
  {
    name: "Digital Euro Association",
    src: "/community-partners26/arkwj5k6iuav78nqruciwe93.png",
    website: "https://digital-euro-association.de/",
    background: "dark",
  },
  {
    name: "ETH Blockchain Club",
    src: "/community-partners26/dynia0jqonfg3v3c1xbtz7ia.png",
    website: "https://eth-blockchain.org",
    background: "dark",
  },
  {
    name: "Finance Loop",
    src: "/community-partners26/plq2r5fhbcv16mci0nghp7ii.png",
    website: "https://www.finance-loop.net/",
    background: "light",
  },
  {
    name: "ODTÜ Blockchain",
    src: "/community-partners26/amh2n13lmtfelx8rc245gdj3.png",
    website: "https://www.odtublockchain.com/",
    background: "light",
  },
  {
    name: "TU Design",
    src: "/community-partners26/mwevkteym6s73akk2m2gsoev.svg",
    background: "dark",
  },
  {
    name: "TU Investment Club e.V.",
    src: "/community-partners26/m931q4uk161v5pzl6288992c.jpg",
    website: "https://www.tuinvest.de/",
    background: "dark",
  },
  {
    name: "WIW3CH",
    src: "/community-partners26/qewbdd5zdr494ue1laxh1udw.png",
    website: "https://www.wiw3ch.com/",
    background: "light",
  },
  {
    name: "center for software engineering excellence",
    src: "/community-partners26/zowwf97h915b9fgj5gk5bjez.svg",
    website: "https://csee.tech",
    background: "dark",
  },
  {
    name: "frankfurt school centre for digital economics",
    src: "/community-partners26/dy44mwed1elp47mr9oz49khg.png",
    website:
      "https://www.frankfurt-school.de/en/research-and-faculty/research-centres/centre-for-digital-economics",
    background: "light",
  },
  {
    name: "innovis vc",
    src: "/community-partners26/qnfkav6kyveig4cz4ahnxgqw.webp",
    website: "https://www.innovis.vc/munich",
    background: "light",
  },
  {
    name: "nova city",
    src: "/community-partners26/zitk9f9ic0w4a5cov61k0wao.png",
    website: "https://novacity.gmbh",
    background: "light",
  },
  {
    name: "w3.hub",
    src: "/community-partners26/mlujdcuape77ngiwg9nu5hbm.svg",
    website: "https://w3hub.vercel.app",
    background: "light",
  },
  {
    name: "web3 Warsaw",
    src: "/community-partners26/vo7ugw0rf405l0k5u3vaqasp.png",
    website: "https://web3warsaw.com",
    background: "dark",
  },
];
