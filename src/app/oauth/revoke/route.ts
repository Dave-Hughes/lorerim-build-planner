import { revokeToken } from "@/lib/oauth/core";
import { endpoint, fields } from "@/lib/oauth/http";
import { dbStore } from "@/lib/oauth/store";
import { cors } from "@/lib/oauth/http";

/** POST /oauth/revoke (RFC 7009, WO-109): revokes a token and its pair. Always 200, as the RFC asks. */
const handle = endpoint(async (req) => {
  const f = await fields(req);
  if (f.token) await revokeToken(dbStore, f.token);
  return new Response(null, { status: 200, headers: cors });
});

export { handle as POST, handle as OPTIONS };
