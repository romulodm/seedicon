import type { Rng } from "../hash.js";

/**
 * Ordered dithering: a two-tone gradient rendered through a Bayer 4x4
 * threshold matrix, the way a 1-bit display would have to draw it.
 *
 * How it works: every cell computes a value between 0 and 1 from its
 * position along a gradient, then compares that value against a fixed
 * threshold from the matrix, tiled across the grid. Because the matrix
 * spreads its thresholds as evenly as possible, the cells that switch on
 * form the familiar interlocking checker texture instead of clumping — the
 * gradient reads as continuous even though only two colors are ever used.
 *
 * The gradient is normalized against its own range over the canvas corners,
 * so the ramp always spans the full 0 to 1 no matter which direction the
 * seed picked. Without that, an off-axis gradient leaves most of the tile on
 * one side of every threshold and the avatar comes out nearly blank.
 */

/**
 * Bayer 4x4. The values are the standard recursive construction; what
 * matters is that the sixteen thresholds are a permutation of 0..15 arranged
 * so that any two numerically close values are far apart on the grid.
 */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Cells across. 20 keeps the texture visible at 32px without exploding markup. */
const GRID = 20;

export function renderDither(rng: Rng, size: number): string {
  const hue = rng.int(0, 360);
  const dark = rng.next() > 0.4;

  // Two tones of one hue rather than two hues: the dither is meant to read
  // as one color fading into another, and two unrelated hues would read as
  // a checkerboard of two things instead.
  const ink = hsl(hue, rng.int(70, 92), dark ? rng.int(48, 60) : rng.int(38, 48));
  const ground = hsl(hue, rng.int(45, 70), dark ? rng.int(8, 15) : rng.int(88, 94));

  const radial = rng.next() > 0.55;
  const cell = size / GRID;

  // Linear: a direction vector. Radial: a focus, kept inside the middle half
  // of the canvas so the bright end is always on screen.
  const dx = rng.next() * 2 - 1;
  const dy = rng.next() * 2 - 1;
  const focusX = size * (0.25 + rng.next() * 0.5);
  const focusY = size * (0.25 + rng.next() * 0.5);

  // Normalizing constants, computed once. For the linear case this is the
  // projection range across the four corners; for the radial case, the
  // farthest corner from the focus.
  const projections = [
    0 * dx + 0 * dy,
    size * dx + 0 * dy,
    0 * dx + size * dy,
    size * dx + size * dy,
  ];
  const projMin = Math.min(...projections);
  const projSpan = Math.max(...projections) - projMin || 1;

  const maxDistance =
    Math.max(
      Math.hypot(focusX, focusY),
      Math.hypot(size - focusX, focusY),
      Math.hypot(focusX, size - focusY),
      Math.hypot(size - focusX, size - focusY),
    ) || 1;

  const runs: string[] = [];

  for (let y = 0; y < GRID; y++) {
    const py = (y + 0.5) * cell;
    let runStart = -1;

    for (let x = 0; x <= GRID; x++) {
      let on = false;

      if (x < GRID) {
        const px = (x + 0.5) * cell;
        const value = radial
          ? 1 - Math.hypot(px - focusX, py - focusY) / maxDistance
          : (px * dx + py * dy - projMin) / projSpan;

        // `* 17` rather than `* 16` so a value of exactly 1 still clears the
        // highest threshold and the bright end of the ramp goes fully solid.
        on = value * 17 > (BAYER[y % 4] as number[])[x % 4]!;
      }

      if (on && runStart < 0) runStart = x;
      if (!on && runStart >= 0) {
        // Horizontal runs are merged into one rectangle before being
        // emitted, and emitted as path data rather than as <rect> elements.
        // Together that is roughly a quarter of the bytes of one <rect> per
        // cell, which is what makes a 20x20 grid affordable.
        const rx = runStart * cell;
        const width = (x - runStart) * cell;
        runs.push(
          `M${round(rx)} ${round(y * cell)}h${round(width)}v${round(cell)}h${round(-width)}Z`,
        );
        runStart = -1;
      }
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${ground}"/>`,
    // crispEdges for the same reason as `pixels` and `stellar`: neighbouring
    // cells share an edge, and antialiasing each one separately lets the
    // background bleed through as hairlines.
    `<path d="${runs.join("")}" fill="${ink}" shape-rendering="crispEdges"/>`,
  ].join("");
}

function hsl(hue: number, saturation: number, lightness: number): string {
  return `hsl(${Math.round(((hue % 360) + 360) % 360)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
