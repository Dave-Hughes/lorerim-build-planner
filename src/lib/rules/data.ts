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

/** A start from LoreRim's list (Alternate Perspective, New Beginnings, Adventurer's Start), in the game's words. */
export interface Start {
  name: string;
  /** The mod it comes from. */
  source: string;
  text: string;
  /** Its one choice's options, in the game's order; empty when it has none. */
  options: string[];
  /** What the choice is (Inn, Port, Hold, City, Homeland, Guild, Shrine, Temple, Helgen Keep). */
  optionLabel?: string;
  /** Where it puts the character, when the data names it (WO-114): Act I's place. */
  place?: string;
  /** Its own quest, when the data names it (WO-114): Act I's first objective, done when the save shows it. */
  quest?: { edid: string; name: string; xp?: number };
}

/** A deity's Wintersun text: the follower and devotee boons and the tenets, each with its name. */
export type DeityText = Partial<Record<"follower" | "devotee" | "tenets", { name: string; text: string }>>;

export interface GameMode {
  name: "Naaktiid" | "Konahrik";
  text: string;
}

/** A version's raw data, as built from the game files plus its rules. */
export type SpellTier = "Novice" | "Apprentice" | "Adept" | "Expert" | "Master";

/** A spell a tome teaches (WO-41), from spells.json. The game's own name and text. */
export interface Spell {
  /** Plugin and form ID: "Skyrim.esm:01C789". */
  id: string;
  name: string;
  school: string;
  tier: SpellTier;
  cost: number | null;
  /** "Fire and forget", "Concentration"... */
  cast: string | null;
  /** The main effect's game text, numbers filled in. */
  text: string;
  /** The other effects' names, when they have text. */
  also?: string[];
  /** The tomes that teach it. */
  tomes: string[];
  /** Other records with this name, school and tier: a build that saved one of their ids finds this spell. */
  sameAs?: string[];
}

/** The tier perks' free spells: how many per perk, and each perk's pool of spell ids. */
export interface SpellPicks {
  perTier: Partial<Record<SpellTier, number>>;
  /** By tier perk id ("Destruction:Novice Destruction"). */
  pools: Record<string, string[]>;
}

/** An active ability (WO-51): a power or lesser power, from any source. The game's own name and text. */
export interface Ability {
  id: string;
  name: string;
  kind: "Power" | "Lesser power";
  text: string;
}

/** A shout (WO-51): three words in the dragon tongue, each with its meaning. */
export interface Shout {
  id: string;
  name: string;
  /** "Fus", "Ro", "Dah". */
  words: string[];
  translations: string[];
  text: string;
}

/** A race's passive (WO-55): always on, described with the race; not something you use. */
export interface RacePassive {
  id: string;
  name: string;
  text: string;
}

/** powers.json (WO-51). `fromPerks`: perk id -> the abilities that perk grants. `fromRaces` (WO-55): by race name. */
export interface Powers {
  abilities: Ability[];
  fromPerks: Record<string, string[]>;
  fromRaces?: Record<string, { powers: string[]; passives: RacePassive[] }>;
  shouts: Shout[];
}

/** An enchantment a player can learn (WO-54), from enchantments.json. The game's name and text. */
export interface Enchantment {
  id: string;
  name: string;
  on: "weapon" | "armor";
  /** The game's text with the record's (base) numbers. */
  text: string;
  /** For armour: the planner's gear slots it can go on. Empty for a weapon enchantment. */
  slots: string[];
  /** "Disenchant: Ring of Eminent Health, ... and 100 more", or "The Arcane Experimentation power". */
  learned: string;
  /** When a perk's power is the only way to learn it: those perks' ids. */
  powers?: string[];
  /** Other records with this name: a line that saved one of their ids finds this one. */
  sameAs?: string[];
}

