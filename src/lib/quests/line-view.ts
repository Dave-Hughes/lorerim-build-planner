import "server-only";
import { personHref } from "@/lib/people/data";
import { placeHref } from "@/lib/places/data";
import { townsIn } from "@/lib/places/suggest";
import { gateOf, homeName, questsData } from "./data";
import { rowOf } from "./reads";
import { questHref } from "./slugs";
import { storyOfLine } from "./stories-data";
import type { Story } from "./story";
import type { Quest, QuestLine } from "./types";
import { andList } from "./words";

/**
 * One quest line, ready for its page (WO-160): the same shape for a line told as a story (chapters from stories.json), a line with a read
 * (its quests in order as one unnamed run), a line of older rules and a shelf of jobs (grouped by where you pick them up). Built from
 * what the two old pages (the line's and the story's) already knew; nothing new is made up.
 */
export interface Chip {
  kind: "start" | "who" | "place" | "pick" | "danger";
  text: string;
  href?: string | null;
}

export interface LineQuest {
  key: string;
  name: string;
  href: string | null;
  /** What to do first, in one line. */
  task: string | null;
  /** A line of words under it: what it needs, or where when that is too long for a chip. */
  note?: string | null;
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
  glance: { start: { value: string; sub: string | null }; level: { value: string; sub: string | null }; length: { value: string; sub: string | null }; xp: { value: string; sub: string | null } | null; where: string | null };
  questCount: number;
  chapterCount: number;
}

const placeLink = (text: string): string | null => placeHref(text) ?? placeHref(text.split(",")[0].trim()) ?? null;
const personLink = (text: string): string | null => personHref(text);
const short = (s: string) => s.length <= 64;

function chipsOf(who: string | null | undefined, where: string | null | undefined, extra: Chip[] = []): { chips: Chip[]; note: string | null } {
  const chips: Chip[] = [...extra];
  let note: string | null = null;
  if (who && short(who)) chips.push({ kind: "who", text: who, href: personLink(who) });
  if (where) {
    if (short(where)) chips.push({ kind: "place", text: where, href: placeLink(where) });
    else note = where;
  }
  return { chips, note };
}

