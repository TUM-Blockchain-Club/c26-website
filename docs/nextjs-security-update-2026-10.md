# Next.js security baseline

Next.js is pinned to 16.4.3. The October 14, 2026 security release fixes
Server Actions denial of service, Cache Components code execution, and the
SVG Image Optimization vulnerability. The image optimizer must resolve sharp
0.35.5 or newer.

Use the committed pnpm lockfile and `pnpm install --frozen-lockfile` for
reproducible installs. Keep one authoritative lockfile; the obsolete npm
lockfile has been removed where present.

References:
- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://github.com/vercel/next.js/releases/tag/v16.4.3
