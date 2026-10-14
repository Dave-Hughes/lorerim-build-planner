/** Pure edits to a build plan. Each returns a new plan. */
import type { GameData } from "@/lib/rules/data";
import { emptyLevel, perkStatus } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { gearAt } from "@/lib/rules/gear";
import { keptMainSpells, MAX_MAIN_SPELLS } from "@/lib/rules/spells";
import type { AbilityRow, Attribute, BuildPlan, Extra, GearItem, LevelPlan, LevelState, MadeGear, ShoutRow, SpellRow } from "@/lib/rules/types";

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

/** What the fill is told (WO-64): a snapshot's settings (WO-68). */
export interface FillSettings {
  /** The level to reach, 2 to the version's top. */
  to: number;
  /** [skill, target], in the order points go in when there aren't enough for all. */
  targets: [string, number][];
  /** Perk and Destiny star ids, in order; a ranked perk listed twice takes two ranks. */
  perks: string[];
  /** Level-ups to each attribute; they add up to `to - 1`. */
  attributes: Record<Attribute, number>;
  /** Which attribute takes its level-ups first, or "even" to take them in turn from the start. */
  first: Attribute | "even";
}

export interface FillReport {
  health: number;
  magicka: number;
  stamina: number;
  targets: { skill: string; target: number; now: number; end: number; reachedAt: number | null; reason?: string }[];
  perks: { id: string; level: number | null; reason?: string }[];
  /** Perks and Destiny stars taken at each level, 1 to `to`. */
  perLevel: number[];
  skillPointsLeft: number;
  perkPointsLeft: number;
}

const ATTRIBUTE_TURN: Attribute[] = ["health", "magicka", "stamina"];

/** The attribute for each level-up, 2 to `to`: `first`'s all first, then the rest in turn; or in turn from the start. */
export function attributeOrder(s: Pick<FillSettings, "to" | "attributes" | "first">): Attribute[] {
  const left = { ...s.attributes };
  const out: Attribute[] = [];
  const take = (a: Attribute) => {
    out.push(a);
    left[a]--;
  };
  if (s.first !== "even") while (left[s.first] > 0 && out.length < s.to - 1) take(s.first);
  while (out.length < s.to - 1 && ATTRIBUTE_TURN.some((a) => left[a] > 0))
    for (const a of ATTRIBUTE_TURN) if (left[a] > 0 && out.length < s.to - 1) take(a);
  return out;
}

/**
 * The fill (WO-64): fills levels 2 to `to` of a fresh build (level 1 only) by the rules. Each
 * level gets its attribute from the order; its skill points go round the targets in row order, one
 * point at a time, skipping a skill at its target, the level's max skill, +5 this level, or one the
 * points left don't cover (the rest bank). Then its perk points take the first perks on the list
 * the rules engine accepts there, and its Destiny points the listed stars. Level 1 and the setup
 * are untouched, and no level ends with a problem. Returns the plan and a report for the preview.
 */
