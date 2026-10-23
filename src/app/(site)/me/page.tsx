import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { SignInButton } from "@/components/site-header";
import { handleFor, listBuildsByOwner } from "@/lib/builds/queries";
import { Assistants } from "@/components/account/assistants";
import { mcpOn, playthroughsOn, questsOn } from "@/lib/features";
import { approvedFor } from "@/lib/quests/approvals";
import { PlaythroughCards } from "@/components/playthrough/cards";
import { listMyPlaythroughs, runsByBuild } from "@/lib/playthroughs/queries";
import { SCOPES, type Scope } from "@/lib/oauth/core";
import { connectedAssistants } from "@/lib/oauth/assistants";
import styles from "../home.module.css";

export const generateMetadata = (): Metadata => ({ title: playthroughsOn() ? "My characters" : "My builds" });
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
  const characters = playthroughsOn();
  const [builds, handle, assistants, runs, playthroughs, thanks] = await Promise.all([
    listBuildsByOwner(userId),
    handleFor(userId),
    mcpOn() ? connectedAssistants(userId, characters) : Promise.resolve(null),
    characters ? runsByBuild(userId) : Promise.resolve(null),
    characters ? listMyPlaythroughs(userId) : Promise.resolve(null),
    // A player's report an admin approved (WO-146): said once it is on the planner.
    questsOn() ? approvedFor(userId) : Promise.resolve([]),
  ]);
  // A run made before WO-114 with no build yet has no card of its own in the grid.
  const unattached = playthroughs?.filter((p) => !p.buildId) ?? [];
  const withRun = runs ? builds.filter((b) => runs.has(b.id)).length : 0;
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={`title ${styles.h1}`}>{characters ? "My characters" : "My builds"}</h1>
        <span className={styles.headActions}>
          {handle && (
            <Link href={`/u/${handle}`} className="btn btn-sm">
              My page
            </Link>
          )}
          <Link href="/new" className="btn btn-primary btn-sm">
            {characters ? "New character" : "New build"}
          </Link>
        </span>
        {/* One list (WO-114): every build is a character, with a run or alone. */}
        {characters && builds.length > 0 && (
          <span className="muted" style={{ marginLeft: "auto", fontSize: 14 }}>
            {characterCount(builds.length, withRun)}
          </span>
        )}
      </div>
      {thanks.map((t) => (
        <p key={t.id} role="status">
          {t.says}
        </p>
      ))}
      {builds.length === 0 ? (
        <p className="muted">None yet.</p>
      ) : (
        <BuildGrid>
          {builds.map((b) => {
            const r = runs?.get(b.id);
            return <BuildCard key={b.id} build={b} mine run={runs ? (r ?? "none") : undefined} />;
          })}
        </BuildGrid>
      )}
      {unattached.length > 0 && (
        <section id="playthroughs" aria-labelledby="unattached" style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 48 }}>
          <h2 id="unattached" className="section-title">
            Runs with no build yet
          </h2>
          <PlaythroughCards rows={unattached} mine />
        </section>
      )}
      {/* The assistants this player let in (WO-109), while the MCP door is open. */}
      {assistants && <Assistants rows={assistants.map((a) => ({ clientId: a.clientId, name: a.name, may: a.scopes.map((s) => SCOPES[s as Scope] ?? s), since: a.since, lastUsed: a.lastUsed, drafted: a.drafted }))} noun={characters ? "character" : "build"} />}
    </main>
  );
}

/** "4 characters: 2 with a run, 2 builds alone". */
function characterCount(all: number, withRun: number): string {
  const alone = all - withRun;
  return `${all} ${all === 1 ? "character" : "characters"}: ${withRun} with a run, ${alone} ${alone === 1 ? "build" : "builds"} alone`;
}
