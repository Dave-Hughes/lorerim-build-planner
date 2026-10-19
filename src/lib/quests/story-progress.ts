"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MAIN } from "./open";
import { lastFromMain, mainFromStory } from "./story";
import { useWhere } from "./where";

/**
 * How far you are in a story (WO-106): the last quest done. Kept in this browser
 * (localStorage "quests:story:<id>"), except the main quest's story, which is Where you are's
 * "Main quest, done up to".
 */
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key?.startsWith("quests:story:") && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
};
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export function useStoryProgress(story: { id: string; line: string }, order: string[], mainOrder: string[]): [string | null, (last: string | null) => void] {
  const [where, setWhere] = useWhere();
  const key = `quests:story:${story.id}`;
  const stored = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const main = story.line === MAIN;
  const last = main ? lastFromMain(order, where.mainAt, mainOrder) : stored && order.includes(stored) ? stored : null;
  const set = useCallback(
    (next: string | null) => {
      if (main) {
        setWhere({ mainAt: mainFromStory(order, next, mainOrder) });
        return;
      }
      try {
        if (next) localStorage.setItem(key, next);
        else localStorage.removeItem(key);
      } catch {
        // No storage: nothing to keep.
      }
      listeners.forEach((l) => l());
    },
    [main, key, order, mainOrder, setWhere],
  );
  return [last, set];
}
