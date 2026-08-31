import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Minimal, modern style: a soft diagonal gradient (2-3 stops) at an angle
 * derived from the seed. No shapes, no grid — closest to what you'd get
 * from a design tool's "random gradient" button, but reproducible.
 */
export function renderGradient(rng: Rng, size: number): string {
  const palette = generatePalette(rng, rng.next() > 0.5 ? 3 : 2);
  const angle = rng.int(0, 360);
  const gradientId = `seedicon-gradient-${rng.int(0, 1_000_000)}`;

  // Convert an angle to SVG gradient coordinates (x1,y1)-(x2,y2) on the
  // unit square, so the gradient direction matches the seed's angle.
  const rad = (angle * Math.PI) / 180;
  const x2 = (Math.cos(rad) + 1) / 2;
  const y2 = (Math.sin(rad) + 1) / 2;
  const x1 = 1 - x2;
  const y1 = 1 - y2;

  const stops = palette.colors
    .map((color, i) => {
      const offset = (i / (palette.colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}"/>`;
    })
    .join("");

  return [
    `<defs><linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs>`,
    `<rect width="${size}" height="${size}" fill="url(#${gradientId})"/>`,
  ].join("");
}
