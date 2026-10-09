# Colours

## The placeholder palette

Every value is stylescape core 0.5.1's default — light from
`12-lexicon/_color-tokens.scss`, dark from `33-overrides/_dark.scss`:
neutral greys, core's steel-blue accent family (hue.gl `N24xx`) and its
green / amber / red / indigo feedback set (`N1505`, `N0605`, `N0305`,
`N2705`), with the tints core derives by `color.mix()`. In the light theme
the hues that carry text go through `ink()` — core's `ensure-contrast()`,
darkened until they reach 4.5:1 on `#ececec`. `tst/defaults.test.mjs`
compiles core and holds every light and dark value to it.

## The two themes

| Role        | Light             | Dark      |
| ----------- | ----------------- | --------- |
| background  | `#ffffff`         | `#111111` |
| surface     | `#ffffff`         | `#1c1c1c` |
| surface-alt | `#fafafa`         | `#202020` |
| fill        | `#ffffff`         | `#1c1c1c` |
| text        | `#000000`         | `#f2f2f2` |
| accent      | `rgb(40 113 146)` | `#3696c1` |
| link        | `rgb(45 112 147)` | `#65aace` |
| success     | `rgb(67 118 80)`  | `#559a6a` |
| warning     | `rgb(140 97 64)`  | `#b57f55` |
| error       | `rgb(171 78 73)`  | `#c4756e` |
| info        | `rgb(64 105 173)` | `#6a8dca` |

In the dark theme the hues are set as written, with near-black text on
their fills; their `-foreground` tints are 55% toward white (`tint-lit()`).

## Contrast

`tst/theme.test.mjs` measures every text token against background,
surface, surface-alt and fill, in both themes, at WCAG AA (4.5:1), plus
every `on-*` colour on its fill and the code colours on the code surface.

Both themes pass all of it: since core 0.5 the light accent, link and
status hues are darkened to AA, and the template mirrors that through
`ink()`.
