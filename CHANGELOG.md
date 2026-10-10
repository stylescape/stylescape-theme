# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- The tag-triggered `Publish Package` workflow runs on the Node version in
  `.nvmrc` (it was pinned to Node 18, below `engines.node`, and Vite 8
  could not load), and no longer tries to `npm publish` the private
  template from `dist/`.

## [0.1.1] — 2026-10-10

The first tagged release. It ships the 0.1.0 work below (the Stylescape
theme layout on stylescape 0.5.1, every devDependency at its latest
version) together with the following.

### Added

- **Storybook** (the fleet's shared setup): `.storybook/main.ts` and
  `preview.ts`, `src/stories/theme.stories.ts`, the `storybook` and
  `build-storybook` scripts and their devDependencies (Storybook 10.6,
  `lit`); `storybook-static/` is git-ignored.

### Changed

- Dependabot groups its updates, lists only the ecosystems the repo really
  uses and targets the `dev` branch.

### Fixed

- The Storybook build no longer warns: the obsolete `mixed-decls`
  deprecation silence and the unmatched `src/**/*.mdx` stories glob are
  gone.

## [0.1.0] — 2026-10-09

The repository becomes the brand-neutral starter theme, laid out like
`stylescape-mesmera` and documented as the template a brand theme is
copied from.

### Added

- **The token set.** `tokens/_brand.scss` holds a placeholder palette that
  is stylescape core 0.5.1's own default (neutrals, the steel-blue accent
  family, the green/amber/red/indigo feedback hues darkened to WCAG AA by
  `ink()` — core's `ensure-contrast()` — and core's tint mixes), radii, shadow colours,
  core's font stacks and its heading setting. `tokens/_css-vars.scss` emits
  every `--ss-*` colour, radius, depth and type token core reads, plus
  `--theme-accent`, `--theme-white`, `--theme-paper` and `--theme-gradient`
  as the placeholders for a brand's own values.
- **A dark theme** (`themes/_dark.scss`) under `[data-theme="dark"]` on any
  element and, when the OS prefers dark, `[data-theme="auto"]` — core
  0.5.1's complete dark set, value for value. The light set is also
  emitted on `[data-theme="light"]`, so a light island inside a dark band
  takes the theme's light values.
- **Subpath entries** `./tokens`, `./themes`, `./abstracts` (breakpoints on
  core's scale, `fade()`, the `dark` mixin), `./base` (heading/body/eyebrow
  mixins, `$preload`), `./font/*` (an empty `fonts.css`), `./css`,
  `./stylelint`.
- **Tests** (`node --test`): the template against core's defaults, the token
  contract and WCAG AA in both themes, the root entry over core, the published
  surface. ESLint, Prettier, tsc, a Vite build of `dist/css/ss{,.min}.css`
  and a CI workflow.
- `doc/` (including `doc/template.md`, the copy-a-brand guide), `Makefile`,
  `VERSION`, `codemeta.json`.

### Changed

- `package.json` rebuilt in the fleet's theme shape (exports map, files,
  peer dependencies on `sass` and `stylescape >=0.5.1`; stylescape
  `^0.5.1` and every other devDependency at its latest version, including
  TypeScript 7). The package name,
  `stylescape_npm`, is unchanged.

### Removed

- The npm-example scaffolding: the `sass`/`postcss`/`nodemon`/`sirv`
  scripts and dependencies, the `stylescape ^0.0.34` dependency, and the
  empty `src/js/index.js`.
