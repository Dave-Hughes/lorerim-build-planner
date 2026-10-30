"use client";

/* eslint-disable @next/next/no-img-element -- screenshots shown as sent, for review. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LocalDate } from "@/components/ui/local-date";
import { approveQuestFact, dismissQuestFact, proposeQuestFact, setQuestReport } from "@/lib/quests/report-actions";
import type { Proposal } from "@/lib/quests/player-types";
import { approveScreenshot, removeScreenshot } from "@/lib/screenshots/actions";
import { decideTipAction, readTipAction, trustPlayerAction, untrustPlayerAction } from "@/lib/tips/actions";
import { howWords, type TipHow } from "@/lib/tips/words";
import styles from "./review-tabs.module.css";

type Result = { ok: true } | { ok: false; error: string };

/** Runs one decision, then reloads the list; a refusal is said under the buttons. */
function useDecide() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<Result>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) return setError(r.error);
      setError("");
      router.refresh();
    });
  return { run, error, pending };
}

export interface TipCardData {
  id: number;
  page: { name: string; href: string; what: string } | null;
  type: "know" | "mistake";
  field: string;
  words: string;
  how: TipHow;
  link: string | null;
  screenshotUrl: string | null;
  reading: { words: string; fits: string; confidence: string } | null;
  by: string;
  at: string;
}

/** A player's "I know this" or Report a mistake (board AdminReview, What players know): what they wrote, who, how they know, and the agent's reading. */
export function TipCard({ t }: { t: TipCardData }) {
  const { run, error, pending } = useDecide();
  const [editing, setEditing] = useState(false);
  const [edit, setEdit] = useState(t.words);
  const [reading, setReading] = useState(t.reading);
  const [readErr, setReadErr] = useState("");
  const read = () =>
    run(async () => {
      const r = await readTipAction(t.id);
      if (!r.ok) {
        setReadErr(r.error);
        return r;
      }
      setReadErr("");
      setReading({ words: r.words, fits: "", confidence: "" });
      return { ok: true };
    });
  const mistake = t.type === "mistake";
  return (
    <article className={styles.q} aria-label={`${t.page?.name ?? "A page"}: ${mistake ? "a mistake" : t.field}`}>
      <div className={styles.left}>
        <h3>
          {t.page ? <Link href={t.page.href}>{t.page.name}</Link> : "A page that is gone"}: {mistake ? "report a mistake" : t.field.toLowerCase()}
        </h3>
        <p className={styles.said}>{t.words}</p>
        <div className={styles.meta}>
          <span className={styles.who}>
            <span className={styles.av} />
            {t.by}
          </span>
          <span>{mistake ? "Report a mistake" : howWords(t.how)}</span>
          <LocalDate date={t.at} short />
          {t.link && (
            <a href={t.link} target="_blank" rel="noreferrer">
              The link ↗
            </a>
          )}
          {t.screenshotUrl && (
            <a href={t.screenshotUrl} target="_blank" rel="noreferrer">
              A screenshot
            </a>
          )}
        </div>
      </div>
      <div className={styles.prop}>
        <span className={styles.k}>The agent&apos;s reading</span>
        {reading ? <span className={styles.reading}>{reading.words}</span> : <span className={styles.muted}>The agent hasn&apos;t read this yet.</span>}
        {!reading && (
          <div className={styles.acts}>
            <button type="button" className="btn btn-sm" disabled={pending} onClick={read}>
              Read it
            </button>
          </div>
        )}
        {readErr && <span className={styles.err}>{readErr}</span>}
        {!mistake && (
          <div className={styles.diff}>
            <span className={styles.k}>Now</span>
            <span className={styles.was}>{t.field ? `${t.field.charAt(0).toUpperCase()}${t.field.slice(1)}: not sure yet` : "Not sure yet"}</span>
            <span className={styles.k}>After</span>
            <span className={styles.now}>{(editing ? edit : t.words).replace(/[.!\s]+$/, "")}, from a player</span>
          </div>
        )}
        {editing && (
          <label className={styles.editLabel}>
            What the page says
            <textarea value={edit} onChange={(e) => setEdit(e.target.value)} maxLength={600} />
          </label>
        )}
        <div className={styles.acts}>
          {mistake ? (
            <>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => run(() => decideTipAction(t.id, "fixed"))}>
                Fix it
              </button>
              <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => decideTipAction(t.id, "sent"))}>
                Send to Jeff
              </button>
              <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => decideTipAction(t.id, "not a mistake"))}>
                Not a mistake
              </button>
            </>
          ) : editing ? (
            <>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending || !edit.trim()} onClick={() => run(() => decideTipAction(t.id, "approved", edit))}>
                Approve with this wording
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => run(() => decideTipAction(t.id, "approved"))}>
                Approve
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setEditing(true)}>
                Edit, then approve
              </button>
              <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => decideTipAction(t.id, "rejected"))}>
                Reject
              </button>
            </>
          )}
        </div>
        {error && <span className={styles.err}>{error}</span>}
      </div>
    </article>
  );
}

