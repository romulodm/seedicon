import { generateAvatar } from "seedicon";
import { Gallery } from "./components/Gallery";
import { Playground } from "./components/Playground";
import { formatCount, getPackageStats, LINKS } from "./lib/stats";

// Re-render the page (and refetch the stats) at most once an hour. Between
// revalidations every visitor is served static HTML from the edge cache.
export const revalidate = 3600;

export default async function Home() {
  const stats = await getPackageStats();

  return (
    <>
      <header className="wrap">
        <nav className="nav">
          <a className="nav-brand" href="/">
            <span
              dangerouslySetInnerHTML={{
                __html: generateAvatar({
                  seed: "seedicon",
                  style: "ring",
                  size: 26,
                  radius: 8,
                }),
              }}
            />
            seedicon
          </a>
          <div className="nav-links">
            <a href="#playground">Playground</a>
            <a href={LINKS.npm} target="_blank" rel="noreferrer">
              npm
            </a>
            <a href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </nav>
      </header>

      <main className="wrap">
        <div className="hero">
          <h1>
            Avatars from
            <br />
            a string.
          </h1>
          <p>
            <strong>seedicon</strong> turns any string — a UUID, a user id,
            a wallet address — into a deterministic SVG avatar. Same seed
            in, same avatar out, forever. Nothing is uploaded, stored,
            resized or moderated: the only thing you keep is the id you
            already had.
          </p>
          <div className="hero-row">
            <a className="btn btn-primary" href="#playground">
              Try it
            </a>
            <a
              className="btn"
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>
            <code
              style={{
                fontFamily: "var(--mono)",
                fontSize: 14,
                color: "var(--text-dim)",
                padding: "11px 16px",
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
            >
              npm i seedicon
            </code>
          </div>
        </div>

        <div className="stats">
          <a
            className="stat"
            href={LINKS.npm}
            target="_blank"
            rel="noreferrer"
          >
            <div className="stat-value">
              {formatCount(stats.weeklyDownloads)}
            </div>
            <div className="stat-label">Downloads / week</div>
          </a>
          <a
            className="stat"
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
          >
            <div className="stat-value">{formatCount(stats.stars)}</div>
            <div className="stat-label">GitHub stars</div>
          </a>
          <a
            className="stat"
            href={LINKS.npm}
            target="_blank"
            rel="noreferrer"
          >
            <div className="stat-value">
              {stats.version ? `v${stats.version}` : "—"}
            </div>
            <div className="stat-label">Latest version</div>
          </a>
          <div className="stat">
            <div className="stat-value">0</div>
            <div className="stat-label">Dependencies</div>
          </div>
        </div>

        <section id="playground">
          <h2>Playground</h2>
          <p className="lede">
            This runs the real package in your browser. Type a seed, pick a
            style, copy the code.
          </p>
          <Playground />
        </section>

        <section>
          <h2>Styles</h2>
          <p className="lede">
            Nine styles, all rendered on the server here — seedicon has
            no canvas and no <code>window</code> access, so it works
            during SSR in Next.js, Remix or anything else. Three of them
            are output-compatible with an existing library, so you can
            swap it out without changing anyone&apos;s avatar.
          </p>
          <Gallery />
        </section>

        <section>
          <h2>Usage</h2>
          <p className="lede">
            Two functions and one optional React component. That is the
            whole API — plus one entry point per style, if you only use
            one and care about bundle size.
          </p>
          <div className="code">
            <pre>
              <span className="cmt">
                {"// Anywhere: returns raw <svg> markup as a string\n"}
              </span>
              {'import { generateAvatar } from "seedicon";\n\n'}
              {'const svg = generateAvatar({ seed: user.id, style: "ring" });\n\n'}
              <span className="cmt">
                {"// Or a data URI, ready for <img src> or CSS\n"}
              </span>
              {'import { generateAvatarDataUri } from "seedicon";\n\n'}
              {"const src = generateAvatarDataUri({ seed: user.id });\n\n"}
              <span className="cmt">{"// Or the React component\n"}</span>
              {'import { Avatar } from "seedicon/react";\n\n'}
              {"<Avatar seed={user.id} size={40} radius={20} />\n\n"}
              <span className="cmt">
                {"// Or one style alone — pulls in nothing else\n"}
              </span>
              {'import { ring } from "seedicon/ring";\n\n'}
              {"const svg = ring({ seed: user.id, size: 40 });"}
            </pre>
          </div>
        </section>

        <section>
          <h2>Why</h2>
          <p className="lede">
            Letting users upload a profile picture means storing it,
            resizing it, moderating it and serving it. Most products do not
            need any of that — they need something consistent in the avatar
            slot that does not look like a broken image. seedicon is that
            something, derived from an id you already have, with no
            randomness and no I/O: the same options always produce
            byte-for-byte identical markup, on every platform.
          </p>
        </section>
      </main>

      <footer className="wrap">
        <span>MIT · built by Romulo</span>
        <span>
          <a href={LINKS.npm} target="_blank" rel="noreferrer">
            npm
          </a>
          {" · "}
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </span>
      </footer>
    </>
  );
}
