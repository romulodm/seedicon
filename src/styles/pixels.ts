import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Classic "blockies"-style identicon: a pixel grid that's mirrored across
 * its vertical axis, so the result always looks like a plausible blob
 * instead of random noise (this is the same trick the original Blockies /
 * GitHub identicon algorithms use).
 */
export function renderPixels(rng: Rng, size: number): string {
  const gridSize = 8; // 8x8 grid, mirrored -> 5 unique columns per row
  const cell = size / gridSize;
  const palette = generatePalette(rng, 2);
  // generatePalette(rng, 2) always returns exactly 2 colors.
  const primary = palette.colors[0] as string;
  const spot = palette.colors[1] as string;

  // Probability weights: mostly background, some primary, a little spot
  // color — this ratio is what makes blockies-style icons look "sparse"
  // rather than like solid noise.
  function pickColor(): string | null {
    const roll = rng.next();
    if (roll < 0.5) return null; // background shows through
    if (roll < 0.85) return primary;
    return spot;
  }

  const halfWidth = Math.ceil(gridSize / 2);
  const rects: string[] = [];

  for (let y = 0; y < gridSize; y++) {
    // Only compute the left half + center column, then mirror it.
    const rowColors: (string | null)[] = [];
    for (let x = 0; x < halfWidth; x++) {
      rowColors.push(pickColor());
    }
    for (let x = 0; x < gridSize; x++) {
      const mirroredX = x < halfWidth ? x : gridSize - 1 - x;
      const color = rowColors[mirroredX];
      if (!color) continue;
      rects.push(
        `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${color}"/>`,
      );
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    ...rects,
  ].join("");
}
