/* Formatting for new files: 79 columns, 4 spaces.
 *
 *   npm run format         only checks, and is what CI runs
 *   npm run format:check   the same check, spelled out
 *   npm run format:fix     writes the formatting out
 *
 * Bare `format` checking rather than writing is the fleet convention
 * (sturnia-master and the other npm-profile repos): a bare script name
 * never changes files under you, and CI and a clone behave the same.
 *
 * What's excluded from this is in .prettierignore: the files that
 * predate this convention. See there for why.
 */
export default {
    printWidth: 79,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: false,
    quoteProps: "as-needed",
    trailingComma: "all",
    bracketSpacing: true,
    arrowParens: "always",
    endOfLine: "lf",
    overrides: [
        // Machine-managed files keep their own indentation, so that an
        // `npm install` doesn't produce a formatting diff.
        {
            files: ["package.json", "package-lock.json"],
            options: { tabWidth: 2 },
        },
        { files: ["*.md"], options: { proseWrap: "preserve" } },
        /* YAML and JSON are two spaces everywhere, and .cff is YAML:
           .editorconfig already said so, and Prettier was giving it
           the repo-wide four. The two now agree. */
        { files: ["*.{yml,yaml,json,cff}"], options: { tabWidth: 2 } },
    ],
};