export interface QuestReportCardData {
  id: number;
  lineName: string;
  lineHref: string;
  questName: string | null;
  kind: "wrong" | "how" | "where";
  what: string;
  text: string;
  fields: Record<string, string | undefined> | null;
  proposal: Proposal | null;
  noChange: boolean;
  by: string;
  at: string;
}

/** A quest report from WO-103 and WO-146 in the same list: a way in or a place goes through the agent's proposal and an approval; "something's wrong" is fixed or not a mistake. */
export function QuestReportCard({ r }: { r: QuestReportCardData }) {
  const { run, error, pending } = useDecide();
  const how = r.kind !== "wrong";
  const said = how ? Object.entries(r.fields ?? {}).filter(([, v]) => v).map(([k, v]) => `${k === "how" ? "What they did" : k === "place" ? "The place" : k[0].toUpperCase() + k.slice(1)}: ${v}`).join(". ") || r.text : r.text;
  return (
    <article className={styles.q} aria-label={`${r.lineName}: ${r.what}`}>
      <div className={styles.left}>
        <h3>
          <Link href={r.lineHref}>{r.questName ?? r.lineName}</Link>: {r.what.toLowerCase()}
        </h3>
        <p className={styles.said}>{said}</p>
        <div className={styles.meta}>
          <span className={styles.who}>
            <span className={styles.av} />
            {r.by}
          </span>
          <span>{how ? "Saw it in their game" : "Report a mistake"}</span>
          <LocalDate date={r.at} short />
        </div>
      </div>
      <div className={styles.prop}>
        <span className={styles.k}>The agent&apos;s reading</span>
        {r.proposal ? (
          <>
            <span className={styles.reading}>
              {r.proposal.why} ({r.proposal.fits}, {r.proposal.confidence} confidence)
            </span>
            <div className={styles.diff}>
              <span className={styles.k}>Now</span>
              <span className={styles.was}>{r.proposal.replaces ?? "Nothing on the page"}</span>
              <span className={styles.k}>After</span>
              <span className={styles.now}>{r.proposal.words.replace(/[.!\s]+$/, "")}, from a player</span>
            </div>
          </>
        ) : (
          <span className={styles.muted}>{how ? "The agent hasn't read this yet." : "Nothing proposed for a mistake report."}</span>
        )}
        <div className={styles.acts}>
          {how ? (
            r.proposal ? (
              <>
                <button type="button" className="btn btn-primary btn-sm" disabled={pending || !r.proposal.way} onClick={() => run(() => approveQuestFact(r.id))}>
                  Approve
                </button>
                <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => dismissQuestFact(r.id))}>
                  Reject
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(async () => { const x = await proposeQuestFact(r.id); return x.ok ? { ok: true } : x; })}>
                  Read it
                </button>
                <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => dismissQuestFact(r.id))}>
                  Reject
                </button>
              </>
            )
          ) : (
            <>
              <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => run(() => setQuestReport(r.id, "fixed"))}>
                Fix it
              </button>
              <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => setQuestReport(r.id, "not a problem"))}>
                Not a mistake
              </button>
            </>
          )}
        </div>
        {error && <span className={styles.err}>{error}</span>}
      </div>
    </article>
  );
}

