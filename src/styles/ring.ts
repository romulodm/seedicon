import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Concentric-rings style, inspired by Boring Avatars' "Ring" theme: a
 * stack of filled circles of decreasing radius, each in its own color,
 * over a flat background.
 *
 * Why this holds up across seeds: the composition is fixed (always
 * concentric, always largest-to-smallest), so the seed only picks colors,
 * ring count and ring thickness. That is a far narrower space than
 * "scatter N shapes anywhere", which is the failure mode of free-form
 * generative avatars — they look great on the seed you designed against
 * and like a rendering bug on the next one.
 */
export function renderRing(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 4);
  const outerRadius = size / 2;

  // A small off-center drift keeps the result from reading as a generic
  // dartboard, but it's deliberately capped at 5% of the canvas: past
  // that the inner dot starts falling out of the visual center and the
  // avatar looks misaligned rather than designed.
  const drift = size * 0.05;
  const cx = size / 2 + rng.int(-drift, drift);
  const cy = size / 2 + rng.int(-drift, drift);

  // 3 to 5 rings. Fewer reads as a plain circle; more turns into thin
  // stripes that alias badly at avatar sizes (16-40px is the common case).
  const ringCount = rng.int(3, 6);

  const circles: string[] = [];
  let radius = outerRadius;

  for (let i = 0; i < ringCount; i++) {
    // `?? background` is unreachable in practice (generatePalette always
    // returns exactly the count we asked for) — it's here so the module
    // type-checks under noUncheckedIndexedAccess without a cast.
    const color = palette.colors[i % palette.colors.length] ?? palette.background;

    circles.push(
      `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(radius)}" fill="${color}"/>`,
    );

    // Each ring eats 16-32% of the full radius, so ring widths vary per
    // seed while every ring stays thick enough to be readable when the
    // avatar is rendered small.
    radius -= outerRadius * (0.16 + rng.next() * 0.16);

    // Anything smaller than this would render as a speck, so stop early
    // and let the previous circle be the center dot.
    if (radius < outerRadius * 0.12) break;
  }

  return [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    ...circles,
  ].join("");
}

/**
 * Trims float noise out of the markup. Two decimals is well below one
 * device pixel at any realistic avatar size, and it keeps the output
 * byte-for-byte stable across platforms (float-to-string formatting is
 * consistent in JS, but shorter strings are cheaper to ship and diff).
 */
function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
