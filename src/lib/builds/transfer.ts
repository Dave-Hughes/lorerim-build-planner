/**
 * Moving a build between environments (WO-90): an admin exports it from one (a .lorerim-build.json
 * file) and imports it into another. The file holds the build itself, its tags and its guide; never
 * the owner, ids, likes, featured or dates. `format` lets a later change still read old files.
 * Pure: the server action (transfer-actions.ts) does the database and the images.
 */
import { z } from "zod";
import { buildDetailsSchema, buildVisibilitySchema, parseBuildPlan } from "./validate";
import { guideDocSchema, imageUrls, isGuideKey, limitFor, textLength, type GuideDoc, type GuideNode } from "@/lib/guide/doc";
import type { BuildPlan } from "@/lib/rules/types";

export const EXPORT_FORMAT = 1;

export interface BuildExport {
  format: typeof EXPORT_FORMAT;
  name: string;
  description: string;
  gameVersion: string;
  visibility: "public" | "unlisted" | "private";
  coverImageUrl: string | null;
  coverFocus: { x: number; y: number } | null;
  plan: BuildPlan;
  tags: string[];
  guides: { key: string; doc: GuideDoc; textLength: number }[];
}

/** The file for a build. */
export function exportBuild(b: {
  name: string;
  description: string;
  gameVersion: string;
  visibility: BuildExport["visibility"];
  coverImageUrl: string | null;
  plan: BuildPlan;
  tags: string[];
  guides: { key: string; doc: GuideDoc }[];
}): BuildExport {
  return {
    format: EXPORT_FORMAT,
    name: b.name,
    description: b.description,
    gameVersion: b.gameVersion,
    visibility: b.visibility,
    coverImageUrl: b.coverImageUrl,
    coverFocus: b.plan.coverFocus ?? null,
    plan: b.plan,
    tags: b.tags,
    guides: b.guides.map((g) => ({ key: g.key, doc: g.doc, textLength: textLength(g.doc) })),
  };
}

/** "Iriel Thornwhisper, Green Pact Hunter.lorerim-build.json", with nothing a file system minds. */
export function exportFileName(name: string): string {
  return `${name.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim() || "build"}.lorerim-build.json`;
}

const fileSchema = z.object({
  format: z.literal(EXPORT_FORMAT, { message: "This file isn't a LoreRim build export the planner can read." }),
  name: buildDetailsSchema.shape.name,
  description: buildDetailsSchema.shape.description,
  visibility: buildVisibilitySchema,
  coverImageUrl: z.string().max(500).regex(/^https?:\/\//, "The cover must be a web address.").nullable(),
  coverFocus: z.object({ x: z.number(), y: z.number() }).nullable().optional(),
  plan: z.unknown(),
  tags: z.array(z.string().max(60)).max(20),
  guides: z.array(z.object({ key: z.string().max(40), doc: z.unknown() })).max(200),
});

/** A ZodError's first issue, as one line: "levels.3.perks.0: Unknown perk". */
function firstIssue(e: unknown, fallback: string): string {
  const issue = e instanceof z.ZodError ? e.issues[0] : undefined;
  if (!issue) return fallback;
  return issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message;
}

export type ParsedImport = Omit<BuildExport, "format" | "gameVersion" | "coverFocus"> & { droppedTags: string[] };

/**
 * Reads an export file. The plan goes through the planner's own checks, unknown tags are dropped
 * (and listed), and each guide section is checked as a save would be. A bad file is refused with
 * the reason.
 */
export function parseImport(input: unknown, knownTags: ReadonlySet<string>): { ok: true; value: ParsedImport } | { ok: false; error: string } {
  const file = fileSchema.safeParse(input);
  if (!file.success) return { ok: false, error: `The file doesn't read as a build: ${firstIssue(file.error, "check it was exported by the planner.")}` };
  let plan: BuildPlan;
  try {
    plan = parseBuildPlan(file.data.plan);
  } catch (e) {
    return { ok: false, error: `The build's plan didn't pass validation: ${firstIssue(e, "it doesn't match the planner's rules.")}` };
  }
  const guides: ParsedImport["guides"] = [];
  for (const g of file.data.guides) {
    if (!isGuideKey(g.key)) return { ok: false, error: `Unknown guide section "${g.key}".` };
    const doc = guideDocSchema.safeParse(g.doc);
    if (!doc.success) return { ok: false, error: `The guide section "${g.key}" didn't pass validation: ${firstIssue(doc.error, "it has something the guide can't hold.")}` };
    const d = doc.data as GuideDoc;
    const length = textLength(d);
    if (length > limitFor(g.key)) return { ok: false, error: `The guide section "${g.key}" is too long.` };
    guides.push({ key: g.key, doc: d, textLength: length });
  }
  const unique = [...new Set(file.data.tags)];
  return {
    ok: true,
    value: {
      name: file.data.name,
      description: file.data.description,
      visibility: file.data.visibility,
      coverImageUrl: file.data.coverImageUrl,
      plan,
      tags: unique.filter((t) => knownTags.has(t)),
      droppedTags: unique.filter((t) => !knownTags.has(t)),
      guides,
    },
  };
}

/** Every image a parsed import shows: the cover and each guide image, once each. */
export function importImages(p: Pick<ParsedImport, "coverImageUrl" | "guides">): { cover: string | null; guide: string[] } {
  const guide = new Set<string>();
  for (const g of p.guides) imageUrls(g.doc, guide);
  return { cover: p.coverImageUrl, guide: [...guide] };
}

/**
 * Copies every image an import shows into this environment (the cover under `prefixes.cover`, guide
 * images under `prefixes.guide`) with `copy`, and says where each went: a new URL, or null when it
 * couldn't be copied.
 */
export async function moveImages(
  p: Pick<ParsedImport, "coverImageUrl" | "guides">,
  prefixes: { cover: string; guide: string },
  copy: (url: string, prefix: string) => Promise<string | null>,
): Promise<{ cover: string | null; moved: Map<string, string | null>; skipped: string[] }> {
  const images = importImages(p);
  const moved = new Map<string, string | null>();
  const cover = images.cover ? await copy(images.cover, prefixes.cover) : null;
  if (images.cover) moved.set(images.cover, cover);
  for (const url of images.guide) if (!moved.has(url)) moved.set(url, await copy(url, prefixes.guide));
  return { cover, moved, skipped: [...moved].filter(([, to]) => !to).map(([from]) => from) };
}

/**
 * A guide document with its images moved: each src found in `moved` is rewritten; one mapped to null
 * (it couldn't be copied) is taken out.
 */
export function rewriteImages(doc: GuideDoc, moved: ReadonlyMap<string, string | null>): GuideDoc {
  const walk = (n: GuideNode): GuideNode | null => {
    if (n.type === "image" && typeof n.attrs?.src === "string" && moved.has(n.attrs.src)) {
      const to = moved.get(n.attrs.src);
      return to ? { ...n, attrs: { ...n.attrs, src: to } } : null;
    }
    return n.content ? { ...n, content: n.content.map(walk).filter((c): c is GuideNode => c !== null) } : n;
  };
  return walk(doc) as GuideDoc;
}
