"use client";

import { useCallback, useSyncExternalStore } from "react";
import { NOWHERE, parseWhere, type Where } from "./open";

/**
 * Where you are (WO-100), kept in this browser (localStorage "quests:where"), shared by every Quests
 * page. Not in the database yet. An unreadable store (a private window) just means nothing entered.
 */
const KEY = "quests:where";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const cache = new Map<string, Where>();
function parsed(raw: string): Where {
  let w = cache.get(raw);
  if (!w) {
    w = raw ? parseWhere(raw) : NOWHERE;
    cache.set(raw, w);
  }
  return w;
}

export function useWhere(): [Where, (next: Partial<Where> | null) => void] {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  const where = parsed(raw);
  const set = useCallback((next: Partial<Where> | null) => {
    try {
      if (next === null) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify({ ...parsed(read()), ...next }));
    } catch {
      // No storage: nothing to keep.
    }
    listeners.forEach((l) => l());
  }, []);
  return [where, set];
}
