/**
 * Read-side helpers: everything a screen needs that is derived from a plan
 * and its computed states, but isn't a rule check itself.
 */
import { PERK_BY_ID, SKILLS, STONE_BY_NAME, rankCount, type Perk } from "./data";
import { RULES, destinyPointsAt, skillPointCost } from "./constants";
import type { Attribute, BuildPlan, LevelPlan, LevelState } from "./types";

export const ATTRIBUTE_NAMES: Record<Attribute, string> = {
  health: "Health",
  magicka: "Magicka",
  stamina: "Stamina",
};

export function emptyLevel(): LevelPlan {
  return { skillPoints: {}, perks: [], destiny: [], extras: [], note: "" };
}

export function perkName(id: string): string {
  return PERK_BY_ID.get(id)?.name ?? id;
}

/** "Block 25", "Level 10", "Book", or "" when there is no requirement. */
export function perkRequirementText(p: Perk, rank = 0): string {
  if (p.tree === "Destiny") return "";
  const skill = p.rankSkills ? p.rankSkills[Math.min(rank, p.rankSkills.length - 1)] : (p.skill ?? 0);
  const level = p.rankLevels?.[Math.min(rank, p.rankLevels.length - 1)];
  if (level) return `Level ${level}`;
  if (skill > 0) return `${p.tree} ${skill}`;
  return "";
}

/** A perk whose last rank needs skill 100 (the "Skill 100 perk" ruler mark). */
export function isSkill100Perk(p: Perk, rank = 0): boolean {
  const skill = p.rankSkills ? p.rankSkills[Math.min(rank, p.rankSkills.length - 1)] : (p.skill ?? 0);
  return skill >= 100;
}

export interface SkillChange {
  skill: string;
  from: number;
  to: number;
}

export interface PerkChange {
  id: string;
  name: string;
  tree: string;
  /** 1-based rank taken this level, for multi-rank perks. */
  rank?: number;
  ranks: number;
  requirement: string;
  book?: string;
}

export interface LevelChanges {
  level: number;
  attribute?: Attribute;
  skills: SkillChange[];
  perks: PerkChange[];
  destiny: { id: string; name: string; text?: string }[];
  /** New stone name, "none" when cleared, undefined when unchanged. */
  stone?: string;
  banked: number;
  trainer: { skill: string; count: number }[];
  books: string[];
  note: string;
}

/** What happened at one level, for the "Changes at level N" panel. */
export function levelChanges(plan: BuildPlan, states: LevelState[], level: number): LevelChanges {
  const lv = plan.levels[level - 1];
  const s = states[level - 1];
  const skills: SkillChange[] = SKILLS.filter((k) => s.skills[k] !== s.skillsBefore[k]).map((k) => ({
    skill: k,
    from: s.skillsBefore[k],
    to: s.skills[k],
  }));
  const seen: Record<string, number> = {};
  const perks: PerkChange[] = lv.perks.flatMap((id) => {
    const p = PERK_BY_ID.get(id);
    if (!p) return [];
    const ranks = rankCount(p);
    const before = (s.perksTaken[id] ?? []).filter((l) => l < level).length;
    seen[id] = (seen[id] ?? 0) + 1;
    const rank = before + seen[id];
    return [
      {
        id,
        name: p.name,
        tree: p.tree,
        rank: ranks > 1 ? rank : undefined,
        ranks,
        requirement: perkRequirementText(p, rank - 1),
        book: p.book,
      },
    ];
  });
  const destiny = lv.destiny.flatMap((id) => {
    const p = PERK_BY_ID.get(id);
    return p ? [{ id, name: p.name, text: p.text }] : [];
  });
  const trainerCounts: Record<string, number> = {};
  const books: string[] = [];
  for (const ex of lv.extras) {
    if (ex.kind === "trainer") trainerCounts[ex.skill] = (trainerCounts[ex.skill] ?? 0) + 1;
    else books.push(ex.skill);
  }
  return {
    level,
    attribute: level > 1 ? lv.attribute : undefined,
    skills,
    perks,
    destiny,
    stone: lv.stone || undefined,
    banked: level > 1 ? s.skillPointsBanked : 0,
    trainer: Object.entries(trainerCounts).map(([skill, count]) => ({ skill, count })),
    books,
    note: lv.note,
  };
}

