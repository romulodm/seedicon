"use client";

import { useState } from "react";

/**
 * The install line in the hero. The whole box is the button — the target
 * is the command you were already reading, not a 16px icon next to it.
 */

const COMMAND = "npm i seedicon";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be denied (insecure context, permissions).
      // The command stays visible and selectable, so this fails quietly.
    }
  }

  return (
    <button
      type="button"
      className="install"
      data-copied={copied}
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy "${COMMAND}"`}
    >
      <code>{COMMAND}</code>
      <span className="install-icon">{copied ? <CheckIcon /> : <CopyIcon />}</span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
