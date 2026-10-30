# Hackathon opening on the stage page

The Hackathon opening is a self-contained HTML deck built outside this site
(`stage-decks/hackathon-opening.html`). The stage index links to it under
"Hackathon stage".

- Served by `app/stage-76803f8f95/hackathon/route.ts`, which checks the stage
  passcode cookie and otherwise redirects to the stage login.
- The file lives outside `public/` so it is not reachable without the passcode;
  `next.config.mjs` adds it to the route's file trace via
  `outputFileTracingIncludes`.
- To update the deck, replace `stage-decks/hackathon-opening.html`.
- Controls come from the deck itself: → / Space / Enter next, ← back, F full screen.
