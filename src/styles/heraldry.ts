import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * A coat of arms: one division of the field, then one charge laid over it.
 *
 * Real heraldry works from a closed vocabulary — a shield is described by
 * naming a division and a charge, not by drawing coordinates — and that is
 * exactly the constraint this package keeps looking for. The seed picks two
 * entries from two lists and two tinctures, and nothing else. Nothing it can
 * choose overlaps badly, falls off the canvas, or renders as a sliver.
 *
 * It is also by a wide margin the smallest output of any style here: two or
 * three elements, a few hundred bytes, and it stays readable at 16px because
 * everything on it is a large flat area.
 *
 * The cost of that is entropy. Ten divisions and nine charges give 90
 * silhouettes, so across a large user base the shape repeats and the colors
 * do the separating. Prefer it where avatars are seen a few at a time, not
 * in a directory of ten thousand.
 */
export function renderHeraldry(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 2);
  const field = palette.colors[0] as string;
  const ground = palette.background;
  const charge = palette.colors[1] as string;

  const parts = [divisionPath(rng.int(0, 10), size, field, ground)];

  // A plain shield with no charge is a legitimate blazon and gives the set
  // some visual rest, but it is the least distinctive outcome, so it stays
  // rare.
  if (rng.next() > 0.14) {
    parts.push(chargePath(rng.int(0, 9), size, charge));
  }

  return parts.join("");
}

/** The ten divisions of the field, in the order the docs list them. */
function divisionPath(
  kind: number,
  size: number,
  field: string,
  ground: string,
): string {
  const half = size / 2;
  const base = `<rect width="${size}" height="${size}" fill="${ground}"/>`;

  switch (kind) {
    case 0: // plain
      return `<rect width="${size}" height="${size}" fill="${field}"/>`;
    case 1: // per pale
      return `${base}<rect width="${round(half)}" height="${size}" fill="${field}"/>`;
    case 2: // per fess
      return `${base}<rect width="${size}" height="${round(half)}" fill="${field}"/>`;
    case 3: // per bend
      return `${base}<path d="M0 0L${size} 0L0 ${size}Z" fill="${field}"/>`;
    case 4: // per bend sinister
      return `${base}<path d="M${size} 0L${size} ${size}L0 ${size}Z" fill="${field}"/>`;
    case 5: // quarterly
      return `${base}<rect width="${round(half)}" height="${round(half)}" fill="${field}"/><rect x="${round(half)}" y="${round(half)}" width="${round(half)}" height="${round(half)}" fill="${field}"/>`;
    case 6: // per saltire
      return `${base}<path d="M0 0L${round(half)} ${round(half)}L0 ${size}Z" fill="${field}"/><path d="M${size} 0L${round(half)} ${round(half)}L${size} ${size}Z" fill="${field}"/>`;
    case 7: // per chevron
      return `${base}<path d="M0 ${size}L${round(half)} ${round(size * 0.36)}L${size} ${size}Z" fill="${field}"/>`;
    case 8: // barry
      return `${base}<path d="${stripes(size, false)}" fill="${field}"/>`;
    default: // paly
      return `${base}<path d="${stripes(size, true)}" fill="${field}"/>`;
  }
}

/** Six bars, horizontal (barry) or vertical (paly). */
function stripes(size: number, vertical: boolean): string {
  const band = size / 6;
  let d = "";
  for (let i = 0; i < 6; i += 2) {
    const at = round(i * band);
    d += vertical
      ? `M${at} 0h${round(band)}v${size}h${round(-band)}Z`
      : `M0 ${at}h${size}v${round(band)}h${-size}Z`;
  }
  return d;
}

/** The nine charges. All are centered and sized to the same optical weight. */
function chargePath(kind: number, size: number, fill: string): string {
  const c = size / 2;
  const u = (fraction: number) => round(size * fraction);

  switch (kind) {
    case 0: // roundel
      return `<circle cx="${round(c)}" cy="${round(c)}" r="${u(0.19)}" fill="${fill}"/>`;
    case 1: // annulet
      return `<circle cx="${round(c)}" cy="${round(c)}" r="${u(0.19)}" fill="none" stroke="${fill}" stroke-width="${u(0.075)}"/>`;
    case 2: // lozenge
      return `<path d="M${round(c)} ${u(0.24)}L${u(0.76)} ${round(c)}L${round(c)} ${u(0.76)}L${u(0.24)} ${round(c)}Z" fill="${fill}"/>`;
    case 3: // mullet
      return `<path d="${star(size)}Z" fill="${fill}"/>`;
    case 4: // cross
      return `<path d="M${u(0.42)} ${u(0.2)}h${u(0.16)}v${u(0.2)}h${u(0.2)}v${u(0.16)}h${u(-0.2)}v${u(0.24)}h${u(-0.16)}v${u(-0.24)}h${u(-0.2)}v${u(-0.16)}h${u(0.2)}Z" fill="${fill}"/>`;
    case 5: // chevron
      return `<path d="M${u(0.16)} ${u(0.7)}L${round(c)} ${u(0.32)}L${u(0.84)} ${u(0.7)}l${u(-0.1)} ${u(0.06)}L${round(c)} ${u(0.46)}L${u(0.26)} ${u(0.76)}Z" fill="${fill}"/>`;
    case 6: // pile
      return `<path d="M${u(0.22)} ${u(0.22)}L${u(0.78)} ${u(0.22)}L${round(c)} ${u(0.78)}Z" fill="${fill}"/>`;
    case 7: // billet
      return `<rect x="${u(0.36)}" y="${u(0.24)}" width="${u(0.28)}" height="${u(0.52)}" fill="${fill}"/>`;
    default: // crescent
      return `<path d="M${u(0.68)} ${u(0.28)}a${u(0.24)} ${u(0.24)} 0 1 0 0 ${u(0.44)}a${u(0.29)} ${u(0.29)} 0 1 1 0 ${u(-0.44)}Z" fill="${fill}"/>`;
  }
}

/** A five-pointed star, drawn from alternating outer and inner radii. */
function star(size: number): string {
  const c = size / 2;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / 5;
    const radius = size * (i % 2 ? 0.1 : 0.24);
    d += `${i ? "L" : "M"}${round(c + Math.cos(angle) * radius)} ${round(c + Math.sin(angle) * radius)}`;
  }
  return d;
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
