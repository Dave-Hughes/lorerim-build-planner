import "server-only";
import type { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { getBuild as readableBuild } from "@/lib/builds/queries";
import { signedIn, whoami, type PlannerAuth } from "@/lib/oauth/mcp-auth";
import { creationFields, gearRow, levelFields } from "./build-tools";
import { versionData } from "./errors";
import { DEFAULT_VERSION, FACT_KINDS, FactsError, checkPlan, checkProgression, getPerk, getQuest, getSpell, searchFacts, styleGuide } from "./facts";

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
      description: "Find LoreRim perks, spells, traits, races, birthsigns, deities, quest lines and stories by name or word, 20 at most, each with its kind, id, name and one line.",
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
  const questInput = {
    id: z.string().min(1).max(120).optional().describe("A quest line or story id from search_facts, or a quest's EDID."),
    name: z.string().min(1).max(120).optional().describe("A quest's, quest line's or story's name."),
    version,
  };
  server.registerTool(
    "get_quest",
    {
      title: "A quest",
      description:
        "Get a LoreRim quest, quest line or story by id or name: how it starts (who, where, how, its level gate and what else it needs, with where each fact was checked; unchecked lines say so and give no instructions), and the quest's objectives and the endings its records list, each with when it shows. A line or story answers for its opening quest.",
      inputSchema: z.object(questInput),
    },
    async ({ id, name, version: v }) => guarded(() => getQuest({ id, name }, v)),
  );
  server.registerTool(
    "get_quest_start",
    {
      title: "How a quest line starts",
      description: "The same as get_quest, kept for assistants that still call it by this name. Use get_quest.",
      inputSchema: z.object(questInput),
    },
    async ({ id, name, version: v }) => guarded(() => getQuest({ id, name }, v)),
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
    "get_style_guide",
    {
      title: "How to write for the planner",
      description: "Get the planner's rules for writing builds, guides and playthroughs that will be published on it.",
      inputSchema: z.object({}),
    },
    async () => guarded(() => styleGuide()),
  );
}
