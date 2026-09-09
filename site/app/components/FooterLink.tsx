"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

/**
 * A footer link that decrypts itself on hover: the label scrambles through
 * random glyphs and resolves left to right, while a pale wipe slides in from
 * the left behind it.
 *
 * The label is monospaced so the scramble cannot change the link's width —
 * every substituted glyph occupies the same advance as the one it replaced,
 * which is what keeps the column from twitching while it settles.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/@#$%&*<>"

/** How long the whole label takes to resolve, and how often it re-rolls.
 *  Re-rolling every frame reads as noise rather than as decryption. */
const DURATION = 420
const TICK = 45

function useDecrypt(label: string, active: boolean): string {
    const [display, setDisplay] = useState(label)

    useEffect(() => {
        if (!active) {
            setDisplay(label)
            return
        }
        if (
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return
        }

        const start = performance.now()
        let rolled = 0
        let frame = 0

        function tick(now: number) {
            const progress = Math.min((now - start) / DURATION, 1)

            if (now - rolled >= TICK) {
                rolled = now
                // Characters to the left of the cursor have settled; the rest
                // are still ciphertext. Spaces never scramble, so multi-word
                // labels keep their shape.
                const settled = Math.floor(progress * label.length)
                setDisplay(
                    label
                        .split("")
                        .map((char, index) =>
                            index < settled || char === " "
                                ? char
                                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
                        )
                        .join(""),
                )
            }

            if (progress < 1) frame = requestAnimationFrame(tick)
            else setDisplay(label)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [active, label])

    return display
}

export default function FooterLink({
    href,
    label,
    external = false,
}: {
    href: string
    label: string
    /** External links open in a new tab and use a plain anchor, since the
     *  router has nothing to prefetch for them. */
    external?: boolean
}) {
    const [hovered, setHovered] = useState(false)
    const display = useDecrypt(label, hovered)

    const inner = (
        <>
            {/* The accessible name stays the real label whatever the scramble
                is showing, and screen readers never see the ciphertext. */}
            <span aria-hidden="true">{display}</span>
            <span className="sr-only">{label}</span>

            {/* The underline. A hairline scaled to nothing and grown from its
                left edge, rather than a border toggled on — a transform
                animates, and `text-decoration` does not. It inherits the
                link's colour, so it brightens with the label. */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left
                    scale-x-0 bg-current transition-transform duration-300 ease-out
                    group-hover:scale-x-100 group-focus-visible:scale-x-100
                "
            />
        </>
    )

    const className =
        "group relative inline-flex font-mono text-[13px] text-dim transition-colors hover:text-foreground"

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className={className}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
            >
                {inner}
            </a>
        )
    }

    return (
        <Link
            href={href}
            className={className}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
        >
            {inner}
        </Link>
    )
}
