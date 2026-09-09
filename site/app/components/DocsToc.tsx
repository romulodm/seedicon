"use client";

import { useEffect, useState } from "react";

/**
 * The docs sidebar, with the entry for whatever you are currently reading
 * marked active.
 *
 * Scroll position rather than IntersectionObserver: several sections are
 * taller than the viewport and several are shorter, so "which sections are
 * visible" does not answer "which one am I reading". The section that owns
 * the reading position is simply the last one whose top has crossed a line
 * near the top of the window, which is one cheap read per section per
 * frame and behaves identically whether you scrolled there or clicked a
 * link.
 */

export interface TocItem {
  id: string;
  label: string;
}

/** How far below the top of the window a section takes over, in pixels. */
const MARKER = 140;

export function DocsToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.map((item) => item.id);
    let frame = 0;

    function update() {
      frame = 0;

      let current = ids[0] ?? "";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= MARKER) {
          current = id;
        }
      }

      // The last section is shorter than the viewport, so its top never
      // reaches the marker — without this it could never light up, no
      // matter how far down you are.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = ids[ids.length - 1] ?? current;

      setActive((previous) => (previous === current ? previous : current));
    }

    function onScroll() {
      // One update per frame at most: scroll fires far more often than the
      // screen repaints.
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className="flex flex-col gap-0.5 max-[860px]:flex-row max-[860px]:flex-wrap max-[860px]:gap-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="
            rounded-[7px] px-2.5 py-[5px] text-[13px] text-faint transition-colors
            hover:bg-raised hover:text-foreground
            data-[active=true]:bg-raised data-[active=true]:text-primary
            max-[860px]:border max-[860px]:border-border
            max-[860px]:data-[active=true]:border-primary
          "
          data-active={item.id === active}
          aria-current={item.id === active ? "location" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
