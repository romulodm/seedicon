import { hashString, rngFromSeed, type Rng } from "./hash.js";

/**
 * The parts of avatar generation that every style shares: option
 * validation, the seeded PRNG, the `<svg>` wrapper and the corner clip.
 *
 * This module deliberately knows nothing about which styles exist. That
 * is what makes `seedicon/<style>` entry points possible: importing one
 * style pulls in this file and that style's renderer, and nothing else.
 * The moment a registry of all styles lived here, every import would
 * drag in all nine.
 */

/** Options accepted by a single-style entry point. */
export interface StyleOptions {
  /**
   * Anything: a wallet address, a UUID, a user ID, an email — whatever
   * you already use to uniquely identify the user. The same seed always
   * produces the exact same avatar.
   */
  seed: string;
  /** Output width/height in SVG user units. Defaults to 64. */
  size?: number;
  /**
   * Rounds the corners of the whole avatar, in the same units as `size`.
   * Defaults to 0 (a plain square). Use `size / 2` for a circle, or
   * something like `size * 0.2` for the rounded-square look most apps
   * use for profile pictures.
   */
  radius?: number;
}

/**
 * Every style gets the seeded PRNG, the output size, and the raw seed
 * string. Most styles only need the PRNG; the ported ones (`pixels`,
 * `jdenticon`, `stellar`) need the raw seed because they seed their own
 * generator from the characters directly.
 */
export type StyleRenderer = (rng: Rng, size: number, seed: string) => string;

/**
 * Renders one style to complete `<svg>` markup.
 *
 * `styleName` only feeds the clip-path id. It matters because SVG ids
 * share one namespace across the whole document: two avatars on a page
 * that resolved to the same id would both use whichever definition came
 * first, cropping one of them to the other's size.
 */
export function renderAvatar(
  render: StyleRenderer,
  styleName: string,
  options: StyleOptions,
): string {
  const { seed, size = 64, radius = 0 } = options;
  if (!seed) {
    throw new Error("seedicon: `seed` must be a non-empty string");
  }

  const body = render(rngFromSeed(seed), size, seed);

  const clipId = `seedicon-radius-${hashString(`${seed}|${styleName}|${size}|${radius}`).toString(36)}`;

  const clip =
    radius > 0
      ? `<defs><clipPath id="${clipId}"><rect width="${size}" height="${size}" rx="${radius}"/></clipPath></defs><g clip-path="url(#${clipId})">${body}</g>`
      : body;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Avatar">${clip}</svg>`;
}

/** Wraps SVG markup in a `data:image/svg+xml` URI. */
export function toDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}
