import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { mcpOn } from "@/lib/features";
import { DEFAULT_VERSION, FACT_KINDS, FactsError, checkProgression, getPerk, getQuestStart, getSpell, searchFacts, styleGuide } from "@/lib/mcp/facts";
import { answer, type Answer } from "@/lib/mcp/answer";
import { mcpCall } from "@/lib/moderation/limits";

/**
 * The planner's MCP route (WO-108): read-only facts for assistants, no sign-in. Each tool answers
 * from the planner's data for a LoreRim version, 60 calls a minute per IP, 64 KB an answer at most.
 * Off unless mcpOn() (on in dev and on staging): then it's not found.
 */

const version = z.string().max(20).optional().describe(`The LoreRim version, ${DEFAULT_VERSION} if left out.`);

const refuse = (message: string): Answer => ({ content: [{ type: "text", text: message }], isError: true });

/** The caller's IP: Vercel sets x-forwarded-for itself, so a caller can't choose it there. */
function callerIp(req: Request): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Every tool's run: the limit first, then the facts; a refusal says why in plain words. */
async function guarded(ip: string, run: () => unknown): Promise<Answer> {
  const over = await mcpCall(ip);
  if (over) return refuse(over);
  try {
    return answer(run());
  } catch (e) {
    if (e instanceof FactsError) return refuse(e.message);
    throw e;
  }
}

function handlerFor(ip: string) {
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
          description: "Run a build plan (the planner editor's JSON) through the planner's rules and return its issues, where it stands at its last level, and the perks it can take there.",
          inputSchema: z.object({ build: z.record(z.string(), z.unknown()).describe("The build plan, as the editor saves it.") }),
        },
        async ({ build }) => guarded(ip, () => checkProgression(build)),
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
    },
    { serverInfo: { name: "LoreRim Build Planner", version: "1.0.0" } },
  );
}

async function handle(req: Request): Promise<Response> {
  if (!mcpOn()) return new Response("Not found", { status: 404 });
  return handlerFor(callerIp(req))(req);
}

export { handle as GET, handle as POST };
