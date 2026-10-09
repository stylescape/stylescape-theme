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
// Core 0.5 darkens its light accent, link and status hues to AA (the steel
// blue `#3696c1`, 3.4:1 on white, becomes `rgb(40 113 146)`), and the
// template mirrors it through `ink()`, so the light AA checks hold here as
// they must in every brand theme copied from it.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { compile, declarationsIn, contrast } from "./helpers.mjs";

const DARK = '[data-theme="dark"]';
const LIGHT = ':root, [data-theme="light"]';

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
    const root = declarationsIn(css, LIGHT);

    assert.equal(root["--ss-color-background"], "#ffffff");
    // The mark keeps the hue as drawn; the accent as text is its AA ink.
    assert.equal(root["--theme-accent"], "#3696c1");
    assert.equal(root["--ss-color-accent"], "rgb(40, 113, 146)");

    // Emitted unlayered: a token inside `@layer` cannot override core's
    // unlayered defaults.
    assert.doesNotMatch(css, /@layer/, "tokens must not be in a layer");
});

test("tokens/ sets every font family the theme reads", () => {
    const root = declarationsIn(compile("tokens/_index.scss"), LIGHT);
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
    // flip too.
    assert.doesNotMatch(css, /:root\[data-theme/);

    // `auto` follows the OS, and only `auto`: a page without the attribute
    // stays light whatever the OS prefers.
    const media = [
        ...css.matchAll(
            /@media[^{]*prefers-color-scheme:\s*dark[^{]*\{([\s\S]*?)\}\s*\}/g,
        ),
    ];
    assert.equal(media.length, 1, "one prefers-color-scheme block");
    assert.match(media[0][1], /^\s*\[data-theme=auto\]\s*\{/);
    const auto = declarationsIn(css, '[data-theme="auto"]');
    assert.deepEqual(auto, dark, "auto (dark OS) is the dark set");
});

test("a light island re-declares the light set on itself", () => {
    // Inside a dark band, an element stamped light must not inherit the dark
    // values: core 0.5 declares its light defaults on `[data-theme=light]`
    // in a layer, so the theme has to as well, unlayered, or core's light
    // values (not the theme's) would paint the island.
    const light = declarationsIn(compile("tokens/_index.scss"), LIGHT);
    assert.equal(light["--ss-color-background"], "#ffffff");
    assert.ok(Object.keys(light).length > 80);
});

test("every dark colour token has a light counterpart, and vice versa", () => {
    const light = declarationsIn(compile("tokens/_index.scss"), LIGHT);
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
    const root = declarationsIn(compile("tokens/_index.scss"), LIGHT);
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
    // `rgb(40, 113, 146)`: an `ink()` colour, snapped to whole channels.
    const n = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (n) {
        return (
            "#" +
            n
                .slice(1, 4)
                .map((c) => Number(c).toString(16).padStart(2, "0"))
                .join("")
        );
    }
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

for (const [label, file, selector] of [
    ["light", "tokens/_index.scss", LIGHT],
    ["dark", "themes/_index.scss", DARK],
]) {
    test(`the ${label} theme meets WCAG AA for text on every ground`, () => {
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
    });

    test(`the ${label} theme's on-colours read on their fills`, () => {
        const t = declarationsIn(compile(file), selector);
        for (const role of ["accent", "success", "warning", "error", "info"]) {
            const fill = t[`--ss-color-${role}`];
            const ink = t[`--ss-color-on-${role}`];
            const ratio = contrast(hex(ink), hex(fill));
            assert.ok(
                ratio >= 4.5,
                `${label}: on-${role} (${ink}) is ${ratio.toFixed(2)}:1 ` +
                    `on ${role} (${fill})`,
            );
        }
    });

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
