import type { Rng } from "../hash.js";

/**
 * Layered landscape: five ridges stacked front to back over a flat sky,
 * with an optional sun.
 *
 * The composition is completely fixed — horizon at the same height, layers
 * in the same order, each one lighter or darker than the last along a single
 * hue. The seed only moves the ridge peaks and picks the hue, which is why
 * no seed can produce something that reads as broken.
 *
 * The tradeoff is honest and worth knowing before picking this one: because
 * the structure is fixed, two seeds differ mostly in color and peak
 * placement. It reads as scenery more than as an identity mark.
 */
export function renderTerrain(rng: Rng, size: number): string {
  const dark = rng.next() > 0.45;
  const hue = rng.int(0, 360);

  const layers = 5;
  const peaks = 7;

  const parts: string[] = [
    `<rect width="${size}" height="${size}" fill="${hsl(hue, 45, dark ? 12 : 92)}"/>`,
  ];

  // Placed before the ridges so the front layers occlude it, the way a real
  // horizon would.
  if (rng.next() > 0.4) {
    parts.push(
      `<circle cx="${round(size * (0.2 + rng.next() * 0.6))}" cy="${round(size * (0.14 + rng.next() * 0.14))}" r="${round(size * (0.07 + rng.next() * 0.05))}" fill="${hsl(hue + 40, 80, dark ? 66 : 58)}"/>`,
    );
  }

  for (let layer = 0; layer < layers; layer++) {
    const depth = layer / (layers - 1);

    // Back layers sit high and shallow, front layers low and jagged, which
    // is the whole of the depth cue here.
    const baseline = size * (0.34 + depth * 0.52);
    const amplitude = size * (0.16 - depth * 0.07);

    let d = `M0 ${round(size)}L0 ${round(baseline)}`;
    for (let i = 1; i <= peaks; i++) {
      const x = (size / peaks) * i;
      const y = baseline - amplitude * (rng.next() * 2 - 1) * (1 + depth);
      // The control point sits between the last peak and this one, which
      // rounds the ridge instead of drawing a sawtooth.
      const cx = x - size / peaks / 2;
      d += `Q${round(cx)} ${round(y - amplitude * 0.5)} ${round(x)} ${round(y)}`;
    }
    d += `L${round(size)} ${round(size)}Z`;

    parts.push(
      `<path d="${d}" fill="${hsl(hue + depth * 26, 60, dark ? 20 + depth * 34 : 62 - depth * 34)}"/>`,
    );
  }

  return parts.join("");
}

function hsl(hue: number, saturation: number, lightness: number): string {
  return `hsl(${Math.round(((hue % 360) + 360) % 360)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
