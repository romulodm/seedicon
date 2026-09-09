import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderKaleidoscope } from "../styles/kaleidoscope.js";

/**
 * Single-style entry point: `seedicon/kaleidoscope`.
 *
 * Shapes folded around a center with N-fold symmetry.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { kaleidoscope } from "seedicon/kaleidoscope";
 *
 * const svg = kaleidoscope({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function kaleidoscope(options: StyleOptions): string {
  return renderAvatar(renderKaleidoscope, "kaleidoscope", options);
}

/** Same as {@link kaleidoscope}, as a `data:image/svg+xml` URI. */
export function kaleidoscopeDataUri(options: StyleOptions): string {
  return toDataUri(kaleidoscope(options));
}

export type { StyleOptions };
