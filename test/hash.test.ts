import { describe, expect, it } from "vitest";
import { hashString, createRng, rngFromSeed } from "../src/hash.js";

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
