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
import { gateOf } from "@/lib/mcp/sign-in-tools";
import { OAuthError, OAuthErrorCode, bearerAuthChallengeResponse } from "@modelcontextprotocol/server";

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

/** The bearer token sent, if any. */
function bearerOf(req: Request): string | undefined {
  const [type, token] = req.headers.get("authorization")?.split(" ") ?? [];
  return type?.toLowerCase() === "bearer" && token ? token : undefined;
}

/**
 * A bearer token, when sent, must be live (WO-109): a bad one gets 401 with the challenge pointing at
 * the protected resource metadata. No token passes through to the open facts tools. On any path under
 * /api/mcp (WO-109b), the challenge names that path's metadata, and a call to a tool that needs sign-in
 * with no token is a 401 that starts sign-in; with a token missing the tool's scope, a 403 naming it.
 */
async function handle(req: Request): Promise<Response> {
  if (!mcpOn()) return new Response("Not found", { status: 404 });
  const origin = getPublicOrigin(req);
  const path = new URL(req.url).pathname.replace(/\/+$/, "");
  const metadataPath = `/.well-known/oauth-protected-resource${path === "/api/mcp" ? "" : path}`;
  if (req.method === "POST") {
    const body = await req
      .clone()
      .json()
      .catch(() => null);
    const bearer = bearerOf(req);
    // A token that doesn't verify is withMcpAuth's to refuse, as before.
    const token = bearer ? await verifyBearer(req, bearer).catch(() => undefined) : null;
    if (!bearer || token) {
      const gate = gateOf(body, token ?? null);
      const challenge = { resourceMetadataUrl: `${origin}${metadataPath}` };
      if (gate?.refuse === "sign-in") return bearerAuthChallengeResponse(new OAuthError(OAuthErrorCode.InvalidToken, "Sign in to use this tool."), challenge);
      if (gate?.refuse === "scope") return bearerAuthChallengeResponse(new OAuthError(OAuthErrorCode.InsufficientScope, `This tool needs ${gate.scope}.`), { ...challenge, requiredScopes: [gate.scope] });
    }
  }
  return withMcpAuth(handlerFor(callerIp(req), origin), verifyBearer, { required: false, resourceMetadataPath: metadataPath })(req);
}

export { handle as GET, handle as POST };
