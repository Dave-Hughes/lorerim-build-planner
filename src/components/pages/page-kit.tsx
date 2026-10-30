/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { cleanUnsure } from "@/lib/pages/unsure";
import { BackButton } from "./back-button";
import { PageSearch } from "./page-search";
import { NotSureList, type AnsweredLine } from "./not-sure";
import styles from "./page-kit.module.css";

/** The pieces the quest, line, person and place pages share (WO-154 Part 2): the boards' frame, section head, gold box and "How sure we are". */

/** A fact that isn't known: one muted line where the fact would go (WO-157). Where nothing in a section is known, the page leaves the section out instead. */
export function NotKnown({ children = "Not known yet" }: { children?: ReactNode }) {
  return <span className={styles.muted}>{children}</span>;
}

export function Icon({ name, size = 32 }: { name: string; size?: number }) {
  return <img className={styles.px} src={`/icons/${name}.svg`} alt="" width={size} height={size} />;
}

/** The back link and the search box. */
export function PageTop({ back }: { back: { href: string; label: string } }) {
  return (
    <div className={styles.top}>
      <BackButton home={back} />
      <PageSearch />
    </div>
  );
}

/** The title, large and plain, its tags beneath, and what the page says it is. */
export function TitleBox({ title, tags, children }: { title: string; tags?: ReactNode; children?: ReactNode }) {
  return (
    <div className={styles.titleBox}>
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

/** A section with its small heading and a rule under it, for the side column and the foot (WO-157: no box). */
export function Panel({ id, icon, title, children }: { id: string; icon?: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.panel} aria-labelledby={id}>
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

/** What "I know this" needs on a page's Not sure yet lines (WO-184 Part 2). */
export interface KnowProps {
  kind: "quest" | "person" | "place";
  key: string;
  signedIn: boolean;
  sent: string[];
  answered: AnsweredLine[];
  signIn: ReactNode;
}

export interface SureSource {
  mark: "yes" | "part" | "no";
  name: string;
  /** The source's own page, in a new tab. */
  href?: string;
  note: string;
  names?: ReactNode[];
}

/**
 * Information Confidence (WO-157): always alone and full width at the foot of a page, in a box with the brass corner marks. The plain-word line, a tick per source (game files, UESP, players), what isn't sure yet in a player's words, and the two
 * buttons. The reader's reasons for a doubt are folded under the list, not in it.
 */
export function InformationConfidence({ id, line, sources, unsure, actions, know }: { id: string; line: string; sources: SureSource[]; unsure: { field: string; why?: string }[]; actions: ReactNode; know?: KnowProps }) {
  const mark = { yes: styles.markYes, part: styles.markPart, no: styles.markNo };
  const { fields, reasons } = cleanUnsure(unsure);
  return (
    <section className={`frame ${styles.confidence}`} aria-labelledby={id}>
      <span className={styles.panelHead}>
        <Icon name="quest-sure" />
        <h2 id={id} className={`${styles.h2} ${styles.h2s}`}>
          Information Confidence
        </h2>
      </span>
      <span className={styles.sure}>{line}</span>
      <div className={styles.sureGrid}>
        <div className={styles.sureCol}>
          {sources.map((s) => (
            <span key={s.name} className={styles.source}>
              <span className={`${styles.mark} ${mark[s.mark]}`}>{s.mark === "no" ? "–" : "✓"}</span>
              <b>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.name} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  s.name
                )}
              </b>
              <small>{s.note}</small>
              {s.names?.length ? <span className={styles.names}>{s.names}</span> : null}
            </span>
          ))}
        </div>
        <div className={styles.sureCol} style={{ gap: 10 }}>
          <h3 className={styles.h3}>Not sure yet</h3>
          {fields.length && know ? (
            <NotSureList kind={know.kind} pageKey={know.key} fields={fields} signedIn={know.signedIn} sent={know.sent} answered={know.answered} signIn={know.signIn} seeAll />
          ) : fields.length ? (
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
                {reasons.map((why, i) => (
                  <li key={i}>{why}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
      <span className={styles.buttons}>{actions}</span>
    </section>
  );
}
