import type { Rng } from "../hash.js";

/**
 * Layered wave bands in shades of a single hue — the family of
 * DiceBear's "Waves" style (created by DiceBear, released CC0 1.0 —
 * https://www.dicebear.com/styles/waves/).
 *
 * That style ships as SVG paths exported from Figma, so this is not a
 * port: the bands here are generated, which means every seed gets its
 * own silhouette instead of picking from a fixed set of drawings.
 *
 * Two constraints keep it consistent across seeds:
 *
 * 1. One hue for the whole avatar, with lightness moving in a single
 *    direction from band to band. The seed picks the hue and the
 *    direction, never the colors independently, so no seed can produce a
 *    clashing pair.
 * 2. Wave amplitude is capped as a fraction of the spacing between
 *    bands. Bands are painted bottom-up and each one covers everything
 *    below it, so if two crests could cross, the upper band would
 *    swallow the lower one and the avatar would collapse into two flat
 *    areas. Capping amplitude below half the spacing makes crossing
 *    impossible, which is why every band always stays visible.
 */

const MIN_BANDS = 4;
const MAX_BANDS = 6;

/** Points sampled along each crest. Enough to read as a smooth curve. */
const SEGMENTS = 16;

export function renderWaves(rng: Rng, size: number): string {
  const hue = rng.int(0, 360);
  const saturation = rng.int(45, 80);
  const bandCount = rng.int(MIN_BANDS, MAX_BANDS + 1);

  // Light-on-dark or dark-on-light. Both read well; mixing them within
  // one avatar would not.
  const darkToLight = rng.next() > 0.5;
  const startLightness = darkToLight ? 28 : 90;
  const endLightness = darkToLight ? 90 : 28;

  const color = (step: number) => {
    const t = step / bandCount;
    const l = startLightness + (endLightness - startLightness) * t;
    return `hsl(${hue} ${saturation}% ${Math.round(l)}%)`;
  };

  // Vertical distance between consecutive crests. Bands are drawn from
  // the top down, each one filling everything below its own crest, so
  // what stays visible of a band is the strip between its crest and the
  // next one's. Drawing them the other way round would mean the last
  // band painted covers every band before it.
  const spacing = size / (bandCount + 0.5);

  // A shared tilt across all bands: this is what makes the waves drift
  // diagonally instead of reading as flat horizontal stripes. Shared,
  // not per band, so bands stay parallel and cannot converge.
  const tilt = size * (rng.next() * 0.36 - 0.18);

  const bands: string[] = [];

  for (let i = 1; i <= bandCount; i++) {
    const base = spacing * (i - 0.25);

    // Below half the spacing, so two crests can never meet (see above).
    const amplitude = spacing * (0.18 + rng.next() * 0.22);

    // Between half a period and one and a half across the width: fewer
    // reads as a straight line, more turns into corrugation.
    const frequency = 0.5 + rng.next();
    const phase = rng.next() * Math.PI * 2;

    const points: string[] = [];
    for (let s = 0; s <= SEGMENTS; s++) {
      const t = s / SEGMENTS;
      const x = t * size;
      const y =
        base +
        tilt * (t - 0.5) +
        Math.sin(phase + t * Math.PI * 2 * frequency) * amplitude;
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }

    // Closed well past the bottom edge so no band can leave a sliver of
    // the layer underneath showing at the very bottom.
    const floor = size * 2;
    bands.push(
      `<polygon points="${points.join(" ")} ${size},${floor} 0,${floor}" fill="${color(i)}"/>`,
    );
  }

  return [
    `<rect width="${size}" height="${size}" fill="${color(0)}"/>`,
    ...bands,
  ].join("");
}
