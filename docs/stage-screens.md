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

Up next → Intro → On stage → Slides 1…n → next session

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
  precedence. On Nakamoto (`FRAMED_DECK`) they sit as a card on the right
  over the screen's background, with the session's title and speakers on
  the left; the other rooms show them full screen on black.
- **Breaks** in the programme are their own cue; **P** puts up a short-pause
  screen at any time, **B** blacks out.

The LED walls differ: Nakamoto (Main Stage on the Digital Assets Day) is
2880 x 1026, Turing (Executive Forum) 3840 x 1152, Hopper (Future Stage) a
plain 1920 x 1080. The two wide rooms are listed in `WIDE_ROOMS` in
`StageDisplay.tsx` with their resolution; their display lays itself out in a
frame of exactly that shape, centred in the browser window. At the wall's
own resolution it fills the screen, on a 16:9 output it sits in a band with
black above and below. Slides keep their own shape inside it.

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

## Opening ceremony slides

The conference opening (`conference-opening`, 29 October, Nakamoto) brings
its own slides, built into the screen in `components/stage/OpeningDeck.tsx`
after the "C26 Opening" deck in Figma: title, our story (timeline, then
2023 to 2026 one by one), why we do this, what we want to achieve, agenda,
stages with the floor plans, the agenda QR code, the sponsors and organized
by. They follow "On stage" one press each and keep the screen's background.
The sponsors come live from Strapi, grouped by tier. Figma's first slide
(the hosts) is what "On stage" already shows. A PDF uploaded for the session
replaces them, as for any other session. Pictures are in
`public/stage/opening/`.

## Digital Assets Day layout

On 30 October the panel sits in front of the wall, so the lower part of
each screen stays empty: 40 % on Nakamoto (Main Stage), 20 % on Turing and
Hopper (`FLOOR_FREE` in `StageDisplay.tsx`). The Digital Assets Day mark is
three times as large at the top left, the stage and clock sit at the top
centre, the session runs down the left under the mark and the speakers are
at the top right, with what comes next under them. Breaks and the pause
screen keep to the same area, and so do speaker slides on Nakamoto.

Scene changes: the old scene fades out in 0.35 s before the new one rises
in, and the shrink-to-fit is measured as the new scene will stand once
its entrance is over, so nothing loads smaller first or keeps the old
title on screen.
