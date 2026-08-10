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
    name: "TUM Blockchain Conference 26 + Hackathon",
    description: "Primary wordmark for this year's edition.",
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

/**
 * PNG-only marks (no vector source in the repo). Rendered after the SVG logos
 * with straight PNG downloads instead of the SVG/vector export.
 */
export type PngLogoAsset = {
  id: string;
  name: string;
  description: string;
  /** Preview shown on the dark card. */
  previewSrc: string;
  /** One download button per variant. */
  downloads: { label: string; src: string; fileName: string }[];
};

export const pngLogoAssets: PngLogoAsset[] = [
  {
    id: "digital-assets-day",
    name: "Digital Assets Day",
    description: "The Digital Assets Day mark (Day 2, curated by Bundesblock).",
    previewSrc: "/logos/digital-assets-day-logo-white.png",
    downloads: [
      {
        label: "PNG (white)",
        src: "/logos/digital-assets-day-logo-white.png",
        fileName: "digital-assets-day-white.png",
      },
      {
        label: "PNG (color)",
        src: "/logos/digital-assets-day-logo.png",
        fileName: "digital-assets-day.png",
      },
    ],
  },
];
