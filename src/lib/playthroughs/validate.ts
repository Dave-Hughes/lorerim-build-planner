import { z } from "zod";
import { objectiveRefusal } from "./status";
import { LINK_KINDS, PLAYTHROUGH_LIMITS as L, type Theme } from "./types";

/**
 * A playthrough's inputs (WO-111), checked the same way for the edit page and the assistants' tools:
 * the limits, rule 14 for objectives, and the levels as the player writes them ("1 to 6", "40 and up").
 */

const line = (max: number, empty: string | null = null) => {
  const s = z.string().trim().max(max, `Up to ${max} characters.`);
  return empty ? s.min(1, empty) : s;
};

export const detailsSchema = z.object({
  name: line(L.name, "Give the playthrough a name."),
  line: line(L.line),
});

/** The Tale page's title and epigraph (WO-114): plain lines, empty for none. */
export const taleSchema = z.object({ taleTitle: line(L.chapterTitle).optional(), taleLine: line(L.line).optional() });

/** The Before you design answers (WO-139 Part 2), in the player's words; empty rows are dropped. */
export const answersSchema = z
  .array(z.object({ question: line(L.answer, "Give the question."), answer: line(L.answer, "Give the answer.") }))
  .max(L.answers, `Up to ${L.answers} answers.`);

/** What the character will never do (WO-139 Part 3); which of these the planner keeps to is decided in lib/quests/never. */
export const neverSchema = z
  .array(z.object({ what: line(L.never, "Say what the character won't do."), words: line(L.answer).optional() }))
  .max(L.nevers, `Up to ${L.nevers} things the character won't do.`);

/** "1 to 6", "1-6", "40 and up", "40+", "6": the act's levels, or a message. */
export function parseLevels(input: string): { from: number; to: number | null } | string {
  const s = input.trim().toLowerCase();
  const up = /^(\d{1,3})\s*(\+|and up|or more|and above)$/.exec(s);
  if (up) return check(Number(up[1]), null);
  const range = /^(\d{1,3})\s*(?:to|-|–)\s*(\d{1,3})$/.exec(s);
  if (range) return check(Number(range[1]), Number(range[2]));
  const one = /^(\d{1,3})$/.exec(s);
  if (one) return check(Number(one[1]), Number(one[1]));
  return 'Write the levels as "1 to 6" or "40 and up".';
}
function check(from: number, to: number | null) {
  if (from < 1 || from > 100 || (to !== null && (to < from || to > 100))) return "Levels run from 1 to 100, the first no higher than the last.";
  return { from, to };
}

/** "Levels 1 to 6", "Level 40 and up". */
export function levelsText(from: number, to: number | null): string {
  if (to === null) return `Level ${from} and up`;
  if (to === from) return `Level ${from}`;
  return `Levels ${from} to ${to}`;
}
/** The input form of the same: "1 to 6", "40 and up". */
export function levelsInput(from: number, to: number | null): string {
  return to === null ? `${from} and up` : to === from ? `${from}` : `${from} to ${to}`;
}

/** A stop's place as stops are matched (WO-129): case and spacing don't count. */
export const stopKey = (place: string) => place.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

export const actSchema = z.object({
  name: line(L.actName, "Give the act a name."),
  levels: z.string().max(30).transform((s, ctx) => {
    const r = parseLevels(s);
    if (typeof r === "string") {
      ctx.addIssue({ code: "custom", message: r });
      return z.NEVER;
    }
    return r;
  }),
  place: line(L.place),
  goal: line(L.goal),
  standingRule: line(L.standingRule).optional().nullable(),
  passedBy: z
    .array(z.object({ place: line(L.place, "Name the place she passes by."), why: line(L.passedByWhy) }))
    .max(L.passedBy, `An act passes by ${L.passedBy} places at most.`)
    .optional()
    .nullable(),
  route: z
    .array(z.object({ place: line(L.place, "Name the stop: a town or a place."), why: line(L.stopWhy), by: z.enum(["foot", "carriage"]).optional() }))
    .max(L.stops, `An act's route has ${L.stops} stops at most.`)
    .superRefine((r, ctx) => {
      const seen = new Set<string>();
      for (const s of r) {
        const k = stopKey(s.place);
        if (seen.has(k)) ctx.addIssue({ code: "custom", message: `${s.place} is on the route twice. A stop is a place, once.` });
        seen.add(k);
      }
    })
    .optional()
    .nullable(),
});
export type ActInput = z.input<typeof actSchema>;

