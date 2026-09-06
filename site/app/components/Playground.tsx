"use client";

import { useMemo, useState } from "react";
import {
  generateAvatar,
  generateAvatarDataUri,
  SEEDICON_SHAPES,
  SEEDICON_STYLES,
  type SeediconShape,
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

/**
 * The corner is either one of the package's three presets or a radius you
 * set yourself. "custom" is this component's fourth option, not a value
 * `shape` accepts — picking it means the snippet emits `radius` instead.
 */
type CornerChoice = SeediconShape | "custom";

/** What each preset resolves to, mirrored from the package's resolveRadius. */
function presetRadius(shape: SeediconShape, size: number): number {
  if (shape === "square") return 0;
  if (shape === "circle") return size / 2;
  return size * 0.22;
}

export function Playground() {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [style, setStyle] = useState<SeediconStyle>("ring");
  const [size, setSize] = useState(96);
  const [corner, setCorner] = useState<CornerChoice>("rounded");
  const [customRadius, setCustomRadius] = useState(24);
  const [copied, setCopied] = useState<string | null>(null);

  // An empty seed throws (by design), so the playground falls back to a
  // placeholder instead of blowing up while you're clearing the field.
  const activeSeed = seed.trim() || "seedicon";

  const isCustom = corner === "custom";

  // Radius can never exceed half the size, otherwise the clip path stops
  // making sense — the package clamps it, and so does the slider.
  const radius = isCustom
    ? Math.min(customRadius, size / 2)
    : presetRadius(corner, size);

  // Presets are passed through as `shape` so the package resolves them.
  // A custom corner goes through `radius`, which overrides `shape`.
  const options = isCustom
    ? { shape: undefined, radius }
    : { shape: corner as SeediconShape, radius: undefined };

  const svg = useMemo(
    () => generateAvatar({ seed: activeSeed, style, size, ...options }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options is derived
    [activeSeed, style, size, corner, radius],
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
        isCustom ? `  radius={${Math.round(radius)}}` : `  shape="${corner}"`,
        `/>`,
      ].join("\n"),
    [activeSeed, style, size, corner, isCustom, radius],
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
                    // A preset already scales with the size. A custom
                    // radius does not, so it is kept proportional here —
                    // otherwise the 16px avatar reads as a differently
                    // shaped icon rather than a smaller version of the
                    // 96px one.
                    ...(isCustom
                      ? { radius: (radius / size) * previewSize }
                      : { shape: corner as SeediconShape }),
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
                generateAvatarDataUri({
                  seed: activeSeed,
                  style,
                  size,
                  ...options,
                }),
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
          <label>Shape</label>
          <div className="shapes">
            {[...SEEDICON_SHAPES, "custom" as const].map((option) => (
              <button
                key={option}
                type="button"
                className="style-btn"
                data-active={option === corner}
                onClick={() => {
                  // Switching to custom starts from whatever the current
                  // preset resolved to, so the avatar does not jump.
                  if (option === "custom") setCustomRadius(radius);
                  setCorner(option);
                }}
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
              setCustomRadius((current) => Math.min(current, next / 2));
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
            // Dragging the slider is itself the choice to set the corner
            // by hand, so it switches away from the preset instead of
            // requiring you to press "custom" first.
            onChange={(event) => {
              setCustomRadius(Number(event.target.value));
              setCorner("custom");
            }}
          />
        </div>
      </div>
    </div>
  );
}
