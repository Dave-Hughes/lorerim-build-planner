import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getPublicOrigin } from "mcp-handler";
import { auth } from "@/auth";
import { mcpOn } from "@/lib/features";
import { ipCall } from "@/lib/moderation/limits";
import { SCOPES } from "@/lib/oauth/core";
import { checkRequest, consentToken } from "@/lib/oauth/consent";
import { decide } from "@/lib/oauth/consent-actions";
import { resourceOf } from "@/lib/oauth/store";
import styles from "./consent.module.css";

export const metadata: Metadata = { title: "Allow an assistant", robots: { index: false } };
export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;

/**
 * The consent page (WO-109): an assistant asks to use the player's account; the player sees its name
 * and what it may do, and allows or denies. Behind the Discord sign-in.
 */
export default async function AuthorizePage({ searchParams }: { searchParams: Search }) {
  if (!mcpOn()) notFound();
  const sp = await searchParams;
  const q = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await ipCall("oauth", ip)) return <Problem text="Too many tries. Try again in a minute." />;
  const userId = (await auth())?.user?.id;
  if (!userId) {
    const self = `/oauth/authorize?${new URLSearchParams(q as Record<string, string>).toString()}`;
    redirect(`/signin?next=${encodeURIComponent(self)}`);
  }
  const origin = getPublicOrigin(new Request(`${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost"}/`, { headers: h }));
  const checked = await checkRequest(q, resourceOf(origin));
  if (!checked.ok) {
    if ("back" in checked) redirect(checked.back);
    return <Problem text={checked.show} />;
  }
  const { client, scopes, req } = checked;
  const hidden = { client_id: req.clientId, redirect_uri: req.redirectUri, code_challenge: req.codeChallenge, code_challenge_method: "S256", response_type: "code", state: req.state ?? "", scope: req.scope ?? "", resource: req.resource ?? "", consent: consentToken(userId, req) };
  return (
    <main className={`page ${styles.main}`}>
      <section className={`frame ${styles.panel}`} aria-labelledby="consent-title">
        <h1 id="consent-title" className={`title ${styles.title}`}>
          Allow {client.name} to use your LoreRim Planner account?
        </h1>
        <p className={styles.lead}>{client.name} wants to use your LoreRim Planner account to:</p>
        <ul className={styles.scopes}>
          {scopes.map((s) => (
            <li key={s}>{SCOPES[s]}</li>
          ))}
        </ul>
        <form action={decide} className={styles.buttons}>
          {Object.entries(hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <button type="submit" name="decision" value="allow" className="btn btn-primary">
            Allow
          </button>
          <button type="submit" name="decision" value="deny" className="btn">
            Deny
          </button>
        </form>
        {client.kind === "cimd" && <p className={styles.from}>{client.id}</p>}
      </section>
    </main>
  );
}

function Problem({ text }: { text: string }) {
  return (
    <main className={`page ${styles.main}`}>
      <section className={`frame ${styles.panel}`} aria-labelledby="consent-title">
        <h1 id="consent-title" className={`title ${styles.title}`}>
          This sign-in can&apos;t go ahead
        </h1>
        <p className={styles.lead}>{text}</p>
      </section>
    </main>
  );
}
