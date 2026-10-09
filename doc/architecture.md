# Architecture

## Load order (the root entry)

1. **core** — `pkg:stylescape/scss` with `$scapepress-parity: false`.
   Rules in `@layer ss.*`, token defaults unlayered at `:root`.
2. **tokens** — the light set, unlayered at `:root`, after core: source
   order wins.
3. **themes** — the dark set under `[data-theme="dark"]`.
4. **voices** — the heading tokens on `:where(h1…h6)`; a ground for a
   stamped band.

## File map

```
src/
  font/            fonts.css (empty in the template)
  scss/
    index.scss     the root entry
    abstracts/     breakpoints, palette (fade), theme (dark mixin)
    tokens/        brand (raw values), css-vars (--ss-*, --theme-*)
    themes/        dark
    base/          fonts ($preload), typography (heading, body, eyebrow)
  ts/entries/      core.ts — the Vite library entry for dist/css
tst/               node:test, on the compiled CSS
```

## Adding a colour

Add the raw step to `tokens/_brand.scss` with a comment saying what it is
for. If it is a role core already names, set it in `tokens/_css-vars.scss`
**and** `themes/_dark.scss`; `tst/theme.test.mjs` fails on a one-sided
`--ss-color-*`. If it carries text, add it to `TEXT_TOKENS`.

## Tests

`npm test` compiles each entry with dart-sass and asserts on the output:
the template against core (`defaults`, template-only), the token contract
and contrast (`theme`), the root entry over core (`core`), and the
published surface (`package`).
