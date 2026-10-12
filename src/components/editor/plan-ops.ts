/** Pure edits to a build plan. Each returns a new plan. */
import { emptyLevel } from "@/lib/rules/derive";
import { gearAt } from "@/lib/rules/gear";
import { keptMainSpells, MAX_MAIN_SPELLS } from "@/lib/rules/spells";
import type { AbilityRow, Attribute, BuildPlan, Extra, GearItem, LevelPlan, MadeGear, ShoutRow, SpellRow } from "@/lib/rules/types";

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

/** A deity change from this level on (WO-43); "" keeps the one followed. */
export function setDeity(plan: BuildPlan, level: number, deity: string): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const next = { ...lv };
    if (deity === "") delete next.deity;
    else next.deity = deity;
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
  return withMainSpells({ ...plan, levels: plan.levels.slice(0, -1) });
}

/** Main spells only ever list spells the build learns (WO-42); no field when there are none. */
function withMainSpells(plan: BuildPlan): BuildPlan {
  const kept = keptMainSpells(plan);
  const next = { ...plan };
  if (kept.length) next.mainSpells = kept;
  else delete next.mainSpells;
  return next;
}

function withSpells(plan: BuildPlan, level: number, fn: (rows: SpellRow[]) => SpellRow[]): BuildPlan {
  return withMainSpells(
    withLevel(plan, level, (lv) => {
      const spells = fn(lv.spells ?? []);
      const next = { ...lv };
      if (spells.length) next.spells = spells;
      else delete next.spells;
      return next;
    }),
  );
}

/** A spell learned at a level (WO-42): a tier perk's pick (`where` = the perk's name) or learned another way. */
export function addSpell(plan: BuildPlan, level: number, row: SpellRow): BuildPlan {
  const clean: SpellRow = row.where?.trim() ? { id: row.id, where: row.where.trim().slice(0, 80) } : { id: row.id };
  return withSpells(plan, level, (rows) => [...rows, clean]);
}

export function removeSpell(plan: BuildPlan, level: number, index: number): BuildPlan {
  return withSpells(plan, level, (rows) => rows.filter((_, i) => i !== index));
}

export function setSpellWhere(plan: BuildPlan, level: number, index: number, where: string): BuildPlan {
  return withSpells(plan, level, (rows) => rows.map((r, i) => (i !== index ? r : where.trim() ? { ...r, where: where.slice(0, 80) } : { id: r.id })));
}

const whereOf = (where?: string) => (where?.trim() ? { where: where.slice(0, 80) } : {});

/** A level's own ability or shout rows, changed by `fn`; no field when there are none (WO-51). */
function withRows<K extends "abilities" | "shouts">(plan: BuildPlan, level: number, key: K, fn: (rows: NonNullable<LevelPlan[K]>) => NonNullable<LevelPlan[K]>): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const rows = fn((lv[key] ?? []) as NonNullable<LevelPlan[K]>);
    const next = { ...lv };
    if (rows.length) next[key] = rows;
    else delete next[key];
    return next;
  });
}

/** An ability the author adds at a level (WO-51): racial, stone, god, quest. */
export function addAbility(plan: BuildPlan, level: number, row: AbilityRow): BuildPlan {
  return withRows(plan, level, "abilities", (rows) => [...rows, { id: row.id, ...whereOf(row.where?.trim()) }]);
}

export function removeAbility(plan: BuildPlan, level: number, index: number): BuildPlan {
  return withRows(plan, level, "abilities", (rows) => rows.filter((_, i) => i !== index));
}

export function setAbilityWhere(plan: BuildPlan, level: number, index: number, where: string): BuildPlan {
  return withRows(plan, level, "abilities", (rows) => rows.map((r, i) => (i !== index ? r : { id: r.id, ...whereOf(where) })));
}

/** A shout row at a level (WO-51): how many words are known from here. */
export function addShout(plan: BuildPlan, level: number, row: ShoutRow): BuildPlan {
  return withRows(plan, level, "shouts", (rows) => [...rows, { id: row.id, words: row.words, ...whereOf(row.where?.trim()) }]);
}

export function removeShout(plan: BuildPlan, level: number, index: number): BuildPlan {
  return withRows(plan, level, "shouts", (rows) => rows.filter((_, i) => i !== index));
}

export function setShoutWhere(plan: BuildPlan, level: number, index: number, where: string): BuildPlan {
  return withRows(plan, level, "shouts", (rows) => rows.map((r, i) => (i !== index ? r : { id: r.id, words: r.words, ...whereOf(where) })));
}

export function setShoutWords(plan: BuildPlan, level: number, index: number, words: 1 | 2 | 3): BuildPlan {
  return withRows(plan, level, "shouts", (rows) => rows.map((r, i) => (i !== index ? r : { ...r, words })));
}

/** Stars or unstars a spell as a main spell, up to 8, in the order starred. */
export function toggleMainSpell(plan: BuildPlan, id: string): BuildPlan {
  const main = plan.mainSpells ?? [];
  const next = main.includes(id) ? main.filter((x) => x !== id) : main.length < MAX_MAIN_SPELLS ? [...main, id] : main;
  return withMainSpells({ ...plan, mainSpells: next });
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
export function setGearAt(plan: BuildPlan, level: number, slot: string, set: { name: string; note: string; itemId?: string; made?: MadeGear }, item?: string): BuildPlan {
  const name = set.name.trim();
  const note = set.note.trim();
  if (!name) return emptyGearAt(plan, level, slot, item);
  // An item from the index keeps its id, so it links to its card.
  const picked = { ...(set.itemId ? { itemId: set.itemId } : {}), ...(set.made ? { made: set.made } : {}) };
  if (slot !== "Other") return { ...plan, gear: [...plan.gear.filter((g) => !isEntryRow(g, level, slot)), { slot, name, fromLevel: level, note, ...picked }] };
  const here = item === undefined ? -1 : plan.gear.findIndex((g) => g.fromLevel === level && g.slot === "Other" && g.name === item);
  if (here >= 0) return { ...plan, gear: plan.gear.map((g, i) => (i === here ? { slot: g.slot, fromLevel: g.fromLevel, name, note, ...(g.replaces ? { replaces: g.replaces } : {}), ...picked } : g)) };
  return { ...plan, gear: [...plan.gear, { slot, name, fromLevel: level, note, ...(item !== undefined ? { replaces: item } : {}), ...picked }] };
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

