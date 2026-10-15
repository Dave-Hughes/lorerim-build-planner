/** Pure edits to a build plan. Each returns a new plan. */
import type { GameData } from "@/lib/rules/data";
import { emptyLevel } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { takesWholeSlot } from "@/lib/rules/gear";
import { keptMainSpells, MAX_MAIN_SPELLS } from "@/lib/rules/spells";
import { skippedLevel, stretchAt } from "@/lib/rules/stretches";
import type { AbilityRow, Attribute, BuildPlan, Extra, GearItem, LevelPlan, LevelState, MadeGear, ShoutRow, SpellRow } from "@/lib/rules/types";

function withLevel(plan: BuildPlan, level: number, fn: (lv: LevelPlan) => LevelPlan): BuildPlan {
  return { ...plan, levels: plan.levels.map((lv, i) => (i === level - 1 ? fn(lv) : lv)) };
}

export function setAttribute(plan: BuildPlan, level: number, attribute: Attribute): BuildPlan {
  return withLevel(plan, level, (lv) => ({ ...lv, attribute }));
}

/** One more (or fewer) point in a skill. `max` is the most it may be raised here: +5, or +5 a level over a stretch (WO-69). */
export function addSkillPoint(plan: BuildPlan, level: number, skill: string, delta: 1 | -1, max = 5): BuildPlan {
  return setSkillRaise(plan, level, skill, (plan.levels[level - 1]?.skillPoints[skill] ?? 0) + delta, max);
}

/** A skill's raise at a level, as typed on a stretch (WO-69): kept between 0 and `max`. */
export function setSkillRaise(plan: BuildPlan, level: number, skill: string, raise: number, max = 5): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const next = Math.max(0, Math.min(max, Math.round(raise) || 0));
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
 * The row set at `level` for one piece of a type (WO-82): the row that puts it on (adds or replaces),
 * or the one that takes it off. A legacy empty row (no name, nothing named) matches `item` "".
 */
function isEntryRow(g: GearItem, level: number, type: string, item: string): boolean {
  if (g.fromLevel !== level || g.slot !== type) return false;
  return g.name ? g.name === item : (g.replaces ?? "") === item;
}

/**
 * Puts on a piece of a type from `level` (WO-82). Without `item` it adds to what's worn; with `item`
 * it takes that piece's place (a row set at this level for it is edited in place instead).
 */
export function setGearAt(plan: BuildPlan, level: number, type: string, set: { name: string; note: string; itemId?: string; made?: MadeGear }, item?: string): BuildPlan {
  const name = set.name.trim();
  const note = set.note.trim();
  if (!name) return item === undefined ? plan : emptyGearAt(plan, level, type, item);
  // An item from the index keeps its id, so it links to its card.
  const picked = { ...(set.itemId ? { itemId: set.itemId } : {}), ...(set.made ? { made: set.made } : {}) };
  const here = item === undefined ? -1 : plan.gear.findIndex((g) => g.fromLevel === level && g.slot === type && g.name === item);
  if (here >= 0)
    return { ...plan, gear: plan.gear.map((g, i) => (i === here ? { slot: g.slot, fromLevel: g.fromLevel, name, note, ...(g.replaces !== undefined ? { replaces: g.replaces } : {}), ...picked } : g)) };
  return { ...plan, gear: [...plan.gear, { slot: type, name, fromLevel: level, note, replaces: item ?? "", ...picked }] };
}

/** Takes one piece off from `level` on (Empty from here). */
export function emptyGearAt(plan: BuildPlan, level: number, type: string, item: string): BuildPlan {
  const here = plan.gear.findIndex((g) => g.fromLevel === level && g.slot === type && g.name === item);
  if (here < 0) return { ...plan, gear: [...plan.gear, { slot: type, name: "", fromLevel: level, note: "", replaces: item }] };
  const r = plan.gear[here];
  // Put on here: what it replaced comes off too (an old single-slot row empties the slot, as it did);
  // a piece only added here just goes.
  if (r.replaces || takesWholeSlot(r)) return { ...plan, gear: plan.gear.map((g, i) => (i === here ? { ...g, name: "", note: "", itemId: undefined, made: undefined } : g)).map(clean) };
  return { ...plan, gear: plan.gear.filter((_, i) => i !== here) };
}

