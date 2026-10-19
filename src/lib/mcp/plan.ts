import "server-only";
import { ZodError } from "zod";
import { emptyPlan } from "@/lib/builds/draft";
import { readPlan } from "@/lib/rules/convert";
import { parseBuildPlan } from "@/lib/builds/validate";
import { fitsSlot, type GameItem } from "@/lib/items/search";
import { emptyLevel, perkName, perkStatus } from "@/lib/rules/derive";
import { checkCreation, computeBuild } from "@/lib/rules/engine";
import { GEAR_TYPES, gearAt } from "@/lib/rules/gear";
import type { GameData } from "@/lib/rules/data";
import type { Attribute, BuildPlan, GearItem, LevelPlan, LevelState } from "@/lib/rules/types";
import { FactsError } from "./errors";
import * as names from "./names";

/**
 * Builds from plain inputs (WO-110): the planner turns an assistant's names into a plan, then checks
 * it with the editor's own code (parseBuildPlan, checkCreation, computeBuild). Nothing here holds a
 * rule of its own; it only says the editor's answers in plain words, with the level they're at.
 */

export interface CreateInput {
  name: string;
  description?: string;
  race: string;
  birthsign?: string;
  mode?: string;
  deity?: string;
  start?: string;
  startOption?: string;
  majors: string[];
  minors: string[];
  traits?: string[];
  notes?: string;
}

export interface LevelInput {
  attribute?: string;
  skillPoints?: Record<string, number>;
  perks?: string[];
  destiny?: string[];
  extras?: { kind: "trainer" | "book"; skill: string }[];
  spells?: { name: string; where?: string }[];
  stone?: string;
  deity?: string;
  note?: string;
}

export interface GearInput {
  slot: string;
  name: string;
  fromLevel: number;
  note?: string;
  replaces?: string;
}

/** A build in the same plain shape the inputs use: what get_build returns and check_progression takes. */
export interface PlainBuild extends Omit<CreateInput, "name" | "description"> {
  gameVersion?: string;
  levels: (LevelInput & { level?: number })[];
  gear?: GearInput[];
}

export interface PlannerIssue {
  /** 0 for character creation. */
  level: number;
  message: string;
}

const ATTRIBUTES: Record<string, Attribute> = { health: "health", magicka: "magicka", stamina: "stamina" };

/** Character creation from names, on the planner's blank plan (the same one New build starts from). */
export function planFromCreate(d: GameData, input: Omit<CreateInput, "name" | "description">): BuildPlan {
  const plan = emptyPlan(d.version.id);
  plan.race = names.race(d, input.race);
  if (input.birthsign) plan.birthsign = names.birthsign(d, input.birthsign);
  if (input.mode) plan.mode = names.mode(d, input.mode);
  if (input.deity) plan.deity = names.deity(d, input.deity);
  if (input.start) plan.start = names.start(d, input.start);
  if (input.startOption) {
    if (!plan.start) throw new FactsError("A start option needs a start: say which start first.");
    plan.startOption = names.startOption(d, plan.start, input.startOption);
  }
  plan.majors = input.majors.map((s) => names.skill(d, s));
  plan.minors = input.minors.map((s) => names.skill(d, s));
  plan.traits = (input.traits ?? []).map((t) => names.trait(d, t));
  plan.notes = input.notes ?? "";
  return plan;
}

/** One level's choices from names. */
export function levelFromInput(d: GameData, input: LevelInput, levelNumber: number): LevelPlan {
  const lv = emptyLevel();
  if (input.attribute) {
    const a = ATTRIBUTES[input.attribute.trim().toLowerCase()];
    if (!a) throw new FactsError(`No attribute called ${input.attribute}. Attributes are: Health, Magicka, Stamina.`);
    if (levelNumber > 1) lv.attribute = a;
  }
  for (const [skill, n] of Object.entries(input.skillPoints ?? {})) {
    if (!Number.isInteger(n) || n < 0) throw new FactsError(`Level ${levelNumber}: skill points for ${skill} must be a whole number, 0 or more.`);
    if (n) lv.skillPoints[names.skill(d, skill)] = (lv.skillPoints[names.skill(d, skill)] ?? 0) + n;
  }
  lv.perks = (input.perks ?? []).map((p) => names.perk(d, p));
  lv.destiny = (input.destiny ?? []).map((p) => names.perk(d, p.includes(":") ? p : `Destiny:${p}`));
  lv.extras = (input.extras ?? []).map((e) => {
    if (e.kind !== "trainer" && e.kind !== "book") throw new FactsError(`Level ${levelNumber}: an extra is a trainer or a book.`);
    return { kind: e.kind, skill: names.skill(d, e.skill) };
  });
  if (input.spells?.length) lv.spells = input.spells.map((s) => ({ id: names.spell(d, s.name), ...(s.where ? { where: s.where.slice(0, 120) } : {}) }));
  if (input.stone) lv.stone = names.stone(d, input.stone);
  if (input.deity) lv.deity = names.deity(d, input.deity);
  lv.note = (input.note ?? "").slice(0, 2000);
  return lv;
}

