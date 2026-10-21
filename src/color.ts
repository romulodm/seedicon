import type { Rng } from "./hash.js";

/** A color palette derived from the seed: background, foreground colors. */
export interface Palette {
  background: string;
  colors: string[];
}

/**
 * Draws `count` hues that are spread around the color wheel instead of
 * fully random, so a seed never accidentally produces two near-identical
 * colors sitting next to each other (which reads as a rendering bug more
 * than a design choice). Each hue gets a random jitter so the palette
 * still feels seed-specific rather than snapped to a fixed wheel.
 */
function spreadHues(rng: Rng, count: number): number[] {
  const base = rng.int(0, 360);
  const jitter = 360 / (count + 1) / 2;
  const hues: number[] = [];
  for (let i = 0; i < count; i++) {
    const slot = base + (360 / count) * i;
    hues.push((slot + rng.int(-jitter, jitter) + 360) % 360);
  }
  return hues;
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

/**
 * Builds a palette with one background color and `foregroundCount`
 * foreground colors, tuned to stay legible: the background is kept light
 * or dark (never mid-gray, which reads as "unstyled"), and foreground
 * colors are saturated enough to read as intentional against it.
 */
export function generatePalette(rng: Rng, foregroundCount: number): Palette {
  const dark = rng.next() > 0.5;
  const background = hsl(
    rng.int(0, 360),
    rng.int(35, 65),
    dark ? rng.int(12, 22) : rng.int(88, 96),
  );

  const hues = spreadHues(rng, foregroundCount);
  const colors = hues.map((h) =>
    hsl(h, rng.int(55, 85), dark ? rng.int(55, 72) : rng.int(38, 55)),
  );

  return { background, colors };
}

/**
 * A palette built around one hue instead of spread across the wheel.
 *
 * `generatePalette` deliberately picks hues far apart, which suits styles
 * where colors sit in separate regions (pixel grids, identicons). It does
 * not suit radially symmetric styles: there every color touches every
 * other one many times over, and three unrelated hues on a fourth
 * unrelated background read as confetti. This palette keeps them related.
 *
 * - `colors[0]` is the base hue, at full strength.
 * - `colors[1]` is the accent: either a neighbour of the base (analogous),
 *   a near-complement (split), or the base itself one step lighter (mono).
 * - `colors[2]` is the ink: a very light or very dark version of a hue
 *   close to the base, for small details that need contrast.
 * - `background` is a tint (light) or shade (dark) of the base hue itself,
 *   so the ground belongs to the drawing instead of fighting it.
 *
 * It is a separate function rather than a change to `generatePalette`
 * because every style that already calls that one would render a
 * different avatar for the same seed.
 */
export function generateHarmonicPalette(rng: Rng): Palette {
  const hue = rng.int(0, 360);
  const dark = rng.next() < 0.5;
  const scheme = rng.int(0, 3);

  const accentHue =
    scheme === 0
      ? hue + (rng.next() < 0.5 ? -35 : 35)
      : scheme === 1
        ? hue + (rng.next() < 0.5 ? 150 : 210)
        : hue;
  const inkHue = hue + rng.int(-25, 26);

  const background = dark
    ? hsl(hue, rng.int(28, 42), rng.int(11, 16))
    : hsl(hue, rng.int(38, 55), rng.int(91, 95));

  const base = dark
    ? hsl(hue, rng.int(62, 78), rng.int(56, 64))
    : hsl(hue, rng.int(58, 72), rng.int(42, 50));

  // In the mono scheme the accent is the same hue, so it has to differ in
  // lightness or it would vanish into the base.
  const accentLightness =
    scheme === 2 ? (dark ? 78 : 64) : dark ? rng.int(68, 76) : rng.int(54, 62);
  const accent = hsl((accentHue + 360) % 360, rng.int(65, 80), accentLightness);

  const ink = dark
    ? hsl((inkHue + 360) % 360, rng.int(35, 50), rng.int(86, 91))
    : hsl((inkHue + 360) % 360, rng.int(50, 62), rng.int(24, 30));

  return { background, colors: [base, accent, ink] };
}
