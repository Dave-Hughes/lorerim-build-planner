"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { setBuildVisibility } from "@/lib/builds/actions";
import type { BuildVisibility } from "@/lib/builds/validate";
import { AiAssisted } from "@/components/ui/ai-assisted";
import { InfoTip } from "@/components/ui/info-tip";
import { GameIcon } from "@/components/ui/skill-icon";
import type { EditFrameData } from "@/lib/edit/frame";
import { saveDetails } from "@/lib/playthroughs/actions";
import styles from "./edit-bar.module.css";
import f from "./edit-frame.module.css";

export type EditPage = "setup" | "levels" | "play" | "guide" | "story";

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
 * The owner's controls on the build's own page (WO-116a): who can see it, Copy link, and Edit, which
 * opens Set up at Details (WO-117). Phones: who can see it, and a ⋯ menu with the rest.
 */
export function OwnerControls({ buildId, visibility, onVisibility }: { buildId: string; current?: null; visibility: BuildVisibility; onVisibility?: (v: BuildVisibility) => void }) {
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
  const edit = `/b/${buildId}/setup?step=name`;
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

/** The edit frame's data (WO-117), from the route's server component: the hero and the tabs. */
export function EditFrameProvider({ data, children }: { data: EditFrameData; children: React.ReactNode }) {
  return <FrameContext.Provider value={data}>{children}</FrameContext.Provider>;
}

type Tab = { key: EditPage; label: string; sub: string; href: string; icon: string };

function tabsOf(f: EditFrameData | null, buildId: string): Tab[] {
  const b = f?.build;
  const r = f?.run;
  const out: Tab[] = [];
  if (b || !f) {
    const id = b?.id ?? buildId;
    out.push({ key: "setup", label: "Set up", sub: b?.setup ?? "", href: `/b/${id}/setup?step=name`, icon: "tab-set-up" });
    out.push({ key: "levels", label: "Levels", sub: b ? `Levels 1 to ${b.levels}` : "", href: `/b/${id}/edit`, icon: "tab-levels" });
  }
  if (r) out.push({ key: "play", label: "Play", sub: `${r.acts} act${r.acts === 1 ? "" : "s"}, ${r.objectives} objective${r.objectives === 1 ? "" : "s"}`, href: `/p/${r.id}/edit/play`, icon: "tab-play" });
  if (b || !f) out.push({ key: "guide", label: "Guide", sub: b?.guideMinutes ? `${b.guideMinutes} min read` : "Not written yet", href: `/b/${b?.id ?? buildId}/guide`, icon: "tab-guide" });
  if (r)
    out.push({ key: "story", label: "Story", sub: `${r.chapters} chapter${r.chapters === 1 ? "" : "s"}, ${r.pieces} ${r.pieces === 1 ? "entry or beat" : "entries and beats"}`, href: `/p/${r.id}/edit/story`, icon: "tab-story" });
  else if (f?.storyOn && b) out.push({ key: "story", label: "Story", sub: b.hasStory ? "Written" : "Not written yet", href: `/b/${b.id}/edit/story`, icon: "tab-story" });
  return out;
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
 * The top of every edit page (WO-117): the edit band ("Editing" and the name; the save line, who can
 * see it, Copy link, and Done, the one ember button), the page's own hero at 300px with Change the
 * cover, and one tab row: a build alone Set up, Levels, Guide (and Story); a character Set up, Levels,
 * Play, Guide, Story. A run's tabs (Play, Story) set the run's visibility; the build's, the build's.
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
  const onRun = !!run && (current === "play" || current === "story" || !frame?.build);
  const done = run ? `/p/${run.id}` : `/b/${buildId}?tab=levels`;
  const cover = frame?.build?.coverImageUrl;
  const focus = frame?.build?.coverFocus;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${run ? `/p/${run.id}` : `/b/${buildId}`}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The address is the page's; nothing else to do.
    }
  };
  return (
    <>
      <div className={f.band} role="region" aria-label="Edit bar" data-edit-bar="">
        <div className={`page ${f.bandIn}`}>
          <span className={f.editing}>
            <span className={f.editingWord}>Editing</span>
            <span className={f.editingName} title={frame?.name || name}>
              {frame?.name || name}
            </span>
          </span>
          <span className={f.bandRight}>
            {todo && <span className={styles.todo}>{todo}</span>}
            <SaveLine save={save} />
            <VisibilityMenu
              key={onRun ? `r${run!.visibility}` : `b${visibility}`}
              initial={onRun ? run!.visibility : visibility}
              choose={(v) => (onRun ? saveDetails(run!.id, { visibility: v }) : setBuildVisibility(buildId, v))}
              onChange={onRun ? undefined : onVisibility}
            />
            <button type="button" className="btn btn-sm" onClick={copy}>
              {copied ? "Copied" : "Copy link"}
            </button>
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
      {frame && (
        <div className={f.hero}>
          {cover && <div className={f.heroImage} style={{ backgroundImage: `url("${cover}")`, backgroundPosition: focus ? `${focus.x}% ${focus.y}%` : undefined }} aria-hidden="true" />}
          <span className={f.heroFade} aria-hidden="true" />
          <div className={`page ${f.heroIn}`}>
            <p className={f.heroName}>{frame.name}</p>
            <span className={f.heroBy}>
              <span>Made by {frame.author}</span>
              {frame.traits && <span className="muted">{frame.traits}</span>}
              {frame.aiAssisted && <AiAssisted author={frame.author} />}
            </span>
            {frame.build && (
              <Link href={`/b/${frame.build.id}/setup?step=name#cover`} className={`btn btn-sm ${f.heroCover}`}>
                {cover ? "Change the cover" : "Add a cover"}
              </Link>
            )}
          </div>
        </div>
      )}
      <div className={`page ${f.tabsWrap}`}>
        <nav className={f.tabs} aria-label="Edit tabs">
          {tabs.map((t) => (
            <Link key={t.key} href={t.href} className={f.tab} aria-current={t.key === current ? "page" : undefined}>
              <GameIcon file={t.icon} size={32} className={f.tabIcon} />
              <span className={f.tabText}>
                <span className={f.tabName}>{t.label}</span>
                {t.sub && <span className={f.tabSub}>{t.sub}</span>}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
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
