import {
  renderAvatar,
  toDataUri,
  type SeediconShape,
  type StyleOptions,
  type StyleRenderer,
} from "./core.js";
import { renderPixels } from "./styles/pixels.js";
import { renderIdenticon } from "./styles/identicon.js";
import { renderJdenticon } from "./styles/jdenticon.js";
import { renderStellar } from "./styles/stellar.js";
import { renderRandomart } from "./styles/randomart.js";
import { renderLifehash } from "./styles/lifehash.js";
import { renderDither } from "./styles/dither.js";
import { renderPixelart } from "./styles/pixelart.js";
import { renderTruchet } from "./styles/truchet.js";
import { renderHeraldry } from "./styles/heraldry.js";
import { renderKaleidoscope } from "./styles/kaleidoscope.js";
import { renderStreamlines } from "./styles/streamlines.js";
import { renderMoire } from "./styles/moire.js";
import { renderTerrain } from "./styles/terrain.js";
import { renderMarble } from "./styles/marble.js";
import { renderWaves } from "./styles/waves.js";
import { renderGradient } from "./styles/gradient.js";
import { renderRing } from "./styles/ring.js";

/** Every style this package documents, tests and maintains. */
export type SeediconStyle =
  | "pixels"
  | "identicon"
  | "jdenticon"
  | "stellar"
  | "randomart"
  | "lifehash"
  | "dither"
  | "pixelart"
  | "truchet"
  | "heraldry"
  | "kaleidoscope"
  | "streamlines"
  | "moire"
  | "terrain"
  | "marble"
  | "waves"
  | "gradient";

/**
 * Styles that still resolve but are no longer supported.
 *
 * @deprecated `ring` is kept only so that code written against an earlier
 * version keeps working: it renders exactly what it always did and it always
 * will. It is not in {@link SEEDICON_STYLES}, not in the docs, and not part
 * of what this package is maintained for. `braid` is the closest
 * replacement.
 */
export type SeediconLegacyStyle = "ring";

export interface SeediconOptions extends StyleOptions {
  /**
   * Visual style. Defaults to "pixels", which is output-compatible with
   * the `blockies` library — the same seed gives the same image, so you
   * can migrate an app off blockies without changing anyone's avatar.
   */
  style?: SeediconStyle | SeediconLegacyStyle;
}

const RENDERERS: Record<SeediconStyle | SeediconLegacyStyle, StyleRenderer> = {
  pixels: renderPixels,
  identicon: renderIdenticon,
  jdenticon: renderJdenticon,
  stellar: renderStellar,
  randomart: renderRandomart,
  lifehash: renderLifehash,
  dither: renderDither,
  pixelart: renderPixelart,
  truchet: renderTruchet,
  heraldry: renderHeraldry,
  kaleidoscope: renderKaleidoscope,
  streamlines: renderStreamlines,
  moire: renderMoire,
  terrain: renderTerrain,
  marble: renderMarble,
  waves: renderWaves,
  gradient: renderGradient,
  ring: renderRing,
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
    // Only the supported styles are listed. A caller who lands here with a
    // typo should be pointed at what to use, not at what is on its way out.
    throw new Error(
      `seedicon: unknown style "${style}". Expected one of: ${SEEDICON_STYLES.join(", ")}`,
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

/** Every corner preset `shape` accepts, in the order the docs list them. */
export const SEEDICON_SHAPES: readonly SeediconShape[] = [
  "square",
  "rounded",
  "circle",
];

/**
 * Every supported style, in the order the docs and the gallery show them:
 * bit grids first, then the sprite style, then the geometric ones, then
 * line work, then the soft ones.
 *
 * Deprecated styles are deliberately absent. Anything that builds a style
 * picker, a gallery or a test matrix from this list gets the supported set
 * and nothing else.
 */
export const SEEDICON_STYLES: readonly SeediconStyle[] = [
  "pixels",
  "identicon",
  "jdenticon",
  "stellar",
  "randomart",
  "lifehash",
  "dither",
  "pixelart",
  "truchet",
  "heraldry",
  "kaleidoscope",
  "streamlines",
  "moire",
  "terrain",
  "marble",
  "waves",
  "gradient",
];

export type { SeediconShape, StyleOptions, StyleRenderer } from "./core.js";