export interface LevelMark {
  level: number;
  perks: number;
  destiny: boolean;
  stone: boolean;
  skill100: boolean;
  problems: number;
}

/** Per-level marks for the ruler and the level row. */
export function levelMarks(plan: BuildPlan, states: LevelState[]): LevelMark[] {
  return plan.levels.map((lv, i) => {
    const s = states[i];
    const skill100 = lv.perks.some((id) => {
      const p = PERK_BY_ID.get(id);
      if (!p) return false;
      const rank = (s.perksTaken[id] ?? []).filter((l) => l <= i + 1).length - 1;
      return isSkill100Perk(p, Math.max(0, rank));
    });
    return {
      level: i + 1,
      perks: lv.perks.length,
      destiny: lv.destiny.length > 0,
      stone: !!lv.stone,
      skill100,
      problems: s.issues.length,
    };
  });
}

export interface PerkListGroup {
  tree: string;
  perks: { id: string; name: string; level: number; rank?: number; ranks: number; book: boolean }[];
}

/** Perks taken by a level, grouped by tree in the order the trees were first used. */
export function perksByLevel(plan: BuildPlan, states: LevelState[], level: number): PerkListGroup[] {
  const s = states[level - 1];
  const groups = new Map<string, PerkListGroup>();
  const add = (tree: string, perk: PerkListGroup["perks"][number]) => {
    const g = groups.get(tree) ?? { tree, perks: [] };
    g.perks.push(perk);
    groups.set(tree, g);
  };
  for (let L = 1; L <= level; L++) {
    const seen: Record<string, number> = {};
    for (const id of plan.levels[L - 1].perks) {
      const p = PERK_BY_ID.get(id);
      if (!p) continue;
      const ranks = rankCount(p);
      const before = (s.perksTaken[id] ?? []).filter((l) => l < L).length;
      seen[id] = (seen[id] ?? 0) + 1;
      add(p.tree, { id, name: p.name, level: L, rank: ranks > 1 ? before + seen[id] : undefined, ranks, book: !!p.book });
    }
    for (const id of plan.levels[L - 1].destiny) {
      const p = PERK_BY_ID.get(id);
      if (p) add("Destiny", { id, name: p.name, level: L, ranks: 1, book: false });
    }
  }
  if (s.grantedTree) {
    const g: PerkListGroup = { tree: s.grantedTree, perks: [] };
    groups.set(s.grantedTree, g);
  }
  const out = [...groups.values()];
  const destiny = out.find((g) => g.tree === "Destiny");
  return destiny ? [...out.filter((g) => g !== destiny), destiny] : out;
}

export type PerkState = "taken" | "open" | "locked";

export interface PerkStatus {
  state: PerkState;
  /** Ranks taken by this level (all of them for a granted tree). */
  ranksTaken: number;
  ranks: number;
  /** Levels at which ranks were taken. */
  takenAt: number[];
  granted: boolean;
  /** Why it can't be taken now (empty when open or fully taken). */
  reasons: string[];
  /** Set when a requirement was met by this level's own changes. */
  openedThisLevel?: string;
}

