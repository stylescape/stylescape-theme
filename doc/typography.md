# Typography

## The stacks

| Token                                  | Stack (core's)                                                       |
| -------------------------------------- | -------------------------------------------------------------------- |
| `--ss-font-family-base`, `-sans`       | `stylescape_sans_regular, Roboto Sans, Helvetica Neue, … sans-serif` |
| `--ss-font-family-heading`, `-display` | the same                                                             |
| `--ss-font-family-mono`                | `stylescape_mono_regular, Roboto Mono, Courier New, … monospace`     |

The first family in each is a name core declares but does not ship, so a
browser falls through to the system faces.

## The heading setting

Core sets h1-h6 bold, untracked, at line-height 1.2 in the inherited body
face; the heading tokens say the same (`700`, `0em`, `1.2`). The package
root applies them to h1-h6 at zero specificity, so in the template nothing
changes; a brand theme changes the tokens and every heading follows.
`@include heading` from `./base` applies the setting to anything else.

## Adding a face

See [template.md](template.md), step 5: woff2 files and their licence
under `src/font/<face>/`, an `@font-face` per file in `src/font/fonts.css`,
the family first in `$font-sans` / `$font-heading`, the latin cut in
`$preload`. `tst/package.test.mjs` fails if a declared file or its licence
is missing.
