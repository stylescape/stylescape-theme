# Making a brand theme from the template

`stylescape-mesmera` is the reference brand built this way; read it beside
these steps.

1. **Copy the repository** to `stylescape-<brand>` (keep the history if you
   like; the files are what matter).
2. **package.json** — set `name` (a scope the owner org publishes under,
   e.g. `@<org>/stylescape-<brand>`), `description`, `repository`,
   `homepage`, `bugs`, `author`, `license`; delete `"private": true` when
   the package is to be published. Set the version in `VERSION`,
   `CITATION.cff` and `codemeta.json` too (`tst/package.test.mjs` checks
   they agree).
3. **Rename the brand prefix.** Replace `--theme-` with `--<brand>-` in
   `src/scss/tokens/_css-vars.scss`, `stylelint.config.mjs`,
   `tst/package.test.mjs`, `tst/theme.test.mjs` and the docs.
4. **The palette** — edit `src/scss/tokens/_brand.scss` only. Name the
   ramps after the brand (`$indigo-*`, `$ink-*` …), mark each swatch taken
   from the logo `// BRAND`, and say what every derived step is for.
   Then point `_css-vars.scss` and `themes/_dark.scss` at the new names;
   the token names themselves stay core's.
5. **Faces** — put the woff2 files under `src/font/<face>/` with their
   licence (`OFL.txt` or the foundry's terms), declare them in
   `src/font/fonts.css`, put the family first in `$font-sans` /
   `$font-heading`, and list the latin cuts in `$preload`
   (`base/_fonts.scss`). Add a `NOTICE` for third-party faces.
6. **Tests** — delete `tst/defaults.test.mjs` (it holds the template to
   core's values, which a brand no longer has). Remove `LIGHT_TODO` from
   `tst/theme.test.mjs`, so the light theme must clear WCAG AA like the
   dark one, and update the pinned values there and in `tst/core.test.mjs`.
   Add a provenance test (mesmera's `tst/brand.test.mjs` reads the logo).
7. **Docs** — rewrite `README.md`, `CHANGELOG.md` and `doc/` for the brand;
   delete this page.
8. `npm install && npm run check && npm run build`.

## On a site

A site depends on the theme by git tag until the package is published:

```json
"@<org>/stylescape-<brand>": "github:<org>/stylescape-<brand>#semver:^0.1.0"
```

and loads it by its parts, after core if it already loads core:

```scss
@use "pkg:@<org>/stylescape-<brand>/tokens";
@use "pkg:@<org>/stylescape-<brand>/themes";
```

```ts
import "@<org>/stylescape-<brand>/font/fonts.css";
```
