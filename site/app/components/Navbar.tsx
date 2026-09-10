"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import BrandMark from "./BrandMark"
import { GitHubIcon, StarIcon } from "./SocialIcons"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { CONTAINER } from "@/lib/ui"
import { LINKS } from "@/lib/stats"

/**
 * The bar is fixed rather than in flow, so it can slide out of the way while
 * you read down a long docs page and come back the moment you scroll up.
 *
 * On the right of the page links sit the two places the package actually
 * lives — the repository and the registry entry — as marks rather than words,
 * with the stargazer count beside the GitHub one.
 */

const LINK = "text-dim transition-colors hover:text-foreground hover:underline"

/** Icon links: same colour behaviour as the text links, with a hit area big
 *  enough to tap on a phone without enlarging the mark itself. */
const ICON_LINK =
    "inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-dim transition-colors hover:text-foreground"

/** 1234 -> "1.2k". The bar has room for four characters, not six. */
function compact(value: number): string {
    if (value < 1000) return String(value)
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

/**
 * The stargazer count, from the route that caches it server-side.
 *
 * Returns null until it arrives and stays null if it never does — a navbar
 * must not depend on GitHub being reachable, so the failure mode is the
 * count simply not appearing, never a gap held open or an error surfaced.
 */
function useStars(): number | null {
    const [stars, setStars] = useState<number | null>(null)

    useEffect(() => {
        let cancelled = false

        fetch("/api/stars")
            .then((response) => (response.ok ? response.json() : null))
            .then((data: { stars: number | null } | null) => {
                if (!cancelled && typeof data?.stars === "number") setStars(data.stars)
            })
            .catch(() => {
                /* offline, blocked, rate limited — the count just stays off. */
            })

        return () => {
            cancelled = true
        }
    }, [])

    return stars
}

export default function Navbar() {
    const direction = useScrollDirection()
    const stars = useStars()

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

                <div className="flex items-center gap-5 text-sm max-[560px]:gap-3.5 max-[560px]:text-[13px]">
                    <Link href="/docs" className={LINK}>
                        Docs
                    </Link>
                    <Link href="/playground" className={LINK}>
                        Playground
                    </Link>

                    {/* Divider: the links to the left are pages of this site,
                        the marks to the right are somewhere else. */}
                    <span aria-hidden="true" className="h-4 w-px bg-border max-[560px]:hidden" />
                    <a
                        href={LINKS.npm}
                        target="_blank"
                        rel="noreferrer"
                        className={LINK}
                        aria-label="seedicon on npm"
                    >
                        npm
                    </a>

                    <a
                        href={LINKS.github}
                        target="_blank"
                        rel="noreferrer"
                        className={ICON_LINK}
                        aria-label={
                            stars === null
                                ? "seedicon on GitHub"
                                : `seedicon on GitHub, ${stars} stars`
                        }
                    >
                        <GitHubIcon size={17} />
                        {/* The count fades in when it lands. It is appended
                            rather than reserved for, so the bar has no blank
                            slot waiting on a request that may not return. */}
                        {stars !== null && (
                            <span className="inline-flex items-center gap-1 font-mono text-[12.5px] tabular-nums">
                                <StarIcon />
                                <span className="font-semibold mt-0.5">{compact(stars)}</span>
                            </span>
                        )}
                    </a>

                </div>
            </nav>
        </header>
    )
}
