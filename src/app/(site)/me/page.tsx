import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { CharacterCard, CharacterGrid } from "@/components/build/character-card";
import { AiAssisted } from "@/components/ui/ai-assisted";
import { DeleteBuildButton } from "@/components/build/delete-build-button";
import recent from "@/components/home/recent.module.css";
import { SignInButton } from "@/components/site-header";
import { handleFor, listBuildsByOwner } from "@/lib/builds/queries";
import { Assistants } from "@/components/account/assistants";
import { mcpOn, playthroughsOn, questsOn } from "@/lib/features";
import { approvedFor } from "@/lib/quests/approvals";
import { PlaythroughCards } from "@/components/playthrough/cards";
import { listMyPlaythroughs, runsByBuild, type PlaythroughCard } from "@/lib/playthroughs/queries";
import { makeCharacterOfRun } from "@/lib/playthroughs/writes";
import { JoinCharacter } from "@/components/playthrough/join-character";
import { SCOPES, shownScopes, type Scope } from "@/lib/oauth/core";
import { connectedAssistants } from "@/lib/oauth/assistants";
import styles from "../home.module.css";

export const generateMetadata = (): Metadata => ({ title: "My characters" });
export const dynamic = "force-dynamic";

export default async function MyBuilds() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return (
      <main className={`page ${styles.main}`}>
        <h1 className={`title ${styles.h1}`}>My characters</h1>
        <p className="muted">Sign in to see the characters you have made.</p>
        <SignInButton redirectTo="/me" />
      </main>
    );
  }
  // Runs are a launch-held-back part (WO-182): a character is its build, with no run box, count or way to plan one while they are off.
  const withRuns = playthroughsOn();
  // A run from before WO-179 on no build becomes a character of its own, the first time its owner opens My characters (nothing alone).
  if (withRuns) for (const r of (await listMyPlaythroughs(userId)).filter((p) => !p.buildId)) await makeCharacterOfRun(userId, r.id);
  const [builds, handle, assistants, runs, thanks] = await Promise.all([
    listBuildsByOwner(userId),
    handleFor(userId),
    mcpOn() ? connectedAssistants(userId, withRuns) : Promise.resolve(null),
    withRuns ? runsByBuild(userId) : Promise.resolve(null),
    // A player's report an admin approved (WO-146): said once it is on the planner.
    questsOn() ? approvedFor(userId) : Promise.resolve([]),
  ]);
  const unattached: PlaythroughCard[] = [];
  // A character made for a run that had none (nothing planned on it) offers to join one of the player's others that has no run.
  const joinTo = builds.filter((b) => b.race && runs && !runs.has(b.id)).map((b) => ({ id: b.id, name: b.name }));
  const withRun = runs ? builds.filter((b) => runs.has(b.id)).length : 0;
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className={`title ${styles.h1}`}>My characters</h1>
        <span className={styles.headActions}>
          {handle && (
            <Link href={`/u/${handle}`} className="btn btn-sm">
              My page
            </Link>
          )}
          <Link href="/new" className="btn btn-primary btn-sm">
            New character
          </Link>
        </span>
        {/* One list (WO-114): every build is a character, with a run or alone. */}
        {builds.length > 0 && (
          <span className="muted" style={{ marginLeft: "auto", fontSize: 14 }}>
            {withRuns ? characterCount(builds.length, withRun) : `${builds.length} ${builds.length === 1 ? "character" : "characters"}`}
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
        // One character card (WO-161, WO-164), its who-can-see-it, Delete and Edit under it.
        <CharacterGrid>
          {builds.map((b) => {
            const r = runs?.get(b.id);
            return (
              <CharacterCard
                key={b.id}
                build={b}
                run={typeof r === "object" ? r : undefined}
                under={
                  <>
                    <span className={recent.underMeta}>
                      <span className="tag tag-sm">{b.visibility === "public" ? "Listed" : b.visibility === "unlisted" ? "Link only" : "Only you"}</span>
                      {b.draftedBy && (
                        <span className="muted">
                          <AiAssisted author={b.author.name} />
                        </span>
                      )}
                    </span>
                    {runs && typeof r === "object" && !b.race && <JoinCharacter runId={r.id} choices={joinTo} />}
                    {runs && !r && (
                      <Link href={`/b/${b.id}/run`} className={recent.planLink}>
                        Plan a playthrough ›
                      </Link>
                    )}
                    <span className={recent.underActions}>
                      <DeleteBuildButton id={b.id} name={b.name} />
                      <Link href={`/b/${b.id}/edit`} className="btn btn-sm">
                        Edit
                      </Link>
                    </span>
                  </>
                }
              />
            );
          })}
        </CharacterGrid>
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
      {assistants && <Assistants rows={assistants.map((a) => ({ clientId: a.clientId, name: a.name, may: shownScopes(a.scopes).map((s) => SCOPES[s as Scope] ?? s), since: a.since, lastUsed: a.lastUsed, drafted: a.drafted }))} noun="character" />}
    </main>
  );
}

/** "4 characters: 2 with a run, 2 builds alone". */
function characterCount(all: number, withRun: number): string {
  const alone = all - withRun;
  return `${all} ${all === 1 ? "character" : "characters"}: ${withRun} with a run, ${alone} ${alone === 1 ? "build" : "builds"} alone`;
}
