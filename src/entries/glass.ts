import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderGlass } from "../styles/glass.js";

/**
 * Single-style entry point: `seedicon/glass`.
 *
 * Two blurred letterforms over a saturated ground, after DiceBear's Glass.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { glass } from "seedicon/glass";
 *
 * const svg = glass({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function glass(options: StyleOptions): string {
  return renderAvatar(renderGlass, "glass", options);
}

/** Same as {@link glass}, as a `data:image/svg+xml` URI. */
export function glassDataUri(options: StyleOptions): string {
  return toDataUri(glass(options));
}

export type { StyleOptions };
