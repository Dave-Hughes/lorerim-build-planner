import { z } from "zod";
import { BIRTHSIGNS, GAME_VERSION, PERK_BY_ID, RACES, SKILLS, STONE_BY_NAME, TRAITS } from "@/lib/rules/data";
import type { BuildPlan } from "@/lib/rules/types";

export const MAX_LEVELS = 100;

const skillName = z.string().refine((s) => SKILLS.includes(s), "Unknown skill");
const perkId = z.string().refine((id) => PERK_BY_ID.has(id), "Unknown perk");

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
    .refine((s) => s === "" || s === "none" || STONE_BY_NAME.has(s), "Unknown stone")
    .optional(),
  note: z.string().max(2000),
});

export const buildPlanSchema = z.object({
  schema: z.literal(1),
  gameVersion: z.literal(GAME_VERSION),
  race: z.string().refine((r) => RACES.some((x) => x.name === r), "Unknown race"),
  birthsign: z.string().refine((b) => b === "" || BIRTHSIGNS.some((x) => x.name === b), "Unknown birthsign"),
  mode: z.enum(["Naaktiid", "Konahrik"]),
  deity: z.string().max(80),
  start: z.string().max(120),
  majors: z.array(skillName).max(3),
  minors: z.array(skillName).max(6),
  traits: z.array(z.string().refine((t) => TRAITS.some((x) => x.name === t), "Unknown trait")).max(2),
  masterOfOneSkill: skillName.optional(),
  levels: z.array(levelSchema).min(1).max(MAX_LEVELS),
  gear: z
    .array(
      z.object({
        slot: z.string().max(40),
        name: z.string().max(120),
        fromLevel: z.number().int().min(1).max(MAX_LEVELS),
        note: z.string().max(300),
      }),
    )
    .max(60),
  notes: z.string().max(6000),
}) satisfies z.ZodType<BuildPlan>;

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
});
export type BuildDetails = z.infer<typeof buildDetailsSchema>;

export function parseBuildPlan(input: unknown): BuildPlan {
  return buildPlanSchema.parse(input) as BuildPlan;
}