export function fillToLevel(plan: BuildPlan, s: FillSettings, d: GameData): { plan: BuildPlan; report: FillReport } {
  const order = attributeOrder(s);
  const levels: LevelPlan[] = [plan.levels[0]];
  const at = (L: number) => computeBuild({ ...plan, levels: levels.slice(0, L) }, d)[L - 1];
  const rankOf = (i: number) => s.perks.slice(0, i + 1).filter((x) => x === s.perks[i]).length;
  let state = at(1);
  for (let L = 2; L <= s.to; L++) {
    const prev = state;
    const lv: LevelPlan = { ...emptyLevel(), attribute: order[L - 2] ?? "health" };
    levels.push(lv);
    // Skill points: round the targets, one point at a time.
    const skills = { ...prev.skills };
    let points = d.rules.skillPointsPerLevel + prev.skillPointsBanked;
    const max = d.maxSkillAt(L);
    const raised: Record<string, number> = {};
    for (let moved = true; moved; ) {
      moved = false;
      for (const [sk, target] of s.targets) {
        if (!(sk in skills) || (raised[sk] ?? 0) >= d.rules.maxRaisePerSkillPerLevel || skills[sk] >= Math.min(target, max)) continue;
        const cost = d.skillPointCost(skills[sk]);
        if (cost > points) continue;
        points -= cost;
        skills[sk]++;
        raised[sk] = (raised[sk] ?? 0) + 1;
        moved = true;
      }
    }
    lv.skillPoints = raised;
    state = at(L);
    // Perks, then Destiny stars: the first on the list the engine accepts here, while points last.
    for (const destiny of [false, true]) {
      for (;;) {
        const left = destiny ? state.destinyPoints - state.destinyPointsSpent : state.perkPoints - state.perkPointsSpent;
        if (left <= 0) break;
        let took = false;
        for (let i = 0; i < s.perks.length; i++) {
          const id = s.perks[i];
          const p = d.perkById.get(id);
          if (!p || (p.tree === "Destiny") !== destiny) continue;
          const held = destiny ? (id in state.destinyTaken ? 1 : 0) : (state.perksTaken[id]?.length ?? 0);
          if (held >= rankOf(i)) continue;
          // Quick skips before asking the engine: the skill isn't there yet.
          const need = p.rankSkills?.[held] ?? p.skill ?? 0;
          if (!destiny && (state.skills[p.tree] ?? 0) < need) continue;
          (destiny ? lv.destiny : lv.perks).push(id);
          const next = at(L);
          if (next.issues.length === 0) {
            state = next;
            took = true;
            break;
          }
          (destiny ? lv.destiny : lv.perks).pop();
        }
        if (!took) break;
      }
    }
  }
  const out: BuildPlan = { ...plan, levels };
  const states = computeBuild(out, d);
  const last = states[s.to - 1];
  const first = states[0];
  const placed: Record<string, number[]> = {};
  levels.forEach((lv, i) => [...lv.perks, ...lv.destiny].forEach((id) => (placed[id] ??= []).push(i + 1)));
  const maxAtTo = d.maxSkillAt(s.to);
  const targets = s.targets.map(([skill, target]) => {
    const now = first.skills[skill] ?? 0;
    const end = last.skills[skill] ?? now;
    const reachedAt = states.find((x) => (x.skills[skill] ?? 0) >= target)?.level ?? null;
    const reason = reachedAt !== null ? `By level ${reachedAt}` : end >= maxAtTo ? `${end} at most: the max skill at level ${s.to}` : `${end} at most by level ${s.to}`;
    return { skill, target, now, end, reachedAt, reason };
  });
  const perks = s.perks.map((id, i) => {
    const level = placed[id]?.[rankOf(i) - 1] ?? null;
    return { id, level, ...(level === null ? { reason: whyNotPlaced(d, s, id, rankOf(i), last, placed) } : {}) };
  });
  return {
    plan: out,
    report: {
      health: last.health,
      magicka: last.magicka,
      stamina: last.stamina,
      targets,
      perks,
      perLevel: levels.map((lv) => lv.perks.length + lv.destiny.length),
      skillPointsLeft: last.skillPointsBanked,
      perkPointsLeft: last.perkPoints - last.perkPointsSpent,
    },
  };
}

/** Why a listed perk didn't fit by the level to reach, in the planner's words (WO-64). */
function whyNotPlaced(d: GameData, s: FillSettings, id: string, rank: number, last: LevelState, placed: Record<string, number[]>): string {
  const p = d.perkById.get(id);
  const not = `Not by level ${s.to}`;
  if (!p) return `${not}: not in this version`;
  if (p.tree !== "Destiny") {
    const need = p.rankSkills?.[rank - 1] ?? p.skill ?? 0;
    const have = last.skills[p.tree] ?? 0;
    if (have < need) {
      if (need > d.maxSkillAt(s.to)) return `${not}: needs ${p.tree} ${need}, level ${need - d.rules.maxSkillBase} at the earliest`;
      const target = s.targets.find(([sk]) => sk === p.tree)?.[1];
      if (target === undefined) return `${not}: needs ${p.tree} ${need}, and ${p.tree} has no target`;
      if (target < need) return `${not}: needs ${p.tree} ${need}, above the target`;
      return `${not}: needs ${p.tree} ${need}`;
    }
    const lvl = p.rankLevels?.[rank - 1];
    if (lvl && lvl > s.to) return `${not}: needs character level ${lvl}`;
  }
  const missing = p.requires.filter((r) => !placed[r] && !(last.perksTaken[r]?.length || r in last.destinyTaken));
  if (missing.length && (!p.anyOf || missing.length === p.requires.length))
    return `${not}: needs ${missing.map((r) => d.perkById.get(r)?.name ?? r).join(p.anyOf ? " or " : " and ")} first`;
  const clash = (p.excludes ?? []).find((x) => placed[x]);
  if (clash) return `${not}: can't be held with ${d.perkById.get(clash)?.name ?? clash}`;
  return `${not}: no ${p.tree === "Destiny" ? "Destiny" : "perk"} points left`;
}

/** How the fill spends the attribute level-ups (WO-65): a preset (one first, or evenly), or the counts themselves (WO-67). */
export type AttributeChoice = Attribute | "even" | Record<Attribute, number>;

