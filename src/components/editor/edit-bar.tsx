"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { setBuildVisibility } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import styles from "./edit-bar.module.css";

export type EditPage = "levels" | "setup" | "guide";

const PAGES: { key: EditPage; label: string; path: string }[] = [
  { key: "levels", label: "Levels", path: "edit" },
  { key: "setup", label: "Set up", path: "setup" },
  { key: "guide", label: "Guide", path: "guide" },
];

const VIS_ORDER: BuildVisibility[] = ["public", "unlisted", "private"];

export const VISIBILITY: Record<BuildVisibility, { label: string; text: string }> = {
  public: { label: "Listed", text: "Listed on Browse builds" },
  unlisted: { label: "Link only", text: "Anyone with the link" },
  private: { label: "Only you", text: "Only you" },
};

function VisibilityIcon({ v }: { v: BuildVisibility }) {
  return (
    <svg className={styles.visIcon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {v === "public" ? (
        <>
          <circle cx="8" cy="8" r="6.2" />
          <path d="M1.8 8h12.4M8 1.8c2 2 2 10.4 0 12.4M8 1.8c-2 2-2 10.4 0 12.4" />
        </>
      ) : v === "unlisted" ? (
        <path d="M6.6 9.4l2.8-2.8M7.2 4.6l1.4-1.4a2.6 2.6 0 0 1 3.7 3.7l-1.4 1.4M8.8 11.4l-1.4 1.4a2.6 2.6 0 0 1-3.7-3.7l1.4-1.4" />
      ) : (
        <>
          <rect x="3.2" y="7" width="9.6" height="6.6" />
          <path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7" />
        </>
      )}
    </svg>
  );
}

/**
 * A menu button: Enter, Space or the arrows open it on an item, arrows move, Esc closes and returns
 * to the button, a click outside or Tab away closes it. `children` gets `close` for its items.
 */
export function MenuButton({
  className,
  buttonClassName,
  buttonLabel,
  menuLabel,
  startAt = 0,
  button,
  children,
}: {
  className?: string;
  buttonClassName: string;
  buttonLabel: string;
  menuLabel: string;
  startAt?: number;
  button: React.ReactNode;
  children: (close: (refocus?: boolean) => void) => React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useDismiss({ open, onClose: () => setOpen(false), inside: [wrap], trigger });
  const items = () => [...(wrap.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];
  const focusAt = (i: number) => {
    const all = items();
    all[(i + all.length) % all.length]?.focus();
  };
  const openAt = (i: number) => {
    setOpen(true);
    requestAnimationFrame(() => focusAt(i));
  };
  // Back to the button after Esc or a choice (in an effect: refs aren't read while rendering).
  const [refocus, setRefocus] = useState(0);
  useEffect(() => {
    if (refocus) trigger.current?.focus();
  }, [refocus]);
  const close = (back = false) => {
    setOpen(false);
    if (back) setRefocus((n) => n + 1);
  };
  return (
    <div ref={wrap} className={`${styles.menuWrap} ${className ?? ""}`}>
      <button
        ref={trigger}
        type="button"
        className={buttonClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={buttonLabel}
        onClick={() => (open ? setOpen(false) : openAt(startAt))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openAt(e.key === "ArrowDown" ? 0 : -1);
          }
        }}
      >
        {button}
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          aria-label={menuLabel}
          className={styles.menu}
          onKeyDown={(e) => {
            const all = items();
            const i = all.indexOf(document.activeElement as HTMLElement);
            if (e.key === "ArrowDown") focusAt(i + 1);
            else if (e.key === "ArrowUp") focusAt(i - 1);
            else if (e.key === "Home") focusAt(0);
            else if (e.key === "End") focusAt(all.length - 1);
            else if (e.key === "Escape") close(true);
            else if (e.key === "Tab") return setOpen(false);
            else return;
            e.preventDefault();
          }}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

/**
 * The owner's bar on every editing page (Levels, Set up, Guide) and on their shared page: the
 * build's name, the three pages, the save status, who can see it, Copy link, and View build (or
 * Edit on the shared page). Sticky under the site header. Phones: the name, who can see it, and a
 * ⋯ menu with the rest.
 */
export function EditBar({
  buildId,
  name,
  current,
  status,
  visibility: initial,
  onVisibility,
}: {
  buildId: string;
  name: string;
  /** The editing page you're on; null on the shared page. */
  current: EditPage | null;
  status?: React.ReactNode;
  visibility: BuildVisibility;
  /** Told when the visibility changes here (Set up keeps its own copy). */
  onVisibility?: (v: BuildVisibility) => void;
}) {
  const [visibility, setVisibility] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const choose = async (v: BuildVisibility, close: (refocus?: boolean) => void) => {
    close(true);
    if (v === visibility) return;
    const before = visibility;
    setVisibility(v);
    setSaving(true);
    setError(null);
    const r = await setBuildVisibility(buildId, v);
    setSaving(false);
    if (r.ok) onVisibility?.(v);
    else {
      setVisibility(before);
      setError(r.error);
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/b/${buildId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy. The link is the build page's address.");
    }
  };
  const view = current ? (
    <Link href={`/b/${buildId}`} className="btn btn-sm btn-primary">
      View build
    </Link>
  ) : (
    <Link href={`/b/${buildId}/edit`} className="btn btn-sm btn-primary">
      Edit
    </Link>
  );

  return (
    <div className={styles.bar} role="region" aria-label="Edit bar" data-edit-bar="">
      <div className={`page ${styles.inner}`}>
        <span className={styles.name} title={name}>
          {name}
        </span>
        <nav aria-label="Editing pages" className={styles.pages}>
          {PAGES.map((p) => (
            <Link key={p.key} href={`/b/${buildId}/${p.path}`} className={styles.page} aria-current={current === p.key ? "page" : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
        <span className={styles.right}>
          {(status || saving || error) && (
            <span className={styles.status} role="status">
              {error ? <span className="bad">{error}</span> : saving ? "Saving…" : status}
            </span>
          )}
          <MenuButton
            buttonClassName={styles.visButton}
            buttonLabel={`Who can see it: ${VISIBILITY[visibility].label}`}
            menuLabel="Who can see it"
            startAt={Math.max(0, VIS_ORDER.indexOf(visibility))}
            button={
              <>
                <VisibilityIcon v={visibility} />
                <span>{VISIBILITY[visibility].label}</span>
                <span className={styles.caret} aria-hidden="true">
                  ▾
                </span>
              </>
            }
          >
            {(close) =>
              VIS_ORDER.map((v) => (
                <button key={v} type="button" role="menuitemradio" aria-checked={visibility === v} tabIndex={-1} className={styles.menuItem} onClick={() => void choose(v, close)}>
                  <VisibilityIcon v={v} />
                  <span className={styles.menuText}>
                    <span className={styles.menuLabel}>{VISIBILITY[v].label}</span>
                    <span className={styles.menuSub}>{VISIBILITY[v].text}</span>
                  </span>
                </button>
              ))
            }
          </MenuButton>
          <button type="button" className={`btn btn-sm ${styles.wide}`} onClick={copy}>
            {copied ? "Copied" : "Copy link"}
          </button>
          <span className={styles.wide}>{view}</span>
          <MenuButton className={styles.narrow} buttonClassName={`btn btn-sm btn-icon ${styles.moreButton}`} buttonLabel="More" menuLabel="More" button="⋯">
            {(close) => (
              <>
                {PAGES.map((p) => (
                  <Link key={p.key} href={`/b/${buildId}/${p.path}`} role="menuitem" tabIndex={-1} className={styles.menuItem} aria-current={current === p.key ? "page" : undefined} onClick={() => close()}>
                    {p.label}
                  </Link>
                ))}
                <button type="button" role="menuitem" tabIndex={-1} className={styles.menuItem} onClick={copy}>
                  {copied ? "Copied" : "Copy link"}
                </button>
                <Link href={current ? `/b/${buildId}` : `/b/${buildId}/edit`} role="menuitem" tabIndex={-1} className={styles.menuItem} onClick={() => close()}>
                  {current ? "View build" : "Edit"}
                </Link>
              </>
            )}
          </MenuButton>
        </span>
      </div>
    </div>
  );
}
