import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderGradient } from "../styles/gradient.js";

/**
 * Single-style entry point: `seedicon/gradient`.
 *
 * A soft two or three stop diagonal gradient.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { gradient } from "seedicon/gradient";
 *
 * const svg = gradient({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function gradient(options: StyleOptions): string {
  return renderAvatar(renderGradient, "gradient", options);
}

/** Same as {@link gradient}, as a `data:image/svg+xml` URI. */
export function gradientDataUri(options: StyleOptions): string {
  return toDataUri(gradient(options));
}

export type { StyleOptions };
