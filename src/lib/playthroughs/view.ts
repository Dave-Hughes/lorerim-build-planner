import type { GuideDoc } from "@/lib/guide/doc";
import { isOpen, reachLabel, workOut, type SnapshotValues, type Worked } from "./status";
import { levelsText } from "./validate";
import type { ChapterKind, Detect, DoneBy, ObjectiveKind, ObjectiveLink, ObjectiveStatus, Reach } from "./types";

/**
 * A playthrough as its pages show it (WO-111), put together from its rows: each objective worked out
 * against the snapshot, each beat open or waiting, the counts on the tabs, and the current act (the
 * first with an objective not done). Pure, so the tests and every page share it.
 */

export interface ActRow {
  id: number;
  position: number;
  name: string;
  levelFrom: number;
  levelTo: number | null;
  place: string;
  goal: string;
  standingRule: string | null;
  /** The act's image (WO-116); none: its first chapter's, else the cover. */
  imageUrl?: string | null;
  /** What stays in view of it (WO-118). */
  imageFocus?: { x: number; y: number } | null;
}
export interface ObjectiveRow {
  id: number;
  actId: number;
  position: number;
  text: string;
  kind: ObjectiveKind;
  link: ObjectiveLink | null;
  doneBy: DoneBy;
  detect: Detect | null;
  reach: Reach | null;
  why: string | null;
  status: ObjectiveStatus;
  suggestedBy: string | null;
  accepted: boolean;
}
export interface ChapterRow {
  id: number;
  actId: number | null;
  kind: ChapterKind;
  position: number;
  title: string;
  opensAfter: number | null;
  fromSave: string | null;
  writtenBy: string | null;
  createdAt: Date | string;
  /** When the owner opened it (Read it anyway, or an act's story card, WO-116). */
  readAt?: Date | string | null;
  /** Its own plate (WO-117), set where it shows in the Story. */
  imageUrl?: string | null;
  /** What stays in view of it (WO-118). */
  imageFocus?: { x: number; y: number } | null;
  doc: GuideDoc;
}
export interface SnapshotRow extends SnapshotValues {
  source: "save" | "hand";
  label: string;
  xp: number | null;
  day: number | null;
  place: string | null;
  readBy: string | null;
  at: Date | string;
  prevLabel: string | null;
  prevLevel: number | null;
  prevSkills: Record<string, number> | null;
}

export interface LinkShown {
  tag: string;
  name: string;
  href: string | null;
}

export interface ObjectiveView extends ObjectiveRow {
  worked: Worked;
  linkShown: LinkShown | null;
  /** The pieces of the tale that hang off this objective. */
  tale: { id: number; title: string; open: boolean; opens: string }[];
}
export interface ActView extends ActRow {
  n: string;
  levels: string;
  objectives: ObjectiveView[];
  done: number;
  total: number;
  /** Beats in this act with no objective to wait for: open from the start. */
  openBeats: number[];
  /** The act's first chapter (WO-118): its card reads from it. */
  chapter: number | null;
}
export interface ChapterView extends ChapterRow {
  open: boolean;
  /** For a waiting beat: "Opens when you tick Hunt and tan her first hides" (with the objective's id). */
  waitsOn: { id: number; text: string; reach: string | null; act: string } | null;
  /** For entries and beats: the objective it belongs to, for "In the game". */
  inGame: { id: number; text: string; act: string } | null;
  act: string | null;
}

export interface PlaythroughView {
  acts: ActView[];
  current: ActView | null;
  done: number;
  total: number;
  chapters: ChapterView[];
  counts: { chapters: number };
}

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];
export function roman(n: number): string {
  let out = "";
  for (const [v, s] of ROMAN)
    while (n >= v) {
      out += s;
      n -= v;
    }
  return out || String(n);
}

/** "unlocks at Speech 40" for a reach objective, else "unlocks when you tick this". */
function opensText(o: ObjectiveRow): string {
  if (o.kind === "reach" && o.reach) return `unlocks at ${reachLabel(o.reach.key)} ${o.reach.target}`;
  if (o.doneBy === "save") return "unlocks when your save shows this done";
  return "unlocks when you tick this";
}

/** Reading order (WO-118): the Prologue, then each act in turn; in an act its kind-act chapter first, then by place. */
export function storyOrder(acts: { id: number; position: number }[]) {
  const actOrder = new Map([...acts].sort((a, b) => a.position - b.position).map((a, i) => [a.id, i]));
  const actFirst = (c: { kind: ChapterKind }) => (c.kind === "act" ? 0 : 1);
  return (x: { actId: number | null; kind: ChapterKind; position: number }, y: { actId: number | null; kind: ChapterKind; position: number }) =>
    (x.actId === null ? -1 : (actOrder.get(x.actId) ?? 0)) - (y.actId === null ? -1 : (actOrder.get(y.actId) ?? 0)) || actFirst(x) - actFirst(y) || x.position - y.position;
}

