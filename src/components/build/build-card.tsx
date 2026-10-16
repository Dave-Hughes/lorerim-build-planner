import Link from "next/link";
import { levelsLine } from "@/lib/rules/stretches";
import { Heart, likesLabel } from "./heart";
import { AuthorLink } from "@/components/ui/author-link";
import { Avatar } from "@/components/ui/avatar";
import { IconLabel, RaceIcon } from "@/components/ui/skill-icon";
import { DeleteBuildButton } from "./delete-build-button";
import type { BuildSummary } from "@/lib/builds/types";
import { LocalDate } from "@/components/ui/local-date";
import { PlayMark } from "./play-mark";
import { HIDDEN_IMAGE_TEXT } from "@/lib/moderation/reports";
import { ExampleTag } from "./example-tag";
import styles from "./build-card.module.css";

/**
 * A build in a grid. `likedAt` (a player's Liked list) shows when they liked it in place of the date.
 * `featured` (WO-39) makes it Browse's featured card: two columns wide, a taller cover with the gold
 * Featured mark, and the first lines of its intro.
 */
export function BuildCard({ build, mine, likedAt, featured }: { build: BuildSummary; mine?: boolean; likedAt?: Date; featured?: { intro: string } }) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ""}`} aria-label={featured ? `Featured: ${build.name}` : undefined}>
      {/* The whole card opens the build: the name's link stretches over it (see .name a::after). */}
      <div className={`${styles.band} ${build.coverImageUrl ? "" : styles.bandPlain}`} aria-hidden="true">
        {build.coverImageUrl && <span className={styles.bandImage} style={{ backgroundImage: `url("${build.coverImageUrl}")` }} />}
        <span className={styles.bandFade} />
        {build.coverHeld && <span className={styles.bandHeld}>{HIDDEN_IMAGE_TEXT}</span>}
        {featured && (
          <span className={styles.featuredMark}>
            <DestinyStar /> Featured
          </span>
        )}
        {(build.videoId || build.hasStory) && (
          <span className={styles.badges}>
            {build.videoId && (
              <span className={styles.videoBadge}>
                <PlayMark size={featured ? 16 : 12} /> Video
              </span>
            )}
            {build.hasStory && <span className={styles.videoBadge}>Story</span>}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>
          <Link href={`/b/${build.id}`}>{build.name}</Link>
        </h2>
        {build.example && <ExampleTag small className={styles.example} />}
        {build.description && <p className={`flavor ${styles.description}`}>{build.description}</p>}
        {featured?.intro && <p className={styles.intro}>{featured.intro}</p>}
        <p className={styles.facts}>
          {build.race ? <IconLabel icon={<RaceIcon name={build.race} />}>{build.race}</IconLabel> : null}
          {build.traits.length ? ` with ${build.traits.join(" and ")}` : ""}, to level {build.levels}
        </p>
        {build.writtenLevels && <p className={styles.written}>{levelsLine(build.writtenLevels)}</p>}
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

/** The Destiny star, for the Featured mark. */
function DestinyStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 22 22" aria-hidden="true">
      <path d="M11 1 L13 9 L21 11 L13 13 L11 21 L9 13 L1 11 L9 9 Z" fill="currentColor" />
    </svg>
  );
}

export function BuildGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
