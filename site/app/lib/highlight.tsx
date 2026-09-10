import type { ReactNode } from "react";

/**
 * A deliberately tiny syntax highlighter for the snippets on this site.
 *
 * It exists because the alternative — shiki, prism, highlight.js — is a
 * dependency plus a theme stylesheet for a handful of code blocks, on the site
 * of a package whose selling point is that it ships zero dependencies.
 *
 * It colours three things and nothing else: comments, string literals and the
 * few keywords the snippets actually contain. Everything past that stays at
 * the body colour, which is what keeps this down to one regex — and the three
 * colours are tokens that already exist in globals.css, so a snippet never
 * introduces a colour the rest of the page does not have.
 */

/** Comment, then string, then keyword. Order matters: a `//` inside a string
 *  must lose to the string branch, and it does because that branch is tried
 *  from the same position first. */
const TOKEN = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|\b(import|from|const|export|return)\b/g;

export function highlight(code: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  // TOKEN is module-level and stateful (the /g flag), so lastIndex has to be
  // reset or the second call to highlight() starts mid-string.
  TOKEN.lastIndex = 0;

  while ((match = TOKEN.exec(code)) !== null) {
    const [text, comment, string] = match;

    if (match.index > last) out.push(code.slice(last, match.index));

    out.push(
      <span
        key={match.index}
        className={comment ? "text-faint" : string ? "text-mint" : "text-primary"}
      >
        {text}
      </span>,
    );

    last = match.index + text.length;
  }

  out.push(code.slice(last));
  return out;
}
