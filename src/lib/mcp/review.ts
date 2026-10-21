import type { GameData } from "@/lib/rules/data";
import type { BuildPlan, LevelState } from "@/lib/rules/types";
import { canTakeAt } from "./plan";

/** One thing the rules allow but a good build wouldn't do (WO-119), as advice for the assistant. */
export interface Warning {
  code: "skill-points-piling" | "perk-point-unspent" | "destiny-unspent";
  level: number;
  message: string;
}

/** The first level of the run of levels, ending at the last, where `on` holds throughout. */
function since(states: LevelState[], on: (s: LevelState) => boolean): number | null {
  if (!states.length || !on(states.at(-1)!)) return null;
  let i = states.length - 1;
  while (i > 0 && on(states[i - 1])) i--;
  return states[i].level;
}

const list = (xs: string[]) => (xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const plural = (n: number, one: string) => `${n} ${one}${n === 1 ? "" : "s"}`;

/**
 * reviewBuild (WO-119): what a good build wouldn't leave, from the same states the editor computes.
 * Skill points piling up past a level's worth, a perk point unspent for three levels, Destiny points
 * unspent for five. It changes nothing and refuses nothing.
 */
export function reviewBuild(d: GameData, plan: BuildPlan, states: LevelState[]): Warning[] {
  const out: Warning[] = [];
  const last = states.at(-1);
  if (!last) return out;
  const L = last.level;

  // Skill points: more than one level's worth carried over.
  const unspent = (s: LevelState) => s.skillPointsAvailable - s.skillPointsSpent;
  const left = unspent(last);
  if (left > d.rules.skillPointsPerLevel) {
    const from = since(states, (s) => unspent(s) > 0) ?? L;
    const atMax = d.skills.filter((k) => last.skills[k] >= last.maxSkill);
    // The skills it's about first, then the trees its perks are in.
    const trees = Object.keys(last.perksTaken).map((id) => d.perkById.get(id)?.tree).filter((t): t is string => !!t && t !== "Destiny");
    const room = [...new Set([...plan.majors, ...plan.minors, ...trees])].filter((k) => k in last.skills && last.skills[k] < last.maxSkill).slice(0, 3);
    out.push({
      code: "skill-points-piling",
      level: L,
      message:
        `${left} skill points unspent since level ${from}.` +
        (atMax.length ? ` ${list(atMax)} ${atMax.length === 1 ? "is" : "are"} at max skill for level ${L} (${last.maxSkill});` : "") +
        (room.length ? ` ${list(room.map((k) => `${k} ${last.skills[k]}`))} can take them.` : " Spend them on the skills its perks will need."),
    });
  }

  // A perk point unspent for three levels or more, with what's open to take.
  const perkLeft = (s: LevelState) => s.perkPoints - s.perkPointsSpent;
  const perkFrom = since(states, (s) => perkLeft(s) > 0);
  if (perkFrom !== null && L - perkFrom >= 3) {
    const skills = new Set([...plan.majors, ...plan.minors]);
    const open = canTakeAt(d, states, L)
      .filter((p) => p.tree !== "Destiny" && skills.has(p.tree) && p.cost === "1 perk point")
      .slice(0, 5)
      .map((p) => p.name);
    out.push({
      code: "perk-point-unspent",
      level: L,
      message: `${plural(perkLeft(last), "perk point")} unspent since level ${perkFrom}.` + (open.length ? ` Open at level ${L} in its skills: ${list(open)}.` : ""),
    });
  }

  // Destiny points unspent for five levels or more.
  const destinyLeft = (s: LevelState) => s.destinyPoints - s.destinyPointsSpent;
  const destinyFrom = since(states, (s) => destinyLeft(s) > 0);
  if (destinyFrom !== null && L - destinyFrom >= 5)
    out.push({ code: "destiny-unspent", level: L, message: `${plural(destinyLeft(last), "Destiny point")} unspent since level ${destinyFrom}. Spend them as they come (get_tree with "Destiny").` });

  return out;
}
