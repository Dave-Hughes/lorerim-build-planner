import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getBuild as readableBuild } from "@/lib/builds/queries";
import { signedIn, whoami, writer, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { questsOn } from "@/lib/features";
import { QuestReportError, fileQuestReport, lineFor } from "@/lib/quests/reports";
import { REPORT_TEXT_MAX, REPORT_THANKS, REPORT_WHAT } from "@/lib/quests/report-words";
import { creationFields, gearRow, levelFields } from "./build-tools";
import { versionData } from "./errors";
import { DEFAULT_VERSION, FACT_KINDS, FactsError, checkPlan, checkProgression, getPerk, getQuest, getCreation, getRules, getSpell, getTree, playerState, searchFacts, styleGuide } from "./facts";
import { toldOf } from "./playthroughs";

/**
 * The facts tools (WO-108), open with no sign-in, and whoami and get_style_guide. Out of the route so
 * a test can register every tool and read its input schema (WO-111b).
 */

type Server = Parameters<Parameters<typeof createMcpHandler>[0]>[0];
type Guarded = (run: () => unknown | Promise<unknown>) => Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }>;

const version = z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`);

export function registerFactTools(server: Server, guarded: Guarded) {
  server.registerTool(
    "search_facts",
    {
      title: "Search the planner's facts",
      description:
        "Find LoreRim perks, spells, traits, races, birthsigns, deities, quest lines, stories, quests and items (gear, by name, slot or type and material, ranked after the rest; use kinds [\"item\"] to look for gear before set_gear) by name or word, 20 at most, each with its kind, id, name and one line. A quest is also found by what players call it, the people and creatures in it, the book or note that starts it, its objectives and its endings, and says why it matched (\"Palonimo\" finds Running Wild: someone in it). When nothing matches, ask the player where they saw it or what it gives; don't search the web.",
      inputSchema: z.object({
        query: z.string().min(1).max(100).describe("A name or words to look for."),
        kinds: z.array(z.enum(FACT_KINDS)).optional().describe("Only these kinds."),
        version,
      }),
    },
    async ({ query, kinds, version: v }) => guarded(() => searchFacts(query, kinds, v)),
  );
  server.registerTool(
    "get_perk",
    {
      title: "A perk",
      description: "Get one LoreRim perk by id or name: its tree, ranks, what each rank needs (skill level, perks, items) and says, and the perks it rules out.",
      inputSchema: z.object({
        id: z.string().max(120).optional(),
        name: z.string().max(120).optional(),
        version,
      }),
    },
    async ({ id, name, version: v }) => guarded(() => getPerk({ id, name }, v)),
  );
  server.registerTool(
    "get_spell",
    {
      title: "A spell",
      description: "Get one LoreRim spell by id or name: its school, tier, cost, effect, the tomes that teach it, and whether the planner knows where it's sold.",
      inputSchema: z.object({
        id: z.string().max(120).optional(),
        name: z.string().max(120).optional(),
        version,
      }),
    },
    async ({ id, name, version: v }) => guarded(() => getSpell({ id, name }, v)),
  );
  server.registerTool(
    "get_tree",
    {
      title: "A whole perk tree",
      description: "Get every perk in one skill's tree at once (or Destiny), each with its ranks, the skill each rank needs, its prerequisite perks and what it rules out, by the skill it first needs. Plan a skill's perks from this instead of asking get_perk one by one.",
      inputSchema: z.object({ skill: z.string().min(1).max(40).describe('The skill or tree: "Two-Handed", "Restoration", "Destiny".'), version }),
    },
    async ({ skill, version: v }) => guarded(() => getTree({ skill }, v)),
  );
  server.registerTool(
    "get_creation",
    {
      title: "Character creation",
      description:
        "Everything character creation asks for, as the site's Set up shows it: how many majors, minors and traits and what each adds, the starting perk points, every race with its skills, powers and the gods it's offered at the start, every birthsign, the two modes, every start with its options, and every trait with its game text and the choice it asks (send it as traitChoices, or masterOfOneSkill). Read it before create_build.",
      inputSchema: z.object({ version }),
    },
    async ({ version: v }) => guarded(() => getCreation(v)),
  );
  server.registerTool(
    "get_rules",
    {
      title: "How points work",
      description: "The planner's progression rules as its checks count them: skill points a level, the most a skill can rise in one, what a point costs at each band, max skill at a level, perk points, Destiny points, attributes and trainers; level 1's rule (no skill points to spend); mounts and homes, where a character gets a horse and a house and what each costs; and activities, what LoreRim already lets a character do (performing at inns, fishing, paragliding, taming a horse, camping) and what it doesn't (Callings), so a player isn't sent to a mod for something the list ships. The same numbers as the style guide's How points work.",
      inputSchema: z.object({ version }),
    },
    async ({ version: v }) => guarded(() => getRules(v)),
  );
  const questInput = {
    id: z.string().min(1).max(120).optional().describe("A quest line or story id from search_facts, or a quest's EDID."),
    name: z.string().min(1).max(120).optional().describe("A quest's, quest line's or story's name."),
    version,
    // Where the player is (WO-115 Part 3): give any of these and the answer says whether it's open for them.
    level: z.number().int().min(1).max(100).optional().describe("The player's level, for openForYou."),
    done: z.array(z.string().max(120)).max(200).optional().describe("Quest lines (ids or names) and quests (EDIDs or names) the player has finished, from what they said."),
    playthrough: z.string().max(80).optional().describe("One of the player's playthroughs: its save's level and quest stages and what it has ticked (needs sign-in)."),
    places: z.boolean().optional().describe("true for every place a thing to read can be found; eight are given by default, grouped by area."),
  };
  type QuestArgs = { id?: string; name?: string; version?: string; level?: number; done?: string[]; playthrough?: string; places?: boolean };
  const quest = async (a: QuestArgs, ctx: { http?: { authInfo?: unknown } }) => {
    const told = a.level !== undefined || a.done?.length || a.playthrough;
    const userId = (ctx.http?.authInfo as PlannerAuth | undefined)?.extra?.userId;
    const player = told ? playerState(await toldOf(a, typeof userId === "string" ? userId : null), a.version) : null;
    return getQuest({ id: a.id, name: a.name, places: a.places }, a.version, player);
  };
  server.registerTool(
    "get_quest",
    {
      title: "A quest",
      description:
        "Get a LoreRim quest, quest line or story by id or name: how it starts (who, where, how, its level gate and what else it needs, with where each fact was checked; unchecked lines say so and give no instructions), and the quest's objectives and the endings its records list, each with when it shows. A line or story answers for its opening quest. A name that isn't a quest's finds the quest by what's in it, as search_facts does, and found says what matched. Give the player's level, what they've finished, or their playthrough, and openForYou says \"open for you\", \"locked: why\" or \"unknown: why\"; with a playthrough, \"locked for this character: why\" when the quest or what it needs is on the character's never list (set_details never). Never call a quest open unless it says open for you.",
      inputSchema: z.object(questInput),
    },
    async (a: QuestArgs, ctx) => guarded(() => quest(a, ctx)),
  );
  server.registerTool(
    "get_quest_start",
    {
      title: "How a quest line starts",
      description: "The same as get_quest, kept for assistants that still call it by this name. Use get_quest.",
      inputSchema: z.object(questInput),
    },
    async (a: QuestArgs, ctx) => guarded(() => quest(a, ctx)),
  );
  server.registerTool(
    "check_progression",
    {
      title: "Check a build",
      description:
        "Run a build through the planner's rules, given in the plain shape get_build returns (build) or by its id (buildId), and return its issues by level, where it stands at its last level, and the perks it can take there.",
      inputSchema: z.object({
        build: z
          .object({
            gameVersion: z.string().max(20).optional(),
            ...creationFields,
            levels: z
              .array(
                z.object({
                  level: z.number().int().optional(),
                  ...levelFields,
                }),
              )
              .min(1)
              .max(100),
            gear: z.array(gearRow).max(60).optional(),
          })
          .optional()
          .describe("The build in the plain shape get_build returns. Send this or buildId."),
        buildId: z.string().min(1).max(40).optional().describe("A build id: the player's own, or a Listed or Link only build. Send this or build."),
      }),
    },
    async ({ build, buildId }, ctx) =>
      guarded(async () => {
        if (build && buildId) throw new FactsError("Send the build or its buildId, not both.");
        if (build) return checkProgression(build);
        if (!buildId) throw new FactsError("Send the build in the plain shape get_build returns, or its buildId.");
        const userId = (ctx.http?.authInfo as PlannerAuth | undefined)?.extra?.userId;
        const b = await readableBuild(buildId, typeof userId === "string" ? userId : null);
        if (!b) throw new FactsError(`No build you can see has the id ${buildId}.`);
        return checkPlan(versionData(b.plan.gameVersion), b.plan);
      }),
  );
  server.registerTool(
    "whoami",
    {
      title: "Who you are on the planner",
      description: "Get the signed-in player's LoreRim Build Planner name and handle, and what this sign-in allows; needs the connector added with sign-in.",
      inputSchema: z.object({}),
    },
    async (_args, ctx) =>
      guarded(async () => {
        const who = signedIn(ctx.http?.authInfo as PlannerAuth | undefined);
        if ("refusal" in who) throw new FactsError(who.refusal);
        return whoami(who.userId, who.scopes);
      }),
  );
  server.registerTool(
    "report_quest",
    {
      title: "Report a quest page wrong",
      description:
        "File the player's report that the planner's facts for a quest are wrong: what the planner said and what the player saw in their game, in their words. It goes to the planner's admins, as the quest page's This was wrong does; needs the connector added with sign-in. 5 an hour per player.",
      inputSchema: z.object({
        quest: z.string().min(1).max(120).describe("The quest line's id or name, or the quest's EDID or name."),
        what: z.string().max(40).optional().describe(`What was wrong: ${REPORT_WHAT.join(", ")}. Something else if left out.`),
        said: z.string().max(REPORT_TEXT_MAX).describe("What the planner said."),
        saw: z.string().min(1).max(REPORT_TEXT_MAX).describe("What the player saw in their game, in their words."),
      }),
    },
    async ({ quest, what, said, saw }, ctx) =>
      guarded(async () => {
        if (!questsOn()) throw new FactsError("The quest pages aren't open yet.");
        const who = await writer(ctx.http?.authInfo as PlannerAuth | undefined, "facts");
        if ("refusal" in who) throw new FactsError(who.refusal);
        const found = lineFor(quest);
        if (!found) throw new FactsError(`No quest or quest line called ${quest}. search_facts finds its id.`);
        try {
          await fileQuestReport({ userId: who.userId, lineId: found.lineId, quest: found.edid, what: what || "Something else", said, text: saw, source: "assistant", client: who.clientName });
        } catch (e) {
          if (e instanceof QuestReportError) throw new FactsError(e.message);
          throw e;
        }
        return { sent: true, line: found.lineId, message: `${REPORT_THANKS} Tell the player it was sent.` };
      }),
  );
  server.registerTool(
    "get_style_guide",
    {
      title: "How to write for the planner",
      description: "Get the planner's rules for writing builds, guides and playthroughs that will be published on it.",
      inputSchema: z.object({}),
    },
    async () => guarded(() => styleGuide()),
  );
}
