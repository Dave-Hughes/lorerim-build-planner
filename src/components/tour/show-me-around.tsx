"use client";

import { startTour } from "@/lib/tour";

/** "Show me around" in the site footer (WO-61): restarts the tour for the page you're on. */
export function ShowMeAround({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={startTour}>
      Show me around
    </button>
  );
}
