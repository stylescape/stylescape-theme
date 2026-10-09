# Theming

## Light by default

`tokens/_css-vars.scss` emits the light set at `:root` and on
`[data-theme="light"]`, so a light island inside a dark page or band
re-declares the light values on itself. A page with no stamp renders in
core's default palette. No `color-scheme` is set there:
core does not set one, and setting it repaints unstyled form controls.

## Dark, on a page or a band

`themes/_dark.scss` emits the dark set under `[data-theme="dark"]` — the
attribute selector alone, not `:root[…]`, so it works on any element.
Custom properties inherit, so a `<section data-theme="dark">` re-themes
everything inside it, and the package root gives that section its own
ground and text colour.

## Following the OS

As in core 0.5, `data-theme="auto"` takes the dark set when the OS prefers
dark (`@media (prefers-color-scheme: dark)`). Without the attribute the
page stays light whatever the OS prefers.

## Faded colours

A token cannot be faded in CSS. Where a stylesheet needs an alpha, it uses
`fade()` on a swatch from `./abstracts` and writes the dark side beside it
with `@include dark { … }`.
