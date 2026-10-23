import "server-only";
import { z } from "zod";
import { questsData } from "./data";
import type { PlayerWay, Proposal, ReportFields, ReportKind } from "./player-types";
import type { Quest, QuestLine } from "./types";

/**
 * The agent proposes (WO-146 Part 2): one report read against the quest's records in the generated data (its ways, its
 * needs, the places the readables and boards give), and a proposal written back: what would change on the page, in the
 * page's words, how it fits the records, and how sure it is. It never writes to the pages: an admin approves (Part 3).
 *
 * The call is the Anthropic Messages API over fetch, the key in the environment (ANTHROPIC_API_KEY, in Vercel), one call per
 * report, logged. `ANTHROPIC_API_URL` points it at a stub in the tests.
 */

export class ProposeError extends Error {}

export const PROPOSE_MODEL = process.env.PLAYER_FACT_MODEL || "claude-sonnet-5-5";

/** What the model is asked to answer, checked before anything is kept. */
const answer = z.object({
  words: z.string().min(1).max(600),
  replaces: z.string().max(400).nullable().optional(),
  way: z
    .object({
      how: z.string().min(1).max(400),
      who: z.string().max(120).optional(),
      where: z.string().max(200).optional(),
      whereIs: z.array(z.string().max(200)).max(4).optional(),
    })
    .nullable()
    .optional(),
  fits: z.enum(["agrees", "adds a place", "contradicts"]),
  why: z.string().min(1).max(800),
  confidence: z.enum(["high", "medium", "low"]),
});

export interface ReportForProposal {
  kind: ReportKind;
  what: string;
  text: string;
  said: string;
  fields: ReportFields | null;
  lineId: string;
  quest: string | null;
}

/** The quest's records as the model reads them: names and the start as the generated data holds it, nothing it could invent from. */
export function recordsOf(line: QuestLine, quest: Quest | undefined) {
  const start = quest?.start;
  return {
    line: line.name,
    quest: quest ? { edid: quest.edid, name: quest.name } : null,
    start: start
      ? {
          checked: start.checked,
          needs: start.needs ?? [],
          ways: (start.ways ?? []).map((w) => ({ how: w.how, who: w.who, where: w.where, whereIs: w.whereIs, unplaced: w.unplaced, needs: w.needs, checked: w.checked, source: w.source })),
          then: start.then,
          thenWhere: start.thenWhere,
          who: start.who,
          where: start.where,
        }
      : null,
    board: line.board ? { says: line.board.says, boards: line.board.boards } : null,
    firstObjectives: (quest?.objectives ?? []).slice(0, 4),
  };
}

export const SYSTEM = [
  "You check a player's report about a quest in the LoreRim modlist for Skyrim against the planner's records, and propose what would change on the quest's page. A person approves it; you never change anything.",
  "Rules:",
  "- Use only the player's report and the records you are given. Never add a place, a person or a step from memory.",
  "- Write in the page's plain words, using the game's names exactly. A way in reads like \"Read the note pinned to the board outside Joslin's house, behind the Bannered Mare in Whiterun\" or \"Ask Faendal in Faendal's House\".",
  "- way is the way in as it should read on the page; replaces is the exact words of the existing way it replaces, or null when it is a new way. A place for a thing to read goes in way.whereIs.",
  "- fits is \"agrees\" when the records already say it, \"adds a place\" when the records leave a place unnamed and the report names one, \"contradicts\" when the report and the records disagree.",
  "- If the report cannot become a way on the page, give way null and say why.",
  "Answer with one JSON object and nothing else: {\"words\": string, \"replaces\": string|null, \"way\": {\"how\": string, \"who\"?: string, \"where\"?: string, \"whereIs\"?: string[]}|null, \"fits\": \"agrees\"|\"adds a place\"|\"contradicts\", \"why\": string, \"confidence\": \"high\"|\"medium\"|\"low\"}.",
].join("\n");

/** The user turn: the report, then the records. */
export function promptFor(report: ReportForProposal, line: QuestLine, quest: Quest | undefined): string {
  return JSON.stringify(
    {
      report: { kind: report.kind, about: report.what, fields: report.fields ?? undefined, text: report.text || undefined, plannerSaid: report.said || undefined },
      records: recordsOf(line, quest),
    },
    null,
    1,
  );
}

/** The model's answer as a proposal, or a ProposeError saying it isn't one. */
export function parseProposal(text: string, model: string, at = new Date()): Proposal {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new ProposeError("The proposal didn't come back as JSON.");
  let raw: unknown;
  try {
    raw = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new ProposeError("The proposal didn't come back as JSON.");
  }
  const ok = answer.safeParse(raw);
  if (!ok.success) throw new ProposeError(`The proposal wasn't in the shape asked for: ${ok.error.issues[0]?.message ?? "unknown"}.`);
  const a = ok.data;
  const way: PlayerWay | null = a.way ? { how: a.way.how.trim(), ...(a.way.who ? { who: a.way.who.trim() } : {}), ...(a.way.where ? { where: a.way.where.trim() } : {}), ...(a.way.whereIs?.length ? { whereIs: a.way.whereIs.map((w) => w.trim()) } : {}) } : null;
  return { words: a.words.trim(), way, replaces: a.replaces?.trim() || null, fits: a.fits, why: a.why.trim(), confidence: a.confidence, model, at: at.toISOString() };
}

/** What a call to the model is: the system and user turns in, its text out. Swapped for a stub in the tests. */
export type Complete = (system: string, user: string) => Promise<{ text: string; model: string; usage?: { input_tokens?: number; output_tokens?: number } }>;

/** The Anthropic Messages API over fetch. */
export const anthropic: Complete = async (system, user) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new ProposeError("ANTHROPIC_API_KEY isn't set for this environment, so nothing can be proposed here.");
  const base = process.env.ANTHROPIC_API_URL || "https://api.anthropic.com";
  const res = await fetch(`${base}/v1/messages`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: PROPOSE_MODEL, max_tokens: 1200, system, messages: [{ role: "user", content: user }] }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new ProposeError(`The model answered ${res.status}.`);
  const body = (await res.json()) as { content?: { type: string; text?: string }[]; model?: string; usage?: { input_tokens?: number; output_tokens?: number } };
  const text = (body.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("");
  if (!text) throw new ProposeError("The model answered with no text.");
  return { text, model: body.model ?? PROPOSE_MODEL, usage: body.usage };
};

/** One report, proposed: the prompt, one call (logged), the answer checked. Writes nothing. */
export async function proposeOne(report: ReportForProposal, complete: Complete = anthropic, id: number | string = "?"): Promise<Proposal> {
  const { byId } = questsData();
  const line = byId.get(report.lineId);
  if (!line) throw new ProposeError("The report's quest line isn't in the planner's data any more.");
  const quest = report.quest ? line.quests.find((q) => q.edid === report.quest) : undefined;
  const r = await complete(SYSTEM, promptFor(report, line, quest));
  console.info("quest-proposal", JSON.stringify({ report: id, model: r.model, input: r.usage?.input_tokens, output: r.usage?.output_tokens }));
  return parseProposal(r.text, r.model);
}
