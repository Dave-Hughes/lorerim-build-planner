/**
 * LoreRim 5.0.4.8 progression rules. Sources and test notes live in the
 * project doc lorerim/systems/progression.md.
 */
export const RULES = {
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
  /** max skill at a level = min(skillCeiling, maxSkillBase + level) */
  maxSkillBase: 50,
  skillCeiling: 100,

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
} as const;

/** Skill points needed to raise a skill by 1 from its current value. */
export function skillPointCost(current: number): number {
  if (current < 25) return 1;
  if (current < 50) return 2;
  if (current < 75) return 3;
  return 6;
}

export function maxSkillAt(level: number): number {
  return Math.min(RULES.skillCeiling, RULES.maxSkillBase + level);
}

export function destinyPointsAt(level: number): number {
  return RULES.startingDestinyPoints + RULES.destinyPointLevels.filter((l) => l <= level).length;
}
