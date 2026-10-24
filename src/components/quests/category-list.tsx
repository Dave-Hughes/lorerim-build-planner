"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DeityIcon } from "@/components/ui/skill-icon";
import { levelChip } from "@/lib/quests/words";
import type { LineGate, QuestSource } from "@/lib/quests/types";
import styles from "./quests.module.css";

export interface CardLine extends LineGate {
  name: string;
  prince: string | null;
  where: string | null;
  sources: QuestSource[];
  also: string;
  begins: string | null;
  quoted: boolean;
  start?: string;
  gate?: string;
  size?: string;
  quests: number;
  /** A line of one quest isn't a line (WO-154): the card opens that quest's page. */
  solo?: string;
  /** The story told from this line (WO-106): the card's title and link, the line's name under it. */
  story?: { id: string; name: string };
}

/**
 * A category's lines (WO-100, QuestCategory): Search (on the server) and Source (WO-115, 20 Oct: no
 * player context on the Quests pages, so no Your level or Only what I can start); sorted by level, none first, then name. Tell me more opens Start, Needs, Length, Quests
 * and where each was checked. On a phone the filters are in a sheet.
 */
export function CategoryList({ lines, q }: { lines: CardLine[]; main?: string[]; q: string }) {
  const [source, setSource] = useState<"" | "base" | "mods">("");
  const [more, setMore] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [query, setQuery] = useState(q);
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);
  const shown = useMemo(
    () =>
      lines
        .filter((l) => !source || (source === "base" ? l.sources.some((s) => s.base) : l.sources.some((s) => !s.base)))
        .sort((a, b) => (a.minLevel ?? 0) - (b.minLevel ?? 0) || a.name.localeCompare(b.name)),
    [lines, source],
  );
  const filters = (
    <>
      <form method="get" className={`field ${styles.catSearch}`} role="search">
        <label className="field">
          <span className="label">Search</span>
          <input className="input" type="search" name="q" value={query} placeholder="Name, Prince, or the journal's words" onChange={(e) => setQuery(e.target.value)} />
        </label>
      </form>
      <label className="field">
        <span className="label">Source</span>
        <select className="select" value={source} onChange={(e) => setSource(e.target.value as "" | "base" | "mods")}>
          <option value="">Any</option>
          <option value="base">Base game</option>
          <option value="mods">Mods</option>
        </select>
      </label>
    </>
  );
  const on = [!!source].filter(Boolean).length;
  return (
    <>
      <div className={styles.filters}>{filters}</div>
      <div className={styles.phoneBar}>
        <button type="button" className="btn" aria-expanded={sheet} onClick={() => setSheet(true)}>
          Filters{on > 0 && <span className={styles.onCount}>{on}</span>}
        </button>
      </div>
      {sheet && (
        <div className={styles.sheetBackdrop} onClick={(e) => e.target === e.currentTarget && setSheet(false)}>
          <div role="dialog" aria-modal="true" aria-label="Filters" className={styles.sheet}>
            {filters}
            <button type="button" className="btn btn-primary" onClick={() => setSheet(false)}>
              Done
            </button>
          </div>
        </div>
      )}
      <div className={styles.countLine}>
        <span>
          {shown.length} quest{shown.length === 1 ? "" : "s"} and lines
        </span>
        <span className={styles.wideOnly}>By level</span>
      </div>
      {shown.length === 0 && <p className="muted">Nothing matches.</p>}
      <div className={styles.cards}>
        {shown.map((l) => {
          const chip = levelChip(l.minLevel, null);
          const open = more === l.id;
          return (
            <article key={l.id} className={`${styles.card} ${open ? styles.cardOpen : ""} ${chip.above ? styles.later : ""}`} aria-labelledby={`line-${l.id}`}>
              <h2 id={`line-${l.id}`} className={styles.qname}>
                <Link href={l.story ? `/quests/s/${l.story.id}` : (l.solo ?? `/quests/${l.id}`)}>{l.story?.name ?? l.name}</Link>
              </h2>
              {l.story && <span className={styles.lineUnder}>{l.name}</span>}
              <span className={styles.meta}>
                {l.prince ? (
                  <span className={styles.prince}>
                    <DeityIcon name={l.prince} size={32} />
                    {l.prince}
                  </span>
                ) : (
                  l.where && <span>{l.where}</span>
                )}
                <span className={`${styles.lvl} ${chip.above ? styles.above : ""}`}>{chip.text}</span>
                {l.sources.map((s) =>
                  s.modid ? (
                    <a key={s.name} href={`https://www.nexusmods.com/skyrimspecialedition/mods/${s.modid}`} target="_blank" rel="noreferrer" className={`${styles.tag} ${styles.mod}`}>
                      {s.name} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span key={s.name} className={styles.tag}>
                      {s.name}
                    </span>
                  ),
                )}
                {l.also && <span className={styles.also}>{l.also}</span>}
              </span>
              {l.begins && (l.quoted ? <p className={styles.rumour}>“{l.begins}”</p> : <p className={styles.plain}>{l.begins}</p>)}
              {open && (
                <dl className={styles.facts}>
                  {l.start && (
                    <>
                      <dt>Start</dt>
                      <dd>{l.start}</dd>
                    </>
                  )}
                  {l.gate && (
                    <>
                      <dt>Needs</dt>
                      <dd>{l.gate}</dd>
                    </>
                  )}
                  {l.size && (
                    <>
                      <dt>Length</dt>
                      <dd>{l.size}</dd>
                    </>
                  )}
                  {l.solo ? (
                    <>
                      <dt>Quest</dt>
                      <dd>
                        <Link href={l.solo} className={styles.showThem}>
                          Open it ›
                        </Link>
                      </dd>
                    </>
                  ) : (
                    <>
                      <dt>Quests</dt>
                      <dd>
                        {l.quests}{" "}
                        <Link href={`/quests/${l.id}`} className={styles.showThem}>
                          Show them ›
                        </Link>
                      </dd>
                    </>
                  )}
                </dl>
              )}
              <span className={styles.cardFoot}>
                <button type="button" className="btn btn-sm" aria-expanded={open} onClick={() => setMore(open ? null : l.id)}>
                  {open ? "Show less" : "Tell me more"}
                </button>
              </span>
            </article>
          );
        })}
      </div>
    </>
  );
}
