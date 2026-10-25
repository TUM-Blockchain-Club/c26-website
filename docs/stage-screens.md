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

- **Intro**: the day's mark tilts in in 3D, then the conference ring (the
  original artwork, softly blurred, or its shape in blue on the Digital
  Assets Day) frames the speakers and the title, centred on the ring's own
  middle so it fills all four corners while it sways. About 8 seconds, then
  "On stage" by itself. Optional sound sting (`introSound.ts`, synthesised,
  off by default).
- **On stage** shows every speaker and the moderator with photo and role.
  It is also the fallback while a talk has no slides.
- **Slides** are the speaker's PDF, uploaded in the room's studio; one page
  per press.
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

Speaker PDFs live in the browser's IndexedDB on the stage computer
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
