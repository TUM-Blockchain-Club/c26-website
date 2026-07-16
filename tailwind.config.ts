import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand identity (raw palette) — see app/globals.css :root for values.
        "tbc-yellow": "rgb(var(--color-brand-yellow-rgb) / <alpha-value>)",
        "tbc-red": "rgb(var(--color-brand-red-rgb) / <alpha-value>)",
        "tbc-purple": "rgb(var(--color-brand-purple-rgb) / <alpha-value>)",

        // Semantic surfaces
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        "bg-hover": "#1D1D1D",

        // Semantic borders (fixed opacity baked in — these are tiers, not a
        // scale, so they're not meant to be composed with /NN like Tailwind's
        // own white/black do).
        line: "rgb(var(--color-border-rgb) / var(--color-border-alpha))",
        "line-subtle":
          "rgb(var(--color-border-subtle-rgb) / var(--color-border-subtle-alpha))",
        "line-strong":
          "rgb(var(--color-border-strong-rgb) / var(--color-border-strong-alpha))",

        // Semantic text tiers (same fixed-opacity convention as borders)
        secondary:
          "rgb(var(--color-text-secondary-rgb) / var(--color-text-secondary-alpha))",
        muted:
          "rgb(var(--color-text-muted-rgb) / var(--color-text-muted-alpha))",
        faint:
          "rgb(var(--color-text-faint-rgb) / var(--color-text-faint-alpha))",

        // Semantic accents
        gold: "rgb(var(--color-accent-gold-rgb) / <alpha-value>)",
        focus: "rgb(var(--color-focus-rgb) / <alpha-value>)",

        // Track / category colors (agenda, tracks grid) — bright tone +
        // muted background tone per track.
        "track-education":
          "rgb(var(--color-track-education-rgb) / <alpha-value>)",
        "track-education-bg":
          "rgb(var(--color-track-education-bg-rgb) / <alpha-value>)",
        "track-ecosystem":
          "rgb(var(--color-track-ecosystem-rgb) / <alpha-value>)",
        "track-ecosystem-bg":
          "rgb(var(--color-track-ecosystem-bg-rgb) / <alpha-value>)",
        "track-application":
          "rgb(var(--color-track-application-rgb) / <alpha-value>)",
        "track-application-bg":
          "rgb(var(--color-track-application-bg-rgb) / <alpha-value>)",
        "track-research":
          "rgb(var(--color-track-research-rgb) / <alpha-value>)",
        "track-research-bg":
          "rgb(var(--color-track-research-bg-rgb) / <alpha-value>)",
        "track-regulation":
          "rgb(var(--color-track-regulation-rgb) / <alpha-value>)",
        "track-regulation-bg":
          "rgb(var(--color-track-regulation-bg-rgb) / <alpha-value>)",
        "track-workshop":
          "rgb(var(--color-track-workshop-rgb) / <alpha-value>)",
        "track-workshop-bg":
          "rgb(var(--color-track-workshop-bg-rgb) / <alpha-value>)",
        "track-academic":
          "rgb(var(--color-track-academic-rgb) / <alpha-value>)",
        "track-academic-bg":
          "rgb(var(--color-track-academic-bg-rgb) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      spacing: {
        "page-pt": "var(--space-page-pt)",
        "page-top": "var(--space-page-top)",
        "page-top-lg": "var(--space-page-top-lg)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "mobile-wide": {
          raw: "((max-width: 1020px) and (max-height: 620px))",
        },
      },
      transitionProperty: {
        "bg-img": "background-image",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)"],
        sans: ["var(--font-montserrat)"],
        raleway: ["var(--font-raleway)"],
      },
    },
  },
  plugins: [],
};
export default config;
