import Link from "next/link";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { BrowseFilters } from "@/components/build/browse-filters";
import { browseHref, type BrowseState } from "@/lib/builds/browse";
import { getFeaturedBuild, searchBuilds } from "@/lib/builds/queries";
import { sampleBuild } from "@/lib/builds/sample";
import { tourSampleId } from "@/lib/builds/sample-config";
import { TourOffer } from "@/components/tour/tour";
import { TAG_BY_SLUG } from "@/lib/builds/tags";
import { currentVersion, gameData, knownVersions } from "@/lib/rules/server";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

const PAGE = 24;

type Search = Promise<{ q?: string; tags?: string; race?: string; sort?: string; version?: string; n?: string }>;

export default async function Home({ searchParams }: { searchParams: Search }) {
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
  };
  const shown = Math.min(240, Math.max(PAGE, Number(sp.n) || PAGE));
  const { builds, more } = await searchBuilds({
    q: state.q,
    tags: state.tags,
    race: state.race,
    gameVersion: version === "all" ? undefined : version,
    sort: state.sort,
    limit: shown,
  });
  const filtered = !!(state.q || state.tags.length || state.race);
  // The featured build comes first, and larger, when nothing narrows the list (WO-39); with a search
  // or filter it sits in the grid like any other card.
  const featured = !filtered && version === defaultVersion ? await getFeaturedBuild() : null;
  const rest = featured ? builds.filter((b) => b.id !== featured.id) : builds;
  const sample = sampleBuild();
  return (
    <main className={`page ${styles.main}`}>
      {/* A first visit: Tapps offers the sample build (WO-80). */}
      <TourOffer href={`/b/${tourSampleId()}`} />
      <div className={styles.head}>
        <h1 className="title">Builds</h1>
      </div>
      <BrowseFilters state={state} versions={versions} defaultVersion={defaultVersion} races={races} empty={builds.length === 0} />
      {builds.length === 0 && !filtered ? (
        <div className={styles.empty}>
          <p className="muted">No builds listed yet. Here is the example build, or start your own.</p>
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
            New build
          </Link>
        </div>
      ) : builds.length > 0 || featured ? (
        <>
          <BuildGrid>
            {featured && <BuildCard key={featured.id} build={featured} featured={{ intro: featured.intro }} />}
            {rest.map((b) => (
              <BuildCard key={b.id} build={b} />
            ))}
          </BuildGrid>
          {more && (
            <Link href={browseHref(state, defaultVersion, shown + PAGE)} scroll={false} className="btn" style={{ alignSelf: "center" }}>
              Show more
            </Link>
          )}
        </>
      ) : null}
    </main>
  );
}
