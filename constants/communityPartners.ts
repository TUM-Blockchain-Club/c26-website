import { LogoBackground } from "@/util/logoTone";

export type StaticCommunityPartner = {
  name: string;
  src: string;
  website?: string;
  background: LogoBackground;
};

/**
 * Snapshot of the partners published in Strapi, used while the production API
 * token has no read access to the collection yet. Once Strapi answers, its
 * data wins and this list is ignored — see sections/CommunityPartners.tsx.
 */
export const staticCommunityPartners: StaticCommunityPartner[] = [
  {
    name: "Academy Consult",
    src: "/community-partners26/lf5cmstgy5638wv26z0mvrhb.png",
    website: "https://academyconsult.de",
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
    name: "ETH Blockchain Club",
    src: "/community-partners26/dynia0jqonfg3v3c1xbtz7ia.png",
    website: "https://eth-blockchain.org",
    background: "dark",
  },
  {
    name: "TU Design",
    src: "/community-partners26/mwevkteym6s73akk2m2gsoev.svg",
    background: "dark",
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
