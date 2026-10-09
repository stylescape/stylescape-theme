// =============================================================================
// tst/theme — the token contract
// =============================================================================
//
// Four things can break silently in a token theme, and each has a test here:
//
//   1. A theme block that never wins. The dark values have to reach any
//      element stamped `data-theme="dark"`, not only <html>, or a dark hero
//      band inside a light page paints with light tokens.
//   2. A one-sided token. A colour set in light and never in dark leaks the
//      light value into every dark band.
//   3. Unreadable text. Every colour pair text is set in is checked against
//      WCAG AA on the page, the surface AND the fill, rather than eyeballed.
//   4. The brand's own values being themed. A mark does not change colour
//      when the page goes dark.
//
// ONE TEMPLATE EXCEPTION: core's default light palette does not clear AA
// for its accent, link and status hues on white (the steel blue `#3696c1`
// is 3.4:1). The template mirrors core, so the light AA checks run as
// `todo`: they report, they do not fail. A brand theme copied from here
// removes `LIGHT_TODO` and must pass them, as stylescape-mesmera does.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { compile, declarationsIn, contrast } from "./helpers.mjs";

const DARK = '[data-theme="dark"]';

/** Delete in a brand theme: the light set has to clear AA there. */
const LIGHT_TODO =
    "core's default palette, mirrored by the template, is under AA here";

/** Every token that carries real text and therefore has to clear AA. */
const TEXT_TOKENS = [
    "--ss-color-foreground",
    "--ss-color-text",
    "--ss-color-text-secondary",
    "--ss-color-text-muted",
    "--ss-color-accent",
    "--ss-color-link",
    "--ss-color-success",
    "--ss-color-warning",
    "--ss-color-error",
    "--ss-color-info",
];

/** The grounds text actually lands on: page, panel, and a control. */
const GROUNDS = [
    "--ss-color-background",
    "--ss-color-surface",
    "--ss-color-surface-alt",
    "--ss-color-fill",
];

test("tokens/ emits the light set, the default, unlayered at :root", () => {
    const css = compile("tokens/_index.scss");
    const root = declarationsIn(css, ":root");

    assert.equal(root["--ss-color-background"], "#ffffff");
    assert.equal(root["--ss-color-accent"], "#3696c1");
    assert.equal(root["--theme-accent"], root["--ss-color-accent"]);

    // Emitted unlayered: a token inside `@layer` cannot override core's
    // unlayered defaults.
    assert.doesNotMatch(css, /@layer/, "tokens must not be in a layer");
});

test("tokens/ sets every font family the theme reads", () => {
    const root = declarationsIn(compile("tokens/_index.scss"), ":root");
    for (const name of [
        "--ss-font-family-base",
        "--ss-font-family-sans",
        "--ss-font-family-heading",
        "--ss-font-family-display",
        "--ss-font-family-mono",
    ]) {
        assert.match(root[name] ?? "", /(sans-serif|monospace)$/, name);
    }
});

