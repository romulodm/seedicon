import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderWaves } from "../styles/waves.js";

/**
 * Single-style entry point: `seedicon/waves`.
 *
 * Layered wave bands in shades of a single hue.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { waves } from "seedicon/waves";
 *
 * const svg = waves({ seed: user.id, size: 40, radius: 20 });
 * ```
 */
export function waves(options: StyleOptions): string {
  return renderAvatar(renderWaves, "waves", options);
}

/** Same as {@link waves}, as a `data:image/svg+xml` URI. */
export function wavesDataUri(options: StyleOptions): string {
  return toDataUri(waves(options));
}

export type { StyleOptions };
