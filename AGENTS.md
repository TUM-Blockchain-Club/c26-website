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
