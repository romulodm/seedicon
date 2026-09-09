import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateAvatar, SEEDICON_STYLES, type SeediconStyle } from "seedicon";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { DocsToc, type TocItem } from "../components/DocsToc";
import { STYLE_DOCS } from "../lib/styles";
import { LINKS } from "../lib/stats";
import { CODE_BOX, CODE_PRE, CONTAINER, PROSE_CODE } from "../lib/ui";

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
  { id: "styles", label: `The ${SEEDICON_STYLES.length} styles` },
  { id: "single-style", label: "One style only" },
  { id: "react", label: "React" },
  { id: "recipes", label: "Recipes" },
  { id: "determinism", label: "Determinism" },
];

/* ---------- the page's own small vocabulary ----------
   Prose here is dense with inline <code> — roughly forty of them — so the
   code styling is applied once per paragraph with a descendant utility
   instead of being repeated on every tag. */

const PROSE = `text-[15px] leading-[1.7] text-dim ${PROSE_CODE} [&_strong]:font-semibold [&_strong]:text-foreground`;
const LINK = "text-primary hover:underline";

function P({ children, full = false }: { children: ReactNode; full?: boolean }) {
  return (
    <p className={`mb-4 ${full ? "" : "max-w-[660px]"} ${PROSE}`}>{children}</p>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-2.5 mt-8 text-[15px] font-semibold text-foreground">
      {children}
    </h3>
  );
}

/** Unlike the landing page, docs headings are real headings rather than the
 *  small uppercase eyebrows there. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <h2 className="mb-3.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className={`${CODE_BOX} mb-[18px]`}>
      <pre className={CODE_PRE}>{children}</pre>
    </div>
  );
}

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
    // Captions are wider than the avatars they sit under, so a captioned
    // sample reserves room for its own label instead of colliding with the
    // next one.
    <figure className={`text-center ${caption ? "min-w-[116px]" : ""}`}>
      <span
        title={seed}
        dangerouslySetInnerHTML={{
          __html: generateAvatar({ seed, style, size, shape, radius }),
        }}
      />
      {caption ? (
        <figcaption className="mt-2.5 font-mono text-[11px] leading-none text-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-border pb-2.5 pr-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
      {children}
    </th>
  );
}

function Td({ children, nowrap = false }: { children: ReactNode; nowrap?: boolean }) {
  return (
    <td
      className={`border-b border-border py-3 pr-3.5 align-top leading-relaxed text-dim ${nowrap ? "whitespace-nowrap" : ""}`}
    >
      {children}
    </td>
  );
}

/** Tables scroll inside themselves; without this a wide one would push the
 *  whole page sideways. */
function Table({ children }: { children: ReactNode }) {
  return (
    <div className={`mb-[18px] overflow-x-auto ${PROSE_CODE}`}>
      <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
        {children}
      </table>
    </div>
  );
}

const BADGE =
  "rounded-full border border-border-strong px-2.5 py-[3px] font-mono text-[11px] text-faint transition-colors hover:text-foreground";
const BADGE_COMPAT =
  "rounded-full border border-[#2f5c43] px-2.5 py-[3px] font-mono text-[11px] text-mint";

