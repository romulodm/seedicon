import type { SeediconStyle } from "seedicon";

/**
 * The prose that describes each style, in one place.
 *
 * Both the home page gallery and /docs read from here. Keeping it as data
 * rather than JSX means the same sentence can appear as a one-line caption
 * in the gallery and as a paragraph in the docs without drifting apart,
 * and it keeps apostrophes out of JSX text nodes.
 *
 * Deprecated styles have no entry here on purpose. The site is built from
 * SEEDICON_STYLES, which does not list them, so anything retired stays
 * resolvable in code without appearing anywhere a reader would find it.
 */

export interface StyleDoc {
  /** The value you pass as `style`. */
  name: SeediconStyle;
  /** One line, used under the gallery heading. */
  tagline: string;
  /** Named export of the single-style entry point. */
  export: string;
  /**
   * Set when the style reproduces another library byte for byte. The test
   * suite compares against the original package on every run, so this is
   * a checked claim rather than an intention.
   */
  compatible?: { label: string; href: string };
  /** Set when the style borrows an idea without reproducing the output. */
  inspiredBy?: { label: string; href: string };
  /** Body paragraphs for the docs page. */
  body: string[];
  /** When this style is the right pick. */
  goodFor: string;
}

const DICEBEAR = "https://www.dicebear.com";

