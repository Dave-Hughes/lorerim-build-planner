import { endpoint, json } from "@/lib/oauth/http";
import { registerClient } from "@/lib/oauth/store";
import { OAuthFailure } from "@/lib/oauth/core";

/** POST /oauth/register (RFC 7591, WO-109): a public client registers and gets a random client_id. */
const handle = endpoint(async (req) => {
  const meta = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!meta || typeof meta !== "object") throw new OAuthFailure("invalid_client_metadata", "Send the client's metadata as JSON.");
  const c = await registerClient(meta);
  return json(
    {
      client_id: c.id,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: c.name,
      redirect_uris: c.redirectUris,
      token_endpoint_auth_method: "none",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
    },
    201,
  );
});

export { handle as POST, handle as OPTIONS };
