import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });
const description =
  "Germany's leading student-run conference exploring the frontiers of blockchain technology";

const siteUrl = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://c26-website.vercel.app",
);

const ogImages = {
  url: new URL("/opengraph-image.png", siteUrl),
  width: 1200,
  height: 630,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "TUM Blockchain Conference 26",
  metadataBase: new URL("https://conference26.tum-blockchain.com"),
  authors: [
    {
      name: "Yudhistira Arief Wibowo",
      url: "https://github.com/itsmeyaw",
    },
    {
      name: "Xiyue Zhang",
      url: "https://github.com/LUOJIUzxy",
    },
    {
      name: "TUM Blockchain Club",
      url: "https://tum-blockchain.com",
    },
  ],
  publisher: "TUM Blockchain Club",
  category: "technology",
  keywords: ["conference", "blockchain"],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  description: description,
  openGraph: {
    title: "TUM Blockchain Conference 26",
    description: description,
    images: ogImages,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TUM Blockchain Conference 26",
    description: description,
    site: "@tbc_munich",
    creator: "@tbc_munich",
    images: ogImages,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://tally.so/widgets/embed.js"></Script>
        <Script
          src={`https://cdn-cookieyes.com/client_data/6331baf83b563ec3150ad4bb/script.js`}
          strategy="beforeInteractive"
        ></Script>
      </head>
      <body
        className={`${montserrat.className} bg-black text-white overflow-x-hidden w-screen items-center justify-center`}
      >
        {" "}
        {/* FIX: Items center and justify-center are enforcing center alignment for everything*/}
        <Header />
        {children}
        <SpeedInsights />
        <Footer />
        <MetaPixel />
        <Script
          id="luma-checkout"
          src="https://embed.lu.ma/checkout-button.js"
          strategy="afterInteractive"
        />
        <Script
          defer
          data-domain="conference26.tum-blockchain.com"
          src="https://plausible.rbg.tum-blockchain.com/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
