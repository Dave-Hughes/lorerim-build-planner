/**
 * The set list of build tags, by group. Migrations 0005 and 0007 (Roleplay) seed the `tag` table with exactly these;
 * a new tag needs a migration too.
 */
export const TAG_GROUPS = ["Weapons", "Armor", "Magic", "Way of play"] as const;
export type TagGroup = (typeof TAG_GROUPS)[number];

export interface Tag {
  slug: string;
  name: string;
  group: TagGroup;
}

const list: [TagGroup, string[]][] = [
  ["Weapons", ["One-Handed", "Two-Handed", "Marksman", "Shield"]],
  ["Armor", ["Heavy Armor", "Light Armor", "Unarmored"]],
  ["Magic", ["Destruction", "Conjuration", "Necromancy", "Illusion", "Alteration", "Restoration", "Spellsword"]],
  ["Way of play", ["Stealth", "Thief", "Crafter", "Shouts", "Tank", "Beginner-friendly", "Roleplay"]],
];

export const tagSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const TAGS: Tag[] = list.flatMap(([group, names]) => names.map((name) => ({ slug: tagSlug(name), name, group })));
export const TAG_BY_SLUG = new Map(TAGS.map((t) => [t.slug, t]));
export const MAX_TAGS = 5;

/**
 * Tags a build's majors suggest, offered (never added unseen) on the first save: a major whose
 * skill has a tag of the same name, plus the pairs the tag icons use: Shield for Block, Light Armor for Evasion, Stealth for
 * Sneak, Thief for Finesse, Crafter for Smithing.
 */
export function suggestedTags(majors: string[]): string[] {
  const alias: Record<string, string> = { Block: "shield", Evasion: "light-armor", Sneak: "stealth", Finesse: "thief", Smithing: "crafter" };
  const out: string[] = [];
  for (const m of majors) {
    const slug = alias[m] ?? tagSlug(m);
    if (TAG_BY_SLUG.has(slug) && !out.includes(slug)) out.push(slug);
  }
  return out.slice(0, MAX_TAGS);
}
