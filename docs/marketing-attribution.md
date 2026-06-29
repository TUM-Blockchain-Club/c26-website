# Marketing Attribution

The conference site intentionally does not add Google Analytics. Plausible remains the default privacy-friendly analytics layer for page views and ticket click events.

## Consent

CookieYes is loaded from `app/layout.tsx` with the existing CookieYes client key. Marketing trackers must only load after the visitor grants the CookieYes advertising/marketing category.

`components/analytics/MetaPixel.tsx` checks CookieYes consent through the browser API when available and falls back to CookieYes consent cookies. The Meta Pixel is only injected after advertising/marketing consent. The pixel ID is `2626290637773063`.

## Meta Pixel

After consent, the site initializes Meta Pixel and sends:

- `PageView` when the pixel is loaded.
- `InitiateCheckout` when a visitor clicks the Luma ticket button.

Do not add Meta's `<noscript>` tracking image here because it would bypass the JavaScript consent gate.

## Luma UTM Forwarding

The Luma ticket button reads and persists:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

The button appends those parameters to `https://luma.com/event/evt-9GgBM7ScK61zTbb` before checkout. QR redirect links should therefore send visitors to the conference site with UTM parameters so Luma can attribute checkout activity to the printed campaign source.

For campaign attribution, the redirect service currently emits URLs like:

```text
https://conference26.tum-blockchain.com/?utm_source=fly-01&utm_medium=qr&utm_campaign=flyer-2026&utm_content=fly-01
```

If CookieYes is reconfigured, verify that the advertising or marketing category name still maps to the consent checks in `MetaPixel.tsx`.
