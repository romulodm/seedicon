/**
 * Live package stats, fetched at build/revalidate time on the server.
 *
 * Every endpoint here is public and unauthenticated, so there are no
 * secrets to configure — but that also means they're rate limited (the
 * GitHub one aggressively so, per IP). Everything therefore fails soft:
 * a failed fetch returns null and the UI renders a dash instead of the
 * number, which is much better than a stats widget taking the page down.
 */

/** How long a fetched value stays cached before Next.js refetches it. */
const REVALIDATE_SECONDS = 60 * 60; // 1 hour

const PACKAGE_NAME = "seedicon";
const GITHUB_REPO = "romulodm/seedicon";

export interface PackageStats {
  /** Downloads in the last 7 days, or null if npm didn't answer. */
  weeklyDownloads: number | null;
  /** Latest published version, or null if the package isn't on npm yet. */
  version: string | null;
  /** GitHub stargazers, or null if the API didn't answer. */
  stars: number | null;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      // A plain User-Agent keeps GitHub from rejecting the request; npm
      // doesn't care but it costs nothing to be identifiable.
      headers: { "User-Agent": "seedicon-site" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // Network error, DNS failure, rate limit that closed the connection —
    // none of it should ever break the page render.
    return null;
  }
}

export async function getPackageStats(): Promise<PackageStats> {
  // Fired in parallel: three independent endpoints, no reason to wait on
  // one before starting the next.
  const [downloads, registry, repo] = await Promise.all([
    fetchJson<{ downloads: number }>(
      `https://api.npmjs.org/downloads/point/last-week/${PACKAGE_NAME}`,
    ),
    fetchJson<{ version: string }>(
      `https://registry.npmjs.org/${PACKAGE_NAME}/latest`,
    ),
    fetchJson<{ stargazers_count: number }>(
      `https://api.github.com/repos/${GITHUB_REPO}`,
    ),
  ]);

  return {
    weeklyDownloads: downloads?.downloads ?? null,
    version: registry?.version ?? null,
    stars: repo?.stargazers_count ?? null,
  };
}

/** 1234 -> "1,234". Renders an em dash when the value is missing. */
export function formatCount(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("en-US");
}

export const LINKS = {
  npm: `https://www.npmjs.com/package/${PACKAGE_NAME}`,
  github: `https://github.com/${GITHUB_REPO}`,
  license: `https://github.com/${GITHUB_REPO}/blob/main/LICENSE`,
} as const;
