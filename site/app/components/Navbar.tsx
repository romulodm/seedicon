"use client"

import Link from "next/link"

import BrandMark from "./BrandMark"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { CONTAINER } from "@/lib/ui"
import { LINKS } from "@/lib/stats"

/**
 * The bar is fixed rather than in flow, so it can slide out of the way while
 * you read down a long docs page and come back the moment you scroll up. That
 * is the only difference from the original: same wordmark, same four links,
 * same hairline under it.
 */

const LINK = "text-dim transition-colors hover:text-foreground"

export default function Navbar() {
    const direction = useScrollDirection()

    return (
        <header
            className={`
                fixed inset-x-0 top-0 z-50 bg-background/85
                backdrop-blur transition-transform duration-300 ease-out
                ${direction === "down" ? "-translate-y-full" : "translate-y-0"}
            `}
        >
            <nav className={`${CONTAINER} flex flex-wrap items-center justify-between gap-3 py-5`}>
                <Link href="/" className="flex items-center gap-2.5 font-mono text-[15px] font-semibold">
                    <BrandMark size={26} />
                    seedicon
                </Link>

                <div className="flex gap-5 text-sm max-[560px]:gap-4 max-[560px]:text-[13px]">
                    <Link href="/docs" className={LINK}>
                        Docs
                    </Link>
                    <Link href="/playground" className={LINK}>
                        Playground
                    </Link>
                    <a href={LINKS.npm} target="_blank" rel="noreferrer" className={LINK}>
                        npm
                    </a>
                    <a href={LINKS.github} target="_blank" rel="noreferrer" className={LINK}>
                        GitHub
                    </a>
                </div>
            </nav>
        </header>
    )
}
