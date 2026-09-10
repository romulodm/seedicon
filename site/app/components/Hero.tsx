import Link from "next/link"

import HeroIcons from "./HeroIcons"
import CopyButton from "./ui/CopyButton"
import { LINKS } from "@/lib/stats"
import { BTN, BTN_PRIMARY, CONTAINER } from "@/lib/ui"

/**
 * Copy on the left, a grid of live avatars on the right. Below 880px the grid
 * would squeeze the copy and it is decorative anyway — the gallery further
 * down the page makes the same point better — so it drops out entirely.
 */
export default function Hero() {
    return (
        <section
            className={`
                ${CONTAINER} grid grid-cols-1 items-center gap-12 pb-12 pt-24
                min-[880px]:grid-cols-[minmax(0,1fr)_auto]
            `}
        >
            <div>
                <h1 className="text-[clamp(40px,7vw,64px)] font-bold leading-[1.05] tracking-[-0.03em]">
                    Avatars from
                    <br />a string.
                </h1>

                <p className="mt-5 max-w-[620px] text-[19px] leading-relaxed text-dim">
                    <strong className="font-semibold text-foreground">seedicon</strong> turns
                    any string into a deterministic SVG avatar. Same seed in, same avatar out,
                    forever. Nothing is uploaded, stored, resized or moderated: the only thing
                    you keep is the ID you already had.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link className={BTN_PRIMARY} href="/playground">
                        Try it
                    </Link>
                    <a className={BTN} href={LINKS.github} target="_blank" rel="noreferrer">
                        Source
                    </a>
                    <CopyButton value="npm i seedicon" label="$ npm i seedicon" copiedLabel="Copied!" />
                </div>

                <div className="mt-5 flex flex-col items-start text-sm sm:flex-row sm:items-center gap-1">
                    <span className="text-dim">Zero dependencies, zero stored images.</span>

                    <Link
                        href="/docs"
                        className="inline-flex items-center gap-x-1 font-medium text-primary hover:underline"
                    >
                        Read the docs
                        <svg
                            className="size-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </Link>
                </div>
            </div>

            <HeroIcons />
        </section>
    )
}