/** Level-ups shared out evenly, Health first with any left over. */
export function evenAttributes(n: number): Record<Attribute, number> {
  const base = Math.floor(n / 3);
  const rest = n - 3 * base;
  return { health: base + (rest > 0 ? 1 : 0), magicka: base + (rest > 1 ? 1 : 0), stamina: base };
}

/** The attribute counts and order for `to - 1` level-ups. "X first": half to X, taken first; the rest to the other two in turn. */
export function attributeSettings(choice: AttributeChoice, to: number): Pick<FillSettings, "attributes" | "first"> {
  const n = to - 1;
  if (choice === "even") return { attributes: evenAttributes(n), first: "even" };
  if (typeof choice === "object") return { attributes: choice, first: mostFirst(choice) };
  const half = Math.ceil(n / 2);
  const [a, b] = ATTRIBUTE_TURN.filter((x) => x !== choice);
  const rest = n - half;
  return { attributes: { [choice]: half, [a]: Math.ceil(rest / 2), [b]: Math.floor(rest / 2) } as Record<Attribute, number>, first: choice };
}

/** The attribute with the most level-ups goes first (WO-67); with a tie for most, they go in turn from the start. */
export function mostFirst(counts: Record<Attribute, number>): Attribute | "even" {
  const top = Math.max(...ATTRIBUTE_TURN.map((a) => counts[a]));
  const at = ATTRIBUTE_TURN.filter((a) => counts[a] === top);
  return at.length === 1 ? at[0] : "even";
}

/** The counts for a new number of level-ups, keeping their shares: rounded down, the rest to the largest remainders. */
export function scaleAttributes(counts: Record<Attribute, number>, n: number): Record<Attribute, number> {
  const total = ATTRIBUTE_TURN.reduce((t, a) => t + counts[a], 0);
  if (total === 0) return evenAttributes(n);
  const exact = ATTRIBUTE_TURN.map((a) => (counts[a] * n) / total);
  const out = Object.fromEntries(ATTRIBUTE_TURN.map((a, i) => [a, Math.floor(exact[i])])) as Record<Attribute, number>;
  let left = n - ATTRIBUTE_TURN.reduce((t, a) => t + out[a], 0);
  for (const i of [0, 1, 2].sort((x, y) => exact[y] - Math.floor(exact[y]) - (exact[x] - Math.floor(exact[x])) || x - y)) if (left-- > 0) out[ATTRIBUTE_TURN[i]]++;
  return out;
}

/**
 * One more (or one fewer) level-up to `a`, keeping the total (WO-67): one more comes from the
 * other attribute with the most; one fewer goes to the other with the fewest. Null when it can't.
 */
export function shiftAttribute(counts: Record<Attribute, number>, a: Attribute, by: 1 | -1): Record<Attribute, number> | null {
  const others = ATTRIBUTE_TURN.filter((x) => x !== a);
  if (by === 1) {
    const from = others.reduce((x, y) => (counts[y] > counts[x] ? y : x));
    return counts[from] > 0 ? { ...counts, [a]: counts[a] + 1, [from]: counts[from] - 1 } : null;
  }
  if (counts[a] <= 0) return null;
  const to = others.reduce((x, y) => (counts[y] < counts[x] ? y : x));
  return { ...counts, [a]: counts[a] - 1, [to]: counts[to] + 1 };
}

/**
 * The lowest level every goal can make (WO-67): the same goals filled to the top level, as the
 * preview's "at the earliest" is, and the latest of their levels. 2 with no goals; the top level
 * when one can't be placed at all.
 */
export function goalFloor(plan: BuildPlan, goals: string[], d: GameData, top: number): number {
  if (!goals.length) return 2;
  const g = goalsToSettings(plan, goals, top, "even", d);
  if (g.clashes.length) return 2;
  const { report } = fillToLevel(plan, g.settings, d);
  return Math.max(2, ...goals.map((id) => report.perks.find((p) => p.id === id)?.level ?? top));
}

export interface GoalSettings {
  /** What fillToLevel gets. Empty perks while goals clash. */
  settings: FillSettings;
  /** Prerequisites taken without being listed: the goals' paths down to their roots. */
  along: Set<string>;
  /** For each goal, its path: the prerequisites it brings, root first (goals among them included). */
  paths: Record<string, string[]>;
  /** Goals (or what comes along) that rule each other out, with the game's reason. */
  clashes: { a: string; b: string; message: string }[];
}

const skillNeed = (d: GameData, id: string) => {
  const p = d.perkById.get(id);
  return p?.rankSkills?.[0] ?? p?.skill ?? 0;
};

