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

import CodeTabs from "@/components/CodeTabs"
import Footer from "@/components/Footer"
import InContext from "@/components/InContext"
import Navbar from "@/components/Navbar"
import CopyButton from "@/components/ui/CopyButton"
import { BTN, BTN_PRIMARY, CONTAINER } from "@/lib/ui"

/** The slider's range, and the height the preview reserves so the panel
 *  does not resize under the cursor while you drag. */
const MIN_SIZE = 24
const MAX_SIZE = 256

/** Size of each style tile's avatar: big enough to tell the styles apart,
 *  small enough that seventeen of them fit in the side column. */
const TILE_SIZE = 44

/** Edge of the downloaded PNG. 512px covers any profile-picture slot (most
 *  platforms ask for 400 to 512px). The avatar is re-rendered at this size
 *  rather than scaled up from the preview, so grid styles stay crisp. */
const DOWNLOAD_SIZE = 512

/** An Ethereum-style address: the shape of ID most people arrive holding. */
const DEFAULT_SEED = "0xba32a6076cd558947b3da6148fc4994b421eed56"

/** The three presets are shorthands for a radius, expressed here as a
 *  percentage of the size so the slider and the buttons share one scale. */
const SHAPE_PERCENT: Record<SeediconShape, number> = {
    square: 0,
    rounded: 22,
    circle: 50,
}

/** Selected and unselected states for the shape picker. */
const OPTION = "rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
const OPTION_ON = "border-primary bg-primary/10 text-primary"
const OPTION_OFF = "border-border-strong text-dim hover:text-foreground"

/** A style tile: the avatar in that style over its name. */
const TILE = `
    grid min-w-0 cursor-pointer justify-items-center gap-1.5 rounded-[10px] border px-1 pb-2 pt-2.5
    transition-colors
`
const TILE_ON = "border-primary bg-primary/10 text-primary"
const TILE_OFF = "border-border bg-raised text-dim hover:border-border-strong"

