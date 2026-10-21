import "server-only";
import { getBuild } from "@/lib/builds/queries";
import type { BuildRecord } from "@/lib/builds/types";
import type { BuildVisibility } from "@/lib/builds/validate";
import { playthroughsOn, storyOn } from "@/lib/features";
import { docWords, isEmptyDoc, storyOf } from "@/lib/guide/doc";
import { getGuide } from "@/lib/guide/queries";
import { getPlaythrough, runOfBuild, type PlaythroughRecord } from "@/lib/playthroughs/queries";

/** A place a picture can go: the cover, the title page, a chapter's plate, an act's card. */
export interface PictureSlot {
  key: string;
  label: string;
  url: string | null;
  to: { kind: "cover" } | { kind: "title" } | { kind: "chapter"; id: number } | { kind: "act"; id: number };
}
export interface PictureGroup {
  label: string;
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
    /** "Nord | The Warrior": Set up's tab line. */
    setup: string;
    levels: number;
    /** The guide's reading time, or null when there's none. */
    guideMinutes: number | null;
    hasStory: boolean;
  } | null;
  run: {
    id: string;
    name: string;
    visibility: BuildVisibility;
    acts: number;
    objectives: number;
    chapters: number;
    /** Every place a picture can go (WO-117), in story order, empty ones first in each group. */
    pictures: PictureGroup[];
  } | null;
  /** The hero's words: the character's (the run's) or the build's. */
  name: string;
  line: string;
  author: string;
  traits: string;
  aiAssisted: boolean;
  storyOn: boolean;
}

function buildPart(b: BuildRecord, guide: Awaited<ReturnType<typeof getGuide>>): NonNullable<EditFrameData["build"]> {
  const overview = guide.overview?.doc;
  const docs = Object.fromEntries(Object.entries(guide).map(([k, v]) => [k, v.doc]));
  return {
    id: b.id,
    name: b.name,
    visibility: b.visibility,
    coverImageUrl: b.coverImageUrl,
    coverFocus: b.plan.coverFocus ?? null,
    setup: [b.plan.race, b.plan.birthsign ? `The ${b.plan.birthsign}` : null].filter(Boolean).join(" | ") || "Not chosen yet",
    levels: b.plan.levels.length,
    guideMinutes: overview && !isEmptyDoc(overview) ? Math.max(1, Math.ceil(docWords(overview) / 200)) : null,
    hasStory: !!storyOf(docs),
  };
}

function picturesOf(p: PlaythroughRecord, cover: string | null, hasBuild: boolean): PictureGroup[] {
  const v = p.view;
  const empties = (slots: PictureSlot[]) => [...slots.filter((x) => !x.url), ...slots.filter((x) => x.url)];
  const chapter = (c: (typeof v.chapters)[number]): PictureSlot => ({ key: `c${c.id}`, label: c.title, url: c.imageUrl ?? null, to: { kind: "chapter", id: c.id } });
  return [
    ...(hasBuild ? [{ label: "The page", slots: [{ key: "cover", label: "The cover", url: cover, to: { kind: "cover" as const } }] }] : []),
    { label: "The story", slots: empties([{ key: "title", label: "The title page", url: p.coverImageUrl, to: { kind: "title" } }, ...v.chapters.filter((c) => c.actId === null).map(chapter)]) },
    ...v.acts.map((a) => ({
      label: `Act ${a.n}`,
      slots: empties([
        { key: `a${a.id}`, label: `Act ${a.n}'s card`, url: a.imageUrl ?? null, to: { kind: "act" as const, id: a.id } },
        ...v.chapters.filter((c) => c.actId === a.id).map(chapter),
      ]),
    })),
  ];
}

function runPart(p: PlaythroughRecord, cover: string | null, hasBuild: boolean): NonNullable<EditFrameData["run"]> {
  const v = p.view;
  return {
    id: p.id,
    name: p.name,
    visibility: p.visibility,
    acts: v.acts.length,
    objectives: v.acts.reduce((n, a) => n + a.objectives.length, 0),
    chapters: v.chapters.length,
    pictures: picturesOf(p, cover, hasBuild),
  };
}

function frame(b: BuildRecord | null, guide: Awaited<ReturnType<typeof getGuide>> | null, p: PlaythroughRecord | null): EditFrameData {
  return {
    build: b && guide ? buildPart(b, guide) : null,
    run: p ? runPart(p, b?.coverImageUrl ?? null, !!b) : null,
    name: p?.name ?? b?.name ?? "",
    line: p ? p.line || b?.description || "" : (b?.description ?? ""),
    author: p?.author.name ?? b?.author.name ?? "",
    traits: b ? [b.plan.race, b.plan.birthsign ? `The ${b.plan.birthsign}` : null, b.plan.deity || null].filter(Boolean).join(" | ") : "",
    aiAssisted: p ? !!p.draftedBy && p.showDrafted : !!b?.draftedBy && b.showDrafted !== false,
    storyOn: storyOn(),
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
