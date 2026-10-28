import "server-only";
import { townsIn } from "@/lib/places/suggest";
import { gateOf, homeName, questsData } from "./data";
import { rowOf } from "./reads";
import { questHref } from "./slugs";
import { storyOfLine } from "./stories-data";
import type { Story } from "./story";
import { linkNames, type Piece } from "@/lib/pages/link-names";
import { linkable } from "@/lib/pages/names";
import type { Quest, QuestLine } from "./types";
import { startChecked } from "./types";
import { andList } from "./words";

/**
 * One quest line, ready for its page (WO-160): the same shape for a line told as a story (chapters from stories.json), a line with a read
 * (its quests in order as one unnamed run), a line of older rules and a shelf of jobs (grouped by where you pick them up). Built from
 * what the two old pages (the line's and the story's) already knew; nothing new is made up.
 */
export interface Chip {
  kind: "pick" | "danger";
  text: string;
  href?: string | null;
}

export interface LineQuest {
  key: string;
  name: string;
  href: string | null;
  /** What to do first, in one line, and the same with the people and places it names as links (WO-160 Part 5). */
  task: string | null;
  taskParts?: Piece[];
  /** A line of words under it: what it needs. */
  note?: string | null;
  noteParts?: Piece[];
  /** The quest that starts the line: its node is green. */
  start?: boolean;
  /** The places it names, for Where it takes you. */
  places?: string[];
  /** What it opens, and a place's danger. */
  chips: Chip[];
  xp: number;
}

export interface Chapter {
  /** 1-based for a story's chapters; null for the one unnamed run and for a shelf's groups. */
  n: number | null;
  /** "A" or "B" for one side of a story that splits in two (Dawnguard), shown where the number would be. */
  side?: string;
  name: string | null;
  quests: LineQuest[];
  xp: number;
}

export interface Open {
  id: string;
  name: string;
  needs: { text: string; tone: "done" | "danger" | "other"; note?: string }[];
}

export interface LineView {
  title: string;
  /** The line's own name, as a tag, when the title is a story's name. */
  lineTag: string | null;
  chapters: Chapter[];
  /** "Chapter" for a story, none for the rest. */
  numbered: boolean;
  shelf: boolean;
  jobs: LineQuest[];
  jobsNote: string;
  opens: Open[];
  glance: { start: { value: string; sub: string | null; more: string[] }; level: { value: string; sub: string | null }; length: { value: string; sub: string | null }; xp: { value: string; sub: string | null } | null; where: string | null };
  questCount: number;
  chapterCount: number;
  /** What the read says is not a step of its own (Dragonborn's cultists' ambush), left out of the counts and the run and said under How it starts. */
  notSteps: { name: string; text: string }[];
}

const short = (s: string) => s.length <= 64;

/** What a quest's who and where leave on the page: the places they name (for Where it takes you) and, when long, a line of words. No chips (WO-160 Part 5): the sentence links the names. */
function whereOf(where: string | null | undefined): { places: string[]; note: string | null } {
  if (!where) return { places: [], note: null };
  return short(where) ? { places: [where], note: null } : { places: [], note: where };
}

/** "200" a quest when every paying quest pays the same. */
function xpSub(quests: Quest[]): string | null {
  const paying = quests.filter((q) => q.xp > 0);
  if (!paying.length) return null;
  const same = paying.every((q) => q.xp === paying[0].xp);
  return same ? `${paying[0].xp.toLocaleString("en-US")} a quest` : `${paying.length} of ${quests.length} quests pay XP`;
}

/** What the jobs along the way pay, in words: "100 each", "50 to 200 each", or null when none pay (WO-160 Part 5: one number for the line's XP). */
function jobsPay(jobs: LineQuest[]): string | null {
  const paying = jobs.filter((j) => j.xp > 0).map((j) => j.xp);
  if (!paying.length) return null;
  const lo = Math.min(...paying);
  const hi = Math.max(...paying);
  return lo === hi ? `${lo.toLocaleString("en-US")} each` : `${lo.toLocaleString("en-US")} to ${hi.toLocaleString("en-US")} each`;
}

/** The paying quests that are in the story's run (not the jobs along the way). */
const storyOnly = (payers: Quest[], run: LineQuest[]) => payers.filter((q) => run.some((r) => r.name === q.name));

