import type { SeediconStyle } from "seedicon";

/**
 * What each entry point costs a browser, in bytes, minified and gzipped.
 *
 * Measured against the v0.2.1 build by bundling a one-line consumer per entry
 * with esbuild (`--bundle --minify`) and gzipping the output at level 9: the
 * import plus a single call, so tree shaking has already removed everything
 * it can. The root figure is `generateAvatar` with the style picked at
 * runtime, which is the only way the root entry can be used — it resolves
 * styles by name, so every renderer stays in.
 *
 * These are constants rather than a build step because they only move when a
 * renderer changes. Re-measure when one does. The Record type makes adding a
 * style to SeediconStyle a type error here until its size is filled in.
 *
 * `glass` and the root figure were measured later, against the build that
 * added `glass`, with the same method.
 */
export const ROOT_BYTES = 14286;

export const STYLE_BYTES: Record<SeediconStyle, number> = {
  pixels: 1263,
  identicon: 1233,
  jdenticon: 3038,
  stellar: 2054,
  randomart: 1856,
  lifehash: 1507,
  dither: 1344,
  // The sprite sheets it draws from ship with it: data, not code, but bytes.
  pixelart: 5704,
  truchet: 1252,
  heraldry: 1720,
  kaleidoscope: 1438,
  streamlines: 1352,
  moire: 1290,
  terrain: 1194,
  marble: 1483,
  waves: 1165,
  gradient: 1212,
  // Carries the eight letterform paths it blurs, like pixelart's sprites.
  glass: 1910,
};

/** Bytes as kilobytes with one decimal, the way bundle analysers print them. */
export function formatKb(bytes: number): string {
  return `${(bytes / 1000).toFixed(1)} kB`;
}
