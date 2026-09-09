import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderTruchet } from "../styles/truchet.js";

/**
 * Single-style entry point: `seedicon/truchet`.
 *
 * Quarter-circle tiles that always join into continuous loops.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { truchet } from "seedicon/truchet";
 *
 * const svg = truchet({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function truchet(options: StyleOptions): string {
  return renderAvatar(renderTruchet, "truchet", options);
}

/** Same as {@link truchet}, as a `data:image/svg+xml` URI. */
export function truchetDataUri(options: StyleOptions): string {
  return toDataUri(truchet(options));
}

export type { StyleOptions };
