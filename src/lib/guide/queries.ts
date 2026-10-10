import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { BuildPlan } from "@/lib/rules/types";
import { notesToDoc, type GuideDoc } from "./doc";

export interface GuideSection {
  doc: GuideDoc;
  /** False until the first save: the section is still the old plain-text notes. */
  saved: boolean;
}

/** A build's guide sections by key. Sections never saved fall back to the plan's old plain-text notes. */
export async function getGuide(buildId: string, plan: BuildPlan, fromDb = true): Promise<Record<string, GuideSection>> {
  const out: Record<string, GuideSection> = {};
  if (plan.notes.trim()) out.overview = { doc: notesToDoc(plan.notes), saved: false };
  plan.levels.forEach((lv, i) => {
    if (lv.note.trim()) out[`level:${i + 1}`] = { doc: notesToDoc(lv.note), saved: false };
  });
  if (fromDb) {
    const rows = await db()
      .select({ key: schema.buildGuides.key, doc: schema.buildGuides.doc })
      .from(schema.buildGuides)
      .where(eq(schema.buildGuides.buildId, buildId));
    for (const r of rows) {
      const level = r.key.startsWith("level:") ? Number(r.key.slice(6)) : 0;
      if (level > plan.levels.length) continue;
      out[r.key] = { doc: r.doc, saved: true };
    }
  }
  return out;
}

/** Copies a build's guide rows to another build (images keep pointing at the same files). */
export async function copyGuide(fromId: string, toId: string): Promise<void> {
  const rows = await db().select().from(schema.buildGuides).where(eq(schema.buildGuides.buildId, fromId));
  if (rows.length) await db().insert(schema.buildGuides).values(rows.map((r) => ({ ...r, buildId: toId, updatedAt: new Date() })));
}
