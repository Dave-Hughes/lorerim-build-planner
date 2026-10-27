import Link from "next/link";
import { HomeHero } from "./hero";
import { LocalDate } from "@/components/ui/local-date";
import { listBuildsByOwner } from "@/lib/builds/queries";
import type { BuildSummary } from "@/lib/builds/types";
import { mcpOn } from "@/lib/features";
import { connectedAssistants } from "@/lib/oauth/assistants";
import { listMyPlaythroughs, runsByBuild } from "@/lib/playthroughs/queries";
import { roman } from "@/lib/playthroughs/view";
import styles from "./home.module.css";

const SHOWN = 4;

/**
 * The home page for a signed-in player (WO-157): the same hero, shorter; their characters, each with where the run stands from the save,
 * the act and the next few objectives; their drafts; their Claude. Space and a thin rule, no framed boxes.
 */
export async function HomeYou({ userId }: { userId: string }) {
  const [builds, runs, assistants, owned] = await Promise.all([
    listBuildsByOwner(userId),
    runsByBuild(userId),
    mcpOn() ? connectedAssistants(userId, true) : Promise.resolve(null),
    listMyPlaythroughs(userId),
  ]);
  // Characters with a run first, then the newest.
  const sorted = [...builds].sort((a, b) => Number(runs.has(b.id)) - Number(runs.has(a.id)));
  const drafts = builds.filter((b) => b.visibility === "private");
  const alone = owned.filter((p) => !p.buildId).length;
  return (
    <>
      <HomeHero compact />
      <main className={styles.main} style={{ gap: 0 }}>
        <div className={styles.you}>
          <section className={styles.col} aria-labelledby="mine">
            <span className={styles.head}>
              <h2 id="mine" className={styles.h2}>
                Your characters
              </h2>
              <Link href="/me">All of them ›</Link>
            </span>
            {sorted.length === 0 ? <p className="muted">None yet.</p> : sorted.slice(0, SHOWN).map((b) => <Character key={b.id} build={b} run={runs.get(b.id)} />)}
            {alone > 0 ? (
              <p className="muted">
                {alone} {alone === 1 ? "run has" : "runs have"} no build yet. <Link href="/me#playthroughs">See {alone === 1 ? "it" : "them"} ›</Link>
              </p>
            ) : null}
          </section>
          <aside className={styles.side}>
            {drafts.length > 0 && (
              <section className={styles.sideSec} aria-labelledby="drafts">
                <h2 id="drafts">Drafts</h2>
                {drafts.slice(0, 5).map((d) => (
                  <Link key={d.id} href={`/b/${d.id}/edit`} className={styles.draft}>
                    <span>{d.name}</span>
                    <small>{d.draftedBy ? `Drafted with ${d.draftedBy}` : "Only you"}</small>
                  </Link>
                ))}
              </section>
            )}
            {assistants && (
              <section className={styles.sideSec} aria-labelledby="claude">
                <h2 id="claude">Your Claude</h2>
                {assistants.length === 0 ? (
                  <p>No assistant is connected.</p>
                ) : (
                  assistants.map((a) => (
                    <p key={a.clientId}>
                      {a.name} is connected{a.lastUsed ? <>, last used <LocalDate date={a.lastUsed} short /></> : null}.
                    </p>
                  ))
                )}
                <Link href="/me#assistants-title">Your assistants ›</Link>
              </section>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

function Character({ build, run }: { build: BuildSummary; run?: Awaited<ReturnType<typeof runsByBuild>> extends Map<string, infer R> ? R : never }) {
  return (
    <article className={styles.char}>
      <Link href={`/b/${build.id}`} className={styles.charImg} style={build.coverImageUrl && !build.coverHeld ? { backgroundImage: `url("${build.coverImageUrl}")` } : undefined} aria-label={`${build.name}: open the build`} />
      <div className={styles.charBody}>
        <h3>
          <Link href={`/b/${build.id}`}>{build.name}</Link>
        </h3>
        {run ? (
          <>
            <span className={styles.stand}>
              {run.level !== null ? (
                <span>
                  <b>Level {run.level}</b>
                </span>
              ) : null}
              {run.place ? <span>{run.place}</span> : null}
              {run.from ? (
                <span>
                  {run.from.startsWith("Save") ? `from ${run.from}` : run.from}
                  {run.at ? <>, <LocalDate date={run.at} short /></> : null}
                </span>
              ) : null}
            </span>
            <span className={styles.actLine}>{run.act ? `Act ${roman(run.act)}: ${run.actName ?? ""}`.trim() : "No acts yet"}</span>
            {run.next.length > 0 && (
              <ul className={styles.next}>
                {run.next.map((t) => (
                  <li key={t}>
                    <i />
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <span className={styles.btns}>
              <Link href={`/p/${run.id}`} className="btn btn-primary">
                Open the run
              </Link>
            </span>
          </>
        ) : (
          <>
            <span className={styles.actLine}>
              Build only <span>| no run yet</span>
            </span>
            <span className={styles.btns}>
              <Link href={`/b/${build.id}`} className="btn">
                Open the build
              </Link>
              <Link href={`/b/${build.id}/run`} className="btn">
                Plan a run
              </Link>
            </span>
          </>
        )}
      </div>
    </article>
  );
}
