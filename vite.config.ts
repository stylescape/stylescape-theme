// =============================================================================
// vite.config.ts — stylescape-theme build
// =============================================================================
//
// This package is consumed primarily as SCSS *source* (see the `exports` map
// in package.json). This Vite build exists only to emit the convenience
// compiled stylesheets:
//
//     dist/css/ss.css       core + theme    `vite build`
//     dist/css/ss.min.css                   `NO_EMPTY=1 MINIFY=1 vite build`
//
// The `build` script runs both passes; only the first may empty `dist/`.
// `src/ts/entries/core.ts` is a side-effect entry that imports the SCSS so
// Vite's library build extracts the CSS bundle.
//
// The theme sits ON TOP of stylescape core, so the Sass NodePackageImporter
// must be registered for `pkg:stylescape/scss` to resolve.
// =============================================================================

import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { NodePackageImporter } from "sass";
import type { DeprecationOrId } from "sass";

/**
 * Core still calls `map-get` and the old `if()`, and loads a couple of files
 * with `@import`. They are its warnings to fix, not this package's.
 */
const SILENCED: DeprecationOrId[] = [
    "global-builtin",
    "if-function",
    "import",
];

export default defineConfig(() => {
    const minify = process.env.MINIFY === "1";

    return {
        // No PostCSS step — keep the build hermetic and skip config-file
        // search. Consumers `@use` the SCSS source and autoprefix in their
        // own pipeline.
        css: {
            postcss: {},
            preprocessorOptions: {
                scss: {
                    importers: [new NodePackageImporter()],
                    quietDeps: true,
                    silenceDeprecations: SILENCED,
                },
            },
        },
        build: {
            outDir: "dist",
            emptyOutDir: process.env.NO_EMPTY !== "1",
            cssMinify: minify,
            lib: {
                entry: fileURLToPath(
                    new URL("./src/ts/entries/core.ts", import.meta.url),
                ),
                formats: ["es" as const],
                fileName: () => "js/stylescape-theme.js",
            },
            rollupOptions: {
                output: {
                    assetFileNames: (asset: {
                        names?: string[];
                        name?: string;
                    }) => {
                        const name = asset.names?.[0] ?? asset.name ?? "";
                        if (name.endsWith(".css")) {
                            return minify ? "css/ss.min.css" : "css/ss.css";
                        }
                        return "assets/[name][extname]";
                    },
                },
            },
        },
    };
});
