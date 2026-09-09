import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderStreamlines } from "../styles/streamlines.js";

/**
 * Single-style entry point: `seedicon/streamlines`.
 *
 * Particles combed through a seeded vector field.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { streamlines } from "seedicon/streamlines";
 *
 * const svg = streamlines({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function streamlines(options: StyleOptions): string {
  return renderAvatar(renderStreamlines, "streamlines", options);
}

/** Same as {@link streamlines}, as a `data:image/svg+xml` URI. */
export function streamlinesDataUri(options: StyleOptions): string {
  return toDataUri(streamlines(options));
}

export type { StyleOptions };
