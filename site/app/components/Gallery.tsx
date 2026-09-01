import { generateAvatar, SEEDICON_STYLES } from "seedicon";

/**
 * A static, server-rendered sample of every style. This is deliberately a
 * server component with no interactivity: it doubles as proof that the
 * package runs during SSR (no canvas, no window, no useEffect), which is
 * the main thing that separates seedicon from canvas-based generators.
 */

/** One short line per style, shown under its column heading. */
const DESCRIPTIONS: Record<string, string> = {
  pixels: "Mirrored pixel grid. Output-compatible with blockies.",
  identicon: "Five symmetric rows — the classic dev-tool identicon.",
  jdenticon: "Geometric shapes, four-fold symmetry. Compatible with Jdenticon.",
  stellar: "7×7 mirrored bit grid. Compatible with Stellar addresses.",
  ring: "Concentric rings; the seed picks colors, count and thickness.",
  lifehash: "A pattern grown with a Game of Life automaton.",
  marble: "Two blurred organic blobs over a flat color.",
  waves: "Layered wave bands in shades of a single hue.",
  gradient: "A soft two or three stop diagonal gradient.",
};

/** Fixed seeds so the gallery is identical on every build and deploy. */
const SEEDS = [
  "romulo",
  "0xba32ff01a9c7e2d4",
  "550e8400-e29b-41d4-a716-446655440000",
  "ada@example.com",
  "user-000001",
];

export function Gallery() {
  return (
    <div className="gallery">
      {SEEDICON_STYLES.map((style) => (
        <div className="gallery-col" key={style}>
          <h3>{style}</h3>
          <p>{DESCRIPTIONS[style]}</p>
          <div className="gallery-row">
            {SEEDS.map((seed) => (
              <span
                key={seed}
                title={seed}
                // The markup comes from seedicon itself, built from a
                // hard-coded seed in this file — there is no user input
                // anywhere near it.
                dangerouslySetInnerHTML={{
                  __html: generateAvatar({
                    seed,
                    style,
                    size: 52,
                    radius: 14,
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
