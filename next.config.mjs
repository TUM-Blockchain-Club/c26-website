/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    return process.env.VERCEL_DEPLOYMENT_ID || Date.now().toString();
  },
  images: {
    // Speaker portraits, side event visuals and partner logos come from
    // Strapi, so the optimizer has to be allowed to fetch from it. Without
    // this every picture added through the CMS would 400 instead of render.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strapi.rbg.tum-blockchain.com",
        pathname: "/uploads/**",
      },
    ],
  },
  // The Hackathon opening deck is read from disk by its stage route.
  outputFileTracingIncludes: {
    "/stage-76803f8f95/hackathon": ["./stage-decks/**/*"],
  },
  // basePath: '/c24-website',
  // assetPrefix: '/c24-website',
};

export default nextConfig;
