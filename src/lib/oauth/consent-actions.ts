"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { mcpOn } from "@/lib/features";
import { issueCode } from "./core";
import { checkRequest, consentTokenOk, errorRedirect, type AuthRequest } from "./consent";
import { dbStore, resourceOf } from "./store";
import { getPublicOrigin } from "mcp-handler";

/**
 * Allow or Deny on the consent page (WO-109). The request is checked again here, the form's token
 * must be this player's for this request, and only then is a code issued.
 */
export async function decide(form: FormData): Promise<void> {
  if (!mcpOn()) redirect("/");
  const userId = (await auth())?.user?.id;
  if (!userId) redirect("/signin");
  const h = await headers();
  const origin = getPublicOrigin(new Request(`${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost"}/`, { headers: h }));
  const q = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const checked = await checkRequest(q, resourceOf(origin));
  if (!checked.ok) redirect("back" in checked ? checked.back : "/");
  const r: AuthRequest = checked.req;
  if (!consentTokenOk(q.consent ?? "", userId, r)) redirect(errorRedirect(r.redirectUri, "access_denied", r.state, "The consent form didn't match this sign-in."));
  if (q.decision !== "allow") redirect(errorRedirect(r.redirectUri, "access_denied", r.state));
  const code = await issueCode(dbStore, { clientId: r.clientId, userId, redirectUri: r.redirectUri, codeChallenge: r.codeChallenge, scopes: checked.scopes, resource: r.resource });
  const to = new URL(r.redirectUri);
  to.searchParams.set("code", code);
  if (r.state) to.searchParams.set("state", r.state);
  redirect(to.toString());
}
