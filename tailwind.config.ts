import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tbc-yellow": "rgb(var(--tbc-yellow-rgb) / <alpha-value>)",
        "tbc-red": "rgb(var(--tbc-red-rgb) / <alpha-value>)",
        "tbc-purple": "rgb(var(--tbc-purple-rgb) / <alpha-value>)",
        "tbc-light-blue": "rgb(var(--tbc-yellow-rgb) / <alpha-value>)",
        "tbc-violet": "rgb(var(--tbc-purple-rgb) / <alpha-value>)",
        "tbc-pink": "rgb(var(--tbc-red-rgb) / <alpha-value>)",
        "bg-hover": "#1D1D1D",
        "email-pink": "#FFCB6D",
        "email-purple": "#FFCB6D",
        "track-background": "#1a012e",
        "track-border": "#c084fc",
        track: "#E9D5FF",
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
