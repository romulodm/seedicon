import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderMarble } from "../styles/marble.js";

/**
 * Single-style entry point: `seedicon/marble`.
 *
 * Two soft, blurred organic blobs over a flat color.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { marble } from "seedicon/marble";
 *
 * const svg = marble({ seed: user.id, size: 40, radius: 20 });
 * ```
 */
export function marble(options: StyleOptions): string {
  return renderAvatar(renderMarble, "marble", options);
}

/** Same as {@link marble}, as a `data:image/svg+xml` URI. */
export function marbleDataUri(options: StyleOptions): string {
  return toDataUri(marble(options));
}

export type { StyleOptions };
