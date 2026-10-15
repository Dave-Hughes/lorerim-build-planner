/**
 * Moving a plan to another LoreRim version: what doesn't exist there is listed
 * and removed, never silently.
 */
import { gameData, type GameData } from "./data";
import { gearType } from "./gear";
import { keptTraitChoices } from "./trait-choices";
import type { BuildPlan, Extra } from "./types";

export interface Dropped {
  kind: "race" | "birthsign" | "trait" | "skill" | "perk" | "Destiny perk" | "stone";
  name: string;
}

/** Everything in `plan` that `d`'s version doesn't have, each listed once. */
export function missingIn(d: GameData, plan: BuildPlan): Dropped[] {
  const out: Dropped[] = [];
  const add = (kind: Dropped["kind"], name: string) => {
    if (!out.some((x) => x.kind === kind && x.name === name)) out.push({ kind, name });
  };
  const perkName = (id: string) => id.split(":").slice(1).join(":") || id;
  if (plan.race && !d.raceByName.has(plan.race)) add("race", plan.race);
  if (plan.birthsign && !d.signByName.has(plan.birthsign)) add("birthsign", plan.birthsign);
  for (const t of plan.traits) if (!d.traitByName.has(t)) add("trait", t);
  for (const s of [...plan.majors, ...plan.minors, ...(plan.masterOfOneSkill ? [plan.masterOfOneSkill] : [])])
    if (!d.skills.includes(s)) add("skill", s);
  for (const lv of plan.levels) {
    for (const s of [...Object.keys(lv.skillPoints), ...lv.extras.flatMap((e) => (e.kind === "oghma" ? e.skills : [e.skill]))]) if (!d.skills.includes(s)) add("skill", s);
    for (const id of lv.perks) if (!d.perkById.has(id)) add("perk", perkName(id));
    for (const id of lv.destiny) if (!d.perkById.has(id)) add("Destiny perk", perkName(id));
    if (lv.stone && lv.stone !== "none" && !d.stoneByName.has(lv.stone)) add("stone", lv.stone);
  }
  return out;
}

/** `plan` moved to `d`'s version, with what didn't carry over removed and listed. */
export function convertPlan(d: GameData, plan: BuildPlan): { plan: BuildPlan; dropped: Dropped[] } {
  const skill = (s: string) => d.skills.includes(s);
  const next: BuildPlan = {
    ...plan,
    gameVersion: d.version.id,
    race: d.raceByName.has(plan.race) ? plan.race : "",
    birthsign: d.signByName.has(plan.birthsign) ? plan.birthsign : "",
    traits: plan.traits.filter((t) => d.traitByName.has(t)),
    majors: plan.majors.filter(skill),
    minors: plan.minors.filter(skill),
    masterOfOneSkill: plan.masterOfOneSkill && skill(plan.masterOfOneSkill) ? plan.masterOfOneSkill : undefined,
    levels: plan.levels.map((lv) => ({
      ...lv,
      skillPoints: Object.fromEntries(Object.entries(lv.skillPoints).filter(([s]) => skill(s))),
      perks: lv.perks.filter((id) => d.perkById.has(id)),
      destiny: lv.destiny.filter((id) => d.perkById.has(id)),
      extras: lv.extras.flatMap<Extra>((e) => (e.kind === "oghma" ? [{ ...e, skills: e.skills.filter(skill) }] : skill(e.skill) ? [e] : [])),
      stone: lv.stone && lv.stone !== "none" && !d.stoneByName.has(lv.stone) ? undefined : lv.stone,
    })),
  };
  if (!next.traits.includes("Master of One")) delete next.masterOfOneSkill;
  const choices = keptTraitChoices(next.traits, plan.traitChoices);
  if (choices) next.traitChoices = choices;
  else delete next.traitChoices;
  return { plan: next, dropped: missingIn(d, plan) };
}

/** "Not in 5.1: Bulwark (trait), Weapons Master (perk)." */
export function droppedSentence(versionId: string, dropped: Dropped[]): string {
  return `Not in ${versionId}: ${dropped.map((x) => `${x.name} (${x.kind})`).join(", ")}.`;
}

