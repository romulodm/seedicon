import type { Rng } from "../hash.js";
import { sha1 } from "../sha1.js";

/**
 * Geometric identicon: shapes arranged on a 4x4 grid with four-fold
 * rotational symmetry. A faithful port of Jdenticon (MIT, Daniel Mester
 * Pirttijärvi — https://github.com/dmester/jdenticon).
 *
 * Ported rather than reinvented for the same reason `pixels` is: this
 * algorithm has been rendering the same icon for a given string since
 * 2014, across JS, .NET, PHP and Python implementations, and an app that
 * already shows Jdenticon avatars should be able to switch to seedicon
 * without every user's picture changing. Everything below — the SHA-1
 * digest, which hex character selects which shape, the five-color theme,
 * the lightness correction table, the geometry of all 18 shapes — is
 * reproduced exactly.
 *
 * The one addition is a background: Jdenticon defaults to transparent,
 * which is fine for an inline icon but not for a profile picture, and
 * `radius` needs a surface to clip. Nothing about the shapes changes.
 */

/** A point in final avatar coordinates, after the cell transform. */
interface Point {
  x: number;
  y: number;
}

/**
 * A cell's placement and quarter-turn rotation. Shapes are always drawn
 * in local coordinates from (0,0) to (cell,cell); this maps them into
 * position, which is how one shape definition serves all four corners.
 */
class Transform {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly size: number,
    private readonly rotation: number,
  ) {}

  /**
   * `w` and `h` are the width/height of the thing being placed. They
   * matter only for rotations 1-3, where the anchor moves from one
   * corner of the bounding box to another.
   */
  point(x: number, y: number, w = 0, h = 0): Point {
    const right = this.x + this.size;
    const bottom = this.y + this.size;

    switch (this.rotation) {
      case 1:
        return { x: right - y - h, y: this.y + x };
      case 2:
        return { x: right - x - w, y: bottom - y - h };
      case 3:
        return { x: this.x + y, y: bottom - x - w };
      default:
        return { x: this.x + x, y: this.y + y };
    }
  }
}

/**
 * Collects path data per color. Jdenticon merges every shape sharing a
 * color into a single `<path>`, and relies on the default `nonzero` fill
 * rule so that a sub-shape wound in the opposite direction punches a
 * hole instead of painting over.
 */
class Graphics {
  transform = new Transform(0, 0, 0, 0);
  private data = "";

  /** One decimal place, matching Jdenticon's own rounding. */
  private static value(value: number): number {
    return ((value * 10 + 0.5) | 0) / 10;
  }

  take(): string {
    const data = this.data;
    this.data = "";
    return data;
  }

  /**
   * `points` is a flat [x0,y0,x1,y1,...] list wound clockwise. With
   * `invert`, the pairs are walked backwards, producing a
   * counter-clockwise ring — that is how the ring and donut shapes get
   * their holes.
   */
  polygon(points: number[], invert?: boolean): void {
    const stepSize = invert ? -2 : 2;
    let out = "";
    let first = true;

    for (
      let i = invert ? points.length - 2 : 0;
      i < points.length && i >= 0;
      i += stepSize
    ) {
      const p = this.transform.point(points[i] as number, points[i + 1] as number);
      out += `${first ? "M" : "L"}${Graphics.value(p.x)} ${Graphics.value(p.y)}`;
      first = false;
    }

    this.data += `${out}Z`;
  }

  circle(x: number, y: number, diameter: number, invert?: boolean): void {
    const p = this.transform.point(x, y, diameter, diameter);
    const sweep = invert ? 0 : 1;
    const radius = Graphics.value(diameter / 2);
    const d = Graphics.value(diameter);
    const arc = `a${radius},${radius} 0 1,${sweep} `;

    this.data +=
      `M${Graphics.value(p.x)} ${Graphics.value(p.y + diameter / 2)}` +
      `${arc}${d},0${arc}${-d},0`;
  }

