# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2026-10-09

The repository becomes the brand-neutral starter theme, laid out like
`stylescape-mesmera` and documented as the template a brand theme is
copied from.

### Added

- **The token set.** `tokens/_brand.scss` holds a placeholder palette that
  is stylescape core 0.4's own default (neutrals, the steel-blue accent
  family, the feedback hues and core's tint mixes), radii, shadow colours,
  core's font stacks and its heading setting. `tokens/_css-vars.scss` emits
  every `--ss-*` colour, radius, depth and type token core reads, plus
  `--theme-accent`, `--theme-white`, `--theme-paper` and `--theme-gradient`
  as the placeholders for a brand's own values.
- **A dark theme** (`themes/_dark.scss`) under `[data-theme="dark"]` on any
  element, derived from core's grey ramp and lighter steps of its hues,
  keeping the two values core's own dark override sets.
- **Subpath entries** `./tokens`, `./themes`, `./abstracts` (breakpoints on
  core's scale, `fade()`, the `dark` mixin), `./base` (heading/body/eyebrow
  mixins, `$preload`), `./font/*` (an empty `fonts.css`), `./css`,
  `./stylelint`.
- **Tests** (`node --test`): the template against core's defaults, the token
  contract and WCAG AA (light accent/status checks as `todo`, since core's
  palette is under AA there), the root entry over core, the published
  surface. ESLint, Prettier, tsc, a Vite build of `dist/css/ss{,.min}.css`
  and a CI workflow.
- `doc/` (including `doc/template.md`, the copy-a-brand guide), `Makefile`,
  `VERSION`, `codemeta.json`.

### Changed

- `package.json` rebuilt in the fleet's theme shape (exports map, files,
  peer dependencies on `sass` and `stylescape >=0.4.0`). The package name,
  `stylescape_npm`, is unchanged.

### Removed

- The npm-example scaffolding: the `sass`/`postcss`/`nodemon`/`sirv`
  scripts and dependencies, the `stylescape ^0.0.34` dependency, and the
  empty `src/js/index.js`.