/** Starts saved before WO-29 (our own names), as the game's start and its choice. */
const OLD_STARTS: Record<string, { start: string; option?: string }> = {
  "Regular at an inn": { start: "Regular (Inn)" },
  "Arriving from overseas": { start: "From Overseas" },
  "Wanted criminal": { start: "Wanted Criminal" },
  "Left for dead": { start: "Left for Dead" },
  "The Dragonborn (Helgen Keep)": { start: "Dragonborn" },
  "Temple pilgrim": { start: "Pilgrim (Temple)" },
  "Shrine pilgrim": { start: "Pilgrim (Shrine)" },
  "Thalmor prisoner": { start: "Thalmor Prisoner" },
  "At Angi's camp": { start: "At Angis Camp" },
  "Dwemer ruin": { start: "Dwemer Ruin" },
  "Bounty hunter": { start: "Bounty Hunter" },
  "Roadside ambush": { start: "Roadside Ambush" },
  "Prisoner in a bandit fort": { start: "Prisoner in a Bandit Fort" },
  "Fell in a spike pit": { start: "Fell in a Spike Pit" },
  "Out in the wilderness": { start: "Out in the Wilderness" },
};

/**
 * A saved start as one of the game's: our old names mapped ("Guild member: Companions" is Guilds,
 * Companions). Anything else that isn't a game start (the old "Merchant or mercenary", or text typed
 * into the old free field) becomes no start, kept in `startWas` so Set up can ask for one.
 */
export function withGameStart(plan: BuildPlan, startNames: readonly string[]): BuildPlan {
  const s = plan.start ?? "";
  if (!s || startNames.includes(s)) return plan;
  const guild = /^Guild member: (.+)$/.exec(s);
  const mapped = guild ? { start: "Guilds", option: guild[1] } : OLD_STARTS[s];
  const next: BuildPlan = { ...plan };
  delete next.startOption;
  if (mapped && startNames.includes(mapped.start)) {
    next.start = mapped.start;
    if (mapped.option) next.startOption = mapped.option;
    return next;
  }
  next.start = "";
  next.startWas = s;
  return next;
}

/**
 * A saved plan with its gear in the gear types (Weapon → Main hand, Shield → Off hand, Chest →
 * Body; `Other` and anything unknown → Accessory, WO-82). Every row keeps its name, level and note.
 */
export function withGearSlots(plan: BuildPlan): BuildPlan {
  const typeOf = (g: { slot: string; replaces?: string }) => gearType(g.slot, g.replaces === undefined);
  if (plan.gear.every((g) => typeOf(g) === g.slot)) return plan;
  return { ...plan, gear: plan.gear.map((g) => ({ ...g, slot: typeOf(g) })) };
}

/** A deity typed into the old free field, matched to the planner's by letters only ("riddlethar"). */
export function withGameDeity(plan: BuildPlan, deities: readonly string[]): BuildPlan {
  if (!plan.deity || deities.includes(plan.deity)) return plan;
  const letters = (s: string) => s.toLowerCase().replace(/^the\s+/, "").replace(/[^a-z]/g, "");
  const match = deities.find((g) => letters(g) === letters(plan.deity));
  return match ? { ...plan, deity: match } : plan;
}

/**
 * A saved plan as the planner reads it: gear in the fixed slots, the start one of its version's.
 * (A version the planner no longer has keeps its start as saved.)
 */
export function readPlan(saved: BuildPlan): BuildPlan {
  // WO-68's one-level builds (staging and dev only) load as their level 1; the old field goes on the next save.
  const { snapshot: _old, ...plan } = saved as BuildPlan & { snapshot?: unknown };
  void _old;
  const d = gameData(plan.gameVersion);
  const geared = withGearSlots(plan);
  return d ? withGameDeity(withGameStart(geared, d.starts.map((s) => s.name)), d.deities) : geared;
}
