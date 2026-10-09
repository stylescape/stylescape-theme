// =============================================================================
// tst/helpers — compile the theme and read tokens back out of the CSS
// =============================================================================
//
// The tests assert on COMPILED OUTPUT, not on the SCSS source. Asserting on
// source would only restate the file; the thing that can actually break is
// the cascade — a token declared in the wrong block, a light value that never
// wins, an alias pointing at a name nothing emits.
// =============================================================================

import * as sass from "sass";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

/** Compile one of the package's SCSS entries to a CSS string. */
export function compile(entry) {
    return sass.compile(
        fileURLToPath(new URL(`../src/scss/${entry}`, import.meta.url)),
        {
            importers: [new sass.NodePackageImporter(root)],
            loadPaths: [root],
            quietDeps: true,
            silenceDeprecations: ["global-builtin", "if-function", "import"],
        },
    ).css;
}

/**
 * Compile a Sass snippet as though it were a file in `src/scss/`, so `pkg:`
 * URLs resolve against this package's own dependencies. Used to compile
 * stylescape core on its own and compare the theme against it.
 */
export function compileSource(source) {
    return sass.compileString(source, {
        url: new URL("../src/scss/__probe__.scss", import.meta.url),
        importers: [new sass.NodePackageImporter(root)],
        loadPaths: [root],
        quietDeps: true,
        silenceDeprecations: ["global-builtin", "if-function", "import"],
    }).css;
}

/**
 * Follow `var(--name)` references through a token map until a literal is
 * left, so `var(--ss-color-text-primary)` and `#000000` compare equal.
 */
export function resolve(tokens, value, depth = 0) {
    if (value === undefined || depth > 10) return value;
    return value.replace(/var\((--[\w-]+)\)/g, (_, name) =>
        resolve(tokens, tokens[name], depth + 1),
    );
}

/**
 * Sass drops the quotes from attribute selectors, so `[data-theme="light"]` in
 * the source is `[data-theme=light]` in the output. Compare both sides
 * stripped rather than making every caller spell the compiled form.
 */
const normalize = (selector) =>
    selector.replace(/["']/g, "").replace(/\s+/g, " ").trim();

/**
 * Every declaration in rules whose selector matches `selector`, as a
 * `{ property: value }` map — custom properties and plain ones alike, because
 * `color-scheme` is as much part of a theme as any `--ss-*` value. Later
 * declarations win, mirroring the cascade.
 */
export function declarationsIn(css, selector) {
    const want = normalize(selector);

    // Sass emits flat CSS — no rule body contains a brace — so `[^{}]*` cannot
    // cross a brace and the scan re-synchronizes by itself on the `}` that
    // closes an `@media`. At-rule preludes are skipped; their nested rules are
    // matched on their own, which is what lets the same call find a selector
    // whether it sits at the top level or inside a media query.
    const blocks = [...css.matchAll(/([^{}]*)\{([^{}]*)\}/g)]
        .filter(
            (m) =>
                !normalize(m[1]).startsWith("@") && normalize(m[1]) === want,
        )
        .map((m) => m[2]);

    const out = {};
    for (const body of blocks) {
        for (const [, name, value] of body.matchAll(
            /([\w-]+)\s*:\s*([^;]+);/g,
        )) {
            out[name] = value.trim();
        }
    }
    return out;
}

/** sRGB relative luminance, per WCAG 2.x. */
function luminance(hex) {
    const n = hex.replace("#", "");
    const full = n.length === 3 ? [...n].map((c) => c + c).join("") : n;
    const [r, g, b] = [0, 2, 4].map((i) => {
        const c = parseInt(full.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two opaque hex colors. */
export function contrast(a, b) {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
}
