"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { StoryText } from "@/components/build/story-view";
import { noteRead, readEarly } from "@/lib/playthroughs/actions";
import { stopAt, type ReaderBack, type ReaderStop } from "@/lib/playthroughs/reader";
import s from "./reader.module.css";

/**
 * The reader (WO-116), as the CharacterReader board on canvas row 26: one reader for every story, over
 * the page, full screen. Each stop has its own address, so the browser's history is the reader's:
 * opened from the page it pushes the stop's address and is drawn over the page; Back, Esc and the
 * browser's back go back to the page at the same scroll position; previous and next replace the
 * address. Opened from a link, the page renders with the reader already open, and Back goes to the page.
 */

const ReaderContext = createContext<{ open: (href: string) => boolean; reading: boolean; stops: ReaderStop[]; last: string | null } | null>(null);

/** Where this browser last read a run (WO-118: Continue reading for anyone but the owner). */
const lastKey = (runId: string) => `lorerim-last-read:${runId}`;
function storedLast(runId: string | null): string | null {
  if (!runId) return null;
  try {
    return localStorage.getItem(lastKey(runId));
  } catch {
    return null;
  }
}

/** Whether the reader is open over the page: the page holds back what would pop up over it (Tapps). */
export const useReading = () => !!useContext(ReaderContext)?.reading;

