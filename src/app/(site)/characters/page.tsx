import type { Metadata } from "next";
import Link from "next/link";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { CharacterCard, CharacterGrid } from "@/components/build/character-card";
import { BrowseFilters } from "@/components/build/browse-filters";
import { browseHref, type BrowseState } from "@/lib/builds/browse";
import { getFeaturedBuild, searchBuilds } from "@/lib/builds/queries";
import { PlaythroughCards } from "@/components/playthrough/cards";
import { playthroughsOn } from "@/lib/features";
import { listListedPlaythroughs, listedRunsByBuild } from "@/lib/playthroughs/queries";
import { sampleBuild } from "@/lib/builds/sample";
import { TAG_BY_SLUG } from "@/lib/builds/tags";
import { currentVersion, gameData, knownVersions } from "@/lib/rules/server";
import styles from "../home.module.css";

export const dynamic = "force-dynamic";

const PAGE = 24;

type Search = Promise<{ q?: string; tags?: string; race?: string; sort?: string; version?: string; n?: string; run?: string }>;

export const metadata: Metadata = { title: "Characters" };

export default async function CharactersPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const versions = knownVersions().map((v) => v.id).reverse();
  const defaultVersion = currentVersion().id;
  // Defaults to the current version; "all" shows every version.
  const version = sp.version === "all" || (sp.version && versions.includes(sp.version)) ? sp.version : defaultVersion;
  const races = (gameData(defaultVersion)?.races ?? []).map((r) => r.name);
  const state: BrowseState = {
    q: (sp.q ?? "").slice(0, 100),
    tags: (sp.tags ?? "")
      .split(",")
      .filter((t) => TAG_BY_SLUG.has(t))
      .slice(0, 5),
    race: sp.race && races.includes(sp.race) ? sp.race : "",
    version,
    sort: sp.sort === "liked" ? "liked" : "newest",
    // Characters with a listed playthrough only (WO-154 Part 5); builds alone while playthroughs are off.
    run: playthroughsOn() && sp.run === "1",
  };
  // A build and a run are one character (WO-114, WO-154 Part 5): one public page for both, while playthroughs are on.
  const characters = playthroughsOn();
  const shown = Math.min(240, Math.max(PAGE, Number(sp.n) || PAGE));
  const { builds, more } = await searchBuilds({
    q: state.q,
    tags: state.tags,
    race: state.race,
    gameVersion: version === "all" ? undefined : version,
    sort: state.sort,
    limit: shown,
    withRun: state.run,
  });
  const filtered = !!(state.q || state.tags.length || state.race || state.run);
  // Each card with a listed run shows where it stands, as My characters does; a build alone shows no run box.
  const runs = characters ? await listedRunsByBuild(builds.map((b) => b.id)) : null;
  // Listed runs made before a build was attached have no card of their own: they sit under the grid on the playthrough view.
  const unattached = characters && state.run ? (await listListedPlaythroughs()).filter((p) => !p.buildId) : [];
  // The featured build comes first, and larger, when nothing narrows the list (WO-39); with a search
  // or filter it sits in the grid like any other card.
  const featured = !filtered && version === defaultVersion ? await getFeaturedBuild() : null;
  const rest = featured ? builds.filter((b) => b.id !== featured.id) : builds;
  const sample = sampleBuild();
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className="title">Characters</h1>
      </div>
      <BrowseFilters state={state} versions={versions} defaultVersion={defaultVersion} races={races} empty={builds.length === 0 && unattached.length === 0} withRuns={characters} />
      {builds.length === 0 && !filtered ? (
        <div className={styles.empty}>
          <p className="muted">No characters listed yet. Here is the example, or start your own.</p>
          <BuildGrid>
            <BuildCard
              build={{
                id: sample.id,
                name: sample.name,
                description: sample.description,
                coverImageUrl: null,
                visibility: "public",
                gameVersion: sample.gameVersion,
                race: sample.plan.race,
                traits: sample.plan.traits,
                levels: sample.plan.levels.length,
                updatedAt: sample.updatedAt,
                author: sample.author,
                likeCount: 0,
                isSample: true,
                example: true,
              }}
            />
          </BuildGrid>
          <Link href="/new" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            New character
          </Link>
        </div>
      ) : builds.length > 0 || featured ? (
        <>
          <CharacterGrid>
            {featured && <CharacterCard key={featured.id} build={featured} wide={{ intro: featured.intro }} run={runs?.get(featured.id)} />}
            {rest.map((b) => (
              <CharacterCard key={b.id} build={b} run={runs?.get(b.id)} />
            ))}
          </CharacterGrid>
          {more && (
            <Link href={browseHref(state, defaultVersion, shown + PAGE)} scroll={false} className="btn" style={{ alignSelf: "center" }}>
              Show more
            </Link>
          )}
        </>
      ) : null}
      {unattached.length > 0 && (
        <section aria-labelledby="unattached" style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32 }}>
          <h2 id="unattached" className="section-title">
            Runs with no build yet
          </h2>
          <PlaythroughCards rows={unattached} />
        </section>
      )}
    </main>
  );
}
