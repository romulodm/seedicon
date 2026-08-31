import type { Rng } from "../hash.js";
import { generatePalette } from "../color.js";

type ShapeKind = "circle" | "triangle" | "rect";

/**
 * Jazzicon-style avatar: a handful of overlapping translucent shapes,
 * rotated and offset by the seed, clipped to a circle. Reads as more
 * "designed" than a pixel grid, at the cost of a slightly heavier SVG.
 */
export function renderGeometric(rng: Rng, size: number): string {
  const palette = generatePalette(rng, 4);
  const shapeCount = rng.int(3, 5);
  const kinds: ShapeKind[] = ["circle", "triangle", "rect"];

  const shapes: string[] = [];
  for (let i = 0; i < shapeCount; i++) {
    const kind = rng.pick(kinds);
    const color = palette.colors[i % palette.colors.length];
    const cx = rng.int(size * 0.15, size * 0.85);
    const cy = rng.int(size * 0.15, size * 0.85);
    const scale = size * (0.35 + rng.next() * 0.35);
    const rotation = rng.int(0, 360);
    const opacity = (0.75 + rng.next() * 0.25).toFixed(2);

    const transform = `translate(${cx} ${cy}) rotate(${rotation})`;

    if (kind === "circle") {
      shapes.push(
        `<circle r="${scale / 2}" fill="${color}" opacity="${opacity}" transform="${transform}"/>`,
      );
    } else if (kind === "rect") {
      shapes.push(
        `<rect x="${-scale / 2}" y="${-scale / 2}" width="${scale}" height="${scale}" fill="${color}" opacity="${opacity}" transform="${transform}"/>`,
      );
    } else {
      const h = scale * 0.87;
      const points = `0,${-h / 2} ${scale / 2},${h / 2} ${-scale / 2},${h / 2}`;
      shapes.push(
        `<polygon points="${points}" fill="${color}" opacity="${opacity}" transform="${transform}"/>`,
      );
    }
  }

  const clipId = `seedicon-clip-${rng.int(0, 1_000_000)}`;

  return [
    `<defs><clipPath id="${clipId}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></clipPath></defs>`,
    `<g clip-path="url(#${clipId})">`,
    `<rect width="${size}" height="${size}" fill="${palette.background}"/>`,
    ...shapes,
    `</g>`,
  ].join("");
}
