"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** "Ctrl K", or "⌘K" on a Mac. The server and the first paint say Ctrl, so the two agree. */
export function ShortcutHint({ className }: { className?: string }) {
  const mac = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
  return (
    <span className={className} aria-hidden="true">
      {mac ? "⌘K" : "Ctrl K"}
    </span>
  );
}
