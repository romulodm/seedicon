import Link from "next/link"

import BrandMark from "./BrandMark"
import FooterLink from "./FooterLink"
import PixelWordmark from "./PixelWordmark"
import { CONTAINER } from "@/lib/ui"
import { LINKS } from "@/lib/stats"

/**
 * Three columns of links over the wordmark, which is drawn as a field of
 * animated pixels rather than set as type — the same thing the package does
 * to a seed, done to the package's own name.
 *
 * The columns are data rather than markup so the three of them cannot drift
 * apart in spacing or hover behaviour; FooterLink owns all of that.
 */

interface Column {
    heading: string
    links: { label: string; href: string; external?: boolean }[]
}

const COLUMNS: Column[] = [
    {
        heading: "Pages",
        links: [
            { label: "Home", href: "/" },
            { label: "Docs", href: "/docs" },
            { label: "Playground", href: "/playground" },
        ],
    },
    {
        heading: "Socials",
        links: [
            { label: "npm", href: LINKS.npm, external: true },
            { label: "GitHub", href: LINKS.github, external: true },
        ],
    },
    {
        heading: "Legal",
        links: [{ label: "MIT License", href: LINKS.license, external: true }],
    },
]

export default function Footer() {
    return (
        <footer>
            <div className={`${CONTAINER} border-t border-border flex flex-wrap justify-between gap-x-12 gap-y-10 pt-10`}>
                <div className="max-w-[300px]">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 font-mono text-[15px] font-semibold"
                    >
                        <BrandMark size={26} />
                        seedicon
                    </Link>

                    <p className="mt-4 text-[13px] leading-relaxed text-dim">
                        Deterministic SVG avatars from any string seed. No image storage, no
                        uploads, no CDN.
                    </p>

                    <p className="mt-5 text-[13px] text-faint">
                        MIT · built by{" "}
                        <a
                            href="https://github.com/romulodm"
                            target="_blank"
                            rel="noreferrer"
                            className="text-dim transition-colors hover:text-foreground"
                        >
                            @romulodm
                        </a>
                    </p>
                    <p className="mt-1 text-[13px] text-faint">
                        © {new Date().getFullYear()} seedicon. All rights reserved.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
                    {COLUMNS.map((column) => (
                        <div key={column.heading}>
                            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                                {column.heading}
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink
                                            href={link.href}
                                            label={link.label}
                                            external={link.external}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* The wordmark sits flush against the container's gutters and is
                the last thing on the page, the way a signature is. */}
            <div className={`mx-auto w-full max-w-page py-5`}>
                <PixelWordmark />
            </div>
        </footer>
    )
}
