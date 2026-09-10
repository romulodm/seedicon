import {
  generateAvatar,
  generateAvatarDataUri,
  type SeediconStyle,
} from "seedicon";

import { CODE_BOX } from "../lib/ui";
import { STYLE_DOC_BY_NAME } from "../lib/styles";
import { CopyAction, CopyChip } from "./ui/CopyText";
import Link from "next/dist/client/link";

/**
 * Two styles of the same seed, side by side, rendered on the server.
 *
 * This replaced the interactive playground that used to sit on the home page.
 * The trade was deliberate: the full playground lives at /playground, and
 * moving it off the landing page means seedicon is no longer in the home
 * page's client bundle at all — every avatar below is markup produced during
 * the build, which is also the plainest possible demonstration that the
 * package runs during SSR.
 *
 * The seed is a constant in this file, so the markup handed to
 * dangerouslySetInnerHTML never has user input anywhere near it.
 */

/** An Ethereum-style address: the shape of ID most people arrive holding. */
const SHOWCASE_SEED = "0xba32a6076cd558947b3da6148fc4994b421eed56";

/** One figurative style and one abstract one — the two ends of the package. */
const SHOWCASE_STYLES = ["pixelart", "randomart"] as const;

/** Sizes shown side by side, so you can judge how a style holds up small. */
const PREVIEW_SIZES = [96, 56, 40, 24, 16];

/** What the snippet and the copy buttons describe. */
const BASE_SIZE = 96;
const SHAPE = "rounded" as const;

function StyleCard({ style }: { style: SeediconStyle }) {
  const options = { seed: SHOWCASE_SEED, style, shape: SHAPE } as const;

  const snippet = [
    `import { Avatar } from "seedicon/react";`,
    ``,
    `<Avatar`,
    `  seed="${SHOWCASE_SEED}"`,
    `  style="${style}"`,
    `  size={${BASE_SIZE}}`,
    `  shape="${SHAPE}"`,
    `/>`,
  ].join("\n");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Link
          href="/docs#styles"
          className="font-mono text-[13px] font-semibold transition-colors hover:text-primary"
        >
          {style}
        </Link>
        <span className="text-xs text-faint">
          {STYLE_DOC_BY_NAME[style].tagline}
        </span>
      </div>

      {/* A fixed minimum height keeps the two cards' code blocks level even
          though the taglines above wrap to different numbers of lines. */}
      <div className="mb-5 flex min-h-[150px] flex-wrap items-end gap-5 border-b border-border pb-6 pt-6">
        {PREVIEW_SIZES.map((size) => (
          <figure key={size} className="text-center">
            <span
              dangerouslySetInnerHTML={{
                __html: generateAvatar({ ...options, size }),
              }}
            />
            <figcaption className="mt-2 font-mono text-[10px] leading-none text-faint">
              {size}px
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Not CODE_PRE: at half the container's width the seed alone is
          longer than the box, so these two blocks run a point smaller than
          the site's other code, and the right padding is what keeps the
          import line from disappearing under the copy chip. */}
      <div className={CODE_BOX}>
        <CopyChip value={snippet} />
        <pre className="pr-14 font-mono text-[12px] leading-[1.65] text-foreground/85">
          {snippet}
        </pre>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <CopyAction
          value={generateAvatar({ ...options, size: BASE_SIZE })}
          label="Copy SVG"
          copiedLabel="Copied SVG"
        />
        <CopyAction
          value={generateAvatarDataUri({ ...options, size: BASE_SIZE })}
          label="Copy data URI"
          copiedLabel="Copied data URI"
        />
      </div>
    </div>
  );
}

/**
 * The single hairline between the two is drawn by the second card's leading
 * edge, so it follows the grid: a left border while they sit side by side, a
 * top border once they stack. The gap is padding on either side of that edge
 * rather than a grid gap, which is what keeps the line centred between them
 * instead of hugging one card.
 */
const CARD_FIRST = "pb-10 min-[760px]:pb-0 min-[760px]:pr-8";
const CARD_SECOND =
  "border-t border-border pt-10 min-[760px]:border-l min-[760px]:border-t-0 min-[760px]:pl-8 min-[760px]:pt-0";

export function AvatarShowcase() {
  return (
    <div className="grid grid-cols-1 min-[760px]:grid-cols-2">
      {SHOWCASE_STYLES.map((style, index) => (
        <div key={style} className={index === 0 ? CARD_FIRST : CARD_SECOND}>
          <StyleCard style={style} />
        </div>
      ))}
    </div>
  );
}