export interface VersionSource {
  rules: Rules;
  skillGroups: SkillGroup[];
  races: Race[];
  birthsigns: Birthsign[];
  stones: Stone[];
  traits: Trait[];
  perks: Perk[];
  /** The game's starts, in its order. */
  starts: Start[];
  /** Deity text by the planner's deity names. */
  deityText: Record<string, DeityText>;
  /** Gods offered free at the start, by race. Any god can still be joined at a shrine. */
  startingDeities: Record<string, string[]>;
  gameModes: GameMode[];
  /** Per tree, the lines the game draws between its stars. */
  trees: Record<string, { links: TreeLink[] }>;
  /** Spells and the tier perks' picks (WO-41); a version without them has none. */
  spells?: { spells: Spell[]; spellPicks: SpellPicks };
  /** Abilities and shouts (WO-51); a version without them has none. */
  powers?: Powers;
  /** Enchantments a player can learn (WO-54); a version without them has none. */
  enchantments?: Enchantment[];
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
  starts: Start[];
  startByName: Map<string, Start>;
  deityText: Record<string, DeityText>;
  startingDeities: Record<string, string[]>;
  /** Every deity the planner knows, by name: all of Wintersun's (deity-text.json), and any a race is offered. */
  deities: string[];
  gameModes: GameMode[];
  raceByName: Map<string, Race>;
  signByName: Map<string, Birthsign>;
  stoneByName: Map<string, Stone>;
  traitByName: Map<string, Trait>;
  perkById: Map<string, Perk>;
  perksByTree: Map<string, Perk[]>;
  linksByTree: Map<string, TreeLink[]>;
  spells: Spell[];
  spellById: Map<string, Spell>;
  spellPicks: SpellPicks;
  abilities: Ability[];
  abilityById: Map<string, Ability>;
  /** Perk id -> the ability ids it grants. */
  abilityFromPerks: Record<string, string[]>;
  /** Race name -> its powers (automatic from level 1) and passives (WO-55). */
  abilityFromRaces: Record<string, { powers: string[]; passives: RacePassive[] }>;
  shouts: Shout[];
  shoutById: Map<string, Shout>;
  enchantments: Enchantment[];
  enchantmentById: Map<string, Enchantment>;
  skillPointCost(current: number): number;
  maxSkillAt(level: number): number;
  destinyPointsAt(level: number): number;
}

/**
 * Perks that share a name within a tree (the two Destiny stars both called Endurance) get the
 * next star on their path in brackets, so lists and labels can tell them apart:
 * "Endurance (to Thief)". The next star is the one that needs only this one, else the first.
 */
export function distinctNames(perks: Perk[]): Perk[] {
  const count = new Map<string, number>();
  for (const p of perks) count.set(`${p.tree}|${p.name}`, (count.get(`${p.tree}|${p.name}`) ?? 0) + 1);
  return perks.map((p) => {
    if ((count.get(`${p.tree}|${p.name}`) ?? 0) < 2) return p;
    const next = perks.filter((q) => q.tree === p.tree && q.requires.includes(p.id));
    const to = next.find((q) => q.requires.length === 1) ?? next[0];
    return to ? { ...p, name: `${p.name} (to ${to.name})` } : p;
  });
}

function build(version: GameVersion, src0: VersionSource): GameData {
  const src = { ...src0, perks: distinctNames(src0.perks) };
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
    startByName: new Map(src.starts.map((s) => [s.name, s])),
    deityText: src.deityText,
    startingDeities: src.startingDeities,
    deities: [...new Set([...Object.keys(src.deityText), ...Object.values(src.startingDeities).flat()])].sort((a, b) => a.replace(/^The /, "").localeCompare(b.replace(/^The /, ""))),
    gameModes: src.gameModes,
    raceByName: new Map(src.races.map((r) => [r.name, r])),
    signByName: new Map(src.birthsigns.map((s) => [s.name, s])),
    stoneByName: new Map(src.stones.map((s) => [s.name, s])),
    traitByName: new Map(src.traits.map((t) => [t.name, t])),
    perkById: new Map(src.perks.map((p) => [p.id, p])),
    perksByTree,
    linksByTree: new Map(Object.entries(src.trees).map(([tree, t]) => [tree, t.links])),
    spells: src.spells?.spells ?? [],
    spellById: new Map((src.spells?.spells ?? []).flatMap((s) => [...(s.sameAs ?? []).map((id) => [id, s] as const), [s.id, s] as const])),
    spellPicks: src.spells?.spellPicks ?? { perTier: {}, pools: {} },
    abilities: src.powers?.abilities ?? [],
    abilityById: new Map((src.powers?.abilities ?? []).map((a) => [a.id, a])),
    abilityFromPerks: src.powers?.fromPerks ?? {},
    abilityFromRaces: src.powers?.fromRaces ?? {},
    shouts: src.powers?.shouts ?? [],
    shoutById: new Map((src.powers?.shouts ?? []).map((x) => [x.id, x])),
    enchantments: src.enchantments ?? [],
    enchantmentById: new Map((src.enchantments ?? []).flatMap((e) => [...(e.sameAs ?? []).map((id) => [id, e] as const), [e.id, e] as const])),
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
