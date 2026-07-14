/**
 * Manifest of real logo files in /public/logos for conference 26. Only
 * variants that actually exist in the repo are listed here.
 */
export type LogoAsset = {
  id: string;
  name: string;
  description: string;
  svgSrc: string;
  /** Preview background this asset was actually designed for. */
  background: "dark";
};

export const logoAssets: LogoAsset[] = [
  {
    id: "c26-wordmark",
    name: "Conference 26 Wordmark",
    description: "Primary wordmark for this year's conference.",
    svgSrc: "/logos/c26-wordmark.svg",
    background: "dark",
  },
  {
    id: "tbc-wordmark",
    name: "TUM Blockchain Club Wordmark",
    description: "The mark of TUM Blockchain Club, the host of the conference.",
    svgSrc: "/logos/tbc-wordmark.svg",
    background: "dark",
  },
];
