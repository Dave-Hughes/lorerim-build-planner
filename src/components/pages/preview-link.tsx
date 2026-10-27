"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./preview-link.module.css";

interface Preview {
  icon: string;
  name: string;
  line: string;
  fact?: string;
}

/** What each link has told us already, so a second hover is instant. */
const seen = new Map<string, Preview | null>();
const DELAY = 350;
const PAGE = /^\/(people\/[a-z0-9-]+|places\/[a-z0-9-]+|quests\/q\/[a-z0-9-]+)$/;

/**
 * A link to a person, place or quest (WO-157 Part 5): hovering or focusing it for a moment shows a small card with the icon, the name, who or what
 * it is and one useful fact. A touch screen just follows the link. Other addresses are plain links.
 */
export function PreviewLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Preview | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const wanted = PAGE.test(href);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!wanted)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      if (!seen.has(href)) {
        try {
          const r = await fetch(`/api/preview?href=${encodeURIComponent(href)}`);
          seen.set(href, r.ok ? ((await r.json()) as Preview) : null);
        } catch {
          seen.set(href, null);
        }
      }
      const p = seen.get(href) ?? null;
      setData(p);
      setOpen(!!p);
    }, DELAY);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className={styles.wrap}
      onMouseEnter={(e) => {
        // Not on a touch screen: a tap follows the link.
        if (window.matchMedia("(hover: hover)").matches && e.currentTarget) show();
      }}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      <Link href={href} className={className} aria-describedby={open ? id : undefined}>
        {children}
      </Link>
      {open && data && (
        <span id={id} role="tooltip" className={styles.card}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/icons/${data.icon}.svg`} alt="" width={32} height={32} className={styles.icon} />
          <span className={styles.text}>
            <b>{data.name}</b>
            {data.line ? <small>{data.line}</small> : null}
            {data.fact ? <em>{data.fact}</em> : null}
          </span>
        </span>
      )}
    </span>
  );
}
