import { rngFromSeed } from "./hash.js";
import { renderPixels } from "./styles/pixels.js";
import { renderGeometric } from "./styles/geometric.js";
import { renderGradient } from "./styles/gradient.js";

export type SeediconStyle = "pixels" | "geometric" | "gradient";

export interface SeediconOptions {
  /**
   * Anything: a wallet address, a UUID, a user ID, an email — whatever you
   * already use to uniquely identify the user. The same seed always
   * produces the exact same avatar.
   */
  seed: string;
  /** Visual style. Defaults to "pixels" (the classic blockies look). */
  style?: SeediconStyle;
  /** Output width/height in SVG user units. Defaults to 64. */
  size?: number;
  /** Rounds the corners of the whole avatar. Defaults to 0 (square/circle
   * per style — geometric is already circular via its own clip path). */
  radius?: number;
}

const RENDERERS: Record<SeediconStyle, (rng: ReturnType<typeof rngFromSeed>, size: number) => string> = {
  pixels: renderPixels,
  geometric: renderGeometric,
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
  const { seed, style = "pixels", size = 64, radius = 0 } = options;
  if (!seed) {
    throw new Error("seedicon: `seed` must be a non-empty string");
  }

  const rng = rngFromSeed(seed);
  const render = RENDERERS[style];
  if (!render) {
    throw new Error(
      `seedicon: unknown style "${style}". Expected one of: ${Object.keys(RENDERERS).join(", ")}`,
    );
  }

  const body = render(rng, size);
  const clip =
    radius > 0
      ? `<defs><clipPath id="seedicon-radius"><rect width="${size}" height="${size}" rx="${radius}"/></clipPath></defs><g clip-path="url(#seedicon-radius)">${body}</g>`
      : body;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Avatar">${clip}</svg>`;
}

/**
 * Same as {@link generateAvatar}, but returns a `data:image/svg+xml`
 * URI — handy for `<img src>`, CSS `background-image`, or storing
 * directly in a database column instead of the raw markup.
 */
export function generateAvatarDataUri(options: SeediconOptions): string {
  const svg = generateAvatar(options);
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

export const SEEDICON_STYLES: readonly SeediconStyle[] = [
  "pixels",
  "geometric",
  "gradient",
];
