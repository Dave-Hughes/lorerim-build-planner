import Link from "next/link";
import { roman } from "@/lib/playthroughs/view";
import { levelsLine } from "@/lib/rules/stretches";
import { Heart, likesLabel } from "./heart";
import { AiAssisted } from "@/components/ui/ai-assisted";
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
/**
 * A character's run on its build's card (WO-114): where the run stands, or "Build alone" with the way
 * to add one. Only on the player's own cards, while playthroughs are on.
 */
export type CardRun = { id: string; act: number; actName: string | null; place: string | null; level: number | null; day: number | null; done: number; total: number } | "none";

export function BuildCard({ build, mine, likedAt, featured, run }: { build: BuildSummary; mine?: boolean; likedAt?: Date; featured?: { intro: string }; run?: CardRun }) {
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
        {(build.videoId || build.hasStory || (run && run !== "none")) && (
          <span className={styles.badges}>
            {build.videoId && (
              <span className={styles.videoBadge}>
                <PlayMark size={featured ? 16 : 12} /> Video
              </span>
            )}
            {run && run !== "none" && <span className={styles.videoBadge}>Run</span>}
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
        {run && <RunBox build={build} run={run} />}
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
        {/* Made by an assistant's tools (WO-110), on the author's own cards: the AI assisted mark (WO-117). */}
        {mine && build.draftedBy && (
          <p className={`muted ${styles.drafted}`}>
            <AiAssisted author={build.author.name} />
          </p>
        )}
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

function RunBox({ build, run }: { build: BuildSummary; run: CardRun }) {
  if (run === "none")
    return (
      <div className={`${styles.run} ${styles.runNone}`}>
        <b>Build alone</b>
        <Link href={`/b/${build.id}/run`} className={styles.runLink}>
          Plan a playthrough ›
        </Link>
        <span>{build.hasStory ? "Shared as a build, with its Story" : "No acts, objectives or tale yet"}</span>
      </div>
    );
  const where = [run.act ? `Act ${roman(run.act)} ${run.actName ?? ""}`.trim() : "No acts yet", run.place, run.level !== null ? `Level ${run.level}${run.day !== null ? `, day ${run.day}` : ""}` : null].filter(Boolean).join(" | ");
  return (
    <div className={styles.run}>
      <b>Where the run stands</b>
      <Link href={`/p/${run.id}`} className={styles.runLink}>
        Play ›
      </Link>
      <span>{where}</span>
      <span className={styles.runBar} aria-hidden="true">
        <i style={{ width: `${run.total ? Math.round((run.done / run.total) * 100) : 0}%` }} />
      </span>
      <span className={styles.runCount}>
        {run.done} of {run.total} done
      </span>
    </div>
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
