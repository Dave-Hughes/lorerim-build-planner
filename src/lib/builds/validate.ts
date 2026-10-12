import { THEME_IDS } from "@/lib/themes";
import { z } from "zod";
import { MAX_TAGS, TAG_BY_SLUG } from "./tags";
import { TRAIT_CHOICES } from "@/lib/rules/trait-choices";
import { gameData, isKnownVersion, type GameData } from "@/lib/rules/server";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";

export const MAX_LEVELS = 100;

/** The plan schema for one LoreRim version: every name and id must exist in that version. */
function planSchema(d: GameData) {
  const skillName = z.string().refine((s) => d.skills.includes(s), "Unknown skill");
  const perkId = z.string().refine((id) => d.perkById.has(id), "Unknown perk");

  const levelSchema = z.object({
    attribute: z.enum(["health", "magicka", "stamina"]).optional(),
    skillPoints: z.record(skillName, z.number().int().min(0).max(5)),
    perks: z.array(perkId).max(40),
    destiny: z.array(perkId).max(7),
    extras: z
      .array(z.object({ kind: z.enum(["trainer", "book"]), skill: skillName }))
      .max(200),
    stone: z
      .string()
      .max(40)
      .refine((s) => s === "" || s === "none" || d.stoneByName.has(s), "Unknown stone")
      .optional(),
    // Any id: one this version lacks (after a version change) shows as a problem, not a refusal.
    spells: z
      .array(z.object({ id: z.string().min(1).max(200), where: z.string().max(80).optional() }))
      .max(60)
      .optional(),
    note: z.string().max(2000),
  });

  return z.object({
    schema: z.literal(1),
    gameVersion: z.literal(d.version.id),
    race: z.string().refine((r) => d.raceByName.has(r), "Unknown race"),
    birthsign: z.string().refine((b) => b === "" || d.signByName.has(b), "Unknown birthsign"),
    mode: z.enum(["Naaktiid", "Konahrik"]),
    deity: z.string().max(80),
    start: z.string().refine((s) => s === "" || d.startByName.has(s), "Unknown start"),
    startOption: z.string().max(120).optional(),
    startWas: z.string().max(120).optional(),
    majors: z.array(skillName).max(d.rules.majorCount),
    minors: z.array(skillName).max(d.rules.minorCount),
    traits: z.array(z.string().refine((t) => d.traitByName.has(t), "Unknown trait")).max(d.rules.maxTraits),
    masterOfOneSkill: skillName.optional(),
    coverFocus: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }).optional(),
    theme: z.enum(THEME_IDS).optional(),
    mainSpells: z.array(z.string().min(1).max(200)).max(8).optional(),
    videoId: z.string().regex(/^[\w-]{11}$/, "That isn't a YouTube link.").optional(),
    traitChoices: z
      .record(z.string(), z.string().max(40))
      .refine((c) => Object.entries(c).every(([t, v]) => TRAIT_CHOICES[t]?.options.includes(v)), "Unknown trait choice")
      .optional(),
    levels: z.array(levelSchema).min(1).max(MAX_LEVELS),
    gear: z
      .array(
        z.object({
          slot: z.string().max(40),
          name: z.string().max(120),
          fromLevel: z.number().int().min(1).max(MAX_LEVELS),
          note: z.string().max(300),
          replaces: z.string().max(120).optional(),
          itemId: z.string().max(200).optional(),
        }),
      )
      .max(60),
    notes: z.string().max(6000),
  })
    .refine((p) => !p.startOption || (d.startByName.get(p.start)?.options.includes(p.startOption) ?? false), "Unknown choice for this start") satisfies z.ZodType<BuildPlan>;
}

const versionOnly = z.object({
  gameVersion: z.string().refine(isKnownVersion, "Unknown LoreRim version"),
});

export const buildVisibilitySchema = z.enum(["public", "unlisted", "private"]);
export type BuildVisibility = z.infer<typeof buildVisibilitySchema>;

const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine((u) => u === "" || /^https?:\/\/[^\s"'()<>]+$/i.test(u), "Must be a plain http:// or https:// link");

export const buildDetailsSchema = z.object({
  name: z.string().trim().min(1, "Give the build a name.").max(80),
  description: z.string().trim().max(300),
  coverImageUrl: httpUrl,
  writeupUrl: httpUrl,
  visibility: buildVisibilitySchema,
  /** Tag slugs, up to 5. Null or absent: not chosen yet (the Name step then suggests some). */
  tags: z
    .array(z.string().refine((t) => TAG_BY_SLUG.has(t), "Unknown tag"))
    .max(MAX_TAGS, `Up to ${MAX_TAGS} tags.`)
    .nullable()
    .optional(),
});
export type BuildDetails = z.infer<typeof buildDetailsSchema>;

/**
 * Checks a plan against its own LoreRim version: the version must be one the planner
 * knows, and every name and id in the plan must exist in that version. Throws a ZodError.
 */
export function parseBuildPlan(input: unknown): BuildPlan {
  const { gameVersion } = versionOnly.parse(input);
    // Old start names and gear slots are read the planner's way first, as a saved plan would be.
  const read = input && typeof input === "object" && Array.isArray((input as BuildPlan).gear) ? readPlan(input as BuildPlan) : input;
  return planSchema(gameData(gameVersion)!).parse(read) as BuildPlan;
}
