import { exchangeCode, OAuthFailure, refreshTokens } from "@/lib/oauth/core";
import { endpoint, fields, json } from "@/lib/oauth/http";
import { dbStore, originOf, resourceOf } from "@/lib/oauth/store";

/** POST /oauth/token (WO-109): authorization_code with PKCE, and refresh_token, rotated on every use. */
const handle = endpoint(async (req) => {
  const f = await fields(req);
  if (f.client_secret) throw new OAuthFailure("invalid_client", "Only public clients: no client_secret.");
  if (f.resource && f.resource !== resourceOf(originOf(req))) throw new OAuthFailure("invalid_target", "The resource must be this planner's MCP URL.");
  if (f.grant_type === "authorization_code") {
    if (!f.code || !f.client_id || !f.redirect_uri) throw new OAuthFailure("invalid_request", "code, client_id and redirect_uri are required.");
    return json(await exchangeCode(dbStore, { code: f.code, verifier: f.code_verifier ?? null, clientId: f.client_id, redirectUri: f.redirect_uri, resource: f.resource }));
  }
  if (f.grant_type === "refresh_token") {
    if (!f.refresh_token || !f.client_id) throw new OAuthFailure("invalid_request", "refresh_token and client_id are required.");
    return json(await refreshTokens(dbStore, { refreshToken: f.refresh_token, clientId: f.client_id }));
  }
  throw new OAuthFailure("unsupported_grant_type", "grant_type must be authorization_code or refresh_token.");
});

export { handle as POST, handle as OPTIONS };
