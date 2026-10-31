"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./search.module.css";

type Hit = { kind?: string; name: string; href: string; note?: string; why: string };
type Results = Record<"quests" | "people" | "places" | "builds" | "guide", Hit[]>;
const GROUPS: [keyof Results, string][] = [
  ["quests", "Quests"],
  ["people", "People"],
  ["places", "Places"],
  ["builds", "Builds"],
  ["guide", "Guide"],
];

/**
 * One search box (WO-154 Part 4): suggestions appear under it while you type, the arrow keys move through them, Enter opens the one you
 * are on, or all the results when you are on none. `all` adds builds and the guide, for the command palette.
 */
export function SearchBox({ placeholder = "Search quests, people, places", initial = "", all = false, autoFocus = false, onGo, className }: { placeholder?: string; initial?: string; all?: boolean; autoFocus?: boolean; onGo?: () => void; className?: string }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState<Results | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // A question that has been out for a moment with nothing back: the list says it is searching (WO-159).
  const [slow, setSlow] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // A box near the right edge opens its list towards the left, so a row's label is never cut off (WO-185 Part 3).
  const [flip, setFlip] = useState(false);
  const measure = () => {
    const r = box.current?.getBoundingClientRect();
    if (r) setFlip(r.left + 420 > window.innerWidth - 16);
  };
  // Suggestions show only while there is enough typed to ask for them.
  const live = q.trim().length >= 2 ? results : null;
  const flat = live ? GROUPS.flatMap(([k]) => live[k]) : [];
  const at = new Map(flat.map((h, i) => [h.href, i]));

  // Ask for suggestions a moment after the last key; a newer question cancels the older.
  useEffect(() => {
    const text = q.trim();
    if (text.length < 2) return;
    const ctl = new AbortController();
    let wait: ReturnType<typeof setTimeout> | undefined;
    const t = setTimeout(async () => {
      wait = setTimeout(() => setSlow(true), 150);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(text)}${all ? "&all=1" : ""}`, { signal: ctl.signal });
        if (r.ok) {
          setResults(await r.json());
          setActive(-1);
        }
        clearTimeout(wait);
        setSlow(false);
      } catch {
        // Cancelled, or offline: the last suggestions stay.
      }
    }, 150);
    return () => {
      clearTimeout(t);
      clearTimeout(wait);
      ctl.abort();
    };
  }, [q, all]);

  useEffect(() => {
    const off = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", off);
    return () => document.removeEventListener("mousedown", off);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    onGo?.();
    router.push(href);
  };
  const all_ = () => go(`/search?q=${encodeURIComponent(q.trim())}`);
  const searching = open && slow && q.trim().length >= 2;
  const shown = open && ((live && flat.length > 0) || searching);
  return (
    <div ref={box} className={`${styles.box} ${className ?? ""}`}>
      <form
        role="search"
        className={styles.field}
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && flat[active]) go(flat[active].href);
          else if (q.trim()) all_();
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#8e9bab" strokeWidth="1.6" aria-hidden="true">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l4 4" />
        </svg>
        <label className={styles.label}>
          <span className="sr-only">Search</span>
          <input
            type="text"
            role="combobox"
            aria-expanded={!!shown}
            aria-controls={`${id}-list`}
            aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoFocus={autoFocus}
            value={q}
            placeholder={placeholder}
            onChange={(e) => {
              setQ(e.target.value);
              measure();
              setOpen(true);
            }}
            onFocus={() => {
              measure();
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && flat.length) {
                e.preventDefault();
                setOpen(true);
                setActive((a) => (a + 1) % flat.length);
              } else if (e.key === "ArrowUp" && flat.length) {
                e.preventDefault();
                setActive((a) => (a <= 0 ? flat.length - 1 : a - 1));
              } else if (e.key === "Escape") setOpen(false);
            }}
          />
        </label>
      </form>
      {shown && (
        <div id={`${id}-list`} role="listbox" aria-label="Suggestions" className={styles.list} style={flip ? { left: "auto", right: 0 } : undefined}>
          {searching && (
            <div role="status" className={styles.searching}>
              <span className={styles.embers} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              Searching
            </div>
          )}
          {GROUPS.map(([key, title]) =>
            live?.[key].length ? (
              <div key={key} role="group" aria-label={title}>
                <div className={styles.group}>{title}</div>
                {live[key].map((h) => {
                  const mine = at.get(h.href) ?? -1;
                  return (
                    <div key={h.href} id={`${id}-o${mine}`} role="option" aria-selected={active === mine} className={`${styles.opt} ${active === mine ? styles.on : ""}`} onMouseEnter={() => setActive(mine)} onMouseDown={(e) => { e.preventDefault(); go(h.href); }}>
                      <span className={styles.top}>
                        <span className={styles.name}>{h.name}</span>
                        {h.kind ? <span className={styles.kind}>{h.kind}</span> : null}
                      </span>
                      {h.note ? <small>{h.note}</small> : null}
                    </div>
                  );
                })}
              </div>
            ) : null,
          )}
          {flat.length > 0 && (
            <button type="button" className={styles.all} onMouseDown={(e) => { e.preventDefault(); all_(); }}>
              All results for “{q.trim()}” ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
