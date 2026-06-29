# Marketing Attribution

The conference site intentionally does not add Google Analytics. Plausible remains the default privacy-friendly analytics layer for page views and ticket click events.

## Consent

The conference site uses a first-party consent banner in `components/analytics/MarketingConsent.tsx`. It stores the visitor's choice in the `tbc_conference_marketing_consent` cookie for `.tum-blockchain.com` and mirrors the value in `localStorage` as a fallback for privacy-restricted browser contexts.

Do not reintroduce the old CookieYes client key without reconfiguring CookieYes for `conference26.tum-blockchain.com` or the parent domain `tum-blockchain.com`. The previous CookieYes setup was registered to `www.tum-blockchain.com`, so consent cookies were not valid for the conference subdomain.

## Meta Pixel

After marketing consent, the site initializes Meta Pixel and sends:

- `PageView` when the pixel is loaded.
- `InitiateCheckout` when a visitor clicks the Luma ticket button.

Do not add Meta's `<noscript>` tracking image here because it would bypass the JavaScript consent gate. The pixel ID is `2626290637773063`.

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

The Luma button only calls `fbq("track", "InitiateCheckout")` when the visitor has accepted marketing cookies and the Meta Pixel has been loaded.
