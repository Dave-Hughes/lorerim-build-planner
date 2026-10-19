import { SCOPE_LIST } from "@/lib/oauth/core";
import { endpoint, json } from "@/lib/oauth/http";
import { originOf } from "@/lib/oauth/store";

/** RFC 8414 metadata (WO-109), served at /.well-known/oauth-authorization-server by a rewrite. */
const handle = endpoint((req) => {
  const issuer = originOf(req);
  return json(
    {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/oauth/register`,
      revocation_endpoint: `${issuer}/oauth/revoke`,
      scopes_supported: SCOPE_LIST,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none"],
      revocation_endpoint_auth_methods_supported: ["none"],
      client_id_metadata_document_supported: true,
    },
    200,
    { "cache-control": "max-age=3600" },
  );
});

export { handle as GET, handle as OPTIONS };
