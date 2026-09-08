<div align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/romulodm/seedicon/main/assets/seedicon-logo.png" alt="seedicon" width="120" />
  </picture>

  # seedicon

  **Deterministic SVG avatars generated from any string — a wallet address, a UUID, a user id, an email.**

  Same seed in, same avatar out, every time, forever. No image storage, no uploads, no CDN, no dependencies.

  [![Docs](https://img.shields.io/badge/docs-seedicon.romulodm.dev-7c7cff)](https://seedicon.romulodm.dev/docs)
  [![npm version](https://img.shields.io/npm/v/seedicon.svg?style=flat)](https://www.npmjs.com/package/seedicon)
  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/romulodm/seedicon/blob/main/LICENSE)
  [![CI](https://github.com/romulodm/seedicon/actions/workflows/ci.yml/badge.svg)](https://github.com/romulodm/seedicon/actions/workflows/ci.yml)

  **<img src="https://api.iconify.design/lucide/book-open.svg?color=%237c7cff&width=16" align="absmiddle"> Full documentation and live playground: [seedicon.romulodm.dev](https://seedicon.romulodm.dev)**
</div>

<!-- TODO: imagens de exemplo dos estilos (screenshots do site) -->

```
npm install seedicon
```

## Why

If you let users upload a profile picture, you also have to store it, resize
it, moderate it, and serve it. Most apps don't need any of that — they need
*something* in the avatar slot that's consistent and looks intentional.
`seedicon` generates that on the fly from a seed you already have, so the only
thing you store is a string, or nothing at all if you derive it from the user's
id at render time.

## Usage

```ts
import { generateAvatar } from "seedicon";

const svg = generateAvatar({ seed: "0xba32...eD56" });
// '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" ...>...</svg>'
```

`svg` is a plain string — write it to a file, inject it with `innerHTML`, or
embed it as a data URI:

```ts
import { generateAvatarDataUri } from "seedicon";

const src = generateAvatarDataUri({ seed: user.id });
// <img src="data:image/svg+xml,..." />
```

### React

```tsx
import { Avatar } from "seedicon/react";

<Avatar seed={user.walletAddress} style="pixels" size={40} shape="circle" />;
```

Rendering is synchronous and produces SVG, not canvas — no `useEffect` + ref
dance, no flash of an empty avatar, and it works during server-side rendering
(Next.js, Remix, and anything else without `canvas` or `window`). `react` is an
optional peer dependency, needed only if you import from `seedicon/react`.

## Options

```ts
generateAvatar({
  seed: "anything",   // required — the only thing that determines the output
  style: "pixels",    // one of the 21 style names — default "pixels"
  size: 64,           // SVG width/height in user units — default 64
  shape: "square",    // "square" | "rounded" | "circle" — default "square"
  radius: 0,          // exact corner radius; overrides `shape` when passed
});
```

### Shape

The corner is a `shape` preset, or a `radius` when none of the three presets is
the rounding you want:

```ts
generateAvatar({ seed, shape: "square" });   // radius 0            — the default
generateAvatar({ seed, shape: "rounded" });  // radius size * 0.22
generateAvatar({ seed, shape: "circle" });   // radius size / 2

generateAvatar({ seed, size: 64, radius: 14 });         // exact corner
generateAvatar({ seed, shape: "circle", radius: 12 });  // radius wins
```

A preset is a fraction of `size` rather than a fixed number of pixels, so the
same `shape` holds at 16px and at 256px — prefer it over a hard-coded radius
when one avatar appears at several sizes. `radius` is clamped to `[0, size / 2]`;
half the size is already a circle. The corner is a clip over the finished
artwork, so it behaves identically for every style.

## Styles

Twenty-one styles ship in the package — pixel grids, identicons, generative
patterns and sprite-based characters. `SEEDICON_STYLES` is the full list at
runtime, in order:

```ts
import { SEEDICON_STYLES } from "seedicon";

SEEDICON_STYLES; // ["pixels", "identicon", "jdenticon", ...]
```

Build a style picker from that array rather than hard-coding names. Every style
is rendered, described and seedable side by side at
[seedicon.romulodm.dev/docs](https://seedicon.romulodm.dev/docs).

### Importing a single style

The package root resolves styles by name, so it references all twenty-one and
no bundler can drop the ones you never call. If you only use one style, import
it directly and you get that renderer plus the shared core — nothing else:

```ts
import { quilt, quiltDataUri } from "seedicon/quilt";

const svg = quilt({ seed: user.id, size: 40, shape: "circle" });
```

Every style has an entry point named after it — `seedicon/pixels`,
`seedicon/heraldry`, `seedicon/pixelart`, and so on. The saving is real:
`seedicon/heraldry` is about 2.3KB gzipped against 21KB for the root entry. The
`<Avatar>` component takes style names, so it pulls in the whole registry — if
bundle size matters more than the convenience, call the single-style function
and render the markup yourself.

## Determinism

`seedicon` has no randomness and no I/O. The same `{ seed, style, size, shape,
radius }` always produces byte-for-byte identical SVG markup, on any platform.
It is not a cryptographic hash — don't use it for anything security-sensitive —
it only needs to spread seeds out visually, which a fast 32-bit hash does well
enough.

One consequence worth knowing: seeds are compared as raw strings. An Ethereum
address in lowercase and the same address checksummed are different strings and
give different avatars. `seedicon` deliberately does not normalize, because
usernames and emails are seeds too and `Maria` should be free to differ from
`maria`. Normalize once at your edge if you need one canonical form:

```ts
<Avatar seed={address.toLowerCase()} />
```

## Credits

Three styles are ports of published algorithms, reimplemented here to emit SVG
instead of painting to a canvas. Their licenses require the notice to travel
with the code:

- **pixels** — blockies by Erin Dachtler and Alex Van de Sande (MIT).
- **jdenticon** — Jdenticon by Daniel Mester Pirttijärvi (MIT).
- **stellar** — stellar-identicon-js by Lobstrco (ISC).

The test suite compares seedicon's output against the original packages on
every run, so a seed that has an avatar today keeps it.

Three other styles (**pixelart**) draw DiceBear's
public-domain sprite artwork (CC0 1.0), driven by seedicon's own PRNG; the
**identicon** and **waves** layouts follow DiceBear's as well. **randomart** is
the drunken bishop walk from OpenSSH's `ssh-keygen`, on a square board with
visit counts mapped to color. **lifehash** uses the same mechanism as Blockchain
Commons' LifeHash (BSD-2-Clause): a Life automaton colored by cell age.

The remaining eleven — **truchet**, **shapes**, **quilt**, **heraldry**, **kaleidoscope**,
**braid**, **streamlines**, **moire**, **terrain**, **dither** and **gradient**
— are built here from ideas nobody owns: Truchet tiling, quilt blocks, the
heraldic vocabulary, radial symmetry, weaving, flow fields, moiré interference,
layered ridges and ordered dithering.

## License

[MIT](https://github.com/romulodm/seedicon/blob/main/LICENSE) © 2026 Romulo

Free for commercial use, modification and redistribution — the one condition is
that the copyright notice travels with the code. The three ported styles keep
the licenses of their originals, listed under [Credits](#credits).
