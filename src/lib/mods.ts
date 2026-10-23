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