/** Whether a perk can be taken at `level`, given the state at that level. */
export function perkStatus(states: LevelState[], level: number, id: string): PerkStatus {
  const p = PERK_BY_ID.get(id);
  const s = states[level - 1];
  if (!p) return { state: "locked", ranksTaken: 0, ranks: 1, takenAt: [], granted: false, reasons: ["Unknown perk."] };

  if (p.tree === "Destiny") {
    if (id in s.destinyTaken)
      return { state: "taken", ranksTaken: 1, ranks: 1, takenAt: [s.destinyTaken[id]], granted: false, reasons: [] };
    const reasons: string[] = [];
    const hasD = (x: string) => x in s.destinyTaken;
    if (p.requires.length && !(p.anyOf ? p.requires.some(hasD) : p.requires.every(hasD)))
      reasons.push(`Needs ${p.requires.map(perkName).join(p.anyOf ? " or " : " and ")} first.`);
    if (s.destinyPoints - s.destinyPointsSpent < 1) {
      const next = RULES.destinyPointLevels.find((l) => l > level);
      reasons.push(next ? `No Destiny point to spend. The next one comes at level ${next}.` : "No Destiny point to spend.");
    }
    return { state: reasons.length ? "locked" : "open", ranksTaken: 0, ranks: 1, takenAt: [], granted: false, reasons };
  }

  const ranks = rankCount(p);
  if (s.grantedTree === p.tree)
    return { state: "taken", ranksTaken: ranks, ranks, takenAt: [], granted: true, reasons: [] };
  const takenAt = s.perksTaken[id] ?? [];
  const k = takenAt.length;
  if (k >= ranks) return { state: "taken", ranksTaken: k, ranks, takenAt, granted: false, reasons: [] };

  const reasons: string[] = [];
  const skillNeeded = p.rankSkills ? p.rankSkills[k] : (p.skill ?? 0);
  const levelNeeded = p.rankLevels?.[k] ?? 0;
  if (s.skills[p.tree] < skillNeeded) reasons.push(`Needs ${p.tree} ${skillNeeded}. It is ${s.skills[p.tree]} at level ${level}.`);
  if (level < levelNeeded) reasons.push(`Needs level ${levelNeeded}.`);
  const has = (x: string) => (s.perksTaken[x]?.length ?? 0) > 0 || (!!s.grantedTree && PERK_BY_ID.get(x)?.tree === s.grantedTree);
  if (p.requires.length && !(p.anyOf ? p.requires.some(has) : p.requires.every(has)))
    reasons.push(
      `Needs ${p.requires.map((r) => (PERK_BY_ID.get(r)?.tree === p.tree ? perkName(r) : `${PERK_BY_ID.get(r)?.tree}: ${perkName(r)}`)).join(p.anyOf ? " or " : " and ")} first.`,
    );
  const held = (p.excludes ?? []).filter(has);
  if (held.length) reasons.push(`Can't be held with ${held.map((x) => `${PERK_BY_ID.get(x)?.tree}: ${perkName(x)}`).join(" or ")}.`);
  if (!p.book && s.perkPoints - s.perkPointsSpent < 1) reasons.push("No perk point to spend at this level.");

  let openedThisLevel: string | undefined;
  if (!reasons.length) {
    const before = s.skillsBefore[p.tree];
    if (before < skillNeeded && s.skills[p.tree] >= skillNeeded)
      openedThisLevel = `Opened this level: raising ${p.tree} from ${before} to ${s.skills[p.tree]} met its requirement.`;
    else {
      const prevState = states[level - 2];
      const hadBefore = (x: string) => !!prevState && (prevState.perksTaken[x]?.length ?? 0) > 0;
      const newPre = p.requires.find((x) => has(x) && !hadBefore(x) && (s.perksTaken[x] ?? []).includes(level));
      if (newPre) openedThisLevel = `Opened this level: ${perkName(newPre)} was taken.`;
    }
  }
  return { state: reasons.length ? "locked" : "open", ranksTaken: k, ranks, takenAt, granted: false, reasons, openedThisLevel };
}

/** Points left and limits for the skill steppers at a level-up. */
export interface SkillStepInfo {
  skill: string;
  from: number;
  added: number;
  to: number;
  /** Cost of the next +1, or null when no more can be added. */
  nextCost: number | null;
  canAdd: boolean;
  canRemove: boolean;
  atMax: boolean;
  atFive: boolean;
}

export function skillStepInfo(plan: BuildPlan, states: LevelState[], level: number): SkillStepInfo[] {
  const lv = plan.levels[level - 1];
  const s = states[level - 1];
  const left = s.skillPointsAvailable - s.skillPointsSpent;
  return SKILLS.map((skill) => {
    const added = lv.skillPoints[skill] ?? 0;
    const from = s.skillsBefore[skill];
    const to = from + added;
    const granted = s.grantedTree === skill;
    const atMax = to >= s.maxSkill || granted;
    const atFive = added >= RULES.maxRaisePerSkillPerLevel;
    const nextCost = atMax || atFive ? null : skillPointCost(to);
    return {
      skill,
      from,
      added,
      to,
      nextCost,
      canAdd: nextCost !== null && nextCost <= left,
      canRemove: added > 0,
      atMax,
      atFive,
    };
  });
}

/** Text for the standing stone select: what the level's choice means. */
export function stoneLabel(name: string): string {
  const st = STONE_BY_NAME.get(name);
  return st ? `The ${st.name} (${st.text})` : name;
}

export function nextDestinyLevel(level: number): number | null {
  return RULES.destinyPointLevels.find((l) => l > level) ?? null;
}

export { destinyPointsAt };
