import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderJdenticon } from "../styles/jdenticon.js";

/**
 * Single-style entry point: `seedicon/jdenticon`.
 *
 * Jdenticon-compatible geometric shapes on a 4x4 grid.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { jdenticon } from "seedicon/jdenticon";
 *
 * const svg = jdenticon({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function jdenticon(options: StyleOptions): string {
  return renderAvatar(renderJdenticon, "jdenticon", options);
}

/** Same as {@link jdenticon}, as a `data:image/svg+xml` URI. */
export function jdenticonDataUri(options: StyleOptions): string {
  return toDataUri(jdenticon(options));
}

export type { StyleOptions };
