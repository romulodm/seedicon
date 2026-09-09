import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderLifehash } from "../styles/lifehash.js";

/**
 * Single-style entry point: `seedicon/lifehash`.
 *
 * Organic pattern grown with a Game of Life automaton.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { lifehash } from "seedicon/lifehash";
 *
 * const svg = lifehash({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function lifehash(options: StyleOptions): string {
  return renderAvatar(renderLifehash, "lifehash", options);
}

/** Same as {@link lifehash}, as a `data:image/svg+xml` URI. */
export function lifehashDataUri(options: StyleOptions): string {
  return toDataUri(lifehash(options));
}

export type { StyleOptions };
