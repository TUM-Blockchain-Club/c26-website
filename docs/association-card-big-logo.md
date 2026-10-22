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
