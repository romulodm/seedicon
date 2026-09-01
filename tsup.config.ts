import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react.tsx",
    // One entry per style, so `seedicon/<style>` pulls in only that
    // renderer plus the shared core instead of all nine.
    pixels: "src/entries/pixels.ts",
    identicon: "src/entries/identicon.ts",
    jdenticon: "src/entries/jdenticon.ts",
    stellar: "src/entries/stellar.ts",
    ring: "src/entries/ring.ts",
    lifehash: "src/entries/lifehash.ts",
    marble: "src/entries/marble.ts",
    waves: "src/entries/waves.ts",
    gradient: "src/entries/gradient.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react"],
});
