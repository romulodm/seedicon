import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderRing } from "../styles/ring.js";

/**
 * Single-style entry point: `seedicon/ring`.
 *
 * Concentric rings in seed-derived colors and thicknesses.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { ring } from "seedicon/ring";
 *
 * const svg = ring({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function ring(options: StyleOptions): string {
  return renderAvatar(renderRing, "ring", options);
}

/** Same as {@link ring}, as a `data:image/svg+xml` URI. */
export function ringDataUri(options: StyleOptions): string {
  return toDataUri(ring(options));
}

export type { StyleOptions };
