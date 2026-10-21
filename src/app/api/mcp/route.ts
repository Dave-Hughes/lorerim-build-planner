import { createMcpHandler, getPublicOrigin, withMcpAuth } from "mcp-handler";
import { mcpOn, playthroughsOn } from "@/lib/features";
import { FactsError } from "@/lib/mcp/facts";
import { registerFactTools } from "@/lib/mcp/fact-tools";
import { answer, type Answer } from "@/lib/mcp/answer";
import { mcpCall } from "@/lib/moderation/limits";
import { recordDoorEvent } from "@/lib/mcp/door-events";
import { registerBuildTools } from "@/lib/mcp/build-tools";
import { registerPlaythroughTools } from "@/lib/mcp/playthrough-tools";
import { verifyBearer } from "@/lib/oauth/mcp-auth";

/**
 * The planner's MCP route (WO-108, WO-110, WO-111): facts for assistants with no sign-in, and, signed in with
 * builds:write or playthroughs:write, drafts in the player's account. Each tool answers from the planner's data for a
 * LoreRim version, 60 calls a minute per IP, 64 KB an answer at most.
 * Off unless mcpOn() (on in dev and on staging): then it's not found.
 */

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
      // Every call is counted (WO-119): its tool, outcome and code, and what it named; never who or what it said.
      const register = server.registerTool.bind(server);
      server.registerTool = ((name: string, config: unknown, cb: (args: unknown, ctx: unknown) => Promise<Answer>) =>
        register(name, config as never, (async (args: unknown, ctx: unknown) => {
          const res = await cb(args, ctx);
          await recordDoorEvent(name, args, res);
          return res;
        }) as never)) as typeof server.registerTool;
      registerFactTools(server, (run) => guarded(ip, run));
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
