"use client";

import { useState } from "react";

import { BTN } from "../../lib/ui";

/**
 * The two copy affordances used by the avatar cards on the home page.
 *
 * They exist as their own client components so the cards themselves can stay
 * server components: the avatars, the data URIs and the snippets are all
 * generated during the render on the server, and the only JavaScript that
 * reaches the browser for that section is the clipboard call below.
 */

/** How long the confirmation stays up before the label reverts. */
const CONFIRM_MS = 1400;

function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), CONFIRM_MS);
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
      // Failing quietly is fine — the text is visible and selectable.
    }
  }

  return { copied, copy };
}

/** The small chip pinned to the top-right corner of a code block. */
export function CopyChip({ value }: { value: string }) {
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className="absolute right-2.5 top-2.5 cursor-pointer rounded-md border border-border-strong bg-raised px-2.5 py-[5px] font-mono text-[11px] text-dim transition-colors hover:border-primary hover:text-foreground"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

/** A full-size button that copies a value and confirms in place. */
export function CopyAction({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <button type="button" className={BTN} onClick={() => copy(value)}>
      {copied ? copiedLabel : label}
    </button>
  );
}
