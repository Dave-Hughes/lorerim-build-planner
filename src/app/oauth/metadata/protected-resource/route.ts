import { generateProtectedResourceMetadata } from "mcp-handler";
import { SCOPE_LIST } from "@/lib/oauth/core";
import { endpoint, json } from "@/lib/oauth/http";
import { originOf, resourceOf } from "@/lib/oauth/store";

/** RFC 9728 metadata for the MCP route (WO-109), served at /.well-known/oauth-protected-resource by a rewrite. */
const handle = endpoint((req) => {
  const origin = originOf(req);
  return json(generateProtectedResourceMetadata({ authServerUrls: [origin], resourceUrl: resourceOf(origin), additionalMetadata: { scopes_supported: SCOPE_LIST, resource_name: "LoreRim Build Planner" } }), 200, {
    "cache-control": "max-age=3600",
  });
});

export { handle as GET, handle as OPTIONS };
