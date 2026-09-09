"use client"

import { useMemo, useState } from "react"
import {
    generateAvatar,
    generateAvatarDataUri,
    SEEDICON_SHAPES,
    SEEDICON_STYLES,
    type SeediconShape,
    type SeediconStyle,
} from "seedicon"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import CopyButton from "@/components/ui/CopyButton"
import { BTN, CODE_BOX, CODE_PRE, CONTAINER } from "@/lib/ui"

/** The slider's range, and the height the preview reserves so the panel
 *  does not resize under the cursor while you drag. */
const MIN_SIZE = 24
const MAX_SIZE = 256

/** An Ethereum-style address: the shape of ID most people arrive holding. */
const DEFAULT_SEED = "0xba32a6076cd558947b3da6148fc4994b421eed56"

/** The three presets are shorthands for a radius, expressed here as a
 *  percentage of the size so the slider and the buttons share one scale. */
const SHAPE_PERCENT: Record<SeediconShape, number> = {
    square: 0,
    rounded: 22,
    circle: 50,
}

/** Selected and unselected states for the style and shape pickers. */
const OPTION = "rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
const OPTION_ON = "border-primary bg-primary/10 text-primary"
const OPTION_OFF = "border-border-strong text-dim hover:text-foreground"

/** Every control under the preview shares one width, so the input and the
 *  four buttons line up as a single column. */
const STACK_ITEM = `${BTN} w-full justify-center`

export default function PlaygroundPage() {
    const [seed, setSeed] = useState(DEFAULT_SEED)
    const [style, setStyle] = useState<SeediconStyle>("pixels")
    const [shape, setShape] = useState<SeediconShape>("rounded")
    const [size, setSize] = useState(128)
    // null while a preset shape is active; a number once the slider is touched.
    const [customPercent, setCustomPercent] = useState<number | null>(null)
    // Which button last copied, so only that one shows its confirmation.
    const [copied, setCopied] = useState<string | null>(null)

    const percent = customPercent ?? SHAPE_PERCENT[shape]
    // Radius is stored as a percentage, so it follows the size slider on its
    // own — a circle stays a circle at every size.
    const radius = Math.round((percent / 100) * size)

    // An empty field would throw, so it falls back to a placeholder rather
    // than blowing the page up mid-edit.
    const activeSeed = seed.trim() || "seedicon"

    // Presets stay readable as a `shape` in the snippet; a dragged slider
    // becomes an explicit `radius`. Both render identically.
    const options = customPercent === null ? { shape } : { radius }

    const svg = useMemo(
        () => generateAvatar({ seed: activeSeed, style, size, ...options }),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- options is derived
        [activeSeed, style, size, shape, customPercent, radius],
    )

    const snippet = useMemo(
        () =>
            [
                `import { Avatar } from "seedicon/react";`,
                ``,
                `<Avatar`,
                `  seed="${activeSeed}"`,
                `  style="${style}"`,
                `  size={${size}}`,
                customPercent === null ? `  shape="${shape}"` : `  radius={${radius}}`,
                `/>`,
            ].join("\n"),
        [activeSeed, style, size, shape, customPercent, radius],
    )

    async function copy(key: string, value: string) {
        try {
            await navigator.clipboard.writeText(value)
            setCopied(key)
            window.setTimeout(() => setCopied(null), 1800)
        } catch {
            // Clipboard access can be denied (insecure context, permissions).
            // Failing quietly is fine — the snippet is visible and selectable.
        }
    }

    return (
        <>
            <Navbar />

            <main className={`${CONTAINER} pb-24 pt-32`}>
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold sm:text-4xl">Playground</h1>
                    <p className="mt-3 text-dim">
                        Type a seed, pick a style and a shape, and see exactly what seedicon renders.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Preview */}
                    <div className="flex flex-col items-center rounded-2xl border border-border bg-input p-10">
                        <div
                            className="flex shrink-0 items-center justify-center"
                            style={{ minHeight: MAX_SIZE }}
                        >
                            <span
                                className="block overflow-hidden shadow-lg"
                                // generateAvatar() escapes its own output; the seed is
                                // never interpolated into the markup unescaped.
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        </div>

                        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
                            <input
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                placeholder="Type any string…"
                                spellCheck={false}
                                className="
                                    w-full rounded-[10px] border border-border-strong bg-raised px-3 py-[11px]
                                    text-center font-mono text-[13px] text-foreground
                                    focus:border-primary focus:outline-none
                                "
                            />
                            <button
                                type="button"
                                className={STACK_ITEM}
                                onClick={() => setSeed(crypto.randomUUID())}
                            >
                                Random UUID
                            </button>
                            <button
                                type="button"
                                className={STACK_ITEM}
                                onClick={() => copy("snippet", snippet)}
                            >
                                {copied === "snippet" ? "Copied component" : "Copy component"}
                            </button>
                            <button
                                type="button"
                                className={STACK_ITEM}
                                onClick={() => copy("svg", svg)}
                            >
                                {copied === "svg" ? "Copied SVG" : "Copy SVG"}
                            </button>
                            <button
                                type="button"
                                className={STACK_ITEM}
                                onClick={() =>
                                    copy(
                                        "uri",
                                        generateAvatarDataUri({
                                            seed: activeSeed,
                                            style,
                                            size,
                                            ...options,
                                        }),
                                    )
                                }
                            >
                                {copied === "uri" ? "Copied data URI" : "Copy data URI"}
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <span className="text-sm font-medium text-foreground">Style</span>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                {SEEDICON_STYLES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStyle(s)}
                                        className={`${OPTION} font-mono ${style === s ? OPTION_ON : OPTION_OFF}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-foreground">Shape</span>
                            <div className="mt-3 flex gap-2">
                                {SEEDICON_SHAPES.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => {
                                            setShape(s)
                                            setCustomPercent(null)
                                        }}
                                        className={`
                                            ${OPTION} flex-1 capitalize
                                            ${shape === s && customPercent === null ? OPTION_ON : OPTION_OFF}
                                        `}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Size</span>
                                <span className="font-mono text-sm text-dim">{size}px</span>
                            </div>
                            <input
                                type="range"
                                min={MIN_SIZE}
                                max={MAX_SIZE}
                                step={4}
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="mt-3 w-full accent-primary"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Corner radius</span>
                                <span className="font-mono text-sm text-dim">{percent}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={50}
                                value={percent}
                                onChange={(e) => setCustomPercent(Number(e.target.value))}
                                className="mt-3 w-full accent-primary"
                            />
                        </div>

                        <CopyButton
                            value="npm i seedicon"
                            label="$ npm i seedicon"
                            copiedLabel="Copied!"
                            className="w-full justify-center"
                        />
                    </div>
                </div>

                {/* Code snippet */}
                <div className={`${CODE_BOX} mt-10`}>
                    <button
                        type="button"
                        onClick={() => copy("snippet", snippet)}
                        className="
                            absolute right-2.5 top-2.5 cursor-pointer rounded-md border border-border-strong
                            bg-raised px-2.5 py-[5px] font-mono text-[11px] text-dim transition-colors
                            hover:border-primary hover:text-foreground
                        "
                    >
                        {copied === "snippet" ? "copied" : "copy"}
                    </button>
                    <pre className={CODE_PRE}>{snippet}</pre>
                </div>
            </main>

            <Footer />
        </>
    )
}