/** The gear list from names, through the gear rules: a known type, an item that fits it, a level the build has, and only replacing a piece worn then. */
export function gearFromInput(d: GameData, items: readonly GameItem[], plan: BuildPlan, rows: GearInput[]): GearItem[] {
  const out: GearItem[] = [];
  for (const [i, g] of rows.entries()) {
    const slot = (GEAR_TYPES as readonly string[]).find((t) => t.toLowerCase() === g.slot.trim().toLowerCase());
    if (!slot) throw new FactsError(`Gear ${i + 1}: no gear type called ${g.slot}. Types are: ${GEAR_TYPES.join(", ")}.`);
    if (!Number.isInteger(g.fromLevel) || g.fromLevel < 1 || g.fromLevel > plan.levels.length) throw new FactsError(`Gear ${i + 1}: fromLevel must be a level the build has, 1 to ${plan.levels.length}.`);
    let name = "";
    let itemId: string | undefined;
    if (g.name.trim()) {
      const it = names.item(items, g.name);
      if (!fitsSlot(it, slot)) throw new FactsError(`Gear ${i + 1}: ${it.name} doesn't go in ${slot}.`);
      name = it.name;
      itemId = it.id;
    }
    const row: GearItem = { slot, name, fromLevel: g.fromLevel, note: (g.note ?? "").slice(0, 300), replaces: "", ...(itemId ? { itemId } : {}) };
    if (g.replaces) {
      const worn = gearAt({ ...plan, gear: out }, g.fromLevel).filter((h) => h.slot === slot);
      const hit = worn.find((h) => h.name.toLowerCase() === g.replaces!.trim().toLowerCase());
      if (!hit) throw new FactsError(`Gear ${i + 1}: nothing called ${g.replaces} is worn as ${slot} at level ${g.fromLevel}${worn.length ? `. Worn there: ${worn.map((h) => h.name).join(", ")}` : ""}.`);
      row.replaces = hit.name;
    } else if (!name) throw new FactsError(`Gear ${i + 1}: give a name, or say which piece it replaces to take one off.`);
    out.push(row);
  }
  return out;
}

/** "skills.0: Unknown skill" from a ZodError, else its message. */
function zodLine(e: unknown): string {
  const issue = e instanceof ZodError ? e.issues[0] : undefined;
  if (issue) return `${issue.path.join(".") || "the build"}: ${issue.message}`;
  return e instanceof Error ? e.message : "the build doesn't pass the planner's checks";
}

/** Every issue the editor finds in a plan, with its level (0 for character creation). */
export function issuesOf(d: GameData, plan: BuildPlan): { plan: BuildPlan; states: LevelState[]; issues: PlannerIssue[] } {
  // Character creation first, in the editor's own words ("Only 3 major skills."), before the plan's shape is checked.
  const creation = checkCreation(plan, d);
  if (creation.length) return { plan, states: [], issues: creation.map((i) => ({ level: 0, message: i.message })) };
  let parsed: BuildPlan;
  try {
    parsed = parseBuildPlan(plan);
  } catch (e) {
    return { plan, states: [], issues: [{ level: 0, message: zodLine(e) }] };
  }
  const states = computeBuild(parsed, d);
  const issues = states.flatMap((s) => s.issues.map((i) => ({ level: s.level, message: i.message })));
  return { plan: parsed, states, issues };
}

/** "Nothing was saved. Level 3: Needs Destruction 75. It is 10 at level 3." */
export function refusal(issues: PlannerIssue[]): FactsError {
  const lines = issues.map((i) => `${i.level === 0 ? "Character creation" : `Level ${i.level}`}: ${i.message}`);
  return new FactsError(`Nothing was saved. ${lines.join(" ")}`);
}

