/**
 * Game data for one LoreRim version. Nothing here is module-level: every
 * screen and rule check asks `gameData(plan.gameVersion)` (or, in client
 * components, `useGameData()`), so a build is only ever read against the
 * version it was made for.
 */
import { destinyPointsAt, maxSkillAt, skillPointCost, type Rules } from "./constants";
import { versionInfo, versionSource, type GameVersion } from "./versions";

export interface SkillGroup {
  group: string;
  skills: string[];
}
export interface Race {
  name: string;
  primary: string;
  secondary: string[];
  health: number;
  magicka: number;
  stamina: number;
}
export interface Birthsign {
  name: string;
  text: string;
  health: number;
  magicka: number;
  stamina: number;
  carryWeight: number;
}
export interface Stone {
  name: string;
  /** Shown only when `fromRecords`: the game's own words, never a summary of ours. */
  text: string;
  fromRecords?: boolean;
  health: number;
  magicka: number;
  stamina: number;
}
export interface Trait {
  name: string;
  /** In-game description. Numbers the game highlights are wrapped in <...>. */
  text: string;
  /** The trait's in-game picture, under /public. */
  image: string | null;
  /** True when the planner's numbers account for this trait. */
  simulated: boolean;
}
export interface Perk {
  id: string;
  tree: string;
  name: string;
  requires: string[];
  /** True when any one of `requires` is enough. */
  anyOf: boolean;
  /** Perks that can't be held together with this one (Weapons Master vs Weapon Mastery). */
  excludes?: string[];
  ranks: number;
  /** Skill needed for rank 1. Destiny perks have none. */
  skill?: number;
  /** Skill needed for each rank, when the perk has ranks. */
  rankSkills?: number[];
  /** Character level needed for each rank (Special Feats). */
  rankLevels?: number[];
  /** Learned from this book instead of a perk point. */
  book?: string;
  /** Ingredients that must be carried to take the perk. */
  carryItems?: string;
  /** Quest progress needed to take the perk. */
  quest?: string;
  carryWeight?: number;
  /** In-game description (single-rank perks and Destiny). */
  text?: string;
  /** The bracketed summary that follows the description in the game, when there is one. */
  effect?: string;
  /** Per-rank description and summary for perks with ranks. */
  rankTexts?: string[];
  rankEffects?: string[];
  /** Destiny perks: added to Health, Magicka and Stamina. */
  allAttributes?: number;
  /** Where the game puts the star in its tree, in the game's units, y up. */
  pos?: [number, number];
}

/** The lines the game draws between a tree's stars. Drawing only; the rules use `requires`. */
export type TreeLink = [from: string, to: string];

export interface GameMode {
  name: "Naaktiid" | "Konahrik";
  text: string;
}

/** A version's raw data, as built from the game files plus its rules. */
export interface VersionSource {
  rules: Rules;
  skillGroups: SkillGroup[];
  races: Race[];
  birthsigns: Birthsign[];
  stones: Stone[];
  traits: Trait[];
  perks: Perk[];
  /** Starts the Helgen statue offers in this version. */
  starts: string[];
  /** Gods offered free at the start, by race. Any god can still be joined at a shrine. */
  startingDeities: Record<string, string[]>;
  gameModes: GameMode[];
  /** Per tree, the lines the game draws between its stars. */
  trees: Record<string, { links: TreeLink[] }>;
}

/** Everything the planner knows about one LoreRim version. */
export interface GameData {
  version: GameVersion;
  rules: Rules;
  skillGroups: SkillGroup[];
  skills: string[];
  races: Race[];
  birthsigns: Birthsign[];
  stones: Stone[];
  traits: Trait[];
  perks: Perk[];
  starts: string[];
  startingDeities: Record<string, string[]>;
  gameModes: GameMode[];
  raceByName: Map<string, Race>;
  signByName: Map<string, Birthsign>;
  stoneByName: Map<string, Stone>;
  traitByName: Map<string, Trait>;
  perkById: Map<string, Perk>;
  perksByTree: Map<string, Perk[]>;
  linksByTree: Map<string, TreeLink[]>;
  skillPointCost(current: number): number;
  maxSkillAt(level: number): number;
  destinyPointsAt(level: number): number;
}

function build(version: GameVersion, src: VersionSource): GameData {
  const perksByTree = src.perks.reduce<Map<string, Perk[]>>((m, p) => {
    const list = m.get(p.tree) ?? [];
    list.push(p);
    m.set(p.tree, list);
    return m;
  }, new Map());
  return {
    version,
    rules: src.rules,
    skillGroups: src.skillGroups,
    skills: src.skillGroups.flatMap((g) => g.skills),
    races: src.races,
    birthsigns: src.birthsigns,
    stones: src.stones,
    traits: src.traits,
    perks: src.perks,
    starts: src.starts,
    startingDeities: src.startingDeities,
    gameModes: src.gameModes,
    raceByName: new Map(src.races.map((r) => [r.name, r])),
    signByName: new Map(src.birthsigns.map((s) => [s.name, s])),
    stoneByName: new Map(src.stones.map((s) => [s.name, s])),
    traitByName: new Map(src.traits.map((t) => [t.name, t])),
    perkById: new Map(src.perks.map((p) => [p.id, p])),
    perksByTree,
    linksByTree: new Map(Object.entries(src.trees).map(([tree, t]) => [tree, t.links])),
    skillPointCost: (current) => skillPointCost(src.rules, current),
    maxSkillAt: (level) => maxSkillAt(src.rules, level),
    destinyPointsAt: (level) => destinyPointsAt(src.rules, level),
  };
}

const loaded = new Map<string, GameData>();

/** A version's data, loaded once. Undefined when the planner doesn't know the version. */
export function gameData(version: string): GameData | undefined {
  const hit = loaded.get(version);
  if (hit) return hit;
  const meta = versionInfo(version);
  const src = versionSource(version);
  if (!meta || !src) return undefined;
  const d = build(meta, src);
  loaded.set(version, d);
  return d;
}

/** A version's data; throws for a version the planner doesn't know. */
export function requireGameData(version: string): GameData {
  const d = gameData(version);
  if (!d) throw new Error(`LoreRim ${version} is no longer in the planner.`);
  return d;
}

export function rankCount(p: Perk): number {
  return p.ranks;
}

/** What the game says about a perk at a given rank (0-based). */
export function perkText(p: Perk, rank = 0): { text: string; effect: string } {
  const i = Math.max(0, Math.min(rank, p.ranks - 1));
  return { text: p.rankTexts?.[i] ?? p.text ?? "", effect: p.rankEffects?.[i] ?? p.effect ?? "" };
}
