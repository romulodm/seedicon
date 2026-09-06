import { generateAvatar } from "seedicon";

/**
 * The decorative grid beside the hero copy. Every tile is generated at
 * render time by the package itself — there is no image file here, which
 * is exactly the claim the page next to it is making.
 *
 * Read it as a table: each column is one id, each row is one style. The
 * same four seeds run down the grid, so you can see a single id keeping
 * its own palette while the shape changes.
 */

/** One row per style, chosen to look different from each other at 46px. */
const ROWS = ["pixels", "ring", "marble", "gradient"] as const;

/** Fixed ids — a wallet, a UUID, an email, a sequential user id. */
const SEEDS = [
  "0xba32a6076cd558947b3da6148fc4994b421eed56",
  "550e8400-e29b-41d4-a716-446655440000",
  "ada@example.com",
  "user-000001",
];

/** Small enough to read as an avatar slot rather than as artwork. */
const TILE = 46;

export function HeroIcons() {
  return (
    <div className="hero-icons" aria-hidden="true">
      {ROWS.map((style) =>
        SEEDS.map((seed) => (
          <span
            key={`${style}-${seed}`}
            title={`${seed} · ${style}`}
            // Hard-coded seeds from this file, rendered by seedicon into
            // numbers — no user input reaches this markup.
            dangerouslySetInnerHTML={{
              __html: generateAvatar({
                seed,
                style,
                size: TILE,
                radius: 12,
              }),
            }}
          />
        )),
      )}
    </div>
  );
}
