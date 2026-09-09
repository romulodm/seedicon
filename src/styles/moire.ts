import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Moire: two or three line gratings laid over each other at close angles.
 *
 * The visible pattern is not the lines, it is the beat between them, and the
 * beat's wavelength goes as roughly `gap / sin(angle difference)`. That
 * relationship is the entire design constraint here: at a large angle
 * difference the beat is finer than the lines themselves and the tile
 * flattens into gray at any avatar size, which is exactly what a first cut
 * at this style did. So the extra gratings are pinned to within 6 to 26
 * degrees of the first, where the beat comes out several times coarser than
 * the grating and survives being looked at from across a screen.
 *
 * Gaps are fractions of `size` rather than fixed units, so the pattern is
 * the same picture at 24px and at 256px instead of turning to mush small.
 */
export function renderMoire(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 3);

  const layers = rng.next() > 0.45 ? 3 : 2;
  const baseAngle = rng.int(0, 180);

  // Coarse on purpose: 7% to 15% of the canvas between lines.
  const baseGap = size * (0.07 + rng.next() * 0.08);

  const parts: string[] = [
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
  ];

  for (let i = 0; i < layers; i++) {
    // The first grating sets the reference; the rest sit just off it. The
    // sign alternates so a third layer beats against both of the others
    // instead of stacking in one direction.
    const offset = i === 0 ? 0 : (6 + rng.next() * 20) * (i % 2 ? 1 : -1);
    const angle = baseAngle + offset;

    // A slight gap difference is a second source of beating, independent of
    // the angle, and it keeps two layers from ever landing exactly in phase.
    const gap = baseGap * (1 + (rng.next() - 0.5) * 0.22);

    const lines: string[] = [];
    // The grating is drawn across twice the canvas in both directions so
    // rotating it still covers every corner.
    for (let y = -size; y < size * 2; y += gap) {
      lines.push(`M${-size} ${round(y)}H${size * 2}`);
    }

    // Partial opacity rather than a blend mode: where two gratings cross,
    // the color stacks and the crossing reads darker or lighter than a
    // single layer, which is all the beat needs to be visible. `multiply`
    // and `screen` would each only work on one of the two backgrounds
    // generatePalette produces, and plain alpha works on both — and in the
    // SVG rasterizers that never implemented blend modes.
    parts.push(
      `<g transform="rotate(${round(angle)} ${size / 2} ${size / 2})" opacity="0.62">`,
      `<path d="${lines.join("")}" fill="none" stroke="${palette.colors[i] ?? palette.colors[0]}" stroke-width="${round(gap * 0.45)}"/>`,
      `</g>`,
    );
  }

  return parts.join("");
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
