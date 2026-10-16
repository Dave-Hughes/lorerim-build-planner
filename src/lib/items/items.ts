/**
 * The game's weapons, armor and ammunition (WO-23), for the gear search and @-mentions. The
 * index is large, so it never ships in the page: it is fetched once per version, the first
 * time a gear search or an "@" needs it, from a long-cached static route.
 */
import { useEffect, useSyncExternalStore } from "react";
import { idKey, indexById, type GameItem } from "./search";

export { fitsSlot, idKey, indexById, itemType, searchItems, type GameItem } from "./search";

const loaded = new Map<string, { list: GameItem[]; byId: Map<string, GameItem> }>();
const pending = new Map<string, Promise<GameItem[]>>();
const listeners = new Set<() => void>();

/** Hashes of each version's items.json, set at build time (next.config.ts). */
const HASHES: Record<string, string> = (() => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_ITEMS_HASHES ?? "{}");
  } catch {
    return {};
  }
})();

/** The items URL, with the index's hash, so a rebuilt one is never served from an old cache. */
export function itemsUrl(version: string): string {
  const v = HASHES[version];
  return `/api/items/${encodeURIComponent(version)}${v ? `?v=${v}` : ""}`;
}

/** Fetches a version's items once; later calls share the same answer. An error gives an empty list, tried again next time. */
export function loadItems(version: string): Promise<GameItem[]> {
  const hit = loaded.get(version);
  if (hit) return Promise.resolve(hit.list);
  let p = pending.get(version);
  if (!p) {
    p = fetch(itemsUrl(version))
      .then((r) => (r.ok ? (r.json() as Promise<GameItem[]>) : Promise.reject(new Error(String(r.status)))))
      .then((list) => {
        loaded.set(version, { list, byId: indexById(list) });
        listeners.forEach((l) => l());
        return list;
      })
      .catch(() => [] as GameItem[])
      .finally(() => pending.delete(version));
    pending.set(version, p);
  }
  return p;
}

/** The items already fetched for a version, or null. */
export function loadedItems(version: string): GameItem[] | null {
  return loaded.get(version)?.list ?? null;
}

export function itemById(version: string, id: string): GameItem | undefined {
  return loaded.get(version)?.byId.get(idKey(id));
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** A version's items once fetched (null until then). `wanted` starts the fetch. */
export function useItems(version: string, wanted: boolean): GameItem[] | null {
  const list = useSyncExternalStore(
    subscribe,
    () => loaded.get(version)?.list ?? null,
    () => null,
  );
  useEffect(() => {
    if (wanted && version) void loadItems(version);
  }, [wanted, version]);
  return list;
}

