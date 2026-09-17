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
  background: "dark" | "light";
};

export const logoAssets: LogoAsset[] = [
  {
    id: "c26-wordmark",
    name: "TUM Blockchain Conference 26 + Hackathon",
    description:
      "Primary wordmark for this year's edition, for dark backgrounds.",
    svgSrc: "/logos/c26-wordmark.svg",
    background: "dark",
  },
  {
    id: "c26-wordmark-light",
    name: "TUM Blockchain Conference 26 + Hackathon (light background)",
    description:
      "The same wordmark for white and light backgrounds: lettering in black, the 26 and the Hackathon script unchanged.",
    // Derived from c26-wordmark.svg by hand: only the lettering's fill and
    // the script's knockout outline (black on the dark mark, white here)
    // differ. Regenerate from the dark file if that one ever changes.
    svgSrc: "/logos/c26-wordmark-light.svg",
    background: "light",
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
    // The original (blue background) mark, not the white cutout — this is
    // the one that should be offered everywhere, so it leads and previews.
    previewSrc: "/logos/digital-assets-day-logo.png",
    downloads: [
      {
        label: "PNG (original)",
        src: "/logos/digital-assets-day-logo.png",
        fileName: "digital-assets-day.png",
      },
      {
        label: "PNG (white)",
        src: "/logos/digital-assets-day-logo-white.png",
        fileName: "digital-assets-day-white.png",
      },
    ],
  },
];
