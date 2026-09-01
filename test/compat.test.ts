import { describe, expect, it } from "vitest";
import { renderIcon } from "@download/blockies/src/blockies.mjs";
import * as jdenticon from "jdenticon";
import { generateAvatar } from "../src/index.js";
import { pixels } from "../src/entries/pixels.js";
import { jdenticon as jdenticonStyle } from "../src/entries/jdenticon.js";

/**
 * Two of the styles exist to be drop-in replacements for an existing
 * library: swapping `blockies` or `jdenticon` for seedicon must not
 * change a single user's avatar.
 *
 * These tests compare against the real packages rather than against
 * stored snapshots, because a snapshot only proves the output has not
 * changed — it would happily keep passing if the port had been wrong
 * from the start, and it would say nothing if upstream fixed a bug we
 * had faithfully copied.
 */

const SEEDS = [
  "romulo",
  "Chloe",
  "a",
  "abc",
  "0xba32a6076cd558947b3da6148fc4994b421eed56",
  "0xBa32A6076cd558947B3dA6148FC4994b421eeD56",
  "550e8400-e29b-41d4-a716-446655440000",
  "user-000001",
  "🙂 unicode seed",
];

const SIZES = [16, 40, 64, 96];

/**
 * Runs the real blockies against a stand-in canvas that records what it
 * would have painted. Returns the background color plus one entry per
 * filled cell.
 */
function blockiesCells(seed: string, size: number) {
  const ops: { x: number; y: number; w: number; h: number; fill: string }[] = [];
  let fill = "";
  const context = {
    set fillStyle(value: string) {
      fill = value;
    },
    get fillStyle() {
      return fill;
    },
    fillRect(x: number, y: number, w: number, h: number) {
      ops.push({ x, y, w, h, fill });
    },
  };

  renderIcon(
    { seed, size: 8, scale: size / 8 },
    { width: 0, height: 0, getContext: () => context as unknown },
  );

  const [background, ...cells] = ops;
  return {
    background: background?.fill,
    cells: cells.map((o) => `${o.x},${o.y},${o.w},${o.h},${o.fill}`),
  };
}

function seediconCells(svg: string) {
  const background = /<rect width="[^"]*" height="[^"]*" fill="([^"]*)"\/>/.exec(svg);
  const cells = [
    ...svg.matchAll(
      /<rect x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)" fill="([^"]*)"\/>/g,
    ),
  ];
  return {
    background: background?.[1],
    cells: cells.map((m) => `${m[1]},${m[2]},${m[3]},${m[4]},${m[5]}`),
  };
}

describe("pixels is output-compatible with blockies", () => {
  for (const size of SIZES) {
    for (const seed of SEEDS) {
      it(`matches @download/blockies for ${JSON.stringify(seed)} at ${size}px`, () => {
        const expected = blockiesCells(seed, size);
        const actual = seediconCells(generateAvatar({ seed, style: "pixels", size }));
        expect(actual).toEqual(expected);
      });
    }
  }

  it("matches through the standalone entry point too", () => {
    for (const seed of SEEDS) {
      expect(pixels({ seed, size: 64 })).toBe(
        generateAvatar({ seed, style: "pixels", size: 64 }),
      );
    }
  });
});

describe("jdenticon is output-compatible with jdenticon", () => {
  /** Only the <path> elements: seedicon adds a background, jdenticon doesn't. */
  function paths(svg: string): string[] {
    return [...svg.matchAll(/<path fill="([^"]*)" d="([^"]*)"\/>/g)].map(
      (m) => `${m[1]}|${m[2]}`,
    );
  }

  for (const size of SIZES) {
    for (const seed of SEEDS) {
      it(`matches jdenticon for ${JSON.stringify(seed)} at ${size}px`, () => {
        const expected = paths(jdenticon.toSvg(seed, size));
        const actual = paths(generateAvatar({ seed, style: "jdenticon", size }));
        expect(actual).toEqual(expected);
      });
    }
  }

  it("matches through the standalone entry point too", () => {
    for (const seed of SEEDS) {
      expect(jdenticonStyle({ seed, size: 64 })).toBe(
        generateAvatar({ seed, style: "jdenticon", size: 64 }),
      );
    }
  });
});
