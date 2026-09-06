import type { Rng } from "../hash.js";

/**
 * Organic patterns grown with a cellular automaton — the family of
 * Blockchain Commons' LifeHash (BSD-2-Clause,
 * https://github.com/BlockchainCommons/LifeHash).
 *
 * This is a lighter reimplementation, not a port. LifeHash proper takes
 * a SHA-256 digest, runs Conway's Game of Life until the pattern
 * stabilizes, and compiles the entire generation history into a
 * high-resolution image. Faithfully reproducing that would mean shipping
 * SHA-256 and emitting a thousand-plus rectangles per avatar, which is
 * a poor trade for a package whose selling point is being small.
 *
 * What is kept is the mechanism that gives LifeHash its look: a Life
 * automaton seeded from the hash, cells colored by *how long they
 * survived* rather than by their final state, and a symmetry applied at
 * the end. Cells that die early stay near the background color and
 * long-lived cells reach the accent, which is what produces the soft
 * organic gradients instead of hard-edged noise.
 */

/** Grid is small on purpose: 12x12 = 144 cells, so 144 rects worst case. */
const GRID_SIZE = 12;

/**
 * Width of the seam-filling stroke, as a fraction of one cell. Relative to
 * the cell rather than absolute so it holds at any `size`. It only has to
 * be wide enough to reach across the device pixel a shared edge falls in;
 * the unstroked pass painted over it hides the rest.
 */
const SEAM_STROKE_RATIO = 0.12;

/** Generations to run. Life on a small torus settles well before this. */
const GENERATIONS = 12;

type Grid = boolean[];

function neighbors(grid: Grid, x: number, y: number): number {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      // The grid wraps: a bounded grid kills everything at the edges and
      // leaves the corners of the avatar permanently empty.
      const nx = (x + dx + GRID_SIZE) % GRID_SIZE;
      const ny = (y + dy + GRID_SIZE) % GRID_SIZE;
      if (grid[ny * GRID_SIZE + nx]) count++;
    }
  }
  return count;
}

function step(grid: Grid): Grid {
  const next: Grid = new Array(GRID_SIZE * GRID_SIZE).fill(false);
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const alive = grid[y * GRID_SIZE + x] as boolean;
      const n = neighbors(grid, x, y);
      // Standard B3/S23 rules.
      next[y * GRID_SIZE + x] = alive ? n === 2 || n === 3 : n === 3;
    }
  }
  return next;
}

