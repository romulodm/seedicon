import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderPixels } from "../styles/pixels.js";

/**
 * Single-style entry point: `seedicon/pixels`.
 *
 * Blockies-compatible mirrored pixel grid.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { pixels } from "seedicon/pixels";
 *
 * const svg = pixels({ seed: user.id, size: 40, radius: 20 });
 * ```
 */
export function pixels(options: StyleOptions): string {
  return renderAvatar(renderPixels, "pixels", options);
}

/** Same as {@link pixels}, as a `data:image/svg+xml` URI. */
export function pixelsDataUri(options: StyleOptions): string {
  return toDataUri(pixels(options));
}

export type { StyleOptions };
