"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { startTour } from "@/lib/tour";
import { Avatar } from "@/components/ui/avatar";
import styles from "./site-header.module.css";

/**
 * The avatar's menu: My page, My builds (My characters, WO-114), Sign out. A real menu button: Enter, Space or the down
 * arrow opens it on the first item, arrows move, Esc closes and returns to the button, a click
 * outside closes it. The page you're on is marked.
 */
export function AccountMenu({ name, image, handle, review = null, signOut }: { name: string; image: string | null; handle: string | null; /** Admins: how much waits on the review list (WO-40). */ review?: number | null; signOut: () => Promise<void> }) {
  const pathname = usePathname();
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const links = [
    ...(handle ? [{ href: `/u/${handle}`, label: "My page" }] : []),
    { href: "/me", label: "My characters" },
    ...(review !== null ? [{ href: "/admin/review", label: review ? `Review (${review})` : "Review" }] : []),
  ];
  // The links, Show me around (WO-61), then Sign out.
  const count = links.length + 2;

  const focusItem = (i: number) => items.current[(i + count) % count]?.focus();
  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };

  useDismiss({ open, onClose: () => setOpen(false), inside: [wrap], trigger: button });

  const onMenuKey = (e: React.KeyboardEvent) => {
    const i = items.current.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") focusItem(i + 1);
    else if (e.key === "ArrowUp") focusItem(i - 1);
    else if (e.key === "Home") focusItem(0);
    else if (e.key === "End") focusItem(count - 1);
    else if (e.key === "Escape") close(true);
    else if (e.key === "Tab") close();
    else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  return (
    <div ref={wrap} className={styles.menuWrap}>
      <button
        ref={button}
        type="button"
        className={styles.who}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${name || "You"}: account menu`}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) requestAnimationFrame(() => focusItem(0));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusItem(e.key === "ArrowDown" ? 0 : count - 1));
          }
        }}
      >
        <Avatar name={name} image={image} />
        <span className={styles.whoName}>{name}</span>
        {!!review && (
          <span className={styles.reviewCount} aria-label={`${review} to review`}>
            {review}
          </span>
        )}
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div id={id} role="menu" aria-label="Account" className={styles.menu} onKeyDown={onMenuKey}>
          {links.map((l, i) => (
            <Link
              key={l.href}
              ref={(el) => {
                items.current[i] = el;
              }}
              href={l.href}
              role="menuitem"
              tabIndex={-1}
              aria-current={pathname === l.href ? "page" : undefined}
              className={styles.menuItem}
              onClick={() => close()}
            >
              {l.label}
            </Link>
          ))}
          <button
            ref={(el) => {
              items.current[links.length] = el;
            }}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className={styles.menuItem}
            onClick={() => {
              close();
              startTour();
            }}
          >
            Show me around
          </button>
          <form action={signOut} className={styles.menuForm}>
            <button
              ref={(el) => {
                items.current[links.length + 1] = el;
              }}
              type="submit"
              role="menuitem"
              tabIndex={-1}
              className={styles.menuItem}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
