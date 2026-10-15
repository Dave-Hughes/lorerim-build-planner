/**
 * A saved build stores only the author's choices. Every number shown on a
 * build page (skill values, points left, Health, carry weight, problems) is
 * recomputed from these choices by `computeBuild`, so a rules fix updates
 * every build without touching the database.
 */

import type { ThemeId } from "@/lib/themes";

export type Attribute = "health" | "magicka" | "stamina";
export type GameMode = "Naaktiid" | "Konahrik";

/** Between level-ups: a trainer session, a skill book, or the Oghma Infinium (WO-44). */
export type Extra = SkillExtra | OghmaExtra;
export type SkillExtra = { kind: "trainer"; skill: string } | { kind: "book"; skill: string };
/** The Oghma Infinium, read once: +5 to six different skills (up to 100, past the max skill) and 3 perk points. */
export interface OghmaExtra {
  kind: "oghma";
  skills: string[];
}

export interface LevelPlan {
  /**
   * A level inside a stretch (WO-69): the author skipped ahead past it. It holds no choices; the
   * level after the run holds the stretch's. The last level of a build is never skipped.
   */
  skipped?: true;
  /** Attribute raised at this level-up. Not used at level 1. */
  attribute?: Attribute;
  /** On the last level of a stretch (WO-69): the level-ups to each attribute, in place of `attribute`. */
  attributes?: Partial<Record<Attribute, number>>;
  /** Skill points spent at this level-up, as +N per skill (over the whole stretch on a stretch's last level). */
  skillPoints: Record<string, number>;
  /** Perk ids taken this level ("Tree:Name"). Repeat an id for extra ranks. */
  perks: string[];
  /** Destiny perk ids taken this level. */
  destiny: string[];
  /** Trainer sessions and skill books read since the last level-up. */
  extras: Extra[];
  /** Standing stone change: undefined = keep, "none" = clear, otherwise the stone name. */
  stone?: string;
  /** Deity change (WO-43): undefined keeps the one followed; a name switches to it from this level on. */
  deity?: string;
  /** Spells learned at this level (WO-42), in the order added. `where`: the author's short line. */
  spells?: SpellRow[];
  /** Abilities the author adds here (WO-51): racial, stone, god, quest. A perk's abilities are automatic. */
  abilities?: AbilityRow[];
  /** Shouts (WO-51): how many words are known from this level. A later row for the same shout raises it. */
  shouts?: ShoutRow[];
  note: string;
}

/** An ability gained at a level: its id in powers.json, and where. */
export interface AbilityRow {
  id: string;
  where?: string;
}

/** A shout at a level: its id in powers.json, the words known from here, and where. */
export interface ShoutRow {
  id: string;
  words: 1 | 2 | 3;
  where?: string;
}

/** A spell learned at a level: its id in spells.json, and where ("Wuunferth, Windhelm"; a tier perk's name for its free picks). */
export interface SpellRow {
  id: string;
  where?: string;
}

/**
 * From `fromLevel` on, a piece of the type in `slot` is worn (WO-82: any number per type). With
 * `replaces` it takes that piece's place, or with an empty name takes it off; `replaces: ""` adds.
 * See gear.ts.
 */
export interface GearItem {
  slot: string;
  name: string;
  fromLevel: number;
  note: string;
  /** The piece this row replaces, or with an empty name takes off; "" when it adds. Unset on rows from before WO-82. */
  replaces?: string;
  /** The item picked from the game's item index (WO-23): "Skyrim.esm:012EB7". */
  itemId?: string;
  /** Made by the player (WO-45): enchanted at an Arcane Enchanter, or a staff made at a Staff Enchanter. */
  made?: MadeGear;
}

/** What a made item is: its base item, then the staff's spell or the enchantments put on it. */
export interface MadeGear {
  /** The base item's name, as picked ("Apprentice's Staff", "Glass Sword"). */
  base: string;
  /** A staff's spell: an id in spells.json. The row reads "Staff of <spell>". */
  spell?: string;
  /**
   * Up to three lines (WO-53): two need Enchantment Mastery, three Artifact Enchanter. Each is an
   * id in enchantments.json when picked from the game's list (WO-54), or the author's own words.
   */
  enchantments?: string[];
}

export interface BuildPlan {
  schema: 1;
  gameVersion: string;
  race: string;
  birthsign: string;
  mode: GameMode;
  deity: string;
  /** One of the game's starts by its name (starts.json), or "" for none chosen. */
  start: string;
  /** The start's one choice (an inn, a hold, a homeland...), when it has one and one is picked. */
  startOption?: string;
  /** A start saved before the game's list that matches none of it ("Merchant or mercenary"): Set up asks for a pick. */
  startWas?: string;
  majors: string[];
  minors: string[];
  traits: string[];
  masterOfOneSkill?: string;
  /** The choice a trait asks for in game, by trait (see trait-choices.ts). */
  traitChoices?: Record<string, string>;
  /** Where the cover image centres in the hero, in percent of its width and height. */
  coverFocus?: { x: number; y: number };
  /** The guide theme of the build's page (WO-37, src/lib/themes.ts). Absent means Ember. */
  theme?: ThemeId;
  /** The build's video guide: a YouTube video id (WO-39, src/lib/builds/youtube.ts). */
  videoId?: string;
  levels: LevelPlan[];
  /** The spells the build casts most, up to 8 ids, in the author's order (WO-42). Only spells it learns. */
  mainSpells?: string[];
  gear: GearItem[];
  notes: string;
}

export type IssueCode =
  | "attribute-missing"
  | "attribute-over"
  | "skill-over-five"
  | "skill-over-max"
  | "skill-points-over"
  | "trainer-limit"
  | "trainer-over-max"
  | "book-wasted"
  | "perk-unknown"
  | "perk-granted"
  | "perk-ranks"
  | "perk-skill"
  | "perk-level"
  | "perk-prerequisite"
  | "perk-excluded"
  | "perk-points-over"
  | "destiny-unknown"
  | "destiny-repeat"
  | "destiny-prerequisite"
  | "destiny-points-over"
  | "oghma-repeat"
  | "spell-repeat"
  | "spell-unknown"
  | "ability-repeat"
  | "ability-unknown"
  | "shout-words"
  | "enchant-perk"
  | "enchant-power"
  | "creation";

export interface Issue {
  code: IssueCode;
  message: string;
}

export interface LevelState {
  level: number;
  /** Highest a skill can be at this level: min(100, 50 + level). */
  maxSkill: number;
  skillsBefore: Record<string, number>;
  skills: Record<string, number>;
  skillPointsAvailable: number;
  skillPointsSpent: number;
  skillPointsBanked: number;
  perkPoints: number;
  perkPointsSpent: number;
  trainerSessionsUsed: number;
  stone: string;
  /** The deity followed at this level: the plan's starting one until a level changes it (WO-43). */
  deity: string;
  destinyPoints: number;
  destinyPointsSpent: number;
  health: number;
  magicka: number;
  stamina: number;
  carryWeight: number;
  /** Perk id -> levels at which each rank was taken. */
  perksTaken: Record<string, number[]>;
  /** Destiny perk id -> level taken. */
  destinyTaken: Record<string, number>;
  /** Perks granted for free by Master of One. */
  grantedTree: string | null;
  issues: Issue[];
}
