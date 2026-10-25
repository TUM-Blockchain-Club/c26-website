# Stage screens

Full-screen graphics for the three rooms, run in a browser on each stage
computer and cued by the crew. They replace last year's Figma plugin
(`TUM-Blockchain-Club/conference-slide-generator`).

- Index: `/stage-76803f8f95`, behind a passcode (see Access below).
- Screens: `/stage-76803f8f95/nakamoto`, `/turing`, `/hopper`. The
  30 October names (Main Stage, Executive Forum, Future Stage) map onto the
  same rooms.
- Studios: `/stage-76803f8f95/<room>/studio`, for the speakers' PDFs.

## Running a session

Nothing advances on its own. Each press of → (or a presentation clicker)
moves one cue:

Up next → Intro → On stage → Slides 1…n → Thank you → next session

- **Intro**: the ring that is already in the background moves to the middle,
  grows and softens, the day's mark tilts in, then the speakers and the
  title; at the end the ring goes back to its place. About 8 seconds, then
  "On stage" by itself. Only transform and opacity animate (the soft ring is
  a second, pre-blurred copy faded in), so it stays smooth on a laptop.
  Sparkles twinkle around the ring and the day mark floats. The sound is a
  warm cue in F sharp major (`introSound.ts`, synthesised); **M** switches it
  on or off at once, also mid-intro. Optional sound sting (`introSound.ts`, synthesised,
  off by default).
- **On stage** shows every speaker and the moderator with photo, position
  and, in bold, the company; "Moderator" sits under the text. Long titles
  and big panels shrink step by step (never below 60 percent) so all of it
  fits.
  It is also the fallback while a talk has no slides.
- **Slides**, one page per press: the files uploaded on the session in
  Strapi (Agenda 26, field `slides`; PDFs and images, in their order), or a
  PDF uploaded in the room's studio on that computer, which takes
  precedence.
- **Breaks** in the programme are their own cue; **P** puts up a short-pause
  screen at any time, **B** blacks out.

On first open a start screen asks for the stage and the day; the start page
links straight to each. The Digital Assets Day runs in blue throughout, under
the Digital Assets Day mark alone, with the track sponsors on Up next and in
the intro.

## Controls

| Key                         | Action                                     |
| --------------------------- | ------------------------------------------ |
| → / Space / Enter / clicker | next cue                                   |
| ←                           | back one cue                               |
| ↓ / ↑                       | next / previous session                    |
| P                           | short-pause screen                         |
| B                           | black screen                               |
| I                           | replay the intro                           |
| M                           | sound on / off                             |
| A                           | jump to the cue that fits the current time |
| F                           | full screen                                |

The current cue, branding and sound are kept per room in `localStorage`, so
a reload resumes where the crew was. `?cue=<sessionId>:<step>` opens a given
cue (the studio's preview link uses it).

## Data

Sessions, speakers, photos and roles come from Strapi (`getAgendaEntries`,
`getSpeakers`); the screen refreshes every minute and keeps its cue, so an
edit in Strapi shows without the screen jumping.

Slides from Strapi load straight from the Strapi server, not through Vercel;
pdf.js reads each PDF's page count when the day is chosen.

Studio PDFs live in the browser's IndexedDB on the stage computer
(`decks.ts`), rendered with pdf.js (`DeckPage.tsx`, worker in
`public/stage/pdf.worker.min.mjs`). Upload them on the stage computer itself;
once there they work offline. Animations and videos inside the slides are
lost in the PDF export.

## Rehearsal

`?at=2026-10-29T09:20` sets the clock and countdowns to that time;
`&speed=20` runs it faster. It never moves the cues.

## Access

The repository is public, so the address alone keeps no one out. `proxy.ts`
and every stage page check an httpOnly cookie set by `/api/stage-login`; the
code only holds the passcode's SHA-256 (`components/stage/stageAccess.ts`).
To change the passcode, put the SHA-256 of the new one there. Signing in
lasts 30 days per browser.

## Look

No corner brackets, blinking dots, tracked capitals or crew hints on the
audience screen. Text is never smaller than 1.2u (crew panel: 14px), and
clipping boxes leave room for descenders. Photos and logos of the chosen day
are preloaded and fade in once loaded; portraits are laid over their circle
so no photo format can turn it into an oval. On the Digital Assets Day the
ring is the original artwork's light and shade toned in several blues.
