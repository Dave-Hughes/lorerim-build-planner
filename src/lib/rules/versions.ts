/**
 * The LoreRim versions the planner knows. A build keeps the version it was
 * made for and is only ever checked against that version's data.
 *
 * To add a version: extract and build its data into src/data/lorerim-<id>/
 * (README, "Game data"), add an entry below with its rules, and move
 * `current: true` to it. Exactly one version is current.
 */
import skills5048 from "@/data/lorerim-5.0.4.8/skills.json";
import races5048 from "@/data/lorerim-5.0.4.8/races.json";
import birthsigns5048 from "@/data/lorerim-5.0.4.8/birthsigns.json";
import stones5048 from "@/data/lorerim-5.0.4.8/stones.json";
import traits5048 from "@/data/lorerim-5.0.4.8/traits.json";
import perks5048 from "@/data/lorerim-5.0.4.8/perks.json";
import starts5048 from "@/data/lorerim-5.0.4.8/starts.json";
import deities5048 from "@/data/lorerim-5.0.4.8/deities.json";
import trees5048 from "@/data/lorerim-5.0.4.8/trees.json";
import deityText5048 from "@/data/lorerim-5.0.4.8/deity-text.json";
import spells5048 from "@/data/lorerim-5.0.4.8/spells.json";
import powers5048 from "@/data/lorerim-5.0.4.8/powers.json";
import { RULES_5_0_4_8 } from "./constants";
import type { Birthsign, DeityText, Perk, Powers, Race, SkillGroup, Spell, SpellPicks, Start, Stone, Trait, TreeLink, VersionSource } from "./data";

export interface GameVersion {
  /** "5.0.4.8" */
  id: string;
  /** "LoreRim 5.0.4.8" */
  label: string;
  /** Release date (YYYY-MM-DD), when known. */
  released?: string;
  current: boolean;
}

interface Entry {
  meta: GameVersion;
  source: () => VersionSource;
  /** False for versions registered at runtime (test fixtures). */
  shipped: boolean;
}

/** Oldest first. */
const registry: Entry[] = [
  {
    meta: { id: "5.0.4.8", label: "LoreRim 5.0.4.8", current: true },
    shipped: true,
    source: () => ({
      rules: RULES_5_0_4_8,
      skillGroups: skills5048 as SkillGroup[],
      races: races5048 as Race[],
      birthsigns: birthsigns5048 as Birthsign[],
      stones: stones5048 as Stone[],
      traits: traits5048 as Trait[],
      perks: perks5048 as Perk[],
      starts: starts5048 as Start[],
      deityText: deityText5048 as Record<string, DeityText>,
      startingDeities: deities5048 as Record<string, string[]>,
      trees: trees5048 as unknown as Record<string, { links: TreeLink[] }>,
      spells: spells5048 as unknown as { spells: Spell[]; spellPicks: SpellPicks },
      powers: powers5048 as unknown as Powers,
      gameModes: [
        { name: "Naaktiid", text: "New to LoreRim: +3 perk points, Requiem Lite (+100 carry weight, gentler combat), free respec." },
        { name: "Konahrik", text: "Classic LoreRim: no extra points, respec once for 100,000 gold." },
      ],
    }),
  },
];

/**
 * Adds a version that isn't shipped with the planner: the test fixtures, and on the
 * client a version whose data the server passed down. It is never current. Placed by
 * `before` (an id) or appended as the oldest.
 */
export function registerVersion(meta: Omit<GameVersion, "current">, source: VersionSource, before?: string): void {
  if (registry.some((e) => e.meta.id === meta.id)) return;
  const entry: Entry = { meta: { ...meta, current: false }, source: () => source, shipped: false };
  const i = before ? registry.findIndex((e) => e.meta.id === before) : 0;
  registry.splice(Math.max(0, i), 0, entry);
}

/** Every version the planner can check builds against, oldest first. */
export function knownVersions(): GameVersion[] {
  return registry.map((e) => e.meta);
}

/** The versions a new build can be made for. */
export function shippedVersions(): GameVersion[] {
  return registry.filter((e) => e.shipped).map((e) => e.meta);
}

export function isKnownVersion(id: string): boolean {
  return registry.some((e) => e.meta.id === id);
}

export function isShippedVersion(id: string): boolean {
  return registry.some((e) => e.meta.id === id && e.shipped);
}

export function versionInfo(id: string): GameVersion | undefined {
  return registry.find((e) => e.meta.id === id)?.meta;
}

export function currentVersion(): GameVersion {
  const current = registry.filter((e) => e.meta.current);
  if (current.length !== 1) throw new Error(`Exactly one LoreRim version must be current; found ${current.length}.`);
  return current[0].meta;
}

/** True when `id` is a known version released before the current one. */
export function isOlderThanCurrent(id: string): boolean {
  const i = registry.findIndex((e) => e.meta.id === id);
  const c = registry.findIndex((e) => e.meta.current);
  return i !== -1 && i < c;
}

/** The raw data for a version, or undefined when the planner doesn't know it. */
export function versionSource(id: string): VersionSource | undefined {
  return registry.find((e) => e.meta.id === id)?.source();
}
