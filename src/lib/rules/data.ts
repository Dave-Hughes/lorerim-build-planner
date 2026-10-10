import skillGroups from "@/data/lorerim-5.0.4.8/skills.json";
import races from "@/data/lorerim-5.0.4.8/races.json";
import birthsigns from "@/data/lorerim-5.0.4.8/birthsigns.json";
import stones from "@/data/lorerim-5.0.4.8/stones.json";
import traits from "@/data/lorerim-5.0.4.8/traits.json";
import perks from "@/data/lorerim-5.0.4.8/perks.json";
import starts from "@/data/lorerim-5.0.4.8/starts.json";
import deities from "@/data/lorerim-5.0.4.8/deities.json";

export const GAME_VERSION = "5.0.4.8";

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
  text: string;
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
  /** Destiny perks: position in the game's wheel. */
  x?: number;
  y?: number;
}

export const SKILL_GROUPS = skillGroups as SkillGroup[];
export const SKILLS: string[] = SKILL_GROUPS.flatMap((g) => g.skills);
export const RACES = races as Race[];
export const BIRTHSIGNS = birthsigns as Birthsign[];
export const STONES = stones as Stone[];
export const TRAITS = traits as Trait[];
export const PERKS = perks as Perk[];

export const RACE_BY_NAME = new Map(RACES.map((r) => [r.name, r]));
export const SIGN_BY_NAME = new Map(BIRTHSIGNS.map((s) => [s.name, s]));
export const STONE_BY_NAME = new Map(STONES.map((s) => [s.name, s]));
export const TRAIT_BY_NAME = new Map(TRAITS.map((t) => [t.name, t]));
export const PERK_BY_ID = new Map(PERKS.map((p) => [p.id, p]));

export const PERKS_BY_TREE = PERKS.reduce<Map<string, Perk[]>>((m, p) => {
  const list = m.get(p.tree) ?? [];
  list.push(p);
  m.set(p.tree, list);
  return m;
}, new Map());

export function rankCount(p: Perk): number {
  return p.ranks;
}

/** What the game says about a perk at a given rank (0-based). */
export function perkText(p: Perk, rank = 0): { text: string; effect: string } {
  const i = Math.max(0, Math.min(rank, p.ranks - 1));
  return { text: p.rankTexts?.[i] ?? p.text ?? "", effect: p.rankEffects?.[i] ?? p.effect ?? "" };
}

/** Starts the Helgen statue offers in this LoreRim version. */
export const STARTS = starts as string[];
/** Gods offered free at the start, by race. Any god can still be joined at a shrine. */
export const STARTING_DEITIES = deities as Record<string, string[]>;

export const GAME_MODES: { name: "Naaktiid" | "Konahrik"; text: string }[] = [
  { name: "Naaktiid", text: "New to LoreRim: +3 perk points, Requiem Lite (+100 carry weight, gentler combat), free respec." },
  { name: "Konahrik", text: "Classic LoreRim: no extra points, respec once for 100,000 gold." },
];
