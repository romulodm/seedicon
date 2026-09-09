import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderDither } from "../styles/dither.js";

/**
 * Single-style entry point: `seedicon/dither`.
 *
 * A two-tone gradient through a Bayer 4x4 threshold matrix.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { dither } from "seedicon/dither";
 *
 * const svg = dither({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function dither(options: StyleOptions): string {
  return renderAvatar(renderDither, "dither", options);
}

/** Same as {@link dither}, as a `data:image/svg+xml` URI. */
export function ditherDataUri(options: StyleOptions): string {
  return toDataUri(dither(options));
}

export type { StyleOptions };
