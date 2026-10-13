"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { TOUR_EVENT, tourDone, tourDue, tourLater, type TourKind, type TourScript } from "@/lib/tour";
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

/**
 * A first-time tour (WO-61): the welcome, then stop by stop. The page dims except the part being
 * shown, which is outlined in ember and scrolled into view; Tapps stands beside it with his finger
 * on its outline and his card next to him, never over the lit part. On a phone he and the card dock
 * at the bottom and a small ember arrow on the outline points at it. Esc skips; clicks on the dimmed
 * page do nothing; focus goes into the card and back where it was at the end.
 */
export function Tour({ kind, script }: { kind: TourKind; script: TourScript }) {
  const due = useSyncExternalStore(noop, () => tourDue(kind), () => false);
  const [step, setStep] = useState<number | null>(null);
  const at = step ?? (due ? 0 : -1);
  const total = script.stops.length;
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
  return createPortal(<TourLayer key={at} at={at} script={script} onNext={() => (at === total ? end("done") : setStep(at + 1))} onEnd={end} backRef={backRef} />, document.body);
}

function TourLayer({
  at,
  script,
  onNext,
  onEnd,
  backRef,
}: {
  at: number;
  script: TourScript;
  onNext: () => void;
  onEnd: (how: "done" | "later") => void;
  backRef: React.RefObject<HTMLElement | null>;
}) {
  const total = script.stops.length;
  const stop = at > 0 ? script.stops[at - 1] : null;
  const card = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);

  // The lit part: scrolled into view, then measured every frame so the tour follows the page.
  const targetName = stop?.target;
  useLayoutEffect(() => {
    if (!targetName) return;
    const target = document.querySelector<HTMLElement>(`[data-tour="${targetName}"]`);
    target?.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
    let frame = 0;
    let last = "";
    const place = () => {
      frame = requestAnimationFrame(place);
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
  }, [targetName]);

  // Focus into the card once per stop; Esc skips.
  const endRef = useRef(onEnd);
  useLayoutEffect(() => {
    endRef.current = onEnd;
  });
  useEffect(() => {
    if (!backRef.current) backRef.current = document.activeElement as HTMLElement | null;
    card.current?.querySelector<HTMLButtonElement>("[data-tour-next]")?.focus({ preventScroll: true });
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
