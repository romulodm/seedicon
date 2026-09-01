import type { Rng } from "../hash.js";

/**
 * Blockies-compatible pixel identicon.
 *
 * This is a faithful port of the algorithm from `@download/blockies`
 * (MIT, Erin Dachtler and Alex Van de Sande —
 * https://github.com/download13/blockies), which is itself the library
 * behind the wallet avatars you've seen in MetaMask, Etherscan and most
 * of the Ethereum ecosystem.
 *
 * Why a port and not our own take: the whole point of this style is
 * drop-in compatibility. If an app is already showing blockies avatars
 * for its users, switching to seedicon must not change anybody's picture
 * — the same seed has to produce the same image, or every user silently
 * gets a new identity. So the PRNG, the color construction and the grid
 * generation below match the original exactly, down to the order the
 * random draws happen in. Changing any of it breaks compatibility.
 *
 * What is different: the original paints to a `<canvas>`; this emits
 * SVG. That's the reason seedicon exists — canvas can't render during
 * SSR and needs a DOM ref plus an effect, SVG is just a string.
 *
 * If you want a pixel style we're free to improve, that's a case for a
 * new style rather than an edit here.
 */

/** Grid dimension. 8 is the blockies default and part of the contract. */
const GRID_SIZE = 8;

/**
 * The blockies PRNG: a 4-word xorshift seeded from the raw character
 * codes of the string, following Java's String.hashCode() expanded to
 * four 32-bit lanes.
 *
 * Note this deliberately keeps the original's loose arithmetic. In the
 * seeding loop `<< 5` coerces to int32 while the subtraction that
 * follows does not, so the stored values can drift outside int32 range —
 * the coercion only happens again inside `rand()`. That quirk is part of
 * what the output depends on, so "fixing" it would produce different
 * avatars for the same address.
 */
function createBlockiesRand(seed: string): () => number {
  // Xorshift state: [x, y, z, w].
  const randseed = [0, 0, 0, 0];

  for (let i = 0; i < seed.length; i++) {
    const lane = i % 4;
    randseed[lane] =
      ((randseed[lane] as number) << 5) -
      (randseed[lane] as number) +
      seed.charCodeAt(i);
  }

  return function rand(): number {
    const x = randseed[0] as number;
    const t = x ^ (x << 11);

    randseed[0] = randseed[1] as number;
    randseed[1] = randseed[2] as number;
    const w = randseed[3] as number;
    randseed[2] = w;
    randseed[3] = w ^ (w >> 19) ^ t ^ (t >> 8);

    return ((randseed[3] as number) >>> 0) / ((1 << 31) >>> 0);
  };
}

/**
 * Three draws per color, in this exact order. Saturation starts at 40%
 * to avoid washed-out greys; lightness is the sum of four draws, which
 * gives a bell curve centered on 50% instead of a flat distribution.
 */
function createColor(rand: () => number): string {
  const h = Math.floor(rand() * 360);
  const s = `${rand() * 60 + 40}%`;
  const l = `${(rand() + rand() + rand() + rand()) * 25}%`;
  return `hsl(${h},${s},${l})`;
}

/**
 * Builds the grid. Only the left half is drawn from the PRNG and then
 * mirrored, which is what makes the result read as a face-like blob
 * rather than noise.
 *
 * `rand() * 2.3` floors to 0, 1 or 2 with roughly 43% / 43% / 13%
 * probability: mostly background and foreground, with the spot color as
 * an accent.
 */
function createImageData(rand: () => number, size: number): number[] {
  const dataWidth = Math.ceil(size / 2);
  const mirrorWidth = size - dataWidth;

  const data: number[] = [];
  for (let y = 0; y < size; y++) {
    let row: number[] = [];
    for (let x = 0; x < dataWidth; x++) {
      row.push(Math.floor(rand() * 2.3));
    }
    const mirrored = row.slice(0, mirrorWidth);
    mirrored.reverse();
    row = row.concat(mirrored);

    for (const value of row) {
      data.push(value);
    }
  }

  return data;
}

/**
 * `_rng` is seedicon's own PRNG, unused here: this style has to run the
 * blockies PRNG on the raw seed to stay output-compatible. It stays in
 * the signature so every style shares one shape.
 */
export function renderPixels(_rng: Rng, size: number, seed: string): string {
  const rand = createBlockiesRand(seed);

  // Order matters — each call consumes three draws from the same stream.
  const color = createColor(rand);
  const bgcolor = createColor(rand);
  const spotcolor = createColor(rand);

  const data = createImageData(rand, GRID_SIZE);
  const cell = size / GRID_SIZE;

  const rects: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const value = data[i] as number;
    if (!value) continue; // 0 means "let the background show through".

    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const fill = value === 1 ? color : spotcolor;

    rects.push(
      `<rect x="${col * cell}" y="${row * cell}" width="${cell}" height="${cell}" fill="${fill}"/>`,
    );
  }

  return [
    `<rect width="${size}" height="${size}" fill="${bgcolor}"/>`,
    ...rects,
  ].join("");
}
