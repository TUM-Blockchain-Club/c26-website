# Speaker card for two speakers

The unlisted speaker card generator (`app/speaker-d6e47f2400`,
`components/brand/SpeakerCardGenerator.tsx`) can now make a card for two
people, for a fireside chat or a session held by two. Switch to
**Two speakers** above the steps.

- Both photos, both names with job title and company, and the session title
  are required; the session title fills the space a single speaker's blurb
  would take.
- The eyebrow is picked from Speaking at, Fireside chat, Talk and Workshop.
- The session title is the largest text, in the brand gradient running across
  its own width. The portraits are round, each in a gradient ring that draws
  itself round, with a soft glow behind and a gradient × between the two.
- 4:5 puts the title under the header and the portraits side by side below
  it; 16:9 puts the title on the left and the portraits on the right.
- An optional time and stage ("13:30 | Nakamoto Stage") goes on the first
  bottom line after the date, with the day's name moving to the second.
- The bottom lines use `|` between their parts instead of `·`. The
  single-speaker cards are unchanged.
- Long roles and titles shrink to fit instead of losing their last words.
- The suggested posts are hidden in this mode: they are written in the first
  person for one speaker.

Rendering lives in `util/partnerCardVideo.ts` (`drawDuoLandscape`,
`drawDuoPortrait`). `CardContent.second` carries the second person and the URL
of their photo, `CardContent.eyebrow` the format.

`wrapLines` used to put only one word on the last allowed line and drop the
rest. It now fills that line like the others, which also lets a long blurb on
the single-speaker card show more of its text.
