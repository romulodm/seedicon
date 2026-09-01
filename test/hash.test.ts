import { describe, expect, it } from "vitest";
import { hashString, createRng, rngFromSeed } from "../src/hash.js";
import { sha1 } from "../src/sha1.js";

describe("hashString", () => {
  it("is deterministic", () => {
    expect(hashString("0xba32...eD56")).toBe(hashString("0xba32...eD56"));
  });

  it("produces different hashes for different inputs", () => {
    expect(hashString("alice")).not.toBe(hashString("bob"));
  });

  it("is sensitive to small changes (avalanche-ish)", () => {
    expect(hashString("user-1")).not.toBe(hashString("user-2"));
  });

  it("returns a non-negative safe integer", () => {
    const h = hashString("anything");
    expect(Number.isSafeInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
  });
});

describe("createRng", () => {
  it("is deterministic for the same numeric seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 10 }, () => a.next());
    const seqB = Array.from({ length: 10 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it("produces floats in [0, 1)", () => {
    const rng = createRng(1);
    for (let i = 0; i < 100; i++) {
      const n = rng.next();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it("int() respects [min, max)", () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i++) {
      const n = rng.int(3, 8);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThan(8);
    }
  });

  it("pick() only returns items from the array", () => {
    const rng = createRng(123);
    const items = ["a", "b", "c"];
    for (let i = 0; i < 50; i++) {
      expect(items).toContain(rng.pick(items));
    }
  });
});

describe("rngFromSeed", () => {
  it("gives the same sequence for the same seed string", () => {
    const seq = () =>
      Array.from({ length: 5 }, () => rngFromSeed("0xba32...eD56").next());
    expect(seq()).toEqual(seq());
  });
});

describe("sha1", () => {
  // Vectors from Node's own crypto, so a regression here means our
  // implementation drifted, not that the expectations are stale.
  const VECTORS: Record<string, string> = {
    "": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    a: "86f7e437faa5a7fce15d1ddcb9eaeaea377667b8",
    abc: "a9993e364706816aba3e25717850c26c9cd0d89d",
    romulo: "83888359d9c7e80bd11b260333efee1b23dc35cf",
    "0xba32a6076cd558947b3da6148fc4994b421eed56":
      "538e141ca56d987e2a6db49d79dcc8f83c932e43",
    // Astral characters must be encoded as one code point, not two
    // broken surrogate halves.
    "🙂 unicode seed": "0257501b9bf526eeb30ba2d4478b1abedd083ea0",
  };

  for (const [input, expected] of Object.entries(VECTORS)) {
    it(`hashes ${JSON.stringify(input)}`, () => {
      expect(sha1(input)).toBe(expected);
    });
  }

  it("crosses a block boundary correctly", () => {
    // 200 bytes spans four 64-byte blocks including padding.
    expect(sha1("x".repeat(200))).toBe(
      "94218caae9904e93a3d7bf578bf4791926fc5e82",
    );
  });
});
