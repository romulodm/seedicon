import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Flow field: particles released on a grid and stepped through a vector
 * field, each leaving a polyline behind.
 *
 * The field is a sum of two sines rather than a noise function, which is the
 * whole trick. Perlin or simplex noise would mean shipping a permutation
 * table and a gradient lookup; `sin(fx * x) + cos(fy * y)` costs four
 * numbers, is continuous everywhere, and produces the same swirling,
 * hair-like structure. The seed picks the two frequencies, the two phases
 * and the amplitude.
 *
 * Because every particle in a region reads the same field, neighbouring
 * lines stay roughly parallel and the result always looks combed rather than
 * tangled — there is no seed that produces a scribble.
 *
 * This is the most expensive style in the package in markup terms: 36 lines
 * of 12 segments each. If you are rendering many avatars per page and the
 * HTML size matters, `gradient` or `heraldry` cost a tenth of it.
 */
export function renderStreamlines(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 1);

  // Kept low so the field turns slowly across the canvas. Higher
  // frequencies make the lines curl tightly and the result reads as noise.
  const frequencyX = 0.02 + rng.next() * 0.05;
  const frequencyY = 0.02 + rng.next() * 0.05;
  const phaseX = rng.next() * Math.PI * 2;
  const phaseY = rng.next() * Math.PI * 2;
  const amplitude = 1.4 + rng.next() * 1.6;

  // Frequencies are calibrated against a 100-unit canvas, so the field has
  // to be sampled in that space and the result scaled. Otherwise a 16px
  // avatar and a 256px one would show completely different structures.
  const scale = size / 100;

  const angleAt = (x: number, y: number) =>
    amplitude * (Math.sin(frequencyX * x + phaseX) + Math.cos(frequencyY * y + phaseY));

  const grid = 6;
  const steps = 12;
  const step = 5.2;

  const paths: string[] = [];
  for (let gy = 0; gy < grid; gy++) {
    for (let gx = 0; gx < grid; gx++) {
      let x = (gx + 0.5) * (100 / grid);
      let y = (gy + 0.5) * (100 / grid);
      let d = `M${round(x * scale)} ${round(y * scale)}`;

      for (let k = 0; k < steps; k++) {
        const angle = angleAt(x, y);
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        // Particles are allowed a little way past the edge — the clip in
        // core.ts trims them — but not far enough to waste bytes.
        if (x < -8 || x > 108 || y < -8 || y > 108) break;
        d += `L${round(x * scale)} ${round(y * scale)}`;
      }

      paths.push(d);
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    `<path d="${paths.join("")}" fill="none" stroke="${palette.colors[0]}" stroke-width="${round(size * 0.019)}" stroke-linecap="round"/>`,
  ].join("");
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
