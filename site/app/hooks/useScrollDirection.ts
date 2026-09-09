"use client"

import { useEffect, useRef, useState } from "react"

type Options = {
    /** Pixels of scroll before the direction is allowed to flip. Avoids
     *  flicker from trackpad micro-scrolls. */
    threshold?: number
    /** Always show the bar while within this many pixels of the top. */
    topOffset?: number
}

/**
 * Reports whether the page is currently scrolling up or down, so a
 * fixed navbar can hide on the way down and reappear on the way up.
 * Pinned to "up" whenever the scroll position is within `topOffset`
 * of the top, so the bar never hides while the page hasn't moved yet.
 */
export function useScrollDirection({ threshold = 8, topOffset = 80 }: Options = {}) {
    const [direction, setDirection] = useState<"up" | "down">("up")
    const lastScrollY = useRef(0)

    useEffect(() => {
        lastScrollY.current = window.scrollY
        let ticking = false

        function update() {
            const currentY = window.scrollY

            if (currentY <= topOffset) {
                setDirection("up")
            } else {
                const delta = currentY - lastScrollY.current
                if (Math.abs(delta) >= threshold) {
                    setDirection(delta > 0 ? "down" : "up")
                }
            }

            lastScrollY.current = currentY
            ticking = false
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update)
                ticking = true
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [threshold, topOffset])

    return direction
}
