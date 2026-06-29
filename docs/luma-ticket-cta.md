# Luma Ticket CTA

The hero ticket CTA and the ticket section render `LumaTicketButton` from `components/luma-ticket-button/LumaTicketButton.tsx`.

The button points to the Luma event `evt-9GgBM7ScK61zTbb`, loads the Luma checkout script once from `app/layout.tsx`, and forwards campaign attribution parameters to Luma:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

When a visitor arrives with UTM parameters, the button stores them in `sessionStorage` under `tbc-conference-attribution-v1` so they remain available if the visitor navigates before clicking the ticket button. If no UTM source is present, the button sends `utm_source=direct`.

On click, the button sends a Plausible `Ticket Click` event. It also sends Meta Pixel `InitiateCheckout` when the Meta Pixel has been loaded after marketing/advertising consent.
