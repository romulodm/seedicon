import { renderAvatar, toDataUri, type StyleOptions } from "../core.js";
import { renderTerrain } from "../styles/terrain.js";

/**
 * Single-style entry point: `seedicon/terrain`.
 *
 * Five landscape ridges stacked over a flat sky.
 *
 * Import this instead of the package root when you only use one style —
 * it pulls in this renderer and the shared core, and none of the other
 * seventeen. The root entry (`seedicon`) resolves styles by name, which
 * means it has to reference all of them and no bundler can drop the ones
 * you never call.
 *
 * ```ts
 * import { terrain } from "seedicon/terrain";
 *
 * const svg = terrain({ seed: user.id, size: 40, shape: "circle" });
 * ```
 */
export function terrain(options: StyleOptions): string {
  return renderAvatar(renderTerrain, "terrain", options);
}

/** Same as {@link terrain}, as a `data:image/svg+xml` URI. */
export function terrainDataUri(options: StyleOptions): string {
  return toDataUri(terrain(options));
}

export type { StyleOptions };
