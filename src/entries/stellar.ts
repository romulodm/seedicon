import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderStellar } from "../styles/stellar.js";

/**
 * Single-style entry point: `seedicon/stellar`.
 *
 * Stellar's 7x7 mirrored bit grid.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { stellar } from "seedicon/stellar";
 *
 * const svg = stellar({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function stellar(options: StyleOptions): string {
  return renderAvatar(renderStellar, "stellar", options);
}

/** Same as {@link stellar}, as a `data:image/svg+xml` URI. */
export function stellarDataUri(options: StyleOptions): string {
  return toDataUri(stellar(options));
}

export type { StyleOptions };
