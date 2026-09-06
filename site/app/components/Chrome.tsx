import { generateAvatar } from "seedicon";
import { LINKS } from "../lib/stats";

/**
 * Navbar and footer, shared by the home page and /docs.
 *
 * The mark is the `pixels` style seeded with the author's wallet address,
 * generated on every render by the package this site documents. There is
 * no logo file to keep in sync, and it is the same code path a consumer
 * gets. The favicon set in app/ is this exact seed, pre-rendered.
 */
export const BRAND_SEED = "0xba32a6076cd558947b3da6148fc4994b421eed56";

export function Nav({ current }: { current?: "home" | "docs" }) {
  return (
    <header className="wrap">
      <nav className="nav">
        <a className="nav-brand" href="/">
          <span
            dangerouslySetInnerHTML={{
              __html: generateAvatar({
                seed: BRAND_SEED,
                style: "pixels",
                size: 26,
                radius: 6,
              }),
            }}
          />
          seedicon
        </a>
        <div className="nav-links">
          <a href="/docs" aria-current={current === "docs" ? "page" : undefined}>
            Docs
          </a>
          <a href="/#playground">Playground</a>
          <a href={LINKS.npm} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="wrap">
      <span>MIT · built by Romulo</span>
      <span>
        <a href="/docs">Docs</a>
        {" · "}
        <a href={LINKS.npm} target="_blank" rel="noreferrer">
          npm
        </a>
        {" · "}
        <a href={LINKS.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </span>
    </footer>
  );
}
