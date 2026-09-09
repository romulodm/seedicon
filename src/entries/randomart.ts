import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderRandomart } from "../styles/randomart.js";

/**
 * Single-style entry point: `seedicon/randomart`.
 *
 * The drunken bishop from ssh-keygen, drawn as a density map.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { randomart } from "seedicon/randomart";
 *
 * const svg = randomart({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function randomart(options: StyleOptions): string {
  return renderAvatar(renderRandomart, "randomart", options);
}

/** Same as {@link randomart}, as a `data:image/svg+xml` URI. */
export function randomartDataUri(options: StyleOptions): string {
  return toDataUri(randomart(options));
}

export type { StyleOptions };