export default function PlaygroundPage() {
    const [seed, setSeed] = useState(DEFAULT_SEED)
    const [style, setStyle] = useState<SeediconStyle>("pixels")
    const [shape, setShape] = useState<SeediconShape>("rounded")
    const [size, setSize] = useState(128)
    // null while a preset shape is active; a number once the slider is touched.
    const [customPercent, setCustomPercent] = useState<number | null>(null)
    // Which action last finished, so only that button shows its confirmation.
    const [done, setDone] = useState<string | null>(null)

    const percent = customPercent ?? SHAPE_PERCENT[shape]
    // Radius is stored as a percentage, so it follows the size slider on its
    // own — a circle stays a circle at every size.
    const radius = Math.round((percent / 100) * size)

    // An empty field would throw, so it falls back to a placeholder rather
    // than blowing the page up mid-edit.
    const activeSeed = seed.trim() || "seedicon"

    /**
     * Every avatar on the page goes through here, so the preview, the style
     * tiles, the context panel and the download can never disagree. A preset
     * passes through as `shape`; a dragged slider becomes a `radius` scaled to
     * whatever size is being drawn, so a 16px copy has the same proportions
     * as the 256px one.
     */
    function render(px: number, overrides: { style?: SeediconStyle; seed?: string } = {}) {
        return generateAvatar({
            seed: overrides.seed ?? activeSeed,
            style: overrides.style ?? style,
            size: px,
            ...(customPercent === null ? { shape } : { radius: (percent / 100) * px }),
        })
    }

    const svg = useMemo(
        () => render(size),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- render reads these
        [activeSeed, style, size, shape, customPercent],
    )

    // Seventeen renders, so they only rerun when something they show changes
    // (not when the size slider moves, since tiles have a fixed size).
    const tiles = useMemo(
        () => SEEDICON_STYLES.map((option) => ({ style: option, svg: render(TILE_SIZE, { style: option }) })),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- render reads these
        [activeSeed, shape, customPercent],
    )

    const codeTabs = useMemo(() => {
        const corner = customPercent === null ? `shape="${shape}"` : `radius={${radius}}`
        const cornerJs = customPercent === null ? `shape: "${shape}"` : `radius: ${radius}`

        return [
            {
                label: "React",
                code: [
                    `import { Avatar } from "seedicon/react";`,
                    ``,
                    `<Avatar`,
                    `  seed="${activeSeed}"`,
                    `  style="${style}"`,
                    `  size={${size}}`,
                    `  ${corner}`,
                    `/>`,
                ].join("\n"),
            },
            {
                label: "JavaScript",
                code: [
                    `import { generateAvatar } from "seedicon";`,
                    ``,
                    `const svg = generateAvatar({`,
                    `  seed: "${activeSeed}",`,
                    `  style: "${style}",`,
                    `  size: ${size},`,
                    `  ${cornerJs},`,
                    `});`,
                ].join("\n"),
            },
            { label: "SVG", code: svg, raw: true },
        ]
    }, [activeSeed, style, size, shape, customPercent, radius, svg])

    function flash(key: string) {
        setDone(key)
        window.setTimeout(() => setDone(null), 1800)
    }

    async function copyDataUri() {
        try {
            await navigator.clipboard.writeText(
                generateAvatarDataUri({
                    seed: activeSeed,
                    style,
                    size,
                    ...(customPercent === null ? { shape } : { radius }),
                }),
            )
            flash("uri")
        } catch {
            // Clipboard access can be denied (insecure context, permissions).
            // The SVG tab shows the same markup, so nothing is lost.
        }
    }

    /**
     * PNG rather than JPG because the rounded and circle shapes have
     * transparent corners, and JPG would fill them with a solid color.
     *
     * The browser does the rasterizing: the SVG is loaded as an image, drawn
     * onto a canvas and read back as a PNG. A blob: URL is same-origin, so
     * the canvas is not tainted and toBlob() is allowed.
     */
    async function downloadPng() {
        const svgUrl = URL.createObjectURL(new Blob([render(DOWNLOAD_SIZE)], { type: "image/svg+xml" }))

        try {
            const image = new Image()
            image.src = svgUrl
            await image.decode()

            const canvas = document.createElement("canvas")
            canvas.width = DOWNLOAD_SIZE
            canvas.height = DOWNLOAD_SIZE
            canvas.getContext("2d")?.drawImage(image, 0, 0, DOWNLOAD_SIZE, DOWNLOAD_SIZE)

            const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
            if (!png) return

            // The seed can be anything, so only letters and digits make it
            // into the file name.
            const slug = activeSeed.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 32) || "avatar"
            const pngUrl = URL.createObjectURL(png)
            const link = document.createElement("a")
            link.href = pngUrl
            link.download = `seedicon-${style}-${slug}.png`
            link.click()
            // Revoking synchronously can cancel the download in some browsers.
            window.setTimeout(() => URL.revokeObjectURL(pngUrl), 1000)

            flash("png")
        } finally {
            URL.revokeObjectURL(svgUrl)
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

                <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                    {/* Left: the avatar, then everything that changes how it is drawn. */}
                    <div className="flex min-w-0 flex-col gap-6">
                        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-input p-4 ">
                            <div
                                className="flex shrink-0 items-center justify-center"
                                style={{ minHeight: MAX_SIZE }}
                            >
                                <span
                                    className="block drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                                    // generateAvatar() escapes its own output; the seed is
                                    // never interpolated into the markup unescaped.
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                />
                            </div>

                            <div className="flex w-full max-w-md gap-2">
                                <input
                                    value={seed}
                                    onChange={(e) => setSeed(e.target.value)}
                                    placeholder="Type any string…"
                                    aria-label="Seed"
                                    spellCheck={false}
                                    className="
                                        min-w-0 flex-1 rounded-[10px] border border-border-strong bg-raised px-3 py-[11px]
                                        text-center font-mono text-[13px] text-foreground
                                        focus:border-primary focus:outline-none
                                    "
                                />
                                <button
                                    type="button"
                                    title="Random UUID"
                                    aria-label="Random UUID"
                                    onClick={() => setSeed(crypto.randomUUID())}
                                    className="
                                        grid w-11 shrink-0 cursor-pointer place-items-center rounded-[10px] border
                                        border-border-strong bg-raised text-dim transition-colors
                                        hover:border-primary hover:text-foreground
                                    "
                                >
                                    {/* Crossing arrows: the shuffle glyph every media player
                                        uses, which reads as "random" at a glance. */}
                                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="m18 14 4 4-4 4" />
                                        <path d="m18 2 4 4-4 4" />
                                        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                                        <path d="M2 6h1.6c1.4 0 2.8.8 3.5 2" />
                                        <path d="M22 18h-6c-1.4 0-2.7-.7-3.4-1.9" />
                                    </svg>
                                </button>
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
                                            ${OPTION} flex flex-1 items-center justify-center gap-1.5 capitalize
                                            ${shape === s && customPercent === null ? OPTION_ON : OPTION_OFF}
                                        `}
                                    >
                                        <svg className="size-3" viewBox="0 0 12 12" aria-hidden="true">
                                            <rect x="1" y="1" width="10" height="10" rx={SHAPE_PERCENT[s] / 10} fill="none" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground">Size</span>
                                    <span className="font-mono text-sm text-dim">{size}px</span>
                                </div>
                                <input
                                    type="range"
                                    aria-label="Size"
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
                                    aria-label="Corner radius"
                                    min={0}
                                    max={50}
                                    value={percent}
                                    onChange={(e) => setCustomPercent(Number(e.target.value))}
                                    className="mt-3 w-full accent-primary"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className={`${BTN_PRIMARY} flex-1 basis-56 justify-center`}
                                onClick={downloadPng}
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 3v12" />
                                    <path d="m7 10 5 5 5-5" />
                                    <path d="M5 21h14" />
                                </svg>
                                {done === "png" ? "Downloaded" : `Download PNG · ${DOWNLOAD_SIZE}px`}
                            </button>
                            <button type="button" className={`${BTN} flex-1 basis-36 justify-center`} onClick={copyDataUri}>
                                {done === "uri" ? "Copied data URI" : "Copy data URI"}
                            </button>
                            <CopyButton
                                value="npm i seedicon"
                                label="$ npm i seedicon"
                                copiedLabel="Copied!"
                                className="flex-1 basis-48 justify-center"
                            />
                        </div>

                        {/* The code for exactly what is on screen. */}
                        <CodeTabs tabs={codeTabs} />
                    </div>

                    {/* Right: every style already rendered with your seed, then the
                        code for the current configuration. */}
                    <div className="flex min-w-0 flex-col gap-8">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Style</span>
                                <span className="font-mono text-sm text-dim">{SEEDICON_STYLES.length}</span>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-1.5">
                                {tiles.map((tile) => (
                                    <button
                                        key={tile.style}
                                        type="button"
                                        title={tile.style}
                                        aria-pressed={style === tile.style}
                                        onClick={() => setStyle(tile.style)}
                                        className={`${TILE} ${style === tile.style ? TILE_ON : TILE_OFF}`}
                                    >
                                        <span
                                            className="block leading-none"
                                            dangerouslySetInnerHTML={{ __html: tile.svg }}
                                        />
                                        <span className="max-w-full truncate font-mono text-[10.5px]">
                                            {tile.style}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Under everything: the same avatar inside a real interface. */}
                <div className="mt-12">
                    <InContext
                        seed={activeSeed}
                        radiusPercent={percent}
                        render={(px, other) => render(px, { seed: other })}
                    />
                </div>
            </main>

            <Footer />
        </>
    )
}
