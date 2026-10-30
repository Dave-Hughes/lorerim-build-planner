"use client";

import { useEffect } from "react";

/** Counts one look at a page (WO-184 Part 3): a small post to the server, with no cookie, address or account. */
export function ViewBeacon({ kind, id }: { kind: "quest" | "person" | "place"; id: string }) {
  useEffect(() => {
    try {
      navigator.sendBeacon("/api/views", new Blob([JSON.stringify({ kind, key: id })], { type: "application/json" }));
    } catch {
      // A browser that won't send a beacon is no one counted.
    }
  }, [kind, id]);
  return null;
}
