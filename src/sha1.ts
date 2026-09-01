/**
 * SHA-1, used only where a ported algorithm requires it (the `jdenticon`
 * style derives everything from a SHA-1 hex digest, and `stellar` needs
 * a stable 16-byte block).
 *
 * Yes, SHA-1 is broken for cryptography. That is irrelevant here: these
 * algorithms use it purely as a deterministic bit source for choosing
 * shapes and colors, and picking a different hash would change every
 * avatar the original libraries produce. Do not use this for anything
 * security-sensitive.
 *
 * Written from scratch (no dependency) and operating on UTF-8 bytes, so
 * the digest matches what any other SHA-1 implementation gives for the
 * same string, on every platform.
 */

/** Encodes a JS string to UTF-8 bytes without depending on TextEncoder. */
function utf8Bytes(input: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let code = input.charCodeAt(i);

    // Combine a surrogate pair into a single code point before encoding,
    // otherwise emoji and other astral characters would hash as two
    // broken halves instead of one character.
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < input.length) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
        i++;
      }
    }

    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    }
  }
  return bytes;
}

function rotl(value: number, shift: number): number {
  return (value << shift) | (value >>> (32 - shift));
}

/** Returns the SHA-1 digest of `input` as 40 lowercase hex characters. */
export function sha1(input: string): string {
  const bytes = utf8Bytes(input);
  const bitLength = bytes.length * 8;

  // Padding: a single 1 bit, then zeros, then the 64-bit length.
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  // The high 32 bits of the length are always 0 for any realistic seed.
  bytes.push(0, 0, 0, 0);
  bytes.push(
    (bitLength >>> 24) & 0xff,
    (bitLength >>> 16) & 0xff,
    (bitLength >>> 8) & 0xff,
    bitLength & 0xff,
  );

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Array<number>(80);

  for (let block = 0; block < bytes.length; block += 64) {
    for (let i = 0; i < 16; i++) {
      const o = block + i * 4;
      w[i] =
        ((bytes[o] as number) << 24) |
        ((bytes[o + 1] as number) << 16) |
        ((bytes[o + 2] as number) << 8) |
        (bytes[o + 3] as number);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(
        (w[i - 3] as number) ^
          (w[i - 8] as number) ^
          (w[i - 14] as number) ^
          (w[i - 16] as number),
        1,
      );
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (rotl(a, 5) + f + e + k + (w[i] as number)) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  return [h0, h1, h2, h3, h4]
    .map((word) => (word >>> 0).toString(16).padStart(8, "0"))
    .join("");
}

/** The digest as bytes, for algorithms that want raw bits, not hex. */
export function sha1Bytes(input: string): number[] {
  const hex = sha1(input);
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}