/**
 * Picked perks (WO-65) as fillToLevel's settings. Each goal brings its prerequisites down to
 * the root: an "either" takes one already coming along, else the lowest skill requirement (its own
 * tree first on a tie). Perks the build already holds at level 1 aren't listed. Perks go
 * prerequisites first, then by skill requirement, low first. Targets: each tree's highest need, in
 * that order, then the majors and the minors up to the max skill so spare points go somewhere useful.
 */
export function goalsToSettings(plan: BuildPlan, goals: string[], to: number, attributes: AttributeChoice, d: GameData, setSkills: Record<string, number> = {}): GoalSettings {
  const states = computeBuild({ ...plan, levels: plan.levels.slice(0, 1) }, d);
  const held = (id: string) => {
    const st = perkStatus(d, states, 1, id);
    return st.ranksTaken > 0 || st.granted;
  };
  const chosen = new Set<string>(goals.filter((g) => d.perkById.has(g) && !held(g)));
  const paths: Record<string, string[]> = {};
  // Walk each goal's prerequisites; "either" picks are settled as the walk goes.
  const pick: Record<string, string[]> = {};
  const walk = (id: string, path: string[], seen: Set<string>) => {
    if (seen.has(id)) return;
    seen.add(id);
    const p = d.perkById.get(id);
    if (!p) return;
    let reqs = p.requires.filter((r) => d.perkById.has(r));
    if (p.anyOf && reqs.length > 1) {
      if (reqs.some(held)) reqs = [];
      else {
        const already = reqs.find((r) => chosen.has(r));
        reqs = [already ?? [...reqs].sort((a, b) => skillNeed(d, a) - skillNeed(d, b) || Number(d.perkById.get(a)!.tree !== p.tree) - Number(d.perkById.get(b)!.tree !== p.tree))[0]];
      }
    }
    pick[id] = reqs.filter((r) => !held(r));
    for (const r of pick[id]) {
      walk(r, path, seen);
      if (!path.includes(r)) path.push(r);
      chosen.add(r);
    }
  };
  for (const g of goals) {
    if (!chosen.has(g)) continue;
    const path: string[] = [];
    walk(g, path, new Set());
    paths[g] = path;
  }
  const along = new Set([...chosen].filter((id) => !goals.includes(id)));

  // Clashes: anything chosen that rules out something else chosen.
  const clashes: GoalSettings["clashes"] = [];
  for (const id of chosen) {
    const p = d.perkById.get(id)!;
    for (const x of p.excludes ?? []) {
      if (!chosen.has(x) || clashes.some((c) => c.a === x && c.b === id)) continue;
      const o = d.perkById.get(x);
      clashes.push({ a: id, b: x, message: `${p.name} can't be held with ${o && o.tree !== p.tree ? `${o.tree}: ` : ""}${o?.name ?? x}.` });
    }
  }

  // Prerequisites first, then by skill requirement, low first (ties keep the goals' order).
  const order = [...chosen];
  const perks: string[] = [];
  const placed = new Set<string>();
  while (perks.length < order.length) {
    const ready = order.filter((id) => !placed.has(id) && (pick[id] ?? []).every((r) => placed.has(r) || !chosen.has(r)));
    if (!ready.length) break;
    const next = ready.reduce((best, id) => (skillNeed(d, id) < skillNeed(d, best) ? id : best));
    perks.push(next);
    placed.add(next);
  }

  const targets: [string, number][] = [];
  for (const id of perks) {
    const p = d.perkById.get(id)!;
    if (p.tree === "Destiny" || !(p.tree in states[0].skills)) continue;
    const need = Math.max(...perks.filter((x) => d.perkById.get(x)!.tree === p.tree).map((x) => skillNeed(d, x)));
    if (need > 0 && !targets.some(([s]) => s === p.tree)) targets.push([p.tree, need]);
  }
  // Values the author set by hand (a snapshot's, WO-68) come next, never under what the perks need.
  for (const [s, v] of Object.entries(setSkills)) {
    const at = targets.find(([t]) => t === s);
    if (at) at[1] = Math.max(at[1], v);
    else targets.push([s, v]);
  }
  for (const s of [...plan.majors, ...plan.minors]) if (!targets.some(([t]) => t === s)) targets.push([s, 100]);

  return { settings: { to, targets, perks: clashes.length ? [] : perks, ...attributeSettings(attributes, to) }, along, paths, clashes };
}

/** The attribute a build's first major's school leans on: Magicka for a mage school, Stamina otherwise. */
export function defaultAttribute(plan: BuildPlan, d: GameData): Attribute {
  const g = d.skillGroups.find((x) => x.skills.includes(plan.majors[0] ?? ""));
  return g?.group === "Mage" ? "magicka" : "stamina";
}
