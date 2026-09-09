import type { Rng } from "../hash.js";
import { sha1Bytes } from "../sha1.js";

/**
 * Drunken bishop: the random-art algorithm OpenSSH draws next to a key
 * fingerprint, as a colored density map instead of ASCII.
 *
 * A bishop walks a bounded board. Each byte of the digest supplies four
 * moves, read two bits at a time from the low end: 00 goes up-left, 01
 * up-right, 10 down-left, 11 down-right. Walls do not wrap and do not
 * bounce — a move that would leave the board simply loses the component
 * that would have gone off the edge, so the bishop slides along the wall.
 * Every square counts how many times it was stepped on, and that count is
 * what gets drawn.
 *
 * Two deliberate departures from ssh-keygen:
 *
 * The board is square. OpenSSH uses 17 by 9, which letterboxes badly in an
 * avatar slot and is unreadable at 32px. 11 by 11 keeps the walk dense enough to
 * read as a picture: 80 moves over 121 squares, against the original's 64
 * over 153. A larger board with the same move count leaves most of it empty
 * and the avatar comes out as a faint streak.
 *
 * The bits come from SHA-1, not MD5. OpenSSH walks the 16 bytes of an MD5
 * fingerprint; this package already ships SHA-1 for `jdenticon` and
 * `stellar`, and its 20 bytes give 80 moves, which suits the larger board.
 * Neither hash is doing anything cryptographic here — it is a bit source.
 */

/** Board dimension. Square, unlike the original's 17x9. */
const BOARD = 11;

export function renderRandomart(rng: Rng, size: number, seed: string): string {
  const bytes = sha1Bytes(seed);

  // The bishop starts dead center, as in the original.
  let x = (BOARD - 1) / 2;
  let y = (BOARD - 1) / 2;

  const counts = new Array<number>(BOARD * BOARD).fill(0);
  counts[y * BOARD + x] = 1;

  for (const byte of bytes) {
    for (let pair = 0; pair < 4; pair++) {
      const move = (byte >> (pair * 2)) & 0b11;
      // Bit 0 chooses right over left, bit 1 chooses down over up.
      x = clamp(x + (move & 0b01 ? 1 : -1));
      y = clamp(y + (move & 0b10 ? 1 : -1));
      counts[y * BOARD + x] = (counts[y * BOARD + x] as number) + 1;
    }
  }

  const hue = rng.int(0, 360);
  const dark = rng.next() > 0.35;
  const peak = Math.max(...counts);

  const cell = size / BOARD;
  const cells: string[] = [];

  for (let i = 0; i < counts.length; i++) {
    const count = counts[i] as number;
    if (!count) continue;

    // Lightness by visit count, not by a threshold: the squares the bishop
    // crossed once are barely there and the ones it kept returning to glow,
    // which is what turns a walk into a picture. Normalizing against the
    // peak keeps a heavily-revisited seed from washing out.
    const weight = count / peak;
    const fill = hsl(
      hue + weight * 40,
      70,
      dark ? 22 + weight * 52 : 74 - weight * 46,
    );

    const col = i % BOARD;
    const row = Math.floor(i / BOARD);
    cells.push(
      `<rect x="${round(col * cell)}" y="${round(row * cell)}" width="${round(cell)}" height="${round(cell)}" fill="${fill}"/>`,
    );
  }

  return [
    `<rect width="${size}" height="${size}" fill="${hsl(hue, 45, dark ? 10 : 93)}"/>`,
    // Same seam problem as every other cell grid here — see `pixels`.
    `<g shape-rendering="crispEdges">${cells.join("")}</g>`,
  ].join("");
}

/** Walls absorb the move instead of wrapping or reflecting, as in OpenSSH. */
function clamp(value: number): number {
  return value < 0 ? 0 : value > BOARD - 1 ? BOARD - 1 : value;
}

function hsl(hue: number, saturation: number, lightness: number): string {
  return `hsl(${Math.round(((hue % 360) + 360) % 360)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

function round(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}
