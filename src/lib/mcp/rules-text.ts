import { RULES_5_0_4_8, maxSkillAt, type Rules } from "@/lib/rules/constants";
import { OGHMA_PERK_POINTS, OGHMA_SKILL, OGHMA_SKILLS } from "@/lib/rules/engine";

/**
 * How points work (WO-119), from the planner's own rules, never typed by hand: the numbers the engine
 * counts with, for the style guide's section and the get_rules tool. A test holds the two together.
 */
/** Level 1 spends no skill points (WO-142 items 3 and 10): three assistants sent some and were silently ignored. */
export const LEVEL_ONE = "Level 1 has no skill points to spend; its skills come from the race and the majors.";

export function pointRules(rules: Rules = RULES_5_0_4_8) {
  const bands = rules.skillCostBands.map(([below, cost], i) => ({ from: i === 0 ? 0 : rules.skillCostBands[i - 1][0], below, cost }));
  const top = rules.skillCostBands.at(-1)![0];
  return {
    skillPointsPerLevel: rules.skillPointsPerLevel,
    levelOne: LEVEL_ONE,
    maxRaisePerSkillPerLevel: rules.maxRaisePerSkillPerLevel,
    skillPointCost: [...bands, { from: top, below: rules.skillCeiling, cost: rules.skillCostTop }],
    maxSkill: { base: rules.maxSkillBase, ceiling: rules.skillCeiling, rule: `${rules.maxSkillBase} plus the level, up to ${rules.skillCeiling}`, atLevel10: maxSkillAt(rules, 10) },
    perkPoints: {
      atStart: rules.startingPerkPoints,
      naaktiidExtra: rules.naaktiidBonusPerkPoints,
      masterOfDestinyExtra: rules.masterOfDestinyPerkPoints,
      perLevel: 1,
      skilled: "Skilled: none on levels divisible by 5",
      masterOfOne: "Master of One: none from levels",
      oghmaInfinium: `the Oghma Infinium: ${OGHMA_PERK_POINTS} more, and +${OGHMA_SKILL} to each of ${OGHMA_SKILLS} skills`,
    },
    destinyPoints: { atStart: rules.startingDestinyPoints, atLevels: [...rules.destinyPointLevels] },
    attributePointsPerLevel: rules.attributePerLevel,
    trainerSessionsPerLevel: rules.trainerSessionsPerLevel,
  };
}

/** The style guide's How points work, in plain words, from pointRules. */
export function howPointsWork(rules: Rules = RULES_5_0_4_8): string {
  const r = pointRules(rules);
  const costs = r.skillPointCost.map((b) => `${b.cost} below ${b.below}`).join(", ").replace(/, ([^,]+)$/, ", and $1");
  const p = r.perkPoints;
  return [
    "## How points work",
    "",
    "The planner's own rules, the numbers its checks count with.",
    "",
    `- **Skill points:** ${r.skillPointsPerLevel} a level, from level 2. ${r.levelOne} Points not spent carry over to the next level.`,
    `- **A skill rises at most ${r.maxRaisePerSkillPerLevel}** in one level.`,
    `- **What a point costs:** to raise a skill by 1 costs ${costs} (by the skill's value before the raise).`,
    `- **Max skill at a level:** ${r.maxSkill.rule} (at level 10, ${r.maxSkill.atLevel10}).`,
    `- **Perk points:** ${p.atStart} at the start, ${p.naaktiidExtra} more in Naaktiid, ${p.masterOfDestinyExtra} more with Master of Destiny, then ${p.perLevel} a level. ${p.skilled}; ${p.masterOfOne}; ${p.oghmaInfinium}.`,
    `- **Destiny points:** ${r.destinyPoints.atStart} at the start, and 1 more at level${r.destinyPoints.atLevels.length === 1 ? "" : "s"} ${r.destinyPoints.atLevels.join(", ")}.`,
    `- **Attributes:** one level-up a level, +${r.attributePointsPerLevel} to Health, Magicka or Stamina.`,
    `- **Trainers:** ${r.trainerSessionsPerLevel} sessions a level, counted across the build so far.`,
  ].join("\n");
}
