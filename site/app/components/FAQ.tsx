import type { ReactNode } from "react";
import { SEEDICON_STYLES } from "seedicon";

import { LINKS } from "../lib/stats";
import { PROSE_CODE } from "../lib/ui";

/**
 * The questions that come up before someone installs the package, answered
 * on the landing page instead of buried in the docs.
 *
 * Built on native <details>, so this is a server component with no
 * JavaScript at all: the browser owns the open/closed state, the keyboard
 * and the accessibility semantics. The shared `name` makes the group
 * exclusive (opening one closes the rest) in browsers that support it, and
 * in the ones that do not you simply get several open at once, which is a
 * perfectly good fallback.
 */

const LINK = "text-primary hover:underline";

function Item({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details
      name="faq"
      className="group border-b border-border last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[15px] font-semibold text-foreground transition-colors hover:text-primary">
        {question}
        {/* Chevron: down when closed, up when open. */}
        <svg
          className="shrink-0 text-faint transition-transform duration-200 group-open:-rotate-180"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div
        className={`pb-5 pr-8 text-[15px] leading-relaxed text-dim ${PROSE_CODE} [&_p+p]:mt-3`}
      >
        {children}
      </div>
    </details>
  );
}

export function FAQ() {
  return (
    <div className="grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,260px)_1fr]">
      <div className="md:sticky md:top-24 md:self-start">
        <p className="text-[17px] leading-snug text-dim">
          Everything you need to
          <br />
          know about seedicon
        </p>
        <p className="mt-5 text-sm leading-relaxed text-faint">
          Not here? The{" "}
          <a href="/docs" className={LINK}>
            docs
          </a>{" "}
          go through every option, and anything still missing is worth an{" "}
          <a
            href={`${LINKS.github}/issues`}
            target="_blank"
            rel="noreferrer"
            className={LINK}
          >
            issue on GitHub
          </a>
          .
        </p>
      </div>

      <div>
        <Item question="Why not just let people upload a photo?">
          <p>
            Because an upload is never only an upload: you store the file,
            resize it, moderate it, serve it, and you still need something to
            show for every account that never uploaded anything. Most products
            want that last part and nothing else — a slot that looks
            intentional and stays the same on every screen. seedicon fills it
            from an id you already have, so there is no file, no bucket and no
            CDN in the picture.
          </p>
        </Item>

        <Item question="How does it actually work?">
          <p>
            The seed is run through a fast 32-bit hash, and the style reads
            numbers off that hash to decide cell colours, angles, offsets and
            how many shapes to draw. The result is written out as an{" "}
            <code>&lt;svg&gt;</code> string.
          </p>
          <p>
            There is no randomness and no I/O anywhere in that path, so the
            same <code>{`{ seed, style, size, shape, radius }`}</code> gives
            byte-for-byte identical markup — on your laptop, on the server, in
            a Deno worker, next year.
          </p>
        </Item>

        <Item question="Can I ship a single style instead of all of them?">
          <p>
            Yes, and it is the recommended thing to do if you picked one and
            stuck with it. Every style has its own entry point:{" "}
            <code>import {`{ quilt }`} from &quot;seedicon/quilt&quot;</code>{" "}
            pulls in that one renderer plus the shared core, and nothing else.{" "}
            <code>seedicon/heraldry</code> is about 2.3KB gzipped against 21KB
            for the root entry.
          </p>
          <p>
            The root entry resolves styles by name, so it has to reference all{" "}
            {SEEDICON_STYLES.length} of them and no bundler can drop the ones
            you never call. The <code>&lt;Avatar&gt;</code> component takes a
            style name too, which means it pulls in the whole registry — if
            bundle size matters more than the convenience, call the
            single-style function and render the markup yourself.
          </p>
        </Item>

        <Item question="Does it render on the server?">
          <p>
            Yes. String in, string out — no <code>canvas</code>, no{" "}
            <code>window</code>, no <code>useEffect</code>, no ref to attach
            anything to. It runs during SSR in Next.js or Remix, and equally
            well in a Node script, an email template or anything else that
            emits HTML. Every avatar in the gallery above was rendered on the
            server.
          </p>
        </Item>

        <Item question="Can I control the shape and size?">
          <p>
            <code>shape</code> is one of <code>square</code>,{" "}
            <code>rounded</code> or <code>circle</code>, and{" "}
            <code>radius</code> overrides it when none of the three is the
            corner you want. The presets are a fraction of <code>size</code>{" "}
            rather than a fixed pixel count, so the same shape holds at 16px
            and at 256px.
          </p>
          <p>
            The corner is a clip applied over the finished artwork, so it
            behaves identically for every style.
          </p>
        </Item>

        <Item question="What do I have to store in the database?">
          <p>
            Nothing, in the common case: call <code>generateAvatar</code> at
            render time with the user id or wallet address you already have.
            If you want people to be able to change their style, store the
            style name in a plain string column and pass it through — that is
            one short string per user, not an image.
          </p>
        </Item>


      </div>
    </div>
  );
}
