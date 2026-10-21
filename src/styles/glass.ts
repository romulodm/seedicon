import type { Rng } from "../hash.js";
import { glassShapes, GLASS_SHAPE_NAMES } from "./glass.sprites.js";

/**
 * Two heavily blurred letterforms over a saturated ground, after DiceBear's
 * Glass. The letterforms are DiceBear's artwork (CC0 1.0). The randomization
 * is seedicon's own: this uses the package's PRNG rather than porting
 * DiceBear's, so the same seed does not give the same picture as
 * `@dicebear/glass` would.
 *
 * The joke in the original is that the shapes are the letters of the word
 * "gradient" — blurred so far past legibility that what is left is only a
 * soft field of light. Nothing about the result depends on which letter was
 * picked; the letters are just eight differently-shaped brushes.
 *
 * Unlike every other style here, the background is not drawn from
 * `generatePalette`. This one needs a mid-tone, saturated ground for the
 * white glow to lift out of — on the near-white or near-black backgrounds
 * that function produces, the effect either washes out or vanishes.
 *
 * One simplification against the original: DiceBear puts the layers in
 * `mix-blend-mode: screen`, which is a no-op for white sources —
 * `screen(1, x)` is 1 for any x, so screening white and then compositing at
 * 60% opacity gives exactly the same pixels as plain alpha at 60% opacity.
 * Dropping the blend mode keeps the output identical and works in the SVG
 * rasterizers that never implemented blend modes.
 */

/** Blur radius on the 100-unit canvas, from DiceBear's filter. */
const BLUR = 16;

export function renderGlass(rng: Rng, size: number): string {
  const hue = rng.int(0, 360);
  // Saturated and just below mid lightness. Lighter and the white glow
  // has nothing to lift out of; darker and the blur reads as gray.
  const background = `hsl(${hue} 76% 54%)`;

  // Ids live in one document-global namespace, so this has to vary with
  // everything that changes the definition. The filter region is in user
  // space, so two sizes of the same seed genuinely need different filters.
  // Same bug class as `marble` and `gradient` — see CONTEXT.md.
  const filterId = `seedicon-glass-blur-${rng.int(0, 1_000_000).toString(36)}-${size}`;

  const layers = [0, 1]
    .map(() => {
      const name = GLASS_SHAPE_NAMES[rng.int(0, GLASS_SHAPE_NAMES.length)] as string;
      const draw = glassShapes[name];
      if (!draw) return "";

      const dx = rng.int(-80, 81);
      const dy = rng.int(-80, 81);
      const angle = rng.int(-180, 181);

      // The letters are authored on a 150-unit grid; the -25 shift is what
      // centers that inside the 100-unit canvas, exactly as the original
      // does.
      return (
        `<g opacity="0.6" filter="url(#${filterId})">` +
        `<g transform="translate(${dx - 25} ${dy - 25}) rotate(${angle} 75 75)">${draw()}</g>` +
        `</g>`
      );
    })
    .join("");

  return [
    `<rect width="${size}" height="${size}" fill="${background}"/>`,
    `<g transform="scale(${size / 100})">`,
    // The region is generous because a Gaussian blur of this radius spreads
    // well past the shape's own box; clipping it would leave a visible hard
    // edge where the glow is cut off.
    `<defs><filter id="${filterId}" x="-60" y="-60" width="220" height="220" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">`,
    `<feGaussianBlur stdDeviation="${BLUR}"/>`,
    `</filter></defs>`,
    layers,
    `</g>`,
  ].join("");
}
