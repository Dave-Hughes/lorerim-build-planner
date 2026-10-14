/**
 * Read-side helpers: everything a screen needs that is derived from a plan
 * and its computed states, but isn't a rule check itself. Each takes the
 * data of the build's own LoreRim version.
 */
import { levelUps, stretchAt } from "./stretches";
import { rankCount, type GameData, type Perk } from "./data";
import { gearChanges } from "./gear";
import type { Attribute, BuildPlan, LevelPlan, LevelState } from "./types";

export const ATTRIBUTE_NAMES: Record<Attribute, string> = {
  health: "Health",
  magicka: "Magicka",
  stamina: "Stamina",
};

export function emptyLevel(): LevelPlan {
  return { skillPoints: {}, perks: [], destiny: [], extras: [], note: "" };
}

export function perkName(d: GameData, id: string): string {
  return d.perkById.get(id)?.name ?? id;
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
  books: { skill: string; count: number }[];
  note: string;
}

/** What happened at one level, for the "At level N" panel. */
export function levelChanges(d: GameData, plan: BuildPlan, states: LevelState[], level: number): LevelChanges {
  const lv = plan.levels[level - 1];
  const s = states[level - 1];
  const skills: SkillChange[] = d.skills.filter((k) => s.skills[k] !== s.skillsBefore[k]).map((k) => ({
    skill: k,
    from: s.skillsBefore[k],
    to: s.skills[k],
  }));
  const seen: Record<string, number> = {};
  const perks: PerkChange[] = lv.perks.flatMap((id) => {
    const p = d.perkById.get(id);
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
    const p = d.perkById.get(id);
    return p ? [{ id, name: p.name, text: p.text }] : [];
  });
  const trainerCounts: Record<string, number> = {};
  const bookCounts: Record<string, number> = {};
  for (const ex of lv.extras) {
    if (ex.kind === "oghma") continue;
    if (ex.kind === "trainer") trainerCounts[ex.skill] = (trainerCounts[ex.skill] ?? 0) + 1;
    else bookCounts[ex.skill] = (bookCounts[ex.skill] ?? 0) + 1;
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
    books: Object.entries(bookCounts).map(([skill, count]) => ({ skill, count })),
    note: lv.note,
  };
}

export interface LevelMark {
  level: number;
  perks: number;
  destiny: boolean;
  stone: boolean;
  skill100: boolean;
  /** The author wrote notes for this level. */
  notes: boolean;
  /** Gear changes at this level (WO-32). */
  gear: boolean;
  /** The deity changes at this level (WO-43). */
  deity: boolean;
  problems: number;
}

