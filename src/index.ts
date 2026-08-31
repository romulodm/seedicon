import { hashString, rngFromSeed } from "./hash.js";
import { renderPixels } from "./styles/pixels.js";
import { renderRing } from "./styles/ring.js";
import { renderMarble } from "./styles/marble.js";
import { renderGradient } from "./styles/gradient.js";

export type SeediconStyle = "pixels" | "ring" | "marble" | "gradient";

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
  /**
   * Rounds the corners of the whole avatar, in the same units as `size`.
   * Defaults to 0 (a plain square). Use `size / 2` for a circle, or
   * something like `size * 0.2` for the rounded-square look most apps
   * use for profile pictures. Every style renders edge-to-edge, so this
   * is the single place cropping is decided.
   */
  radius?: number;
}

const RENDERERS: Record<SeediconStyle, (rng: ReturnType<typeof rngFromSeed>, size: number) => string> = {
  pixels: renderPixels,
  ring: renderRing,
  marble: renderMarble,
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

  // The clip path id has to be unique per avatar, not per package: SVG
  // ids share one global namespace across the whole document, so a fixed
  // id would make every avatar on a page reuse the FIRST one's clip
  // rectangle — a list of 40px avatars under a 24px one would all get
  // cropped to 24px. Deriving the id from the options keeps output
  // deterministic (same input, same id) while making collisions between
  // different avatars impossible in practice.
  const clipId = `seedicon-radius-${hashString(`${seed}|${style}|${size}|${radius}`).toString(36)}`;

  const clip =
    radius > 0
      ? `<defs><clipPath id="${clipId}"><rect width="${size}" height="${size}" rx="${radius}"/></clipPath></defs><g clip-path="url(#${clipId})">${body}</g>`
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
  "ring",
  "marble",
  "gradient",
];
