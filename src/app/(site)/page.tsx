import Link from "next/link";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { listPublicBuilds } from "@/lib/builds/queries";
import { sampleBuild } from "@/lib/builds/sample";
import { VersionFilter } from "@/components/build/version-filter";
import { currentVersion, knownVersions } from "@/lib/rules/server";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

type Search = Promise<{ version?: string }>;

export default async function Home({ searchParams }: { searchParams: Search }) {
  const { version } = await searchParams;
  const versions = knownVersions().map((v) => v.id).reverse();
  // Defaults to the current version; "all" shows every version.
  const chosen = version === "all" || (version && versions.includes(version)) ? version : currentVersion().id;
  const builds = await listPublicBuilds(chosen === "all" ? undefined : chosen);
  const sample = sampleBuild();
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className="title">Builds</h1>
        <div className={styles.filter}>
          <VersionFilter versions={versions} value={chosen} />
        </div>
      </div>
      {builds.length === 0 ? (
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
                isSample: true,
              }}
            />
          </BuildGrid>
          <Link href="/new" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
            New build
          </Link>
        </div>
      ) : (
        <BuildGrid>
          {builds.map((b) => (
            <BuildCard key={b.id} build={b} />
          ))}
        </BuildGrid>
      )}
    </main>
  );
}
