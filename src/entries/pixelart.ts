import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderPixelart } from "../styles/pixelart.js";

/**
 * Single-style entry point: `seedicon/pixelart`.
 *
 * A pixel-art character, after DiceBear's Pixel Art.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { pixelart } from "seedicon/pixelart";
 *
 * const svg = pixelart({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function pixelart(options: StyleOptions): string {
  return renderAvatar(renderPixelart, "pixelart", options);
}

/** Same as {@link pixelart}, as a `data:image/svg+xml` URI. */
export function pixelartDataUri(options: StyleOptions): string {
  return toDataUri(pixelart(options));
}

export type { StyleOptions };
