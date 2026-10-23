import "server-only";
import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { setPlayerFacts, type PlayerFact } from "./player-facts-store";

/**
 * Loading the approved player facts (WO-146 Part 3) into the store questsData reads. Each copy of the store (a server
 * instance, and within one the pages' and the door's own bundles) looks again at most every ten seconds, so an approval shows
 * everywhere within ten seconds, and at once where it was taken (`force`). A database that can't be reached leaves what
 * was loaded: the pages never break for a player's fact.
 */
const EVERY = 10_000;
let loadedAt = 0;
let inflight: Promise<void> | null = null;

export function loadPlayerFacts(force = false): Promise<void> {
  if (!force && Date.now() - loadedAt < EVERY) return Promise.resolve();
  if (inflight && !force) return inflight;
  inflight = (async () => {
    try {
      const rows = await db().select().from(schema.questPlayerFacts).orderBy(asc(schema.questPlayerFacts.id));
      setPlayerFacts(rows.map((r): PlayerFact => ({ id: r.id, lineId: r.lineId, quest: r.quest, replaces: r.replaces, way: r.way, source: r.source, confirms: r.confirms })));
      loadedAt = Date.now();
    } catch (e) {
      console.error("player facts not loaded", e instanceof Error ? e.message : e);
      // Try again in five seconds, keeping what's there.
      loadedAt = Date.now() - (EVERY - 5_000);
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
