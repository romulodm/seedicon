import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Truchet tiles: a grid where every cell draws two quarter-circle arcs, in
 * one of two orientations.
 *
 * The appeal is structural rather than decorative. Both orientations put an
 * arc endpoint at the midpoint of all four cell edges, so whatever a cell's
 * neighbours chose, the curves meet — the result is always one or more
 * continuous loops wandering the tile, never a loose end. That means the
 * seed contributes exactly one bit per cell and cannot produce a broken
 * composition, which is the property `geometric` lacked.
 */
export function renderTruchet(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 1);

  // 4 to 6 cells across. Fewer reads as a single scribble; more thins the
  // stroke past what survives at 24px, where most avatars are rendered.
  const cells = rng.int(4, 7);
  const cell = size / cells;

  // A third of the cell. Thinner and the loops break up at small sizes,
  // thicker and adjacent arcs merge into a solid mass.
  const stroke = cell * 0.34;
  const radius = cell / 2;

  const arcs: string[] = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const ox = x * cell;
      const oy = y * cell;

      if (rng.next() > 0.5) {
        // Top-left and bottom-right corners.
        arcs.push(
          `M${round(ox)} ${round(oy + radius)}A${round(radius)} ${round(radius)} 0 0 1 ${round(ox + radius)} ${round(oy)}`,
          `M${round(ox + cell)} ${round(oy + radius)}A${round(radius)} ${round(radius)} 0 0 1 ${round(ox + radius)} ${round(oy + cell)}`,
        );
      } else {
        // Top-right and bottom-left corners.
        arcs.push(
          `M${round(ox + radius)} ${round(oy)}A${round(radius)} ${round(radius)} 0 0 1 ${round(ox + cell)} ${round(oy + radius)}`,
          `M${round(ox + radius)} ${round(oy + cell)}A${round(radius)} ${round(radius)} 0 0 1 ${round(ox)} ${round(oy + radius)}`,
        );
      }
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    // One path for every arc: the browser strokes it as a single element,
    // and it keeps the markup to a couple of kilobytes at any grid size.
    `<path d="${arcs.join("")}" fill="none" stroke="${palette.colors[0]}" stroke-width="${round(stroke)}" stroke-linecap="round"/>`,
  ].join("");
}

/** Two decimals is well under a device pixel at any avatar size. */
function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