export default function Docs() {
  return (
    <>
      <Navbar />

      <main className={`${CONTAINER} pt-24`}>
        <div className="pb-2 pt-14">
          <h1 className="mb-4 text-[clamp(32px,5vw,44px)] font-bold leading-[1.1] tracking-[-0.03em]">
            Documentation
          </h1>
          <p className="max-w-[620px] text-[18px] leading-relaxed text-dim">
            seedicon turns a string into an SVG avatar. {SEEDICON_STYLES.length}{" "}
            styles, five options, no dependencies and no I/O, so the whole thing
            runs during server rendering and the same input always produces the
            same markup.
          </p>
        </div>

        <div className="grid items-start gap-10 max-[860px]:gap-0 min-[861px]:grid-cols-[172px_minmax(0,1fr)]">
          <aside className="sticky top-24 pt-14 max-[860px]:static max-[860px]:border-b max-[860px]:border-border max-[860px]:pb-5 max-[860px]:pt-6">
            <DocsToc items={TOC} />
          </aside>

          {/* Grid children default to min-width:auto, so a wide code block or
              table would push the page sideways instead of scrolling. */}
          <div className="min-w-0">
            <Section id="install" title="Install">
              <Code>{`npm i seedicon`}</Code>
              <P>
                Zero runtime dependencies. React is an optional peer dependency
                and only needed if you import from <code>seedicon/react</code>.
                Node 18+, ESM and CJS, types included.
              </P>
            </Section>

            <Section id="quick-start" title="Quick start">
              <P>
                Two functions and one optional component. Pick whichever fits
                where you are rendering.
              </P>
              <Code>{`import { generateAvatar } from "seedicon";

// Raw <svg> markup as a string
const svg = generateAvatar({ seed: user.id, style: "quilt", size: 64 });

// A data URI, for <img src> or CSS background-image
import { generateAvatarDataUri } from "seedicon";
const src = generateAvatarDataUri({ seed: user.id, style: "quilt" });

// Or the React component
import { Avatar } from "seedicon/react";
<Avatar seed={user.id} style="quilt" size={40} shape="circle" />;`}</Code>
              <P>
                The seed is whatever already identifies the user: a UUID, a
                database id, a wallet address, an email. Nothing is stored,
                fetched or cached. Calling the function twice gives you the
                identical string both times, so it is cheap enough to call at
                render time.
              </P>
            </Section>

            <Section id="options" title="Options">
              <Table>
                <thead>
                  <tr>
                    <Th>Option</Th>
                    <Th>Type</Th>
                    <Th>Default</Th>
                    <Th>What it does</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td nowrap>
                      <code>seed</code>
                    </Td>
                    <Td nowrap>
                      <code>string</code>
                    </Td>
                    <Td nowrap>required</Td>
                    <Td>
                      The only input that decides what the avatar looks like. An
                      empty string throws.
                    </Td>
                  </tr>
                  <tr>
                    <Td nowrap>
                      <code>style</code>
                    </Td>
                    <Td nowrap>
                      <code>SeediconStyle</code>
                    </Td>
                    <Td nowrap>
                      <code>&quot;pixels&quot;</code>
                    </Td>
                    <Td>
                      One of the {SEEDICON_STYLES.length} below. Only exists on
                      the package root: the single-style entry points are the
                      style.
                    </Td>
                  </tr>
                  <tr>
                    <Td nowrap>
                      <code>size</code>
                    </Td>
                    <Td nowrap>
                      <code>number</code>
                    </Td>
                    <Td nowrap>
                      <code>64</code>
                    </Td>
                    <Td>
                      Width and height in SVG user units, written to both the
                      attributes and the viewBox.
                    </Td>
                  </tr>
                  <tr>
                    <Td nowrap>
                      <code>shape</code>
                    </Td>
                    <Td nowrap>
                      <code>
                        &quot;square&quot; | &quot;rounded&quot; |
                        &quot;circle&quot;
                      </code>
                    </Td>
                    <Td nowrap>
                      <code>&quot;square&quot;</code>
                    </Td>
                    <Td>
                      Corner preset, scaled from <code>size</code>.
                    </Td>
                  </tr>
                  <tr>
                    <Td nowrap>
                      <code>radius</code>
                    </Td>
                    <Td nowrap>
                      <code>number</code>
                    </Td>
                    <Td nowrap>
                      from <code>shape</code>
                    </Td>
                    <Td>
                      Exact corner radius in the same units as <code>size</code>
                      . Overrides <code>shape</code>.
                    </Td>
                  </tr>
                </tbody>
              </Table>
              <P>
                Those five are the entire API surface. There is no theme, no
                palette override and no color option: the colors come out of the
                seed, which is what makes two people looking at the same user
                see the same avatar without agreeing on anything first.
              </P>
            </Section>

            <Section id="shape" title="Shape and radius">
              <P>
                Avatars get clipped differently in every product, so the corner
                is an option rather than a decision baked into the markup. Three
                presets cover almost everything:
              </P>

              <div className="flex flex-wrap items-end gap-[22px] pb-6 pt-2">
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

              <P>
                A preset is a fraction of <code>size</code>, not a fixed number
                of pixels, so the same <code>shape</code> holds at 16px and at
                256px. That is the reason to prefer it over a hard-coded radius
                when the same avatar appears at several sizes in one product.
              </P>

              <H3>Setting the radius directly</H3>
              <P>
                When none of the three is the exact rounding your design asks
                for, pass <code>radius</code>. It is measured in the same units
                as <code>size</code> and takes precedence over <code>shape</code>{" "}
                whenever both are given, since <code>shape</code> is the coarse
                choice a design makes once and <code>radius</code> the
                fine-tuning a specific screen asks for.
              </P>

              <div className="flex flex-wrap items-end gap-[22px] pb-6 pt-2">
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

              <P>
                The value is clamped to <code>[0, size / 2]</code>. Half the
                size is already a circle, so anything larger would only ever
                draw the same circle. A non-finite value throws rather than
                emitting broken markup.
              </P>

              <H3>Keeping one avatar consistent across sizes</H3>
              <P>
                If you set <code>radius</code> by hand and render the same
                avatar at several sizes, scale it with the size or the small one
                will look like a differently shaped icon rather than a smaller
                version of the large one. Or just use <code>shape</code>, which
                does this for you.
              </P>
              <Code>{`const ratio = 14 / 64; // the corner you designed, as a fraction

for (const size of [96, 56, 40, 24, 16]) {
  generateAvatar({ seed: user.id, size, radius: size * ratio });
}`}</Code>
              <P>
                The corner is applied as a clip path over the finished artwork,
                which means it works identically for every style, including the
                ported ones. Styles do not opt in or out of it.
              </P>
            </Section>

            <Section id="styles" title={`The ${SEEDICON_STYLES.length} styles`}>
              <P>
                Every avatar below is generated at build time by the package
                itself, on the server, from the same five seeds. Three styles
                are output-compatible with an existing library, meaning the same
                seed produces the exact same image and the test suite checks
                that against the original package on every run. The rest are
                seedicon implementations that borrow an idea.
              </P>

              {STYLE_DOCS.map((doc) => (
                <article
                  key={doc.name}
                  id={doc.name}
                  className="mb-4 scroll-mt-24 rounded-xl border border-border bg-raised p-[22px] target:border-primary"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2.5">
                    <h3 className="font-mono text-base font-semibold">
                      {doc.name}
                    </h3>
                  </div>

                  <div className="mb-[18px] flex flex-wrap gap-2.5">
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
                    <P key={paragraph.slice(0, 24)} full>
                      {paragraph}
                    </P>
                  ))}

                  <p className="mb-4 text-sm text-faint">
                    <strong className="font-semibold text-foreground">
                      Good for:
                    </strong>{" "}
                    {doc.goodFor}
                  </p>

                  <Code>{`import { generateAvatar } from "seedicon";
const svg = generateAvatar({ seed: user.id, style: "${doc.name}" });

// or, importing this style alone
import { ${doc.export} } from "seedicon/${doc.name}";
const svg = ${doc.export}({ seed: user.id, shape: "circle" });`}</Code>
                </article>
              ))}
            </Section>

            <Section id="single-style" title="One style only">
              <P>
                Most products pick a style once and never change it. In that
                case, do not import the package root: it resolves styles by name
                through a lookup table, so it has to reference all{" "}
                {SEEDICON_STYLES.length} renderers and no bundler can drop the
                ones you never call.
              </P>
              <P>
                Every style has its own entry point. Importing one pulls in that
                renderer plus the shared core, which is the seeded hash, the SVG
                wrapper and the corner clip. Nothing else ships.
              </P>
              <Code>{`import { quilt, quiltDataUri } from "seedicon/quilt";

const svg = quilt({ seed: user.id, size: 40, shape: "circle" });
const src = quiltDataUri({ seed: user.id, size: 40, shape: "circle" });`}</Code>
              <P>
                The single-style functions take the same options as{" "}
                <code>generateAvatar</code> minus <code>style</code>, which the
                entry point already is.
              </P>

              <Table>
                <thead>
                  <tr>
                    <Th>Import path</Th>
                    <Th>Exports</Th>
                  </tr>
                </thead>
                <tbody>
                  {STYLE_DOCS.map((doc) => (
                    <tr key={doc.name}>
                      <Td nowrap>
                        <code>seedicon/{doc.name}</code>
                      </Td>
                      <Td>
                        <code>{doc.export}</code>,{" "}
                        <code>{doc.export}DataUri</code>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <P>
                One caveat: <code>&lt;Avatar&gt;</code> takes a style name, so
                it goes through the root and pulls in all{" "}
                {SEEDICON_STYLES.length}. If the bundle matters more than the
                convenience, call the single-style function and render the
                markup yourself. It is four lines.
              </P>
              <Code>{`import { quilt } from "seedicon/quilt";

function Avatar({ seed, size = 40 }: { seed: string; size?: number }) {
  const svg = quilt({ seed, size, shape: "circle" });
  return (
    <span
      style={{ lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}`}</Code>
            </Section>

            <Section id="react" title="React">
              <Code>{`import { Avatar } from "seedicon/react";

<Avatar
  seed={user.walletAddress}
  style="pixels"
  size={40}
  shape="circle"
  className="avatar"
/>;`}</Code>
              <P>
                It takes the same options as <code>generateAvatar</code> plus{" "}
                <code>className</code>, which is passed to the wrapping element,
                and defaults <code>size</code> to 40. The markup is memoized on
                the options, so re-renders that do not change the avatar do not
                regenerate it.
              </P>
              <P>
                Unlike canvas-based generators, this renders synchronously to
                SVG: no effect, no DOM ref, no flash of an empty avatar on first
                paint, and it works during server rendering in Next.js, Remix or
                anything else, because there is no canvas and no{" "}
                <code>window</code> anywhere in the package. Every avatar on
                this page was rendered on the server, which is the proof.
              </P>
            </Section>

            <Section id="recipes" title="Recipes">
              <H3>As an image source</H3>
              <Code>{`const src = generateAvatarDataUri({ seed: user.id, shape: "circle" });

<img src={src} width={40} height={40} alt="" />
// or in CSS: background-image: url("data:image/svg+xml,...")`}</Code>

              <H3>Writing a file in Node</H3>
              <Code>{`import { writeFileSync } from "node:fs";
import { gradient } from "seedicon/gradient";

writeFileSync("avatar.svg", gradient({ seed: user.id, size: 512 }));`}</Code>

              <H3>In a database</H3>
              <P>
                There is nothing to persist: keep calling{" "}
                <code>generateAvatar</code> with the id you already store. If
                you want the style to be changeable per user without re-deriving
                it, store the style name, which is a short string, rather than
                the rendered markup.
              </P>
              <Code>{`// on signup
user.avatarStyle = "pixels";

// on render
<Avatar seed={user.id} style={user.avatarStyle} size={40} shape="rounded" />;`}</Code>

              <H3>Migrating from blockies</H3>
              <Code>{`- import { createIcon } from "@download/blockies";
- const canvas = createIcon({ seed: address, size: 8, scale: 8 });
- ref.current.appendChild(canvas);
+ import { Avatar } from "seedicon/react";
+ <Avatar seed={address} size={64} />`}</Code>
              <P>
                The <code>pixels</code> style is the default, so no{" "}
                <code>style</code> is needed and no avatar changes. Watch the
                address casing: lowercase and checksummed forms are different
                strings and blockies did not normalize them either, so keep
                passing exactly what you pass today.
              </P>
            </Section>

            <Section id="determinism" title="Determinism">
              <P>
                No randomness, no I/O, no clock. The same{" "}
                <code>{"{ seed, style, size, shape, radius }"}</code> produces
                byte-for-byte identical markup, in the browser, in Node, on an
                edge runtime, today and next year. That is what lets you render
                an avatar on the server and again on the client without a
                hydration mismatch, and cache the output anywhere.
              </P>
              <P>
                Anything that changes those five values changes the image,
                including <code>size</code>: geometry is computed in output
                units, not scaled after the fact. Casing matters too, on
                purpose, because usernames and emails are seeds as well and{" "}
                <code>Maria</code> should be free to differ from{" "}
                <code>maria</code>. Normalize at the edge if you need otherwise.
              </P>
              <P>
                The hash is a doubled 32-bit FNV-1a, not a cryptographic one. It
                only has to spread seeds out visually, so do not use it for
                anything security-sensitive. Two of the ported styles do run
                SHA-1, because their originals do and compatibility requires it.
              </P>
              <P>
                Source, tests and issues live on{" "}
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK}
                >
                  GitHub
                </a>
                . {SEEDICON_STYLES.length} styles, MIT.
              </P>
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
