import type { Metadata } from "next";
import { generateAvatar, SEEDICON_STYLES, type SeediconStyle } from "seedicon";
import { Footer, Nav } from "../components/Chrome";
import { DocsToc, type TocItem } from "../components/DocsToc";
import { STYLE_DOCS } from "../lib/styles";
import { LINKS } from "../lib/stats";

export const metadata: Metadata = {
  title: "Documentation — seedicon",
  description:
    "Every seedicon style, the shape and radius options, single-style imports, the React component and the SSR guarantees.",
};

/** Seeds used across the page, so every sample row is comparable. */
const SEEDS = [
  "romulo",
  "0xba32ff01a9c7e2d4",
  "550e8400-e29b-41d4-a716-446655440000",
  "ada@example.com",
  "user-000001",
];

/** Section ids, in page order. The sidebar tracks these while you scroll. */
const TOC: TocItem[] = [
  { id: "install", label: "Install" },
  { id: "quick-start", label: "Quick start" },
  { id: "options", label: "Options" },
  { id: "shape", label: "Shape and radius" },
  { id: "styles", label: "The nine styles" },
  { id: "single-style", label: "One style only" },
  { id: "react", label: "React" },
  { id: "recipes", label: "Recipes" },
  { id: "determinism", label: "Determinism" },
];

/** Renders real package output. Every avatar on this page is generated at build time. */
function Sample({
  seed,
  style,
  size = 56,
  shape,
  radius,
  caption,
}: {
  seed: string;
  style: SeediconStyle;
  size?: number;
  shape?: "square" | "rounded" | "circle";
  radius?: number;
  caption?: string;
}) {
  return (
    <figure className="sample">
      <span
        title={seed}
        dangerouslySetInnerHTML={{
          __html: generateAvatar({ seed, style, size, shape, radius }),
        }}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className="code">
      <pre>{children}</pre>
    </div>
  );
}

