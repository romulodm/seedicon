/**
 * The three or four class strings that would otherwise be copy-pasted across
 * pages. Everything else is written inline on the element that uses it — this
 * file exists for the handful of things that genuinely repeat, so a button on
 * the home page and a button in the playground cannot drift apart.
 *
 * Tailwind scans this file like any other source file, so the classes below
 * are generated exactly as if they had been written in the JSX.
 */

/** The page container: 960px, centred, with the gutter the site has always had. */
export const CONTAINER = "mx-auto w-full max-w-page px-4 md:px-6";

/** Secondary button — a raised surface that picks up the accent on hover. */
export const BTN =
  "inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-border-strong bg-raised px-[18px] py-[11px] text-sm font-medium text-foreground transition-colors hover:border-primary";

/** Primary button — inverted, used once per page at most. */
export const BTN_PRIMARY =
  "inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-foreground bg-foreground px-[18px] py-[11px] text-sm font-medium text-background transition-opacity hover:opacity-90";

/** Code block: the box and the <pre> inside it. */
export const CODE_BOX =
  "relative overflow-x-auto rounded-[10px] border border-border bg-input px-[18px] py-4";
export const CODE_PRE = "font-mono text-[13px] leading-[1.65] text-foreground/85";

/**
 * Inline `<code>` inside prose. Applied to the paragraph rather than to each
 * tag, because the docs page contains roughly forty of them and tagging every
 * one by hand is how a page ends up inconsistent.
 */
export const PROSE_CODE =
  "[&_code]:rounded-[5px] [&_code]:border [&_code]:border-border [&_code]:bg-input [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-foreground";