/** A quest's words with the people and places they name as links (WO-160 Part 5), so the page links them where they are written. */
const withParts = (q: LineQuest): LineQuest => ({ ...q, ...(q.task ? { taskParts: linkNames(q.task, linkable()) } : {}), ...(q.note ? { noteParts: linkNames(q.note, linkable()) } : {}) });

function uniquePlaces(places: (string | null | undefined)[], limit = 6): string | null {
  const seen = new Set<string>();
  for (const p of places) {
    const first = p?.split(",")[0].trim();
    if (first && short(first)) seen.add(first);
  }
  const list = [...seen];
  if (!list.length) return null;
  return list.slice(0, limit).join(", ") + (list.length > limit ? ` and ${list.length - limit} more` : "");
}


/**
 * The two sides of a story that splits (WO-160): the read's order entries that say they are for the Dawnguard (or "refusing Harkon") and those
 * for Harkon's court (or "accepting his gift"). A side needs a few quests of its own to count. A quest on both sides with two versions
 * (Prophet) is on each. `at` is the quest where the choice is made; `jobs` are the radiant jobs of both sides.
 */
function splitSides(line: QuestLine, rows: Map<string, ReturnType<typeof rowOf>>) {
  const order = line.read?.order;
  const branch = line.read?.branches?.find((b) => b.options.length === 2 && b.options.some((o) => /harkon/i.test(o)));
  if (!order?.length || !branch) return null;
  const sideOf = (o: { what?: string | null; needs?: string | null }) => {
    const t = `${o.what ?? ""} ${o.needs ?? ""}`;
    const dg = /dawnguard (?:job|side|version)|refus\w* harkon/i.test(t);
    const hk = /harkon's court|accept\w* harkon/i.test(t);
    return dg === hk ? null : dg ? 0 : 1;
  };
  const sides: { name: string; quests: LineQuest[] }[] = [
    { name: "On the Dawnguard side", quests: [] },
    { name: "In Harkon's court", quests: [] },
  ];
  const jobs: LineQuest[] = [];
  for (const o of order) {
    const side = sideOf(o);
    if (side === null) continue;
    const lq = line.quests.find((q) => q.name === o.quest);
    const radiant = /radiant/i.test(o.what ?? "");
    const { places, note } = whereOf(o.where ?? null);
    const row = { key: `${lq?.edid ?? o.quest}-${side}`, name: o.quest, href: lq ? questHref(lq.edid) : null, task: o.what ?? (lq ? rows.get(lq.edid)?.summary : null) ?? null, note: [note, o.needs ? `Needs: ${o.needs}` : null].filter(Boolean).join(" | ") || null, places, chips: [] as Chip[], xp: lq?.xp ?? 0 };
    if (radiant) jobs.push({ ...row, note: [side === 0 ? "A Dawnguard job" : "A job for Harkon's court", row.note].filter(Boolean).join(" | ") });
    else sides[side].quests.push(row);
  }
  if (sides.some((sd) => sd.quests.length < 1)) return null;
  return { sides, jobs, at: branch.at };
}

