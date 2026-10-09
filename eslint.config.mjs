// =============================================================================
// eslint.config.mjs — flat config (ESLint 9+).
// =============================================================================
//
// Scope is JavaScript only: the node:test suite under tst/, the config
// files at the root, and any plain .js/.mjs that ships to a browser (exe/,
// src/). Linting the TypeScript (src/ts/, the stories, .storybook/,
// vite.config.ts) would need typescript-eslint, and the package has no other
// reason to carry it: `npm run typecheck` already runs tsc over all of it in
// strict mode. The SCSS is stylelint's business, not ESLint's.
//
// Real mistakes only. Layout is Prettier's, so eslint-config-prettier goes
// last and turns off every rule that would argue with it.
// =============================================================================

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
    globalIgnores([
        ".vite/",
        "coverage/",
        "dist/",
        "node_modules/",
        "storybook-static/",
        // The source fonts and the logo; nothing in it is ours to lint.
        "res/",
        "Claude outputs/",
    ]),

    {
        files: ["**/*.{js,mjs,cjs}"],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            // Node by default: the tests, and the config files the tools
            // load. The browser side is the block below.
            globals: globals.node,
        },
        rules: {
            "no-var": "error",
            "no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "no-self-compare": "error",
            "no-template-curly-in-string": "warn",
            "no-nested-ternary": "warn",
        },
    },

    {
        // Whatever runs in a page rather than in Node: a demo under exe/,
        // or a plain-JS module under src/. No `process` there.
        files: ["exe/**/*.{js,mjs}", "src/**/*.{js,mjs}"],
        languageOptions: { globals: globals.browser },
    },

    // Must stay last: turns off everything that fights Prettier.
    prettier,
]);
