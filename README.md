<div align="right">

[![GitHub License](https://img.shields.io/github/license/stylescape/stylescape-theme?style=flat-square&logo=readthedocs&logoColor=FFFFFF&label=&labelColor=%23041B26&color=%23041B26&link=LICENSE)](https://github.com/stylescape/stylescape-theme/blob/main/LICENSE)
[![devContainer](https://img.shields.io/badge/devContainer-23041B26?style=flat-square&logo=Docker&logoColor=%23FFFFFF&labelColor=%23041B26&color=%23041B26)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/stylescape/stylescape-theme)
[![StackBlitz](https://img.shields.io/badge/StackBlitz-23041B26?style=flat-square&logo=StackBlitz&logoColor=%23FFFFFF&labelColor=%23041B26&color=%23041B26)](https://stackblitz.com/github/stylescape/stylescape-theme/tree/main?file=src%2Findex.html)

</div>

<p align="center">
    <img src="https://raw.githubusercontent.com/stylescape/brand/master/src/logo/logo-transparant.png" width="20%" height="20%" alt="Stylescape Logo">
</p>
<h1 align="center" style='border-bottom: none;'>Stylescape Theme</h1>
<h3 align="center">The starter theme</h3>

---

The brand-neutral starter theme for the [Stylescape](https://www.scape.style/)
design system, and **the template every brand theme is copied from**. It
has the full layout of a fleet theme (see `stylescape-mesmera`, the
reference brand) — `--ss-*` token overrides on top of stylescape core, a
dark variant for whole pages or single bands, the Sass tools, the font
plumbing, the tests — with a placeholder palette that is exactly
stylescape core's own defaults. Installed under a site, it changes
nothing; that is the point. Change a value in
`src/scss/tokens/_brand.scss` and you see exactly that change.

To make a brand theme from it, follow [doc/template.md](doc/template.md).

## Install

```sh
npm install -D github:stylescape/stylescape-theme stylescape sass
```

The package name is `stylescape_npm`, kept from the repository's first
life; a theme copied from it takes its own.

## Use

```scss
// The whole thing: stylescape core, the tokens, the dark theme, headings.
@use "pkg:stylescape_npm";

// Or just the tokens and the dark theme, without core:
@use "pkg:stylescape_npm/tokens";
@use "pkg:stylescape_npm/themes";

// The Sass tools, which emit nothing: breakpoints, fade(), dark(), heading().
@use "pkg:stylescape_npm/abstracts" as *;
@use "pkg:stylescape_npm/base" as type;
```

```ts
// The faces, once, as plain CSS (empty in the template).
import "stylescape_npm/font/fonts.css";
```

Light is the default. Stamp `data-theme="dark"` on `<html>` for a dark page,
or on any one element for a dark band inside a light page.

| Entry         | What you get                                                 |
| ------------- | ------------------------------------------------------------ |
| `.`           | core + tokens + dark theme + the heading setting on h1-h6    |
| `./tokens`    | the light token set at `:root`, no core                      |
| `./themes`    | the dark set under `[data-theme="dark"]`                     |
| `./abstracts` | breakpoints, `fade()`, the `dark` mixin, the raw swatches    |
| `./base`      | the `heading`, `body` and `eyebrow` mixins, `$preload`       |
| `./font/*`    | `fonts.css` (and a brand's woff2 files)                      |
| `./css`       | the compiled `dist/css/ss.css` (and `./css/min`)             |
| `./stylelint` | the consumer lint contract: no hex, no `--ss-*` declarations |

## Develop

```sh
make install   # npm ci
make check     # typecheck, ESLint, Prettier, tests
make build     # dist/css/ss{,.min}.css
```

The documentation is in [doc/](doc/index.md).
