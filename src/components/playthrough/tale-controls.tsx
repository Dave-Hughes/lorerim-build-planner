"use client";

import { useState } from "react";
import { readEarly } from "@/lib/playthroughs/actions";

/** "Read it anyway": shows a beat before the game gets there. Reading it early doesn't tick anything. */
export function ReadAnyway({ id, chapterId, isOwner, children }: { id: string; chapterId: number; isOwner: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (open) return <>{children}</>;
  return (
    <span style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <button
        type="button"
        className="btn btn-sm"
        onClick={() => {
          setOpen(true);
          if (isOwner) void readEarly(id, chapterId);
        }}
      >
        Read it anyway
      </button>
      <span className="muted" style={{ fontSize: 14 }}>
        Reading it early doesn&apos;t tick anything
      </span>
    </span>
  );
}