const linkSchema = z.object({ kind: z.enum(LINK_KINDS), id: z.string().min(1).max(120) });
const detectSchema = z.object({ quest: z.string().min(1).max(80), stage: z.number().int().min(0).max(10_000).optional() });
/** "level", "skill:Speech", "count:books read". */
const reachSchema = z.object({
  key: z.string().regex(/^(level|skill:[A-Za-z -]{2,30}|count:[^:]{1,40})$/, "A number is Level, a skill, or a count with a label."),
  target: z.number().int().min(1).max(100_000),
});

export const objectiveSchema = z
  .object({
    text: line(L.objective, "Say what the objective is."),
    kind: z.enum(["once", "reach"]),
    link: linkSchema.nullable().optional(),
    doneBy: z.enum(["save", "hand"]).nullable(),
    detect: detectSchema.nullable().optional(),
    reach: reachSchema.nullable().optional(),
    why: line(L.why).nullable().optional(),
    stop: line(L.place).nullable().optional(),
  })
  .superRefine((o, ctx) => {
    const refused = objectiveRefusal(o.text, o.kind, o.reach);
    if (refused) ctx.addIssue({ code: "custom", message: refused, path: ["text"] });
    if (o.kind === "once" && o.doneBy === "save" && !o.detect) ctx.addIssue({ code: "custom", message: "Pick the quest (and stage) the save shows, or make it one you tick.", path: ["detect"] });
  })
  .transform((o) => ({
    text: o.text,
    kind: o.kind,
    link: o.link ?? null,
    // Ticks from your save (WO-123): on by default when there's something to read, a quest or a number; else the tick.
    doneBy: o.doneBy ?? (o.kind === "reach" || o.detect ? ("save" as const) : ("hand" as const)),
    // The quest it's linked to stays with the switch off, so turning it on again reads the same stage.
    detect: o.kind === "once" ? (o.detect ?? null) : null,
    reach: o.kind === "reach" ? (o.reach ?? null) : null,
    why: o.why ? o.why : null,
    stop: o.stop ? o.stop : null,
  }));
export type ObjectiveInput = z.input<typeof objectiveSchema>;
export type ObjectiveValues = z.output<typeof objectiveSchema>;

export const chapterTitleSchema = line(L.chapterTitle, "Give it a title.");

export const snapshotSchema = z.object({
  source: z.enum(["save", "hand"]),
  label: line(L.label, "Name the save."),
  level: z.number().int().min(1).max(100),
  xp: z.number().int().min(0).max(10_000_000).nullable().optional(),
  day: z.number().int().min(1).max(100_000).nullable().optional(),
  place: line(L.place).nullable().optional(),
  skills: z.record(z.string().max(30), z.number().int().min(0).max(200)),
  questStages: z.record(z.string().max(80), z.number().int().min(0).max(10_000)).nullable().optional(),
  counts: z.record(z.string().max(40), z.number().int().min(0).max(100_000)).nullable().optional(),
  readBy: z.string().max(80).nullable().optional(),
});
export type SnapshotInput = z.input<typeof snapshotSchema>;

/** Act I as a new character's run starts it (WO-114), on the site and through the door. */
export const FIRST_ACT = { name: "The first days", levels: "1 to 5" } as const;

