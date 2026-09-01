import type { Rng } from "../hash.js";
import { sha1Bytes } from "../sha1.js";

/**
 * The 7x7 mirrored bit grid used by Stellar wallets — the "space
 * invader" look. Ported from stellar-identicon-js (ISC, Lobstrco:
 * https://github.com/Lobstrco/stellar-identicon-js).
 *
 * The original takes a Stellar public key, base32-decodes it, and reads
 * bits straight out of the key. There is no PRNG anywhere: the picture
 * *is* the key, which is the point — you are meant to recognize at a
 * glance that an address is the one you expected.
 *
 * seedicon keeps that property for real Stellar addresses (they are
 * decoded exactly as the original does, so the output matches) and falls
 * back to a SHA-1 digest for every other kind of seed, since an
 * arbitrary string has no key bytes to read.
 */

/** Grid dimension, from the original's DEFAULT_SIZE. */
const GRID_SIZE = 7;

/** RFC 4648 base32 alphabet, as used by Stellar's StrKey encoding. */
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * A Stellar account public key: 56 characters of base32 starting with
 * "G". Anything else is treated as a generic seed.
 */
const STELLAR_ADDRESS = /^G[A-Z2-7]{55}$/;

function decodeBase32(input: string): number[] {
  const charmap: Record<string, number> = {};
  for (let i = 0; i < BASE32_ALPHABET.length; i++) {
    charmap[BASE32_ALPHABET[i] as string] = i;
  }

  const buf: number[] = [];
  let shift = 8;
  let carry = 0;

  for (const char of input.toUpperCase()) {
    const symbol = (charmap[char] as number) & 0xff;

    shift -= 5;
    if (shift > 0) {
      carry |= symbol << shift;
    } else if (shift < 0) {
      buf.push(carry | (symbol >> -shift));
      shift += 8;
      carry = (symbol << shift) & 0xff;
    } else {
      buf.push(carry | symbol);
      shift = 8;
      carry = 0;
    }
  }

  if (shift !== 8 && carry !== 0) {
    buf.push(carry);
  }

  return buf;
}

/**
 * 16 bytes: the first drives the color, the remaining 15 fill the grid.
 * For a Stellar key those are bytes 2..16 of the decoded payload, exactly
 * as the original slices them.
 */
function seedBytes(seed: string): number[] {
  if (STELLAR_ADDRESS.test(seed)) {
    return decodeBase32(seed).slice(2, 16);
  }
  return sha1Bytes(seed).slice(0, 16);
}

/** Reads bit `position` out of a byte array, most significant bit first. */
function getBit(position: number, bytes: number[]): number {
  const byte = bytes[Math.floor(position / 8)] as number | undefined;
  if (byte === undefined) return 0;
  return (byte & (1 << (7 - (position % 8)))) === 0 ? 0 : 1;
}

/** HSV -> hex. The original renders rgb(); hex is the same color. */
function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: r = v; g = p; b = q; break;
  }

  const toHex = (value: number) =>
    Math.round(value * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** `_rng` is unused: this style reads the seed's bytes, not a PRNG. */
export function renderStellar(_rng: Rng, size: number, seed: string): string {
  const bytes = seedBytes(seed);
  const colorByte = (bytes[0] ?? 0) / 255;
  const color = hsvToHex(colorByte, 0.7, 0.8);

  // The original draws on a transparent canvas. An avatar needs a
  // surface of its own (and `radius` needs something to clip), so we add
  // a very pale tint of the same hue — it changes no shape, only what
  // sits behind them.
  const background = hsvToHex(colorByte, 0.08, 0.98);

  // Only the left half plus the center column are read from the bits;
  // the right half mirrors them.
  const columns = Math.ceil(GRID_SIZE / 2);
  const bits = bytes.slice(1);
  const cell = size / GRID_SIZE;

  const rects: string[] = [];
  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (!getBit(column + row * columns, bits)) continue;

      rects.push(
        `<rect x="${column * cell}" y="${row * cell}" width="${cell}" height="${cell}" fill="${color}"/>`,
      );

      const mirrored = GRID_SIZE - column - 1;
      if (mirrored !== column) {
        rects.push(
          `<rect x="${mirrored * cell}" y="${row * cell}" width="${cell}" height="${cell}" fill="${color}"/>`,
        );
      }
    }
  }

  return [
    `<rect width="${size}" height="${size}" fill="${background}"/>`,
    ...rects,
  ].join("");
}
