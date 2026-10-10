/**
 * Progression rules, per LoreRim version: point costs and limits can change
 * between releases, so each version's data carries its own `Rules`.
 * Sources and test notes for 5.0.4.8 live in the project doc
 * lorerim/systems/progression.md.
 */
export interface Rules {
  baseSkill: number;
  racePrimaryBonus: number;
  raceSecondaryBonus: number;
  majorBonus: number;
  minorBonus: number;
  majorCount: number;
  minorCount: number;
  maxTraits: number;

  skillPointsPerLevel: number;
  maxRaisePerSkillPerLevel: number;
  /** max skill at a level = min(skillCeiling, maxSkillBase + level) */
  maxSkillBase: number;
  skillCeiling: number;
  /** Cost of +1 from a skill value: [below this value, costs this many points], lowest band first. */
  skillCostBands: readonly (readonly [number, number])[];
  /** Cost of +1 above the last band. */
  skillCostTop: number;

  startingPerkPoints: number;
  naaktiidBonusPerkPoints: number;
  masterOfDestinyPerkPoints: number;
  masterOfDestinySkillBonus: number;

  startingDestinyPoints: number;
  destinyPointLevels: readonly number[];

  attributePerLevel: number;
  trainerSessionsPerLevel: number;

  baseCarryWeight: number;
  naaktiidCarryWeight: number;
}

export const RULES_5_0_4_8: Rules = {
  baseSkill: 10,
  racePrimaryBonus: 15,
  raceSecondaryBonus: 10,
  majorBonus: 10,
  minorBonus: 5,
  majorCount: 3,
  minorCount: 6,
  maxTraits: 2,

  skillPointsPerLevel: 30,
  maxRaisePerSkillPerLevel: 5,
  maxSkillBase: 50,
  skillCeiling: 100,
  skillCostBands: [
    [25, 1],
    [50, 2],
    [75, 3],
  ],
  skillCostTop: 6,

  startingPerkPoints: 3,
  naaktiidBonusPerkPoints: 3,
  masterOfDestinyPerkPoints: 5,
  masterOfDestinySkillBonus: 5,

  startingDestinyPoints: 1,
  destinyPointLevels: [5, 10, 15, 20, 25, 30],

  attributePerLevel: 5,
  trainerSessionsPerLevel: 5,

  baseCarryWeight: 200,
  naaktiidCarryWeight: 100,
};

/** Skill points needed to raise a skill by 1 from its current value. */
export function skillPointCost(rules: Rules, current: number): number {
  for (const [below, cost] of rules.skillCostBands) if (current < below) return cost;
  return rules.skillCostTop;
}

export function maxSkillAt(rules: Rules, level: number): number {
  return Math.min(rules.skillCeiling, rules.maxSkillBase + level);
}

export function destinyPointsAt(rules: Rules, level: number): number {
  return rules.startingDestinyPoints + rules.destinyPointLevels.filter((l) => l <= level).length;
}
