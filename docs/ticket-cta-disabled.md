# Ticket CTA Disabled

The hero ticket CTA is intentionally rendered as a disabled `Button` without a `Link` wrapper.

This keeps the visual disabled state while preventing clicks from navigating to Eventbrite. Restore the commented Eventbrite URL in `sections/Hero.tsx` and wrap the button content with `Link` again when ticket sales should reopen.
