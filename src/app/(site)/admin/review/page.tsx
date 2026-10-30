/* eslint-disable @next/next/no-img-element -- uploaded images shown as they are, for review. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { QuestReportCard, ShotCard, TipCard, TrustPanel } from "@/components/admin/review-cards";
import { ReviewActions } from "@/components/admin/review-actions";
import { LocalDate } from "@/components/ui/local-date";
import { questsOn } from "@/lib/features";
import { listOpenReview } from "@/lib/moderation/review";
import { pageNamed } from "@/lib/pages/page-named";
import { loadPlayerFacts } from "@/lib/quests/player-facts";
import { listQuestReports } from "@/lib/quests/reports";
import { questHref } from "@/lib/quests/slugs";
import { shotsToReview } from "@/lib/screenshots/store";
import { checkWords } from "@/lib/screenshots/words";
import { tipsToReview } from "@/lib/tips/store";
import { trustedList } from "@/lib/trust/store";
import { isAdmin } from "@/lib/users/admin";
import tabs from "@/components/admin/review-tabs.module.css";
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

const TABS = [
  { id: "facts", label: "What players know" },
  { id: "shots", label: "Screenshots" },
  { id: "builds", label: "Reported builds" },
  { id: "trust", label: "Approved players" },
] as const;

/**
 * The review list (WO-40, WO-184 Part 5), for admins only (everyone else gets a 404). Four tabs, each with its count: what players know (their "I know this" and
 * Report a mistake, and the quest reports), the screenshots waiting, reported builds and the images the check flagged, and the approved players. Newest first. Nothing
 * here is on a page until it is approved, and every decision keeps who made it and when.
 */
export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const userId = (await auth())?.user?.id;
  if (!(await isAdmin(userId))) notFound();
  const asked = (await searchParams).tab;
  const tab = TABS.find((t) => t.id === asked)?.id ?? "facts";
  const on = questsOn();
  if (on) await loadPlayerFacts();
  const [items, tips, reports, shots, trusted] = await Promise.all([
    listOpenReview(),
    on ? tipsToReview() : [],
    on ? listQuestReports() : [],
    on ? shotsToReview() : [],
    on ? trustedList() : { admins: [], players: [] },
  ]);
  const openReports = reports.filter((r) => r.status === "new" && !r.decision);
  const counts = { facts: tips.length + openReports.length, shots: shots.length, builds: items.length, trust: trusted.players.length };
  // The facts, newest first, tips and quest reports together.
  const facts = [
    ...tips.map((t) => ({ at: t.at.getTime(), tip: t, report: null })),
    ...openReports.map((r) => ({ at: r.createdAt.getTime(), tip: null, report: r })),
  ].sort((a, b) => b.at - a.at);
  return (
    <main className={`page ${styles.main}`}>
      <h1 className="title">Review</h1>
      <p className="muted">What players sent, waiting on an admin. Newest first. Nothing here is on a page until it&apos;s approved.</p>
      <nav className={tabs.tabs} aria-label="What to review">
        {TABS.map((t) => (
          <Link key={t.id} href={`/admin/review?tab=${t.id}`} className={`${tabs.tab} ${tab === t.id ? tabs.on : ""}`} aria-current={tab === t.id ? "page" : undefined}>
            {t.label}
            <i>{counts[t.id]}</i>
          </Link>
        ))}
      </nav>

      {tab === "facts" &&
        (facts.length === 0 ? (
          <p className={tabs.empty}>Nothing waiting.</p>
        ) : (
          <div>
            {facts.map((f) =>
              f.tip ? (
                <TipCard
                  key={`t${f.tip.id}`}
                  t={{
                    id: f.tip.id,
                    page: pageNamed(f.tip.kind, f.tip.key),
                    type: f.tip.type,
                    field: f.tip.field,
                    words: f.tip.words,
                    how: f.tip.how,
                    link: f.tip.link,
                    screenshotUrl: f.tip.screenshotUrl,
                    reading: f.tip.reading,
                    by: f.tip.by,
                    at: f.tip.at.toISOString(),
                  }}
                />
              ) : (
                <QuestReportCard
                  key={`r${f.report!.id}`}
                  r={{
                    id: f.report!.id,
                    lineName: f.report!.lineName,
                    lineHref: (f.report!.quest ? questHref(f.report!.quest) : null) ?? `/quests/${f.report!.lineId}`,
                    questName: f.report!.questName,
                    kind: f.report!.kind,
                    what: f.report!.what,
                    text: f.report!.text,
                    fields: f.report!.fields as Record<string, string | undefined> | null,
                    proposal: f.report!.proposal,
                    noChange: f.report!.noChange,
                    by: f.report!.name ?? f.report!.handle ?? "A player",
                    at: f.report!.createdAt.toISOString(),
                  }}
                />
              ),
            )}
          </div>
        ))}

      {tab === "shots" &&
        (shots.length === 0 ? (
          <p className={tabs.empty}>Nothing waiting.</p>
        ) : (
          <div>
            {shots.map((sh) => (
              <ShotCard
                key={sh.id}
                s={{ id: sh.id, url: sh.url, thumbUrl: sh.thumbUrl, page: pageNamed(sh.kind, sh.key), by: sh.by.name ?? "A player", at: sh.at.toISOString(), check: sh.check, checkWords: checkWords(sh.check), reportNote: sh.reported }}
              />
            ))}
          </div>
        ))}

      {tab === "trust" && <TrustPanel data={{ admins: trusted.admins, players: trusted.players.map((p) => ({ ...p, at: p.at.toISOString() })) }} />}

      {tab === "builds" &&
        (items.length === 0 ? (
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
        ))}
    </main>
  );
}
