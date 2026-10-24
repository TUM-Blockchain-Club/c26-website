# Association card: big logo, conference colours

The association card (`/association-7c3b91d4e2`) uses the regular conference
colours again instead of its own teal palette, and draws the association's
logo as large as the layout allows.

- `ASSOCIATION_CARD_CONFIG` in `util/partnerCardVideo.ts` sets `bigLogo: true`
  and no longer overrides `palette` or `ringStops`.
- With `bigLogo`, the logo chip runs up to the × divider (landscape) or the
  full card width (portrait), its height follows the logo's aspect ratio
  (`bigChipHeight`), and the inner padding is a fixed `BIG_LOGO_PAD`.
- The organisation name and the divider are placed from the chip's real
  height and whether the name wraps (`orgNameWraps`), so long two-line names
  do not run into the divider or the date line. In portrait the conference
  block underneath is set 30px tighter to make room.
- The community partner card is unchanged: everything above is gated on
  `bigLogo`.

## Bigger Digital Assets Day mark

`ASSOCIATION_CARD_CONFIG` also sets `bigDayMark: true`. The Digital Assets Day
mark then grows from a 70px-high box to 140px (landscape) or 112px
(portrait); the conference wordmark above it gives up a little height so the
two read as one centred lockup and the block keeps its footprint. The
community partner card keeps the small mark.

## Feedback round, 23 October

From the partner team's annotated PDF:

- The conference wordmark on the association card drops "+ Hackathon"
  (`withoutHackathon`, file `public/logos/c26-wordmark-no-hackathon.svg`,
  the same artwork minus those paths, viewBox trimmed to the ink). It stays
  slightly larger than the Digital Assets Day mark.
- The Digital Assets Day mark is larger again (560×175 in landscape,
  600×135 in portrait) so "Digital Assets Day" and "Bundesblock" read on a
  phone.
- Both logos sit higher: the landscape centre line moves from 52% to 47%,
  the portrait chip from 15.5% to 13%.
- The partner logo is trimmed to its ink before it goes in the chip
  (`partnerMark`), and a logo supplied on an opaque white canvas
  (`hasWhiteCanvas`) goes on the white chip with that canvas trimmed away, so
  it fills the box instead of floating small in the middle.
- The organisation name is a size smaller (50 landscape, 46 portrait) and the
  date line underneath is smaller and lighter (weight 500), so a long name
  such as "Nordic Blockchain Association" stays distinct from it.
- Portrait caps the chip height by the room left above the footer, so a
  square logo cannot push "Organised by" into the separator.

The colours are unchanged, and none of this touches the community partner
card.

## Draft 2, 24 October

From `Association_Partners_Optimization_Draft2.pptx`:

- The organisation name stays on one line, scaled to the chip width
  (`drawFittedText`), instead of wrapping onto two.
- The right column is one lockup: the wordmark, "INCLUDING" in small spaced
  type, then the Digital Assets Day mark at the full width of the column.
- "Organised by TUM Blockchain Club" and the website URL are left out of
  the association card in both orientations; the footer shows only venue
  and date (portrait sits it a little lower).
- `hasWhiteCanvas` also recognises opaque, mostly white logos whose ink runs
  to the file's edge (the Nordic Blockchain Association JPG), and the
  big-logo chip is solid white so such a canvas shows no edge.

All of it is gated on `bigDayMark`, so the community partner card is
unchanged.
