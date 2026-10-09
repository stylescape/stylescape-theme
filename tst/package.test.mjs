// =============================================================================
// tst/package — the published surface
// =============================================================================
//
// An `exports` entry pointing at a file that isn't there fails only for the
// consumer, at install time, in a repo that isn't this one.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const exists = (path) => existsSync(fileURLToPath(new URL(path, root)));

/** Every concrete (non-pattern) target in the exports map. */
function targets(node, out = []) {
    if (typeof node === "string") {
        if (!node.includes("*")) out.push(node);
    } else if (node && typeof node === "object") {
        for (const v of Object.values(node)) targets(v, out);
    }
    return out;
}

test("every export resolves to a file on disk", () => {
    for (const target of new Set(targets(pkg.exports))) {
        // dist/ is build output; it is listed in `files` but not committed.
        if (target.startsWith("./dist/")) continue;
        assert.ok(exists(target), `exports → ${target} does not exist`);
    }
});

test("the version matches VERSION, CITATION.cff and codemeta.json", () => {
    const read = (p) => readFileSync(new URL(p, root), "utf8");
    assert.equal(pkg.version, read("VERSION").trim());
    assert.match(
        read("CITATION.cff"),
        new RegExp(`^version: ${pkg.version}$`, "m"),
    );
    assert.equal(JSON.parse(read("codemeta.json")).version, pkg.version);
});

test("the exported stylelint config guards the theme's namespaces", async () => {
    const { default: config } = await import("../stylelint.config.mjs");

    assert.ok(config.rules["color-no-hex"], "a hex in consumer code");
    const [names] = config.rules["property-disallowed-list"];
    assert.deepEqual(names, ["/^--ss-/", "/^--theme-/"]);
});

test("the self-hosted fonts resolve, ship, and carry their licences", () => {
    // `fonts.css` is plain CSS with relative url()s: a renamed woff2 is a
    // 404 in the consumer's network tab and nothing at all here. The
    // template declares no face yet; a brand theme's first one is held to
    // the same rules from the moment it is added.
    const css = readFileSync(new URL("src/font/fonts.css", root), "utf8");
    const body = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const urls = [...body.matchAll(/url\("\.\/([^"]+)"\)/g)].map((m) => m[1]);
    for (const url of urls) {
        assert.ok(exists(`src/font/${url}`), `fonts.css -> ${url} is missing`);
        const dir = url.split("/")[0];
        assert.ok(
            ["OFL.txt", "LICENSE.txt"].some((l) =>
                exists(`src/font/${dir}/${l}`),
            ),
            `src/font/${dir}/ has no licence file`,
        );
    }

    assert.ok(pkg.exports["./font/*"], "consumers import ./font/fonts.css");
    assert.ok(
        pkg.files.some((f) => f.startsWith("src/font/")),
        "the font files have to be in the tarball",
    );
});

test("the preload list names files that exist", () => {
    const scss = readFileSync(
        new URL("src/scss/base/_fonts.scss", root),
        "utf8",
    );
    const list = scss.match(/^\$preload: \(([^)]*)\)/m)[1];
    for (const [, file] of list.matchAll(/"([^"]+)"/g)) {
        assert.ok(exists(`src/font/${file}`), `$preload -> ${file}`);
    }
});