/** A gear row without the keys set to undefined. */
function clean(g: GearItem): GearItem {
  const out = { ...g };
  if (out.itemId === undefined) delete out.itemId;
  if (out.made === undefined) delete out.made;
  return out;
}

/** Takes back the change made at `level` to one piece of a type. */
export function undoGearAt(plan: BuildPlan, level: number, type: string, item: string): BuildPlan {
  return { ...plan, gear: plan.gear.filter((g) => !isEntryRow(g, level, type, item)) };
}


/** What a level's attribute and skill points were, for Undo after Repeat (WO-56). */
export interface LevelSpend {
  attribute?: Attribute;
  skillPoints: Record<string, number>;
}

/**
 * Repeat last level (WO-56): this level takes the level before's attribute and skill points, and
 * nothing else. Skills are raised in the order the level before raised them, one point at a time,
 * as far as the rules allow: a raise is skipped past +5 for the level, at the max skill (the Master
 * of One skill excepted, as the rules engine does), or when the points left don't cover its cost.
 * Returns the new plan, what this level had before (for Undo), and a line for each skipped raise.
 */
export function repeatLevel(plan: BuildPlan, level: number, d: GameData): { plan: BuildPlan; before: LevelSpend; skipped: string[] } {
  const lv = plan.levels[level - 1];
  const prev = plan.levels[level - 2];
  const before: LevelSpend = { ...(lv?.attribute ? { attribute: lv.attribute } : {}), skillPoints: { ...(lv?.skillPoints ?? {}) } };
  if (!lv || !prev || level < 2) return { plan, before, skipped: [] };
  // What this level starts from doesn't depend on its own spend: the skills before it and the
  // points it has (its own plus those banked).
  const state = computeBuild(plan)[level - 1];
  const skills = { ...state.skillsBefore };
  const max = d.maxSkillAt(level);
  const moo = plan.traits.includes("Master of One") ? plan.masterOfOneSkill : undefined;
  let left = state.skillPointsAvailable;
  const raised: Record<string, number> = {};
  const skipped: string[] = [];
  for (const [skill, want] of Object.entries(prev.skillPoints)) {
    if (!(skill in skills) || want <= 0) continue;
    let got = 0;
    let why = "";
    while (got < want) {
      if (got >= d.rules.maxRaisePerSkillPerLevel) {
        why = `${skill}: +${want} is more than +${d.rules.maxRaisePerSkillPerLevel} in one level-up.`;
        break;
      }
      if (skills[skill] >= max && skill !== moo) {
        why = `${skill} stays at ${skills[skill]}, the max skill at level ${level}.`;
        break;
      }
      const cost = d.skillPointCost(skills[skill]);
      if (cost > left) {
        why = `${skill} +${want - got} didn't fit: ${left} skill point${left === 1 ? "" : "s"} left.`;
        break;
      }
      left -= cost;
      skills[skill]++;
      got++;
    }
    if (got) raised[skill] = got;
    if (why) skipped.push(why);
  }
  const next = withLevel(plan, level, (l) => {
    const out: LevelPlan = { ...l, skillPoints: raised };
    if (prev.attribute) out.attribute = prev.attribute;
    else delete out.attribute;
    return out;
  });
  return { plan: next, before, skipped };
}

/** Undo after Repeat (WO-56): puts back exactly the attribute and skill points the level had. */
export function restoreLevelSpend(plan: BuildPlan, level: number, before: LevelSpend): BuildPlan {
  return withLevel(plan, level, (l) => {
    const out: LevelPlan = { ...l, skillPoints: { ...before.skillPoints } };
    if (before.attribute) out.attribute = before.attribute;
    else delete out.attribute;
    return out;
  });
}

