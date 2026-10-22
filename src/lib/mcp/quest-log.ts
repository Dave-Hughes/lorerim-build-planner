import { questsData } from "@/lib/quests/data";
import type { Quest, QuestLine } from "@/lib/quests/types";

/**
 * The quest log (WO-134): a stored save's quest stages, given back in the game's words. Each quest the save has a stage
 * for is placed by the last thing its journal shows at or before that stage: an objective (active), an ending that
 * completes it (finished) or fails it (failed), or nothing (started, but the records don't say what that stage shows).
 * A quest the planner doesn't list (helpers, hidden scripts, the game's bookkeeping) is only counted.
 */

export const NO_SAVE = "No save is stored yet; ask the player to run the save connector.";

export interface LogSnapshot {
  label: string;
  level: number;
  day?: number | null;
  place?: string | null;
  questStages?: Record<string, number> | null;
}

interface Placed {
  quest: string;
  line: string;
  stage: number;
}

type State =
  | { state: "active"; now: string; alsoNow?: string[] }
  | { state: "finished" | "failed"; ending: string; or?: string[] }
  | { state: "unclear"; says: string };

/** Where one quest stands at a stage: the last objective or ending at or before it, an ending winning a tie. */
export function standing(q: Quest, stage: number): State {
  const steps = (q.steps ?? []).filter((s) => s.stage <= stage);
  const ends = q.endings.filter((e) => e.stage <= stage);
  const lastStep = steps.length ? Math.max(...steps.map((s) => s.stage)) : -1;
  const lastEnd = ends.length ? Math.max(...ends.map((e) => e.stage)) : -1;
  if (lastEnd >= 0 && lastEnd >= lastStep) {
    const at = ends.filter((e) => e.stage === lastEnd);
    const texts = [...new Set(at.map((e) => e.text).filter(Boolean))];
    // Endings at one stage are the same outcome told different ways (Joslin's saddle); a fail among them is a fail.
    const state = at.every((e) => e.fails) ? "failed" : "finished";
    return { state, ending: texts[0] ?? "", ...(texts.length > 1 ? { or: texts.slice(1) } : {}) };
  }
  if (lastStep >= 0) {
    const now = steps.filter((s) => s.stage === lastStep).map((s) => s.text);
    // A required objective before an optional one (WO-121b rule 2).
    now.sort((a, b) => Number(/^\(Optional\)/i.test(a)) - Number(/^\(Optional\)/i.test(b)));
    return { state: "active", now: now[0], ...(now.length > 1 ? { alsoNow: now.slice(1) } : {}) };
  }
  return { state: "unclear", says: "Started, but the records don't say what this stage shows. Don't guess." };
}

/** Where the save stands against the plan's build: "The plan runs to level 30; the save is at level 10." */
function planNote(level: number, planLevels: number | null | undefined) {
  if (!planLevels) return null;
  if (planLevels < level) return `The save is at level ${level}, past the plan's last level, ${planLevels}.`;
  return `The plan runs to level ${planLevels}; the save is at level ${level}.`;
}

/** The log from a stored snapshot, grouped by line: active first (lines nearest their end first), then finished and failed behind a count. */
export function questLog(snap: LogSnapshot | null | undefined, planLevels?: number | null) {
  if (!snap) return { log: null, says: NO_SAVE };
  const where = [snap.label, `level ${snap.level}`, snap.day ? `day ${snap.day}` : null, snap.place].filter(Boolean).join(", ");
  const byEdid = new Map<string, { line: QuestLine; quest: Quest }>();
  for (const line of questsData().lines) for (const quest of line.quests) if (!byEdid.has(quest.edid.toLowerCase())) byEdid.set(quest.edid.toLowerCase(), { line, quest });
  const groups = { active: [] as (Placed & State)[], finished: [] as (Placed & State)[], failed: [] as (Placed & State)[], unclear: [] as (Placed & State)[] };
  let background = 0;
  for (const [edid, stage] of Object.entries(snap.questStages ?? {})) {
    const hit = byEdid.get(edid.toLowerCase());
    if (!hit) {
      background++;
      continue;
    }
    const st = standing(hit.quest, stage);
    groups[st.state].push({ quest: hit.quest.name, line: hit.line.name, stage, ...st });
  }
  // A line with fewer of its quests still to come is nearer its end, so it comes first.
  const left = (p: Placed) => {
    const line = questsData().lines.find((l) => l.name === p.line);
    const i = line ? line.quests.findIndex((q) => q.name === p.quest) : 0;
    return line ? line.quests.length - i : 0;
  };
  groups.active.sort((a, b) => left(a) - left(b) || a.line.localeCompare(b.line));
  const byLine = (xs: (Placed & State)[]) => {
    const out = new Map<string, Omit<Placed & State, "line">[]>();
    for (const { line, ...rest } of xs) out.set(line, [...(out.get(line) ?? []), rest]);
    return [...out].map(([line, quests]) => ({ line, quests }));
  };
  return {
    from: where,
    ...(planNote(snap.level, planLevels) ? { plan: planNote(snap.level, planLevels) } : {}),
    active: byLine(groups.active),
    finished: { count: groups.finished.length, lines: byLine(groups.finished) },
    failed: { count: groups.failed.length, lines: byLine(groups.failed) },
    ...(groups.unclear.length ? { startedButUnclear: byLine(groups.unclear) } : {}),
    background: `and ${background} background quest${background === 1 ? "" : "s"} the planner doesn't list (helpers and the game's own bookkeeping)`,
    note: "Quest names and objectives are the game's words. Give the active ones first; finished and failed only if the player asks. The stage numbers are for you, not the player.",
  };
}

/** For get_playthrough's whereYouStand: "8 quests started, 3 finished". */
export function logCounts(snap: LogSnapshot | null | undefined) {
  if (!snap?.questStages) return null;
  const log = questLog(snap);
  if (!("active" in log)) return null;
  const started = log.active.reduce((n, g) => n + g.quests.length, 0) + log.finished.count + log.failed.count + (log.startedButUnclear?.reduce((n, g) => n + g.quests.length, 0) ?? 0);
  return `${started} quests started, ${log.finished.count} finished`;
}
