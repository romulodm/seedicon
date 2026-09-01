import { renderAvatar, toDataUri, type StyleOptions, type StyleRenderer } from "./core.js";
import { renderPixels } from "./styles/pixels.js";
import { renderRing } from "./styles/ring.js";
import { renderMarble } from "./styles/marble.js";
import { renderGradient } from "./styles/gradient.js";
import { renderIdenticon } from "./styles/identicon.js";
import { renderJdenticon } from "./styles/jdenticon.js";
import { renderLifehash } from "./styles/lifehash.js";
import { renderStellar } from "./styles/stellar.js";
import { renderWaves } from "./styles/waves.js";

export type SeediconStyle =
  | "pixels"
  | "identicon"
  | "jdenticon"
  | "stellar"
  | "ring"
  | "lifehash"
  | "marble"
  | "waves"
  | "gradient";

export interface SeediconOptions extends StyleOptions {
  /**
   * Visual style. Defaults to "pixels", which is output-compatible with
   * the `blockies` library — the same seed gives the same image, so you
   * can migrate an app off blockies without changing anyone's avatar.
   */
  style?: SeediconStyle;
}

const RENDERERS: Record<SeediconStyle, StyleRenderer> = {
  pixels: renderPixels,
  identicon: renderIdenticon,
  jdenticon: renderJdenticon,
  stellar: renderStellar,
  ring: renderRing,
  lifehash: renderLifehash,
  marble: renderMarble,
  waves: renderWaves,
  gradient: renderGradient,
};

/**
 * Generates a deterministic SVG avatar from a seed string. Same seed,
 * same style, same size -> byte-for-byte identical output, every time,
 * on every platform. No network calls, no randomness, nothing to store
 * except the seed you already have.
 *
 * @returns Raw `<svg>...</svg>` markup, ready to inject into the DOM
 * (`dangerouslySetInnerHTML` in React, `innerHTML` elsewhere) or save to
 * a `.svg` file.
 */
export function generateAvatar(options: SeediconOptions): string {
  const { style = "pixels", ...rest } = options;

  const render = RENDERERS[style];
  if (!render) {
    throw new Error(
      `seedicon: unknown style "${style}". Expected one of: ${Object.keys(RENDERERS).join(", ")}`,
    );
  }

  return renderAvatar(render, style, rest);
}

/**
 * Same as {@link generateAvatar}, but returns a `data:image/svg+xml`
 * URI — handy for `<img src>`, CSS `background-image`, or storing
 * directly in a database column instead of the raw markup.
 */
export function generateAvatarDataUri(options: SeediconOptions): string {
  return toDataUri(generateAvatar(options));
}

export const SEEDICON_STYLES: readonly SeediconStyle[] = [
  "pixels",
  "identicon",
  "jdenticon",
  "stellar",
  "ring",
  "lifehash",
  "marble",
  "waves",
  "gradient",
];

export type { StyleOptions, StyleRenderer } from "./core.js";
