import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Radial kaleidoscope: a handful of shapes drawn once inside a wedge, then
 * repeated around the center with N-fold rotational symmetry and mirrored.
 *
 * Symmetry is doing the work that a narrow parameter range does elsewhere.
 * Scattered shapes are the classic failure mode of generative avatars — the
 * `geometric` style was cut for exactly that — but the same scatter, folded
 * around a center, reads as a mandala no matter where the shapes landed.
 *
 * The wedge is emitted once into `<defs>` and referenced with `<use>`. That
 * matters: at 8-fold symmetry with a mirror, a literal copy would repeat the
 * markup sixteen times and quadruple the size of the output.
 */
export function renderKaleidoscope(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 3);

  // 5 to 8 arms. Below 5 the symmetry does not read; above 8 the wedges
  // overlap into a solid disc.
  const arms = rng.int(5, 9);

  // Ids are document-global, so this has to include everything that changes
  // the definition — the same seed at two sizes on one page must not share
  // a wedge. Same rule as the clip path in core.ts.
  const wedgeId = `seedicon-kaleido-${rng.int(0, 1_000_000).toString(36)}-${size}`;

  const center = size / 2;
  const shapes: string[] = [];

  for (let i = 0; i < 4; i++) {
    // Placed inside one wedge's angular slice, so the copies interlock
    // instead of overlapping into a ring.
    const angle = (rng.next() * Math.PI * 2) / arms;
    const distance = size * (0.13 + rng.next() * 0.33);
    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance;
    const extent = size * (0.05 + rng.next() * 0.08);
    const color = palette.colors[i % palette.colors.length] as string;

    switch (rng.int(0, 3)) {
      case 0:
        shapes.push(
          `<circle cx="${round(x)}" cy="${round(y)}" r="${round(extent)}" fill="${color}"/>`,
        );
        break;
      case 1:
        shapes.push(
          `<rect x="${round(x - extent)}" y="${round(y - extent)}" width="${round(extent * 2)}" height="${round(extent * 2)}" fill="${color}" transform="rotate(${rng.int(0, 90)} ${round(x)} ${round(y)})"/>`,
        );
        break;
      default:
        // A spoke back to the center. It is what stops the result from
        // reading as loose confetti arranged in a circle.
        shapes.push(
          `<path d="M${round(center)} ${round(center)}L${round(x)} ${round(y)}" stroke="${color}" stroke-width="${round(extent * 0.8)}" stroke-linecap="round"/>`,
        );
    }
  }

  const copies: string[] = [];
  for (let k = 0; k < arms; k++) {
    const angle = round((360 / arms) * k);
    copies.push(`<use href="#${wedgeId}" transform="rotate(${angle} ${center} ${center})"/>`);
    // The mirror doubles the symmetry order without doubling the shape
    // count. `scale(-1 1)` flips about x = 0, so the translate brings it
    // back over the canvas.
    copies.push(
      `<use href="#${wedgeId}" transform="rotate(${angle} ${center} ${center}) scale(-1 1) translate(${-size} 0)"/>`,
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
