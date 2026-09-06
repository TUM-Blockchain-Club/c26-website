# Attendee card: Digital Assets Day co-branding

The attendee card generator lives at `/attending-418eafc2aa` (unlisted) and
renders through `util/partnerCardVideo.ts`.

Institutional partners expect the Digital Assets Day (by Bundesblock) to be
visible wherever the conference is promoted, so the attendee card carries both
marks instead of only the conference wordmark:

- **16:9** — `I'M ATTENDING`, a hairline divider, then the conference wordmark
  (placed off the eyebrow's measured width), and the Digital Assets Day mark in
  the opposite top corner. All three sit on the eyebrow's centre line.
- **4:5** — conference wordmark top-left, Digital Assets Day mark top-right on
  one shared centre line, eyebrow centred underneath.
- Both formats add `INCLUDING THE DIGITAL ASSETS DAY · OCT 30` under the
  conference line at the bottom.

Always the blue-plate `/logos/digital-assets-day-logo.png`, never the white
variant. Both marks are run through `trimTransparent()` first: the blue logo
carries a wide transparent margin, so without trimming it renders smaller than
the mark beside it and floats above the row. The Digital Assets Day box is then
nudged a few pixels down so the blue plate — rather than the block including
its "by Bundesblock" line — lands on the row's centre line.

## Hackathon variant

A checkbox in the generator switches to `ATTENDEE_HACKATHON_CARD_CONFIG`: the
eyebrow reads `I'M ATTENDING THE HACKATHON` and the subline becomes
`BLOCKCHAIN & AI HACKATHON · OCT 30 TO 31`. The two marks stay exactly as they
are — every attendee card carries the conference wordmark and the Digital
Assets Day, whichever day the attendee is coming for. (`hackathon-logo.png` is
deliberately not used here: it repeats the TUM Blockchain wordmark.) The
suggested posts switch to the Hackathon.

The 16:9 eyebrow gets whatever width the two marks leave (`eyebrowMax`), so the
longer Hackathon wording scales itself down instead of running into them.

## Layout

`personTextBlock()` measures the name / role / blurb block and centres it —
against the photo on the 16:9 card, and between the photo and the bottom block
on the 4:5 card — so a card with only a name no longer sits top-heavy. The 16:9
photo is 530×600 at y 250, which keeps it clear of the bottom rule at
`h - 196`; it used to run straight through the photo.

Speaker and partner cards keep their own headers — the mark row is gated on
`kind === "attendee"` — but share these layout fixes.

The suggested posts (`util/attendeeCaptions.ts`) name the Digital Assets Day on
every platform, tagging `@bundesblock` on X and `@Bundesblock` on LinkedIn, and
the page intro says the Digital Assets Day is one of the three conference days.

## Community partner card

The community partner card carries the mark too, logo only and in both formats
under the conference wordmark, above `ORGANISED BY TUM BLOCKCHAIN CLUB` — it
belongs to that half of the `partner × conference` lockup rather than sitting
in a corner of its own. The 16:9 wordmark is 290 tall (was 320) to make room.
Same trimmed blue mark as the attendee card.

## Sponsor cards

All four sponsor layouts (tiered and external, 16:9 and 4:5) carry the pair
too: `drawConferencePair()` puts the Digital Assets Day next to the conference
wordmark behind a hairline, right-aligned on the 16:9 cards and centred on the
4:5 ones, whose whole composition is centred. Geometry lives in
`SPONSOR_PAIR`.

`OFFICIAL SPONSOR` is the point of those posts, so it no longer shares a line
with the date and venue: on the tiered 16:9 card it sits above the separator at
46px with the date underneath, and the other three layouts raise it to 38–50px.
The logo areas gave back a little height for it, and the accent rule above the
external card's caption moved up to clear the bigger type.
