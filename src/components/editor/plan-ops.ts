/** Pure edits to a build plan. Each returns a new plan. */
import { emptyLevel } from "@/lib/rules/derive";
import { gearAt } from "@/lib/rules/gear";
import type { Attribute, BuildPlan, Extra, GearItem, LevelPlan } from "@/lib/rules/types";

function withLevel(plan: BuildPlan, level: number, fn: (lv: LevelPlan) => LevelPlan): BuildPlan {
  return { ...plan, levels: plan.levels.map((lv, i) => (i === level - 1 ? fn(lv) : lv)) };
}

export function setAttribute(plan: BuildPlan, level: number, attribute: Attribute): BuildPlan {
  return withLevel(plan, level, (lv) => ({ ...lv, attribute }));
}

export function addSkillPoint(plan: BuildPlan, level: number, skill: string, delta: 1 | -1): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const next = Math.max(0, Math.min(5, (lv.skillPoints[skill] ?? 0) + delta));
    const skillPoints = { ...lv.skillPoints };
    if (next === 0) delete skillPoints[skill];
    else skillPoints[skill] = next;
    return { ...lv, skillPoints };
  });
}

export function takePerk(plan: BuildPlan, level: number, id: string): BuildPlan {
  const destiny = id.startsWith("Destiny:");
  return withLevel(plan, level, (lv) => (destiny ? { ...lv, destiny: [...lv.destiny, id] } : { ...lv, perks: [...lv.perks, id] }));
}

/** Removes one rank of a perk from a level (the last occurrence). */
export function removePerk(plan: BuildPlan, level: number, id: string): BuildPlan {
  const destiny = id.startsWith("Destiny:");
  return withLevel(plan, level, (lv) => {
    const list = destiny ? lv.destiny : lv.perks;
    const at = list.lastIndexOf(id);
    if (at < 0) return lv;
    const next = [...list.slice(0, at), ...list.slice(at + 1)];
    return destiny ? { ...lv, destiny: next } : { ...lv, perks: next };
  });
}

/** Removes one rank of each pick, from its own level. */
export function removePerks(plan: BuildPlan, picks: { id: string; level: number }[]): BuildPlan {
  return picks.reduce((p, x) => removePerk(p, x.level, x.id), plan);
}

export function addExtra(plan: BuildPlan, level: number, extra: Extra): BuildPlan {
  return withLevel(plan, level, (lv) => ({ ...lv, extras: [...lv.extras, extra] }));
}

export function removeExtra(plan: BuildPlan, level: number, index: number): BuildPlan {
  return withLevel(plan, level, (lv) => ({ ...lv, extras: lv.extras.filter((_, i) => i !== index) }));
}

export function setStone(plan: BuildPlan, level: number, stone: string): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const next = { ...lv };
    if (stone === "") delete next.stone;
    else next.stone = stone;
    return next;
  });
}

export function setNote(plan: BuildPlan, level: number, note: string): BuildPlan {
  return withLevel(plan, level, (lv) => ({ ...lv, note }));
}

export function addLevel(plan: BuildPlan): BuildPlan {
  return { ...plan, levels: [...plan.levels, emptyLevel()] };
}

export function removeLastLevel(plan: BuildPlan): BuildPlan {
  if (plan.levels.length <= 1) return plan;
  return { ...plan, levels: plan.levels.slice(0, -1) };
}

/**
 * The rows set at `level` for one held entry: a slot, or in `Other` one item, by its name at
 * that level (a row that adds or replaces it, or one that takes it away).
 */
function isEntryRow(g: GearItem, level: number, slot: string, item?: string): boolean {
  if (g.fromLevel !== level || g.slot !== slot) return false;
  if (slot !== "Other") return true;
  return g.name === item || (!g.name && g.replaces === item);
}

/**
 * Sets what a slot holds from `level` on. In `Other`, `item` is the item being changed (one set
 * at this level is edited in place, one carried from earlier is replaced); without it, an item is added.
 */
export function setGearAt(plan: BuildPlan, level: number, slot: string, name: string, note: string, item?: string): BuildPlan {
  name = name.trim();
  note = note.trim();
  if (!name) return emptyGearAt(plan, level, slot, item);
  if (slot !== "Other") return { ...plan, gear: [...plan.gear.filter((g) => !isEntryRow(g, level, slot)), { slot, name, fromLevel: level, note }] };
  const here = item === undefined ? -1 : plan.gear.findIndex((g) => g.fromLevel === level && g.slot === "Other" && g.name === item);
  if (here >= 0) return { ...plan, gear: plan.gear.map((g, i) => (i === here ? { ...g, name, note } : g)) };
  return { ...plan, gear: [...plan.gear, { slot, name, fromLevel: level, note, ...(item !== undefined ? { replaces: item } : {}) }] };
}

/** Empties a slot (or, in `Other`, takes `item` away) from `level` on. */
export function emptyGearAt(plan: BuildPlan, level: number, slot: string, item?: string): BuildPlan {
  if (slot !== "Other") {
    const gear = plan.gear.filter((g) => !isEntryRow(g, level, slot));
    const held = gearAt({ ...plan, gear }, level).some((g) => g.slot === slot);
    return { ...plan, gear: held ? [...gear, { slot, name: "", fromLevel: level, note: "" }] : gear };
  }
  const here = plan.gear.findIndex((g) => g.fromLevel === level && g.slot === "Other" && g.name === item);
  if (here < 0) return { ...plan, gear: [...plan.gear, { slot, name: "", fromLevel: level, note: "", replaces: item }] };
  const r = plan.gear[here];
  return {
    ...plan,
    gear: r.replaces ? plan.gear.map((g, i) => (i === here ? { ...g, name: "", note: "" } : g)) : plan.gear.filter((_, i) => i !== here),
  };
}

/** Takes back the change made at `level` to a slot (or to one `Other` item). */
export function undoGearAt(plan: BuildPlan, level: number, slot: string, item?: string): BuildPlan {
  return { ...plan, gear: plan.gear.filter((g) => !isEntryRow(g, level, slot, item)) };
}

