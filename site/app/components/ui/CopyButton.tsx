"use client"

import { useState } from "react"

type Props = {
    /** Text copied to the clipboard. */
    value: string
    /** What's shown on the button itself (e.g. "$ npm i seedicon"). */
    label: string
    copiedLabel: string
    className?: string
}

export default function CopyButton({ value, label, copiedLabel, className = "" }: Props) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch {
            // Clipboard API unavailable (e.g. insecure context) — fail quietly,
            // the text is still selectable/visible on the button itself.
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`
                group relative inline-flex cursor-pointer items-center justify-center gap-x-2
                rounded-[10px] border border-border bg-raised p-2 ps-3 font-mono text-sm
                text-dim transition-colors hover:border-border-strong hover:text-foreground
                focus:outline-hidden focus-visible:border-primary
                ${className}
            `}
        >
            {copied ? copiedLabel : label}
            <span className="flex size-7 items-center justify-center rounded-md bg-input">
                {copied ? (
                    <svg className="size-4 shrink-0 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                ) : (
                    <svg className="size-4 shrink-0 transition-transform group-hover:rotate-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    </svg>
                )}
            </span>
        </button>
    )
}
