import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { writer, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { LINK_KINDS } from "@/lib/playthroughs/types";
import type { Player } from "./builds";
import { DEFAULT_VERSION, FactsError } from "./errors";
import { creationFields } from "./build-tools";
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
const linkSchema = z.object({ kind: z.enum(LINK_KINDS), name: z.string().min(1).max(160) }).describe('What it links to in the planner, by name: a quest ("Name (Line)" when two lines have one of that name), a quest line, a spell, an item, a follower, a person from the people pages, or a place from suggest_places ("Reach <place>" or "Clear <place>", its hook in the why line). Leave it out for the player\'s own aims; never invent a quest or a place.');
/**
 * What the save reads, as flat fields: quest (and stage), or reachKey and reachTarget. Every objective can also be
 * ticked by the player (WO-123); fromSave says whether the save ticks it too.
 */
const doneFields = {
  quest: z.string().min(1).max(160).optional().describe("For a done-once objective the save can show: the quest, by name or its id. A link to a quest does the same."),
  stage: z.number().int().min(0).optional().describe("With quest: the stage that means done; any stage when left out."),
  reachKey: z.string().min(1).max(60).optional().describe('For kind "reach": "Level", a skill\'s name, or a count\'s label ("books read").'),
  reachTarget: z.number().int().min(1).optional().describe('For kind "reach": the number to reach.'),
  fromSave: z.boolean().optional().describe("Whether the save ticks it when it shows it done: true by default when it's linked to a quest or is a number to reach. The player can always tick it too."),
  byHand: z.boolean().optional().describe("Kept for a release: the opposite of fromSave."),
};
const objectiveFields = {
  playthrough,
  act,
  text: z.string().min(1).max(160).describe("One thing the player can know is done, in plain instructions (rule 14). Not every, each, always or whenever: that's the act's throughout the act (standingRule)."),
  link: linkSchema.optional(),
  kind: z.enum(["once", "reach"]).describe("once: done once. reach: a number to reach."),
  ...doneFields,
  why: z.string().max(300).optional().describe("One line, Play only. Open it with how it ties to the act's route or her reason to travel (\"On the way to Whiterun\", \"Before she leaves Whiterun for Markarth\", \"Asked by Andurs in Whiterun\"), then why, or where it starts (rule 21). Quest facts from the planner; say \"not checked yet\" when it does."),
  stop: z.string().max(80).optional().describe("The stop on the act's route it sits at, by the stop's place (set_act's route). Play lists objectives under their stops, in route order; one with no stop goes last, under On the road."),
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
    "Make a character with a run in the player's account: with character creation's fields (race, birthsign, majors, minors...), the build and the run together, Act I set from the start; or with build, a run on one of the player's builds. Both private and drafted by you; the player reads and publishes. At most 10 private drafted runs per player. Settle the style guide's Before you design questions (rules 27 to 36) with the player first, and keep their answers with set_details. A reason to travel usually comes from the story as you write the acts (rule 19); don't ask for it up front.",
    z.object({
      name: z.string().min(1).max(80).describe("The character's name: the run's, and the new build's."),
      line: z.string().max(140).optional().describe("One sentence: who the character is."),
      build: z.string().max(80).optional().describe("One of the player's own builds, by id or name, instead of the creation fields."),
      version: z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`),
      // Character creation, as create_build takes it (WO-110), for a new build with the run.
      ...z.object(creationFields).partial().shape,
    }),
    (p, a: Parameters<typeof t.createPlaythrough>[1]) => t.createPlaythrough(p, a),
  );
  tool(
    "set_playthrough",
    "Change a playthrough's details",
    'Change one of the player\'s playthroughs: its name, its one line, or the build it follows (one of the player\'s builds by id or name, or "none" to unlink).',
    z.object({
      playthrough,
      name: z.string().min(1).max(80).optional(),
      line: z.string().max(140).optional().describe("One sentence: who the character is."),
      build: z.string().min(1).max(80).optional().describe('One of the player\'s own builds, by id or name, or "none" for no build.'),
    }),
    (p, a: Parameters<typeof t.setPlaythrough>[1]) => t.setPlaythrough(p, a),
  );
  tool(
    "set_theme",
    "Write who she is",
    "Write who the character is, for the Playthrough tab's first view (all optional; what you give replaces what was there; an empty string or list takes it away): backstory (events in order in flat sentences, up to 3,000 characters, paragraphs apart with a blank line), from, gods and goal (a plain fact each, 80 characters), and three lists of up to 6 lines of 90 characters: will (what she does), never (what she won't do) and grey (what she does and isn't proud of). Each list line is one thing the player does or avoids in the game, in the game's words, with no colon. An em dash, \" · \" or an emoji anywhere is refused, and so is a line over its length; nothing is cut for you. never is the same list set_details keeps, and the quest tools keep to it. Read the style guide's Who she is section first.",
    z.object({
      playthrough,
      backstory: z.string().max(3200).optional().describe("Where she's from, who raised her, what happened, and why she is in Skyrim, in order, in flat sentences. No sayings, no riddles, nothing the player can't use. Up to 3,000 characters."),
      from: z.string().max(100).optional().describe("Where she is from, one plain fact (80 characters)."),
      gods: z.string().max(100).optional().describe("The gods she follows, one plain fact (80 characters)."),
      goal: z.string().max(100).optional().describe("What she is in Skyrim for, one plain fact (80 characters)."),
      will: z.array(z.string().max(120)).max(8).optional().describe("What she will do, up to 6 lines of 90 characters."),
      never: z.array(z.string().max(120)).max(8).optional().describe("What she won't do, up to 6 lines of 90 characters. The quest tools keep to it."),
      grey: z.array(z.string().max(120)).max(8).optional().describe("What she does that she isn't proud of, up to 6 lines of 90 characters."),
    }),
    (p, a: Parameters<typeof t.setTheme>[1]) => t.setTheme(p, a),
  );
  const actFields = {
    name: z.string().min(1).max(60),
    levels: z.string().max(30).describe('"1 to 6", or "40 and up".'),
    place: z.string().max(80).describe("Where the act happens."),
    goal: z.string().max(200).describe("The act's goal in one line, Play only."),
    standingRule: z.string().max(200).optional().describe("Throughout the act: what the player keeps doing all through it, if anything. Not an objective."),
    passedBy: z
      .array(z.object({ place: z.string().min(1).max(80).describe("A place from suggest_places."), why: z.string().max(120).describe('Why she leaves it alone, Play only: "not her fight yet".') }))
      .max(8)
      .optional()
      .describe("The places she leaves alone on purpose in this act, each with one line on why (rule 20). The whole list each time; an empty list takes them away."),
    route: z
      .array(z.object({
          place: z.string().min(1).max(80).describe("A town, or a place from suggest_places."),
          why: z.string().max(200).describe("Why she goes there next, in one line, Play only."),
          by: z.enum(["foot", "carriage"]).optional().describe('How she gets here from the stop before it: "foot" (the default) or "carriage". The act\'s map draws a carriage leg as a gold dotted line.'),
        }))
      .max(12)
      .optional()
      .describe("The act's road (rule 21): its stops in the order she reaches them, each with why she goes there next. Set it before writing the act's objectives; each objective then takes one of these places as its stop. The whole route each time: a stop left out goes, and its objectives go On the road."),
  };
  tool("add_act", "Add an act", "Add an act at the end of one of the player's playthroughs: a stretch of the game with a goal and a place (rule 13).", z.object({ playthrough, ...actFields }), (p, a: Parameters<typeof t.addAct>[1]) => t.addAct(p, a));
  tool(
    "set_act",
    "Change an act",
    "Change an act's name, levels, place, goal, what the player keeps doing throughout it (standingRule), its route: the stops in order, each with why she goes there next (rule 21), or the places she passes by (passedBy, rule 20).",
    z.object({ playthrough, act, name: actFields.name.optional(), levels: actFields.levels.optional(), place: actFields.place.optional(), goal: actFields.goal.optional(), standingRule: z.string().max(200).optional().describe("Throughout the act: what the player keeps doing all through it; an empty string takes it away."), passedBy: actFields.passedBy, route: actFields.route }),
    (p, a: Parameters<typeof t.setAct>[1]) => t.setAct(p, a),
  );
  tool("remove_act", "Remove an act", "Remove an act and its objectives; the last act stays.", z.object({ playthrough, act }), (p, a: Parameters<typeof t.removeAct>[1]) => t.removeAct(p, a));
  tool("move_act", "Move an act", "Move an act to a position (1 is first).", z.object({ playthrough, act, to: z.number().int().min(1) }), (p, a: Parameters<typeof t.moveAct>[1]) => t.moveAct(p, a));
  tool(
    "add_objective",
    "Add an objective",
    "Add an objective to an act: one thing the player can know is done (rule 14). The player can always tick it; link it to a quest (link, or quest and stage) or make it a number to reach (reachKey and reachTarget, kind reach) and the save ticks it too (fromSave, on by default then). Refused, with the rule's words, for words like every, each, always, whenever, or starting Keep, Always or Never.",
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
    "Change an objective's words, link, kind, what the save reads (quest and stage, or reachKey and reachTarget), whether the save ticks it (fromSave), why line, or its stop on the act's route (\"none\" for On the road); checked by rule 14 again.",
    z.object({ playthrough, objective, text: objectiveFields.text.optional(), link: linkSchema.optional(), unlink: z.boolean().optional().describe("true to take the link away."), kind: objectiveFields.kind.optional(), ...doneFields, why: objectiveFields.why, stop: objectiveFields.stop }),
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
    "Any objective's status, when the player tells you: todo, doing, done or later. One the save ticks is done from the save as well; either counts.",
    z.object({ playthrough, objective, status: z.enum(["todo", "doing", "done", "later"]) }),
    (p, a: Parameters<typeof t.setStatus>[1]) => t.setStatus(p, a),
  );
  tool(
    "set_snapshot",
    "Where the player stands, from the save",
    'Set where the player stands from their save, read from the save on their PC: source "save" only. Never a value you estimated or the player guessed (rule 18): the player enters it by hand on the site. The quest stages you send are read back as the player\'s quest log with get_quest_log.',
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
  tool("get_playthrough", "Read a playthrough", "Get one of the player's playthroughs in the plain shape the inputs use: its acts, objectives with how each stands (done is the save's or the player's) and the chapters that unlock from each, the story's chapters in reading order (each with its act and unlocksWhen), and where the player stands.", z.object({ playthrough }), (p, a: { playthrough: string }) => t.getPlaythroughTool(p, a));
  tool(
    "get_quest_log",
    "The player's quest log, from their save",
    "What's in the player's quest log, from the save stored on a playthrough (set_snapshot): the quests under way with the objective each shows now, then finished and failed ones behind a count, each with its ending, in the game's words and grouped by quest line. A stage the records don't explain is said so; quests the planner doesn't list are only counted. Says how old the save is. With no save stored, it says so: ask the player to run the save connector.",
    z.object({ playthrough }),
    (p, a: { playthrough: string }) => t.getQuestLog(p, a),
  );
  tool(
    "suggest_places",
    "Places near an act",
    "The caves, mines, forts, ruins, camps, lairs and landmarks near where an act goes (its place, its quests' towns, earlier acts' places), from the planner's places index: each with its type, hold, nearest town, levels and boss, clear XP, what in the game points at it (who says what and where they stand, or the book), any quest that already goes there, and when against the act's levels (fits now; plant now, pay off later; too high for this act). Also what the playthrough already uses. With where and levels in place of a playthrough and act, the same for a town, a hold or a place at those levels, with nothing used yet. Never a stop (a town, inn, temple, keep, stable or home). It changes nothing (rule 20).",
    z.object({
      playthrough: playthrough.optional().describe("With act: the stored act to read."),
      act: act.optional().describe("With playthrough: the stored act to read."),
      where: z.string().min(1).max(80).optional().describe('Instead of a stored act: a town, a hold (every town in it) or a place, "Solitude", "Haafingar", "Embershard Mine".'),
      levels: z.string().min(1).max(20).optional().describe('With where: the levels, "15 to 20".'),
    }),
    (p, a: { playthrough?: string; act?: string; where?: string; levels?: string }) => t.suggestPlaces(p, a),
  );
  tool("list_my_playthroughs", "List the player's playthroughs", "List the signed-in player's playthroughs: id, name, who can see it, acts, last change, and whether an assistant drafted it.", z.object({}), (p) => t.listMine(p));
  tool(
    "finish_draft_playthrough",
    "Check a playthrough is ready",
    "Check one of the player's playthroughs once more: every act has an objective and every chapter that unlocks has an objective to unlock after. It changes nothing; the answer is the review link, or the issues. Publishing is the player's, on the site.",
    z.object({ playthrough }),
    (p, a: { playthrough: string }) => t.finishDraft(p, a),
  );

  server.registerTool(
    "suggest_quests",
    {
      title: "Quests to suggest",
      description: "Stories whose starts the planner has checked in the game files and whose first quest is open for the player, not done yet, each with its checked start, why it's open and the planner's link. Never a quest the planner can't judge. Offer them as suggestions (suggest_objective); nothing is added unless the player accepts.",
      inputSchema: z.object({
        level: z.number().int().min(1).max(100),
        where: z.string().max(80).optional().describe("A hold or place to keep to."),
        done: z.array(z.string().max(120)).max(200).optional().describe("Quest lines (ids or names) and quests (EDIDs or names) the player has finished, from what they said."),
        playthrough: z.string().max(80).optional().describe("One of the player's playthroughs: its save's quest stages and what it has ticked (needs sign-in)."),
      }),
    },
    async (args: { level: number; where?: string; done?: string[]; playthrough?: string }, ctx: Ctx) =>
      guarded(() => {
        const userId = (ctx.http?.authInfo as PlannerAuth | undefined)?.extra?.userId;
        return t.suggestQuests(origin, args, typeof userId === "string" ? userId : null);
      }),
  );
}
