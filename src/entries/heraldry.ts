import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderHeraldry } from "../styles/heraldry.js";

/**
 * Single-style entry point: `seedicon/heraldry`.
 *
 * A division of the field with a charge over it.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { heraldry } from "seedicon/heraldry";
 *
 * const svg = heraldry({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function heraldry(options: StyleOptions): string {
  return renderAvatar(renderHeraldry, "heraldry", options);
}

/** Same as {@link heraldry}, as a `data:image/svg+xml` URI. */
export function heraldryDataUri(options: StyleOptions): string {
  return toDataUri(heraldry(options));
}

export type { StyleOptions };
