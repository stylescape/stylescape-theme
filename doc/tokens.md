# Tokens

## Namespaces

| Prefix      | Owner        | What                                                       |
| ----------- | ------------ | ---------------------------------------------------------- |
| `--ss-*`    | core lexicon | colour, radius, depth, type — names from stylescape core   |
| `--theme-*` | this package | the brand values core has no name for; not themed          |
| `--color_*` | legacy shim  | `var()` aliases for the two legacy names core's body reads |

`--ss-color-code-key`, `--ss-font-family-heading`,
`--ss-font-weight-heading` and `--ss-tracking-heading` are not in core's
lexicon yet. Every fleet theme sets them, so the template does too, with
values that say what core already does (the body face, bold, untracked).

## `--theme-*`

The placeholders a brand theme renames to `--<brand>-*`.

| Token              | Value                                    |
| ------------------ | ---------------------------------------- |
| `--theme-accent`   | `#3696c1`, core's accent                 |
| `--theme-white`    | `#ffffff`                                |
| `--theme-paper`    | `#fafafa`, core's `surface-alt`          |
| `--theme-gradient` | core's deep accent `#346a85` → `#333333` |

## Sass variables

`tokens/_brand.scss` holds every raw value as a `!default` variable: the
neutrals (`$white`, `$black`, `$gray-*`), core's accent family (`$accent`,
`$accent-dark`, `$accent-light`, `$accent-link`, `$accent-hover`,
`$visited`), the status hues, the code colours, the font stacks, the
heading setting, radii and shadow colours; and core's tint functions
(`tint-bg`, `tint-soft`, `tint-fg`) plus two for the dark side
(`tint-lit`, `tint-night`). Override with `@use … with (…)`.
`abstracts/_palette.scss` re-exports the few a stylesheet needs to fade
(`$accent`, `$white`, `$ink`, `$night`).

## Shape

Core's scale: `xs` 1px, `sm` 2px, `md`/`default` 4px, `lg` 8px, `xl` 16px,
`2xl` 20px, `3xl` 24px, `full` 9999px.
