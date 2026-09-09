"use client"

import { useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { generateAvatar, type SeediconStyle } from "seedicon"

/**
 * The grid beside the hero copy: three columns of avatars sliding past each
 * other, the middle one against the other two. Every tile is generated at
 * render time by the package itself — there is no image file anywhere here,
 * which is exactly the claim the paragraph next to it is making.
 *
 * Hovering a column stops it and names the string that produced the tile
 * under the cursor. That is the point of the whole thing: the picture is a
 * function of an id you already had, and the tooltip is where you can see the
 * id it came from.
 */

type Tile = { seed: string; style: SeediconStyle }

/**
 * Fixed ids, the kind an app already has lying around: wallet addresses,
 * UUIDs, emails, sequential user ids, slugs. Styles are spread across the
 * columns so no two neighbours look like variations of one idea.
 */
const COLUMNS: Tile[][] = [
    [
        { seed: "0xba32a6076cd558947b3da6148fc4994b421eed56", style: "pixels" },
        { seed: "user-000001", style: "gradient" },
        { seed: "romulodm.dev", style: "truchet" },
        { seed: "550e8400-e29b-41d4-a716-446655440000", style: "pixelart" },
        { seed: "team-standup", style: "marble" },
    ],
    [
        { seed: "0x71ac9c02f4a1d3b8e5760c2841fa9d3e0b77ef21", style: "jdenticon" },
        { seed: "grace@example.com", style: "heraldry" },
        { seed: "user-000042", style: "waves" },
        { seed: "sprint-42", style: "kaleidoscope" },
        { seed: "9f8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d", style: "identicon" },
    ],
    [
        { seed: "GARQ7XJ4LKF2M9NPZC5VHT8YB3WD6QSEUA0RGXKJ2LMN", style: "stellar" },
        { seed: "linus@example.com", style: "streamlines" },
        { seed: "user-000137", style: "terrain" },
        { seed: "release-candidate", style: "dither" },
        { seed: "0x4b1877ef09a2c6d3f5e81b04a7c92de6f3081b45", style: "lifehash" },
    ],
]

/**
 * Per column, so the three never line up into a single moving block. The
 * middle column also runs in reverse, which is what makes it read as three
 * independent tracks rather than one scrolling image.
 */
const DURATIONS = ["26s", "32s", "29s"]

/**
 * Small enough to read as an avatar slot rather than as artwork. The 12px
 * gap under each tile is `pb-3` on the tile itself rather than `gap` on the
 * track, so one copy of a column is exactly N × (56 + 12) tall and the -50%
 * keyframe seams with no jump.
 */
const SIZE = 56

type Hovered = { column: number; seed: string; style: string; y: number }

export function HeroIcons() {
    const frame = useRef<HTMLDivElement>(null)
    // Which column the cursor is in (stopped), and which tile it is over
    // (named by the tooltip). Two pieces of state because moving off a tile
    // onto the gap beside it should not restart the column.
    const [paused, setPaused] = useState<number | null>(null)
    const [hovered, setHovered] = useState<Hovered | null>(null)

    function onTileEnter(event: MouseEvent<HTMLSpanElement>, column: number, tile: Tile) {
        const frameBox = frame.current?.getBoundingClientRect()
        if (!frameBox) return

        // Measured now rather than after the pause lands: a column travels
        // about 15px per second, so the tile has moved a quarter of a pixel
        // by the time this frame paints.
        const tileBox = event.currentTarget.getBoundingClientRect()

        setHovered({
            column,
            seed: tile.seed,
            style: tile.style,
            y: tileBox.top + tileBox.height / 2 - frameBox.top,
        })
    }

    return (
        <div ref={frame} className="relative hidden gap-3 min-[880px]:flex">
            {COLUMNS.map((tiles, column) => (
                <div
                    key={column}
                    onMouseEnter={() => setPaused(column)}
                    onMouseLeave={() => {
                        setPaused(null)
                        setHovered(null)
                    }}
                    // The fade is a mask rather than an overlay, so it works
                    // over whatever the hero background happens to be.
                    className="
                        h-[340px] overflow-hidden
                        [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]
                    "
                >
                    <div
                        className={`
                            flex animate-drift flex-col motion-reduce:animate-none
                            ${column === 1 ? "[animation-direction:reverse]" : ""}
                        `}
                        style={
                            {
                                "--drift-duration": DURATIONS[column],
                                animationPlayState: paused === column ? "paused" : "running",
                            } as CSSProperties
                        }
                    >
                        {/* Two identical copies. The keyframe travels -50%, which is
                            where the second copy starts, so the loop has no seam. */}
                        {[0, 1].map((copy) =>
                            tiles.map((tile) => (
                                <span
                                    key={`${copy}-${tile.style}`}
                                    onMouseEnter={(event) => onTileEnter(event, column, tile)}
                                    className="
                                        block shrink-0 pb-3 opacity-80 transition-opacity
                                        duration-150 hover:opacity-100
                                    "
                                    // Hard-coded seeds from this file, turned into
                                    // numbers by seedicon's hash — no user input
                                    // reaches this markup.
                                    dangerouslySetInnerHTML={{
                                        __html: generateAvatar({
                                            seed: tile.seed,
                                            style: tile.style,
                                            size: SIZE,
                                            shape: "rounded",
                                        }),
                                    }}
                                />
                            )),
                        )}
                    </div>
                </div>
            ))}

            {/* One tooltip for the whole grid, placed to the left of it: the
                columns clip their own overflow, so a tooltip rendered inside
                one would be cut off by the fade it sits under. */}
            {hovered ? (
                <div
                    role="status"
                    style={{ top: hovered.y }}
                    className="
                        pointer-events-none absolute right-full mr-3 -translate-y-1/2
                        whitespace-nowrap rounded-lg border border-border-strong bg-raised
                        px-3 py-1.5 text-xs shadow-lg
                    "
                >
                    <span className="font-mono text-foreground">{hovered.seed}</span>
                    <span className="ml-2 text-faint">{hovered.style}</span>
                </div>
            ) : null}
        </div>
    )
}

export default HeroIcons