/**
 * Skip ahead (WO-69): adds the levels up to `to` as one stretch, the ones before it skipped and
 * `to` the level that holds the stretch's choices.
 */
export function skipAhead(plan: BuildPlan, to: number): BuildPlan {
  const total = plan.levels.length;
  if (to <= total) return plan;
  const skipped = Array.from({ length: to - total - 1 }, skippedLevel);
  return { ...plan, levels: [...plan.levels, ...skipped, emptyLevel()] };
}

/** Removes the last stretch: its level and the skipped levels before it (WO-69). */
export function removeLastStretch(plan: BuildPlan): BuildPlan {
  const { from } = stretchAt(plan, plan.levels.length);
  if (from <= 1) return plan;
  return withMainSpells({ ...plan, levels: plan.levels.slice(0, from - 1) });
}

/** Reset (WO-69): clears a level's skill points, attribute picks, perks and Destiny. Gear, spells and the note stay. */
export function resetLevel(plan: BuildPlan, level: number): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const { attribute: _a, attributes: _b, ...rest } = lv;
    void _a;
    void _b;
    return { ...rest, skillPoints: {}, perks: [], destiny: [] };
  });
}

/** A stretch's level-ups to one attribute (WO-69), in place of the single pick. */
export function setAttributeCount(plan: BuildPlan, level: number, attribute: Attribute, n: number): BuildPlan {
  return withLevel(plan, level, (lv) => {
    const { attribute: _single, ...rest } = lv;
    void _single;
    const attributes = { ...lv.attributes, [attribute]: Math.max(0, Math.round(n) || 0) };
    if (!attributes[attribute]) delete attributes[attribute];
    return { ...rest, attributes };
  });
}

/** Takes several perks at a level, in order: a star and the prerequisites it brings (WO-69). */
export function takePerks(plan: BuildPlan, level: number, ids: string[]): BuildPlan {
  return ids.reduce((p, id) => takePerk(p, level, id), plan);
}

/**
 * The prerequisites a star needs that aren't held at this level, root first (WO-69, from WO-65's
 * walk): an "either" takes one already held or already coming, else the one with the lowest skill
 * requirement (its own tree first on a tie). Empty when one of them is out of the skills' reach,
 * so only the star is taken and the rules engine says what's missing.
 */
export function missingPrerequisites(d: GameData, state: LevelState, id: string): string[] {
  const held = (x: string) => (state.perksTaken[x]?.length ?? 0) > 0 || x in state.destinyTaken || (!!state.grantedTree && d.perkById.get(x)?.tree === state.grantedTree);
  const need = (x: string) => {
    const p = d.perkById.get(x);
    return p?.rankSkills?.[0] ?? p?.skill ?? 0;
  };
  const out: string[] = [];
  const walk = (x: string, seen: Set<string>) => {
    if (seen.has(x)) return;
    seen.add(x);
    const p = d.perkById.get(x);
    if (!p) return;
    let reqs = p.requires.filter((r) => d.perkById.has(r));
    if (p.anyOf && reqs.length > 1) {
      if (reqs.some(held)) return;
      const coming = reqs.find((r) => out.includes(r));
      reqs = [coming ?? [...reqs].sort((a, b) => need(a) - need(b) || Number(d.perkById.get(a)!.tree !== p.tree) - Number(d.perkById.get(b)!.tree !== p.tree))[0]];
    }
    for (const r of reqs) {
      if (held(r)) continue;
      walk(r, seen);
      if (!out.includes(r)) out.push(r);
    }
  };
  walk(id, new Set());
  const reach = out.every((x) => {
    const p = d.perkById.get(x)!;
    return p.tree === "Destiny" || (state.skills[p.tree] ?? 0) >= need(x);
  });
  return reach ? out : [];
}
