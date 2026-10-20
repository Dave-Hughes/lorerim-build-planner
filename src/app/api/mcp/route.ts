import { createMcpHandler, getPublicOrigin, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { mcpOn, playthroughsOn } from "@/lib/features";
import { DEFAULT_VERSION, FACT_KINDS, FactsError, checkProgression, getPerk, getQuestStart, getSpell, searchFacts, styleGuide } from "@/lib/mcp/facts";
import { answer, type Answer } from "@/lib/mcp/answer";
import { mcpCall } from "@/lib/moderation/limits";
import { creationFields, gearRow, levelFields, registerBuildTools } from "@/lib/mcp/build-tools";
import { registerPlaythroughTools } from "@/lib/mcp/playthrough-tools";
import { checkPlan } from "@/lib/mcp/facts";
import { getBuild as readableBuild } from "@/lib/builds/queries";
import { versionData } from "@/lib/mcp/errors";
import { signedIn, verifyBearer, whoami, type PlannerAuth } from "@/lib/oauth/mcp-auth";

/**
 * The planner's MCP route (WO-108, WO-110, WO-111): facts for assistants with no sign-in, and, signed in with
 * builds:write or playthroughs:write, drafts in the player's account. Each tool answers from the planner's data for a
 * LoreRim version, 60 calls a minute per IP, 64 KB an answer at most.
 * Off unless mcpOn() (on in dev and on staging): then it's not found.
 */

const version = z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`);

const refuse = (message: string): Answer => ({ content: [{ type: "text", text: message }], isError: true });

/** The caller's IP: Vercel sets x-forwarded-for itself, so a caller can't choose it there. */
function callerIp(req: Request): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Every tool's run: the limit first, then the facts; a refusal says why in plain words. */
async function guarded(ip: string, run: () => unknown | Promise<unknown>): Promise<Answer> {
  const over = await mcpCall(ip);
  if (over) return refuse(over);
  try {
    return answer(await run());
  } catch (e) {
    if (e instanceof FactsError) return refuse(e.message);
    throw e;
  }
}

function handlerFor(ip: string, origin: string) {
  return createMcpHandler(
    (server) => {
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
        async ({ query, kinds, version: v }) => guarded(ip, () => searchFacts(query, kinds, v)),
      );
      server.registerTool(
        "get_perk",
        {
          title: "A perk",
          description: "Get one LoreRim perk by id or name: its tree, ranks, what each rank needs (skill level, perks, items) and says, and the perks it rules out.",
          inputSchema: z.object({ id: z.string().max(120).optional(), name: z.string().max(120).optional(), version }),
        },
        async ({ id, name, version: v }) => guarded(ip, () => getPerk({ id, name }, v)),
      );
      server.registerTool(
        "get_spell",
        {
          title: "A spell",
          description: "Get one LoreRim spell by id or name: its school, tier, cost, effect, the tomes that teach it, and whether the planner knows where it's sold.",
          inputSchema: z.object({ id: z.string().max(120).optional(), name: z.string().max(120).optional(), version }),
        },
        async ({ id, name, version: v }) => guarded(ip, () => getSpell({ id, name }, v)),
      );
      server.registerTool(
        "get_quest_start",
        {
          title: "How a quest line starts",
          description: "Get how a LoreRim quest line or story starts: who, where, how, its level gate and what else it needs, with where each fact was checked; unchecked lines say so and give no instructions.",
          inputSchema: z.object({ id: z.string().min(1).max(120).describe("A quest line or story id, from search_facts."), version }),
        },
        async ({ id, version: v }) => guarded(ip, () => getQuestStart(id, v)),
      );
      server.registerTool(
        "check_progression",
        {
          title: "Check a build",
          description: "Run a build through the planner's rules, given in the plain shape get_build returns or as a build id, and return its issues by level, where it stands at its last level, and the perks it can take there.",
          inputSchema: z.object({
            build: z
              .union([
                z.string().min(1).max(40).describe("A build id: the player's own, or a Listed or Link only build."),
                z.object({ gameVersion: z.string().max(20).optional(), ...creationFields, levels: z.array(z.object({ level: z.number().int().optional(), ...levelFields })).min(1).max(100), gear: z.array(gearRow).max(60).optional() }),
              ])
              .describe("The build: an id, or the plain shape get_build returns."),
          }),
        },
        async ({ build }, ctx) =>
          guarded(ip, async () => {
            if (typeof build !== "string") return checkProgression(build);
            const userId = (ctx.http?.authInfo as PlannerAuth | undefined)?.extra?.userId;
            const b = await readableBuild(build, typeof userId === "string" ? userId : null);
            if (!b) throw new FactsError(`No build you can see has the id ${build}.`);
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
          guarded(ip, async () => {
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
        async () => guarded(ip, () => styleGuide()),
      );
      registerBuildTools(server, (run) => guarded(ip, run), origin);
      // Playthroughs (WO-111), while their switch is on.
      if (playthroughsOn()) registerPlaythroughTools(server, (run) => guarded(ip, run), origin);
    },
    { serverInfo: { name: "LoreRim Build Planner", version: "1.0.0" } },
  );
}

/**
 * A bearer token, when sent, must be live (WO-109): a bad one gets 401 with the challenge pointing at
 * /.well-known/oauth-protected-resource. No token passes through to the open facts tools.
 */
async function handle(req: Request): Promise<Response> {
  if (!mcpOn()) return new Response("Not found", { status: 404 });
  return withMcpAuth(handlerFor(callerIp(req), getPublicOrigin(req)), verifyBearer, { required: false, resourceMetadataPath: "/.well-known/oauth-protected-resource" })(req);
}

export { handle as GET, handle as POST };
