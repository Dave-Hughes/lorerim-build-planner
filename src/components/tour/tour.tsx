"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { TOUR_EVENT, offerAnswered, offerDue, tourDone, tourDue, tourLater, tourSkipsWelcome, type TourKind, type TourScript, type TourStop } from "@/lib/tour";
import { pageZoom } from "@/lib/zoom";
import styles from "./tour.module.css";

const noop = () => () => {};
const TAPPS = 90; // the pointing pose, 30px at 3x
const CARD = 360;
const PHONE = 600;
// Where his fingertip is in the pointing pose: the first pixel of the arm, 19 rows down.
const TIP_Y = 19.5 * 3;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Layout {
  hole: Box;
  tapps: { x: number; y: number; flip: boolean };
  card: { x: number; y: number; tail: "top" | "bottom"; tailX: number };
  phone: boolean;
  vw: number;
  vh: number;
}

/** A stop lit only after a scroll (the pinned bar): whether the page is long enough to scroll its lead to the top. */
function reachable(s: TourStop): boolean {
  if (!s.scrollTo) return true;
  const lead = document.querySelector<HTMLElement>(`[data-tour="${s.scrollTo}"]`);
  if (!lead) return false;
  const top = lead.getBoundingClientRect().top + window.scrollY;
  return document.documentElement.scrollHeight - top >= window.innerHeight - 1;
}

/**
 * A first-time tour (WO-61): the welcome, then stop by stop. The page dims except the part being
 * shown, which is outlined in ember and scrolled into view; Tapps stands beside it with his finger
 * on its outline and his card next to him, never over the lit part. On a phone he and the card dock
 * at the bottom and a small ember arrow on the outline points at it. Esc skips; clicks on the dimmed
 * page do nothing; focus goes into the card and back where it was at the end.
 */
export function Tour({ kind, script, firstStop }: { kind: TourKind; script: TourScript; firstStop?: ReactNode }) {
  const due = useSyncExternalStore(noop, () => tourDue(kind), () => false);
  // Straight to the first stop when the visitor already answered on Browse (WO-80).
  const skipWelcome = useSyncExternalStore(noop, () => kind === "reader" && tourSkipsWelcome(), () => false);
  // A stop the page doesn't have (no gear, no spells) is skipped, and the count follows. So is the
  // pinned bar on a page too short to scroll it into being.
  const present = useSyncExternalStore(
    noop,
    () => script.stops.filter((s) => (!s.optional || document.querySelector(`[data-tour="${s.target}"]`)) && reachable(s)).map((s) => s.target).join(","),
    () => script.stops.filter((s) => !s.optional).map((s) => s.target).join(","),
  );
  const stops = script.stops.filter((s) => present.split(",").includes(s.target));
  const [step, setStep] = useState<number | null>(null);
  const at = step ?? (due ? (skipWelcome ? 1 : 0) : -1);
  const total = stops.length;
  const backRef = useRef<HTMLElement | null>(null);

  // Show me around: from the first stop.
  useEffect(() => {
    const restart = () => {
      backRef.current = document.activeElement as HTMLElement | null;
      setStep(1);
    };
    window.addEventListener(TOUR_EVENT, restart);
    return () => window.removeEventListener(TOUR_EVENT, restart);
  }, []);

  const end = (how: "done" | "later") => {
    if (how === "done") tourDone(kind);
    else tourLater(kind);
    setStep(-1);
    const el = backRef.current;
    backRef.current = null;
    requestAnimationFrame(() => el?.focus?.({ preventScroll: true }));
  };

  if (at < 0 || at > total) return null;
  return createPortal(
    <TourLayer key={at} at={at} script={script} stops={stops} firstStop={firstStop} onNext={() => (at === total ? end("done") : setStep(at + 1))} onBack={() => setStep(Math.max(1, at - 1))} onEnd={end} backRef={backRef} />,
    document.body,
  );
}

