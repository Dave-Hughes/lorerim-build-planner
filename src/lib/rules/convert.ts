/**
 * Moving a plan to another LoreRim version: what doesn't exist there is listed
 * and removed, never silently.
 */
import type { GameData } from "./data";
import { keptTraitChoices } from "./trait-choices";
import type { BuildPlan } from "./types";

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
    for (const s of [...Object.keys(lv.skillPoints), ...lv.extras.map((e) => e.skill)]) if (!d.skills.includes(s)) add("skill", s);
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
      extras: lv.extras.filter((e) => skill(e.skill)),
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
