# Colours

## The placeholder palette

Every light value is stylescape core 0.4's default
(`12-lexicon/_color-tokens.scss`): neutral greys, core's steel-blue accent
family (hue.gl `N24xx`) and its blue / violet / mauve feedback set, with
the tints core derives by `color.mix()`. `tst/defaults.test.mjs` compiles
core and holds every value to it.

## The two themes

| Role        | Light     | Dark                   |
| ----------- | --------- | ---------------------- |
| background  | `#ffffff` | `#111111`              |
| surface     | `#ffffff` | `#1c1c1c` (core's own) |
| surface-alt | `#fafafa` | `#1a1a1a`              |
| fill        | `#ffffff` | `#333333`              |
| text        | `#000000` | `#f2f2f2` (core's own) |
| accent      | `#3696c1` | `#8abedc`              |
| link        | `#65aace` | `#8abedc`              |

Core sets only two dark colours; the rest are derived from core's grey
ramp and lighter steps of its hues (`tint-lit()`: 45% toward white).

## Contrast

`tst/theme.test.mjs` measures every text token against background,
surface, surface-alt and fill, in both themes, at WCAG AA (4.5:1), plus
every `on-*` colour on its fill and the code colours on the code surface.

The dark theme passes all of it. Core's light palette does not: its accent,
link and status hues are around 2.5–3.5:1 on white. Because the template
mirrors core, the light accent and status checks run as `todo` (reported,
not failing); the body-text checks run for real in both themes. A brand
theme turns the `todo` off.