/** Blends two HSL components toward `t` in [0, 1]. */
function mix(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function renderLifehash(rng: Rng, size: number): string {
  // Seed roughly 40% of cells. Much sparser dies out immediately; much
  // denser collapses into a solid block within two generations.
  let grid: Grid = new Array(GRID_SIZE * GRID_SIZE)
    .fill(false)
    .map(() => rng.next() < 0.4);

  // How many generations each cell was alive. This history, not the
  // final state, is what gets colored.
  const lifetime: number[] = new Array(GRID_SIZE * GRID_SIZE).fill(0);

  for (let generation = 0; generation < GENERATIONS; generation++) {
    for (let i = 0; i < grid.length; i++) {
      if (grid[i]) lifetime[i] = (lifetime[i] as number) + 1;
    }
    grid = step(grid);
  }

  // Symmetry, applied after the simulation rather than before it: it
  // turns whatever the automaton produced into something that reads as
  // designed, which is exactly what LifeHash does at the end of its own
  // pipeline. Mirroring left-to-right is always on; the vertical mirror
  // is the seed's choice.
  const mirrorVertically = rng.next() > 0.5;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE / 2; x++) {
      const value = lifetime[y * GRID_SIZE + x] as number;
      lifetime[y * GRID_SIZE + (GRID_SIZE - 1 - x)] = value;
    }
  }
  if (mirrorVertically) {
    for (let y = 0; y < GRID_SIZE / 2; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        lifetime[(GRID_SIZE - 1 - y) * GRID_SIZE + x] = lifetime[
          y * GRID_SIZE + x
        ] as number;
      }
    }
  }

  // Two ends of a gradient in the same hue family, so the result always
  // looks like one material rather than a collection of colored dots.
  const hue = rng.int(0, 360);
  const hueDrift = rng.int(20, 70) * (rng.next() > 0.5 ? 1 : -1);
  const dark = rng.next() > 0.5;

  const from = { h: hue, s: rng.int(25, 45), l: dark ? 16 : 92 };
  const to = {
    h: hue + hueDrift,
    s: rng.int(60, 85),
    l: dark ? 68 : 34,
  };

  const cell = size / GRID_SIZE;
  const maxLifetime = Math.max(1, ...lifetime);

  // Collected once and painted twice — see the seam note below.
  const cells: { x: string; y: string; color: string }[] = [];
  for (let i = 0; i < lifetime.length; i++) {
    const value = lifetime[i] as number;
    if (value === 0) continue;

    const t = value / maxLifetime;
    const color = `hsl(${Math.round(mix(from.h, to.h, t))} ${Math.round(mix(from.s, to.s, t))}% ${Math.round(mix(from.l, to.l, t))}%)`;

    cells.push({
      x: ((i % GRID_SIZE) * cell).toFixed(2),
      y: (Math.floor(i / GRID_SIZE) * cell).toFixed(2),
      color,
    });
  }

  const side = cell.toFixed(2);
  const seam = (cell * SEAM_STROKE_RATIO).toFixed(2);

  // One subpath per cell, grouped by color. Merging cells this way is what
  // keeps the two passes below from doubling the markup, and it also means
  // neighbouring cells that happen to share a color have no edge between
  // them at all: a single path is rasterized as one shape, so coverage is
  // computed over the union rather than per cell.
  const byColor = new Map<string, string>();
  for (const { x, y, color } of cells) {
    byColor.set(
      color,
      (byColor.get(color) ?? "") + `M${x} ${y}h${side}v${side}h-${side}Z`,
    );
  }

  const paint = (stroked: boolean): string =>
    [...byColor]
      .map(
        ([color, d]) =>
          `<path d="${d}" fill="${color}"${stroked ? ` stroke="${color}" stroke-width="${seam}"` : ""}/>`,
      )
      .join("");

  return [
    `<rect width="${size}" height="${size}" fill="hsl(${from.h} ${from.s}% ${from.l}%)"/>`,
    // Seam handling, and why this style does it differently from the
    // other grid styles.
    //
    // Adjacent cells share an edge. When that edge falls inside a device
    // pixel the rasterizer antialiases each rect separately, neither
    // covers the pixel fully, and the background rect below shows through
    // as a hairline grid over the avatar. `pixels`, `identicon` and
    // `stellar` fix that with `shape-rendering="crispEdges"`, which snaps
    // cell edges to whole pixels.
    //
    // That cure is worse than the disease here. This grid is 12 wide
    // against their 5 to 8, so at avatar sizes a cell covers roughly four
    // device pixels and snapping makes neighbouring cells differ by ~25%
    // in width — a chunky, irregular grid instead of the grown-organism
    // look the automaton is for.
    //
    // So the grid is painted twice instead. The first pass strokes each
    // cell in its own fill color, which spills half a stroke past every
    // shared edge and leaves the background nothing to leak through. The
    // second pass repaints the same cells unstroked on top, which puts
    // every true edge back where it belongs, so the filler only ever
    // shows in the sliver the two neighbours could not cover between
    // them.
    //
    // Stroking in a single pass is cheaper and also closes the seams, but
    // it fattens every cell permanently: measured against an 8x-supersampled
    // render, one stroked pass at this ratio lands further from the true
    // pattern (RMS 9.4) than leaving the seams alone (9.1), while the two
    // passes here land much closer (5.9).
    paint(true),
    paint(false),
  ].join("");
}
