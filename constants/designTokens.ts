/**
 * Manifest of design tokens shown on /brand.
 *
 * This file intentionally holds no literal color/size values — only the
 * CSS custom property names to look up and how to label/group them. The
 * /brand page resolves the real values at render time via
 * getComputedStyle(document.documentElement), so it can never drift from
 * app/globals.css. If you rename or add a token there, add its name here
 * and the brand guide picks it up automatically.
 */

export type ColorToken = {
  name: string;
  /** CSS custom property holding an "R G B" triplet, e.g. --color-text-rgb */
  cssVar: string;
  /** Optional separate alpha custom property, e.g. --color-border-alpha */
  alphaVar?: string;
  description: string;
};

export type ColorGroup = {
  id: string;
  label: string;
  tokens: ColorToken[];
};

export const colorGroups: ColorGroup[] = [
  {
    id: "brand",
    label: "Brand",
    tokens: [
      {
        name: "Brand Yellow",
        cssVar: "--color-brand-yellow-rgb",
        description: "Gradient start. The warmest of the three brand hues.",
      },
      {
        name: "Brand Red",
        cssVar: "--color-brand-red-rgb",
        description: "Gradient midpoint.",
      },
      {
        name: "Brand Purple",
        cssVar: "--color-brand-purple-rgb",
        description: "Gradient end. Anchors most interactive accents.",
      },
    ],
  },
  {
    id: "background",
    label: "Background",
    tokens: [
      {
        name: "Background",
        cssVar: "--color-background-rgb",
        description: "Page background.",
      },
      {
        name: "Surface",
        cssVar: "--color-surface-rgb",
        description: "Card fill, sits inside gradient-bordered cards.",
      },
    ],
  },
  {
    id: "border",
    label: "Border",
    tokens: [
      {
        name: "Border Subtle",
        cssVar: "--color-border-subtle-rgb",
        alphaVar: "--color-border-subtle-alpha",
        description: "Resting outline on soft cards.",
      },
      {
        name: "Border",
        cssVar: "--color-border-rgb",
        alphaVar: "--color-border-alpha",
        description: "Default visible border — pills, badges, inputs.",
      },
      {
        name: "Border Strong",
        cssVar: "--color-border-strong-rgb",
        alphaVar: "--color-border-strong-alpha",
        description: "Hover / emphasis state.",
      },
    ],
  },
  {
    id: "text",
    label: "Text",
    tokens: [
      {
        name: "Text",
        cssVar: "--color-text-rgb",
        description: "Primary text — full opacity white.",
      },
      {
        name: "Text Secondary",
        cssVar: "--color-text-secondary-rgb",
        alphaVar: "--color-text-secondary-alpha",
        description: "Body copy, supporting paragraphs.",
      },
      {
        name: "Text Muted",
        cssVar: "--color-text-muted-rgb",
        alphaVar: "--color-text-muted-alpha",
        description: "Labels, captions.",
      },
      {
        name: "Text Faint",
        cssVar: "--color-text-faint-rgb",
        alphaVar: "--color-text-faint-alpha",
        description: "Eyebrow labels, least prominent text.",
      },
    ],
  },
  {
    id: "semantic",
    label: "Semantic",
    tokens: [
      {
        name: "Accent Gold",
        cssVar: "--color-accent-gold-rgb",
        description: "VIP ticket tier accent.",
      },
      {
        name: "Focus",
        cssVar: "--color-focus-rgb",
        description: "Check-in QR detection highlight.",
      },
    ],
  },
  {
    id: "track",
    label: "Tracks",
    tokens: [
      {
        name: "Education",
        cssVar: "--color-track-education-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Ecosystem",
        cssVar: "--color-track-ecosystem-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Application",
        cssVar: "--color-track-application-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Research",
        cssVar: "--color-track-research-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Regulation",
        cssVar: "--color-track-regulation-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Workshop",
        cssVar: "--color-track-workshop-rgb",
        description: "Agenda track tag.",
      },
      {
        name: "Academic",
        cssVar: "--color-track-academic-rgb",
        description: "Agenda track tag.",
      },
    ],
  },
];

export type TypeScaleEntry = {
  /** Matches Text component's textType prop */
  textType:
    | "hero"
    | "sub_hero"
    | "title"
    | "sub_title"
    | "paragraph"
    | "lgsmall"
    | "small";
  label: string;
  sample: string;
};

export const typeScale: TypeScaleEntry[] = [
  { textType: "hero", label: "Hero", sample: "Conference 26" },
  { textType: "sub_hero", label: "Sub Hero", sample: "What's New This Year" },
  { textType: "title", label: "Title", sample: "Previous Speakers" },
  {
    textType: "sub_title",
    label: "Sub Title",
    sample: "Tickets are available now",
  },
  {
    textType: "paragraph",
    label: "Paragraph",
    sample:
      "Germany's leading student-run conference exploring the frontiers of blockchain technology.",
  },
  {
    textType: "lgsmall",
    label: "Large Small",
    sample: "House of Communication, Munich",
  },
  {
    textType: "small",
    label: "Small",
    sample: "HOSTED BY TUM BLOCKCHAIN CLUB",
  },
];

export type RadiusToken = {
  name: string;
  cssVar: string;
  description: string;
};

export const radiusTokens: RadiusToken[] = [
  {
    name: "sm",
    cssVar: "--radius-sm",
    description: "Badges, chips, small inputs.",
  },
  { name: "md", cssVar: "--radius-md", description: "Buttons." },
  { name: "lg", cssVar: "--radius-lg", description: "Cards." },
  {
    name: "full",
    cssVar: "--radius-full",
    description: "Pills, avatar rings.",
  },
];

export type SpaceToken = {
  name: string;
  cssVar: string;
  description: string;
};

export const spaceTokens: SpaceToken[] = [
  {
    name: "page-pt",
    cssVar: "--space-page-pt",
    description: "Top padding under the fixed header (mobile).",
  },
  {
    name: "page-top",
    cssVar: "--space-page-top",
    description: "Top margin for page title blocks (mobile).",
  },
  {
    name: "page-top-lg",
    cssVar: "--space-page-top-lg",
    description: "Top margin for page title blocks (desktop).",
  },
];
