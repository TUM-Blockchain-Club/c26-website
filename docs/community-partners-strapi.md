# Community Partners 26 via Strapi

This year's Community Partner logos are maintained in Strapi and rendered on the
homepage by `sections/CommunityPartners.tsx` (section id `community-partners`,
placed right after `Sponsors`). `sections/Partners.tsx` keeps showing _last_
year's partners and is untouched.

## Strapi collection type

Create it in the admin under **Content-Type Builder → Create new collection type**
(https://strapi.rbg.tum-blockchain.com/admin):

- Display name: `Community Partner 26` → API ID (plural) `community-partner-26s`
- Fields:
  - `name` — Text (short), required
  - `logo` — Media (single), allowed type image, required
  - `website` — Text (short), optional; wraps the logo in a link
  - `priority` — Number (integer), optional; higher values are listed first

If the plural API ID ends up different, set `STRAPI_COMMUNITY_PARTNER_ENDPOINT`
in the environment instead of renaming the type.

## Permissions

The API token in `STRAPI_API_TOKEN` needs `find` (and `findOne`) on the new type.
Custom tokens do **not** pick up new content types automatically:
**Settings → API Tokens → edit the token → Permissions → Community Partner 26**.
Without it the API answers `403` and the section renders nothing.

## Fetching

`fetchCommunityPartners()` in `components/service/contentStrapi.ts` pages through
the collection with `populate=logo`. Any error returns an empty list, and the
section renders `null` when nothing is published, so a Strapi outage cannot break
the build or the homepage.

Logos take one of two paths, decided by whether the filesystem is writable:

- **During a build** each logo is cached at
  `public/community-partners26/<documentId><ext>` (gitignored) and served from
  there, so the deployed site does not depend on Strapi being up.
- **During ISR regeneration on Vercel** the filesystem is read-only, so the logo
  is served straight from Strapi (`unoptimized`, because the image optimizer
  would need the host allow-listed and rejects SVG). The next build caches it
  locally again.

## Static snapshot

`constants/communityPartners.ts` holds a committed snapshot of the partners
(logo path, website, card background), and the logos it points at are checked
into `public/community-partners26/` even though the directory is gitignored for
build-generated files. The section falls back to it whenever Strapi returns
nothing — which is the case while the production API token has no read access to
the collection. As soon as Strapi answers, its data wins and the snapshot is
ignored; it can then be deleted.

## Card background

`util/logoTone.ts` measures each logo with `sharp` and picks the card:
transparent logos are judged by their ink (bright ink → dark card), opaque files
copy their baked-in background tone so the image edge does not show. It reads a
buffer, so it works on both paths above. Failure falls back to the white card.

## Publishing a new partner

Content → Community Partner 26 → Create entry → upload the logo → **Publish**.
Nothing else is needed: `app/page.tsx` sets `revalidate = 600`, so the homepage
regenerates within ten minutes and picks the entry up — no redeploy, no webhook,
and it works for any Strapi user with content access. A deploy also refreshes it
immediately.
