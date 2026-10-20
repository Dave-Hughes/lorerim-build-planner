import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { writer, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { LINK_KINDS } from "@/lib/playthroughs/types";
import type { Player } from "./builds";
import { DEFAULT_VERSION, FactsError } from "./errors";
import * as t from "./playthroughs";

/** The playthrough tools' registration (WO-111), each needing a sign-in with playthroughs:write; suggest_quests is facts. */

type Server = Parameters<Parameters<typeof createMcpHandler>[0]>[0];
type Guarded = (run: () => unknown | Promise<unknown>) => Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>;
type Ctx = { http?: { authInfo?: unknown } };

const playthrough = z.string().min(1).max(80).describe("The playthrough's id, from create_playthrough or list_my_playthroughs, or its name.");
// Plain fields only, one level deep, no unions (WO-111b): some connectors check arguments against the
// JSON schema before sending and don't always get an anyOf right.
const act = z.string().min(1).max(60).describe('The act: its number as a string ("2"), "Act II", or its name.');
const objective = z.string().min(1).max(160).describe("The objective: its id from get_playthrough, as a string, or its words.");
const chapter = z.string().min(1).max(60).describe("The chapter, entry or beat: its id from get_playthrough, as a string, or its title.");
const linkSchema = z.object({ kind: z.enum(LINK_KINDS), name: z.string().min(1).max(160) }).describe('What it links to in the planner, by name: a quest ("Name (Line)" when two lines have one of that name), a quest line, a spell, an item or a follower. Leave it out for the player\'s own aims; never invent a quest.');
/** How the planner knows it's done, as flat fields: give one of quest (and stage), reachKey and reachTarget, or byHand. */
const doneFields = {
  quest: z.string().min(1).max(160).optional().describe("For a done-once objective the save shows: the quest, by name or its id."),
  stage: z.number().int().min(0).optional().describe("With quest: the stage that means done; any stage when left out."),
  reachKey: z.string().min(1).max(60).optional().describe('For kind "reach": "Level", a skill\'s name, or a count\'s label ("books read").'),
  reachTarget: z.number().int().min(1).optional().describe('For kind "reach": the number to reach.'),
  byHand: z.boolean().optional().describe("true for a done-once objective the player ticks."),
};
const objectiveFields = {
  playthrough,
  act,
  text: z.string().min(1).max(160).describe("One thing the player can know is done, in plain instructions (rule 14). Not every, each, always or whenever: that's the act's standing rule."),
  link: linkSchema.optional(),
  kind: z.enum(["once", "reach"]).describe("once: done once. reach: a number to reach."),
  ...doneFields,
  why: z.string().max(300).optional().describe("One line, Play only: why, or where it starts. Quest facts from the planner; say \"not checked yet\" when it does."),
  after: objective.optional().describe("Put it right after this objective in the act; at the end when left out."),
};

export function registerPlaythroughTools(server: Server, guarded: Guarded, origin: string) {
  const as = (ctx: Ctx, run: (p: Player) => unknown | Promise<unknown>) =>
    guarded(async () => {
      const w = await writer(ctx.http?.authInfo as PlannerAuth | undefined, "playthroughs:write");
      if ("refusal" in w) throw new FactsError(w.refusal);
      return run({ ...w, origin });
    });
  const tool = (id: string, title: string, description: string, inputSchema: z.ZodObject, run: (p: Player, args: never) => unknown) =>
    server.registerTool(id, { title, description, inputSchema }, async (args: unknown, ctx: Ctx) => as(ctx, (p) => run(p, args as never)));

  tool(
    "create_playthrough",
    "Start a playthrough",
    "Make a new private playthrough in the player's account: a character's run as acts, objectives and a tale. Drafted by you; the player reads and publishes it. At most 10 private drafted ones per player.",
    z.object({
      name: z.string().min(1).max(80).describe("The character's name, or the playthrough's."),
      line: z.string().max(140).optional().describe("One sentence: who the character is."),
      build: z.string().max(80).optional().describe("One of the player's own builds, by id or name."),
      version: z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`),
    }),
    (p, a: Parameters<typeof t.createPlaythrough>[1]) => t.createPlaythrough(p, a),
  );
  const actFields = {
    name: z.string().min(1).max(60),
    levels: z.string().max(30).describe('"1 to 6", or "40 and up".'),
    place: z.string().max(80).describe("Where the act happens."),
    goal: z.string().max(200).describe("The act's goal in one line, Play only."),
    standingRule: z.string().max(200).optional().describe("What the player keeps doing through the act, if anything. Not an objective."),
  };
  tool("add_act", "Add an act", "Add an act at the end of one of the player's playthroughs: a stretch of the game with a goal and a place (rule 13).", z.object({ playthrough, ...actFields }), (p, a: Parameters<typeof t.addAct>[1]) => t.addAct(p, a));
  tool(
    "set_act",
    "Change an act",
    "Change an act's name, levels, place, goal or standing rule.",
    z.object({ playthrough, act, name: actFields.name.optional(), levels: actFields.levels.optional(), place: actFields.place.optional(), goal: actFields.goal.optional(), standingRule: z.string().max(200).optional().describe("The standing rule; an empty string takes it away.") }),
    (p, a: Parameters<typeof t.setAct>[1]) => t.setAct(p, a),
  );
  tool("remove_act", "Remove an act", "Remove an act, its objectives, entries and beats; the last act stays.", z.object({ playthrough, act }), (p, a: Parameters<typeof t.removeAct>[1]) => t.removeAct(p, a));
  tool("move_act", "Move an act", "Move an act to a position (1 is first).", z.object({ playthrough, act, to: z.number().int().min(1) }), (p, a: Parameters<typeof t.moveAct>[1]) => t.moveAct(p, a));
  tool(
    "add_objective",
    "Add an objective",
    "Add an objective to an act: one thing the player can know is done (rule 14). Say how it's done with quest (and stage), reachKey and reachTarget (kind reach), or byHand. Refused, with the rule's words, when it can't be known done: a done-once objective with none of them, or words like every, each, always, whenever, or starting Keep, Always or Never.",
    z.object(objectiveFields),
    (p, a: t.ObjectiveToolInput) => t.addObjective(p, a),
  );
  tool(
    "suggest_objective",
    "Suggest an objective",
    "Suggest an objective, as add_objective, for the player to Accept or Skip on the site (rule 17). It counts for nothing until they accept it.",
    z.object(objectiveFields),
    (p, a: t.ObjectiveToolInput) => t.suggestObjective(p, a),
  );
  tool(
    "set_objective",
    "Change an objective",
    "Change an objective's words, link, kind, how it's done (quest and stage, reachKey and reachTarget, or byHand) or why line; checked by rule 14 again.",
    z.object({ playthrough, objective, text: objectiveFields.text.optional(), link: linkSchema.optional(), unlink: z.boolean().optional().describe("true to take the link away."), kind: objectiveFields.kind.optional(), ...doneFields, why: objectiveFields.why }),
    (p, a: Parameters<typeof t.setObjective>[1]) => t.setObjective(p, a),
  );
  tool("remove_objective", "Remove an objective", "Remove an objective.", z.object({ playthrough, objective }), (p, a: Parameters<typeof t.removeObjective>[1]) => t.removeObjective(p, a));
  tool(
    "move_objective",
    "Move an objective",
    "Move an objective to a position in its act (1 is first), or to the end of another act.",
    z.object({ playthrough, objective, to: z.number().int().min(1).optional(), act: act.optional() }),
    (p, a: Parameters<typeof t.moveObjective>[1]) => t.moveObjective(p, a),
  );
  tool(
    "set_status",
    "Set an objective's status",
    'For an objective the player ticks ("hand") only, when the player tells you: todo, doing, done or later. One the save decides answers that the save decides it.',
    z.object({ playthrough, objective, status: z.enum(["todo", "doing", "done", "later"]) }),
    (p, a: Parameters<typeof t.setStatus>[1]) => t.setStatus(p, a),
  );
  tool(
    "write_chapter",
    "Write a piece of the tale",
    "Write Tale only (rule 12): a chapter from before the game, an entry written after play (from the save and what the player said), or a beat that opens when an objective is done (rule 16). Text in Markdown: paragraphs, a heading, a quote, bold and italic; no images, which the author adds on the site. The Story's limits hold.",
    z.object({
      playthrough,
      kind: z.enum(["chapter", "entry", "beat"]),
      title: z.string().min(1).max(60),
      text: z.string().min(1).max(60_000),
      act: act.optional().describe("The act an entry belongs to."),
      after: objective.optional().describe("For a beat, the objective that opens it (required); for an entry, the objective it tells."),
      fromSave: z.string().max(60).optional().describe('For an entry: the save it was written from, "Save 7, 19 Oct 2026".'),
    }),
    (p, a: Parameters<typeof t.writeChapter>[1]) => t.writeChapter(p, a),
  );
  tool(
    "set_chapter",
    "Change a piece of the tale",
    "Change a chapter, entry or beat's title, its text (Markdown, as write_chapter), the objective a beat opens after, or an entry's save.",
    z.object({ playthrough, chapter, title: z.string().min(1).max(60).optional(), text: z.string().min(1).max(60_000).optional(), after: objective.optional(), fromSave: z.string().max(60).optional() }),
    (p, a: Parameters<typeof t.setChapter>[1]) => t.setChapter(p, a),
  );
  tool("remove_chapter", "Remove a piece of the tale", "Remove a chapter, entry or beat.", z.object({ playthrough, chapter }), (p, a: Parameters<typeof t.removeChapter>[1]) => t.removeChapter(p, a));
  tool(
    "set_snapshot",
    "Where the player stands, from the save",
    'Set where the player stands from their save, read by the planner\'s helper on their PC: source "save" only. Never a value you estimated or the player guessed (rule 18): the player enters it by hand on the site.',
    z.object({
      playthrough,
      source: z.literal("save"),
      label: z.string().min(1).max(60).describe('"Save 7".'),
      level: z.number().int().min(1).max(100),
      xp: z.number().int().min(0).optional(),
      day: z.number().int().min(1).optional(),
      place: z.string().max(80).optional(),
      skills: z.record(z.string(), z.number().int().min(0).max(200)).describe("Skill levels, by name."),
      questStages: z.record(z.string(), z.number().int().min(0)).optional().describe("Quest id to the highest stage the save has."),
      counts: z.record(z.string(), z.number().int().min(0)).optional().describe('Counts the save gives, by label ("books read").'),
    }),
    (p, a: Parameters<typeof t.setSnapshot>[1]) => t.setSnapshot(p, a),
  );
  tool("get_playthrough", "Read a playthrough", "Get one of the player's playthroughs in the plain shape the inputs use: its acts, objectives with how each stands (done is the save's or the player's), the tale, and where the player stands.", z.object({ playthrough }), (p, a: { playthrough: string }) => t.getPlaythroughTool(p, a));
  tool("list_my_playthroughs", "List the player's playthroughs", "List the signed-in player's playthroughs: id, name, who can see it, acts, last change, and whether an assistant drafted it.", z.object({}), (p) => t.listMine(p));
  tool(
    "finish_draft_playthrough",
    "Check a playthrough is ready",
    "Check one of the player's playthroughs once more: every act has an objective and every beat an objective to open after. It changes nothing; the answer is the review link, or the issues. Publishing is the player's, on the site.",
    z.object({ playthrough }),
    (p, a: { playthrough: string }) => t.finishDraft(p, a),
  );

  server.registerTool(
    "suggest_quests",
    {
      title: "Quests to suggest",
      description: "Stories open at a level whose starts the planner has checked in the game files, not done yet, each with its checked start and the planner's link. Never a line whose start isn't checked. Offer them as suggestions (suggest_objective); nothing is added unless the player accepts.",
      inputSchema: z.object({
        level: z.number().int().min(1).max(100),
        where: z.string().max(80).optional().describe("A hold or place to keep to."),
        done: z.array(z.string().max(80)).max(200).optional().describe("Quest line ids already finished."),
        playthrough: z.string().max(80).optional().describe("One of the player's playthroughs, to leave out the lines it has done (needs sign-in)."),
      }),
    },
    async (args: { level: number; where?: string; done?: string[]; playthrough?: string }, ctx: Ctx) =>
      guarded(() => {
        const userId = (ctx.http?.authInfo as PlannerAuth | undefined)?.extra?.userId;
        return t.suggestQuests(origin, args, typeof userId === "string" ? userId : null);
      }),
  );
}
