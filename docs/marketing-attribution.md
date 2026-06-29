# Marketing Attribution

The conference site intentionally does not add Google Analytics. Plausible remains the default privacy-friendly analytics layer for page views and ticket click events.

## Consent

CookieYes is loaded from `app/layout.tsx` with the existing CookieYes client key. Marketing trackers must only load after the visitor grants the CookieYes advertising/marketing category.

`components/analytics/MetaPixel.tsx` renders Meta's snippet as a CookieYes-blocked script with `type="text/plain"` and `data-cookieyes="cookieyes-advertisement"`. CookieYes executes it after the visitor grants the advertisement category. The pixel ID is `2626290637773063`.

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

The Luma checkout script is loaded from the button component only after attribution has been calculated in the browser. Do not move it back to the root layout unless the button stops rendering a temporary direct-link fallback before hydration.

For campaign attribution, the redirect service currently emits URLs like:

```text
https://conference26.tum-blockchain.com/?utm_source=fly-01&utm_medium=qr&utm_campaign=flyer-2026&utm_content=fly-01
```

If CookieYes is reconfigured, verify that the advertisement category still maps to `cookieyes-advertisement`.