test("themes/ applies the dark set to ANY stamped element", () => {
    const css = compile("themes/_index.scss");
    const dark = declarationsIn(css, DARK);

    assert.equal(dark["color-scheme"], "dark");
    assert.equal(dark["--ss-color-background"], "#111111");
    assert.equal(dark["--ss-color-text"], "#f2f2f2");

    // Not `:root[data-theme=dark]`: a <section data-theme="dark"> has to
    // flip too. And no media query: the default page is light whatever the
    // OS prefers.
    assert.doesNotMatch(css, /:root\[data-theme/);
    assert.doesNotMatch(css, /prefers-color-scheme/);
});

test("every dark colour token has a light counterpart, and vice versa", () => {
    const light = declarationsIn(compile("tokens/_index.scss"), ":root");
    const dark = declarationsIn(compile("themes/_index.scss"), DARK);
    const themed = (n) => n.startsWith("--ss-color-");

    for (const name of Object.keys(light).filter(themed)) {
        assert.ok(name in dark, `${name} is set in light but never in dark`);
    }
    for (const name of Object.keys(dark).filter(themed)) {
        assert.ok(name in light, `${name} is set in dark but never in light`);
    }
});

test("white text reads on every stop of the brand gradient", () => {
    // The gradient is drawn under white words (an announcement bar), and
    // on a narrow screen those words reach either end of it.
    const root = declarationsIn(compile("tokens/_index.scss"), ":root");
    const stops = root["--theme-gradient"].match(/#[0-9a-f]{6}/gi);
    assert.ok(stops && stops.length >= 2, root["--theme-gradient"]);
    for (const stop of stops) {
        const ratio = contrast("#ffffff", stop);
        assert.ok(ratio >= 4.5, `white on ${stop} is ${ratio.toFixed(2)}:1`);
    }
});

test("the --theme-* brand values are not themed", () => {
    const dark = declarationsIn(compile("themes/_index.scss"), DARK);
    for (const name of Object.keys(dark)) {
        assert.ok(!name.startsWith("--theme-"), `${name} is themed`);
    }
});

/**
 * Colours as compiled: a hex, or the `rgb(r%, g%, b%)` core's `color.mix()`
 * tints come out as. Both are turned into a hex for `contrast()`.
 */
function hex(value) {
    if (value.startsWith("#")) return value;
    const m = value.match(/^rgb\(([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)%\)$/);
    assert.ok(m, `cannot measure ${value}`);
    return (
        "#" +
        m
            .slice(1, 4)
            .map((p) =>
                Math.round((parseFloat(p) / 100) * 255)
                    .toString(16)
                    .padStart(2, "0"),
            )
            .join("")
    );
}

for (const [label, file, selector, todo] of [
    ["light", "tokens/_index.scss", ":root", LIGHT_TODO],
    ["dark", "themes/_index.scss", DARK, false],
]) {
    test(
        `the ${label} theme meets WCAG AA for text on every ground`,
        { todo },
        () => {
            const t = declarationsIn(compile(file), selector);

            for (const ground of GROUNDS) {
                const bg = t[ground];
                assert.ok(bg, `${label}: ${ground} is not set`);

                for (const name of TEXT_TOKENS) {
                    const ratio = contrast(hex(t[name]), hex(bg));
                    assert.ok(
                        ratio >= 4.5,
                        `${label}: ${name} (${t[name]}) is ` +
                            `${ratio.toFixed(2)}:1 on ${ground} (${bg})`,
                    );
                }
            }
        },
    );

    test(
        `the ${label} theme's on-colours read on their fills`,
        { todo },
        () => {
            const t = declarationsIn(compile(file), selector);
            for (const role of [
                "accent",
                "success",
                "warning",
                "error",
                "info",
            ]) {
                const fill = t[`--ss-color-${role}`];
                const ink = t[`--ss-color-on-${role}`];
                const ratio = contrast(hex(ink), hex(fill));
                assert.ok(
                    ratio >= 4.5,
                    `${label}: on-${role} (${ink}) is ${ratio.toFixed(2)}:1 ` +
                        `on ${role} (${fill})`,
                );
            }
        },
    );

    test(`the ${label} theme's code text reads on the code surface`, () => {
        const t = declarationsIn(compile(file), selector);
        const bg = t["--ss-color-code-bg"];
        for (const name of [
            "--ss-color-code-key",
            "--ss-color-code-foreground",
        ]) {
            const ratio = contrast(hex(t[name]), hex(bg));
            assert.ok(
                ratio >= 4.5,
                `${label}: ${name} is ${ratio.toFixed(2)}:1 on the code bg`,
            );
        }
    });

    test(`the ${label} theme's body text reads on every ground`, () => {
        // Holds even in the template: core's ink on core's grounds.
        const t = declarationsIn(compile(file), selector);
        for (const ground of GROUNDS) {
            for (const name of [
                "--ss-color-text",
                "--ss-color-text-secondary",
                "--ss-color-text-muted",
            ]) {
                const ratio = contrast(hex(t[name]), hex(t[ground]));
                assert.ok(
                    ratio >= 4.5,
                    `${label}: ${name} is ${ratio.toFixed(2)}:1 on ${ground}`,
                );
            }
        }
    });
}
