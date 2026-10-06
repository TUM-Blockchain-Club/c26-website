# Native body scrolling

Keep the body's horizontal overflow set to `clip` in both the global CSS and
the root layout's Tailwind class. `overflow-x: hidden` computes the otherwise
visible vertical axis to `auto`, making the body an additional scroll container.
Overflowing content can then consume wheel or trackpad movement before the
document starts scrolling.

On the production homepage, Chromium reproduced a 76-pixel body scroll range:
the first 40-pixel wheel input changed `body.scrollTop` to 40 while `scrollY`
remained zero. With `overflow-x: clip`, the same input changed `scrollY` to 40
while `body.scrollTop` remained zero; scrolling back up returned the document
to zero. Horizontal overflow remains clipped without a body scroll container.
