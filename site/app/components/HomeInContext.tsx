"use client";

import { useState } from "react";
import { generateAvatar, type SeediconStyle } from "seedicon";

import InContext from "./InContext";

/**
 * The playground's "In context" panel, on the home page.
 *
 * Trimmed to the cards grid (profile, chat, notifications, comments,
 * assignees): the size ladder and member table are playground detail. The
 * home page has no seed field or style grid to drive it, so the seed is fixed
 * (the same wallet address as the rest of the page) and the panel's title
 * block is swapped for a short style picker.
 */

const SEED = "0xba32a6076cd558947b3da6148fc4994b421eed56";

/** A spread rather than all of them: a drawn character, two classic
 *  identicons, a crest and two soft abstract ones. */
const STYLES: SeediconStyle[] = [
  "pixels",
  "pixelart",
  "identicon",
  "heraldry",
  "marble",
  "gradient",
];

/** `shape: "rounded"` as a percentage, for the rings in the assignee stack. */
const ROUNDED_PERCENT = 22;

export function HomeInContext() {
  const [style, setStyle] = useState<SeediconStyle>("pixels");

  // Every seed that reaches generateAvatar is a constant, here or in
  // InContext's fake team, so the injected markup never carries user input.
  const render = (size: number, seed?: string) =>
    generateAvatar({ seed: seed ?? SEED, style, size, shape: "rounded" });

  const picker = (
    <div role="group" aria-label="Style" className="flex flex-wrap gap-1.5">
      {STYLES.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={style === option}
          onClick={() => setStyle(option)}
          className="
            flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[var(--c-border)]
            bg-[var(--c-card)] py-1 pl-1 pr-2.5 font-mono text-xs text-[var(--c-dim)] transition-colors
            hover:text-[var(--c-fg)] aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary
          "
        >
          <span
            className="block leading-none"
            dangerouslySetInnerHTML={{
              __html: generateAvatar({ seed: SEED, style: option, size: 20, shape: "rounded" }),
            }}
          />
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <InContext
      seed={SEED}
      radiusPercent={ROUNDED_PERCENT}
      render={render}
      header={picker}
      compact
    />
  );
}
