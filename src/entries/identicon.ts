import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderIdenticon } from "../styles/identicon.js";

/**
 * Single-style entry point: `seedicon/identicon`.
 *
 * Five symmetric rows of pixels, DiceBear's Identicon family.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * eight. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { identicon } from "seedicon/identicon";
 *
 * const svg = identicon({ seed: user.id, size: 40, radius: 20 });
 * ```
 */
export function identicon(options: StyleOptions): string {
  return renderAvatar(renderIdenticon, "identicon", options);
}

/** Same as {@link identicon}, as a `data:image/svg+xml` URI. */
export function identiconDataUri(options: StyleOptions): string {
  return toDataUri(identicon(options));
}

export type { StyleOptions };
