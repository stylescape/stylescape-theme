// =============================================================================
// tst/defaults — the template IS stylescape core's default palette
// =============================================================================
//
// TEMPLATE-ONLY. The starter theme promises that its placeholder values are
// core's own, so that the package root renders exactly like core and a new
// theme starts from a known point. This compiles core alone and the theme's
// tokens alone and holds every light value the template sets to core's.
//
// A brand theme copied from this repository DELETES this file: its values
// are the brand's, not core's. It replaces it with a provenance test of its
// own (stylescape-mesmera's `tst/brand.test.mjs` holds its BRAND swatches to
// the logo). See doc/template.md.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import {
    compile,
    compileSource,
    declarationsIn,
    resolve,
} from "./helpers.mjs";

const coreCss = compileSource(
    '@use "pkg:stylescape/scss" as core with ($scapepress-parity: false);',
);
// Core 0.5 emits its colour tokens for `:root, [data-theme="light"]` inside
// `@layer ss.lexicon`, and the rest (type, shape, legacy names) at `:root`.
const LIGHT = ':root, [data-theme="light"]';
const core = {
    ...declarationsIn(coreCss, ":root"),
    ...declarationsIn(coreCss, LIGHT),
};
const light = declarationsIn(compile("tokens/_index.scss"), LIGHT);

/** Names the template sets that core does not declare (yet). */
const NOT_IN_CORE = new Set([
    "--ss-color-code-key",
    "--ss-font-family-heading",
    "--ss-font-weight-heading",
    "--ss-tracking-heading",
]);

const compared = Object.keys(light).filter(
    (n) =>
        (n.startsWith("--ss-") || n.startsWith("--color_")) &&
        !NOT_IN_CORE.has(n),
);

test("core still declares the tokens the template mirrors", () => {
    assert.ok(compared.length > 80, `only ${compared.length} compared`);
    for (const name of compared) {
        assert.ok(name in core, `${name} is no longer declared by core`);
    }
});

for (const name of compared) {
    test(`${name} is core's default`, () => {
        assert.equal(
            resolve(light, light[name]),
            resolve(core, core[name]),
            `${name}: template ${light[name]} vs core ${core[name]}`,
        );
    });
}

test("the tokens not in core still say what core does", () => {
    // Core sets h1-h6 in the inherited body face, bold, at line-height 1.2.
    assert.equal(
        light["--ss-font-family-heading"],
        light["--ss-font-family-base"],
    );
    assert.equal(light["--ss-font-weight-heading"], "700");
    assert.equal(resolve(core, core["--ss-leading-heading"]), "1.2");
    assert.equal(light["--ss-leading-heading"], "1.2");
});

// Core 0.5 has a complete dark theme; the template's dark set is core's,
// value for value, under both of core's entry points.
const coreDark = declarationsIn(coreCss, '[data-theme="dark"]');
const dark = declarationsIn(
    compile("themes/_index.scss"),
    '[data-theme="dark"]',
);
const darkCompared = Object.keys(coreDark).filter((n) =>
    n.startsWith("--ss-color-"),
);

test("core's dark set is still complete", () => {
    assert.ok(
        darkCompared.length > 60,
        `only ${darkCompared.length} compared`,
    );
});

for (const name of darkCompared) {
    test(`${name} (dark) is core's dark default`, () => {
        assert.equal(
            resolve(dark, dark[name]),
            resolve(coreDark, coreDark[name]),
            `${name}: template ${dark[name]} vs core ${coreDark[name]}`,
        );
    });
}

test("dark color-scheme matches core's", () => {
    assert.equal(dark["color-scheme"], coreDark["color-scheme"]);
});

test("the template sets no color-scheme at the bare :root", () => {
    // Core does not, and one at :root repaints unstyled form controls.
    assert.ok(!("color-scheme" in light));
});
