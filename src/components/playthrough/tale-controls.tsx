"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { readEarly } from "@/lib/playthroughs/actions";
import s from "./tale.module.css";

/** "Read it anyway": shows a beat before the game gets there. Reading it early doesn't tick anything. */
export function ReadAnyway({ id, chapterId, isOwner, when, children }: { id: string; chapterId: number; isOwner: boolean; when: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return (
    <span className={s.waitLine}>
      {when}{" "}
      <button
        type="button"
        className={s.linkButton}
        onClick={() => {
          setOpen(true);
          if (isOwner) void readEarly(id, chapterId);
        }}
      >
        Read it anyway
      </button>
    </span>
  );
}

/**
 * The thin bar over the plate (WO-114): the character's name, Play / Tale / Build in small type, and
 * the way back to the quest log. It fades out once the page is 200px down and comes back on scroll up.
 */
export function TaleBar({ name, play, build, back }: { name: string; play: string; build: string | null; back: { href: string; label: string } }) {
  const [shown, setShown] = useState(true);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShown(y < 200 || y < last.current);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`${s.bar} ${shown ? "" : s.barHidden}`} role="navigation" aria-label="Views">
      <Link href={play} className={s.barName}>
        {name}
      </Link>
      <span className={s.barTabs}>
        <Link href={play}>Play</Link>
        <span aria-current="page">Tale</span>
        {build && <Link href={build}>Build</Link>}
        <Link href={back.href} className={s.barBack}>
          {back.label}
        </Link>
      </span>
    </div>
  );
}

interface Group {
  part: string;
  items: { id: number; title: string; open: boolean; small: string }[];
}

/**
 * Contents (WO-114): a tab on the left edge, 200px from the top, that opens a 320px drawer over the
 * page with the tale's parts; the one being read in ember, waiting ones dim. Escape or a click outside
 * closes it.
 */
export function ContentsDrawer({ groups, addHref }: { groups: Group[]; addHref: string | null }) {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState<number | null>(null);
  const drawer = useRef<HTMLElement>(null);
  const tab = useRef<HTMLButtonElement>(null);
  // The piece being read: the last one whose top has passed a third of the window.
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const onScroll = () => {
      let at: number | null = null;
      for (const el of els) if (el.getBoundingClientRect().top < window.innerHeight / 3) at = Number(el.dataset.chapter);
      setReading(at);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    drawer.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      tab.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (drawer.current && !drawer.current.contains(e.target as Node) && !tab.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  return (
    <>
      <button ref={tab} type="button" className={s.ctab} aria-expanded={open} aria-controls="tale-contents" onClick={() => setOpen((o) => !o)}>
        Contents
      </button>
      {open && (
        <nav ref={drawer} id="tale-contents" className={s.drawer} aria-label="Contents">
          {groups.map((g) => (
            <div key={g.part} style={{ display: "contents" }}>
              <span className={s.part}>{g.part}</span>
              {g.items.length ? (
                g.items.map((c) => (
                  <a key={c.id} href={`#c${c.id}`} className={c.id === reading ? s.on : c.open ? undefined : s.locked} aria-current={c.id === reading ? "location" : undefined} onClick={() => setOpen(false)}>
                    {c.title}
                    {c.small && <small>{c.small}</small>}
                  </a>
                ))
              ) : (
                <span className={s.tocEmpty}>Nothing written yet</span>
              )}
            </div>
          ))}
          {addHref && (
            <span className={s.drawerAdd}>
              <Link href={addHref}>Add a chapter</Link>
              <span className={s.dim}>| Up to 5 images each</span>
            </span>
          )}
        </nav>
      )}
    </>
  );
}
