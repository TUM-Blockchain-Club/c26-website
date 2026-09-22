/**
 * Verified official handles only — confirmed via each platform directly,
 * not guessed. If a platform isn't listed for an org, no confirmed account
 * was found; leave it out rather than inventing one.
 */
export const tbcAccounts = {
  x: { handle: "@tbc_munich", url: "https://x.com/tbc_munich" },
  instagram: {
    handle: "@tumblockchain",
    url: "https://www.instagram.com/tumblockchain/",
  },
  linkedin: {
    handle: "TUM Blockchain Club",
    url: "https://www.linkedin.com/company/tum-blockchain-club/",
  },
};

export const bundesblockAccounts = {
  x: { handle: "@bundesblock", url: "https://x.com/bundesblock" },
  linkedin: {
    handle: "Bundesblock",
    url: "https://www.linkedin.com/company/bundesblock/",
  },
  // No confirmed official Instagram account found for Bundesblock.
};

/**
 * The Digital Assets Day's own pages. It is curated by Bundesblock and has no
 * account of its own on X — Bundesblock's handle covers the day there.
 */
export const digitalAssetsDayAccounts = {
  linkedin: {
    handle: "DIGITAL ASSETS DAY by Bundesblock",
    url: "https://www.linkedin.com/company/digital-assets-day-by-bundesblock/",
  },
};
