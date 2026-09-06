import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Symmetrical five-row pixel identicon, in the family of DiceBear's
 * "Identicon" style (created by DiceBear, released CC0 1.0 —
 * https://www.dicebear.com/styles/identicon/).
 *
 * The geometry vocabulary is theirs and is reproduced exactly: a 5x5
 * grid where every row is one of seven horizontally symmetric patterns.
 * That constraint is the whole trick — because each row is symmetric,
 * the icon as a whole always reads as deliberate, and because there are
 * only 7^5 = 16,807 arrangements it stays recognizable at small sizes
 * instead of dissolving into noise.
 *
 * The colors are seedicon's own (the original picks from a fixed
 * palette; ours derives from the seed like every other style here), so
 * this is not output-compatible with DiceBear — it is the same idea with
 * our color model.
 */

/**
 * The seven row patterns, as bit strings where `1` means "filled". All
 * seven are palindromes; that is the invariant that makes the style work
 * and the reason this list is fixed rather than generated.
 */
const ROW_PATTERNS = [
  0b10001, // x...x
  0b11011, // xx.xx
  0b10101, // x.x.x
  0b01110, // .xxx.
  0b11111, // xxxxx
  0b01010, // .x.x.
  0b00100, // ..x..
] as const;

const GRID_SIZE = 5;

export function renderIdenticon(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 1);
  const color = palette.colors[0] ?? palette.background;
  const cell = size / GRID_SIZE;

  const rects: string[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    const pattern = ROW_PATTERNS[rng.int(0, ROW_PATTERNS.length)] as number;

    // Walk the bits left to right. Bit 4 is the leftmost column, so the
    // shift is (GRID_SIZE - 1 - col).
    let runStart = -1;
    for (let col = 0; col <= GRID_SIZE; col++) {
      const filled =
        col < GRID_SIZE && (pattern >> (GRID_SIZE - 1 - col)) % 2 === 1;

      if (filled && runStart < 0) {
        runStart = col;
      } else if (!filled && runStart >= 0) {
        // Emit one rect per horizontal run rather than one per cell,
        // purely to keep the node count down. It is not what prevents
        // seams — see the note on `crispEdges` at the end of this
        // function, which is what handles the row boundaries too.
        rects.push(
          `<rect x="${runStart * cell}" y="${row * cell}" width="${(col - runStart) * cell}" height="${cell}" fill="${color}"/>`,
        );
        runStart = -1;
      }
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    // Antialiasing note: two adjacent cells share an edge, and when that
    // edge falls inside a device pixel the rasterizer antialiases each
    // rect on its own and composites them with source-over. Neither
    // covers the pixel fully, so ~25% of the background rect below shows
    // through and the grid lines appear as hairlines over the avatar.
    // `crispEdges` turns antialiasing off for the cells, which snaps
    // their edges to whole pixels and removes the seams at every size and
    // device pixel ratio. It goes on an inner group rather than on the
    // `<svg>`, so the rounded-corner clip path in core.ts keeps its own
    // smooth edge.
    `<g shape-rendering="crispEdges">${rects.join("")}</g>`,
  ].join("");
}
