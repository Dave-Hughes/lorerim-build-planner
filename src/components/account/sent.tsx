/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { LocalDate } from "@/components/ui/local-date";
import { pageNamed } from "@/lib/pages/page-named";
import { shotsOf } from "@/lib/screenshots/store";
import { tipsOf } from "@/lib/tips/store";
import { tipStatusWords } from "@/lib/tips/words";
import styles from "./sent.module.css";

const SHOT_STATE = { live: "It's on the page", review: "Waiting on an admin", removed: "Removed" } as const;

/**
 * What this player sent (WO-184 Parts 1 and 2): their screenshots and what they told us, and what happened to each (the board Confirm says "you can see what you've
 * sent, and what happened to it, on your page"). Nothing is drawn when they sent nothing.
 */
export async function WhatYouSent({ userId }: { userId: string }) {
  let shots: Awaited<ReturnType<typeof shotsOf>> = [];
  let tips: Awaited<ReturnType<typeof tipsOf>> = [];
  try {
    [shots, tips] = await Promise.all([shotsOf(userId), tipsOf(userId)]);
  } catch {
    return null;
  }
  if (!shots.length && !tips.length) return null;
  return (
    <section className={styles.sec} aria-labelledby="sent" id="sent">
      <h2 id="sent" className="section-title">
        What you sent
      </h2>
      <ul className={styles.list}>
        {shots.map((s) => {
          const page = pageNamed(s.kind, s.key);
          return (
            <li key={`s${s.id}`} className={styles.row}>
              <img src={s.thumbUrl} alt="" width={96} height={54} className={styles.thumb} />
              <span>
                A screenshot of {page ? <Link href={page.href}>{page.name}</Link> : "a page that is gone"}
                <small>
                  <LocalDate date={s.at} short />
                </small>
              </span>
              <span className={`${styles.state} ${s.status === "removed" ? styles.bad : s.status === "live" ? styles.good : ""}`}>{SHOT_STATE[s.status]}</span>
            </li>
          );
        })}
        {tips.map((t) => {
          const page = pageNamed(t.kind, t.key);
          return (
            <li key={`t${t.id}`} className={styles.row}>
              <span className={styles.mark} aria-hidden="true">
                ?
              </span>
              <span>
                {t.type === "mistake" ? "A mistake on" : `${t.field ? `${t.field.charAt(0).toUpperCase()}${t.field.slice(1)}` : "What you know"}: `}{" "}
                {page ? <Link href={page.href}>{page.name}</Link> : "a page that is gone"}
                <small>
                  <LocalDate date={t.at} short />
                </small>
              </span>
              <span className={`${styles.state} ${t.status === "approved" || t.status === "fixed" ? styles.good : t.status === "rejected" || t.status === "not a mistake" ? styles.bad : ""}`}>{tipStatusWords(t.status)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
