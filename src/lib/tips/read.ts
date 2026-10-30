import "server-only";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { personBySlug } from "@/lib/people/data";
import { placeBySlug } from "@/lib/places/data";
import { questsData } from "@/lib/quests/data";
import { pageOf } from "@/lib/quests/reads";
import { ProposeError, anthropic, PROPOSE_MODEL, type Complete } from "@/lib/quests/propose";
import type { TipKind } from "./words";

/**
 * The agent's reading of a tip (WO-184 Part 5, as WO-146 Part 2 does for a quest's way in): the player's words set against the records the page is built on,
 * written back for an admin to read. It never changes a page; an admin approves.
 */

const answer = z.object({
  words: z.string().min(1).max(700),
  fits: z.enum(["agrees", "adds something", "contradicts", "can't tell"]),
  confidence: z.enum(["high", "medium", "low"]),
});

const SYSTEM = [
  "You check what a player tells the LoreRim planner against the planner's records, and write a short reading for the admin who decides. You never change anything.",
  "Rules:",
  "- Use only the player's words and the records you are given. Never add a place, a person or a fact from memory.",
  "- Say what agrees with the records, what the records leave out that the player adds, and what disagrees. Use the game's names exactly. Two or three sentences.",
  "- fits is \"agrees\" when the records already say it, \"adds something\" when the records leave it out and the player says it, \"contradicts\" when they disagree, \"can't tell\" when the records give nothing to set it against.",
  "Answer with one JSON object and nothing else: {\"words\": string, \"fits\": \"agrees\"|\"adds something\"|\"contradicts\"|\"can't tell\", \"confidence\": \"high\"|\"medium\"|\"low\"}.",
].join("\n");

/** The page's records as the model reads them, kept short. */
export function recordsFor(kind: TipKind, key: string): unknown {
  if (kind === "place") {
    const p = placeBySlug(key);
    return p ? { name: p.name, type: p.type, hold: p.hold, realm: p.realm, inTown: p.inTown, nearestTown: p.nearestTown, actors: p.actors, worthGoingFor: p.worthGoingFor, danger: p.danger, quests: p.quests } : null;
  }
  if (kind === "person") {
    const p = personBySlug(key);
    return p ? { name: p.name, race: p.race, sex: p.sex, role: p.role, inTown: p.inTown, cell: p.cell, trainer: p.trainer, follower: p.follower, marriage: p.marriage, sells: p.sells, read: p.read ? { firstMeet: p.read.firstMeet, day: p.read.day, changes: p.read.changes, role: p.read.role, sells: p.read.sells } : null } : null;
  }
  if (key.startsWith("line:")) {
    const line = questsData().byId.get(key.slice(5));
    return line ? { line: line.name, read: line.read, quests: line.quests.map((q) => q.name) } : null;
  }
  for (const l of questsData().lines) {
    const q = l.quests.find((x) => x.edid === key);
    if (q) return { line: l.name, quest: q.name, page: pageOf(q) };
  }
  return null;
}

/** One tip, read: the prompt, one call (logged), the answer checked and kept on the tip. */
export async function readTip(id: number, complete: Complete = anthropic) {
  const [t] = await db().select().from(schema.pageTips).where(eq(schema.pageTips.id, id)).limit(1);
  if (!t) throw new ProposeError("No such tip.");
  const records = JSON.stringify(recordsFor(t.kind, t.key) ?? {}).slice(0, 7000);
  const user = JSON.stringify({ about: t.field || "a mistake on the page", type: t.type, playerSays: t.words, howTheyKnow: t.how, records });
  const r = await complete(SYSTEM, user);
  console.info("tip-reading", JSON.stringify({ tip: id, model: r.model, input: r.usage?.input_tokens, output: r.usage?.output_tokens }));
  const start = r.text.indexOf("{");
  const end = r.text.lastIndexOf("}");
  let raw: unknown;
  try {
    raw = JSON.parse(r.text.slice(start, end + 1));
  } catch {
    throw new ProposeError("The reading didn't come back as JSON.");
  }
  const ok = answer.safeParse(raw);
  if (!ok.success) throw new ProposeError("The reading wasn't in the shape asked for.");
  const reading = { ...ok.data, model: r.model || PROPOSE_MODEL, at: new Date().toISOString() };
  await db().update(schema.pageTips).set({ reading }).where(eq(schema.pageTips.id, id));
  return reading;
}
