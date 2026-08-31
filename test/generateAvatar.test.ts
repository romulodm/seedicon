import { describe, expect, it } from "vitest";
import {
  generateAvatar,
  generateAvatarDataUri,
  SEEDICON_STYLES,
} from "../src/index.js";

const SEEDS = [
  "0xba32...eD56",
  "550e8400-e29b-41d4-a716-446655440000",
  "romulo",
  "a",
  "🙂 unicode seed",
];

describe("generateAvatar", () => {
  it("throws on an empty seed", () => {
    expect(() => generateAvatar({ seed: "" })).toThrow();
  });

  it("throws on an unknown style", () => {
    // @ts-expect-error intentionally invalid at runtime
    expect(() => generateAvatar({ seed: "x", style: "bogus" })).toThrow();
  });

  for (const style of SEEDICON_STYLES) {
    describe(`style: ${style}`, () => {
      it("is deterministic for the same seed", () => {
        for (const seed of SEEDS) {
          const first = generateAvatar({ seed, style });
          const second = generateAvatar({ seed, style });
          expect(first).toBe(second);
        }
      });

      it("differs across seeds", () => {
        const outputs = new Set(
          SEEDS.map((seed) => generateAvatar({ seed, style })),
        );
        expect(outputs.size).toBe(SEEDS.length);
      });

      it("produces well-formed, sized SVG markup", () => {
        const svg = generateAvatar({ seed: "check", style, size: 96 });
        expect(svg.startsWith("<svg")).toBe(true);
        expect(svg.endsWith("</svg>")).toBe(true);
        expect(svg).toContain('width="96"');
        expect(svg).toContain('height="96"');
      });

      it("respects the default size of 64", () => {
        const svg = generateAvatar({ seed: "check", style });
        expect(svg).toContain('width="64"');
      });

      it("applies a clip-path when radius is set", () => {
        const svg = generateAvatar({ seed: "check", style, radius: 8 });
        expect(svg).toContain("seedicon-radius");
      });
    });
  }
});

describe("generateAvatarDataUri", () => {
  it("returns a data:image/svg+xml URI wrapping the same markup", () => {
    const uri = generateAvatarDataUri({ seed: "check" });
    expect(uri.startsWith("data:image/svg+xml,")).toBe(true);

    const svg = generateAvatar({ seed: "check" });
    expect(decodeURIComponent(uri.replace("data:image/svg+xml,", ""))).toBe(
      svg,
    );
  });
});
