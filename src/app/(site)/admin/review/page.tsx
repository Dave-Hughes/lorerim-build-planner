/* eslint-disable @next/next/no-img-element -- uploaded images shown as they are, for review. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ReviewActions } from "@/components/admin/review-actions";
import { LocalDate } from "@/components/ui/local-date";
import { listOpenReview } from "@/lib/moderation/review";
import { isAdmin } from "@/lib/users/admin";
import styles from "./review.module.css";

export const metadata: Metadata = { title: "Review", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Scores worth showing, highest first. */
function topScores(scores: Record<string, number> | null): [string, number][] {
  if (!scores) return [];
  return Object.entries(scores)
    .filter(([k]) => k !== "none")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

/**
 * The review list (WO-40), for admins only (everyone else gets a 404): images the check listed or
 * couldn't check, and builds with open reports, newest first. Each can be kept, hidden or removed.
 */
export default async function ReviewPage() {
  const userId = (await auth())?.user?.id;
  if (!(await isAdmin(userId))) notFound();
  const items = await listOpenReview();
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Review</h1>
      <p className="muted">Images the check flagged or couldn&apos;t check, and builds players reported. Newest first.</p>
      {items.length === 0 ? (
        <p className={styles.empty}>Nothing waiting.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) =>
            item.kind === "image" ? (
              <li key={`i${item.id}`} className={styles.item} aria-label={`Image from ${item.uploader}`}>
                <img src={item.url} alt="" className={styles.image} />
                <div className={styles.facts}>
                  <span className={`tag ${item.outcome === "unchecked" ? "" : styles.flag}`}>{item.outcome === "unchecked" ? "Not checked" : "Erotica"}</span>
                  <span>
                    Uploaded by {item.uploader}, <LocalDate date={item.at} />
                  </span>
                  {item.build && (
                    <span>
                      On <Link href={`/b/${item.build.id}`}>{item.build.name}</Link>
                    </span>
                  )}
                  {item.scores && (
                    <dl className={styles.scores}>
                      {topScores(item.scores).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k.replaceAll("_", " ")}</dt>
                          <dd>{v.toFixed(2)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <ReviewActions target={{ kind: "image", id: item.id }} />
                </div>
              </li>
            ) : (
              <li key={`b${item.build.id}`} className={styles.item} aria-label={`Reports on ${item.build.name}`}>
                {item.build.cover ? <img src={item.build.cover} alt="" className={styles.image} /> : <span className={styles.noImage}>No cover</span>}
                <div className={styles.facts}>
                  <span className={`tag ${styles.flag}`}>
                    {item.reports.length} {item.reports.length === 1 ? "report" : "reports"}
                  </span>
                  <span>
                    <Link href={`/b/${item.build.id}`}>{item.build.name}</Link> by {item.build.owner}
                  </span>
                  <ul className={styles.reports}>
                    {item.reports.map((r, i) => (
                      <li key={i}>
                        <strong>{r.reason}</strong>
                        {r.note && <>: {r.note}</>} <span className="muted">by {r.by}</span>
                      </li>
                    ))}
                  </ul>
                  <ReviewActions target={{ kind: "build", id: item.build.id }} />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
