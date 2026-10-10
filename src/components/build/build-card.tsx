import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { IconLabel, RaceIcon } from "@/components/ui/skill-icon";
import { DeleteBuildButton } from "./delete-build-button";
import type { BuildSummary } from "@/lib/builds/types";
import { formatDate } from "@/lib/format/date";
import styles from "./build-card.module.css";

export function BuildCard({ build, mine }: { build: BuildSummary; mine?: boolean }) {
  return (
    <article className={styles.card}>
      <Link href={`/b/${build.id}`} className={`${styles.band} ${build.coverImageUrl ? "" : styles.bandPlain}`} style={build.coverImageUrl ? { backgroundImage: `url("${build.coverImageUrl}")` } : undefined} aria-label={build.name}>
        <span className={styles.bandFade} />
      </Link>
      <div className={styles.body}>
        <h2 className={styles.name}>
          <Link href={`/b/${build.id}`}>{build.name}</Link>
        </h2>
        {build.description && <p className={`flavor ${styles.description}`}>{build.description}</p>}
        <p className={styles.facts}>
          {build.race ? <IconLabel icon={<RaceIcon name={build.race} />}>{build.race}</IconLabel> : null}
          {build.traits.length ? ` with ${build.traits.join(" and ")}` : ""}, to level {build.levels}
        </p>
        <div className={styles.foot}>
          <span className={styles.author}>
            <Avatar name={build.author.name} image={build.author.image} size={24} />
            <span>{build.author.name}</span>
          </span>
          <span className="muted">{formatDate(build.updatedAt)}</span>
        </div>
        {mine && (
          <div className={styles.mine}>
            <span className="tag tag-sm">{build.visibility === "public" ? "Listed" : build.visibility === "unlisted" ? "Link only" : "Only you"}</span>
            <span className={styles.mineActions}>
              <DeleteBuildButton id={build.id} name={build.name} />
              <Link href={`/b/${build.id}/edit`} className="btn btn-sm">
                Edit
              </Link>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export function BuildGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
