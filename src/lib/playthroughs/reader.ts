import { firstPlate, type GuideDoc } from "@/lib/guide/doc";

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
  /** When the owner last opened it (WO-118: Continue reading), as ms; none for anyone else. */
  readAt: number | null;
}

export interface ReaderBack {
  href: string;
  label: string;
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
    edit: null,
    readAt: null,
  };
}

/** The stop a path opens, if it's one of these. */
export function stopAt(stops: ReaderStop[], path: string): number {
  return stops.findIndex((s) => s.href === path);
}
