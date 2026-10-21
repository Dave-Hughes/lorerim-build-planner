import { firstPlate, type GuideDoc } from "@/lib/guide/doc";
import type { ActView, ChapterView, PlaythroughView } from "./view";

/**
 * The reader's stops (WO-116): every story as the pages it opens to, in reading order. A run's are
 * its chapters, the Prologue's then each act's (WO-118); a build alone's is its Story. Pure, so the tests and both pages share it.
 */

export interface ReaderStop {
  /** The chapter's id, or "story" for a build's Story. */
  key: string;
  /** Its own address: /p/<id>/story/<chapter>, or /b/<id>/story. */
  href: string;
  /** Over the title: "Prologue", "Act I". */
  kicker: string | null;
  title: string;
  /** Under the title: the tale's epigraph on its first page, "From save 7" on a chapter written from a save. */
  line: string | null;
  /** The top bar's middle: "Prologue", "Act I | from save 5". */
  place: string;
  /** The plate: the chapter's own picture, else its text's first image, else the act's picture, else the character's cover. */
  plate: string | null;
  /** What stays in view of the plate (WO-118): its own image's position, the act's, or the cover's. */
  plateFocus: { x: number; y: number } | null;
  /** The plate is the text's own first image, so the text doesn't show it twice. */
  plateFromText: boolean;
  doc: GuideDoc;
  /** A brass drop cap. */
  cap: boolean;
  /** Behind the brass rule (none since WO-118: one kind of chapter). */
  entry: boolean;
  /** A chapter not unlocked yet: what unlocks it. The page shows its title, this, and Read it anyway. */
  waiting: string | null;
  chapterId: number | null;
  /** The chapter's objective: "In the game: <objective>", back to its row. */
  game: { text: string; href: string } | null;
  /** The owner's Edit: the Story editor on this chapter. */
  edit: string | null;
}

export interface ReaderBack {
  href: string;
  label: string;
}

/** A run's tale, in reading order. `cover` is the character's cover. */
export function runStops(p: { id: string; taleLine: string | null; view: PlaythroughView; cover: string | null; coverFocus?: { x: number; y: number } | null; isOwner: boolean; titlePicture?: string | null }): ReaderStop[] {
  const v = p.view;
  const actOf = new Map(v.acts.map((a, i) => [a.id, { a, n: i + 1 }]));
  const rowHref = (oid: number) => {
    const n = v.acts.findIndex((a) => a.objectives.some((o) => o.id === oid)) + 1;
    return `/p/${p.id}?act=${n}#o${oid}`;
  };
  return v.chapters.map((c, i) => {
    const act = c.actId !== null ? actOf.get(c.actId) : undefined;
    // Its own image (WO-117), else the text's first image, else the act's.
    const own = c.imageUrl ?? null;
    const fromText = own ? null : c.open ? firstPlate(c.doc) : null;
    const actImage = act ? actImageOf(v, act.a) : null;
    const title = i === 0 ? (p.titlePicture ?? null) : null;
    return {
      key: String(c.id),
      href: `/p/${p.id}/story/${c.id}`,
      kicker: act ? `Act ${act.a.n}` : "Prologue",
      title: c.title,
      line: i === 0 && p.taleLine ? p.taleLine : c.fromSave ? `From ${c.fromSave.toLowerCase()}` : null,
      place: placeOf(c, act?.a),
      plate: own ?? fromText ?? actImage?.url ?? title ?? p.cover,
      plateFocus: own ? (c.imageFocus ?? null) : fromText ? null : actImage ? actImage.focus : title ? null : (p.coverFocus ?? null),
      plateFromText: !!fromText,
      doc: c.doc,
      cap: true,
      entry: false,
      waiting: c.open ? null : waitingText(v, c),
      chapterId: c.id,
      game: c.inGame ? { text: c.inGame.text, href: rowHref(c.inGame.id) } : null,
      edit: p.isOwner ? `/p/${p.id}/edit/story/${c.id}` : null,
    };
  });
}

/** A build alone's Story (WO-79) as the reader's one stop. */
export function storyStop(b: { id: string; title: string; line: string; doc: GuideDoc; cover: string | null; isOwner: boolean }): ReaderStop {
  const fromText = firstPlate(b.doc);
  return {
    key: "story",
    href: `/b/${b.id}/story`,
    kicker: null,
    title: b.title,
    line: b.line || null,
    place: "The story",
    plate: fromText ?? b.cover,
    plateFocus: null,
    plateFromText: !!fromText,
    doc: b.doc,
    cap: true,
    entry: false,
    waiting: null,
    chapterId: null,
    game: null,
    edit: b.isOwner ? `/b/${b.id}/edit/story` : null,
  };
}

/** An act's image (WO-116): its own, else its first chapter's (WO-118: the image, else the text's first), with what stays in view. The cover comes after. */
export function actImageOf(v: PlaythroughView, a: ActView): { url: string; focus: { x: number; y: number } | null } | null {
  if (a.imageUrl) return { url: a.imageUrl, focus: a.imageFocus ?? null };
  const c = v.chapters.find((x) => x.id === a.chapter);
  if (c?.imageUrl) return { url: c.imageUrl, focus: c.imageFocus ?? null };
  const fromText = c?.open ? firstPlate(c.doc) : null;
  return fromText ? { url: fromText, focus: null } : null;
}
export const actPictureOf = (v: PlaythroughView, a: ActView): string | null => actImageOf(v, a)?.url ?? null;

function placeOf(c: ChapterView, a: ActView | undefined): string {
  if (!a) return "Prologue";
  return [`Act ${a.n}`, c.fromSave ? `from ${c.fromSave.toLowerCase()}` : null].filter(Boolean).join(" | ");
}

/** "Unlocks at Speech 40. Speech 30 now." or "Unlocks when you tick Hunt and tan her first hides." */
function waitingText(v: PlaythroughView, c: ChapterView): string {
  const w = c.waitsOn;
  if (!w) return "Not unlocked yet.";
  const o = v.acts.flatMap((a) => a.objectives).find((x) => x.id === w.id);
  if (w.reach) {
    const now = o?.worked.meter?.value;
    return `Unlocks at ${w.reach}.${now !== undefined && now !== null ? ` ${w.reach.replace(/\s\d+$/, "")} ${now} now.` : ""}`;
  }
  if (o?.doneBy === "save") return `Unlocks when your save shows ${w.text} done.`;
  return `Unlocks when you tick ${w.text}.`;
}

/** The stop a path opens, if it's one of these. */
export function stopAt(stops: ReaderStop[], path: string): number {
  return stops.findIndex((s) => s.href === path);
}
