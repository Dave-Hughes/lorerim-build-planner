import Link from "next/link";
import { Heart, likesLabel } from "./heart";
import { AuthorLink } from "@/components/ui/author-link";
import { Avatar } from "@/components/ui/avatar";
import { IconLabel, RaceIcon } from "@/components/ui/skill-icon";
import { DeleteBuildButton } from "./delete-build-button";
import type { BuildSummary } from "@/lib/builds/types";
import { LocalDate } from "@/components/ui/local-date";
import styles from "./build-card.module.css";

/** A build in a grid. `likedAt` (a player's Liked list) shows when they liked it in place of the date. */
export function BuildCard({ build, mine, likedAt }: { build: BuildSummary; mine?: boolean; likedAt?: Date }) {
  return (
    <article className={styles.card}>
      {/* The whole card opens the build: the name's link stretches over it (see .name a::after). */}
      <div className={`${styles.band} ${build.coverImageUrl ? "" : styles.bandPlain}`} style={build.coverImageUrl ? { backgroundImage: `url("${build.coverImageUrl}")` } : undefined} aria-hidden="true">
        <span className={styles.bandFade} />
      </div>
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
          <AuthorLink author={build.author} className={styles.author} avatar={<Avatar name={build.author.name} image={build.author.image} size={24} />} />
          <span className={styles.footRight}>
            {!build.isSample && (
              <span className={styles.likes} aria-label={likesLabel(build.likeCount)}>
                <Heart /> {build.likeCount}
              </span>
            )}
            <span className="muted">{likedAt ? <LocalDate date={likedAt} short prefix="Liked " /> : <LocalDate date={build.updatedAt} />}</span>
          </span>
        </div>
        {mine && (
          <div className={styles.mine}>
            <span className={styles.tags}>
              <span className="tag tag-sm">{build.visibility === "public" ? "Listed" : build.visibility === "unlisted" ? "Link only" : "Only you"}</span>
              <span className="tag tag-sm">LoreRim {build.gameVersion}</span>
            </span>
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
