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

export function ReaderProvider({ stops, back, runId, children }: { stops: ReaderStop[]; back: ReaderBack; runId: string | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const at = stopAt(stops, pathname);
  // Whether this browser entry is one the page pushed: then Back is the browser's back.
  const pushed = useRef(false);
  const open = useCallback(
    (href: string) => {
      if (stopAt(stops, href) < 0) return false;
      if (stopAt(stops, window.location.pathname) >= 0) window.history.replaceState(null, "", href);
      else {
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
  useEffect(() => {
    if (at < 0) pushed.current = false;
  }, [at]);
  const value = useMemo(() => ({ open, reading: at >= 0 }), [open, at]);
  return (
    <ReaderContext.Provider value={value}>
      {children}
      {at >= 0 && <Reader stops={stops} at={at} back={back} runId={runId} onClose={close} onGo={(i) => window.history.replaceState(null, "", stops[i].href)} />}
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

function Reader({ stops, at, back, runId, onClose, onGo }: { stops: ReaderStop[]; at: number; back: ReaderBack; runId: string | null; onClose: () => void; onGo: (i: number) => void }) {
  const router = useRouter();
  const stop = stops[at];
  const prev = at > 0 ? stops[at - 1] : null;
  const next = at < stops.length - 1 ? stops[at + 1] : null;
  const root = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  // The page under it stays where it was: nothing behind scrolls while the reader is open.
  useEffect(() => {
    const html = document.documentElement;
    const was = html.style.overflow;
    html.style.overflow = "hidden";
    const focus = document.activeElement as HTMLElement | null;
    root.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = was;
      focus?.focus({ preventScroll: true });
    };
  }, []);
  // A new stop starts at its top; the scroll brings the bar back.
  useEffect(() => {
    root.current?.scrollTo({ top: 0 });
  }, [at]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The image viewer's Esc is its own.
      if (e.key !== "Escape" || document.querySelector('[aria-label="Image viewer"]')) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toRow = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace(href);
  };
  const go = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    onGo(i);
  };
  const backLink = (label: string, className?: string) => (
    <a
      href={back.href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {label}
    </a>
  );

  return (
    <div
      ref={root}
      className={s.reader}
      role="dialog"
      aria-modal="true"
      aria-label={stop.title}
      tabIndex={-1}
      onScroll={(e) => {
        const y = e.currentTarget.scrollTop;
        setHidden(y > 160 && y > last.current);
        last.current = y;
      }}
    >
      <div className={`${s.bar} ${hidden ? s.barHidden : ""}`}>
        {backLink(`‹ ${back.label}`, s.barBack)}
        <span className={s.barPlace}>{stop.place}</span>
        <span className={s.barSide}>
          {stop.edit && (
            <Link href={stop.edit} className={s.barEdit}>
              Edit
            </Link>
          )}
          {prev && (
            <a href={prev.href} className={s.barStep} onClick={go(at - 1)}>
              ‹ {prev.title}
            </a>
          )}
          {next && (
            <a href={next.href} className={s.barStep} onClick={go(at + 1)}>
              {next.title} ›
            </a>
          )}
        </span>
      </div>

      <header className={`${s.plate} ${stop.plate ? "" : s.plateNone}`}>
        {stop.plate && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stop.plate} alt="" className={s.plateImage} />
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
          {stop.waiting && runId && stop.chapterId !== null ? (
            <Waiting stop={stop} runId={runId} isOwner={!!stop.edit} />
          ) : (
            <Text stop={stop} />
          )}
          {stop.game && (
            <span className={s.game}>
              In the game:{" "}
              <a href={stop.game.href} onClick={toRow(stop.game.href)}>
                {stop.game.text}
              </a>
            </span>
          )}
        </article>
        <nav className={s.foot} aria-label="The story">
          {prev ? (
            <a href={prev.href} onClick={go(at - 1)} className={s.footStep}>
              ‹ {prev.title}
            </a>
          ) : (
            <span />
          )}
          {backLink(back.label, s.footBack)}
          {next ? (
            <a href={next.href} onClick={go(at + 1)} className={`${s.footStep} ${s.footNext}`}>
              {next.title} ›
            </a>
          ) : (
            <span />
          )}
        </nav>
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
