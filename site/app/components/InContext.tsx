"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

/**
 * The playground's "how does this look in my app" panel. The avatar shows up
 * at every size products ship it at, then in the places users actually meet
 * it: a browser tab, a navbar, a profile card, a chat, a comment thread,
 * notifications, an assignee stack and a member table — on a dark or a light
 * surface.
 *
 * It renders nothing itself. The playground hands it a `render` function that
 * already carries the chosen style and corner, so the panel cannot drift from
 * the main preview. The seed never reaches the markup as markup: it goes
 * through seedicon's hash and comes back out as numbers, so injecting the
 * returned SVG is safe even though the seed is user input.
 */

type Props = {
    /** Returns the avatar's SVG at `size`, optionally for a different seed. */
    render: (size: number, seed?: string) => string
    /** The seed being previewed: every "you" in the panel. */
    seed: string
    /** The corner as a percentage of the size, for the rings in the
     *  assignee stack, which have to follow the avatar's own shape. */
    radiusPercent: number
}

/** The sizes avatars actually ship at, largest first, down to a favicon. */
const LADDER = [128, 96, 64, 48, 40, 32, 24, 16]

/** The rest of the fake team, in the kinds of ID people really pass in:
 *  emails, usernames, a wallet address and a UUID. */
const TEAM = [
    { id: "maria@acme.io", name: "Maria Souza", role: "Admin", seen: "now" },
    { id: "user_8812", name: "user_8812", role: "Member", seen: "5 min ago" },
    { id: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", name: "0x5aAe…BeAed", role: "Member", seen: "1 h ago" },
    { id: "lucas.ferreira", name: "Lucas Ferreira", role: "Member", seen: "yesterday" },
    { id: "c4f1e2a0-77b3-4d1e-9a52-1f0d9e6b3c88", name: "c4f1e2a0…3c88", role: "Viewer", seen: "3 days ago" },
]
const [MARIA, USER, WALLET, LUCAS] = TEAM

type Theme = "dark" | "light"

/**
 * The panel's own colours, as custom properties so one toggle swaps every
 * surface at once. Dark reuses the site's tokens. Light is the only place the
 * site has light colours, which is why they are local to this component and
 * not in globals.css.
 */
const THEMES: Record<Theme, CSSProperties> = {
    dark: {
        "--c-bg": "var(--color-input)",
        "--c-card": "var(--color-raised)",
        "--c-sunk": "var(--color-background)",
        "--c-border": "var(--color-border)",
        "--c-fg": "var(--color-foreground)",
        "--c-dim": "var(--color-dim)",
    } as CSSProperties,
    light: {
        "--c-bg": "#f6f6f8",
        "--c-card": "#ffffff",
        "--c-sunk": "#eeeef2",
        "--c-border": "#e3e3ea",
        "--c-fg": "#17171c",
        "--c-dim": "#5f5f6e",
    } as CSSProperties,
}

const CARD = "min-w-0 rounded-xl border border-[var(--c-border)] bg-[var(--c-card)] p-4"
const TITLE = "text-[13px] font-semibold"
const META = "text-xs text-[var(--c-dim)]"

function Svg({ html, className = "" }: { html: string; className?: string }) {
    return <span className={`block shrink-0 leading-none ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

function Card({ title, aside, className = "", children }: { title?: string; aside?: ReactNode; className?: string; children: ReactNode }) {
    return (
        <div className={`${CARD} ${className}`}>
            {title ? (
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className={TITLE}>{title}</span>
                    {aside}
                </div>
            ) : null}
            {children}
        </div>
    )
}

export default function InContext({ render, seed, radiusPercent }: Props) {
    const [theme, setTheme] = useState<Theme>("dark")

    return (
        <section
            aria-label="Avatar in context"
            style={THEMES[theme]}
            className="grid gap-4 rounded-2xl border border-[var(--c-border)] bg-[var(--c-bg)] p-4 text-[var(--c-fg)] transition-colors sm:p-6"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold">In context</h2>
                    <p className={META}>Your seed in the places users actually see it.</p>
                </div>
                <div className="inline-flex overflow-hidden rounded-[10px] border border-[var(--c-border)] bg-[var(--c-card)]">
                    {(["dark", "light"] as const).map((option) => (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={theme === option}
                            onClick={() => setTheme(option)}
                            className="
                                cursor-pointer border-l border-[var(--c-border)] px-3 py-1.5 text-[13px] capitalize
                                text-[var(--c-dim)] first:border-l-0 hover:text-[var(--c-fg)]
                                aria-pressed:bg-primary/10 aria-pressed:text-primary
                            "
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Browser window: a tab whose favicon is the avatar at 16px,
                then the app's navbar with the account button at 32px. */}
            <div className="overflow-hidden rounded-xl border border-[var(--c-border)] bg-[var(--c-card)]">
                <div className="flex items-end gap-1 bg-[var(--c-sunk)] px-3 pt-2">
                    <div className="flex min-w-0 items-center gap-2 rounded-t-lg bg-[var(--c-card)] px-3 py-2 text-xs">
                        <Svg html={render(16)} />
                        <span className="truncate">acme · Dashboard</span>
                        <span className="text-[var(--c-dim)]">×</span>
                    </div>
                    <div className={`hidden items-center gap-2 px-3 py-2 sm:flex ${META}`}>
                        <Svg html={render(16, MARIA.id)} />
                        <span>Maria Souza · Profile</span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-[var(--c-border)] px-4 py-3 text-[13px]">
                    <span className="font-bold tracking-tight">acme</span>
                    <span className="hidden gap-5 text-[var(--c-dim)] sm:flex">
                        <span className="text-[var(--c-fg)]">Dashboard</span>
                        <span>Projects</span>
                        <span>Team</span>
                        <span>Billing</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className={`hidden sm:inline ${META}`}>you</span>
                        <Svg html={render(32)} />
                    </span>
                </div>
            </div>

            {/* Size ladder: the question here is whether the style survives
                being small, so the sizes stop at a favicon. */}
            <Card title="Sizes" aside={<span className={META}>128 → 16px</span>}>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                    {LADDER.map((size) => (
                        <figure key={size} className="grid justify-items-center gap-1.5">
                            <Svg html={render(size)} />
                            <figcaption className="font-mono text-[10px] text-[var(--c-dim)]">{size}px</figcaption>
                        </figure>
                    ))}
                </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile card. The banner is the same avatar blown up and
                    blurred, so it always matches whatever style is picked. */}
                <div className="min-w-0 overflow-hidden rounded-xl border border-[var(--c-border)] bg-[var(--c-card)]">
                    <div className="relative h-20 overflow-hidden" aria-hidden="true">
                        <Svg html={render(360)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-90 blur-2xl saturate-150" />
                    </div>
                    <div className="px-4 pb-4">
                        {/* relative + z-10: the banner is positioned and its
                            content is not, so without this the banner paints on
                            top of the avatar that overlaps it. */}
                        <div className="relative z-10 -mt-9 flex items-end justify-between">
                            <span className="rounded-[inherit] bg-[var(--c-card)] p-1" style={{ borderRadius: `${radiusPercent}%` }}>
                                <Svg html={render(72)} />
                            </span>
                            <span className="rounded-lg border border-[var(--c-border)] px-3 py-1 text-xs font-medium">Edit profile</span>
                        </div>
                        <div className="mt-3 font-semibold">You</div>
                        <div className="truncate font-mono text-xs text-[var(--c-dim)]">{seed}</div>
                        <div className={`mt-3 flex gap-4 ${META}`}>
                            <span><b className="font-semibold text-[var(--c-fg)]">12</b> projects</span>
                            <span><b className="font-semibold text-[var(--c-fg)]">5</b> teammates</span>
                        </div>
                    </div>
                </div>

                {/* Chat: your avatar next to someone else's, turn by turn. */}
                <Card title="Messages" aside={<span className={META}>#onboarding</span>} className="lg:row-span-2">
                    <div className="grid gap-3 text-[13px]">
                        {[
                            { from: MARIA.id, text: "Is the new avatar picker live yet?" },
                            { from: null, text: "Yes. Every account already has one, generated from the user id." },
                            { from: MARIA.id, text: "Same picture on my phone and on my laptop. Nothing to upload?" },
                            { from: null, text: "Nothing stored anywhere. Same seed, same avatar." },
                            { from: LUCAS.id, text: "Mine came out great. Shipping it." },
                        ].map((message, index) => {
                            const mine = message.from === null
                            return (
                                <div key={index} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                                    <Svg html={render(28, message.from ?? undefined)} />
                                    <p
                                        className={`
                                            max-w-[80%] rounded-2xl px-3 py-2
                                            ${mine ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm bg-[var(--c-sunk)]"}
                                        `}
                                    >
                                        {message.text}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* Notifications */}
                <Card title="Notifications" aside={<span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white">3</span>}>
                    <div className="grid gap-3 text-[13px]">
                        {[
                            { from: MARIA, text: "mentioned you in Onboarding v2", when: "2 min" },
                            { from: USER, text: "approved your pull request", when: "1 h" },
                            { from: WALLET, text: "joined the workspace", when: "1 d" },
                        ].map((item) => (
                            <div key={item.from.id} className="flex items-start gap-2.5">
                                <Svg html={render(32, item.from.id)} />
                                <p className="min-w-0 flex-1">
                                    <b className="font-semibold">{item.from.name}</b> {item.text}
                                </p>
                                <span className={`shrink-0 ${META}`}>{item.when}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Comment thread with a reply, nested one level. */}
                <Card title="Comments" aside={<span className={META}>2</span>}>
                    <div className="grid gap-3 text-[13px]">
                        <div className="grid grid-cols-[auto_1fr] gap-2.5">
                            <Svg html={render(36)} />
                            <div className="min-w-0">
                                <b className="font-semibold">you</b> <span className={META}>· 2 min ago</span>
                                <p className="mt-0.5">Shipped the new onboarding flow. Avatars come straight from the user id.</p>
                            </div>
                        </div>
                        <div className="ml-12 grid grid-cols-[auto_1fr] gap-2.5 border-l border-[var(--c-border)] pl-3">
                            <Svg html={render(28, USER.id)} />
                            <div className="min-w-0">
                                <b className="font-semibold">{USER.name}</b> <span className={META}>· just now</span>
                                <p className="mt-0.5">Looks great at small sizes too.</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Assignee stack: overlapping avatars need a ring in the card
                    colour, shaped like the avatar, to stay separable. */}
                <Card title="Assignees" aside={<span className={META}>Onboarding v2</span>}>
                    <div className="flex items-center">
                        {[seed, ...TEAM.map((member) => member.id)].map((member, index) => (
                            <span
                                key={`${index}-${member}`}
                                className="-ml-2 bg-[var(--c-card)] p-0.5 first:ml-0"
                                style={{ borderRadius: `${radiusPercent}%`, zIndex: 10 - index }}
                            >
                                <Svg html={render(32, member)} />
                            </span>
                        ))}
                        <span className="-ml-2 grid size-9 place-items-center rounded-full border-2 border-[var(--c-card)] bg-[var(--c-sunk)] text-[11px] font-semibold text-[var(--c-dim)]">
                            +8
                        </span>
                    </div>
                    <p className={`mt-3 ${META}`}>You and 13 others are working on this.</p>
                </Card>
            </div>

            {/* Member table: the one place your seed sits in a column of
                others, which is how you judge whether a style tells people
                apart. */}
            <Card title="Members" aside={<span className={META}>{TEAM.length + 1}</span>} className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[13px]">
                    <thead className={META}>
                        <tr>
                            <th className="pb-2 font-normal">Name</th>
                            <th className="pb-2 font-normal">Role</th>
                            <th className="pb-2 text-right font-normal">Last active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[{ id: seed, name: "You", role: "Owner", seen: "now" }, ...TEAM].map((member, index) => (
                            <tr key={`${index}-${member.id}`} className="border-t border-[var(--c-border)]">
                                <td className="py-2.5">
                                    <span className="flex min-w-0 items-center gap-2.5">
                                        <Svg html={render(28, member.id)} />
                                        <span className="min-w-0">
                                            <span className="block font-medium">{member.name}</span>
                                            <span className="block max-w-[220px] truncate font-mono text-[11px] text-[var(--c-dim)]">{member.id}</span>
                                        </span>
                                    </span>
                                </td>
                                <td className={META}>{member.role}</td>
                                <td className={`text-right ${META}`}>{member.seen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </section>
    )
}
