/**
 * Snapshot builds (WO-68): the build at one level. The author picks perks (what they need comes
 * along) and may set skill values; the rules fill the levels between (WO-64,
 * WO-65), and the snapshot keeps only the result: the skills, perks and attributes at its level.
 */
import { fillToLevel, goalsToSettings, type GoalSettings } from "@/components/editor/plan-ops";
import { MAX_LEVELS } from "@/lib/builds/limits";
import type { GameData } from "./data";
import { computeBuild } from "./engine";
import type { BuildPlan, Snapshot, SnapshotResult } from "./types";

/** What fillToLevel gets for a snapshot, filled to `to` (its level unless said). */
export function snapshotSettings(plan: BuildPlan, snap: Snapshot, d: GameData, to = snap.level): GoalSettings {
  // What the picks need and the set values first; then every major the author hasn't set takes the
  // spare points up to the max skill, even one the picks already raise, then the minors.
  const g = goalsToSettings({ ...onlyLevelOne(plan), majors: [], minors: [] }, snap.perks, to, snap.attributes, d, snap.skills);
  const spare = [...plan.majors, ...plan.minors].filter((sk) => !(sk in snap.skills)).map((sk): [string, number] => [sk, 100]);
  return { ...g, settings: { ...g.settings, targets: [...g.settings.targets, ...spare] } };
}

/** The plan the fill starts from: Set up and level 1, nothing of the snapshot. */
function onlyLevelOne(plan: BuildPlan): BuildPlan {
  const { snapshot: _snapshot, ...rest } = plan;
  void _snapshot;
  return { ...rest, levels: plan.levels.slice(0, 1) };
}

/** The snapshot filled to `to`: the levels the rules make, and the report. */
export function fillSnapshot(plan: BuildPlan, snap: Snapshot, d: GameData, to = snap.level) {
  const g = snapshotSettings(plan, snap, d, to);
  const { plan: filled, report } = fillToLevel(onlyLevelOne(plan), g.settings, d);
  return { g, filled, report, states: computeBuild(filled, d) };
}

/**
 * The lowest level the snapshot can be at: the latest level a pick is placed or a set skill value
 * is reached, filling to the top level (the same fill the preview's "at the earliest" was). 2 at
 * the least; one past the top when something can't be had at all.
 */
export function snapshotFloor(plan: BuildPlan, snap: Pick<Snapshot, "perks" | "skills" | "attributes">, d: GameData): number {
  const full = { level: MAX_LEVELS, ...snap };
  const { g, report } = fillSnapshot(plan, full, d, MAX_LEVELS);
  if (g.clashes.length) return MAX_LEVELS + 1;
  const picks = snap.perks.map((id) => report.perks.find((p) => p.id === id)?.level ?? MAX_LEVELS + 1);
  const set = Object.keys(snap.skills).map((s) => report.targets.find((t) => t.skill === s)?.reachedAt ?? MAX_LEVELS + 1);
  return Math.max(2, ...picks, ...set);
}

/**
 * The checks a snapshot must pass to be saved: the level, attributes adding up, every pick
 * placed, every set value reached, and no problem from the rules engine on any level. Gives the
 * result to store, or the reason it can't be.
 */
export function checkSnapshot(plan: BuildPlan, snap: Snapshot, d: GameData): { ok: true; result: SnapshotResult } | { ok: false; error: string } {
  const L = snap.level;
  if (!Number.isInteger(L) || L < 2 || L > MAX_LEVELS) return { ok: false, error: `A snapshot's level is 2 to ${MAX_LEVELS}.` };
  const ups = snap.attributes.health + snap.attributes.magicka + snap.attributes.stamina;
  if (ups !== L - 1) return { ok: false, error: `The attributes take ${L - 1} level-ups, not ${ups}.` };
  if (snap.perks.some((id) => !d.perkById.has(id))) return { ok: false, error: "A picked perk isn't in this version." };
  const { g, report, states } = fillSnapshot(plan, snap, d);
  if (g.clashes.length) return { ok: false, error: g.clashes[0].message };
  const missed = snap.perks.find((id) => !report.perks.find((p) => p.id === id)?.level);
  if (missed) return { ok: false, error: `${d.perkById.get(missed)?.name ?? missed} can't be had by level ${L}.` };
  const last = states[L - 1];
  const short = Object.entries(snap.skills).find(([s, v]) => (last.skills[s] ?? 0) < v);
  if (short) return { ok: false, error: `${short[0]} can't reach ${short[1]} by level ${L}.` };
  // Set up's own problems (a birthsign not chosen yet) are level 1's, shown there as for any build;
  // the snapshot is refused only for a problem the levels it fills bring.
  const setUp = new Set(states[0].issues.map((i) => i.message));
  const issue = states.slice(1, L).flatMap((s) => s.issues).find((i) => !setUp.has(i.message));
  if (issue) return { ok: false, error: issue.message };
  const perks = [...Object.entries(last.perksTaken).filter(([, at]) => at.length > 0).map(([id]) => id), ...Object.keys(last.destinyTaken)];
  return { ok: true, result: { skills: { ...last.skills }, perks, health: last.health, magicka: last.magicka, stamina: last.stamina } };
}

/** What the picks need of a skill: at least its value at level 1, and the highest perk need in its tree. */
export function skillNeedOf(d: GameData, held: Iterable<string>, skill: string, start: number): number {
  let need = start;
  for (const id of held) {
    const p = d.perkById.get(id);
    if (p?.tree === skill) need = Math.max(need, p.rankSkills?.[0] ?? p.skill ?? 0);
  }
  return need;
}

/**
 * The most a skill can be set to at the snapshot's level with the other values and picks as they
 * are (WO-68): from `low` up, the highest value that still lets everything be had by the level.
 */
export function skillCap(plan: BuildPlan, snap: Snapshot, skill: string, low: number, d: GameData): number {
  const fits = (v: number) => snapshotFloor(plan, { ...snap, skills: { ...snap.skills, [skill]: v } }, d) <= snap.level;
  let lo = low;
  let hi = Math.min(100, d.maxSkillAt(snap.level));
  if (fits(hi)) return hi;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (fits(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** Why a perk can't be picked: the held perk that rules it out, and the one in its path that is ruled out. */
export interface RuledOut {
  by: string;
  via: string;
}

/**
 * Perks that can't go with what's held (WO-68): any a held perk excludes, and any whose path
 * needs one of those (an "either" only when every way is ruled out). Held perks are never ruled out.
 */
export function ruledOut(d: GameData, held: Set<string>): Map<string, RuledOut> {
  const direct = new Map<string, string>();
  for (const id of held) for (const x of d.perkById.get(id)?.excludes ?? []) if (!held.has(x) && !direct.has(x)) direct.set(x, id);
  const out = new Map<string, RuledOut>();
  const seen = new Map<string, RuledOut | null>();
  const walk = (id: string): RuledOut | null => {
    if (seen.has(id)) return seen.get(id)!;
    seen.set(id, null);
    let r: RuledOut | null = null;
    if (held.has(id)) r = null;
    else if (direct.has(id)) r = { by: direct.get(id)!, via: id };
    else {
      const p = d.perkById.get(id);
      const reqs = (p?.requires ?? []).filter((x) => d.perkById.has(x));
      const ways = reqs.map(walk);
      if (reqs.length && (p?.anyOf ? ways.every(Boolean) : ways.some(Boolean))) r = ways.find(Boolean)!;
    }
    seen.set(id, r);
    return r;
  };
  for (const p of d.perks) {
    const r = walk(p.id);
    if (r) out.set(p.id, r);
  }
  return out;
}
