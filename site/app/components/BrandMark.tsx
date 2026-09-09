import { generateAvatar } from "seedicon";

import { BRAND_SEED } from "../lib/brand";

/**
 * The wordmark's icon, generated on every render by the package itself.
 * `generateAvatar` is pure and dependency-free, so this works unchanged in a
 * server component, in a client component and during SSR.
 */
export default function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0"
      dangerouslySetInnerHTML={{
        __html: generateAvatar({
          seed: BRAND_SEED,
          style: "pixels",
          size,
          shape: "rounded",
        }),
      }}
    />
  );
}
