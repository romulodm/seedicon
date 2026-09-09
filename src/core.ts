import { hashString, rngFromSeed, type Rng } from "./hash.js";

/**
 * The parts of avatar generation that every style shares: option
 * validation, the seeded PRNG, the `<svg>` wrapper and the corner clip.
 *
 * This module deliberately knows nothing about which styles exist. That
 * is what makes `seedicon/<style>` entry points possible: importing one
 * style pulls in this file and that style's renderer, and nothing else.
 * The moment a registry of all styles lived here, every import would
 * drag in all of them.
 */

/**
 * The three corner presets. They are shorthands for a `radius`, nothing
 * more: `square` is 0, `circle` is half the size, and `rounded` is 22% of
 * it, which is roughly what app icons and profile pictures use.
 */
export type SeediconShape = "square" | "rounded" | "circle";

/** Fraction of `size` used by the `rounded` preset. */
const ROUNDED_RATIO = 0.22;

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
   * Corner preset: `"square"` (the default), `"rounded"` for the
   * app-icon look, or `"circle"`. It scales with `size`, so the same
   * shape holds at 16px and at 256px.
   */
  shape?: SeediconShape;
  /**
   * Corner radius in the same units as `size`, for when the three
   * presets are not the exact rounding you want. Takes precedence over
   * `shape` whenever it is passed, and is clamped to `[0, size / 2]` —
   * anything larger would only ever draw a circle anyway.
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
 * Turns `shape` and `radius` into the single number the clip path needs.
 *
 * `radius` wins when both are given: `shape` is the coarse choice a
 * design makes once, `radius` the fine-tuning a specific screen asks
 * for, and silently ignoring the more specific of the two would be the
 * surprising behaviour.
 */
export function resolveRadius(
  size: number,
  shape: SeediconShape = "square",
  radius?: number,
): number {
  const max = size / 2;

  if (radius !== undefined) {
    if (!Number.isFinite(radius)) {
      throw new Error("seedicon: `radius` must be a finite number");
    }
    return Math.min(Math.max(radius, 0), max);
  }

  switch (shape) {
    case "square":
      return 0;
    case "rounded":
      return size * ROUNDED_RATIO;
    case "circle":
      return max;
    default:
      throw new Error(
        `seedicon: unknown shape "${shape}". Expected one of: square, rounded, circle`,
      );
  }
}

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
  const { seed, size = 64, shape, radius } = options;
  if (!seed) {
    throw new Error("seedicon: `seed` must be a non-empty string");
  }

  const corner = resolveRadius(size, shape, radius);
  const body = render(rngFromSeed(seed), size, seed);

  const clipId = `seedicon-radius-${hashString(`${seed}|${styleName}|${size}|${corner}`).toString(36)}`;

  const clip =
    corner > 0
      ? `<defs><clipPath id="${clipId}"><rect width="${size}" height="${size}" rx="${corner}"/></clipPath></defs><g clip-path="url(#${clipId})">${body}</g>`
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
