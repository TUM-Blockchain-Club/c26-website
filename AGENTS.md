# Agent Notes

## Project Structure

- `app/` contains the Next.js App Router pages and API routes.
- `components/` contains shared UI components.
- `sections/` contains larger homepage and page sections.
- `constants/` contains static content data such as sponsors, speakers, FAQ entries, and event data.
- `public/` contains static assets served by Next.js.
- `docs/` contains agent-facing notes about changes and operational context.

## Tooling

- Use `pnpm` for Node.js dependency installation and scripts.
- Use a Python virtual environment for any Python work.
- This is a Next.js and React project styled with Tailwind CSS.
- Storybook is available through the package scripts.

## Conventions

- Keep route-level changes in `app/` and shared UI changes in `components/`.
- Prefer existing components and section patterns before introducing new abstractions.
- Document meaningful changes in Markdown under `docs/`.
- Newsletter signups use `app/api/newsletter/route.ts`, encrypted confirmation tokens in `util/newsletterToken.ts`, and Mailgun environment variables: `MAILGUN_API_KEY`, `MAILGUN_LIST_ADDRESS`, `MAILGUN_DOMAIN`, `NEWSLETTER_CONFIRMATION_SECRET`, `NEWSLETTER_FROM`, and optional `MAILGUN_API_BASE`.
- Marketing attribution uses the first-party consent banner in `components/analytics/MarketingConsent.tsx`, Plausible, Meta Pixel, and the Luma ticket button. Keep Meta Pixel gated behind explicit marketing consent; do not add Google Analytics unless explicitly requested.
- The Luma ticket CTA lives in `components/luma-ticket-button/LumaTicketButton.tsx`, forwards stored UTM parameters to Luma, and intentionally redirects as a normal outbound link instead of loading the Luma embed script.
- Agenda sessions open `components/agenda/SessionDialog.tsx` and are shareable at `/agenda/<id>` with per-session preview images; every talk in `constants/digitalAssetsDayAgenda.ts` needs a permanent, unique `id`. See `docs/agenda-session-dialog.md`.
- The partnership deck CTA lives in `sections/Sponsors.tsx` and links to the Tally form at `https://tally.so/r/vGzv6g`.
- Vercel deploy workflows require `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` GitHub secrets and install dependencies with `pnpm --frozen-lockfile`.

Use pnpm-lock.yaml as the authoritative dependency lockfile. See
`docs/nextjs-security-update-2026-10.md` for the framework security baseline.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
