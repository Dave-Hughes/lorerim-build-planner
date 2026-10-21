import type { BuildPlan } from "@/lib/rules/types";
import { traitWithChoice } from "@/lib/rules/trait-choices";

/** Who saved, in words (WO-122): "Set up", "Levels editor", "Connector (Claude)". */
export function savedByWords(by: string, client: string | null): string {
  if (by === "setup") return "Set up";
  if (by === "levels") return "Levels editor";
  return `Connector (${client ?? "an assistant"})`;
}

const list = (xs: string[] | undefined) => (xs?.length ? xs.join(", ") : "none");
const startOf = (p: BuildPlan) => (p.start ? `${p.start}${p.startOption ? `, ${p.startOption}` : ""}` : "none");
const traitsOf = (p: BuildPlan) => list(p.traits.map((t) => (t === "Master of One" && p.masterOfOneSkill ? `${t}: ${p.masterOfOneSkill}` : traitWithChoice(t, p.traitChoices))));
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * The change between two saves, in plain words (WO-122): "Start: Pilgrim (Temple), Temple of Mara to Dragonborn",
 * "Levels: 3 to 4", "Level 2 changed". Creation's choices say both sides; levels, gear and notes say what changed.
 */
export function planChanges(before: BuildPlan, after: BuildPlan): string[] {
  const out: string[] = [];
  const both = (label: string, a: string, b: string) => a !== b && out.push(`${label}: ${a || "none"} to ${b || "none"}`);
  both("Race", before.race, after.race);
  both("Birthsign", before.birthsign, after.birthsign);
  both("Mode", before.mode, after.mode);
  both("Deity", before.deity, after.deity);
  both("Start", startOf(before), startOf(after));
  both("Majors", list(before.majors), list(after.majors));
  both("Minors", list(before.minors), list(after.minors));
  both("Traits", traitsOf(before), traitsOf(after));
  if (before.levels.length !== after.levels.length) out.push(`Levels: ${before.levels.length} to ${after.levels.length}`);
  const changed = after.levels.map((lv, i) => (i < before.levels.length && !same(lv, before.levels[i]) ? i + 1 : 0)).filter(Boolean);
  if (changed.length) out.push(`${changed.length === 1 ? "Level" : "Levels"} ${changed.join(", ")} changed`);
  if (!same(before.gear, after.gear)) out.push("Gear changed");
  if (before.notes !== after.notes) out.push("Notes changed");
  if (!same(before.mainSpells, after.mainSpells)) out.push("Main spells changed");
  if (before.gameVersion !== after.gameVersion) out.push(`LoreRim version: ${before.gameVersion} to ${after.gameVersion}`);
  return out;
}
