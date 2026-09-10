"use client"

import { useEffect, useRef } from "react"

/**
 * The wordmark at the foot of every page, drawn as a field of flickering
 * pixels in the shape of the word "seedicon".
 *
 * It is the same idea as the WebGL dot-matrix shader the design came from —
 * a grid of squares, each one picking an opacity from a fixed ladder, each
 * one re-rolling on its own schedule, revealed outward from the centre on
 * first paint and brightened under the cursor — but rendered on a 2D canvas
 * instead, which costs the site nothing: no three.js, no react-three-fiber,
 * no framer-motion. That matters here more than on most sites, because the
 * package this page documents ships with zero dependencies of its own.
 *
 * The letterforms come from the canvas itself: the word is drawn once to an
 * offscreen buffer, and the alpha channel of that buffer decides which grid
 * cells are inside a glyph. So the mask always matches whatever monospace
 * face the visitor's system resolves, at whatever width the page is.
 */

const TEXT = "seedicon"

const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'

/** Grid pitch and dot size, in CSS pixels. The 2px of slack between them is
 *  what makes the field read as pixels rather than as a solid fill. */
const CELL = 5
const DOT = 3

/** The opacity ladder. Weighted low: most cells sit dim, a tenth burn full. */
const OPACITIES = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]

/** Six slots, two per colour, so a cell's colour is a stable roll of a die.
 *  Blue through violet — the same family as --color-primary. */
const COLORS: ReadonlyArray<readonly [number, number, number]> = [
    [96, 140, 255],
    [96, 140, 255],
    [124, 124, 255],
    [124, 124, 255],
    [168, 140, 255],
    [168, 140, 255],
]

/** Seconds a cell holds an opacity before re-rolling. Each cell's phase is
 *  offset by its own hash, so the field never pulses in unison. */
const FREQUENCY = 5

/** Multiplier on the intro sweep. Higher finishes sooner. */
const INTRO_SPEED = 5

/** Radius of the cursor's influence, in grid cells. */
const HOVER_RADIUS = 30

/** Frames per second. 30 is indistinguishable from 60 for a flicker this
 *  slow and halves the work on a page that is already drawing avatars. */
const FPS = 30

const PAD = 8

/** A cheap integer hash in [0, 1). Stands in for the shader's tan/fract
 *  trick: what matters is that it is deterministic per cell and looks
 *  uncorrelated, not that it matches GLSL bit for bit. */
function random(x: number, y: number): number {
    let h = Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1)
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b)
    h ^= h >>> 13
    return (h >>> 0) / 4294967296
}

interface Field {
    /** Cell coordinates on the grid, used for hashing and for hover distance. */
    gx: Int16Array
    gy: Int16Array
    /** Top-left corner of each dot, in CSS pixels. */
    px: Float32Array
    py: Float32Array
    /** Phase offset of the cell's flicker, and its colour slot. */
    offset: Float32Array
    color: Uint8Array
    /** How long the intro sweep waits before this cell lights up. */
    intro: Float32Array
    count: number
}

/**
 * Renders the word to an offscreen buffer and keeps one entry per grid cell
 * that lands inside a glyph. Everything the draw loop needs is precomputed
 * here, so a frame is a flat walk over typed arrays.
 */
function buildField(width: number): { field: Field; height: number } | null {
    const buffer = document.createElement("canvas")
    const ctx = buffer.getContext("2d", { willReadFrequently: true })
    if (!ctx || width < 2) return null

    // Two passes over the font: measure at a nominal size, then scale so the
    // word spans the container, then measure again for the real box.
    const fit = (size: number) => {
        ctx.font = `700 ${size}px ${MONO}`
        // Tightens the tracking the way the navbar wordmark is tracked.
        // Not in every engine yet, hence the guard — and it has to be set
        // before measuring, since it changes the advance width.
        if ("letterSpacing" in ctx) {
            ; (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
                `${-size * 0.04}px`
        }
        return ctx.measureText(TEXT)
    }

    const nominal = fit(100).width
    if (nominal <= 0) return null

    const fontSize = ((width - PAD * 2) / nominal) * 100
    const metrics = fit(fontSize)
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.72
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2
    const height = Math.ceil(ascent + descent + PAD * 2)

    // Resizing clears the context state, so the font has to be set again.
    buffer.width = width
    buffer.height = height
    const drawn = fit(fontSize)
    ctx.fillStyle = "#fff"
    ctx.fillText(TEXT, (width - drawn.width) / 2, PAD + ascent)

    const alpha = ctx.getImageData(0, 0, width, height).data
    const cols = Math.floor(width / CELL)
    const rows = Math.floor(height / CELL)
    const centreX = cols / 2
    const centreY = rows / 2

    const capacity = cols * rows
    const gx = new Int16Array(capacity)
    const gy = new Int16Array(capacity)
    const px = new Float32Array(capacity)
    const py = new Float32Array(capacity)
    const offset = new Float32Array(capacity)
    const color = new Uint8Array(capacity)
    const intro = new Float32Array(capacity)
    let count = 0

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const sampleX = Math.floor(col * CELL + CELL / 2)
            const sampleY = Math.floor(row * CELL + CELL / 2)
            // Alpha at the cell's centre decides membership. A mid threshold
            // keeps the antialiased rim of a stroke from growing the glyph by
            // a whole pixel on every side.
            if (alpha[(sampleY * width + sampleX) * 4 + 3] < 110) continue

            const roll = random(col, row)
            gx[count] = col
            gy[count] = row
            px[count] = col * CELL + (CELL - DOT) / 2
            py[count] = row * CELL + (CELL - DOT) / 2
            offset[count] = roll
            color[count] = Math.floor(roll * COLORS.length) % COLORS.length
            intro[count] =
                Math.hypot(col - centreX, row - centreY) * 0.01 + random(col + 977, row + 131) * 0.15
            count++
        }
    }

    return { field: { gx, gy, px, py, offset, color, intro, count }, height }
}

