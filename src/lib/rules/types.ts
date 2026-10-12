/**
 * A saved build stores only the author's choices. Every number shown on a
 * build page (skill values, points left, Health, carry weight, problems) is
 * recomputed from these choices by `computeBuild`, so a rules fix updates
 * every build without touching the database.
 */

import type { ThemeId } from "@/lib/themes";

export type Attribute = "health" | "magicka" | "stamina";
export type GameMode = "Naaktiid" | "Konahrik";

export type Extra =
  | { kind: "trainer"; skill: string }
  | { kind: "book"; skill: string };

export interface LevelPlan {
  /** Attribute raised at this level-up. Not used at level 1. */
  attribute?: Attribute;
  /** Skill points spent at this level-up, as +N per skill. */
  skillPoints: Record<string, number>;
  /** Perk ids taken this level ("Tree:Name"). Repeat an id for extra ranks. */
  perks: string[];
  /** Destiny perk ids taken this level. */
  destiny: string[];
  /** Trainer sessions and skill books read since the last level-up. */
  extras: Extra[];
  /** Standing stone change: undefined = keep, "none" = clear, otherwise the stone name. */
  stone?: string;
  note: string;
}

/**
 * From `fromLevel` on, `slot` holds `name`, until a later row for the same slot. An empty name
 * empties the slot. See gear.ts.
 */
export interface GearItem {
  slot: string;
  name: string;
  fromLevel: number;
  note: string;
  /** `Other` only: the item this row replaces, or with an empty name takes away. */
  replaces?: string;
  /** The item picked from the game's item index (WO-23): "Skyrim.esm:012EB7". */
  itemId?: string;
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
  levels: LevelPlan[];
  gear: GearItem[];
  notes: string;
}

export type IssueCode =
  | "attribute-missing"
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