export function assemble(rows: { acts: ActRow[]; objectives: ObjectiveRow[]; chapters: ChapterRow[]; snapshot: SnapshotRow | null; link: (l: ObjectiveLink) => LinkShown | null }): PlaythroughView {
  const acts = [...rows.acts].sort((a, b) => a.position - b.position);
  const objectives = [...rows.objectives].sort((a, b) => a.position - b.position);
  const chapters = [...rows.chapters].sort((a, b) => a.position - b.position);
  const worked = new Map(objectives.map((o) => [o.id, workOut(o, rows.snapshot)]));
  const doneIds = new Set(objectives.filter((o) => worked.get(o.id)!.done).map((o) => o.id));
  const actName = new Map(acts.map((a, i) => [a.id, `Act ${roman(i + 1)}`]));
  const byId = new Map(objectives.map((o) => [o.id, o]));

  const actViews: ActView[] = acts.map((a, i) => {
    const mine = objectives.filter((o) => o.actId === a.id);
    const views: ObjectiveView[] = mine.map((o) => ({
      ...o,
      worked: worked.get(o.id)!,
      linkShown: o.link ? rows.link(o.link) : null,
      tale: chapters.filter((c) => c.opensAfter === o.id).map((c) => ({ id: c.id, title: c.title, open: isOpen(c, doneIds), opens: opensText(o) })),
    }));
    const counted = views.filter((o) => o.accepted);
    return {
      ...a,
      n: roman(i + 1),
      levels: levelsText(a.levelFrom, a.levelTo),
      objectives: views,
      done: counted.filter((o) => o.worked.done).length,
      total: counted.length,
      openBeats: chapters.filter((c) => c.actId === a.id && c.opensAfter === null && (c.kind === "entry" || c.kind === "beat")).map((c) => c.id),
      chapter: null,
    };
  });

  const chapterViews: ChapterView[] = chapters.map((c) => {
    const o = c.opensAfter !== null ? byId.get(c.opensAfter) : undefined;
    const act = c.actId !== null ? (actName.get(c.actId) ?? null) : null;
    const open = isOpen(c, doneIds);
    return {
      ...c,
      open,
      act,
      waitsOn: !open && o ? { id: o.id, text: o.text, reach: o.kind === "reach" && o.reach ? `${reachLabel(o.reach.key)} ${o.reach.target}` : null, act: actName.get(o.actId) ?? "" } : null,
      inGame: o ? { id: o.id, text: o.text, act: actName.get(o.actId) ?? "" } : null,
    };
  });
  // The story reads in order: the Prologue's chapters, then each act's (WO-118). An act's first
  // chapter written before play (kind act) leads its act, as it always has.
  chapterViews.sort(storyOrder(acts));
  // An act's card reads from its first chapter (WO-118).
  for (const a of actViews) a.chapter = chapterViews.find((c) => c.actId === a.id)?.id ?? null;

  const done = actViews.reduce((n, a) => n + a.done, 0);
  const total = actViews.reduce((n, a) => n + a.total, 0);
  return {
    acts: actViews,
    current: actViews.find((a) => a.done < a.total) ?? actViews.at(-1) ?? null,
    done,
    total,
    chapters: chapterViews,
    counts: { chapters: chapters.length },
  };
}

/** Where you stand (WO-118), one quiet line: "Level 6 | Day 7 | Riften | Speech 30, Two-Handed 36 | from Save 7". */
export function standLine(snap: Pick<SnapshotRow, "source" | "label" | "level" | "day" | "place" | "skills"> | null): string | null {
  if (!snap) return null;
  const skills = Object.entries(snap.skills)
    .slice(0, 3)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ");
  const from = snap.source === "save" ? `from ${snap.label}` : "from your own entry";
  return [`Level ${snap.level}`, snap.day !== null ? `Day ${snap.day}` : null, snap.place || null, skills || null, from].filter(Boolean).join(" | ");
}

/** Skills that moved since the last snapshot: "Speech 30 | Two-Handed 36". */
export function skillsMoved(s: Pick<SnapshotRow, "skills" | "prevSkills">): { name: string; value: number }[] {
  if (!s.prevSkills) return [];
  return Object.entries(s.skills)
    .filter(([k, v]) => (s.prevSkills![k] ?? 0) !== v)
    .map(([name, value]) => ({ name, value }));
}
