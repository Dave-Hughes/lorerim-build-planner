import { firstPlate, type GuideDoc } from "@/lib/guide/doc";
import type { ActView, ChapterView, PlaythroughView } from "./view";

/**
 * The reader's stops (WO-116): every story as the pages it opens to, in reading order. A run's are
 * its chapters before the game, then each act's chapter, entries and beats; a build alone's is its
 * Story. Pure, so the tests and both pages share it.
 */

export interface ReaderStop {
  /** The chapter's id, or "story" for a build's Story. */
  key: string;
  /** Its own address: /p/<id>/story/<chapter>, or /b/<id>/story. */
  href: string;
  /** Over the title: "Before Skyrim", "Act I". */
  kicker: string | null;
  title: string;
  /** Under the title: the tale's epigraph on its first page, "From save 7" on an entry. */
  line: string | null;
  /** The top bar's middle: "Before Skyrim", "Act I | from save 5". */
  place: string;
  /** The plate: the chapter's first image, else the act's picture, else the character's cover. */
  plate: string | null;
  /** The plate is the text's own first image, so the text doesn't show it twice. */
  plateFromText: boolean;
  doc: GuideDoc;
  /** A brass drop cap: chapters, not entries or beats. */
  cap: boolean;
  /** Entries and beats sit behind the brass rule. */
  entry: boolean;
  /** A beat not open yet: what opens it. The page shows its title, this, and Read it anyway. */
  waiting: string | null;
  chapterId: number | null;
  /** An entry's or beat's objective: "In the game: <objective>", back to its row. */
  game: { text: string; href: string } | null;
  /** The owner's Edit: the Story editor on this chapter. */
  edit: string | null;
}

export interface ReaderBack {
  href: string;
  label: string;
}

/** A run's tale, in reading order. `cover` is the character's cover. */
export function runStops(p: { id: string; taleLine: string | null; view: PlaythroughView; cover: string | null; isOwner: boolean }): ReaderStop[] {
  const v = p.view;
  const actOf = new Map(v.acts.map((a, i) => [a.id, { a, n: i + 1 }]));
  const rowHref = (oid: number) => {
    const n = v.acts.findIndex((a) => a.objectives.some((o) => o.id === oid)) + 1;
    return `/p/${p.id}?act=${n}#o${oid}`;
  };
  return v.chapters.map((c, i) => {
    const act = c.actId !== null ? actOf.get(c.actId) : undefined;
    const fromText = c.open ? firstPlate(c.doc) : null;
    const actPicture = act ? actPictureOf(v, act.a) : null;
    return {
      key: String(c.id),
      href: `/p/${p.id}/story/${c.id}`,
      kicker: act ? `Act ${act.a.n}` : "Before Skyrim",
      title: c.title,
      line: i === 0 && p.taleLine ? p.taleLine : c.fromSave ? `From ${c.fromSave.toLowerCase()}` : null,
      place: placeOf(c, act?.a),
      plate: fromText ?? actPicture ?? p.cover,
      plateFromText: !!fromText,
      doc: c.doc,
      cap: c.kind === "chapter" || c.kind === "act",
      entry: c.kind === "entry" || c.kind === "beat",
      waiting: c.open ? null : waitingText(v, c),
      chapterId: c.id,
      game: c.inGame ? { text: c.inGame.text, href: rowHref(c.inGame.id) } : null,
      edit: p.isOwner ? `/p/${p.id}/edit/tale/${c.id}` : null,
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
    plateFromText: !!fromText,
    doc: b.doc,
    cap: true,
    entry: false,
    waiting: null,
    chapterId: null,
    game: null,
    edit: b.isOwner ? `/b/${b.id}/story/edit` : null,
  };
}

/** An act's picture (WO-116): its own, else the first image of its chapter. The cover comes after. */
export function actPictureOf(v: PlaythroughView, a: ActView): string | null {
  if (a.imageUrl) return a.imageUrl;
  const c = v.chapters.find((x) => x.kind === "act" && x.actId === a.id);
  return c ? firstPlate(c.doc) : null;
}

function placeOf(c: ChapterView, a: ActView | undefined): string {
  if (!a) return "Before Skyrim";
  return [`Act ${a.n}`, c.fromSave ? `from ${c.fromSave.toLowerCase()}` : null].filter(Boolean).join(" | ");
}

/** "Opens at Speech 40. Speech 30 now." or "Opens when you tick Hunt and tan her first hides." */
function waitingText(v: PlaythroughView, c: ChapterView): string {
  const w = c.waitsOn;
  if (!w) return "Not open yet.";
  const o = v.acts.flatMap((a) => a.objectives).find((x) => x.id === w.id);
  if (w.reach) {
    const now = o?.worked.meter?.value;
    return `Opens at ${w.reach}.${now !== undefined && now !== null ? ` ${w.reach.replace(/\s\d+$/, "")} ${now} now.` : ""}`;
  }
  if (o?.doneBy === "save") return `Opens when your save shows ${w.text} done.`;
  return `Opens when you tick ${w.text}.`;
}

/** The stop a path opens, if it's one of these. */
export function stopAt(stops: ReaderStop[], path: string): number {
  return stops.findIndex((s) => s.href === path);
}