/** Where a build stands at a level, as the editor shows it. */
export function stateAt(d: GameData, states: LevelState[], level: number) {
  const s = states[level - 1];
  if (!s) return null;
  return {
    level: s.level,
    skills: s.skills,
    // Unspent skill points carry to the next level, as on the site ("Skill points carried over").
    skillPointsCarriedOver: s.skillPointsAvailable - s.skillPointsSpent,
    perkPointsLeft: s.perkPoints - s.perkPointsSpent,
    destinyPointsLeft: s.destinyPoints - s.destinyPointsSpent,
    health: s.health,
    magicka: s.magicka,
    stamina: s.stamina,
    carryWeight: s.carryWeight,
    perks: Object.entries(s.perksTaken).map(([id, at]) => names.perkLabel(d, id, at.length)),
  };
}

/** The perks that can be taken at a level, with their cost, as check_progression gives them. */
export function canTakeAt(d: GameData, states: LevelState[], level: number) {
  const s = states[level - 1];
  if (!s) return [];
  return d.perks
    .filter((p) => !(p.id in s.perksTaken) && !(p.id in s.destinyTaken))
    .map((p) => ({ p, st: perkStatus(d, states, level, p.id) }))
    .filter(({ st }) => st.state === "open")
    .map(({ p, st }) => ({ id: p.id, tree: p.tree, name: p.name, cost: p.tree === "Destiny" ? "1 Destiny point" : p.book ? "No perk point (a book)" : "1 perk point", ...(st.noPoint ? { note: st.noPoint } : {}) }));
}

/** A plan in the plain shape the inputs use, each level with its computed state. */
export function plainOf(d: GameData, saved: BuildPlan) {
  // Old saved plans read the editor's way first: old start names and gear slots.
  const plan = readPlan(saved);
  const { states } = issuesOf(d, plan);
  const spellName = (id: string) => d.spellById.get(id)?.name ?? id;
  const title = (a?: Attribute) => (a ? a[0].toUpperCase() + a.slice(1) : undefined);
  // Each rank as the build takes it: the second time an id comes up, it's rank 2.
  const seen = new Map<string, number>();
  const ranked = (id: string) => {
    const n = (seen.get(id) ?? 0) + 1;
    seen.set(id, n);
    return names.perkLabel(d, id, n);
  };
  return {
    gameVersion: plan.gameVersion,
    race: plan.race,
    birthsign: plan.birthsign,
    mode: plan.mode,
    deity: plan.deity,
    start: plan.start,
    ...(plan.startOption ? { startOption: plan.startOption } : {}),
    majors: plan.majors,
    minors: plan.minors,
    traits: plan.traits,
    notes: plan.notes,
    levels: plan.levels.map((lv, i) => ({
      level: i + 1,
      ...(lv.attribute ? { attribute: title(lv.attribute) } : {}),
      skillPoints: lv.skillPoints,
      perks: lv.perks.map(ranked),
      destiny: lv.destiny.map((id) => perkName(d, id)),
      extras: lv.extras.filter((e) => e.kind !== "oghma"),
      spells: (lv.spells ?? []).map((s) => ({ name: spellName(s.id), ...(s.where ? { where: s.where } : {}) })),
      ...(lv.stone ? { stone: lv.stone } : {}),
      ...(lv.deity ? { deity: lv.deity } : {}),
      note: lv.note,
      state: stateAt(d, states, i + 1),
    })),
    gear: plan.gear.map((g) => ({ slot: g.slot, name: g.name, fromLevel: g.fromLevel, note: g.note, ...(g.replaces ? { replaces: g.replaces } : {}) })),
  };
}

/**
 * A plain build back to a plan: what check_progression takes now in place of the editor's JSON. Its
 * gear list is left out: gear given by name changes nothing the rules check, and a build made on the
 * site may name gear the item index doesn't have.
 */
export function planFromPlain(d: GameData, plain: PlainBuild): BuildPlan {
  const plan = planFromCreate(d, plain);
  if (!plain.levels?.length) throw new FactsError("A build has at least level 1.");
  plan.levels = plain.levels.map((lv, i) => levelFromInput(d, lv, i + 1));
  return plan;
}

/** Twenty private drafts at once, at most. */
export const DRAFT_CAP = 20;
export const draftCapRefusal = (privateDrafts: number) => (privateDrafts >= DRAFT_CAP ? `You have ${DRAFT_CAP} drafts. Publish or delete one on the site first.` : null);
