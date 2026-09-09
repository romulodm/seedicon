import { defineConfig } from "tsup";

const STYLES = [
  "pixels",
  "identicon",
  "jdenticon",
  "stellar",
  "randomart",
  "lifehash",
  "dither",
  "pixelart",
  "truchet",
  "heraldry",
  "kaleidoscope",
  "streamlines",
  "moire",
  "terrain",
  "marble",
  "waves",
  "gradient",
  // Deprecated, still built so existing imports of `seedicon/ring` keep
  // resolving. Not exported from the docs, not in SEEDICON_STYLES.
  "ring",
];

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react.tsx",
    // One entry per style, so `seedicon/<style>` pulls in only that
    // renderer plus the shared core instead of all of them.
    ...Object.fromEntries(STYLES.map((s) => [s, `src/entries/${s}.ts`])),
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react"],
});
