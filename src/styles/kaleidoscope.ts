import type { Rng } from "../hash.js";
import { generateHarmonicPalette } from "../color.js";

/**
 * Radial kaleidoscope: a handful of shapes drawn once inside a wedge, then
 * repeated around the center with N-fold rotational symmetry and mirrored.
 *
 * Symmetry is doing the work that a narrow parameter range does elsewhere.
 * Scattered shapes are the classic failure mode of generative avatars — the
 * `geometric` style was cut for exactly that — but the same scatter, folded
 * around a center, reads as a mandala no matter where the shapes landed.
 *
 * Four constraints keep the fold clean (v0.3.0 added all of them; before,
 * the same seeds produced a much busier picture):
 *
 * - One kind of shape per avatar. Circles, diamonds and spokes mixed in one
 *   wedge, then rotated and mirrored, turned into jagged clumps.
 * - Shapes live in half a wedge, and the mirror axis is the wedge's edge.
 *   A mirrored copy then lands beside its original instead of on top of it.
 * - Everything stays inside a circle of radius 0.42 × size, so nothing is
 *   cut off by the canvas edge or by `shape: "circle"`.
 * - An even number of arms (6, 8 or 10) and a palette built around one hue
 *   (`generateHarmonicPalette`).
 *
 * The wedge is emitted once into `<defs>` and referenced with `<use>`. That
 * matters: at 10-fold symmetry with a mirror, a literal copy would repeat
 * the markup twenty times.
 */
export function renderKaleidoscope(rng: Rng, size: number): string {
  const palette = generateHarmonicPalette(rng);
  const arms = rng.pick([6, 8, 10] as const);
  const kind = rng.pick(["dot", "diamond", "spoke"] as const);

  // Ids are document-global, so this has to include everything that changes
  // the definition — the same seed at two sizes on one page must not share
  // a wedge. Same rule as the clip path in core.ts.
  const wedgeId = `seedicon-kaleido-${rng.int(0, 1_000_000).toString(36)}-${size}`;

  const center = size / 2;
  const outer = size * 0.42;
  const halfWedge = Math.PI / arms;
  const shapes: string[] = [];

  for (let i = 0; i < 4; i++) {
    const angle = rng.next() * halfWedge;
    const extent = size * (0.035 + rng.next() * 0.045);
    // The shape's far edge, not its center, is what has to stay inside
    // `outer`, so the extent comes off the available distance.
    const distance = size * 0.1 + rng.next() * (outer - size * 0.1 - extent);
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    const color = palette.colors[i % palette.colors.length] as string;

    if (kind === "dot") {
      shapes.push(
        `<circle cx="${round(x)}" cy="${round(y)}" r="${round(extent)}" fill="${color}"/>`,
      );
    } else if (kind === "diamond") {
      // A square turned to point at the center, so every copy around the
      // circle points the same way relative to the middle.
      const turn = round((angle * 180) / Math.PI + 45);
      shapes.push(
        `<rect x="${round(x - extent)}" y="${round(y - extent)}" width="${round(extent * 2)}" height="${round(extent * 2)}" fill="${color}" transform="rotate(${turn} ${round(x)} ${round(y)})"/>`,
      );
    } else {
      // A spoke back to the center. The round cap adds half the stroke
      // width past the end point, which `extent` already reserved.
      shapes.push(
        `<path d="M${round(center)} ${round(center)}L${round(x)} ${round(y)}" stroke="${color}" stroke-width="${round(extent * 0.6)}" stroke-linecap="round"/>`,
      );
    }
  }

  const copies: string[] = [];
  for (let k = 0; k < arms; k++) {
    const angle = round((360 / arms) * k);
    copies.push(`<use href="#${wedgeId}" transform="rotate(${angle} ${center} ${center})"/>`);
    // The mirror flips about the horizontal line through the center, which
    // is the wedge's own edge (angle 0). `scale(1 -1)` flips about y = 0,
    // so the translate brings it back over the canvas.
    copies.push(
      `<use href="#${wedgeId}" transform="rotate(${angle} ${center} ${center}) scale(1 -1) translate(0 ${-size})"/>`,
    );
  }

  return [
    `<defs><g id="${wedgeId}">${shapes.join("")}</g></defs>`,
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    copies.join(""),
  ].join("");
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
