import { generateAvatar, SEEDICON_STYLES } from "seedicon";
import { gallerySeedsFor } from "../lib/gallerySeeds";
import { STYLE_DOC_BY_NAME } from "../lib/styles";

/**
 * A static, server-rendered sample of every style. This is deliberately a
 * server component with no interactivity: it doubles as proof that the
 * package runs during SSR (no canvas, no window, no useEffect), which is
 * the main thing that separates seedicon from canvas-based generators.
 */

export function Gallery() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-x-5 gap-y-6">
      {SEEDICON_STYLES.map((style) => (
        <div key={style}>
          <h3 className="mb-1 font-mono text-[13px] font-semibold">
            <a href="/docs#styles" className="transition-colors hover:text-primary">
              {style}
            </a>
          </h3>
          {/* A fixed minimum keeps the avatar rows aligned across columns
              whether a tagline wraps to one line or to three. */}
          <p className="mb-3.5 min-h-9 text-xs leading-normal text-faint">
            {STYLE_DOC_BY_NAME[style].tagline}
          </p>
          <div className="flex flex-wrap gap-2">
            {gallerySeedsFor(style).map((seed) => (
              <span
                key={seed}
                title={seed}
                // The markup comes from seedicon itself, built from a
                // hard-coded seed in lib/gallerySeeds.ts — there is no user
                // input anywhere near it.
                dangerouslySetInnerHTML={{
                  __html: generateAvatar({
                    seed,
                    style,
                    size: 52,
                    shape: "rounded",
                  }),
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