function TourLayer({
  at,
  script,
  stops,
  firstStop,
  onNext,
  onBack,
  onEnd,
  backRef,
}: {
  at: number;
  script: TourScript;
  stops: TourStop[];
  firstStop?: ReactNode;
  onNext: () => void;
  onBack: () => void;
  onEnd: (how: "done" | "later") => void;
  backRef: React.RefObject<HTMLElement | null>;
}) {
  const total = stops.length;
  const stop = at > 0 ? stops[at - 1] : null;
  const card = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  // The lit part: the page scrolls to it smoothly (at once with reduced motion), the light moves
  // once the scroll ends, then it's measured every frame so the tour follows the page (WO-80).
  const targetName = stop?.target;
  const leadName = stop?.scrollTo ?? stop?.target;
  useLayoutEffect(() => {
    if (!targetName) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lead = document.querySelector<HTMLElement>(`[data-tour="${leadName}"]`);
    const behavior = (still ? "instant" : "smooth") as ScrollBehavior;
    // A part lit only after a scroll (the pinned bar): its lead to the very top, past any scroll margin.
    if (lead && leadName !== targetName) window.scrollTo({ top: lead.getBoundingClientRect().top + window.scrollY, behavior });
    else lead?.scrollIntoView({ block: "center", behavior });
    let frame = 0;
    let last = "";
    // Settled once the page hasn't moved for six frames (or after 1.5 s at most).
    let settled = still;
    let quiet = 0;
    let y = window.scrollY;
    const t0 = performance.now();
    const place = () => {
      frame = requestAnimationFrame(place);
      if (!settled) {
        if (Math.abs(window.scrollY - y) < 0.5) quiet++;
        else {
          quiet = 0;
          y = window.scrollY;
        }
        if (quiet < 6 && performance.now() - t0 < 1500) return;
        settled = true;
      }
      const el = document.querySelector<HTMLElement>(`[data-tour="${targetName}"]`);
      if (!el || !card.current) return;
      const z = pageZoom();
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth / z;
      const vh = window.innerHeight / z;
      const pad = 6;
      const hole = { x: r.left / z - pad, y: r.top / z - pad, w: r.width / z + 2 * pad, h: r.height / z + 2 * pad };
      const phone = vw < PHONE;
      const ch = card.current.offsetHeight;
      const tipY = Math.max(hole.y + 12, Math.min(hole.y + hole.h - 12, hole.y + Math.min(hole.h / 2, 80)));
      // He stands where there's room: the right margin first, else the left (mirrored), else just inside.
      let flip = false;
      let tx = hole.x + hole.w;
      if (tx + TAPPS > vw - 2) {
        if (hole.x - TAPPS >= 2) {
          flip = true;
          tx = hole.x - TAPPS;
        } else tx = vw - TAPPS - 4;
      }
      const ty = Math.max(4, Math.min(vh - TAPPS - 4, tipY - TIP_Y));
      // His card, beside him and clear of the lit part: below it, else above, else at his feet.
      const cx = Math.max(16, Math.min(flip ? tx : tx + TAPPS - CARD, vw - CARD - 16));
      let cy = hole.y + hole.h + 14;
      let tail: "top" | "bottom" = "top";
      if (cy + ch > vh - 12) {
        if (hole.y - 14 - ch >= 12) {
          cy = hole.y - 14 - ch;
          tail = "bottom";
        } else cy = Math.min(vh - ch - 12, ty + TAPPS + 8);
      }
      const tailX = Math.max(18, Math.min(CARD - 32, tx + TAPPS / 2 - cx));
      const next: Layout = { hole, tapps: { x: tx, y: ty, flip }, card: { x: cx, y: cy, tail, tailX }, phone, vw, vh };
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setLayout(next);
      }
    };
    place();
    return () => cancelAnimationFrame(frame);
  }, [targetName, leadName]);

  // Focus into the card once per stop; Esc skips.
  const endRef = useRef(onEnd);
  useLayoutEffect(() => {
    endRef.current = onEnd;
  });
  const placedNow = !stop || !!layout;
  useEffect(() => {
    if (placedNow) card.current?.querySelector<HTMLButtonElement>("[data-tour-next]")?.focus({ preventScroll: true });
  }, [placedNow]);
  useEffect(() => {
    if (!backRef.current) backRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      endRef.current("done");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backRef]);

  const title = stop ? stop.title : script.welcome.title;
  const text = stop ? stop.text : script.welcome.text;
  const placed = !stop || layout;
  return (
    <div className={styles.layer} onMouseDown={(e) => e.target === e.currentTarget && e.preventDefault()}>
      {/* The dim, with the lit part cut out by a big shadow round it. */}
      {stop && layout ? (
        <span className={styles.hole} style={{ left: layout.hole.x, top: layout.hole.y, width: layout.hole.w, height: layout.hole.h }} aria-hidden="true">
          {layout.phone && <i className={styles.arrow} />}
        </span>
      ) : (
        <span className={styles.dim} aria-hidden="true" />
      )}
      {stop && layout && !layout.phone && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/icons/tapps-point.svg"
          alt=""
          aria-hidden="true"
          width={TAPPS}
          height={TAPPS}
          className={`${styles.tapps} ${layout.tapps.flip ? styles.flip : ""}`}
          style={{ left: layout.tapps.x, top: layout.tapps.y }}
        />
      )}
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${styles.card} ${!stop ? styles.welcome : ""} ${layout?.phone ? styles.docked : ""}`}
        style={stop && layout && !layout.phone ? { left: layout.card.x, top: layout.card.y } : !placed ? { visibility: "hidden" } : undefined}
      >
        {stop && layout && !layout.phone && <span className={`${styles.tail} ${styles[`tail_${layout.card.tail}`]}`} style={{ left: layout.card.tailX }} aria-hidden="true" />}
        {(!stop || layout?.phone) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stop ? "/icons/tapps-point.svg" : "/icons/tapps.svg"} alt="Tapps" width={72} height={72} className={`${styles.portrait} ${stop ? styles.flip : ""}`} />
        )}
        <div className={styles.words}>
          <h2 className={styles.title}>{title}</h2>
          {/* The sample's Example tag (WO-90), on the stop the first visit opens at. */}
          {stop && at === 1 && firstStop}
          <p className={styles.text}>{text}</p>
          <div className={styles.foot}>
            {stop && (
              <span className={styles.count}>
                {at} of {total}
              </span>
            )}
            <span className={styles.actions}>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => onEnd(stop || script.welcome.no !== "Later" ? "done" : "later")}>
                {stop ? "Skip" : script.welcome.no}
              </button>
              {stop && at > 1 && (
                <button type="button" className="btn btn-sm" onClick={onBack}>
                  Back
                </button>
              )}
              <button type="button" className="btn btn-primary btn-sm" data-tour-next="" onClick={onNext}>
                {stop ? (at === total ? "Done" : "Next") : script.welcome.go}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The first visit's offer on Browse (WO-80): Tapps offers to walk through the sample build. Show me
 * opens it at level 1 with the reader's tour at its first stop; No thanks starts the tour on the
 * first build opened. Neither shows again once the tour is done.
 */
export function TourOffer({ href }: { href: string }) {
  const due = useSyncExternalStore(noop, offerDue, () => false);
  const [closed, setClosed] = useState(false);
  const router = useRouter();
  const show = useRef<HTMLButtonElement>(null);
  const open = due && !closed;
  const answer = (yes: boolean) => {
    offerAnswered(yes);
    setClosed(true);
    if (yes) router.push(`${href}?level=1&tour=1`);
  };
  const answerRef = useRef(answer);
  useLayoutEffect(() => {
    answerRef.current = answer;
  });
  useEffect(() => {
    if (!open) return;
    show.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      answerRef.current(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div className={styles.layer}>
      <span className={styles.dim} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="New here?" className={`${styles.card} ${styles.welcome}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/tapps.svg" alt="Tapps" width={72} height={72} className={styles.portrait} />
        <div className={styles.words}>
          <h2 className={styles.title}>New here?</h2>
          <p className={styles.text}>Walk through a sample build.</p>
          <div className={styles.foot}>
            <span className={styles.actions}>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => answer(false)}>
                No thanks
              </button>
              <button ref={show} type="button" className="btn btn-primary btn-sm" onClick={() => answer(true)}>
                Show me
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
