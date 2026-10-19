import "server-only";
import { mcpOn } from "@/lib/features";
import { ipCall } from "@/lib/moderation/limits";
import { OAuthFailure } from "./core";

/** The OAuth endpoints' shared parts (WO-109): the switch, 30 calls a minute per IP, CORS and errors. */

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, mcp-protocol-version",
  "Access-Control-Max-Age": "86400",
};

export const callerIp = (req: Request) => req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...cors, ...headers } });
}

export const oauthError = (code: string, description: string, status = 400) => json({ error: code, error_description: description }, status);

/** Not found when the MCP switch is off; a 429 past the limit; else the endpoint's own answer. */
export function endpoint(run: (req: Request) => Promise<Response> | Response) {
  return async (req: Request): Promise<Response> => {
    if (!mcpOn()) return new Response("Not found", { status: 404 });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const over = await ipCall("oauth", callerIp(req));
    if (over) return oauthError("slow_down", over, 429);
    try {
      return await run(req);
    } catch (e) {
      if (e instanceof OAuthFailure) return oauthError(e.code, e.message, e.code === "invalid_client" ? 401 : 400);
      throw e;
    }
  };
}

/** A token or register request's fields: form-encoded, as the spec says, or JSON. */
export async function fields(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(body).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)]));
  }
  return Object.fromEntries(new URLSearchParams(await req.text()));
}
