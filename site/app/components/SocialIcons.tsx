/**
 * The two brand marks the navbar links out with: GitHub's Octicon and npm's
 * block logo, plus the star that labels the stargazer count.
 *
 * All three are drawn with `fill="currentColor"` and sized by prop rather than
 * by a stylesheet rule, so each inherits the colour transition of the link
 * wrapping it. `aria-hidden` is set because every use already carries a
 * screen-reader label on the link itself — the mark is decoration on top of
 * that name, never the name.
 */

interface IconProps {
    /** Edge length in pixels. The logos have different viewBoxes but each is
     *  drawn to fill its own, so equal `size` reads as equal weight. */
    size?: number
    className?: string
}

export function GitHubIcon({ size = 16, className }: IconProps) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
    )
}

export function NpmIcon({ size = 16, className }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H4v4H1.334V8.667h5.332v5.331zm4 0v1.336H8V8.667h5.334v5.332h-2.668zm12.001 0h-1.33v-4h-1.336v4h-1.33v-4h-1.336v4h-2.668V8.667h8v5.331zM10.665 10H12v2.667h-1.335V10z" />
        </svg>
    )
}

export function StarIcon({ size = 12, className }: IconProps) {
    return (
        <svg
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
    )
}