export function lineView(line: QuestLine): LineView {
  const data = questsData();
  const story: Story | undefined = storyOfLine(line.id);
  const shelf = line.category === "work";
  const quests = line.quests;
  const byEdid = new Map(quests.map((q) => [q.edid, q]));
  const byName = new Map(quests.map((q) => [q.name, q]));
  const rows = new Map(quests.map((q, i) => [q.edid, rowOf(q, i > 0 ? quests[i - 1] : undefined)]));
  const opening = quests.find((q) => q.edid === line.opening);
  // A quest the read says isn't a step of its own (it only sets the line off): not counted, not in the run.
  const isNotAStep = (what: string | null | undefined) => /\b(?:isn't|is not|not) a step of its own\b/i.test(what ?? "");
  const notSteps = (line.read?.order ?? []).filter((o) => isNotAStep(o.what)).map((o) => ({ name: o.quest, text: o.what! }));

  // What other lines this one opens: from the story when it has one, else the lines that wait for it.
  const opens: Open[] = story
    ? story.opens.map((o) => ({
        id: o.line,
        name: o.name,
        needs: [
          ...o.needs.map((n) => ({
            text: n.text,
            tone: n.kind === "level" ? ("danger" as const) : ("done" as const),
            ...(n.checked === "not yet" ? { note: `not checked yet${n.why ? `: ${n.why}` : ""}` } : {}),
          })),
          ...(o.or ? [{ text: o.or.text, tone: "other" as const, ...(o.or.checked === "not yet" ? { note: "not checked yet" } : {}) }] : []),
        ],
      }))
    : data.lines
        .filter((l) => l.after.includes(line.id))
        .map((l) => {
          const g = gateOf(l);
          return { id: l.id, name: l.name, needs: g.minLevel ? [{ text: `Level ${g.minLevel}`, tone: "danger" as const }] : [] };
        });
  // Which quest opens which lines, as a chip on that quest (the story's "needs" name a main-quest step).
  const opensAt = new Map<string, string[]>();
  if (story) for (const o of story.opens) for (const n of o.needs) if (n.kind === "mainQuest") opensAt.set(n.at, [...(opensAt.get(n.at) ?? []), o.name]);

  let chapters: Chapter[] = [];
  let jobs: LineQuest[] = [];
  let jobsNote = "";
  let first = true;
  if (story) {
    chapters = story.chapters.map((c, i) => {
      const qs: LineQuest[] = c.quests.map((sq) => {
        const lq = byEdid.get(sq.edid);
        const start = first;
        first = false;
        const { places, note } = whereOf(sq.where);
        const opened = opensAt.get(sq.edid);
        const chips: Chip[] = opened ? [{ kind: "pick" as const, text: `Opens ${andList(opened)}` }] : [];
        return { key: sq.edid, name: sq.name, href: questHref(sq.edid), task: sq.task ?? (lq ? rows.get(lq.edid)!.summary : null), note: note ?? sq.note ?? null, start, places, chips, xp: sq.xp };
      });
      return { n: i + 1, name: c.name, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) };
    });
    jobs = story.alongside.map((sq) => {
      const { places, note } = whereOf(sq.where);
      return { key: sq.edid, name: sq.name, href: questHref(sq.edid), task: sq.task ?? null, note, places, chips: [], xp: byEdid.get(sq.edid)?.xp ?? 0 };
    });
    // A story that splits in two (Dawnguard: refuse or accept Harkon's gift): the read's own words say which side each quest is on. The
    // shared start and the shared end stay as the story's chapters; each side is its own run between them, and the radiant jobs of the
    // side the story's list leaves out are added to Along the way.
    const split = splitSides(line, rows);
    if (split) {
      const taken = new Set(split.sides.flatMap((sd) => sd.quests.map((q) => q.name)));
      chapters = chapters.map((c) => ({ ...c, quests: c.quests.filter((q) => !taken.has(q.name)) })).filter((c) => c.quests.length);
      const at = chapters.findIndex((c) => c.quests.some((q) => q.name === split.at));
      const sideChapters: Chapter[] = split.sides.map((sd, i) => ({ n: null, side: String.fromCharCode(65 + i), name: sd.name, quests: sd.quests, xp: sd.quests.reduce((n, q) => n + q.xp, 0) }));
      chapters.splice(at >= 0 ? at + 1 : Math.min(1, chapters.length), 0, ...sideChapters);
      const have = new Set(jobs.map((j) => j.name));
      for (const j of split.jobs) if (!have.has(j.name)) jobs.push(j);
      jobsNote = `${jobs.length} jobs that open as the story goes on, for either side. ${jobsPay(jobs) ? `They pay ${jobsPay(jobs)}.` : "They pay no quest XP."}`;
    }
    if (!jobsNote) jobsNote = `${jobs.length} job${jobs.length === 1 ? "" : "s"} that open${jobs.length === 1 ? "s" : ""} as the story goes on. ${jobsPay(jobs) ? `They pay ${jobsPay(jobs)}.` : "They pay no quest XP."}`;
  } else if (shelf && !line.board) {
    const pickUp = (q: Quest) => {
      const { where, town } = rows.get(q.edid)!;
      return town ?? (where ? (townsIn(where)[0] ?? where) : "Where to pick it up isn't read yet");
    };
    chapters = [...new Set(quests.map(pickUp))].map((place) => {
      const qs: LineQuest[] = quests
        .filter((q) => pickUp(q) === place)
        .map((q) => {
          const r = rows.get(q.edid)!;
          // A job's place is named in its words; the danger there is the one chip left (red).
          const [place, ...danger] = (r.places[0] ?? "").split(": ");
          return { key: q.edid, name: q.name, href: questHref(q.edid), task: r.summary, note: r.needs.length ? `Needs: ${r.needs.join("; ")}` : null, places: place ? [place] : [], chips: danger.length ? [{ kind: "danger" as const, text: danger.join(": ") }] : [], xp: q.xp };
        });
      return { n: null, name: place, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) };
    });
  } else if (!line.board) {
    // A line with a read gives its quests in order; the older rules, those that pay XP, the opening first.
    const lr = line.read;
    const ordered = lr?.order?.length
      ? lr.order.filter((o) => !isNotAStep(o.what)).map((o) => ({ name: o.quest, what: o.what ?? null, where: o.where ?? null, needs: o.needs ?? null }))
      : [...(opening && opening.xp > 0 ? [opening] : []), ...quests.filter((q) => q.xp > 0 && q !== opening)].map((q) => ({ name: q.name, what: rows.get(q.edid)!.summary, where: rows.get(q.edid)!.where, needs: null as string | null }));
    const qs: LineQuest[] = ordered.map((o) => {
      const lq = byName.get(o.name);
      const r = lq ? rows.get(lq.edid) : undefined;
      const { places, note } = whereOf(o.where ?? r?.where ?? null);
      const needs = o.needs ?? (r?.needs.length ? r.needs.join("; ") : null);
      return { key: lq?.edid ?? o.name, name: o.name, href: lq ? questHref(lq.edid) : null, task: o.what ?? r?.summary ?? null, note: [note, needs ? `Needs: ${needs}` : null].filter(Boolean).join(" | ") || null, start: !!lq && lq === opening && !shelf, places, chips: [], xp: lq?.xp ?? 0 };
    });
    chapters = qs.length ? [{ n: null, name: null, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) }] : [];
    const listed = new Set([...ordered.map((o) => o.name), ...notSteps.map((n) => n.name)]);
    jobs = quests
      .filter((q) => q.xp === 0 && !listed.has(q.name))
      .map((q) => {
        const r = rows.get(q.edid)!;
        return { key: q.edid, name: q.name, href: questHref(q.edid), task: r.summary, note: null, places: r.where && short(r.where) ? [r.where] : [], chips: [], xp: 0 };
      });
    jobsNote = `${jobs.length} job${jobs.length === 1 ? "" : "s"} and bount${jobs.length === 1 ? "y" : "ies"} that open as you go. They pay no quest XP.`;
  }

  const storyQuests = chapters.flatMap((c) => c.quests);
  const skipped = new Set(notSteps.map((n) => n.name));
  const payers = quests.filter((q) => q.xp > 0);
  const first0 = storyQuests[0];
  const lr = line.read;
  // How it starts, in full, as the lines under it (WO-160 Part 5: the rail's How it starts is gone, so everything it said is here): the story's
  // starts with where each was checked, else the read's way in with who, where and what it needs, else the older rules' giver, ways in and first step.
  const waysIn = line.ways ?? (startChecked(opening?.start) ? opening!.start!.ways : undefined);
  const startLines: string[] = story
    ? story.start.map((t) => `${t.text}${t.checked === "not yet" ? " (not checked yet)" : ""}`)
    : lr?.getIn
      ? [lr.getIn.how, lr.getIn.who && lr.getIn.who !== "not named in the records" ? `Who: ${lr.getIn.who}` : "", lr.getIn.where ? `Where: ${lr.getIn.where}` : "", ...(lr.getIn.needs ?? []).map((n) => `Needs: ${n}`)].filter((x): x is string => !!x)
      : [
          line.start ?? "",
          line.giver ? `${line.giver.name}${line.giver.place ? ` in ${line.giver.place}` : ""}` : "",
          ...(!line.giver ? (waysIn ?? []).map((w) => w.how) : []),
          !line.giver && !line.start && line.firstObjective ? `First step: ${line.firstObjective}` : "",
        ].filter(Boolean);
  const startText = startLines[0] ?? null;
  const chapterCount = story ? story.chapters.length : 0;
  const xpTotal = story ? story.chapters.flatMap((c) => c.quests).reduce((n, q) => n + q.xp, 0) : line.xpTotal;
  return {
    title: story?.name ?? line.name,
    lineTag: story ? line.name : null,
    chapters: chapters.map((c) => ({ ...c, quests: c.quests.map(withParts) })),
    numbered: !!story,
    shelf,
    jobs: jobs.map(withParts),
    jobsNote,
    opens,
    glance: {
      start: { value: shelf ? "Each job on its own" : (story?.chapters[0]?.name ?? first0?.name ?? opening?.name ?? "Not read yet"), sub: shelf ? "Open one for how it starts" : startText, more: shelf ? [] : startLines.slice(1) },
      level: line.minLevel ? { value: `Level ${line.minLevel}`, sub: line.level ?? null } : { value: "Any", sub: line.level ?? (lr ? "The records set no level for it" : null) },
      length: {
        value: `${storyQuests.length || quests.length - skipped.size} ${(storyQuests.length || quests.length - skipped.size) === 1 ? "quest" : "quests"}`,
        sub: chapterCount ? `In ${chapterCount} chapters${jobs.length ? `, plus ${jobs.length} jobs along the way` : ""}` : (line.size ?? (jobs.length ? `Plus ${jobs.length} jobs along the way` : null)),
      },
      // The story's own quests, and under it what the jobs along the way pay when they pay (one number for the line, Along the way says the same).
      xp: xpTotal > 0 ? { value: xpTotal.toLocaleString("en-US"), sub: jobsPay(jobs) ? `Jobs along the way pay ${jobsPay(jobs)}` : story ? (story.reward ? story.reward.text.split(": ")[1]?.replace(/\.$/, "") ?? null : null) ?? xpSub(storyOnly(payers, storyQuests)) : xpSub(payers) } : null,
      where: uniquePlaces(storyQuests.flatMap((q) => q.places ?? []).concat(line.where ? [line.where] : [])),
    },
    questCount: storyQuests.length || quests.filter((q) => !skipped.has(q.name)).length,
    chapterCount,
    notSteps,
  };
}