  rectangle(x: number, y: number, w: number, h: number, invert?: boolean): void {
    this.polygon([x, y, x + w, y, x + w, y + h, x, y + h], invert);
  }

  /**
   * A triangle built by taking the four corners of a bounding rectangle
   * and dropping the one at index `r % 4`. `r = 0` drops the top-right
   * corner, so the triangle fills the lower-left of the box.
   */
  triangle(x: number, y: number, w: number, h: number, r: number, invert?: boolean): void {
    const points = [x + w, y, x + w, y + h, x, y + h, x, y];
    points.splice((r % 4) * 2, 2);
    this.polygon(points, invert);
  }

  rhombus(x: number, y: number, w: number, h: number, invert?: boolean): void {
    this.polygon([
      x + w / 2, y,
      x + w, y + h / 2,
      x + w / 2, y + h,
      x, y + h / 2,
    ], invert);
  }
}

/**
 * `substr` with Jdenticon's semantics: a negative start counts from the
 * end of the string, and an omitted length reads to the end.
 */
function parseHex(hash: string, start: number, length?: number): number {
  const from = start < 0 ? Math.max(hash.length + start, 0) : start;
  const slice =
    length === undefined ? hash.slice(from) : hash.slice(from, from + length);
  return parseInt(slice, 16);
}

function decToHex(value: number): string {
  const v = value | 0; // truncates toward zero — not a rounding step
  if (v < 0) return "00";
  if (v < 16) return `0${v.toString(16)}`;
  if (v < 256) return v.toString(16);
  return "ff";
}

function hueToRgb(m1: number, m2: number, h: number): string {
  const hue = h < 0 ? h + 6 : h > 6 ? h - 6 : h;
  return decToHex(
    255 *
      (hue < 1
        ? m1 + (m2 - m1) * hue
        : hue < 3
          ? m2
          : hue < 4
            ? m1 + (m2 - m1) * (4 - hue)
            : m1),
  );
}

function hsl(hue: number, saturation: number, lightness: number): string {
  if (saturation === 0) {
    const gray = decToHex(lightness * 255);
    return `#${gray}${gray}${gray}`;
  }

  const m2 =
    lightness <= 0.5
      ? lightness * (saturation + 1)
      : lightness + saturation - lightness * saturation;
  const m1 = lightness * 2 - m2;

  return `#${hueToRgb(m1, m2, hue * 6 + 2)}${hueToRgb(m1, m2, hue * 6)}${hueToRgb(m1, m2, hue * 6 - 2)}`;
}

/**
 * Jdenticon's perceptual correction: pure yellow at 50% lightness looks
 * far brighter than pure blue at 50%, so each hue band declares where
 * its own perceived midpoint sits and the requested lightness is
 * remapped around that.
 */
function correctedHsl(hue: number, saturation: number, lightness: number): string {
  const correctors = [0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55];
  const corrector = correctors[(hue * 6 + 0.5) | 0] as number;

  const corrected =
    lightness < 0.5
      ? lightness * corrector * 2
      : corrector + (lightness - 0.5) * (1 - corrector) * 2;

  return hsl(hue, saturation, corrected);
}

/**
 * Maps 0..1 onto a lightness range. Written as `min + value * (max -
 * min)` rather than with the results pre-computed because the float
 * residue matters: `0.4 + 0.5 * (0.8 - 0.4)` is 0.6000000000000001, not
 * 0.6, and that difference survives all the way to `255 * m1 | 0`,
 * flipping a channel by one. Substituting the "obvious" literal 0.6 here
 * produces colors one step off from every other Jdenticon
 * implementation.
 */
function lightness(min: number, max: number, value: number): number {
  const result = min + value * (max - min);
  return result < 0 ? 0 : result > 1 ? 1 : result;
}

/** Defaults from Jdenticon's config: color [0.4, 0.8], gray [0.3, 0.9]. */
const colorLightness = (value: number) => lightness(0.4, 0.8, value);
const grayscaleLightness = (value: number) => lightness(0.3, 0.9, value);

