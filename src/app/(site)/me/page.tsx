import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { SignInButton } from "@/components/site-header";
import { handleFor, listBuildsByOwner } from "@/lib/builds/queries";
import { Assistants } from "@/components/account/assistants";
import { mcpOn, playthroughsOn } from "@/lib/features";
import { PlaythroughCards } from "@/components/playthrough/cards";
import { listMyPlaythroughs } from "@/lib/playthroughs/queries";
import { SCOPES, type Scope } from "@/lib/oauth/core";
import { connectedAssistants } from "@/lib/oauth/assistants";
import styles from "../home.module.css";

export const metadata: Metadata = { title: "My builds" };
export const dynamic = "force-dynamic";

export default async function MyBuilds() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return (
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>
          My builds
        </h1>
        <p className="muted">Sign in to see the builds you have made.</p>
        <SignInButton redirectTo="/me" />
      </main>
    );
  }
  const [builds, handle, assistants, playthroughs] = await Promise.all([
    listBuildsByOwner(userId),
    handleFor(userId),
    mcpOn() ? connectedAssistants(userId) : Promise.resolve(null),
    playthroughsOn() ? listMyPlaythroughs(userId) : Promise.resolve(null),
  ]);
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={`title ${styles.h1}`}>
          My builds
        </h1>
        <span className={styles.headActions}>
          {handle && (
            <Link href={`/u/${handle}`} className="btn btn-sm">
              My page
            </Link>
          )}
          <Link href="/new" className="btn btn-primary btn-sm">
            New build
          </Link>
        </span>
      </div>
      {builds.length === 0 ? (
        <p className="muted">None yet.</p>
      ) : (
        <BuildGrid>
          {builds.map((b) => (
            <BuildCard key={b.id} build={b} mine />
          ))}
        </BuildGrid>
      )}
      {/* My playthroughs (WO-111), under My builds, while the switch is on. */}
      {playthroughs && (
        <section id="playthroughs" aria-labelledby="my-playthroughs" style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48 }}>
          <div className={styles.head}>
            <h2 id="my-playthroughs" className={`title ${styles.h1}`}>
              My playthroughs
            </h2>
            <span className={styles.headActions}>
              <Link href="/playthroughs/new" className="btn btn-primary btn-sm">
                New playthrough
              </Link>
            </span>
          </div>
          {playthroughs.length === 0 ? <p className="muted">None yet.</p> : <PlaythroughCards rows={playthroughs} mine />}
        </section>
      )}
      {/* The assistants this player let in (WO-109), while the MCP door is open. */}
      {assistants && <Assistants rows={assistants.map((a) => ({ clientId: a.clientId, name: a.name, may: a.scopes.map((s) => SCOPES[s as Scope] ?? s), since: a.since, lastUsed: a.lastUsed, drafted: a.drafted }))} />}
    </main>
  );
}
