import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderMoire } from "../styles/moire.js";

/**
 * Single-style entry point: `seedicon/moire`.
 *
 * Line gratings at close angles, beating against each other.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { moire } from "seedicon/moire";
 *
 * const svg = moire({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function moire(options: StyleOptions): string {
  return renderAvatar(renderMoire, "moire", options);
}

/** Same as {@link moire}, as a `data:image/svg+xml` URI. */
export function moireDataUri(options: StyleOptions): string {
  return toDataUri(moire(options));
}

export type { StyleOptions };
