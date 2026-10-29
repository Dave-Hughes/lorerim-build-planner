"use client";

import { useEffect, useRef } from "react";

/**
 * The objectives already done, folded under the list (WO-124). An address that points into the fold (the reader's way back to an
 * objective) opens it and brings that objective into view.
 */
export function DoneFold({ className, label, children }: { className?: string; label: React.ReactNode; children: React.ReactNode }) {
  const fold = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = id ? fold.current?.querySelector(`#${CSS.escape(id)}`) : null;
    if (!target || !fold.current) return;
    fold.current.open = true;
    target.scrollIntoView({ block: "center" });
  }, []);
  return (
    <details ref={fold} className={className}>
      <summary>{label}</summary>
      {children}
    </details>
  );
}
