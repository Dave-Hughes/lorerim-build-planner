import { generateProtectedResourceMetadata } from "mcp-handler";
import { GRANTABLE } from "@/lib/oauth/core";
import { endpoint, json } from "@/lib/oauth/http";
import { MCP_PATH, resourceAt } from "@/lib/oauth/resource";
import { originOf } from "@/lib/oauth/store";

/**
 * RFC 9728 metadata for the MCP route (WO-109), served at /.well-known/oauth-protected-resource by a
 * rewrite, and at its path form, /.well-known/oauth-protected-resource/api/mcp/<rest> (WO-109b), each
 * naming the door's path the client used as `resource`.
 */
const handle = endpoint(async (req: Request) => {
  const origin = originOf(req);
  const path = new URL(req.url).pathname.replace(/^\/oauth\/metadata\/protected-resource/, "").replace(/^\/\.well-known\/oauth-protected-resource/, "");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  // The door's own path form (/api/mcp/<rest>); anything else, or nothing, names /api/mcp.
  const under = parts.slice(0, 2).join("/") === MCP_PATH.slice(1) ? parts.slice(2) : [];
  return json(generateProtectedResourceMetadata({ authServerUrls: [origin], resourceUrl: resourceAt(origin, under), additionalMetadata: { scopes_supported: GRANTABLE, resource_name: "LoreRim Build Planner" } }), 200, {
    "cache-control": "max-age=3600",
  });
});

export { handle as GET, handle as OPTIONS };
