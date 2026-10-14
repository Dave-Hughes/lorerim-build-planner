"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./guide.module.css";

export interface TipTerm {
  name: string;
  html: string;
  see?: string;
  nexus?: string;
}

const WIDTH = 320;

/**
 * The guide's term tooltips (WO-70). Terms are links to /guide/terms#id (that's all they are
 * without scripts); this opens one tooltip at a time: on hover after 150 ms, on keyboard focus, and
 * on tap. It holds the term's name, its definition and up to two links, and stays on screen. Esc,
 * tapping elsewhere or moving away closes it.
 */
export function TermTips({ terms }: { terms: Record<string, TipTerm> }) {
  const [open, setOpen] = useState<{ id: string; el: HTMLElement } | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const touch = useRef(false);

  useEffect(() => {
    const termOf = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>("a.guide-term[data-term]") : null);
    const inTip = (t: EventTarget | null) => t instanceof Node && !!tip.current?.contains(t);
    const later = (fn: () => void, ms: number) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(fn, ms);
    };
    // Opening cancels a close still waiting from the pointer leaving another term.
    const show = (el: HTMLElement) => {
      window.clearTimeout(timer.current);
      if (terms[el.dataset.term!]) setOpen({ id: el.dataset.term!, el });
    };
    const onDown = (e: PointerEvent) => {
      touch.current = e.pointerType !== "mouse";
      if (!termOf(e.target) && !inTip(e.target)) setOpen(null);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = termOf(e.target);
      if (el) later(() => show(el), 150);
      else if (inTip(e.target)) window.clearTimeout(timer.current);
    };
    const onOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (termOf(e.target) || inTip(e.target)) later(() => setOpen(null), 200);
    };
    const onClick = (e: MouseEvent) => {
      const el = termOf(e.target);
      // A tap opens the tooltip; a mouse click follows the link to the term's entry.
      if (el && touch.current) {
        e.preventDefault();
        show(el);
      }
    };
    const onFocus = (e: FocusEvent) => {
      const el = termOf(e.target);
      if (el && el.matches(":focus-visible")) show(el);
    };
    const onBlur = (e: FocusEvent) => {
      if (termOf(e.target) && !inTip(e.relatedTarget)) later(() => setOpen((o) => (o && document.activeElement && tip.current?.contains(document.activeElement) ? o : null)), 50);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen((o) => {
        if (o && inTip(document.activeElement)) o.el.focus();
        return null;
      });
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer.current);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
      document.removeEventListener("keydown", onKey);
    };
  }, [terms]);

  // Under the term, or above it when there's no room below; never past the screen's sides.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = open.el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const width = Math.min(WIDTH, vw - 16);
      const h = tip.current?.offsetHeight ?? 0;
      const left = Math.max(8, Math.min(r.left, vw - width - 8));
      const below = r.bottom + 8;
      const top = below + h > window.innerHeight - 8 && r.top - 8 - h > 8 ? r.top - 8 - h : below;
      setPos({ left, top, width });
    };
    const frame = requestAnimationFrame(place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  if (!open) return null;
  const t = terms[open.id];
  return createPortal(
    <div
      ref={tip}
      role="tooltip"
      id="guide-term-tip"
      aria-label={t.name}
      className={styles.tip}
      style={pos ? { left: pos.left, top: pos.top, width: pos.width } : { visibility: "hidden", left: 0, top: 0 }}
    >
      <b className={styles.tipName}>{t.name}</b>
      <span className={styles.tipText} dangerouslySetInnerHTML={{ __html: t.html }} />
      {(t.see || t.nexus) && (
        <span className={styles.tipLinks}>
          {t.see && <a href={t.see}>Read more</a>}
          {t.nexus && (
            <a href={`https://www.nexusmods.com/skyrimspecialedition/mods/${t.nexus}`} target="_blank" rel="noreferrer">
              Nexus Mods
            </a>
          )}
        </span>
      )}
    </div>,
    document.body,
  );
}