export default function Docs() {
  return (
    <>
      <Nav current="docs" />

      <main className="wrap">
        <div className="doc-head">
          <h1>Documentation</h1>
          <p>
            seedicon turns a string into an SVG avatar. Nine styles, five
            options, no dependencies and no I/O, so the whole thing runs
            during server rendering and the same input always produces the
            same markup.
          </p>
        </div>

        <div className="docs">
          <aside className="toc">
            <DocsToc items={TOC} />
          </aside>

          <div className="doc-body">
            <section id="install" className="doc-section">
              <h2>Install</h2>
              <Code>{`npm i seedicon`}</Code>
              <p>
                Zero runtime dependencies. React is an optional peer
                dependency and only needed if you import from{" "}
                <code>seedicon/react</code>. Node 18+, ESM and CJS, types
                included.
              </p>
            </section>

            <section id="quick-start" className="doc-section">
              <h2>Quick start</h2>
              <p>
                Two functions and one optional component. Pick whichever
                fits where you are rendering.
              </p>
              <Code>{`import { generateAvatar } from "seedicon";

// Raw <svg> markup as a string
const svg = generateAvatar({ seed: user.id, style: "ring", size: 64 });

// A data URI, for <img src> or CSS background-image
import { generateAvatarDataUri } from "seedicon";
const src = generateAvatarDataUri({ seed: user.id, style: "ring" });

// Or the React component
import { Avatar } from "seedicon/react";
<Avatar seed={user.id} style="ring" size={40} shape="circle" />;`}</Code>
              <p>
                The seed is whatever already identifies the user: a UUID, a
                database id, a wallet address, an email. Nothing is stored,
                fetched or cached. Calling the function twice gives you the
                identical string both times, so it is cheap enough to call
                at render time.
              </p>
            </section>

            <section id="options" className="doc-section">
              <h2>Options</h2>
              <div className="table-wrap">
                <table className="opts">
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>What it does</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>seed</code>
                      </td>
                      <td>
                        <code>string</code>
                      </td>
                      <td>required</td>
                      <td>
                        The only input that decides what the avatar looks
                        like. An empty string throws.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>style</code>
                      </td>
                      <td>
                        <code>SeediconStyle</code>
                      </td>
                      <td>
                        <code>&quot;pixels&quot;</code>
                      </td>
                      <td>
                        One of the nine below. Only exists on the package
                        root: the single-style entry points are the style.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>size</code>
                      </td>
                      <td>
                        <code>number</code>
                      </td>
                      <td>
                        <code>64</code>
                      </td>
                      <td>
                        Width and height in SVG user units, written to both
                        the attributes and the viewBox.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>shape</code>
                      </td>
                      <td>
                        <code>
                          &quot;square&quot; | &quot;rounded&quot; |
                          &quot;circle&quot;
                        </code>
                      </td>
                      <td>
                        <code>&quot;square&quot;</code>
                      </td>
                      <td>
                        Corner preset, scaled from <code>size</code>.
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>radius</code>
                      </td>
                      <td>
                        <code>number</code>
                      </td>
                      <td>from <code>shape</code></td>
                      <td>
                        Exact corner radius in the same units as{" "}
                        <code>size</code>. Overrides <code>shape</code>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Those five are the entire API surface. There is no theme,
                no palette override and no color option: the colors come
                out of the seed, which is what makes two people looking at
                the same user see the same avatar without agreeing on
                anything first.
              </p>
            </section>

            <section id="shape" className="doc-section">
              <h2>Shape and radius</h2>
              <p>
                Avatars get clipped differently in every product, so the
                corner is an option rather than a decision baked into the
                markup. Three presets cover almost everything:
              </p>

              <div className="shape-row">
                <Sample
                  seed="550e8400-e29b-41d4-a716-446655440000"
                  style="marble"
                  size={88}
                  shape="square"
                  caption='shape="square"'
                />
                <Sample
                  seed="550e8400-e29b-41d4-a716-446655440000"
                  style="marble"
                  size={88}
                  shape="rounded"
                  caption='shape="rounded"'
                />
                <Sample
                  seed="550e8400-e29b-41d4-a716-446655440000"
                  style="marble"
                  size={88}
                  shape="circle"
                  caption='shape="circle"'
                />
              </div>

              <Code>{`generateAvatar({ seed: user.id, shape: "square" });   // radius 0        — the default
generateAvatar({ seed: user.id, shape: "rounded" });  // radius size * 0.22
generateAvatar({ seed: user.id, shape: "circle" });   // radius size / 2`}</Code>

              <p>
                A preset is a fraction of <code>size</code>, not a fixed
                number of pixels, so the same <code>shape</code> holds at
                16px and at 256px. That is the reason to prefer it over a
                hard-coded radius when the same avatar appears at several
                sizes in one product.
              </p>

              <h3>Setting the radius directly</h3>
              <p>
                When none of the three is the exact rounding your design
                asks for, pass <code>radius</code>. It is measured in the
                same units as <code>size</code> and takes precedence over{" "}
                <code>shape</code> whenever both are given, since{" "}
                <code>shape</code> is the coarse choice a design makes once
                and <code>radius</code> the fine-tuning a specific screen
                asks for.
              </p>

              <div className="shape-row">
                {[0, 6, 14, 22, 32].map((radius) => (
                  <Sample
                    key={radius}
                    seed="0xba32ff01a9c7e2d4"
                    style="pixels"
                    size={64}
                    radius={radius}
                    caption={`radius={${radius}}`}
                  />
                ))}
              </div>

              <Code>{`generateAvatar({ seed: user.id, size: 64, radius: 14 });

// radius wins when both are passed — this is a 12px corner, not a circle
generateAvatar({ seed: user.id, size: 64, shape: "circle", radius: 12 });`}</Code>

              <p>
                The value is clamped to <code>[0, size / 2]</code>. Half
                the size is already a circle, so anything larger would only
                ever draw the same circle. A non-finite value throws rather
                than emitting broken markup.
              </p>

              <h3>Keeping one avatar consistent across sizes</h3>
              <p>
                If you set <code>radius</code> by hand and render the same
                avatar at several sizes, scale it with the size or the
                small one will look like a differently shaped icon rather
                than a smaller version of the large one. Or just use{" "}
                <code>shape</code>, which does this for you.
              </p>
              <Code>{`const ratio = 14 / 64; // the corner you designed, as a fraction

for (const size of [96, 56, 40, 24, 16]) {
  generateAvatar({ seed: user.id, size, radius: size * ratio });
}`}</Code>
              <p>
                The corner is applied as a clip path over the finished
                artwork, which means it works identically for every style,
                including the ported ones. Styles do not opt in or out of
                it.
              </p>
            </section>

            <section id="styles" className="doc-section">
              <h2>The nine styles</h2>
              <p>
                Every avatar below is generated at build time by the
                package itself, on the server, from the same five seeds.
                Three styles are output-compatible with an existing
                library, meaning the same seed produces the exact same
                image and the test suite checks that against the original
                package on every run. The rest are seedicon implementations
                that borrow an idea.
              </p>

              {STYLE_DOCS.map((doc) => (
                <article className="style-card" key={doc.name}>
                  <div className="style-head">
                    <h3>{doc.name}</h3>
                    {doc.compatible ? (
                      <a
                        className="badge badge-compat"
                        href={doc.compatible.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        compatible with {doc.compatible.label}
                      </a>
                    ) : null}
                    {doc.inspiredBy ? (
                      <a
                        className="badge"
                        href={doc.inspiredBy.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        after {doc.inspiredBy.label}
                      </a>
                    ) : null}
                  </div>

                  <div className="style-samples">
                    {SEEDS.map((seed) => (
                      <Sample
                        key={seed}
                        seed={seed}
                        style={doc.name}
                        size={64}
                        shape="rounded"
                      />
                    ))}
                  </div>

                  {doc.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}

                  <p className="good-for">
                    <strong>Good for:</strong> {doc.goodFor}
                  </p>

                  <Code>{`import { generateAvatar } from "seedicon";
const svg = generateAvatar({ seed: user.id, style: "${doc.name}" });

// or, importing this style alone
import { ${doc.export} } from "seedicon/${doc.name}";
const svg = ${doc.export}({ seed: user.id, shape: "circle" });`}</Code>
                </article>
              ))}
            </section>

            <section id="single-style" className="doc-section">
              <h2>One style only</h2>
              <p>
                Most products pick a style once and never change it. In
                that case, do not import the package root: it resolves
                styles by name through a lookup table, so it has to
                reference all nine renderers and no bundler can drop the
                eight you never call.
              </p>
              <p>
                Every style has its own entry point. Importing one pulls in
                that renderer plus the shared core, which is the seeded
                hash, the SVG wrapper and the corner clip. Nothing else
                ships.
              </p>
              <Code>{`import { ring, ringDataUri } from "seedicon/ring";

const svg = ring({ seed: user.id, size: 40, shape: "circle" });
const src = ringDataUri({ seed: user.id, size: 40, shape: "circle" });`}</Code>
              <p>
                The single-style functions take the same options as{" "}
                <code>generateAvatar</code> minus <code>style</code>, which
                the entry point already is.
              </p>

              <div className="table-wrap">
                <table className="opts">
                  <thead>
                    <tr>
                      <th>Import path</th>
                      <th>Exports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STYLE_DOCS.map((doc) => (
                      <tr key={doc.name}>
                        <td>
                          <code>seedicon/{doc.name}</code>
                        </td>
                        <td>
                          <code>{doc.export}</code>,{" "}
                          <code>{doc.export}DataUri</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p>
                One caveat: <code>&lt;Avatar&gt;</code> takes a style name,
                so it goes through the root and pulls in all nine. If the
                bundle matters more than the convenience, call the
                single-style function and render the markup yourself. It is
                four lines.
              </p>
              <Code>{`import { ring } from "seedicon/ring";

function Avatar({ seed, size = 40 }: { seed: string; size?: number }) {
  const svg = ring({ seed, size, shape: "circle" });
  return (
    <span
      style={{ lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}`}</Code>
            </section>

            <section id="react" className="doc-section">
              <h2>React</h2>
              <Code>{`import { Avatar } from "seedicon/react";

<Avatar
  seed={user.walletAddress}
  style="pixels"
  size={40}
  shape="circle"
  className="avatar"
/>;`}</Code>
              <p>
                It takes the same options as{" "}
                <code>generateAvatar</code> plus <code>className</code>,
                which is passed to the wrapping element, and defaults{" "}
                <code>size</code> to 40. The markup is memoized on the
                options, so re-renders that do not change the avatar do not
                regenerate it.
              </p>
              <p>
                Unlike canvas-based generators, this renders synchronously
                to SVG: no effect, no DOM ref, no flash of an empty avatar
                on first paint, and it works during server rendering in
                Next.js, Remix or anything else, because there is no canvas
                and no <code>window</code> anywhere in the package. Every
                avatar on this page was rendered on the server, which is
                the proof.
              </p>
            </section>

            <section id="recipes" className="doc-section">
              <h2>Recipes</h2>

              <h3>As an image source</h3>
              <Code>{`const src = generateAvatarDataUri({ seed: user.id, shape: "circle" });

<img src={src} width={40} height={40} alt="" />
// or in CSS: background-image: url("data:image/svg+xml,...")`}</Code>

              <h3>Writing a file in Node</h3>
              <Code>{`import { writeFileSync } from "node:fs";
import { gradient } from "seedicon/gradient";

writeFileSync("avatar.svg", gradient({ seed: user.id, size: 512 }));`}</Code>

              <h3>In a database</h3>
              <p>
                There is nothing to persist: keep calling{" "}
                <code>generateAvatar</code> with the id you already store.
                If you want the style to be changeable per user without
                re-deriving it, store the style name, which is a short
                string, rather than the rendered markup.
              </p>
              <Code>{`// on signup
user.avatarStyle = "pixels";

// on render
<Avatar seed={user.id} style={user.avatarStyle} size={40} shape="rounded" />;`}</Code>

              <h3>Migrating from blockies</h3>
              <Code>{`- import { createIcon } from "@download/blockies";
- const canvas = createIcon({ seed: address, size: 8, scale: 8 });
- ref.current.appendChild(canvas);
+ import { Avatar } from "seedicon/react";
+ <Avatar seed={address} size={64} />`}</Code>
              <p>
                The <code>pixels</code> style is the default, so no{" "}
                <code>style</code> is needed and no avatar changes. Watch
                the address casing: lowercase and checksummed forms are
                different strings and blockies did not normalize them
                either, so keep passing exactly what you pass today.
              </p>
            </section>

            <section id="determinism" className="doc-section">
              <h2>Determinism</h2>
              <p>
                No randomness, no I/O, no clock. The same{" "}
                <code>{"{ seed, style, size, shape, radius }"}</code>{" "}
                produces byte-for-byte identical markup, in the browser, in
                Node, on an edge runtime, today and next year. That is what
                lets you render an avatar on the server and again on the
                client without a hydration mismatch, and cache the output
                anywhere.
              </p>
              <p>
                Anything that changes those five values changes the image,
                including <code>size</code>: geometry is computed in output
                units, not scaled after the fact. Casing matters too, on
                purpose, because usernames and emails are seeds as well and{" "}
                <code>Maria</code> should be free to differ from{" "}
                <code>maria</code>. Normalize at the edge if you need
                otherwise.
              </p>
              <p>
                The hash is a doubled 32-bit FNV-1a, not a cryptographic
                one. It only has to spread seeds out visually, so do not
                use it for anything security-sensitive. Two of the ported
                styles do run SHA-1, because their originals do and
                compatibility requires it.
              </p>
              <p>
                Source, tests and issues live on{" "}
                <a href={LINKS.github} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                . {SEEDICON_STYLES.length} styles, MIT.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
