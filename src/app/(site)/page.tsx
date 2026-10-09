import Link from "next/link";
import { BuildCard, BuildGrid } from "@/components/build/build-card";
import { listPublicBuilds } from "@/lib/builds/queries";
import { sampleBuild } from "@/lib/builds/sample";
import { GAME_VERSION } from "@/lib/rules/data";
import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const builds = await listPublicBuilds();
  const sample = sampleBuild();
  return (
    <main className={`page ${styles.main}`}>
      <div className={styles.head}>
        <h1 className="title">Builds</h1>
        <span className={styles.tag}>LoreRim {GAME_VERSION}</span>
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
