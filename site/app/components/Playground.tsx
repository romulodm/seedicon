"use client";

import { useMemo, useState } from "react";
import {
  generateAvatar,
  generateAvatarDataUri,
  SEEDICON_STYLES,
  type SeediconStyle,
} from "seedicon";

/**
 * The live playground. It imports the published package and calls it in
 * the browser — nothing here is a mock or a re-implementation, so if the
 * playground renders, the package works.
 *
 * Note the seed never reaches the DOM as markup: it goes through
 * seedicon's hash and only comes back out as numbers, so injecting the
 * returned SVG is safe even though the input is user-controlled.
 */

/** Sizes shown side by side, so you can judge how a style holds up small. */
const PREVIEW_SIZES = [96, 56, 40, 24, 16];

const DEFAULT_SEED = "550e8400-e29b-41d4-a716-446655440000";

export function Playground() {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [style, setStyle] = useState<SeediconStyle>("ring");
  const [size, setSize] = useState(96);
  const [radius, setRadius] = useState(24);
  const [copied, setCopied] = useState<string | null>(null);

  // An empty seed throws (by design), so the playground falls back to a
  // placeholder instead of blowing up while you're clearing the field.
  const activeSeed = seed.trim() || "seedicon";

  const svg = useMemo(
    () => generateAvatar({ seed: activeSeed, style, size, radius }),
    [activeSeed, style, size, radius],
  );

  const snippet = useMemo(
    () =>
      [
        `import { Avatar } from "seedicon/react";`,
        ``,
        `<Avatar`,
        `  seed="${activeSeed}"`,
        `  style="${style}"`,
        `  size={${size}}`,
        `  radius={${radius}}`,
        `/>`,
      ].join("\n"),
    [activeSeed, style, size, radius],
  );

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
      // Silently ignoring is fine — the text is visible and selectable.
    }
  }

  return (
    <div className="pg">
      <div>
        <div className="preview">
          {PREVIEW_SIZES.map((previewSize) => (
            <figure key={previewSize}>
              <span
                dangerouslySetInnerHTML={{
                  __html: generateAvatar({
                    seed: activeSeed,
                    style,
                    size: previewSize,
                    // Keep the corner rounding proportional so a 16px
                    // avatar looks like a smaller version of the 96px one
                    // rather than a differently-shaped icon.
                    radius: (radius / size) * previewSize,
                  }),
                }}
              />
              <figcaption>{previewSize}px</figcaption>
            </figure>
          ))}
        </div>

        <div className="code">
          <button
            className="copy"
            onClick={() => copy("snippet", snippet)}
            type="button"
          >
            {copied === "snippet" ? "copied" : "copy"}
          </button>
          <pre>{snippet}</pre>
        </div>

        <div className="actions">
          <button
            className="btn"
            type="button"
            onClick={() => copy("svg", svg)}
          >
            {copied === "svg" ? "Copied SVG" : "Copy SVG"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() =>
              copy(
                "uri",
                generateAvatarDataUri({ seed: activeSeed, style, size, radius }),
              )
            }
          >
            {copied === "uri" ? "Copied data URI" : "Copy data URI"}
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="field">
          <label htmlFor="seed">Seed</label>
          <input
            id="seed"
            type="text"
            value={seed}
            spellCheck={false}
            onChange={(event) => setSeed(event.target.value)}
            placeholder="any string"
          />
          <div className="actions">
            <button
              className="btn"
              type="button"
              onClick={() => setSeed(crypto.randomUUID())}
            >
              Random UUID
            </button>
          </div>
        </div>

        <div className="field">
          <label>Style</label>
          <div className="styles">
            {SEEDICON_STYLES.map((option) => (
              <button
                key={option}
                type="button"
                className="style-btn"
                data-active={option === style}
                onClick={() => setStyle(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="size">
            Size <span className="val">{size}px</span>
          </label>
          <input
            id="size"
            type="range"
            min={24}
            max={256}
            step={4}
            value={size}
            onChange={(event) => {
              const next = Number(event.target.value);
              setSize(next);
              // Radius can never exceed half the size, otherwise the SVG
              // clip path stops making sense — clamp it as size shrinks.
              setRadius((current) => Math.min(current, next / 2));
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="radius">
            Radius <span className="val">{Math.round(radius)}px</span>
          </label>
          <input
            id="radius"
            type="range"
            min={0}
            max={size / 2}
            step={1}
            value={radius}
            onChange={(event) => setRadius(Number(event.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
