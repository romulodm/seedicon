import { readFileSync } from "node:fs";

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

      it("resolves each shape preset to its radius", () => {
        const square = generateAvatar({ seed: "check", style, size: 100 });
        expect(square).toBe(
          generateAvatar({ seed: "check", style, size: 100, shape: "square" }),
        );
        expect(square).not.toContain("seedicon-radius");

        expect(
          generateAvatar({ seed: "check", style, size: 100, shape: "rounded" }),
        ).toContain('rx="22"');

        expect(
          generateAvatar({ seed: "check", style, size: 100, shape: "circle" }),
        ).toContain('rx="50"');
      });
    });
  }
});

describe("shape and radius", () => {
  it("lets radius override the shape preset", () => {
    const svg = generateAvatar({
      seed: "check",
      size: 100,
      shape: "circle",
      radius: 12,
    });
    expect(svg).toContain('rx="12"');
  });

  it("clamps radius to [0, size / 2]", () => {
    expect(generateAvatar({ seed: "check", size: 100, radius: 999 })).toContain(
      'rx="50"',
    );
    expect(generateAvatar({ seed: "check", size: 100, radius: -5 })).not.toContain(
      "seedicon-radius",
    );
  });

  it("throws on an unknown shape", () => {
    expect(() =>
      // @ts-expect-error intentionally invalid at runtime
      generateAvatar({ seed: "check", shape: "blob" }),
    ).toThrow();
  });

  it("keeps the shape proportional to the size", () => {
    for (const size of [16, 64, 256]) {
      const svg = generateAvatar({ seed: "check", size, shape: "circle" });
      expect(svg).toContain(`rx="${size / 2}"`);
    }
  });
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

describe("the style registry", () => {
  it("lists every style exactly once", () => {
    expect(new Set(SEEDICON_STYLES).size).toBe(SEEDICON_STYLES.length);
  });

  it("ships a package export for every listed style", () => {
    // The failure this catches is registering a style in index.ts and
    // forgetting tsup.config.ts or the `exports` map: `generateAvatar`
    // keeps working, `import { x } from "seedicon/x"` does not resolve for
    // anyone installing the package, and nothing else here notices.
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    ) as { exports: Record<string, unknown> };

    for (const style of SEEDICON_STYLES) {
      expect(pkg.exports).toHaveProperty(`./${style}`);
    }
  });

  it("gives every style its own svg ids", () => {
    // SVG ids share one namespace across the whole document, so two avatars
    // on a page that resolved to the same id would both use whichever
    // definition came first. It only shows up once a page renders more than
    // one avatar, which no single-avatar assertion can see.
    const ids = (svg: string) =>
      [...svg.matchAll(/id="([^"]+)"/g)].map((match) => match[1] as string);

    for (const style of SEEDICON_STYLES) {
      const small = ids(generateAvatar({ seed: "check", style, size: 32, radius: 6 }));
      const large = ids(generateAvatar({ seed: "check", style, size: 96, radius: 6 }));
      const other = ids(generateAvatar({ seed: "other", style, size: 32, radius: 6 }));

      for (const id of small) {
        expect(large, `${style} reuses an id across sizes`).not.toContain(id);
        expect(other, `${style} reuses an id across seeds`).not.toContain(id);
      }
    }
  });
});

describe("deprecated styles", () => {
  it("keeps rendering, so existing callers do not break", () => {
    const svg = generateAvatar({ seed: "romulo", style: "ring", size: 64 });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toBe(generateAvatar({ seed: "romulo", style: "ring", size: 64 }));
  });

  it("stays out of the list everything else is built from", () => {
    // The site gallery, the playground, the docs and the tests above all
    // iterate SEEDICON_STYLES. Keeping `ring` out of it is what retires the
    // style everywhere without breaking a single import.
    expect(SEEDICON_STYLES).not.toContain("ring" as never);
  });
});
