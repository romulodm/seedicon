import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

/**
 * Soft organic-blob style, inspired by Boring Avatars' "Marble" theme:
 * two or three blurred, overlapping blob shapes on a flat background.
 * The blobs here are our own generative shape (randomized-radius points
 * around a circle, smoothed with quadratic curves) rather than a fixed
 * artwork, so every seed produces a genuinely different silhouette.
 */
function blobPath(
  rng: Rng,
  cx: number,
  cy: number,
  baseRadius: number,
  pointCount: number,
  irregularity: number,
): string {
  const points: [number, number][] = [];
  const angleStep = (Math.PI * 2) / pointCount;

  for (let i = 0; i < pointCount; i++) {
    const angle = i * angleStep;
    const jitter = 1 - irregularity / 2 + rng.next() * irregularity;
    const r = baseRadius * jitter;
    points.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }

  const start = points[points.length - 1] as [number, number];
  const first = points[0] as [number, number];
  let d = `M ${(start[0] + first[0]) / 2} ${(start[1] + first[1]) / 2}`;

  for (let i = 0; i < pointCount; i++) {
    const p = points[i] as [number, number];
    const next = points[(i + 1) % pointCount] as [number, number];
    const mid: [number, number] = [(p[0] + next[0]) / 2, (p[1] + next[1]) / 2];
    d += ` Q ${p[0]} ${p[1]} ${mid[0]} ${mid[1]}`;
  }

  return `${d} Z`;
}

export function renderMarble(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 3);
  const cx = size / 2;
  const cy = size / 2;
  // Includes `size` for the same reason the clip path in index.ts does:
  // SVG ids are document-global, and this filter's blur radius scales
  // with size, so rendering the same seed at 16px and 96px on one page
  // must not let the first definition win for both.
  const filterId = `seedicon-marble-blur-${rng.int(0, 1_000_000)}-${size}`;

  const blobs = [0, 1]
    .map((i) => {
      const blobCx = cx + rng.int(-size * 0.12, size * 0.12);
      const blobCy = cy + rng.int(-size * 0.12, size * 0.12);
      const radius = size * (0.32 + rng.next() * 0.16);
      const pointCount = rng.int(5, 8);
      const d = blobPath(rng, blobCx, blobCy, radius, pointCount, 0.55);
      const rotation = rng.int(0, 360);
      const blend = i === 0 ? "normal" : "overlay";
      return `<path d="${d}" fill="${palette.colors[i + 1]}" style="mix-blend-mode:${blend}" transform="rotate(${rotation} ${cx} ${cy})"/>`;
    })
    .join("");

  return [
    `<defs><filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${size * 0.08}"/></filter></defs>`,
    `<rect width="${size}" height="${size}" fill="${palette.colors[0]}"/>`,
    `<g filter="url(#${filterId})">${blobs}</g>`,
  ].join("");
}
