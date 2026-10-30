"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { pageZoom } from "@/lib/zoom";
import { useDismiss } from "@/lib/use-dismiss";
import { setBuildVisibility } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import { InfoTip } from "@/components/ui/info-tip";
import type { EditFrameData } from "@/lib/edit/frame";
import { saveDetails } from "@/lib/playthroughs/actions";
import { editPlayHref } from "@/lib/playthroughs/hrefs";
import styles from "./edit-bar.module.css";
import f from "./edit-frame.module.css";

export type EditPage = "setup" | "levels" | "play" | "guide" | "story";

const VIS_ORDER: BuildVisibility[] = ["public", "unlisted", "private"];

export const VISIBILITY: Record<BuildVisibility, { label: string; text: string }> = {
  public: { label: "Listed", text: "Listed on Characters" },
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
 * to the button, a click outside or Tab away closes it. `children` gets `close` for its items. The
 * menu opens in a layer over the page (WO-118), under the button's right edge, above it when there's
 * no room below, and kept on screen, so a hero that clips its children never cuts it off.
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
  const menu = useRef<HTMLDivElement>(null);
  useDismiss({ open, onClose: () => setOpen(false), inside: [wrap, menu], trigger });
  const items = () => [...(menu.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? [])];
  const place = useCallback(() => {
    const el = menu.current;
    const b = trigger.current;
    if (!el || !b) return;
    const a = b.getBoundingClientRect();
    const m = el.getBoundingClientRect();
    const below = a.bottom + 6;
    const top = below + m.height <= window.innerHeight - 8 || a.top - 6 - m.height < 8 ? below : a.top - 6 - m.height;
    const left = Math.min(Math.max(8, a.right - m.width), window.innerWidth - m.width - 8);
    // Measured in screen pixels; set in the page's (WO-35).
    const z = pageZoom();
    el.style.top = `${Math.round(top / z)}px`;
    el.style.left = `${Math.round(left / z)}px`;
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);
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
      {open &&
        createPortal(
          <div
            ref={menu}
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
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * The owner's controls on the build's own page (WO-116a): who can see it, Copy link, and Edit, which
 * opens Set up at Details (WO-117). Phones: who can see it, and a ⋯ menu with the rest.
 */
export function OwnerControls({ buildId, visibility, onVisibility, tab }: { buildId: string; current?: null; visibility: BuildVisibility; onVisibility?: (v: BuildVisibility) => void; tab?: "play" | "levels" | "guide" }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/b/${buildId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy. The link is the build page's address.");
    }
  };
  // Edit opens on the tab you were on (WO-179): the playthrough's editor, the build's, the guide's; with no tab, Set up.
  const edit = tab === "play" ? `/b/${buildId}/edit/play` : tab === "levels" ? `/b/${buildId}/edit` : tab === "guide" ? `/b/${buildId}/guide` : `/b/${buildId}/setup?step=name`;
  return (
    <span className={styles.right}>
      {error && (
        <span className={styles.status} role="status">
          <span className="bad">{error}</span>
        </span>
      )}
      <VisibilityMenu initial={visibility} choose={(v) => setBuildVisibility(buildId, v)} onChange={onVisibility} />
      <button type="button" className={`btn btn-sm ${styles.wide}`} onClick={copy}>
        {copied ? "Copied" : "Copy link"}
      </button>
      <Link href={edit} className={`btn btn-sm btn-primary ${styles.wide}`}>
        Edit
      </Link>
      <MenuButton className={styles.narrow} buttonClassName={`btn btn-sm btn-icon ${styles.moreButton}`} buttonLabel="More" menuLabel="More" button="⋯">
        {(close) => (
          <>
            <button type="button" role="menuitem" tabIndex={-1} className={styles.menuItem} onClick={copy}>
              {copied ? "Copied" : "Copy link"}
            </button>
            <Link href={edit} role="menuitem" tabIndex={-1} className={styles.menuItem} onClick={() => close()}>
              Edit
            </Link>
          </>
        )}
      </MenuButton>
    </span>
  );
}

/** How the edit page's saving stands (WO-117): the band says it, and Done asks before leaving a failed one. */
export interface SaveState {
  state: "idle" | "saving" | "saved" | "failed";
  error?: string | null;
  retry?: () => void;
}

const FrameContext = createContext<EditFrameData | null>(null);

/** The edit frame's data, from the route's server component (WO-117): the hero, the tabs, the Story's images. */
export const useEditFrame = () => useContext(FrameContext);

/** The edit frame's data (WO-117), from the route's server component: the hero and the tabs. */
export function EditFrameProvider({ data, children }: { data: EditFrameData; children: React.ReactNode }) {
  return <FrameContext.Provider value={data}>{children}</FrameContext.Provider>;
}

type Tab = { key: EditPage; label: string; href: string };

/** The edit tabs, named for what's in them (WO-124): Character, Build, Guide, Story, Playthrough. The addresses stay. */
function tabsOf(f: EditFrameData | null, buildId: string): Tab[] {
  const b = f?.build;
  const r = f?.run;
  const out: Tab[] = [];
  const id = b?.id ?? buildId;
  // The same tabs, in the same order, as the character's page (WO-179): Playthrough, Build, Guide. Character (Set up) follows.
  // The page's own address, never one that redirects (WO-124 Part 4): a redirect during a tab change made Next load the whole document again.
  if (r) out.push({ key: "play", label: "Playthrough", href: editPlayHref(r) });
  else if (f?.playOn && b) out.push({ key: "play", label: "Playthrough", href: `/b/${b.id}/edit/play` });
  if (b || !f) {
    out.push({ key: "levels", label: "Build", href: `/b/${id}/edit` });
    out.push({ key: "guide", label: "Guide", href: `/b/${id}/guide` });
    out.push({ key: "setup", label: "Character", href: `/b/${id}/setup?step=name` });
  }
  return out;
}

/** One line under the bar saying what the tab is for (WO-124), "she" for a character as the page says it, "the build" for a build alone. */
export function helpLine(tab: EditPage, character: boolean): string {
  const lines: Record<EditPage, [string, string]> = {
    setup: [
      "Who she is at level 1: race, birthsign, traits and starting skills, and the page's name, cover and tags.",
      "Who the build is at level 1: race, birthsign, traits and starting skills, and the page's name, cover and tags.",
    ],
    levels: [
      "Each level: where the skill points go and which perks she takes. The planner checks every level against the game's rules.",
      "Each level: where the skill points go and which perks the build takes. The planner checks every level against the game's rules.",
    ],
    guide: ["How to play her, in your words. Readers find it under Guide.", "How to play the build, in your words. Readers find it under Guide."],
    story: ["Her story in chapters. A chapter tied to an objective stays locked until that objective is done.", "The build's story, in your words. Readers find it under Story."],
    play: ["Who she is and how she plays, then her run through the game: acts, and the objectives in each.", "The build's run through the game: acts, and the objectives in each."],
  };
  return lines[tab][character ? 0 : 1];
}

/** "Saving…", "✓ Saved" with its "i", or what failed, in health red. */
function SaveLine({ save }: { save: SaveState }) {
  if (save.state === "saving")
    return (
      <span className={f.save} role="status">
        Saving…
      </span>
    );
  if (save.state === "failed")
    return (
      <span className={`${f.save} ${f.saveBad}`} role="alert">
        {save.error || "That didn't save."}
        {save.retry && (
          <button type="button" className={f.linkButton} onClick={save.retry}>
            Try again
          </button>
        )}
      </span>
    );
  return (
    <span className={f.save} role="status">
      <span className={f.saveOk}>✓ Saved</span>
      <InfoTip label="About saving" text="Every change saves as you make it. Done takes you back to the page as others see it." />
    </span>
  );
}

/**
 * The top of every edit page, one slim bar (WO-124, the EditCompact board): the cover as a 48 px thumbnail (to the cover
 * in Character's Details), Editing and the name, the tabs as text, then the save line, who can see it and Done, the one
 * ember button; under it one line saying what the tab is for. Pinned under the site header as you scroll. On a phone the
 * tabs fold into the tab you're on, as a menu. A character has one visibility, set from any tab (WO-179 Part 2).
 */
export function EditBar({
  buildId,
  name,
  current,
  visibility,
  onVisibility,
  todo,
  save = { state: "idle" },
}: {
  buildId: string;
  name: string;
  /** The edit tab you're on. */
  current: EditPage;
  visibility: BuildVisibility;
  /** Told when the visibility changes here (Set up keeps its own copy). */
  onVisibility?: (v: BuildVisibility) => void;
  /** The author's to-do across the build (WO-76: spells to choose), before the save line. */
  todo?: React.ReactNode;
  save?: SaveState;
}) {
  const frame = useContext(FrameContext);
  const tabs = tabsOf(frame, buildId);
  const run = frame?.run;
  // One visibility (WO-179 Part 2): the character's, whichever tab; a run with no character yet has its own.
  const runOnly = !!run && !frame?.build;
  const done = run ? (frame?.build ? `/b/${frame.build.id}?tab=playthrough` : `/p/${run.id}`) : `/b/${buildId}?tab=levels`;
  const cover = frame?.build?.coverImageUrl;
  const focus = frame?.build?.coverFocus;
  const here = tabs.find((t) => t.key === current);
  return (
    <>
      <div className={f.bar} role="region" aria-label="Edit bar" data-edit-bar="">
        <div className={`page ${f.barIn}`}>
          <span className={f.who}>
            {frame?.build && (
              <Link href={`/b/${frame.build.id}/setup?step=name#cover`} className={f.thumb} aria-label={cover ? "Change the cover" : "Add a cover"} title={cover ? "Change the cover" : "Add a cover"}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" style={focus ? { objectPosition: `${focus.x}% ${focus.y}%` } : undefined} />
                ) : (
                  <span className={f.thumbNone} aria-hidden="true">
                    {/* No cover yet: the race's icon, or the planner's own mark when none is chosen (WO-179 Part 2). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={frame.build.race ? `/icons/race-${frame.build.race.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.svg` : "/icons/logo-0.svg"} alt="" />
                  </span>
                )}
              </Link>
            )}
            <span className={f.editing}>
              <span className={f.editingWord}>Editing</span>
              <span className={f.editingName} title={frame?.name || name}>
                {frame?.name || name}
              </span>
            </span>
          </span>
          <nav className={f.tabs} aria-label="Edit tabs">
            {tabs.map((t) => (
              <Link key={t.key} href={t.href} className={f.tab} aria-current={t.key === current ? "page" : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>
          {here && <TabMenu tabs={tabs} here={here} />}
          <span className={f.barRight}>
            {todo && <span className={styles.todo}>{todo}</span>}
            <SaveLine save={save} />
            <span className={f.wideOnly}>
              <VisibilityMenu
                key={runOnly ? `r${run!.visibility}` : `b${visibility}`}
                initial={runOnly ? run!.visibility : visibility}
                choose={(v) => (runOnly ? saveDetails(run!.id, { visibility: v }) : setBuildVisibility(buildId, v))}
                onChange={runOnly ? undefined : onVisibility}
              />
            </span>
            <Link
              href={done}
              className="btn btn-sm btn-primary"
              onClick={(e) => {
                if (save.state === "failed" && !window.confirm("A change didn't save. Leave anyway?")) e.preventDefault();
              }}
            >
              Done
            </Link>
          </span>
        </div>
      </div>
      <p className={`page ${f.help}`}>{helpLine(current, !!run)}</p>
    </>
  );
}

/** On a phone, the tab you're on as a menu of the others (WO-124). */
function TabMenu({ tabs, here }: { tabs: Tab[]; here: Tab }) {
  return (
    <MenuButton className={f.tabMenu} buttonClassName={`btn btn-sm ${f.tabMenuButton}`} buttonLabel={`${here.label}: the edit tabs`} menuLabel="Edit tabs" startAt={tabs.indexOf(here)} button={<>{here.label} <span aria-hidden="true">▾</span></>}>
      {(close) =>
        tabs.map((t) => (
          <Link key={t.key} href={t.href} role="menuitem" tabIndex={-1} className={styles.menuItem} aria-current={t.key === here.key ? "page" : undefined} onClick={() => close()}>
            {t.label}
          </Link>
        ))
      }
    </MenuButton>
  );
}

/** Who can see it: the menu button, saving through `choose`. */
function VisibilityMenu({ initial, choose: send, onChange }: { initial: BuildVisibility; choose: (v: BuildVisibility) => Promise<{ ok: boolean; error?: string }>; onChange?: (v: BuildVisibility) => void }) {
  const [visibility, setVisibility] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const choose = async (v: BuildVisibility, close: (refocus?: boolean) => void) => {
    close(true);
    if (v === visibility) return;
    const before = visibility;
    setVisibility(v);
    setError(null);
    const r = await send(v);
    if (r.ok) onChange?.(v);
    else {
      setVisibility(before);
      setError(r.error ?? "That didn't save.");
    }
  };
  return (
    <>
      {error && (
        <span className={`${f.save} ${f.saveBad}`} role="alert">
          {error}
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
    </>
  );
}
