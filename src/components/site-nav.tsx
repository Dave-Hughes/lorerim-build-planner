"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { useFeatures } from "./features";
import styles from "./site-header.module.css";

interface WorldItem {
  href: string;
  label: string;
  icon: string;
  note: string;
}

/**
 * The header's links (WO-157): Characters, World and Guide. World opens a panel with an icon on each of its pages (Quests, People, Places,
 * Gear while it is on); the page you are on is in ember. On a phone a menu button opens the same list.
 */
export function SiteNav() {
  const path = usePathname() ?? "/";
  const { siteGuide, gear, quests } = useFeatures();
  const id = useId();
  const [world, setWorld] = useState(false);
  const [menu, setMenu] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const worldButton = useRef<HTMLButtonElement>(null);
  const menuWrap = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useDismiss({ open: world, onClose: () => setWorld(false), inside: [wrap], trigger: worldButton });
  useDismiss({ open: menu, onClose: () => setMenu(false), inside: [menuWrap], trigger: menuButton });
  // Going to a page closes both.
  const [seen, setSeen] = useState(path);
  if (seen !== path) {
    setSeen(path);
    setWorld(false);
    setMenu(false);
  }
  // The phone menu is a column of the same links; it follows the window if it grows past a phone.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 700px)");
    const off = () => mq.matches && setMenu(false);
    mq.addEventListener("change", off);
    return () => mq.removeEventListener("change", off);
  }, []);

  const at = (base: string) => path === base || path.startsWith(`${base}/`);
  const items: WorldItem[] = [
    ...(quests
      ? [
          { href: "/quests", label: "Quests", icon: "quest-side-stories", note: "Every quest, by line and by place" },
          { href: "/people", label: "People", icon: "quest-people", note: "Where to find them, what they offer" },
          { href: "/places", label: "Places", icon: "quest-travel", note: "By hold and by type" },
        ]
      : []),
    ...(gear ? [{ href: "/gear", label: "Gear", icon: "slot-main-hand", note: "Every item, and how to make it" }] : []),
  ];
  const charactersHere = path === "/characters" || at("/characters") || at("/b") || at("/p") || at("/playthroughs") || at("/me") || at("/new") || at("/u");
  const worldHere = items.some((i) => at(i.href)) || at("/search");
  const guideHere = at("/guide");

  const list = (
    <ul className={styles.worldList}>
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} aria-current={at(i.href) ? "page" : undefined} className={styles.worldItem}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/${i.icon}.svg`} alt="" width={24} height={24} className={styles.worldIcon} />
            <span className={styles.worldText}>
              <b>{i.label}</b>
              <small>{i.note}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className={styles.nav} aria-label="Site">
        <Link href="/characters" aria-current={charactersHere ? "page" : undefined}>
          Characters
        </Link>
        {items.length > 0 && (
          <div ref={wrap} className={styles.worldWrap}>
            <button
              ref={worldButton}
              type="button"
              className={styles.worldButton}
              aria-expanded={world}
              aria-controls={id}
              aria-current={worldHere ? "page" : undefined}
              onClick={() => setWorld((o) => !o)}
            >
              World
              <i className={styles.navCaret} aria-hidden="true" />
            </button>
            {world && (
              <div id={id} className={styles.worldPanel}>
                {list}
              </div>
            )}
          </div>
        )}
        {siteGuide && (
          <Link href="/guide" aria-current={guideHere ? "page" : undefined}>
            Guide
          </Link>
        )}
      </nav>
      <div ref={menuWrap} className={styles.menuBox}>
        <button ref={menuButton} type="button" className={styles.menuButton} aria-expanded={menu} aria-controls={`${id}-m`} aria-label="Menu" onClick={() => setMenu((o) => !o)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {menu ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 5h14M3 10h14M3 15h14" />}
          </svg>
        </button>
        {menu && (
          <nav id={`${id}-m`} className={styles.menuPanel} aria-label="Menu">
            <Link href="/characters" aria-current={charactersHere ? "page" : undefined} className={styles.menuLink}>
              Characters
            </Link>
            {items.length > 0 && (
              <>
                <span className={styles.menuHead}>World</span>
                {list}
              </>
            )}
            {siteGuide && (
              <Link href="/guide" aria-current={guideHere ? "page" : undefined} className={styles.menuLink}>
                Guide
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
