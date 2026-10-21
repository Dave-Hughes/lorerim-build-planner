"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { StoryText } from "@/components/build/story-view";
import { readEarly } from "@/lib/playthroughs/actions";
import { stopAt, type ReaderBack, type ReaderStop } from "@/lib/playthroughs/reader";
import s from "./reader.module.css";

/**
 * The reader (WO-116), as the CharacterReader board on canvas row 26: one reader for every story, over
 * the page, full screen. Each stop has its own address, so the browser's history is the reader's:
 * opened from the page it pushes the stop's address and is drawn over the page; Back, Esc and the
 * browser's back go back to the page at the same scroll position; previous and next replace the
 * address. Opened from a link, the page renders with the reader already open, and Back goes to the page.
 */

const ReaderContext = createContext<{ open: (href: string) => boolean; reading: boolean } | null>(null);

/** Whether the reader is open over the page: the page holds back what would pop up over it (Tapps). */
export const useReading = () => !!useContext(ReaderContext)?.reading;

/** How long the reader takes to slide up or down (WO-117), as reader.module.css has it. */
const SLIDE_MS = 420;

export function ReaderProvider({ stops, back, runId, title, children }: { stops: ReaderStop[]; back: ReaderBack; runId: string | null; title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const at = stopAt(stops, pathname);
  // Whether this browser entry is one the page pushed: then Back is the browser's back.
  const pushed = useRef(false);
  // Opened from the page, it slides up over it (WO-117); opened from a link, it simply loads.
  const [slideIn, setSlideIn] = useState(false);
  const open = useCallback(
    (href: string) => {
      if (stopAt(stops, href) < 0) return false;
      if (stopAt(stops, window.location.pathname) >= 0) window.history.replaceState(null, "", href);
      else {
        setSlideIn(true);
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
  // Closed by any way (Close, Esc, the browser's back), the last stop stays a moment to slide down.
  const [shown, setShown] = useState(at);
  if (at >= 0 && at !== shown) setShown(at);
  const leaving = at < 0 && shown >= 0;
  useEffect(() => {
    if (at >= 0) return;
    pushed.current = false;
    if (!leaving) return;
    const t = setTimeout(() => {
      setShown(-1);
      setSlideIn(false);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [at, leaving]);
  const value = useMemo(() => ({ open, reading: at >= 0 }), [open, at]);
  const showing = at >= 0 ? at : shown;
  return (
    <ReaderContext.Provider value={value}>
      {children}
      {showing >= 0 && showing < stops.length && (
        <Reader stops={stops} at={showing} back={back} runId={runId} title={title} slideIn={slideIn} leaving={leaving} onClose={close} onGo={(i) => window.history.replaceState(null, "", stops[i].href)} />
      )}
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

function Reader({ stops, at, back, runId, title, slideIn, leaving, onClose, onGo }: { stops: ReaderStop[]; at: number; back: ReaderBack; runId: string | null; title: string; slideIn: boolean; leaving: boolean; onClose: () => void; onGo: (i: number) => void }) {
  const router = useRouter();
  const stop = stops[at];
  const prev = at > 0 ? stops[at - 1] : null;
  const next = at < stops.length - 1 ? stops[at + 1] : null;
  const root = useRef<HTMLDivElement>(null);
  // Up from below on the way in (when opened from the page), down on the way out.
  const [arrived, setArrived] = useState(!slideIn);
  useEffect(() => {
    if (arrived) return;
    const f = requestAnimationFrame(() => requestAnimationFrame(() => setArrived(true)));
    return () => cancelAnimationFrame(f);
  }, [arrived]);
  const off = leaving || !arrived;

  // The page under it stays where it was: nothing behind scrolls while the reader is open.
  // Its scroll is put back on close: the browser's own restore can land while the page is still held.
  useEffect(() => {
    const html = document.documentElement;
    const was = html.style.overflow;
    const y = window.scrollY;
    html.style.overflow = "hidden";
    const focus = document.activeElement as HTMLElement | null;
    root.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = was;
      window.scrollTo({ top: y, behavior: "instant" });
      focus?.focus({ preventScroll: true });
    };
  }, []);
  // A new stop starts at its top.
  useEffect(() => {
    root.current?.scrollTo({ top: 0 });
  }, [at]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The image viewer's Esc is its own.
      if (e.key !== "Escape" || leaving || document.querySelector('[aria-label="Image viewer"]')) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, leaving]);

  const toRow = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace(href);
  };
  const go = (i: number) => () => onGo(i);

  return (
    <>
      <div className={`${s.dim} ${off ? s.dimOff : ""}`} aria-hidden="true" />
      <div ref={root} className={`${s.reader} ${off ? s.readerOff : ""}`} role="dialog" aria-modal="true" aria-label={stop.title} tabIndex={-1}>
        {/* The bar (WO-117): solid, with Close and its Esc key, the story's title, and Previous, Next and Edit as buttons. */}
        <div className={s.bar}>
          <span className={s.barLeft}>
            <button type="button" className={`btn btn-sm ${s.close}`} onClick={onClose}>
              × Close
            </button>
            <kbd className={s.key}>Esc</kbd>
          </span>
          <span className={s.barTitle}>{title}</span>
          <span className={s.barSide}>
            <button type="button" className="btn btn-sm" onClick={prev ? go(at - 1) : undefined} disabled={!prev} aria-label={prev ? `Previous: ${prev.title}` : "Previous"}>
              ‹ Previous
            </button>
            <button type="button" className="btn btn-sm" onClick={next ? go(at + 1) : undefined} disabled={!next} aria-label={next ? `Next: ${next.title}` : "Next"}>
              Next ›
            </button>
            {stop.edit && (
              <>
                <span className={s.barRule} aria-hidden="true" />
                <Link href={stop.edit} className="btn btn-sm">
                  Edit
                </Link>
              </>
            )}
          </span>
        </div>

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
    </>
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
      {stop.waiting}{" "}
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
