/**
 * Deterministic string hashing + seeded PRNG.
 *
 * The goal is: same seed in -> same numbers out, every time, on every
 * platform (browser, Node, edge runtime), with zero dependencies and no
 * async APIs (so it can run at render time, including during SSR).
 *
 * This is NOT cryptographic. Don't use it for anything security-sensitive
 * (auth tokens, secrets, etc). It only needs to be well-distributed enough
 * that two different-but-similar seeds ("alice", "alice2") produce visibly
 * different avatars.
 */

/**
 * 32-bit FNV-1a hash, run twice with different offsets and combined into a
 * 53-bit integer (the largest safely-representable integer bit width in a
 * JS number). Two independent 32-bit hashes give us far fewer collisions
 * than a single 32-bit hash, which matters here because avatars derived
 * from near-identical seeds (sequential IDs, incrementing addresses) need
 * to look different.
 */
function fnv1a(str: string, seed: number): number {
  let hash = seed ^ 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // 32-bit FNV prime multiplication, done in parts to stay within
    // safe-integer arithmetic (Math.imul keeps it a true 32-bit multiply).
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Hashes an arbitrary string into a 53-bit non-negative integer seed.
 * Case is not normalized here on purpose — callers decide (e.g. Ethereum
 * addresses are usually lower-cased before hashing so checksum casing
 * doesn't change the avatar; usernames might want to stay case-sensitive).
 */
export function hashString(input: string): number {
  const a = fnv1a(input, 0x9e3779b9);
  const b = fnv1a(input, 0x85ebca6b);
  // Combine into a 53-bit range: a occupies the high bits, b the low bits.
  return a * 0x200000 + (b >>> 11);
}

/** A seeded pseudo-random number generator: reproducible, not secure. */
export interface Rng {
  /** Next float in [0, 1). */
  next(): number;
  /** Next integer in [min, max) — max exclusive. */
  int(min: number, max: number): number;
  /** Pick a random element from a non-empty array. */
  pick<T>(items: readonly T[]): T;
}

/**
 * mulberry32 — a small, fast, well-distributed 32-bit PRNG. Chosen over
 * Math.random() because it's seedable (Math.random() isn't, in any
 * standard way) and over crypto RNGs because it's synchronous and cheap:
 * an avatar can need dozens of random draws per render.
 */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  function next(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    int(min: number, max: number) {
      return Math.floor(next() * (max - min)) + min;
    },
    pick<T>(items: readonly T[]): T {
      // Safe: index is always < items.length, and callers only pass
      // non-empty arrays (an empty array is a caller bug, not something
      // worth a runtime check on a hot path).
      return items[Math.floor(next() * items.length)] as T;
    },
  };
}

/** Convenience: build a ready-to-use Rng directly from a seed string. */
export function rngFromSeed(seed: string): Rng {
  return createRng(hashString(seed));
}
