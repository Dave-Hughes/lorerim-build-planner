import "server-only";
import { sql } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Answer } from "./answer";

/** A refusal's code, from its words (WO-119): which kind of no it was, never the text. */
export function refusalCode(text: string): string {
  if (/^Too many calls/.test(text)) return "rate-limit";
  if (/^Sign in|sign-in|signed in/i.test(text)) return "sign-in";
  if (/^Nothing was saved\./.test(text)) return "rule";
  if (/^No (build|playthrough|quest|perk|spell|chapter|perk tree)\b|isn't in the planner/.test(text)) return "not-found";
  return "refused";
}

/** One call's outcome and code, from its answer: refused, warned (its warnings' codes, joined), or ok. */
export function outcomeOf(res: Answer): { outcome: "ok" | "refused" | "warned"; code: string | null } {
  const text = res.content[0]?.text ?? "";
  if (res.isError) return { outcome: "refused", code: refusalCode(text) };
  try {
    const warnings = (JSON.parse(text) as { warnings?: { code?: string }[] }).warnings;
    if (warnings?.length) return { outcome: "warned", code: warnings.map((w) => w.code ?? "warned").join(",") };
  } catch {
    // Not JSON (a style guide): an ok.
  }
  return { outcome: "ok", code: null };
}

/**
 * Records a call through the door (WO-119): the tool, its outcome and codes, and the build or
 * playthrough it named. No user and no text. A failure to record never fails the call.
 */
export async function recordDoorEvent(tool: string, args: unknown, res: Answer) {
  const a = (args ?? {}) as Record<string, unknown>;
  const target = typeof a.build === "string" ? a.build : typeof a.playthrough === "string" ? a.playthrough : typeof a.buildId === "string" ? a.buildId : null;
  try {
    await db()
      .insert(schema.doorEvents)
      .values({ tool, ...outcomeOf(res), target: target?.slice(0, 80) ?? null });
  } catch {
    // Counting is a nicety; the answer still goes.
  }
}

/** The admin page's Connector counts (WO-119), per week, newest first, for the last eight weeks. */
export async function doorCounts() {
  const rows = await db().execute(sql`
    select to_char(date_trunc('week', at), 'YYYY-MM-DD') as week, tool, outcome, coalesce(code, '') as code, count(*)::int as n
    from door_event where at > now() - interval '8 weeks'
    group by 1, 2, 3, 4 order by 1 desc, 5 desc`);
  const finished = await db().execute(sql`
    select to_char(date_trunc('week', at), 'YYYY-MM-DD') as week, count(distinct target)::int as n
    from door_event where tool = 'finish_draft' and outcome = 'warned' and at > now() - interval '8 weeks'
    group by 1 order by 1 desc`);
  type Row = { week: string; tool: string; outcome: string; code: string; n: number };
  const all = rows.rows as Row[];
  const weeks = [...new Set(all.map((r) => r.week))];
  return weeks.map((week) => {
    const here = all.filter((r) => r.week === week);
    const sum = (f: (r: Row) => boolean, keys: (r: Row) => string[]) => {
      const m = new Map<string, number>();
      for (const r of here.filter(f)) for (const k of keys(r)) m.set(k, (m.get(k) ?? 0) + r.n);
      return [...m].sort((x, y) => y[1] - x[1]);
    };
    return {
      week,
      calls: sum(() => true, (r) => [r.tool]),
      refusals: sum((r) => r.outcome === "refused", (r) => [r.code || "refused"]),
      // A warned call keeps its warnings' codes joined: each counts.
      warnings: sum((r) => r.outcome === "warned", (r) => (r.code || "warned").split(",")),
      finishedWithWarnings: (finished.rows as { week: string; n: number }[]).find((f) => f.week === week)?.n ?? 0,
    };
  });
}
