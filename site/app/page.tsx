import type { ReactNode } from "react";
import { SEEDICON_STYLES } from "seedicon";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import { FAQ } from "@/components/FAQ";
import { Gallery } from "@/components/Gallery";
import { Playground } from "@/components/Playground";
import { formatCount, getPackageStats, LINKS } from "./lib/stats";
import { CODE_BOX, CODE_PRE, CONTAINER } from "./lib/ui";

// Re-render the page (and refetch the stats) at most once an hour. Between
// revalidations every visitor is served static HTML from the edge cache.
export const revalidate = 3600;

const LEDE = "mb-7 max-w-[620px] text-[17px] leading-relaxed text-dim";
const LINK = "text-primary hover:underline";

/** The landing page's section shell: a hairline, a small uppercase eyebrow
 *  instead of a heading, and the content under it. */
function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10">
      <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One cell of the stats strip. The strip is a 1px-gap grid over a border
 *  colour, so the gaps themselves draw the dividing lines. */
function Stat({
  value,
  label,
  href,
}: {
  value: string;
  label: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="font-mono text-2xl font-semibold tracking-[-0.02em]">
        {value}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-[0.08em] text-faint">
        {label}
      </div>
    </>
  );

  if (!href) return <div className="bg-raised p-5">{inner}</div>;

  return (
    <a
      className="bg-raised p-5 transition-colors hover:bg-input"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {inner}
    </a>
  );
}

export default async function Home() {
  const stats = await getPackageStats();

  return (
    <>
      <Navbar />
      <Hero />

      <main className={CONTAINER}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-px overflow-hidden rounded-xl border border-border bg-border">
          <Stat
            value={formatCount(stats.weeklyDownloads)}
            label="Downloads / week"
            href={LINKS.npm}
          />
          <Stat
            value={formatCount(stats.stars)}
            label="GitHub stars"
            href={LINKS.github}
          />
          <Stat
            value={stats.version ? `v${stats.version}` : "—"}
            label="Latest version"
            href={LINKS.npm}
          />
          <Stat value="0" label="Dependencies" />
        </div>

        <Section id="playground" title="Playground">
          <p className={LEDE}>
            This runs the real package in your browser. Type a seed, pick a
            style, copy the code.
          </p>
          <Playground />
        </Section>

        <Section title="Styles">
          <p className={LEDE}>
            {SEEDICON_STYLES.length} styles, all rendered on the server here —
            seedicon has no canvas and no <code className="font-mono">window</code>{" "}
            access, so it works during SSR in Next.js, Remix or anything else.
            Three of them are output-compatible with an existing library, so you
            can swap it out without changing anyone&apos;s avatar. Each one is
            described in full, with the shape and radius options, on the{" "}
            <a href="/docs#styles" className={LINK}>
              docs page
            </a>
            .
          </p>
          <Gallery />
        </Section>

        <Section title="Usage">
          <p className={LEDE}>
            Two functions and one optional React component. That is the whole
            API — plus one entry point per style, if you only use one and care
            about bundle size. The{" "}
            <a href="/docs" className={LINK}>
              docs
            </a>{" "}
            cover every option, including the square, rounded and circle shapes.
          </p>
          <div className={CODE_BOX}>
            <pre className={CODE_PRE}>
              <span className="text-faint">
                {"// Anywhere: returns raw <svg> markup as a string\n"}
              </span>
              {'import { generateAvatar } from "seedicon";\n\n'}
              {'const svg = generateAvatar({ seed: user.id, style: "quilt" });\n\n'}
              <span className="text-faint">
                {"// Or a data URI, ready for <img src> or CSS\n"}
              </span>
              {'import { generateAvatarDataUri } from "seedicon";\n\n'}
              {"const src = generateAvatarDataUri({ seed: user.id });\n\n"}
              <span className="text-faint">{"// Or the React component\n"}</span>
              {'import { Avatar } from "seedicon/react";\n\n'}
              {'<Avatar seed={user.id} size={40} shape="circle" />\n\n'}
              <span className="text-faint">
                {"// Or one style alone — pulls in nothing else\n"}
              </span>
              {'import { quilt } from "seedicon/quilt";\n\n'}
              {'const svg = quilt({ seed: user.id, size: 40, shape: "circle" });'}
            </pre>
          </div>
        </Section>

        <Section id="faq" title="FAQ">
          <FAQ />
        </Section>
      </main>

      <Footer />
    </>
  );
}
