import Link from "next/link";
import { ReadTheStory } from "@/components/reader/reader";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { drawnTheme, themeStyle } from "@/lib/themes";
import type { PlaythroughRecord } from "@/lib/playthroughs/queries";
import { Byline } from "./tabs";
import styles from "@/components/build/build-view.module.css";

/**
 * A character's hero when its run has no build to open (WO-164): the build page's own, so the two read as one character. The cover full
 * width with the name, the line and who made it over its dark fade, Copy link, and Edit for the owner. No cover is the plain band the
 * build page has. The tab row is only there when there is more than one tab (a run alone has the one).
 */
export function RunCover({ p, isOwner }: { p: PlaythroughRecord; isOwner: boolean }) {
  const cover = p.build?.coverImageUrl ?? null;
  const focus = p.build?.coverFocus ?? null;
  const theme = drawnTheme(undefined);
  return (
    <div className={styles.themed} data-theme={theme} style={themeStyle(theme)}>
      <section aria-label="Playthrough" className={`${styles.cover} ${cover ? "" : styles.coverPlain}`}>
        {cover && (
          <div className={styles.coverLayer} aria-hidden="true">
            <div className={styles.coverImage} style={{ backgroundImage: `url("${cover}")`, backgroundPosition: focus ? `${focus.x}% ${focus.y}%` : undefined }} />
            <div className={styles.coverTint} />
          </div>
        )}
        <div className={styles.coverFade} />
        <div className={`page ${styles.coverInner}`}>
          <div className={styles.coverText}>
            <h1 className={`title ${styles.h1} ${styles.heroIn} ${styles.heroIn1}`}>{p.name}</h1>
            {p.line && <p className={`flavor ${styles.description} ${styles.heroIn} ${styles.heroIn2}`}>{p.line}</p>}
            <div className={`${styles.byline} ${styles.heroIn} ${styles.heroIn3}`}>
              <Byline p={p} />
            </div>
          </div>
          <div className={`on-image ${styles.actions} ${styles.heroIn} ${styles.heroIn4}`}>
            <ReadTheStory />
            <CopyLinkButton path={`/p/${p.id}`} className="btn" />
            {isOwner && (
              <Link href={`/p/${p.id}/edit`} className="btn btn-primary">
                Edit
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
