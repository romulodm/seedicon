import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderRing } from "../styles/ring.js";

/**
 * Single-style entry point: `seedicon/ring`.
 *
 * Concentric rings in seed-derived colors and thicknesses.
 *
 * @deprecated No longer supported. It is kept so that code written against
 * an earlier version keeps resolving and keeps rendering the same avatars —
 * nothing here has changed and nothing will. It is not listed in
 * `SEEDICON_STYLES`, not shown in the docs, and not part of what this
 * package is tested or maintained for. Pick another style for new code;
 * `braid` is the closest replacement in spirit.
 */
export function ring(options: StyleOptions): string {
  return renderAvatar(renderRing, "ring", options);
}

/** Same as {@link ring}, as a `data:image/svg+xml` URI. */
export function ringDataUri(options: StyleOptions): string {
  return toDataUri(ring(options));
}

export type { StyleOptions };