/** Five shades of one hue: two neutrals and three tints. */
function colorTheme(hue: number): string[] {
  return [
    correctedHsl(hue, 0, grayscaleLightness(0)), // 0 dark gray
    correctedHsl(hue, 0.5, colorLightness(0.5)), // 1 mid color
    correctedHsl(hue, 0, grayscaleLightness(1)), // 2 light gray
    correctedHsl(hue, 0.5, colorLightness(1)), // 3 light color
    correctedHsl(hue, 0.5, colorLightness(0)), // 4 dark color
  ];
}

/** The 14 center shapes, in index order. */
function centerShape(rawIndex: number, g: Graphics, cell: number, positionIndex: number): void {
  const index = rawIndex % 14;
  let k: number;
  let m: number;
  let w: number;
  let h: number;
  let inner: number;
  let outer: number;

  switch (index) {
    case 0:
      k = cell * 0.42;
      g.polygon([0, 0, cell, 0, cell, cell - k * 2, cell - k, cell, 0, cell]);
      break;
    case 1:
      w = 0 | (cell * 0.5);
      h = 0 | (cell * 0.8);
      g.triangle(cell - w, 0, w, h, 2);
      break;
    case 2:
      w = 0 | (cell / 3);
      g.rectangle(w, w, cell - w, cell - w);
      break;
    case 3:
      inner = cell * 0.1;
      // Small icons get a fixed border width, otherwise the border would
      // round down to nothing and the shape would vanish.
      outer = cell < 6 ? 1 : cell < 8 ? 2 : 0 | (cell * 0.25);
      inner = inner > 1 ? 0 | inner : inner > 0.5 ? 1 : inner;
      g.rectangle(outer, outer, cell - inner - outer, cell - inner - outer);
      break;
    case 4:
      m = 0 | (cell * 0.15);
      w = 0 | (cell * 0.5);
      g.circle(cell - w - m, cell - w - m, w);
      break;
    case 5:
      inner = cell * 0.1;
      outer = inner * 4;
      if (outer > 3) outer = 0 | outer;
      g.rectangle(0, 0, cell, cell);
      g.polygon(
        [outer, outer, cell - inner, outer, outer + (cell - outer - inner) / 2, cell - inner],
        true,
      );
      break;
    case 6:
      g.polygon([
        0, 0,
        cell, 0,
        cell, cell * 0.7,
        cell * 0.4, cell * 0.4,
        cell * 0.7, cell,
        0, cell,
      ]);
      break;
    case 7:
    case 11:
      // Identical in the original — index 11 is a duplicate of 7.
      g.triangle(cell / 2, cell / 2, cell / 2, cell / 2, 3);
      break;
    case 8:
      g.rectangle(0, 0, cell, cell / 2);
      g.rectangle(0, cell / 2, cell / 2, cell / 2);
      g.triangle(cell / 2, cell / 2, cell / 2, cell / 2, 1);
      break;
    case 9:
      inner = cell * 0.14;
      outer = cell < 4 ? 1 : cell < 6 ? 2 : 0 | (cell * 0.35);
      inner = cell < 8 ? inner : 0 | inner;
      g.rectangle(0, 0, cell, cell);
      g.rectangle(outer, outer, cell - outer - inner, cell - outer - inner, true);
      break;
    case 10:
      inner = cell * 0.12;
      outer = inner * 3;
      g.rectangle(0, 0, cell, cell);
      g.circle(outer, outer, cell - inner - outer, true);
      break;
    case 12:
      m = cell * 0.25;
      g.rectangle(0, 0, cell, cell);
      g.rhombus(m, m, cell - m, cell - m, true);
      break;
    default:
      // 13: one big circle, drawn only in the first of the four center
      // cells, so the other three stay empty.
      if (!positionIndex) {
        g.circle(cell * 0.4, cell * 0.4, cell * 1.2);
      }
      break;
  }
}