/** "200" a quest when every paying quest pays the same. */
function xpSub(quests: Quest[]): string | null {
  const paying = quests.filter((q) => q.xp > 0);
  if (!paying.length) return null;
  const same = paying.every((q) => q.xp === paying[0].xp);
  return same ? `${paying[0].xp.toLocaleString("en-US")} a quest` : `${paying.length} of ${quests.length} quests pay XP`;
}

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
    const { chips, note } = chipsOf(null, o.where ?? null);
    const row = { key: `${lq?.edid ?? o.quest}-${side}`, name: o.quest, href: lq ? questHref(lq.edid) : null, task: o.what ?? (lq ? rows.get(lq.edid)?.summary : null) ?? null, note: [note, o.needs ? `Needs: ${o.needs}` : null].filter(Boolean).join(" | ") || null, chips, xp: lq?.xp ?? 0 };
    if (radiant) jobs.push({ ...row, xp: 0, note: [side === 0 ? "A Dawnguard job" : "A job for Harkon's court", row.note].filter(Boolean).join(" | ") });
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
  const branchAt = new Map((line.read?.branches ?? []).map((b) => [b.at, b.options]));
  const pick = (name: string): Chip[] => (branchAt.get(name)?.length ? [{ kind: "pick", text: "A choice" }] : []);

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
        const extra: Chip[] = [];
        if (first) extra.push({ kind: "start", text: "Starts here" });
        first = false;
        const { chips, note } = chipsOf(sq.who, sq.where, extra);
        const opened = opensAt.get(sq.edid);
        const rest: Chip[] = [...pick(sq.name), ...(opened ? [{ kind: "pick" as const, text: `Opens ${andList(opened)}` }] : [])];
        return { key: sq.edid, name: sq.name, href: questHref(sq.edid), task: sq.task ?? (lq ? rows.get(lq.edid)!.summary : null), note: note ?? sq.note ?? null, chips: [...chips, ...rest], xp: sq.xp };
      });
      return { n: i + 1, name: c.name, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) };
    });
    jobs = story.alongside.map((sq) => {
      const { chips, note } = chipsOf(sq.who, sq.where);
      return { key: sq.edid, name: sq.name, href: questHref(sq.edid), task: sq.task ?? null, note, chips, xp: 0 };
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
      jobsNote = `${jobs.length} jobs that open as the story goes on, for either side. They pay no quest XP.`;
    }
    if (!jobsNote) jobsNote = `${jobs.length} job${jobs.length === 1 ? "" : "s"} that open${jobs.length === 1 ? "s" : ""} as the story goes on. They pay no quest XP.`;
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
          return { key: q.edid, name: q.name, href: questHref(q.edid), task: r.summary, note: r.needs.length ? `Needs: ${r.needs.join("; ")}` : null, chips: r.places.slice(0, 1).flatMap((p) => {
            const [place, ...danger] = p.split(": ");
            return [{ kind: "place" as const, text: place, href: placeLink(place) }, ...(danger.length ? [{ kind: "danger" as const, text: danger.join(": ") }] : [])];
          }), xp: q.xp };
        });
      return { n: null, name: place, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) };
    });
  } else if (!line.board) {
    // A line with a read gives its quests in order; the older rules, those that pay XP, the opening first.
    const lr = line.read;
    const ordered = lr?.order?.length
      ? lr.order.map((o) => ({ name: o.quest, what: o.what ?? null, where: o.where ?? null, needs: o.needs ?? null }))
      : [...(opening && opening.xp > 0 ? [opening] : []), ...quests.filter((q) => q.xp > 0 && q !== opening)].map((q) => ({ name: q.name, what: rows.get(q.edid)!.summary, where: rows.get(q.edid)!.where, needs: null as string | null }));
    const qs: LineQuest[] = ordered.map((o) => {
      const lq = byName.get(o.name);
      const r = lq ? rows.get(lq.edid) : undefined;
      const extra: Chip[] = [];
      if (lq && lq === opening && !shelf) extra.push({ kind: "start", text: "Starts here" });
      extra.push(...pick(o.name));
      const { chips, note } = chipsOf(null, o.where ?? r?.where ?? null, extra);
      const needs = o.needs ?? (r?.needs.length ? r.needs.join("; ") : null);
      return { key: lq?.edid ?? o.name, name: o.name, href: lq ? questHref(lq.edid) : null, task: o.what ?? r?.summary ?? null, note: [note, needs ? `Needs: ${needs}` : null].filter(Boolean).join(" | ") || null, chips, xp: lq?.xp ?? 0 };
    });
    chapters = qs.length ? [{ n: null, name: null, quests: qs, xp: qs.reduce((n, q) => n + q.xp, 0) }] : [];
    const listed = new Set(ordered.map((o) => o.name));
    jobs = quests
      .filter((q) => q.xp === 0 && !listed.has(q.name))
      .map((q) => {
        const r = rows.get(q.edid)!;
        return { key: q.edid, name: q.name, href: questHref(q.edid), task: r.summary, note: null, chips: r.where && short(r.where) ? [{ kind: "place" as const, text: r.where, href: placeLink(r.where) }] : [], xp: 0 };
      });
    jobsNote = `${jobs.length} job${jobs.length === 1 ? "" : "s"} and bount${jobs.length === 1 ? "y" : "ies"} that open as you go. They pay no quest XP.`;
  }

  const storyQuests = chapters.flatMap((c) => c.quests);
  const payers = quests.filter((q) => q.xp > 0);
  const first0 = storyQuests[0];
  const lr = line.read;
  const startText = story?.start[0]?.text ?? lr?.getIn?.how ?? line.start ?? (line.giver ? `${line.giver.name}${line.giver.place ? ` in ${line.giver.place}` : ""}` : null);
  const chapterCount = story ? story.chapters.length : 0;
  const xpTotal = story ? story.chapters.flatMap((c) => c.quests).reduce((n, q) => n + q.xp, 0) : line.xpTotal;
  return {
    title: story?.name ?? line.name,
    lineTag: story ? line.name : null,
    chapters,
    numbered: !!story,
    shelf,
    jobs,
    jobsNote,
    opens,
    glance: {
      start: { value: shelf ? "Each job on its own" : (story?.chapters[0]?.name ?? first0?.name ?? opening?.name ?? "Not read yet"), sub: shelf ? "Open one for how it starts" : startText },
      level: line.minLevel ? { value: `Level ${line.minLevel}`, sub: line.level ?? null } : { value: "Any", sub: line.level ?? (lr ? "The records set no level for it" : null) },
      length: {
        value: `${storyQuests.length || quests.length} ${(storyQuests.length || quests.length) === 1 ? "quest" : "quests"}`,
        sub: chapterCount ? `In ${chapterCount} chapters${jobs.length ? `, plus ${jobs.length} jobs along the way` : ""}` : (line.size ?? (jobs.length ? `Plus ${jobs.length} jobs along the way` : null)),
      },
      xp: xpTotal > 0 ? { value: xpTotal.toLocaleString("en-US"), sub: story ? (story.reward ? story.reward.text.split(": ")[1]?.replace(/\.$/, "") ?? null : null) ?? xpSub(payers) : xpSub(payers) } : null,
      where: uniquePlaces(storyQuests.flatMap((q) => q.chips.filter((c) => c.kind === "place").map((c) => c.text)).concat(line.where ? [line.where] : [])),
    },
    questCount: storyQuests.length || quests.length,
    chapterCount,
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
  quoted: boolean;
  start: string | null;
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
  if (solo) return { ...base, name: line.quests[0].name || line.name, lineTag: null, size: "One quest", pitch: line.begins, quoted: line.beginsFrom === "opening", start: null, xp: null, chapters: [] };
  const v = lineView(line);
  const chapters = story ? story.chapters.map((c) => c.name) : [];
  return {
    ...base,
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
