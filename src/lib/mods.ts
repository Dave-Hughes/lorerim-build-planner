import { z } from "zod";

/**
 * A mod a character needs (WO-139 Part 4): one that LoreRim doesn't ship and the design depends on. Kept on a build and on
 * a playthrough, set through set_details and the edit pages, shown on both public pages. The link is optional until the
 * mod is published.
 */
export interface Mod {
  name: string;
  link?: string;
  why: string;
  need: "required" | "recommended";
}

export const MODS_LIMITS = { mods: 12, name: 80, why: 300, link: 500 } as const;

const link = z
  .string()
  .trim()
  .max(MODS_LIMITS.link)
  .refine((u) => u === "" || /^https?:\/\/[^\s"'()<>]+$/i.test(u), "A mod's link is a plain http:// or https:// address.");

export const modSchema = z.object({
  name: z.string().trim().min(1, "Give the mod a name.").max(MODS_LIMITS.name),
  link: link.optional(),
  why: z.string().trim().min(1, "Say what the character needs the mod for.").max(MODS_LIMITS.why),
  need: z.enum(["required", "recommended"]),
});
export const modsSchema = z.array(modSchema).max(MODS_LIMITS.mods, `Up to ${MODS_LIMITS.mods} mods.`);

/** A list as it is stored: empty links dropped, an empty list as null. */
export const storedMods = (mods: readonly Mod[] | null | undefined): Mod[] | null => {
  const kept = (mods ?? []).map((m) => ({ name: m.name, ...(m.link ? { link: m.link } : {}), why: m.why, need: m.need }));
  return kept.length ? kept : null;
};

/** Required first, then recommended, each in the order given; a mod named twice (build and run) once. */
export function modsInOrder(...lists: (readonly Mod[] | null | undefined)[]): { required: Mod[]; recommended: Mod[] } {
  const seen = new Set<string>();
  const all = lists.flatMap((l) => l ?? []).filter((m) => (seen.has(m.name.toLowerCase()) ? false : (seen.add(m.name.toLowerCase()), true)));
  return { required: all.filter((m) => m.need === "required"), recommended: all.filter((m) => m.need === "recommended") };
}

/**
 * A mod's own short name for a table cell (WO-177): the load order's folder names carry more than the mod's name. A trailing patch or add-on
 * note is dropped ("Trad - AE - CC - Collection - Requiem Patch"); when the folder is a bundle or a fixes mod named first and the mod that
 * adds the quest second ("Rob's Bug Fixes - Capital Whiterun Expansion", "Skyrim Extended Cut - Saints and Seducers"), the second is the name.
 * Otherwise the name is what comes before the first " - ". The full folder name stays in the cell's title.
 */
const NOTE = /(?:patch|add-?on|alternative|reduced cut|romance|voiced|quest expansion|tweaks and enhancements|esl|10th anniversary)$/i;
const BUNDLES = new Set(["Rob's Bug Fixes", "Skyrim Extended Cut", "Betalille's Hammerfell Quests Bundle"]);

export function shortModName(name: string): string {
  const parts = name.split(/\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);
  while (parts.length > 1 && NOTE.test(parts[parts.length - 1])) parts.pop();
  const pick = parts.length > 1 && BUNDLES.has(parts[0]) ? parts[1] : parts[0];
  return pick && pick.length >= 4 ? pick : name;
}
