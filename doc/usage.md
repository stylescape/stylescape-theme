# Usage

## Install

```sh
npm install -D github:stylescape/stylescape-theme stylescape sass
```

The package name is `stylescape_npm` (kept from the repository's first
life as an npm example); a brand theme copied from it takes its own.

## The entries

| Entry         | Emits                                                 | Needs core |
| ------------- | ----------------------------------------------------- | ---------- |
| `.`           | core, the tokens, the dark theme, the heading setting | yes        |
| `./tokens`    | the light token set at `:root`                        | no         |
| `./themes`    | the dark set under `[data-theme="dark"]`              | no         |
| `./abstracts` | nothing (Sass names only)                             | no         |
| `./base`      | nothing (mixins only)                                 | no         |

```scss
// The whole thing: stylescape core, the tokens, the dark theme, headings.
@use "pkg:stylescape_npm";

// Or just the tokens and the dark theme, without core:
@use "pkg:stylescape_npm/tokens";
@use "pkg:stylescape_npm/themes";

// The Sass tools, which emit nothing.
@use "pkg:stylescape_npm/abstracts" as *;
@use "pkg:stylescape_npm/base" as type;
```

Vite needs the Sass package importer for `pkg:` URLs:

```ts
import { NodePackageImporter } from "sass";
export default {
    css: {
        preprocessorOptions: {
            scss: { importers: [new NodePackageImporter()] },
        },
    },
};
```

## Fonts

```ts
import "stylescape_npm/font/fonts.css";
```

Empty in the template; a brand theme declares its faces there.

## A dark band

```html
<section data-theme="dark">…</section>
```

The package root gives the stamped element the dark ground and text colour;
everything inside reads the dark tokens.

## Linting a consumer

```js
// stylelint.config.mjs
import theme from "stylescape_npm/stylelint";
export default { ...theme };
```

## Building

`npm run build` writes `dist/css/ss.css` and `ss.min.css`, the compiled
root entry, for a consumer without Sass.