/** The start's own quest as Act I's first objective (WO-114): done when the save shows it. */
export function startObjective(q: { edid: string; name: string; xp?: number }): ObjectiveInput {
  return { text: q.name, kind: "once", link: { kind: "quest", id: q.edid }, doneBy: "save", detect: { quest: q.edid }, why: `The start's own quest.${q.xp ? ` ${q.xp} XP.` : ""}` };
}

/** The first issue's message, for refusals and forms. */
export const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Check the fields.";

/**
 * Who she is (WO-181), checked the same way for the edit page and the assistants' tool. A line is refused, never cut: an em dash, " · ", an
 * emoji, a line over its length, and, in what she will do, won't do and the grey areas, a colon (a line is one thing the player does or avoids,
 * with no reveal after it). The reason comes back in plain words.
 */
export interface ThemeInput {
  backstory?: string;
  from?: string;
  gods?: string;
  goal?: string;
  will?: string[];
  never?: string[];
  grey?: string[];
}
export type ThemeChecked = { theme: Theme; never?: string[] };

const refusedWords = (what: string, text: string): string | null => {
  if (/\u2014/.test(text)) return `${what}: an em dash (\u2014) isn't used here. Write it as two sentences, or with a comma.`;
  if (/ \u00b7 /.test(text)) return `${what}: a " \u00b7 " between two things isn't used here. Write it as a sentence.`;
  if (/\p{Extended_Pictographic}/u.test(text)) return `${what}: no emoji.`;
  return null;
};
const LISTS = { will: "She will", never: "She won't", grey: "Grey areas" } as const;

export function checkTheme(input: ThemeInput): ThemeChecked | { error: string } {
  const out: Theme = {};
  const one = (key: "from" | "gods" | "goal", label: string) => {
    const v = input[key];
    if (v === undefined) return null;
    const t = v.trim().replace(/\s+/g, " ");
    if (t.length > L.themeLine) return `${label} is ${t.length} characters; the most is ${L.themeLine}. Shorten it, it isn't cut for you.`;
    const r = refusedWords(label, t);
    if (r) return r;
    out[key] = t;
    return null;
  };
  if (input.backstory !== undefined) {
    const t = input.backstory.replace(/\r\n?/g, "\n").split("\n").map((l) => l.trim()).filter(Boolean).join("\n\n");
    if (t.length > L.backstory) return { error: `The backstory is ${t.length} characters; the most is ${L.backstory}. Shorten it, it isn't cut for you.` };
    const r = refusedWords("The backstory", t);
    if (r) return { error: r };
    out.backstory = t;
  }
  for (const [key, label] of [["from", "From"], ["gods", "Gods"], ["goal", "Goal"]] as const) {
    const r = one(key, label);
    if (r) return { error: r };
  }
  const lists: Partial<Record<keyof typeof LISTS, string[]>> = {};
  for (const key of Object.keys(LISTS) as (keyof typeof LISTS)[]) {
    const v = input[key];
    if (v === undefined) continue;
    const label = LISTS[key];
    const lines = v.map((x) => x.trim().replace(/\s+/g, " ")).filter(Boolean);
    if (lines.length > L.themeLines) return { error: `${label} has ${lines.length} lines; the most is ${L.themeLines}.` };
    for (const t of lines) {
      if (t.length > L.themeItem) return { error: `${label}: "${t.slice(0, 40)}..." is ${t.length} characters; the most is ${L.themeItem}. Shorten it, it isn't cut for you.` };
      const r = refusedWords(label, t);
      if (r) return { error: r };
      if (t.includes(":")) return { error: `${label}: "${t}" has a colon in it. A line is one thing she does or avoids, in the game's words, with nothing revealed after a colon.` };
    }
    lists[key] = lines;
  }
  if (lists.will) out.will = lists.will;
  if (lists.grey) out.grey = lists.grey;
  return { theme: out, ...(lists.never ? { never: lists.never } : {}) };
}
