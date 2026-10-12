"use client";

import { useEffect, type RefObject } from "react";

/**
 * Closes an open menu, popover or list (WO-38): a pointer-down outside `inside` closes it where
 * the player clicked; Esc closes it and returns focus to `trigger`, the button that opened it.
 * Every dropdown on the site uses this, so they all behave the same. `inside` should hold both the
 * trigger and the panel (or one wrapper around both), so clicking the trigger still toggles.
 */
export function useDismiss({
  open,
  onClose,
  inside,
  trigger,
}: {
  open: boolean;
  onClose: () => void;
  inside: RefObject<HTMLElement | null>[];
  trigger?: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;
    const isInside = (t: EventTarget | null) => t instanceof Node && inside.some((r) => r.current?.contains(t));
    const onDown = (e: PointerEvent) => {
      if (!isInside(e.target)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      onClose();
      trigger?.current?.focus();
    };
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("keydown", onKey);
    };
    // `inside` and `trigger` are refs: stable. onClose may be a fresh closure each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);
}