/** The 4 shapes used for corners and edges. */
function outerShape(rawIndex: number, g: Graphics, cell: number): void {
  switch (rawIndex % 4) {
    case 0:
      g.triangle(0, 0, cell, cell, 0);
      break;
    case 1:
      g.triangle(0, cell / 2, cell, cell / 2, 0);
      break;
    case 2:
      g.rhombus(0, 0, cell, cell);
      break;
    default:
      g.circle(cell / 6, cell / 6, cell - (2 * cell) / 6);
      break;
  }
}

/** Jdenticon uses a value that already looks like a hash as-is. */
function resolveHash(seed: string): string {
  return /^[0-9a-f]{11,}$/i.test(seed) ? seed : sha1(seed);
}

/** `_rng` is unused: every choice here comes from the SHA-1 digest. */
export function renderJdenticon(_rng: Rng, size: number, seed: string): string {
  const hash = resolveHash(seed);

  // Padding and cell size are rounded to integers by the original, and
  // the grid is then re-centered to absorb the truncation.
  const padding = (0.5 + size * 0.08) | 0;
  const inner = size - padding * 2;
  const cell = 0 | (inner / 4);
  const originX = 0 | (padding + inner / 2 - cell * 2);
  const originY = 0 | (padding + inner / 2 - cell * 2);

  const hue = parseHex(hash, -7) / 0xfffffff;
  const availableColors = colorTheme(hue);

  // Three color slots. A slot that would repeat a neighbouring pair
  // (both grays, or both light tones) falls back to the mid color, which
  // is what keeps shapes from disappearing into each other.
  const selected: number[] = [];
  for (let i = 0; i < 3; i++) {
    let index = parseHex(hash, 8 + i, 1) % availableColors.length;
    const clashes = (values: number[]) =>
      values.indexOf(index) >= 0 && values.some((v) => selected.indexOf(v) >= 0);
    if (clashes([0, 4]) || clashes([2, 3])) index = 1;
    selected.push(index);
  }

  const graphics = new Graphics();
  // Shapes are grouped into one path per color, in first-use order.
  const paths = new Map<string, string>();

  function renderShape(
    colorSlot: number,
    shapes: (index: number, g: Graphics, cell: number, position: number) => void,
    shapeIndexAt: number,
    rotationIndexAt: number | null,
    positions: [number, number][],
  ): void {
    const shapeIndex = parseHex(hash, shapeIndexAt, 1);
    let rotation = rotationIndexAt === null ? 0 : parseHex(hash, rotationIndexAt, 1);

    for (let i = 0; i < positions.length; i++) {
      const [col, row] = positions[i] as [number, number];
      graphics.transform = new Transform(
        originX + col * cell,
        originY + row * cell,
        cell,
        rotation++ % 4,
      );
      shapes(shapeIndex, graphics, cell, i);
    }

    const color = availableColors[selected[colorSlot] as number] as string;
    paths.set(color, (paths.get(color) ?? "") + graphics.take());
  }

  // Edges, then corners, then the center — the order decides which
  // <path> element comes first in the output.
  renderShape(0, outerShape, 2, 3, [
    [1, 0], [2, 0], [2, 3], [1, 3], [0, 1], [3, 1], [3, 2], [0, 2],
  ]);
  renderShape(1, outerShape, 4, 5, [
    [0, 0], [3, 0], [3, 3], [0, 3],
  ]);
  renderShape(2, centerShape, 1, null, [
    [1, 1], [2, 1], [2, 2], [1, 2],
  ]);

  // A pale tint of the icon's own hue. Jdenticon itself defaults to a
  // transparent background; an avatar needs something behind the shapes.
  const background = correctedHsl(hue, 0.15, 0.96);

  const body = [...paths.entries()]
    .map(([color, data]) => `<path fill="${color}" d="${data}"/>`)
    .join("");

  return `<rect width="${size}" height="${size}" fill="${background}"/>${body}`;
}
