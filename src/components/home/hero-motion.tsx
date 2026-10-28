"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's drift (WO-170): the layers move a few pixels with the pointer and with the scroll, the far ones least and the fire most. It
 * only sets two numbers on the hero (`--dx`, `--dy`, `--sy`); each layer's `--d` says how far it follows. The words and the search box
 * are not layers and stay put. Nothing under reduced motion, and no pointer drift on a phone.
 */
export function HeroMotion() {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const hero = mark.current?.closest("section");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wide = window.matchMedia("(min-width: 700px) and (hover: hover)");
    let frame = 0;
    let dx = 0;
    let dy = 0;
    let sy = 0;
    const apply = () => {
      frame = 0;
      hero.style.setProperty("--dx", dx.toFixed(2));
      hero.style.setProperty("--dy", dy.toFixed(2));
      hero.style.setProperty("--sy", sy.toFixed(2));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (!wide.matches) return;
      const r = hero.getBoundingClientRect();
      dx = ((e.clientX - r.left) / r.width - 0.5) * -28;
      dy = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * -16;
      schedule();
    };
    const onScroll = () => {
      sy = Math.min(60, Math.max(0, window.scrollY * 0.12));
      schedule();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return <span ref={mark} hidden />;
}
