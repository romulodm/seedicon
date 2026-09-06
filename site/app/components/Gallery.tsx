import { generateAvatar, SEEDICON_STYLES } from "seedicon";
import { STYLE_DOC_BY_NAME } from "../lib/styles";

/**
 * A static, server-rendered sample of every style. This is deliberately a
 * server component with no interactivity: it doubles as proof that the
 * package runs during SSR (no canvas, no window, no useEffect), which is
 * the main thing that separates seedicon from canvas-based generators.
 */

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
          <h3>
            <a href="/docs#styles">{style}</a>
          </h3>
          <p>{STYLE_DOC_BY_NAME[style].tagline}</p>
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
