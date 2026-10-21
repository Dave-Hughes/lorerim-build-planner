import "server-only";
import { and, count, desc, eq, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { buildDetailsSchema, type BuildDetails } from "@/lib/builds/validate";
import { MAX_TAGS, TAG_BY_SLUG, TAGS } from "@/lib/builds/tags";
import { insertBuild, writeDetails, writePlan } from "@/lib/builds/writes";
import { gearData } from "@/lib/gear/data";
import { ipCall, overLimit } from "@/lib/moderation/limits";
import { readPlan } from "@/lib/rules/convert";
import type { BuildPlan } from "@/lib/rules/types";
import { DEFAULT_VERSION, FactsError, versionData } from "./errors";
import * as names from "./names";
import { canTakeAt, draftCapRefusal, gearFromInput, issuesOf, levelFromInput, plainOf, planFromCreate, refusal, stateAt, type CreateInput, type GearInput, type LevelInput } from "./plan";

/**
 * The build tools (WO-110): an assistant drafts a build for the signed-in player, level by level,
 * with plain inputs. Every write goes through the editor's own checks and saves nothing when they
 * find an issue; a build is made private and marked as drafted. The assistant never publishes.
 */

export interface Player {
  userId: string;
  /** The assistant's name, as it signed in: "Claude". */
  clientName: string;
  /** The site's origin, for review links. */
  origin: string;
}

const link = (p: Player, id: string) => `${p.origin}/b/${id}`;

/** 30 writes a minute per player, then the site's own limits. */
async function writeGuard(p: Player) {
  const over = await ipCall("mcp-write", p.userId);
  if (over) throw new FactsError(over);
}

async function owned(p: Player, id: string) {
  const [row] = await db()
    .select({ id: schema.builds.id, name: schema.builds.name, description: schema.builds.description, plan: schema.builds.plan, visibility: schema.builds.visibility, draftedBy: schema.builds.draftedBy, coverImageUrl: schema.builds.coverImageUrl, writeupUrl: schema.builds.writeupUrl, updatedAt: schema.builds.updatedAt })
    .from(schema.builds)
    .where(and(eq(schema.builds.id, String(id ?? "").slice(0, 40)), eq(schema.builds.ownerId, p.userId)))
    .limit(1);
  if (!row) throw new FactsError(`No build of yours has the id ${id}. list_my_builds shows yours.`);
  return { ...row, plan: readPlan(row.plan) };
}

/** Saves a plan only when the editor finds no issue at any level; the answer is the level's state. */
async function save(p: Player, id: string, plan: BuildPlan, level: number, firstOnly = false) {
  const d = versionData(plan.gameVersion);
  const { plan: parsed, states, issues } = issuesOf(d, plan);
  if (issues.length) throw refusal(firstOnly ? issues.slice(0, 1) : issues);
  await writePlan(p.userId, id, parsed);
  revalidatePath(`/b/${id}`);
  return { build: id, link: link(p, id), levels: parsed.levels.length, level: stateAt(d, states, level), canTakeNext: canTakeAt(d, states, level) };
}

/**
 * A new build's checks for the tools, before anything is written: the write limit, the site's day
 * limit, the 20 drafts, the details and every rule at level 1. Shared by create_build and, for a
 * character with a run, create_playthrough (WO-114).
 */
export async function prepareBuild(p: Player, input: CreateInput & { version?: string }) {
  await writeGuard(p);
  const d = versionData(input.version ?? DEFAULT_VERSION);
  const stop = await overLimit(p.userId, "build");
  if (stop) throw new FactsError(stop);
  const [drafts] = await db()
    .select({ n: count() })
    .from(schema.builds)
    .where(and(eq(schema.builds.ownerId, p.userId), eq(schema.builds.visibility, "private"), isNotNull(schema.builds.draftedBy)));
  const capped = draftCapRefusal(drafts.n);
  if (capped) throw new FactsError(capped);
  const details = buildDetailsSchema.safeParse({ name: input.name, description: input.description ?? "", coverImageUrl: "", writeupUrl: "", visibility: "private", tags: null });
  if (!details.success) throw new FactsError(details.error.issues[0]?.message ?? "Check the build's name and description.");
  const { plan, states, issues } = issuesOf(d, planFromCreate(d, input));
  if (issues.length) throw refusal(issues);
  return { d, details: details.data, plan, states };
}

/** create_build: a new private build at level 1, from character creation's choices. */
export async function createBuild(p: Player, input: CreateInput & { version?: string }) {
  const { d, details, plan, states } = await prepareBuild(p, input);
  const id = await insertBuild(p.userId, details, plan, p.clientName.slice(0, 80));
  revalidatePath("/me");
  return { build: id, link: link(p, id), visibility: "private", level: stateAt(d, states, 1), canTakeNext: canTakeAt(d, states, 1) };
}

/** add_level: the next level; saved only when the whole build passes. */
export async function addLevel(p: Player, input: LevelInput & { build: string }) {
  await writeGuard(p);
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  const n = b.plan.levels.length + 1;
  const plan = { ...b.plan, levels: [...b.plan.levels, levelFromInput(d, input, n)] };
  return save(p, b.id, plan, n);
}

/** set_level: replaces one level's choices; levels after it are checked again, and the first issue stops the save. */
export async function setLevel(p: Player, input: LevelInput & { build: string; level: number }) {
  await writeGuard(p);
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  if (!Number.isInteger(input.level) || input.level < 1 || input.level > b.plan.levels.length) throw new FactsError(`The build has levels 1 to ${b.plan.levels.length}.`);
  const levels = b.plan.levels.map((lv, i) => (i === input.level - 1 ? levelFromInput(d, input, input.level) : lv));
  return save(p, b.id, { ...b.plan, levels }, input.level, true);
}

/** remove_last_level: drops the last level, never level 1. */
export async function removeLastLevel(p: Player, input: { build: string }) {
  await writeGuard(p);
  const b = await owned(p, input.build);
  if (b.plan.levels.length < 2) throw new FactsError("Level 1 stays: a build always has it.");
  const levels = b.plan.levels.slice(0, -1);
  const gear = b.plan.gear.filter((g) => g.fromLevel <= levels.length);
  return save(p, b.id, { ...b.plan, levels, gear }, levels.length);
}

/** set_gear: the build's whole gear list, through the gear rules. */
export async function setGear(p: Player, input: { build: string; gear: GearInput[] }) {
  await writeGuard(p);
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  const gear = gearFromInput(d, gearData().items, b.plan, input.gear ?? []);
  const r = await save(p, b.id, { ...b.plan, gear }, b.plan.levels.length);
  return { ...r, gear: gear.map((g) => ({ slot: g.slot, name: g.name, fromLevel: g.fromLevel, note: g.note, ...(g.replaces ? { replaces: g.replaces } : {}) })) };
}

/** set_details: name, description, notes, tags (by slug) and the main spells (by name). */
export async function setDetails(p: Player, input: { build: string; name?: string; description?: string; notes?: string; tags?: string[]; mainSpells?: string[] }) {
  await writeGuard(p);
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  if (input.tags) {
    const wrong = input.tags.filter((t) => !TAG_BY_SLUG.has(t));
    if (wrong.length) throw new FactsError(`No tag ${wrong.join(", ")}. Tags are: ${TAGS.map((t) => t.slug).join(", ")}.`);
    if (input.tags.length > MAX_TAGS) throw new FactsError(`Up to ${MAX_TAGS} tags.`);
  }
  const details: BuildDetails = { name: input.name ?? b.name, description: input.description ?? b.description, coverImageUrl: b.coverImageUrl ?? "", writeupUrl: b.writeupUrl ?? "", visibility: b.visibility, tags: input.tags ?? null };
  const ok = buildDetailsSchema.safeParse(details);
  if (!ok.success) throw new FactsError(ok.error.issues[0]?.message ?? "Check the build's details.");
  let plan = b.plan;
  if (input.notes !== undefined || input.mainSpells) {
    plan = { ...plan, ...(input.notes !== undefined ? { notes: input.notes } : {}), ...(input.mainSpells ? { mainSpells: input.mainSpells.map((s) => names.spell(d, s)) } : {}) };
    const { issues, plan: parsed } = issuesOf(d, plan);
    if (issues.length) throw refusal(issues);
    await writePlan(p.userId, b.id, parsed);
  }
  await writeDetails(p.userId, b.id, ok.data);
  revalidatePath(`/b/${b.id}`);
  revalidatePath("/me");
  return { build: b.id, link: link(p, b.id), name: ok.data.name, description: ok.data.description, tags: input.tags ?? undefined };
}

/** get_build: the plan in the plain shape, each level with its computed state. */
export async function getBuild(p: Player, input: { build: string }) {
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  return { build: b.id, name: b.name, description: b.description, visibility: b.visibility, link: link(p, b.id), draftedByAnAssistant: !!b.draftedBy, ...plainOf(d, b.plan) };
}

/** list_my_builds: the player's builds, newest first, each with its run when it has one (WO-114). */
export async function listMyBuilds(p: Player) {
  const runs = await db()
    .select({ id: schema.playthroughs.id, buildId: schema.playthroughs.buildId, name: schema.playthroughs.name })
    .from(schema.playthroughs)
    .where(and(eq(schema.playthroughs.ownerId, p.userId), isNotNull(schema.playthroughs.buildId)));
  const rows = await db()
    .select({ id: schema.builds.id, name: schema.builds.name, visibility: schema.builds.visibility, plan: schema.builds.plan, updatedAt: schema.builds.updatedAt, draftedBy: schema.builds.draftedBy })
    .from(schema.builds)
    .where(eq(schema.builds.ownerId, p.userId))
    .orderBy(desc(schema.builds.updatedAt))
    .limit(100);
  return rows.map((r) => {
    const run = runs.find((x) => x.buildId === r.id);
    return { build: r.id, name: r.name, visibility: r.visibility, levels: r.plan.levels.length, updated: r.updatedAt.toISOString(), draftedByAnAssistant: !!r.draftedBy, run: run ? { playthrough: run.id, name: run.name } : null };
  });
}

/** finish_draft: the full check once more. It changes nothing; publishing is the player's, on the site. */
export async function finishDraft(p: Player, input: { build: string }) {
  const b = await owned(p, input.build);
  const d = versionData(b.plan.gameVersion);
  const { issues } = issuesOf(d, b.plan);
  // Assistants can't add images (WO-118): the player adds a cover from this link, at the cover in Details.
  const addCover = `${p.origin}/b/${b.id}/setup?step=name#cover`;
  if (issues.length) return { ready: false, issues, addCover };
  return { ready: true, link: link(p, b.id), addCover, message: `Ready: open ${link(p, b.id)} to read it and publish. The cover is the player's to add: ${addCover}` };
}
