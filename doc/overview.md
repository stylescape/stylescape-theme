# Overview

`stylescape-theme` is a Stylescape theme with no brand in it. It loads
stylescape core and redeclares core's `--ss-*` tokens, so every core
component picks the theme up at runtime without a single rule of its own —
and every value it redeclares is core's own default. It is the template
the brand themes (`stylescape-mesmera`, `stylescape-geoid`, …) are laid out
like: `src/scss/{abstracts,tokens,themes,base}`, `src/font/`, `tst/`.

## What ships

- **Tokens** — the light set at `:root` (`tokens/`), the dark set under
  `[data-theme="dark"]` (`themes/`).
- **Faces** — none. The stacks are core's, which fall through to the
  system fonts; `src/font/fonts.css` is the place a brand's faces go.
- **Sass tools** — breakpoints, `fade()`, the `dark` mixin (`abstracts/`)
  and the heading/body/eyebrow mixins (`base/`). They emit nothing.
- **A lint contract** — `stylelint.config.mjs`, for consumers.

What does not ship is a look. A site builds its own layout and components
on these tokens.

## Why core's values

A starter that renders like core is a known point: install it under a site
that uses core and nothing changes, then change one value and see exactly
that change. It also makes the template a map of core's token set — each
swatch in `tokens/_brand.scss` says which core value it mirrors.

## The dark theme

Core 0.5 ships a complete dark theme, and the template's dark set is core's,
value for value, plus the few tokens a dark band needs re-declared. Every
text pair is held to WCAG AA in both themes; see [colors.md](colors.md).
