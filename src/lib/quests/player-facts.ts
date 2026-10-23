import "server-only";
import { asc } from "drizzle-orm";
import { db, schema } from "@/db";
import { setPlayerFacts, type PlayerFact } from "./player-facts-store";

/**
 * Loading the approved player facts (WO-146 Part 3) into the store questsData reads. Each server instance looks again at most
 * once a minute, so an approval shows on the pages within a minute everywhere, and at once on the instance that took it
 * (`force`). A database that can't be reached leaves what was loaded: the pages never break for a player's fact.
 */
const EVERY = 60_000;
let loadedAt = 0;
let inflight: Promise<void> | null = null;

export function loadPlayerFacts(force = false): Promise<void> {
  if (!force && Date.now() - loadedAt < EVERY) return Promise.resolve();
  if (inflight && !force) return inflight;
  inflight = (async () => {
    try {
      const rows = await db().select().from(schema.questPlayerFacts).orderBy(asc(schema.questPlayerFacts.id));
      setPlayerFacts(rows.map((r): PlayerFact => ({ id: r.id, lineId: r.lineId, quest: r.quest, replaces: r.replaces, way: r.way, source: r.source })));
      loadedAt = Date.now();
    } catch (e) {
      console.error("player facts not loaded", e instanceof Error ? e.message : e);
      // Try again in ten seconds, keeping what's there.
      loadedAt = Date.now() - (EVERY - 10_000);
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