/** The line's category as the page names it, for its back button. */
export const lineHome = (line: QuestLine) => homeName(line.category);

/** A line as a row on its category's page (WO-160): the story's or the line's name, tags, pitch, how it starts and its XP. */
export interface CategoryRow {
  id: string;
  href: string;
  name: string;
  lineTag: string | null;
  sources: QuestLine["sources"];
  prince: string | null;
  level: string;
  levelNumber: number;
  size: string;
  where: string | null;
  pitch: string | null;
  pitchParts?: Piece[];
  quoted: boolean;
  start: string | null;
  startParts?: Piece[];
  xp: string | null;
  chapters: string[];
  /** A line of one quest: its card opens that quest's page. */
  solo: boolean;
  /** "Also in Side stories": the other categories it sits in. */
  also: string;
}

export function categoryRow(line: QuestLine, key: string): CategoryRow {
  const solo = line.quests.length === 1 && line.category !== "work" && !!questHref(line.quests[0].edid);
  const href = solo ? questHref(line.quests[0].edid)! : `/quests/${line.id}`;
  const story = storyOfLine(line.id);
  const base = { id: line.id, href, sources: line.sources, prince: line.prince, levelNumber: line.minLevel ?? 0, level: line.minLevel ? `Level ${line.minLevel}` : "Any level", where: line.where, solo, also: [line.category, ...line.also].filter((k) => k !== key).length ? `Also in ${andList([line.category, ...line.also].filter((k) => k !== key).map(homeName))}` : "" };
  if (solo) return { ...base, name: line.quests[0].name || line.name, lineTag: null, size: "One quest", pitch: line.begins, pitchParts: line.begins ? linkNames(line.begins, linkable()) : undefined, quoted: line.beginsFrom === "opening", start: null, xp: null, chapters: [] };
  const v = lineView(line);
  const chapters = story ? story.chapters.map((c) => c.name) : [];
  const pitch = story?.pitch ?? line.read?.about ?? line.begins;
  const startText = v.glance.start.sub;
  return {
    ...base,
    pitchParts: pitch ? linkNames(pitch, linkable()) : undefined,
    startParts: startText ? linkNames(startText, linkable()) : undefined,
    name: v.title,
    lineTag: v.lineTag,
    size: v.chapterCount ? `${v.questCount} quests in ${v.chapterCount} chapters` : `${v.questCount} quest${v.questCount === 1 ? "" : "s"}`,
    pitch: story?.pitch ?? line.read?.about ?? line.begins,
    quoted: !story && !line.read?.about && line.beginsFrom === "opening",
    start: v.glance.start.sub,
    xp: v.glance.xp?.value ?? null,
    chapters,
  };
}
