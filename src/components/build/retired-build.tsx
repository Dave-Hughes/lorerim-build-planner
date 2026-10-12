import Link from "next/link";
import { AuthorLink } from "@/components/ui/author-link";
import { Avatar } from "@/components/ui/avatar";
import type { BuildViewData } from "./build-view";
import styles from "./build-view.module.css";

/**
 * A build whose LoreRim version is no longer in the planner: the plan as stored,
 * with no numbers worked out (there is no data to work them out against).
 */
export function RetiredBuild({ build, isOwner }: { build: BuildViewData; isOwner: boolean }) {
  const { plan } = build;
  const identity: [string, string][] = [
    ["Race", plan.race || "Not chosen yet"],
    ["Birthsign", plan.traits.includes("Master of Destiny") ? "None (Master of Destiny)" : plan.birthsign ? `The ${plan.birthsign}` : "Not chosen yet"],
    ["Deity", plan.deity || "Not chosen yet"],
    ["Traits", plan.traits.length ? plan.traits.join(", ") : "None"],
    ["Game mode", plan.mode],
    ["Start", plan.start ? `${plan.start}${plan.startOption && plan.startOption !== "Random" ? ` · ${plan.startOption}` : ""}` : "Not chosen yet"],
  ];
  return (
    <main className={styles.main}>
      <section aria-label="Build" className={`${styles.cover} ${styles.coverPlain}`}>
        <div className={styles.coverFade} />
        <div className={`page ${styles.coverInner}`}>
          <div className={styles.coverText}>
            <h1 className={`title ${styles.h1}`}>{build.name}</h1>
            {build.description && <p className={`flavor ${styles.description}`}>{build.description}</p>}
            <div className={styles.byline}>
              <AuthorLink author={build.author} className={styles.author} nameClassName={styles.authorName} avatar={<Avatar name={build.author.name} image={build.author.image} />} />
              <span className="tag">LoreRim {build.gameVersion}</span>
              <span>Planned to level {plan.levels.length}</span>
            </div>
          </div>
          {isOwner && (
            <div className={styles.actions}>
              <Link className="btn" href="/me">
                My builds
              </Link>
            </div>
          )}
        </div>
      </section>
      <div className={`page ${styles.body}`}>
        <section aria-label="LoreRim version" className={styles.versionNotice}>
          <p>LoreRim {build.gameVersion} is no longer in the planner.</p>
        </section>
        <section aria-label="Character" className={styles.identity}>
          {identity.map(([l, v]) => (
            <div key={l} className={styles.identityItem}>
              <span className="label">{l}</span>
              <span className={styles.identityValue}>{v}</span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
