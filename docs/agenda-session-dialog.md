# Agenda session dialog and share links

Every talk in the agenda opens a dialog with everything about the session on
one screen: day, start and end time, stage (set large, with a pin), track,
title, the abstract where there is one, speakers (large ringed portraits with
name, role and company) and, where the session is worth sharing, share
buttons. The dialog and the preview image leave out the session length; the
stage grid on the day pages still shows it.

## Abstracts

The abstract is the `description` field of the session in Strapi
(`agenda-26s`). It renders as plain text under the title, keeping any line
breaks typed in the admin, and serves as the dialog's accessible description.
An empty or whitespace-only field renders nothing, which is the case for every
panel. The fallback list in `constants/` carries no abstracts, so they only
appear while the agenda is read from Strapi.

## Links

- Each talk in `constants/digitalAssetsDayAgenda.ts` has a hand-assigned `id`.
  Its permanent link is `/agenda/<id>`, so keep the id when re-importing the
  exports, even if the title, time or stage changed. The module throws at
  build time if two talks share an id.
- `app/agenda/[sessionId]/page.tsx` renders the agenda with that session's
  dialog open, with the session's own title and description in its metadata.
  All pages are generated at build time; unknown ids are a 404.
- On `/agenda`, opening a session changes the URL to `/agenda/<id>` with
  `history.pushState`; the back button closes the dialog. The day pages
  (`/conference-day`, `/digital-assets-day`) add `?session=<id>` instead so a
  reload stays on the day page. Share links always point at `/agenda/<id>`.
- Card titles are real links to the session page, stretched over the whole
  card. A modified click opens the page in a new tab, and crawlers find every
  session page through them. Speaker portraits inside a card sit above that
  link (`relative z-10`) and still go to the speakers page.

## Preview images

`app/agenda/[sessionId]/opengraph-image.tsx` (re-exported as
`twitter-image.tsx`) renders a 1200×630 card per session at build time: event,
day, time, stage, title and each confirmed speaker with portrait, name and
role. It reads portraits from `public/` and the Montserrat TTFs in
`assets/fonts/` (SIL Open Font License, see `assets/fonts/OFL.txt`); Satori
cannot use the WOFF2 files `next/font` downloads.

## Sharing

- A session is shareable once it has a title or at least one confirmed name.
  Sessions with neither open the dialog without share buttons, and their page
  is `noindex`.
- Phones get the native share sheet (`navigator.share`), which reaches
  LinkedIn, X, WhatsApp and the rest; every device gets Copy link. There are
  deliberately no separate LinkedIn or X buttons.
- Shared URLs carry `utm_source=session_share`, `utm_medium` (`native` or
  `copy`) and `utm_content=<id>`; see `util/utmLink.ts`.
- Plausible events: `Session Open` and `Session Share`, both with a `session`
  prop, the latter also with `method`. Nothing is sent to the Meta Pixel.

## Fitting on one screen

The dialog is a bottom sheet on phones and centred from 640px up. Measured
with the worst cases in the programme (a five-person panel with an 88
character title, and the longest title), nothing scrolls at 375×548 (iPhone
SE in Safari with its toolbars), 390×760, 1280×720 and 1440×900. Phones list
the speakers in one column with their full role and company; only on screens
shorter than 640px do panels of four or five switch to two columns, cutting
roles at two lines. A phone held in landscape is too short for any panel, so
the sheet scrolls there instead of cutting content off.

## Slides

Speakers' slides are not public. Files uploaded to a session's `slides`
field in Strapi only reach the stage screens: `getAgendaEntries()` leaves
them out unless called with `{ withSlides: true }`, which only
`components/stage/stageData.ts` does. So neither the agenda, the session
dialog nor their page payload links to them. (30 October 2026: the Slides
button in the dialog and the "Slides" chip on the agenda card were removed.)

The files themselves still sit in Strapi's public media library under a
hashed URL; anyone who already has a link can still open it. A file named
`slides-pdf-<hash of the original>.pdf` stands in for a PowerPoint, Keynote
or ODP file of that hash on the stage.