export interface ShotCardData {
  id: number;
  url: string;
  thumbUrl: string;
  page: { name: string; href: string } | null;
  by: string;
  at: string;
  check: string;
  checkWords: string;
  reportNote: string | null;
}

/** A screenshot waiting (board AdminReview, Screenshots): approve it, approve it and trust the player, or remove it. The check only looks for nudity; whether it shows the place is the admin's call. */
export function ShotCard({ s }: { s: ShotCardData }) {
  const { run, error, pending } = useDecide();
  return (
    <article className={styles.pq} aria-label={`Screenshot for ${s.page?.name ?? "a page"}`}>
      <img src={s.url} alt={`A screenshot sent for ${s.page?.name ?? "a page"}`} />
      <div className={styles.left}>
        <h3 className={styles.pqh}>For {s.page ? <Link href={s.page.href}>{s.page.name}</Link> : "a page that is gone"}</h3>
        <div className={styles.meta}>
          <span className={styles.who}>
            <span className={styles.av} />
            {s.by}
          </span>
          <LocalDate date={s.at} short />
          <span className={s.check === "passed" ? styles.green : styles.gold}>{s.checkWords}</span>
        </div>
        {s.reportNote !== null && <span className={styles.reported}>A player said it isn&apos;t this place{s.reportNote ? `: ${s.reportNote}` : "."}</span>}
        <span className={styles.note}>The check only looks for nudity. Whether it shows the place is yours to judge.</span>
        <div className={styles.acts}>
          <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => run(() => approveScreenshot(s.id))}>
            Approve
          </button>
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => run(() => approveScreenshot(s.id, true))}>
            Approve, and trust this player
          </button>
          <button type="button" className={`btn btn-sm ${styles.redBtn}`} disabled={pending} onClick={() => run(() => removeScreenshot(s.id))}>
            Remove
          </button>
        </div>
        {error && <span className={styles.err}>{error}</span>}
      </div>
    </article>
  );
}

export interface TrustData {
  admins: { id: string; name: string | null; image: string | null }[];
  players: { id: string; name: string | null; image: string | null; source: string; at: string }[];
}

/** Approved players (board AdminReview): the admins, then each player with when and from what they were added, Remove, and Add a player by Discord name. */
export function TrustPanel({ data }: { data: TrustData }) {
  const { run, error, pending } = useDecide();
  const [name, setName] = useState("");
  return (
    <div className={styles.trust}>
      <p className={styles.trustNote}>Screenshots from these players go live without review. The automatic check still runs on every one, and a screenshot it refuses never shows.</p>
      <div className={styles.pl}>
        {data.admins.map((a) => (
          <div key={a.id} className={styles.r}>
            {a.image ? <img className={styles.av} src={a.image} alt="" /> : <span className={styles.av} />}
            {a.name ?? "An admin"}
            <span className={styles.muted}>Admin</span>
          </div>
        ))}
        {data.players.map((p) => (
          <div key={p.id} className={styles.r}>
            {p.image ? <img className={styles.av} src={p.image} alt="" /> : <span className={styles.av} />}
            {p.name ?? "A player"}
            <span className={styles.muted}>
              Added <LocalDate date={p.at} short />, from {p.source || "a screenshot"}
            </span>
            <button type="button" className="btn btn-sm" style={{ marginLeft: "auto" }} disabled={pending} onClick={() => run(() => untrustPlayerAction(p.id))}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <form
        className={styles.add}
        onSubmit={(e) => {
          e.preventDefault();
          run(async () => {
            const r = await trustPlayerAction(name);
            if (r.ok) setName("");
            return r;
          });
        }}
      >
        <label className={styles.editLabel}>
          Add a player by Discord name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Their Discord name, as it shows on the planner" />
        </label>
        <button type="submit" className="btn btn-primary" disabled={pending || !name.trim()}>
          Add
        </button>
      </form>
      {error && <span className={styles.err}>{error}</span>}
    </div>
  );
}
