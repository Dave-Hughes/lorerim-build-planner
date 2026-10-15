import type { LevelState } from "./rules/types";

/**
 * Iriel's Marksman perks and the level she takes each (WO-84), as on the canvas board: a fixed
 * list, so the coming soon page needs no build in the database.
 */
export const IRIEL_MARKSMAN: readonly { id: string; at: number }[] = [
  { id: "Marksman:Ranged Combat Training", at: 1 },
  { id: "Marksman:Precise Aim", at: 2 },
  { id: "Marksman:Eagle Eye", at: 5 },
  { id: "Marksman:Piercing Shot", at: 8 },
  { id: "Marksman:Focus on the Prey", at: 9 },
  { id: "Marksman:Power Shot", at: 15 },
  { id: "Marksman:Quick Shot", at: 16 },
  { id: "Marksman:Penetrating Shot", at: 19 },
  { id: "Marksman:Lion's Arrow", at: 23 },
  { id: "Marksman:Marksman's Focus", at: 26 },
  { id: "Marksman:Three Crows", at: 28 },
  { id: "Marksman:Rapid Reload", at: 31 },
  { id: "Marksman:Ranger", at: 33 },
  { id: "Marksman:Stunning Precision", at: 35 },
  { id: "Marksman:Sniper", at: 42 },
];

export const IRIEL_LEVELS = 50;

/**
 * What the tree needs to draw her Marksman at each level: the perks taken by then, and a Marksman
 * skill that rises with the levels and is always high enough for what she has taken. Everything
 * else is plain, since only the Marksman tree is drawn.
 */
export function marksmanStates(requires: (id: string) => number): LevelState[] {
  return Array.from({ length: IRIEL_LEVELS }, (_, i) => {
    const level = i + 1;
    const taken = IRIEL_MARKSMAN.filter((p) => p.at <= level);
    const marksman = Math.min(100, Math.max(15 + 2 * level, ...taken.map((p) => requires(p.id))));
    return {
      level,
      maxSkill: Math.min(100, 50 + level),
      skillsBefore: { Marksman: marksman },
      skills: { Marksman: marksman },
      skillPointsAvailable: 0,
      skillPointsSpent: 0,
      skillPointsBanked: 0,
      perkPoints: taken.length,
      perkPointsSpent: taken.length,
      trainerSessionsUsed: 0,
      stone: "",
      deity: "",
      destinyPoints: 0,
      destinyPointsSpent: 0,
      health: 100,
      magicka: 100,
      stamina: 100,
      carryWeight: 300,
      perksTaken: Object.fromEntries(taken.map((p) => [p.id, [p.at]])),
      destinyTaken: {},
      grantedTree: null,
      issues: [],
    };
  });
}
