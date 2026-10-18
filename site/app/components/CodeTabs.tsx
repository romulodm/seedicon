"use client"

import { useId, useRef, useState, type KeyboardEvent } from "react"

import { highlight } from "@/lib/highlight"
import { CODE_PRE } from "@/lib/ui"

/**
 * The playground's code block: one tab per way of using what you configured,
 * with a copy button that copies whichever tab is open. It sits in the
 * narrow side column, hence the smaller type and the horizontal scroll.
 *
 * Same tab pattern as the home page's UsageTabs (roving tabindex, arrow keys),
 * kept separate because that component's tabs are fixed content and these are
 * generated from the playground's state on every change.
 */

export type CodeTab = {
    label: string
    code: string
    /** Raw SVG is one long line, so it wraps instead of scrolling sideways,
     *  and is left uncoloured since the highlighter only knows JS. */
    raw?: boolean
}

const TAB =
    "cursor-pointer rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 font-mono text-xs text-faint transition-colors hover:text-dim focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary aria-selected:border-primary aria-selected:bg-input aria-selected:text-foreground"

export default function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
    const [active, setActive] = useState(0)
    const [copied, setCopied] = useState(false)
    const buttons = useRef<(HTMLButtonElement | null)[]>([])
    const id = useId()

    const tab = tabs[active]

    function select(next: number) {
        setActive(next)
        setCopied(false)
    }

    function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        const last = tabs.length - 1
        let next: number | null = null

        if (event.key === "ArrowRight") next = active === last ? 0 : active + 1
        else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1
        else if (event.key === "Home") next = 0
        else if (event.key === "End") next = last

        if (next === null) return
        event.preventDefault()
        select(next)
        buttons.current[next]?.focus()
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(tab.code)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1400)
        } catch {
            // Clipboard access can be denied (insecure context, permissions).
            // Ignoring it is fine — the code is visible and selectable.
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-raised">
            <div className="flex items-end justify-between gap-2 px-1.5 pt-1.5">
                <div role="tablist" aria-label="Code for this avatar" className="flex flex-wrap gap-0.5">
                    {tabs.map((option, index) => (
                        <button
                            key={option.label}
                            ref={(node) => {
                                buttons.current[index] = node
                            }}
                            type="button"
                            role="tab"
                            id={`${id}-tab-${index}`}
                            aria-selected={index === active}
                            aria-controls={`${id}-panel`}
                            tabIndex={index === active ? 0 : -1}
                            onClick={() => select(index)}
                            onKeyDown={onKeyDown}
                            className={TAB}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={copy}
                    className="
                        mb-1.5 mr-1 cursor-pointer rounded-md border border-border-strong bg-input px-2.5 py-[5px]
                        font-mono text-[11px] text-dim transition-colors hover:border-primary hover:text-foreground
                    "
                >
                    {copied ? "copied" : "copy"}
                </button>
            </div>

            <div
                role="tabpanel"
                id={`${id}-panel`}
                aria-labelledby={`${id}-tab-${active}`}
                className="bg-input px-[18px] py-4"
            >
                <pre
                    className={`
                        ${CODE_PRE}
                        text-xs
                        ${tab.raw ? "max-h-72 overflow-y-auto whitespace-pre-wrap break-all" : "overflow-x-auto"}
                    `}
                >
                    {tab.raw ? tab.code : highlight(tab.code)}
                </pre>
            </div>
        </div>
    )
}