export const STYLE_DOCS: StyleDoc[] = [
  {
    name: "pixels",
    tagline: "Mirrored pixel grid. Output-compatible with blockies.",
    export: "pixels",
    body: [
      "An 8x8 grid mirrored down the middle, filled from a background, a foreground and a spot color. It is the wallet avatar you already know: blockies is what MetaMask and Etherscan render, and this is a port of that algorithm rather than a lookalike.",
      "The port is exact, down to the order the random draws happen in and the loose int32 arithmetic in the original PRNG. The test suite renders both libraries for the same seeds and compares cell by cell and color by color, so an app already showing blockies can switch without a single user getting a new picture.",
      "One thing to watch: an Ethereum address exists lowercase and checksummed, and those are different strings, so they produce different avatars. blockies behaves the same way. Keep passing whatever your app passes today, or normalize once at the edge with address.toLowerCase().",
    ],
    goodFor: "Wallet UIs, and any app migrating off blockies.",
  },
  {
    name: "identicon",
    tagline: "Five symmetric rows. The classic dev-tool identicon.",
    export: "identicon",
    body: [
      "A 5x5 grid where every row is one of seven horizontally symmetric bit patterns. Because each row is a palindrome, no seed can produce something that reads as a rendering error, and with 7^5 = 16,807 arrangements the shapes stay recognizable at 16px instead of dissolving into noise.",
      "The geometry vocabulary comes from DiceBear's Identicon style; the colors are seedicon's own, derived from the seed like every other style here. It is the same idea with our color model, not a compatible reproduction.",
    ],
    goodFor: "Dense lists and tables, where avatars are small and many.",
  },
  {
    name: "jdenticon",
    tagline: "Geometric shapes, four-fold symmetry. Compatible with Jdenticon.",
    export: "jdenticon",
    body: [
      "A SHA-1 digest of the seed selects from 18 shape definitions, placed on a 4x4 grid with four-fold rotational symmetry and painted from a five-color theme. A faithful port: the digest, which hex character picks which shape, the theme, the lightness correction table and the geometry are all reproduced exactly.",
      "The single addition is an opaque background. Jdenticon defaults to transparent, which is fine for an inline icon but not for a profile picture, and the corner clip needs a surface to cut. No shape changes.",
    ],
    goodFor: "Apps already rendering Jdenticon on another platform.",
  },
  {
    name: "stellar",
    tagline: "7x7 mirrored bit grid. Reads real Stellar keys.",
    export: "stellar",
    body: [
      "The 7x7 mirrored grid Stellar wallets use, the one that looks like a space invader. There is no PRNG in the original: the picture is the key, base32-decoded and read bit by bit, so you can tell at a glance that an address is the one you expected.",
      "seedicon keeps that property. A real Stellar account key (56 base32 characters starting with G) is decoded exactly as the original does and produces the same image. Any other seed falls back to a SHA-1 digest, since an arbitrary string has no key bytes to read.",
    ],
    goodFor: "Stellar addresses, and anywhere the avatar is a verification aid.",
  },
  {
    name: "randomart",
    tagline: "The drunken bishop from ssh-keygen, drawn in color.",
    export: "randomart",
    body: [
      "The algorithm ssh-keygen prints next to a key fingerprint. A bishop walks a bounded board, taking one diagonal step per pair of bits read from the digest, and every square counts how many times it was stepped on. Walls neither wrap nor bounce: a move that would leave the board loses the component that would have gone off it, so the bishop slides along the edge.",
      "Two departures from the original. The board is square, 11 by 11, because 17 by 9 letterboxes badly in an avatar slot and is unreadable small. And the bits come from SHA-1 rather than MD5, since this package already ships SHA-1 for two other styles and its 20 bytes give 80 moves.",
      "Where ssh-keygen maps the visit counts to characters, this maps them to lightness. Squares crossed once are barely there and the ones the bishop kept returning to glow, which is what turns a walk into a picture.",
    ],
    goodFor: "SSH-adjacent tools, and anywhere the avatar should feel like a fingerprint.",
  },
  {
    name: "lifehash",
    tagline: "A pattern grown with a Game of Life automaton.",
    export: "lifehash",
    body: [
      "A 12x12 Life automaton seeded from the hash, run for 12 generations on a wrapping grid, then mirrored. Cells are colored by how long they survived rather than by their final state, which is what produces the soft organic gradients instead of hard-edged noise.",
      "Blockchain Commons' LifeHash runs the same idea on a SHA-256 digest at high resolution, compiling the whole generation history into an image. That would mean shipping SHA-256 and emitting a thousand rectangles per avatar, so this is a lighter reimplementation of the mechanism, not a port. Same look, 144 cells worst case.",
    ],
    goodFor: "Organic texture at medium and large sizes.",
  },
  {
    name: "dither",
    tagline: "A two-tone gradient through a Bayer threshold matrix.",
    export: "dither",
    body: [
      "Every cell computes a value along a gradient, then compares it against a threshold from a Bayer 4x4 matrix tiled across the grid. Because the matrix spreads its sixteen thresholds as far apart on the grid as they are close in value, the cells that switch on interlock into the familiar checker texture, and two colors read as a continuous ramp.",
      "The gradient is normalized against its own range over the canvas corners, so the ramp always spans the full distance whichever direction the seed picked. Without that step an off-axis gradient leaves most of the tile on one side of every threshold and the avatar comes out nearly blank.",
      "Both tones are shades of one hue on purpose. Two unrelated hues would read as a checkerboard of two things rather than as one color fading into another.",
    ],
    goodFor: "Interfaces with a retro or terminal feel, at any size.",
  },
  {
    name: "pixelart",
    tagline: "A pixel-art character with hair, eyes and a top.",
    export: "pixelart",
    body: [
      "The one style here that is not an algorithm. Every other renderer computes its picture; this one assembles it from 139 sprites somebody drew — 45 hairstyles, 23 tops, 23 mouths, 14 pairs of glasses, 12 pairs of eyes, 10 hats, 8 beards and 4 accessories — layered over a fixed body in a fixed order. Glasses, hats, beards and accessories are accents that show up rarely, which is why most faces are plain and the occasional one is not.",
      "The artwork is DiceBear's Pixel Art, dedicated to the public domain under CC0 1.0, and copied here unchanged. The randomization is seedicon's own, so the same seed does not produce the same face that @dicebear/pixel-art would.",
      "It is also the only figurative style in the package. The rest are abstract marks — you cannot tell whose avatar it is, only that it is theirs. This one is a face, with a skin tone and gender-coded features, which means a user ID ends up assigning somebody an appearance. Some products want exactly that. Others deliberately do not, and that is worth deciding rather than defaulting into.",
    ],
    goodFor: "Consumer products and games, where a character beats an abstract mark.",
  },
  {
    name: "truchet",
    tagline: "Quarter-circle tiles that always join into loops.",
    export: "truchet",
    body: [
      "A grid where every cell draws two quarter-circle arcs in one of two orientations. Both orientations put an arc endpoint at the midpoint of all four cell edges, so whatever the neighbours chose, the curves meet.",
      "That is the whole design: the seed contributes exactly one bit per cell, and the result is always one or more continuous loops wandering the tile, never a loose end. It is the same trick that makes Truchet tiles work on a bathroom floor.",
    ],
    goodFor: "Anywhere you want pattern rather than a figure, at 32px and up.",
  },
  {
    name: "heraldry",
    tagline: "A division of the field with a charge over it.",
    export: "heraldry",
    body: [
      "Real heraldry works from a closed vocabulary: a shield is described by naming a division and a charge, not by drawing coordinates. This picks one of ten divisions (per pale, per fess, per bend, quarterly, per saltire, barry and the rest) and lays one of nine charges over it — roundel, annulet, lozenge, mullet, cross, chevron, pile, billet, crescent.",
      "It is by a wide margin the smallest output in the package: two or three elements, around three hundred bytes, and it stays readable at 16px because everything on it is a large flat area.",
      "The cost of that is entropy. Ten divisions and nine charges give ninety silhouettes, so across a large user base the shape repeats and the colors do the separating. Prefer it where avatars are seen a few at a time rather than in a directory of ten thousand.",
    ],
    goodFor: "Small avatars, tight markup budgets, and anything with a crest-like feel.",
  },
  {
    name: "kaleidoscope",
    tagline: "Shapes folded around a center with N-fold symmetry.",
    export: "kaleidoscope",
    body: [
      "A handful of shapes drawn once inside a wedge, then repeated around the center five to eight times and mirrored. Symmetry does the work a narrow parameter range does elsewhere: scattered shapes are the classic way a generative avatar goes wrong, but the same scatter folded around a center reads as a mandala no matter where the shapes landed.",
      "The wedge is emitted once into defs and referenced with use. At eight-fold symmetry with a mirror, writing the markup out sixteen times would have quadrupled the size of the output.",
    ],
    goodFor: "Decorative avatars at medium and large sizes.",
  },
  {
    name: "streamlines",
    tagline: "Particles combed through a seeded vector field.",
    export: "streamlines",
    body: [
      "Particles released on a grid and stepped through a vector field, each leaving a polyline behind. The field is a sum of two sines rather than a noise function, which is the whole trick: Perlin noise would mean shipping a permutation table, while sin(fx) + cos(fy) costs four numbers and produces the same swirling, hair-like structure.",
      "Because every particle in a region reads the same field, neighbouring lines stay roughly parallel and the result always looks combed rather than tangled. There is no seed that produces a scribble.",
      "It is the most expensive style in the package in markup terms — 36 lines of a dozen segments each. If you render many avatars per page and the HTML size matters, gradient and heraldry cost a tenth of it.",
    ],
    goodFor: "Large avatars and profile headers, where the detail has room.",
  },
  {
    name: "moire",
    tagline: "Line gratings at close angles, beating against each other.",
    export: "moire",
    body: [
      "Two or three line gratings laid over each other. The visible pattern is not the lines, it is the beat between them, and the beat's wavelength goes as roughly gap over sin of the angle difference.",
      "That relationship is the entire design constraint. At a large angle difference the beat is finer than the lines themselves and the tile flattens into gray at any avatar size, which is exactly what a first cut at this style did. So the extra gratings are pinned to within 6 to 26 degrees of the first, where the beat comes out several times coarser than the grating and survives being looked at from across a screen.",
      "Gaps are fractions of the size rather than fixed units, so the pattern is the same picture at 24px and at 256px.",
    ],
    goodFor: "Op-art and print-inspired interfaces, at 40px and up.",
  },
  {
    name: "terrain",
    tagline: "Five landscape ridges stacked over a flat sky.",
    export: "terrain",
    body: [
      "Five ridges front to back over a flat sky, with an optional sun placed behind them. Back layers sit high and shallow, front layers low and jagged, which is the whole of the depth cue. Every layer is a shade of one hue.",
      "The composition is completely fixed, so no seed can produce something that reads as broken. The tradeoff is worth knowing before picking it: because the structure never varies, two seeds differ mostly in color and peak placement. It reads as scenery more than as an identity mark.",
    ],
    goodFor: "Calm, atmospheric products; large avatars and cover images.",
  },
  {
    name: "marble",
    tagline: "Two blurred organic blobs over a flat color.",
    export: "marble",
    body: [
      "Blobs built from randomized-radius points around a circle, smoothed with quadratic curves and blurred, layered over a flat background color.",
      "The silhouette is generated rather than picked from a fixed set of drawings, so two seeds never share an outline. It is the softest style here and the one that reads best at large sizes, where the blur has room to show.",
    ],
    goodFor: "Profile headers and cards, where the avatar is large.",
  },
  {
    name: "waves",
    tagline: "Layered wave bands in shades of a single hue.",
    export: "waves",
    body: [
      "Four to six bands stacked bottom-up in shades of one hue, with lightness moving in a single direction. The seed picks the hue and the direction, never the colors independently, so no seed can produce a clashing pair.",
      "Wave amplitude is capped below half the spacing between bands. Each band paints over everything below it, so if two crests could cross, the upper band would swallow the lower one and the avatar would collapse into two flat areas. The cap makes that impossible, which is why every band always stays visible.",
      "DiceBear's Waves ships as paths exported from a design tool, so this is not a port: the bands here are generated, and every seed gets its own silhouette.",
    ],
    goodFor: "Calm, low-contrast avatars that do not fight the UI.",
  },
  {
    name: "gradient",
    tagline: "A soft two or three stop diagonal gradient.",
    export: "gradient",
    body: [
      "Two or three color stops on a linear gradient at a seed-derived angle. No grid, no shapes: closest to a design tool's random gradient button, except reproducible.",
      "It produces the smallest markup of any generated style, a couple of elements regardless of size, and it stays legible at 12px since there is no detail to lose.",
    ],
    goodFor: "Tiny avatars, and anywhere the markup budget is tight.",
  },
];

/** Lookup by style name, for components that iterate SEEDICON_STYLES. */
export const STYLE_DOC_BY_NAME = Object.fromEntries(
  STYLE_DOCS.map((doc) => [doc.name, doc]),
) as Record<SeediconStyle, StyleDoc>;
