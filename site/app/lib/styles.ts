import type { SeediconStyle } from "seedicon";

/**
 * The prose that describes each style, in one place.
 *
 * Both the home page gallery and /docs read from here. Keeping it as data
 * rather than JSX means the same sentence can appear as a one-line caption
 * in the gallery and as a paragraph in the docs without drifting apart,
 * and it keeps apostrophes out of JSX text nodes.
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

export const STYLE_DOCS: StyleDoc[] = [
  {
    name: "pixels",
    tagline: "Mirrored pixel grid. Output-compatible with blockies.",
    export: "pixels",
    compatible: {
      label: "blockies",
      href: "https://github.com/download13/blockies",
    },
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
    inspiredBy: {
      label: "DiceBear Identicon",
      href: "https://www.dicebear.com/styles/identicon/",
    },
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
    compatible: {
      label: "Jdenticon",
      href: "https://github.com/dmester/jdenticon",
    },
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
    compatible: {
      label: "stellar-identicon-js",
      href: "https://github.com/Lobstrco/stellar-identicon-js",
    },
    body: [
      "The 7x7 mirrored grid Stellar wallets use, the one that looks like a space invader. There is no PRNG in the original: the picture is the key, base32-decoded and read bit by bit, so you can tell at a glance that an address is the one you expected.",
      "seedicon keeps that property. A real Stellar account key (56 base32 characters starting with G) is decoded exactly as the original does and produces the same image. Any other seed falls back to a SHA-1 digest, since an arbitrary string has no key bytes to read.",
    ],
    goodFor: "Stellar addresses, and anywhere the avatar is a verification aid.",
  },
  {
    name: "ring",
    tagline: "Concentric rings. The seed picks colors, count and thickness.",
    export: "ring",
    inspiredBy: {
      label: "Boring Avatars",
      href: "https://github.com/boringdesigners/boring-avatars",
    },
    body: [
      "Three to five filled circles stacked largest to smallest over a flat background, each in its own color, with a small off-center drift capped at 5% of the canvas.",
      "The composition is fixed on purpose. The seed chooses colors, ring count and ring widths, never placement, which is a much narrower space than scattering shapes anywhere. That is the failure mode of free-form generative avatars: they look considered on the seed you designed against and like a bug on the next one.",
    ],
    goodFor: "Consumer products that want color without a literal picture.",
  },
  {
    name: "lifehash",
    tagline: "A pattern grown with a Game of Life automaton.",
    export: "lifehash",
    inspiredBy: {
      label: "LifeHash",
      href: "https://github.com/BlockchainCommons/LifeHash",
    },
    body: [
      "A 12x12 Life automaton seeded from the hash, run for 12 generations on a wrapping grid, then mirrored. Cells are colored by how long they survived rather than by their final state, which is what produces the soft organic gradients instead of hard-edged noise.",
      "Blockchain Commons' LifeHash runs the same idea on a SHA-256 digest at high resolution, compiling the whole generation history into an image. That would mean shipping SHA-256 and emitting a thousand rectangles per avatar, so this is a lighter reimplementation of the mechanism, not a port. Same look, 144 cells worst case.",
    ],
    goodFor: "Organic texture at medium and large sizes.",
  },
  {
    name: "marble",
    tagline: "Two blurred organic blobs over a flat color.",
    export: "marble",
    inspiredBy: {
      label: "Boring Avatars",
      href: "https://github.com/boringdesigners/boring-avatars",
    },
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
    inspiredBy: {
      label: "DiceBear Waves",
      href: "https://www.dicebear.com/styles/waves/",
    },
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
      "It produces the smallest markup of any style, a couple of elements regardless of size, and it is the only one that stays legible at 12px, since there is no detail to lose.",
    ],
    goodFor: "Tiny avatars, and anywhere the markup budget is tight.",
  },
];

/** Lookup by style name, for components that iterate SEEDICON_STYLES. */
export const STYLE_DOC_BY_NAME = Object.fromEntries(
  STYLE_DOCS.map((doc) => [doc.name, doc]),
) as Record<SeediconStyle, StyleDoc>;
