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
