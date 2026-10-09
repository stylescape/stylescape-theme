// =============================================================================
// stylelint.config.mjs — the consumer-facing contract
// =============================================================================
//
// Exported as `stylescape_npm/stylelint` so a site built on this theme (or
// on a brand theme copied from it) can extend it and have the one rule that
// matters enforced in its own stylesheets: brand colour belongs in THE
// THEME, referenced through `var(--ss-*)` or `var(--theme-*)`. A hex in a
// consumer's SCSS is a value that will not follow a `data-theme="dark"`
// band, and on a dark hero that means text that disappears.
//
//     // stylelint.config.mjs
//     import theme from "stylescape_npm/stylelint";
//     export default { ...theme, ignoreFiles: [...] };
//
// A brand theme copied from this template renames `--theme-` below to its
// own prefix (`--mesmera-`, `--geoid-`, …).
//
// This package does NOT lint itself with this config, and cannot: its token
// files are made of the literals the rule forbids, which is exactly what a
// token file is for. `npm run lint` here is ESLint over the JavaScript.
// =============================================================================

export default {
    rules: {
        "color-no-hex": [
            true,
            {
                message:
                    "Use a --ss-* or --theme-* token instead of a literal " +
                    "colour (stylescape-theme).",
            },
        ],
        "declaration-property-value-disallowed-list": {
            // A fallback inside a `var()` is fine; a bare literal is not.
            "/^(color|background-color|border-color)$/": [
                "/^(rgb|hsl|oklch)\\(/",
                "/^(red|blue|green|black|white)$/",
            ],
        },
        // Custom properties in consumer code namespace under the consumer's
        // own prefix rather than colonise the design system's. This has to
        // be `property-disallowed-list`, which checks DECLARATIONS only: the
        // obvious `custom-property-pattern` also flags `var(--ss-*)`
        // references (stylelint >= 17), and referencing the tokens is
        // exactly what a consumer is supposed to do.
        "property-disallowed-list": [
            ["/^--ss-/", "/^--theme-/"],
            {
                message:
                    "--ss-* and --theme-* are owned by the theme; declare " +
                    "your own tokens under your own prefix (referencing " +
                    "them with var() is fine).",
            },
        ],
    },
};
