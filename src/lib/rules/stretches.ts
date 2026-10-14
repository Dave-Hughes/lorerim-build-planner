/**
 * Skip ahead (WO-69): a stretch is a run of skipped levels and the level after it, which holds the
 * stretch's choices. A level that isn't in a stretch is a stretch of its own. `levels[L - 1]` is
 * always level L, so every lookup by level works as before.
 */
import type { BuildPlan, LevelPlan } from "./types";

export interface Stretch {
  from: number;
  to: number;
}

/** The plan's stretches in level order: level 1 alone, then each written level with the skipped ones before it. */
export function stretches(plan: Pick<BuildPlan, "levels">): Stretch[] {
  const out: Stretch[] = [];
  let from = 1;
  plan.levels.forEach((lv, i) => {
    if (lv.skipped) return;
    out.push({ from, to: i + 1 });
    from = i + 2;
  });
  return out;
}

/** The stretch holding `level` (a skipped level opens the stretch it belongs to). */
export function stretchAt(plan: Pick<BuildPlan, "levels">, level: number): Stretch {
  return stretches(plan).find((s) => level >= s.from && level <= s.to) ?? { from: level, to: level };
}

/** The level-ups a stretch holds: its levels, none for level 1. */
export function levelUps(s: Stretch): number {
  return s.from === 1 ? 0 : s.to - s.from + 1;
}

/** "11 to 25", or "10" for a single level. */
export function stretchName(s: Stretch): string {
  return s.from === s.to ? `${s.to}` : `${s.from} to ${s.to}`;
}

/** Whether the build skips ahead anywhere. */
export function skips(plan: Pick<BuildPlan, "levels">): boolean {
  return plan.levels.some((lv) => lv.skipped);
}

/**
 * "Levels 1 to 10, 25, 50": the levels written, runs of single levels collapsed. A stretch's last
 * level is never merged with single levels after it (WO-72): with 11 to 19 a stretch and 20 a single
 * level, "19 to 20" would read as two single levels, so it is "19, 20". A written level is a single
 * level when the level before it is written too (or it is level 1); otherwise it ends a stretch.
 */
export function levelsLine(written: number[]): string {
  const parts: string[] = [];
  const single = (k: number) => written[k] === 1 || (k > 0 && written[k - 1] === written[k] - 1);
  for (let i = 0; i < written.length; ) {
    let j = i;
    if (single(i)) while (j + 1 < written.length && written[j + 1] === written[j] + 1) j++;
    parts.push(j > i ? `${written[i]} to ${written[j]}` : `${written[i]}`);
    i = j + 1;
  }
  return `Levels ${parts.join(", ")}`;
}

/** The levels a plan writes: every level that isn't skipped. */
export function writtenLevels(plan: Pick<BuildPlan, "levels">): number[] {
  return plan.levels.flatMap((lv, i) => (lv.skipped ? [] : [i + 1]));
}

/** A skipped level: no choices of its own. */
export function skippedLevel(): LevelPlan {
  return { skipped: true, skillPoints: {}, perks: [], destiny: [], extras: [], note: "" };
}