/** rgba() strings for every colour × opacity pair, built once. Composing them
 *  per dot per frame would allocate tens of thousands of strings a second. */
const SWATCHES = COLORS.map((rgb) =>
    OPACITIES.map((opacity) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`),
)

export default function PixelWordmark({ className = "" }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const reduceMotion =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches

        let field: Field | null = null
        let width = 0
        let height = 0
        let frame = 0
        let start = 0
        let lastDraw = 0
        let visible = false

        // Cursor position in grid cells, and how much of its glow is faded in.
        let mouseX = -1e4
        let mouseY = -1e4
        let hover = 0
        let hovering = false

        function draw(now: number) {
            frame = 0
            if (!field || !ctx) return

            // The intro sweep is timed from the moment the footer first came
            // into view, not from mount, so nobody scrolls down to a field
            // that already finished revealing itself off-screen.
            if (!start) start = now
            const elapsed = reduceMotion ? 1e3 : (now - start) / 1000

            hover += ((hovering ? 1 : 0) - hover) * 0.12
            if (hover < 0.002) hover = 0

            ctx.clearRect(0, 0, width, height)

            for (let i = 0; i < field.count; i++) {
                if (elapsed * INTRO_SPEED < field.intro[i]) continue

                const col = field.gx[i]
                const row = field.gy[i]
                const bucket = Math.floor(elapsed / FREQUENCY + field.offset[i] + FREQUENCY)
                const level = Math.min(
                    9,
                    Math.floor(random(col + bucket * 31, row + bucket * 17) * 10),
                )
                const slot = field.color[i]

                if (hover > 0.002) {
                    const distance = Math.hypot(col - mouseX, row - mouseY)
                    if (distance < HOVER_RADIUS) {
                        // Smoothstep from the rim of the glow to its centre,
                        // scaled by how faded-in the glow currently is.
                        const t = 1 - distance / HOVER_RADIUS
                        const weight = t * t * (3 - 2 * t) * hover
                        const rgb = COLORS[slot]
                        // Mostly an opacity lift rather than a colour lift:
                        // pushing the channels hard enough to read as a glow
                        // drives them to white and loses the brand blue.
                        const lift = 1 + weight * 0.35
                        ctx.fillStyle = `rgba(${Math.min(255, Math.round(rgb[0] * lift))},${Math.min(
                            255,
                            Math.round(rgb[1] * lift),
                        )},${Math.min(255, Math.round(rgb[2] * lift))},${Math.min(
                            1,
                            OPACITIES[level] * (1 + weight * 1.6),
                        )})`
                        ctx.fillRect(field.px[i], field.py[i], DOT, DOT)
                        continue
                    }
                }

                ctx.fillStyle = SWATCHES[slot][level]
                ctx.fillRect(field.px[i], field.py[i], DOT, DOT)
            }
        }

        function schedule() {
            if (frame || !visible) return
            frame = window.requestAnimationFrame((now) => {
                // A still field only needs redrawing when the glow is moving.
                if (reduceMotion && !hover && !hovering) {
                    draw(now)
                    return
                }
                if (now - lastDraw >= 1000 / FPS) {
                    lastDraw = now
                    draw(now)
                }
                frame = 0
                schedule()
            })
        }

        function layout() {
            if (!canvas || !ctx) return
            const measured = Math.floor(canvas.parentElement?.clientWidth ?? canvas.clientWidth)
            if (measured === width && field) return

            const built = buildField(measured)
            if (!built) return

            width = measured
            height = built.height
            field = built.field

            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            lastDraw = 0
            schedule()
        }

        function onPointerMove(event: PointerEvent) {
            const rect = canvas!.getBoundingClientRect()
            mouseX = (event.clientX - rect.left) / CELL
            mouseY = (event.clientY - rect.top) / CELL
            hovering = true
            schedule()
        }

        function onPointerLeave() {
            hovering = false
            schedule()
        }

        const observer = new ResizeObserver(layout)
        if (canvas.parentElement) observer.observe(canvas.parentElement)

        // Nothing animates while the footer is off-screen — which, on the
        // docs page, is most of the time.
        const visibility = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting
                if (visible) schedule()
                else if (frame) {
                    window.cancelAnimationFrame(frame)
                    frame = 0
                }
            },
            { rootMargin: "120px" },
        )
        visibility.observe(canvas)

        canvas.addEventListener("pointermove", onPointerMove)
        canvas.addEventListener("pointerleave", onPointerLeave)

        // Web fonts settling would change the glyph mask; a font-neutral
        // stack makes that unlikely, but re-fitting is cheap insurance.
        document.fonts?.ready.then(() => {
            width = 0
            layout()
        })

        layout()

        return () => {
            observer.disconnect()
            visibility.disconnect()
            canvas.removeEventListener("pointermove", onPointerMove)
            canvas.removeEventListener("pointerleave", onPointerLeave)
            if (frame) window.cancelAnimationFrame(frame)
        }
    }, [])

    return (
        <div className={`w-full ${className}`}>
            <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />
            <span className="sr-only">{TEXT}</span>
        </div>
    )
}