export function ReaderProvider({ stops, back, runId, title, children }: { stops: ReaderStop[]; back: ReaderBack; runId: string | null; title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const at = stopAt(stops, pathname);
  // Whether this browser entry is one the page pushed: then Back is the browser's back.
  const pushed = useRef(false);
  // Where the page was when the reader opened over it, to come back to (WO-124: the page stays, hidden, under it).
  const pageY = useRef(0);
  const open = useCallback(
    (href: string) => {
      if (stopAt(stops, href) < 0) return false;
      if (stopAt(stops, window.location.pathname) >= 0) window.history.replaceState(null, "", href);
      else {
        pageY.current = window.scrollY;
        window.history.pushState(null, "", href);
        pushed.current = true;
      }
      return true;
    },
    [stops],
  );
  const close = useCallback(() => {
    if (pushed.current) window.history.back();
    else window.history.replaceState(null, "", back.href);
  }, [back.href]);
  // Closed by any way (the back link, the browser's back), the page comes back where it was.
  const wasReading = useRef(at >= 0);
  useEffect(() => {
    if (at >= 0) window.scrollTo({ top: 0, behavior: "instant" });
    else if (wasReading.current) window.scrollTo({ top: pageY.current, behavior: "instant" });
    if (at < 0) pushed.current = false;
    wasReading.current = at >= 0;
  }, [at]);
  // The chapter read last (WO-118): the owner's newest readAt, else this browser's; then each stop opened.
  const [last, setLast] = useState<string | null>(() => {
    const owned = stops.filter((x) => x.readAt !== null).sort((a, b) => b.readAt! - a.readAt!)[0];
    return owned?.key ?? null;
  });
  useEffect(() => {
    if (!stops.some((x) => x.edit)) {
      const kept = storedLast(runId);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount.
      if (kept && stops.some((x) => x.key === kept)) setLast(kept);
    }
  }, [runId, stops]);
  const reached = at >= 0 ? stops[at] : null;
  useEffect(() => {
    if (!reached || reached.waiting || reached.chapterId === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the stop the address opened is the one read.
    setLast(reached.key);
    if (runId) {
      try {
        localStorage.setItem(lastKey(runId), reached.key);
      } catch {
        // Private windows: Continue reading lasts for the visit.
      }
      if (reached.edit) void noteRead(runId, reached.chapterId);
    }
  }, [reached, runId]);
  const value = useMemo(() => ({ open, reading: at >= 0, stops, last }), [open, at, stops, last]);
  return (
    <ReaderContext.Provider value={value}>
      {/* The reader is a page in the site (WO-124, the ReaderInPage board): it takes the page's place under the site
          header, and the page waits hidden under it, as it was. */}
      <div hidden={at >= 0}>{children}</div>
      {at >= 0 && <Reader stops={stops} at={at} back={back} runId={runId} title={title} onClose={close} onGo={(i) => window.history.replaceState(null, "", stops[i].href)} />}
    </ReaderContext.Provider>
  );
}

/** A way into the reader: opens it over the page; a new tab or no reader on the page follows the link. */
export function ReaderLink({ href, className, children, onClick, ...rest }: { href: string; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const ctx = useContext(ReaderContext);
  return (
    <a
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (!ctx || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (ctx.open(href)) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

/**
 * Read the story (WO-118), one click away: at the right of the tab row and in the pinned bar, with
 * "Continue reading" and the chapter's name above it once the reader has opened one. It opens the
 * reader there, or at the beginning the first time. Nothing without a story.
 */
export function ReadTheStory({ className, compact = false }: { className?: string; compact?: boolean }) {
  const ctx = useContext(ReaderContext);
  if (!ctx?.stops.length) return null;
  const at = ctx.last ? ctx.stops.find((x) => x.key === ctx.last) : undefined;
  return (
    <span className={`${s.readStory} ${className ?? ""}`}>
      {at && !compact && (
        <span className={s.readStoryAt}>
          Continue reading<i>{at.title}</i>
        </span>
      )}
      <ReaderLink href={(at ?? ctx.stops[0]).href} className={`btn ${compact ? "btn-sm" : ""} ${s.readStoryButton}`} aria-label={at ? `Read the story: continue at ${at.title}` : "Read the story"}>
        Read the story
      </ReaderLink>
    </span>
  );
}

/**
 * Her story's card at the top of Play's rail (WO-124, the PlayRail board): the story's picture, "Her story", its title,
 * and "Continue: {the next open chapter not read yet} ›", or "Start reading ›" before any is read. Nothing without one.
 */
export function StoryCard({ picture, focus, title, label }: { picture: string | null; focus: { x: number; y: number } | null; title: string; label: string }) {
  const ctx = useContext(ReaderContext);
  if (!ctx?.stops.length) return null;
  const stops = ctx.stops;
  const lastAt = ctx.last ? stops.findIndex((x) => x.key === ctx.last) : -1;
  const read = (i: number) => stops[i].readAt !== null || i <= lastAt;
  const started = lastAt >= 0 || stops.some((x) => x.readAt !== null);
  const next = started ? (stops.find((x, i) => !x.waiting && !read(i)) ?? null) : null;
  const go = started ? next : stops[0];
  return (
    <ReaderLink href={(go ?? stops[lastAt] ?? stops[0]).href} className={s.storyCard} aria-label={`${label}: ${title}. ${go ? (started ? `Continue: ${go.title}` : "Start reading") : "Read it again"}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {picture && <img src={picture} alt="" className={s.storyCardImage} style={focus ? { objectPosition: `${focus.x}% ${focus.y}%` } : undefined} />}
      <span className={s.storyCardFade} aria-hidden="true" />
      <span className={s.storyCardWords}>
        <span className={s.storyCardLabel}>{label}</span>
        <span className={s.storyCardTitle}>{title}</span>
        <span className={s.storyCardGo}>
          {go ? (
            started ? (
              <>
                Continue: <i>{go.title}</i> ›
              </>
            ) : (
              "Start reading ›"
            )
          ) : (
            "Read it again ›"
          )}
        </span>
      </span>
    </ReaderLink>
  );
}

/** A stop's act or "Prologue", as the contents' heading: the kicker before any " | from …". */
const groupOf = (x: ReaderStop) => (x.kicker ?? "").split(" | ")[0] || null;

function Reader({ stops, at, back, runId, title, onClose, onGo }: { stops: ReaderStop[]; at: number; back: ReaderBack; runId: string | null; title: string; onClose: () => void; onGo: (i: number) => void }) {
  const router = useRouter();
  const stop = stops[at];
  const prev = at > 0 ? stops[at - 1] : null;
  const next = at < stops.length - 1 ? stops[at + 1] : null;
  // On a phone the contents fold into a button in the bar (WO-124).
  const [contents, setContents] = useState(false);
  const toRow = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace(href);
  };
  const go = (i: number) => () => {
    setContents(false);
    onGo(i);
  };
  // The contents in reading order, under each act's heading (the Prologue's first).
  const groups: { label: string | null; items: { x: ReaderStop; i: number }[] }[] = [];
  stops.forEach((x, i) => {
    const label = groupOf(x);
    if (!groups.length || groups[groups.length - 1].label !== label) groups.push({ label, items: [] });
    groups[groups.length - 1].items.push({ x, i });
  });

  return (
    <div className={s.reader} role="region" aria-label={`Reading: ${stop.title}`}>
      {/* The bar (WO-124): the way back to the page, the story's title, and Previous, Next and the owner's Edit. */}
      <div className={s.bar}>
        <span className={s.barLeft}>
          <a
            href={back.href}
            className={s.back}
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            ‹ {back.label}
          </a>
          <span className={s.barRule} aria-hidden="true" />
          <span className={s.barTitle}>{title}</span>
        </span>
        <span className={s.barSide}>
          {stops.length > 1 && (
            <button type="button" className={`btn btn-sm ${s.contentsButton}`} aria-expanded={contents} aria-controls="reader-contents" onClick={() => setContents(!contents)}>
              Contents
            </button>
          )}
          <button type="button" className="btn btn-sm" onClick={prev ? go(at - 1) : undefined} disabled={!prev} aria-label={prev ? `Previous: ${prev.title}` : "Previous"}>
            ‹ Previous
          </button>
          <button type="button" className="btn btn-sm" onClick={next ? go(at + 1) : undefined} disabled={!next} aria-label={next ? `Next: ${next.title}` : "Next"}>
            Next ›
          </button>
          {stop.edit && (
            <Link href={stop.edit} className="btn btn-sm">
              Edit
            </Link>
          )}
        </span>
      </div>

      <div className={s.layout}>
        {stops.length > 1 && (
          <nav id="reader-contents" className={`${s.contents} ${contents ? s.contentsOpen : ""}`} aria-label="Contents">
            <span className={s.contentsHead}>Contents</span>
            {groups.map((g, gi) => (
              <div key={gi} className={s.contentsGroup}>
                {g.label && <span className={s.contentsKicker}>{g.label}</span>}
                <ol>
                  {g.items.map(({ x, i }) => (
                    <li key={x.key}>
                      <button type="button" className={`${s.contentsItem} ${x.waiting ? s.contentsLocked : ""}`} aria-current={i === at ? "page" : undefined} onClick={go(i)}>
                        {x.title}
                        {x.waiting && <span className={s.lockedWord}> (locked)</span>}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </nav>
        )}

        <div className={s.page}>
          <header className={`${s.plate} ${stop.plate ? "" : s.plateNone}`}>
            {stop.plate && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stop.plate} alt="" className={s.plateImage} style={stop.plateFocus ? { objectPosition: `${stop.plateFocus.x}% ${stop.plateFocus.y}%` } : undefined} />
            )}
            <div className={s.plateFade} aria-hidden="true" />
            <div className={s.words}>
              {stop.kicker && <span className={s.kicker}>{stop.kicker}</span>}
              <h1 className={s.title}>{stop.title}</h1>
              {stop.line && <p className={s.line}>{stop.line}</p>}
            </div>
          </header>

          <div className={s.body}>
            <article key={stop.key} className={s.col}>
              {stop.waiting && runId && stop.chapterId !== null ? <Waiting stop={stop} runId={runId} isOwner={!!stop.edit} /> : <Text stop={stop} />}
              {stop.game && (
                <span className={s.game}>
                  In the game:{" "}
                  <a href={stop.game.href} onClick={toRow(stop.game.href)}>
                    {stop.game.text}
                  </a>
                </span>
              )}
            </article>
            {/* The foot (WO-117): previous and next as two cards, each with the chapter's name. */}
            <nav className={s.foot} aria-label="The story">
              {prev ? (
                <a
                  href={prev.href}
                  className={s.footCard}
                  onClick={(e) => {
                    e.preventDefault();
                    onGo(at - 1);
                  }}
                >
                  <small>‹ Previous</small>
                  <span>{prev.title}</span>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a
                  href={next.href}
                  className={`${s.footCard} ${s.footNext}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onGo(at + 1);
                  }}
                >
                  <small>Next ›</small>
                  <span>{next.title}</span>
                </a>
              ) : (
                <a
                  href={back.href}
                  className={`${s.footCard} ${s.footNext}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  <small>The end, for now</small>
                  <span>{back.label}</span>
                </a>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function Text({ stop }: { stop: ReaderStop }) {
  const text = <StoryText doc={stop.doc} idPrefix={`r${stop.key}`} cap={stop.cap} skipOpening={stop.plateFromText} />;
  return stop.entry ? <div className={s.entry}>{text}</div> : text;
}

/** A beat not open yet: what opens it, and Read it anyway. Reading it early ticks nothing; the owner's read is kept. */
function Waiting({ stop, runId, isOwner }: { stop: ReaderStop; runId: string; isOwner: boolean }) {
  const [shown, setShown] = useState(false);
  if (shown) return <Text stop={stop} />;
  return (
    <p className={s.wait}>
      {stop.waiting} <span className="muted">It may spoil what&apos;s ahead.</span>{" "}
      <button
        type="button"
        className={s.linkButton}
        onClick={() => {
          setShown(true);
          if (isOwner && stop.chapterId !== null) void readEarly(runId, stop.chapterId);
        }}
      >
        Read it anyway
      </button>
    </p>
  );
}
