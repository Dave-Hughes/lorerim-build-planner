"use client";

import { cloneElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { pageZoom } from "@/lib/zoom";
import styles from "./tooltip.module.css";

type TriggerProps = {
  "aria-describedby"?: string;
  onPointerEnter?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: React.PointerEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
};

const noop = () => () => {};
const GAP = 8;

/**
 * A tooltip for one trigger element: shown at once on hover and keyboard focus, hidden on leave,
 * blur and Esc. Above the trigger, below when there's no room. On touch, a tap shows it until the
 * next tap elsewhere. Linked to the trigger by aria-describedby.
 */
export function Tooltip({ content, children }: { content: React.ReactNode; children: ReactElement<TriggerProps> }) {
  const id = useId();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const tip = useRef<HTMLDivElement>(null);
  // Opened by keyboard focus: then leaving with the pointer doesn't close it (blur does).
  const [byFocus, setByFocus] = useState(false);
  const open = !!anchor;

  const place = useCallback(() => {
    const el = tip.current;
    if (!el || !anchor) return;
    const a = anchor.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    const above = a.top - GAP - t.height;
    const top = above >= GAP ? above : a.bottom + GAP;
    const left = Math.min(Math.max(GAP, a.left + a.width / 2 - t.width / 2), window.innerWidth - t.width - GAP);
    // Measured in screen pixels; set in the page's, which a big monitor scales up (WO-35).
    const z = pageZoom();
    el.style.top = `${Math.round(top / z)}px`;
    el.style.left = `${Math.round(left / z)}px`;
    el.dataset.side = above >= GAP ? "top" : "bottom";
  }, [anchor]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place, content]);

  useEffect(() => {
    if (!anchor) return;
    const close = () => {
      setByFocus(false);
      setAnchor(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    // A tap anywhere but the trigger closes a tooltip opened by touch.
    const onDown = (e: PointerEvent) => !anchor.contains(e.target as Node) && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchor, place]);

  const p = children.props;
  const trigger = cloneElement(children, {
    "aria-describedby": [p["aria-describedby"], id].filter(Boolean).join(" "),
    onPointerEnter: (e) => {
      p.onPointerEnter?.(e);
      if (e.pointerType !== "touch") setAnchor(e.currentTarget);
    },
    onPointerLeave: (e) => {
      p.onPointerLeave?.(e);
      if (e.pointerType !== "touch" && !byFocus) setAnchor(null);
    },
    onPointerDown: (e) => {
      p.onPointerDown?.(e);
      if (e.pointerType === "touch") setAnchor(e.currentTarget);
    },
    onFocus: (e) => {
      p.onFocus?.(e);
      // Keyboard focus only (on the trigger or a control inside it): a mouse click focuses too,
      // and hover already shows it.
      if ((e.target as HTMLElement).matches(":focus-visible")) {
        setByFocus(true);
        setAnchor(e.currentTarget);
      }
    },
    onBlur: (e) => {
      p.onBlur?.(e);
      // Focus moving to another control inside the same trigger keeps it open.
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setByFocus(false);
        setAnchor(null);
      }
    },
  });

  return (
    <>
      {trigger}
      {mounted &&
        createPortal(
          <div ref={tip} id={id} role="tooltip" className={styles.tip} hidden={!open}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
