# Plausible Conference Tracking

Conference analytics are tracked per yearly conference site, not under the evergreen redirect domain.

This repository represents TUM Blockchain Conference 26 and sends Plausible events with:

```tsx
<Script
  defer
  data-domain="conference26.tum-blockchain.com"
  src="https://plausible.rbg.tum-blockchain.com/js/script.js"
  strategy="afterInteractive"
/>
```

The evergreen `conference.tum-blockchain.com` domain should redirect to the current conference site and should not be used as this site's Plausible `data-domain`.

Ticket CTA clicks are tracked with a custom Plausible event named `Ticket Click` from `components/luma-ticket-button/LumaTicketButton.tsx`. Luma checkout attribution is handled through UTM forwarding; see `docs/marketing-attribution.md`.
