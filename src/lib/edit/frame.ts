import "server-only";
import { getBuild } from "@/lib/builds/queries";
import type { BuildRecord } from "@/lib/builds/types";
import type { BuildVisibility } from "@/lib/builds/validate";
import { playthroughsOn, storyOn } from "@/lib/features";
import { storyOf } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";
import { getPlaythrough, runOfBuild, type PlaythroughRecord } from "@/lib/playthroughs/queries";

/** A place in the story an image can go (WO-118): the title page or a chapter's plate. */
export interface PictureSlot {
  key: string;
  label: string;
  url: string | null;
  to: { kind: "title" } | { kind: "chapter"; id: number };
}
export interface PictureGroup {
  /** "Prologue", "Act I The Sister's House"; none for the title page. */
  label: string | null;
  slots: PictureSlot[];
}

/**
 * What every edit page's top needs (WO-117): the edit band, the page's own hero, and one tab row, for
 * a build alone (Set up, Levels, Guide, and Story when it's on) or a character (Set up, Levels, Play,
 * Guide, Story). Each edit route reads it on the server and hands it to EditFrameProvider.
 */
export interface EditFrameData {
  build: {
    id: string;
    name: string;
    visibility: BuildVisibility;
    coverImageUrl: string | null;
    coverFocus: { x: number; y: number } | null;
    /** The race chosen, for the cover's stand-in (WO-179 Part 2). */
    race: string | null;
    /** "Nord | The Warrior": Set up's tab line. */
    setup: string;
    levels: number;
    hasStory: boolean;
  } | null;
  run: {
    id: string;
    /** The character the run belongs to (WO-179 Part 2): its editor is under it. */
    buildId: string | null;
    name: string;
    visibility: BuildVisibility;
    acts: number;
    objectives: number;
    chapters: number;
    /** Every place in the story an image can go (WO-118), in story order; filling one never moves it. */
    pictures: PictureGroup[];
  } | null;
  /** The hero's words: the character's (the run's) or the build's. */
  name: string;
  line: string;
  author: string;
  traits: string;
  aiAssisted: boolean;
  storyOn: boolean;
  /** The owner's Playthrough tab on a character with no run yet (WO-159). */
  playOn: boolean;
}

function buildPart(b: BuildRecord, guide: Awaited<ReturnType<typeof getGuide>>): NonNullable<EditFrameData["build"]> {
  const docs = Object.fromEntries(Object.entries(guide).map(([k, v]) => [k, v.doc]));
  return {
    id: b.id,
    name: b.name,
    visibility: b.visibility,
    coverImageUrl: b.coverImageUrl,
    coverFocus: b.plan.coverFocus ?? null,
    race: b.plan.race || null,
    setup: [b.plan.race, b.plan.birthsign ? `The ${b.plan.birthsign}` : null].filter(Boolean).join(" | ") || "Not chosen yet",
    levels: b.plan.levels.length,
    hasStory: !!storyOf(docs),
  };
}

function picturesOf(p: PlaythroughRecord): PictureGroup[] {
  const v = p.view;
  const chapter = (c: (typeof v.chapters)[number]): PictureSlot => ({ key: `c${c.id}`, label: c.title, url: c.imageUrl ?? null, to: { kind: "chapter", id: c.id } });
  const groups: PictureGroup[] = [
    { label: null, slots: [{ key: "title", label: "The title page", url: p.coverImageUrl, to: { kind: "title" } }] },
    { label: "Prologue", slots: v.chapters.filter((c) => c.actId === null).map(chapter) },
    ...v.acts.map((a) => ({ label: `Act ${a.n} ${a.name}`, slots: v.chapters.filter((c) => c.actId === a.id).map(chapter) })),
  ];
  return groups.filter((g) => g.slots.length);
}

function runPart(p: PlaythroughRecord): NonNullable<EditFrameData["run"]> {
  const v = p.view;
  return {
    id: p.id,
    buildId: p.buildId,
    name: p.name,
    visibility: p.visibility,
    acts: v.acts.length,
    objectives: v.acts.reduce((n, a) => n + a.objectives.length, 0),
    chapters: v.chapters.length,
    pictures: picturesOf(p),
  };
}

function frame(b: BuildRecord | null, guide: Awaited<ReturnType<typeof getGuide>> | null, p: PlaythroughRecord | null): EditFrameData {
  return {
    build: b && guide ? buildPart(b, guide) : null,
    run: p ? runPart(p) : null,
    // One name and line (WO-179): the character's; a run with none of its own character has its own.
    name: b?.name ?? p?.name ?? "",
    line: b?.description || p?.line || "",
    author: p?.author.name ?? b?.author.name ?? "",
    traits: b ? [b.plan.race, b.plan.birthsign ? `The ${b.plan.birthsign}` : null, b.plan.deity || null].filter(Boolean).join(" | ") : "",
    aiAssisted: p ? !!p.draftedBy && p.showDrafted : !!b?.draftedBy && b.showDrafted !== false,
    storyOn: storyOn(),
    playOn: playthroughsOn() && !!b && !b.isSample && !p,
  };
}

/** For the build's edit pages: the build, and its run when it has one. */
export async function editFrameForBuild(b: BuildRecord, viewerId: string | null): Promise<EditFrameData> {
  const [guide, line] = await Promise.all([getGuide(b.id, b.plan), playthroughsOn() && !b.isSample ? runOfBuild(b.id, viewerId) : Promise.resolve(null)]);
  const p = line ? await getPlaythrough(line.id, viewerId) : null;
  return frame(b, guide, p);
}

/** For the run's edit pages (Play, Story): the run, and its build when the owner has one. */
export async function editFrameForRun(p: PlaythroughRecord, viewerId: string | null): Promise<EditFrameData> {
  const b = p.build ? await getBuild(p.build.id, viewerId) : null;
  const guide = b ? await getGuide(b.id, b.plan) : null;
  return frame(b, guide, p);
}
