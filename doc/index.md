# stylescape-theme documentation

The brand-neutral starter theme for Stylescape, and the template every
brand theme is copied from. Start with the [overview](overview.md); to make
a new brand theme, go straight to [template.md](template.md).

| Page                               | What it covers                                                 |
| ---------------------------------- | -------------------------------------------------------------- |
| [overview.md](overview.md)         | what the package is, what ships, why its values are core's     |
| [template.md](template.md)         | copying it into a brand theme, step by step                    |
| [usage.md](usage.md)               | install, the entries, fonts, theming a band, linting, building |
| [tokens.md](tokens.md)             | the custom properties and Sass variables, by namespace         |
| [colors.md](colors.md)             | the placeholder palette, both themes, contrast                 |
| [typography.md](typography.md)     | the stacks, the heading setting, where a brand's faces go      |
| [theming.md](theming.md)           | light by default, the dark theme on a page or a band           |
| [architecture.md](architecture.md) | load order, file map, adding a token, build, tests             |

Two things to keep in mind while reading any of them:

- **Every light value is core's own.** The package root renders exactly
  like stylescape core does without a theme; `tst/defaults.test.mjs` holds
  it to that. The point of the template is the shape, not the values.
- **Light is the default, and dark can be a band.** `data-theme="dark"`
  flips the tokens on whatever element carries it.
