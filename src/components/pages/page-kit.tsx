/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { PageSearch } from "./page-search";
import styles from "./page-kit.module.css";

/** The pieces the quest, line, person and place pages share (WO-154 Part 2): the boards' frame, section head, gold box and "How sure we are". */

export function Icon({ name, size = 32 }: { name: string; size?: number }) {
  return <img className={styles.px} src={`/icons/${name}.svg`} alt="" width={size} height={size} />;
}

/** The back link and the search box. */
export function PageTop({ back }: { back: { href: string; label: string } }) {
  return (
    <div className={styles.top}>
      <Link href={back.href} className={styles.back}>
        ‹ {back.label}
      </Link>
      <PageSearch />
    </div>
  );
}

/** The title in its frame, its tags beneath, and what the page says it is. */
export function TitleBox({ title, tags, children }: { title: string; tags?: ReactNode; children?: ReactNode }) {
  return (
    <div className={`frame ${styles.titleBox}`}>
      <div className={styles.titleIn}>
        <h1 className={`title ${styles.h1}`}>{title}</h1>
        {tags ? <span className={styles.tags}>{tags}</span> : null}
        {children}
      </div>
    </div>
  );
}

export function Section({ id, icon, title, count, children }: { id: string; icon: string; title: string; count?: ReactNode; children: ReactNode }) {
  return (
    <section className={styles.sec} aria-labelledby={id}>
      <div className={styles.shead}>
        <Icon name={icon} />
        <h2 id={id} className={styles.h2}>
          {title}
        </h2>
        {count ? <span className={styles.cnt}>{count}</span> : null}
      </div>
      {children}
    </section>
  );
}

/** A panel with its small heading, for the side column and the foot. */
export function Panel({ id, icon, title, framed, children }: { id: string; icon?: string; title: string; framed?: boolean; children: ReactNode }) {
  return (
    <section className={`${framed ? "frame " : ""}${styles.panel}`} aria-labelledby={id}>
      <span className={styles.panelHead}>
        {icon ? <Icon name={icon} /> : null}
        <h2 id={id} className={`${styles.h2} ${styles.h2s}`}>
          {title}
        </h2>
      </span>
      {children}
    </section>
  );
}

/** The gold box: what it pays. */
export function Gold({ id, title = "Rewards", children }: { id: string; title?: string; children: ReactNode }) {
  return (
    <section className={`frame ${styles.rewards}`} aria-labelledby={id}>
      <span className={styles.panelHead} style={{ marginBottom: 6 }}>
        <Icon name="quest-rewards" />
        <h2 id={id} className={`${styles.h2} ${styles.h2s}`}>
          {title}
        </h2>
      </span>
      {children}
    </section>
  );
}

export interface SureSource {
  mark: "yes" | "part" | "no";
  name: string;
  note: string;
  names?: ReactNode[];
}

/**
 * How sure we are: the plain-word line, a tick per source (game files, UESP, players), what isn't sure yet in a player's words, and the two
 * buttons. The reader's reasons for a doubt are folded under the list, not in it.
 */
export function HowSure({ id, line, sources, unsure, actions }: { id: string; line: string; sources: SureSource[]; unsure: { field: string; why?: string }[]; actions: ReactNode }) {
  const mark = { yes: styles.markYes, part: styles.markPart, no: styles.markNo };
  const fields = [...new Set(unsure.map((u) => u.field))];
  const reasons = unsure.filter((u) => u.why);
  return (
    <Panel id={id} icon="quest-sure" title="How sure we are" framed>
      <span className={styles.sure}>{line}</span>
      <div className={styles.sureGrid}>
        <div className={styles.sureCol}>
          {sources.map((s) => (
            <span key={s.name} className={styles.source}>
              <span className={`${styles.mark} ${mark[s.mark]}`}>{s.mark === "no" ? "–" : "✓"}</span>
              <b>{s.name}</b>
              <small>{s.note}</small>
              {s.names?.length ? <span className={styles.names}>{s.names}</span> : null}
            </span>
          ))}
        </div>
        <div className={styles.sureCol} style={{ gap: 10 }}>
          <h3 className={styles.h3}>Not sure yet</h3>
          {fields.length ? (
            <ul className={styles.unsure}>
              {fields.map((f) => (
                <li key={f}>{f.charAt(0).toUpperCase() + f.slice(1)}.</li>
              ))}
            </ul>
          ) : (
            <span className={styles.plain}>Nothing is flagged.</span>
          )}
          {reasons.length > 0 && (
            <details className={styles.why}>
              <summary>Why we&apos;re unsure</summary>
              <ul>
                {reasons.map((u, i) => (
                  <li key={i}>
                    <b>{u.field}</b>: {u.why}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
      <span className={styles.buttons}>{actions}</span>
    </Panel>
  );
}
