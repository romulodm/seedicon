import type { Rng } from "../hash.js";
import {
  accessories,
  beard,
  clothing,
  eyes,
  glasses,
  hair,
  hat,
  mouth,
  SPRITE_NAMES,
  SPRITE_PALETTES,
  type Sprite,
  type SpriteColors,
} from "./pixelart.sprites.js";

/**
 * A pixel-art character, after DiceBear's Pixel Art. Artwork CC0 1.0,
 * randomization seedicon's own (see `shapes.ts` for why this is not an
 * output-compatible port).
 *
 * This is the one style in the package that is not an algorithm. Every other
 * renderer computes its picture; this one assembles it from 139 sprites
 * somebody drew — 45 hairstyles, 23 tops, 23 mouths, 14 pairs of glasses, 12
 * pairs of eyes, 10 hats, 8 beards, 4 accessories — layered over a fixed
 * body in a fixed order. That is also why it is the only style whose bundle
 * is dominated by data rather than code: about 27KB of path strings, which
 * compress to roughly 4KB because the same handful of one-pixel rectangles
 * repeat throughout.
 *
 * It is also the only figurative style here. The rest are abstract marks —
 * you cannot tell whose avatar it is, only that it is theirs. This one is a
 * face, with a skin tone and gender-coded features, which means a UUID ends
 * up assigning somebody an appearance. Some products want exactly that;
 * others deliberately avoid it. Worth a decision rather than a default.
 */

/**
 * The body, on the 16-unit grid every sprite is authored against. The second
 * path is a soft highlight over the first, which is what keeps the flat skin
 * fill from reading as a silhouette.
 */
const BODY =
  `<path d="M4 2h8v1h1v3h1v2h-1v3h-1v1H9v1h4v1h1v2H2v-2h1v-1h4v-1H4v-1H3V8H2V6h1V3h1V2Z" fill="{skin}"/>` +
  `<path d="M4 2h8v1h1v3h1v2h-1v3h-1v1H4v-1H3V8H2V6h1V3h1V2Z" fill="#fff" fill-opacity=".1"/>`;

/**
 * How likely each optional layer is to appear, as DiceBear sets it. Eyes,
 * mouth, hair and clothing are always drawn; the rest are accents, and the
 * low numbers are why most faces are plain and the occasional one has a hat.
 */
const PROBABILITY = {
  accessories: 0.1,
  glasses: 0.2,
  beard: 0.05,
  hat: 0.05,
};

export function renderPixelart(rng: Rng, size: number): string {
  const skin = pickFrom(rng, SPRITE_PALETTES.skin);

  const colors: SpriteColors = {
    hair: pickFrom(rng, SPRITE_PALETTES.hair),
    eyes: pickFrom(rng, SPRITE_PALETTES.eyes),
    mouth: pickFrom(rng, SPRITE_PALETTES.mouth),
    clothing: pickFrom(rng, SPRITE_PALETTES.clothing),
    glasses: pickFrom(rng, SPRITE_PALETTES.glasses),
    hat: pickFrom(rng, SPRITE_PALETTES.hat),
    accessories: pickFrom(rng, SPRITE_PALETTES.accessories),
  };

  // Every draw happens whether or not the layer is used, so that turning a
  // layer off does not shift the choices made for the layers after it. Two
  // seeds that differ only in whether the hat appeared still get the same
  // face underneath.
  const chosen = {
    accessories: choose(rng, accessories, SPRITE_NAMES.accessories, PROBABILITY.accessories),
    clothing: choose(rng, clothing, SPRITE_NAMES.clothing, 1),
    eyes: choose(rng, eyes, SPRITE_NAMES.eyes, 1),
    glasses: choose(rng, glasses, SPRITE_NAMES.glasses, PROBABILITY.glasses),
    beard: choose(rng, beard, SPRITE_NAMES.beard, PROBABILITY.beard),
    mouth: choose(rng, mouth, SPRITE_NAMES.mouth, 1),
    hair: choose(rng, hair, SPRITE_NAMES.hair, 1),
    hat: choose(rng, hat, SPRITE_NAMES.hat, PROBABILITY.hat),
  };

  // Layer order is DiceBear's and it matters: glasses sit over eyes, hair
  // over the beard and the mouth, the hat over everything.
  const body =
    BODY.replace("{skin}", skin) +
    [
      chosen.accessories,
      chosen.clothing,
      chosen.eyes,
      chosen.glasses,
      chosen.beard,
      chosen.mouth,
      chosen.hair,
      chosen.hat,
    ]
      .map((sprite) => (sprite ? sprite(colors) : ""))
      .join("");

  // The character is transparent where the background should show, and the
  // corner clip in core.ts needs an opaque surface to cut, so seedicon adds
  // a ground of its own. DiceBear leaves that to its renderer.
  const backdrop = `hsl(${rng.int(0, 360)} ${rng.int(45, 70)}% ${rng.next() > 0.5 ? rng.int(76, 88) : rng.int(24, 34)}%)`;

  return [
    `<rect width="${size}" height="${size}" fill="${backdrop}"/>`,
    // Sprites are authored on a 16x16 grid; scaling the group is exact at
    // any size and leaves the copied path data untouched. crispEdges keeps
    // the pixel boundaries from being antialiased into a blur when
    // `size / 16` is not a whole number.
    `<g transform="scale(${size / 16})" shape-rendering="crispEdges">${body}</g>`,
  ].join("");
}

/** Draws a variant, then decides whether the layer is used at all. */
function choose(
  rng: Rng,
  group: Record<string, Sprite>,
  names: readonly string[],
  probability: number,
): Sprite | undefined {
  const name = names[rng.int(0, names.length)] as string;
  const keep = rng.next() < probability;
  return keep ? group[name] : undefined;
}

function pickFrom(rng: Rng, colors: readonly string[]): string {
  return colors[rng.int(0, colors.length)] ?? (colors[0] as string);
}
