/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { BuildSummary } from "@/lib/builds/types";
import type { RunSummary } from "@/lib/playthroughs/queries";
import { RecentStrip } from "./recent-strip";
import styles from "./recent.module.css";
import home from "./home.module.css";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/**
 * Recent characters, dressed up (WO-157 Part 10): the five latest listed, each a portrait cover with its race, what it has (Featured, Video,
 * Playthrough: two at most), the name and the tagline, the race and traits, the maker, the likes and the planned level; a listed run adds its act.
 */
export function RecentCharacters({ builds, runs }: { builds: BuildSummary[]; runs?: Map<string, RunSummary> | null }) {
  if (!builds.length) return null;
  return (
    <section className={home.sec} aria-labelledby="recent">
      <span className={home.head}>
        <h2 id="recent" className={home.h2}>
          Recent characters
        </h2>
        <Link href="/characters">All characters ›</Link>
      </span>
      <RecentStrip>
        {builds.map((b) => (
          <Card key={b.id} build={b} run={runs?.get(b.id)} />
        ))}
      </RecentStrip>
    </section>
  );
}

function Card({ build: b, run }: { build: BuildSummary; run?: RunSummary }) {
  const marks = [
    ...(b.featured ? [{ key: "featured", label: "Featured", className: styles.featured, icon: <span aria-hidden="true">+</span> }] : []),
    ...(b.videoId
      ? [
          {
            key: "video",
            label: "Video",
            className: "",
            icon: (
              <svg width="9" height="10" viewBox="0 0 9 10" aria-hidden="true">
                <path d="M0 0l9 5-9 5z" fill="currentColor" />
              </svg>
            ),
          },
        ]
      : []),
    ...(run ? [{ key: "run", label: "Playthrough", className: styles.run, icon: <img src="/icons/quest-travel.svg" alt="" width={14} height={14} /> }] : []),
  ].slice(0, 2);
  const focus = b.coverFocus ? `${b.coverFocus.x}% ${b.coverFocus.y}%` : "center";
  const actLine = run && run.acts > 0 ? `Act ${run.act || 1} of ${run.acts}${run.actName ? `: ${run.actName}` : ""}` : null;
  return (
    <Link href={`/b/${b.id}`} className={styles.card}>
      <span className={styles.cvw}>{b.coverImageUrl && !b.coverHeld ? <span className={styles.cv} style={{ backgroundImage: `url("${b.coverImageUrl}")`, backgroundPosition: focus }} /> : <span className={styles.plain} />}</span>
      <span className={styles.shade} />
      <span className={styles.glow} />
      <span className={styles.embers} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={`${styles.corner} ${styles.cA}`} />
      <span className={`${styles.corner} ${styles.cB}`} />
      <span className={`${styles.corner} ${styles.cC}`} />
      <span className={`${styles.corner} ${styles.cD}`} />
      <span className={styles.top}>
        {b.race ? (
          <span className={styles.race}>
            <img src={`/icons/race-${slug(b.race)}.svg`} alt={b.race} width={22} height={22} />
          </span>
        ) : (
          <span />
        )}
        {marks.length > 0 && (
          <span className={styles.badges}>
            {marks.map((m) => (
              <span key={m.key} className={`${styles.badge} ${m.className}`}>
                {m.icon}
                {m.label}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className={styles.bottom}>
        <b className={styles.name}>{b.name}</b>
        {b.description ? <i className={styles.tagline}>{b.description}</i> : null}
        <span className={styles.line}>{[b.race, b.traits.join(", ")].filter(Boolean).join(" | ")}</span>
        {actLine && run ? (
          <>
            <span className={styles.line}>{actLine}</span>
            <span className={styles.acts} role="img" aria-label={`Act ${run.act || 1} of ${run.acts}`}>
              {Array.from({ length: Math.min(run.acts, 12) }, (_, i) => (
                <i key={i} className={i < (run.act || 1) ? styles.on : ""} />
              ))}
            </span>
          </>
        ) : null}
        <span className={styles.foot}>
          <Avatar name={b.author.name} image={b.author.image} size={20} />
          <span className={styles.who}>{b.author.name}</span>
          <span className={styles.likes} aria-label={`${b.likeCount} ${b.likeCount === 1 ? "like" : "likes"}`}>
            <svg width="13" height="12" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M8 13S1 8.6 1 4.4A3.4 3.4 0 0 1 8 3a3.4 3.4 0 0 1 7 1.4C15 8.6 8 13 8 13z" />
            </svg>
            {b.likeCount}
          </span>
          <span className={styles.level} aria-label={`Planned to level ${b.levels}`}>
            <small>LV</small>
            {b.levels}
          </span>
        </span>
      </span>
    </Link>
  );
}
