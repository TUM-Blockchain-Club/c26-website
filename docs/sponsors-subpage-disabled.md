# Sponsors Subpage Disabled

Date: 2026-05-28

The standalone `/sponsors` page is currently disabled by calling `notFound()` from `app/sponsors/page.tsx`. The previous page markup remains commented in the same file so it can be restored directly when the subpage should go live again.

The header navigation link for Sponsors is also commented out in `components/header/Header.tsx`, including its desktop ordering entry.

The homepage sponsors section remains active in `app/page.tsx`.