/** Per-level marks for the ruler and the level row. */
export function levelMarks(d: GameData, plan: BuildPlan, states: LevelState[], noted: ReadonlySet<number> = new Set()): LevelMark[] {
  return plan.levels.map((lv, i) => {
    const s = states[i];
    const skill100 = lv.perks.some((id) => {
      const p = d.perkById.get(id);
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
      notes: noted.has(i + 1),
      gear: gearChanges(plan, i + 1).length > 0,
      deity: i > 0 && s.deity !== states[i - 1].deity,
      problems: s.issues.length,
    };
  });
}

export interface PerkListGroup {
  tree: string;
  perks: { id: string; name: string; level: number; rank?: number; ranks: number; book: boolean }[];
}

/** Perks taken by a level, grouped by tree in the order the trees were first used. */
export function perksByLevel(d: GameData, plan: BuildPlan, states: LevelState[], level: number): PerkListGroup[] {
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
      const p = d.perkById.get(id);
      if (!p) continue;
      const ranks = rankCount(p);
      const before = (s.perksTaken[id] ?? []).filter((l) => l < L).length;
      seen[id] = (seen[id] ?? 0) + 1;
      add(p.tree, { id, name: p.name, level: L, rank: ranks > 1 ? before + seen[id] : undefined, ranks, book: !!p.book });
    }
    for (const id of plan.levels[L - 1].destiny) {
      const p = d.perkById.get(id);
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
  /** Requirements are met but the level has no point to spend on it (still counts as can take). */
  noPoint?: string;
}

/** Whether a perk can be taken at `level`, given the state at that level. */
export function perkStatus(d: GameData, states: LevelState[], level: number, id: string): PerkStatus {
  const p = d.perkById.get(id);
  const s = states[level - 1];
  if (!p) return { state: "locked", ranksTaken: 0, ranks: 1, takenAt: [], granted: false, reasons: ["Unknown perk."] };

  if (p.tree === "Destiny") {
    if (id in s.destinyTaken)
      return { state: "taken", ranksTaken: 1, ranks: 1, takenAt: [s.destinyTaken[id]], granted: false, reasons: [] };
    const reasons: string[] = [];
    const hasD = (x: string) => x in s.destinyTaken;
    if (p.requires.length && !(p.anyOf ? p.requires.some(hasD) : p.requires.every(hasD)))
      reasons.push(`Needs ${p.requires.map((x) => perkName(d, x)).join(p.anyOf ? " or " : " and ")} first.`);
    let noPoint: string | undefined;
    if (s.destinyPoints - s.destinyPointsSpent < 1) {
      const next = d.rules.destinyPointLevels.find((l) => l > level);
      noPoint = next ? `No Destiny point to spend. The next one comes at level ${next}.` : "No Destiny point to spend.";
    }
    return { state: reasons.length ? "locked" : "open", ranksTaken: 0, ranks: 1, takenAt: [], granted: false, reasons, noPoint };
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
  const has = (x: string) => (s.perksTaken[x]?.length ?? 0) > 0 || (!!s.grantedTree && d.perkById.get(x)?.tree === s.grantedTree);
  if (p.requires.length && !(p.anyOf ? p.requires.some(has) : p.requires.every(has)))
    reasons.push(
      `Needs ${p.requires.map((r) => (d.perkById.get(r)?.tree === p.tree ? perkName(d, r) : `${d.perkById.get(r)?.tree}: ${perkName(d, r)}`)).join(p.anyOf ? " or " : " and ")} first.`,
    );
  const held = (p.excludes ?? []).filter(has);
  if (held.length) reasons.push(`Can't be held with ${held.map((x) => `${d.perkById.get(x)?.tree}: ${perkName(d, x)}`).join(" or ")}.`);
  // Requirements met is "can take" whatever the points; the missing point is said separately.
  const noPoint = !p.book && s.perkPoints - s.perkPointsSpent < 1 ? "No perk point to spend at this level." : undefined;

  let openedThisLevel: string | undefined;
  if (!reasons.length) {
    const before = s.skillsBefore[p.tree];
    if (before < skillNeeded && s.skills[p.tree] >= skillNeeded)
      openedThisLevel = `Opened this level: raising ${p.tree} from ${before} to ${s.skills[p.tree]} met its requirement.`;
    else {
      const prevState = states[level - 2];
      const hadBefore = (x: string) => !!prevState && (prevState.perksTaken[x]?.length ?? 0) > 0;
      const newPre = p.requires.find((x) => has(x) && !hadBefore(x) && (s.perksTaken[x] ?? []).includes(level));
      if (newPre) openedThisLevel = `Opened this level: ${perkName(d, newPre)} was taken.`;
    }
  }
  return { state: reasons.length ? "locked" : "open", ranksTaken: k, ranks, takenAt, granted: false, reasons, openedThisLevel, noPoint };
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
  /** The most it may rise here: +5, or +5 a level over a stretch (WO-69). */
  limit: number;
}

export function skillStepInfo(d: GameData, plan: BuildPlan, states: LevelState[], level: number): SkillStepInfo[] {
  const lv = plan.levels[level - 1];
  const s = states[level - 1];
  const left = s.skillPointsAvailable - s.skillPointsSpent;
  // Over a stretch (WO-69), +5 for each of its level-ups.
  const limit = d.rules.maxRaisePerSkillPerLevel * Math.max(1, levelUps(stretchAt(plan, level)));
  return d.skills.map((skill) => {
    const added = lv.skillPoints[skill] ?? 0;
    const from = s.skillsBefore[skill];
    const to = from + added;
    const granted = s.grantedTree === skill;
    const atMax = to >= s.maxSkill || granted;
    const atFive = added >= limit;
    const nextCost = atMax || atFive ? null : d.skillPointCost(to);
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
      limit,
    };
  });
}

/** Text for the standing stone select: what the level's choice means. */
export function stoneLabel(d: GameData, name: string): string {
  const st = d.stoneByName.get(name);
  // The game's sentence, in brackets without its closing full stop.
  return st ? (st.fromRecords && st.text ? `The ${st.name} (${st.text.replace(/\.\s*$/, "")})` : `The ${st.name}`) : name;
}

export function nextDestinyLevel(d: GameData, level: number): number | null {
  return d.rules.destinyPointLevels.find((l) => l > level) ?? null;
}


export interface Dependant {
  id: string;
  level: number;
}

/**
 * Perks taken at `level` or later that would lose a requirement if one rank of `id` were
 * removed from `level`, directly or through each other. Picks already broken are left out.
 */
export function dependants(d: GameData, plan: BuildPlan, states: LevelState[], level: number, id: string): Dependant[] {
  const walk = (remove: boolean) => {
    const lost: Dependant[] = [];
    const count: Record<string, number> = {};
    plan.levels.forEach((lv, i) => {
      const L = i + 1;
      let picks = [...lv.perks, ...lv.destiny];
      if (remove && L === level) {
        const at = picks.lastIndexOf(id);
        picks = picks.filter((_, j) => j !== at);
      }
      const grantedTree = states[i]?.grantedTree;
      const has = (x: string) => (count[x] ?? 0) > 0 || (!!grantedTree && d.perkById.get(x)?.tree === grantedTree);
      const needsMet = (x: string) => {
        const p = d.perkById.get(x);
        return !p || !p.requires.length || (p.anyOf ? p.requires.some(has) : p.requires.every(has));
      };
      // A level's own picks count for each other; drop the ones left without a need until none are.
      let kept = picks;
      for (;;) {
        for (const x of kept) count[x] = (count[x] ?? 0) + 1;
        const failing = L >= level ? kept.filter((x) => !needsMet(x)) : [];
        if (!failing.length) break;
        for (const x of kept) count[x]--;
        kept = kept.filter((x) => !failing.includes(x));
        for (const x of new Set(failing)) lost.push({ id: x, level: L });
      }
    });
    return lost;
  };
  const before = new Set(walk(false).map((x) => `${x.id}@${x.level}`));
  return walk(true).filter((x) => !before.has(`${x.id}@${x.level}`));
}

/** True when `line` says nothing `text` doesn't: its numbers and longer words are all in the text. */
export function saysNothingNew(line: string, text: string): boolean {
  if (!line || !text) return !line;
  const t = text.toLowerCase();
  const nums = line.match(/\d+(\.\d+)?/g) ?? [];
  const words = (line.toLowerCase().match(/[a-z]{4,}/g) ?? []).map((w) => w.replace(/s$/, ""));
  return nums.every((n) => new RegExp(`(^|[^\\d])${n.replace(".", "\\.")}([^\\d]|$)`).test(t)) && words.every((w) => t.includes(w));
}

/** What the standing stone in effect adds to an attribute ("incl. The Warrior +25"), or null. */
export function stoneShare(d: GameData, stone: string, attr: Attribute): string | null {
  const st = stone ? d.stoneByName.get(stone) : undefined;
  const n = st?.[attr] ?? 0;
  return st && n ? `incl. The ${st.name} ${n > 0 ? "+" : ""}${n}` : null;
}

/** What a level changed, in the order the game asks: shared by the level card, the pinned bar's chips and the editor. */
export function levelFacts(d: GameData, plan: BuildPlan, states: LevelState[], level: number) {
  const lv = plan.levels[level - 1];
  const s = states[level - 1];
  const changes = levelChanges(d, plan, states, level);
  // Skill points: biggest gain first.
  const raised = Object.entries(lv.skillPoints)
    .filter(([, n]) => n > 0)
    .map(([sk, n]) => ({ sk, from: s.skillsBefore[sk], to: s.skillsBefore[sk] + n, n }))
    .sort((a, b) => b.n - a.n || b.to - a.to || a.sk.localeCompare(b.sk));
  // Trainers and books, replayed in order from where the skill points left each skill.
  const perBook = plan.traits.includes("Skilled") ? 2 : 1;
  const at: Record<string, number> = Object.fromEntries(raised.map((x) => [x.sk, x.to]));
  const cur = (sk: string) => at[sk] ?? s.skillsBefore[sk];
  const extras: Record<"trainer" | "book", Map<string, { from: number; to: number; n: number }>> = { trainer: new Map(), book: new Map() };
  // The Oghma Infinium (WO-44), the first reading only: +5 each, up to 100, and 3 perk points.
  let oghma: { skills: { sk: string; from: number; to: number; n: number }[]; perkPoints: number } | null = null;
  const firstOghma = plan.levels.findIndex((l) => l.extras.some((x) => x.kind === "oghma")) + 1;
  for (const ex of lv.extras) {
    if (ex.kind === "oghma") {
      if (firstOghma !== level || oghma) continue;
      oghma = {
        skills: [...new Set(ex.skills)]
          .filter((sk) => sk in s.skills)
          .map((sk) => {
            const from = cur(sk);
            const to = Math.min(100, from + 5);
            at[sk] = to;
            return { sk, from, to, n: to - from };
          }),
        perkPoints: 3,
      };
      continue;
    }
    if (!(ex.skill in s.skills)) continue;
    const from = cur(ex.skill);
    const to = ex.kind === "trainer" ? from + 1 : Math.min(s.maxSkill, from + perBook);
    at[ex.skill] = to;
    const m = extras[ex.kind];
    const line = m.get(ex.skill);
    if (line) Object.assign(line, { to, n: line.n + (to - from) });
    else m.set(ex.skill, { from, to, n: to - from });
  }
  // The stone, when it changes.
  const prevStone = level > 1 ? states[level - 2].stone : "";
  const stone = lv.stone && (lv.stone === "none" ? prevStone : lv.stone !== prevStone) ? { name: lv.stone, prev: prevStone } : null;
  // The deity, when it changes (WO-43).
  const prevDeity = level > 1 ? states[level - 2].deity : plan.deity;
  const deity = level > 1 && s.deity !== prevDeity ? { name: s.deity, prev: prevDeity } : null;
  return {
    attribute: level > 1 ? lv.attribute : undefined,
    raised,
    capAt: raised.findIndex((x) => x.to >= s.maxSkill),
    extras,
    oghma,
    perks: changes.perks,
    destiny: changes.destiny,
    stone,
    deity,
    gear: gearChanges(plan, level),
    banked: changes.banked,
  };
}

/** Where the build changes deity (WO-43), in level order: "Changes to The Magna-Ge at level 3". */
export function deityChanges(plan: BuildPlan): { level: number; name: string; prev: string }[] {
  const out: { level: number; name: string; prev: string }[] = [];
  let current = plan.deity;
  plan.levels.forEach((lv, i) => {
    if (i > 0 && lv.deity && lv.deity !== current) {
      out.push({ level: i + 1, name: lv.deity, prev: current });
      current = lv.deity;
    }
  });
  return out;
}

/** Every deity a build follows, the starting one first (for search). */
export function deitiesFollowed(plan: BuildPlan): string[] {
  return [...new Set([plan.deity, ...plan.levels.map((l) => l.deity ?? "")].filter(Boolean))];
}
