"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryRow } from "@/lib/quests/line-view";
import c from "./category-rows.module.css";

function SourceTags({ sources }: { sources: CategoryRow["sources"] }) {
  return (
    <>
      {sources.map((s) =>
        s.modid ? (
          <a key={s.name} href={`https://www.nexusmods.com/skyrimspecialedition/mods/${s.modid}`} target="_blank" rel="noreferrer" className={c.tag}>
            {s.name} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span key={s.name} className={c.tag}>
            {s.name}
          </span>
        ),
      )}
    </>
  );
}

/** One line as a row (WO-160, MainStoriesPage): a big number when the page numbers them, the name, tags, the pitch, how it starts, and its XP. */
export function LineRow({ r, n }: { r: CategoryRow; n?: number }) {
  return (
    <article className={`${c.story} ${n ? "" : c.plain}`} aria-labelledby={`line-${r.id}`}>
      {n ? <span className={c.n}>{n}</span> : null}
      <div className={c.body}>
        <h2 id={`line-${r.id}`} className={c.h2}>
          <Link href={r.href}>{r.name}</Link>
        </h2>
        <div className={c.tags}>
          {r.lineTag && <span className={`${c.tag} ${c.mq}`}>{r.lineTag}</span>}
          {r.prince && <span className={c.tag}>{r.prince}</span>}
          <SourceTags sources={r.sources} />
          <span className={`${c.tag} ${c.lv}`}>{r.level}</span>
          <span className={c.tag}>{r.size}</span>
          {r.where && (
            <span className={`${c.tag} ${c.pl}`}>
              <img className={c.px} src="/icons/quest-travel.svg" alt="" width={16} height={16} />
              {r.where}
            </span>
          )}
          {r.also && <span className={c.also}>{r.also}</span>}
        </div>
        {r.pitch && <p className={r.quoted ? c.quote : c.pitch}>{r.quoted ? `“${r.pitch}”` : r.pitch}</p>}
        {r.start && (
          <div className={c.starts}>
            <b>Starts</b>
            <span>{r.start}</span>
          </div>
        )}
        {r.chapters.length > 0 && (
          <div className={c.ch}>
            {r.chapters.slice(0, 4).map((x) => (
              <span key={x}>{x}</span>
            ))}
            {r.chapters.length > 4 && <span>+ {r.chapters.length - 4} chapters</span>}
          </div>
        )}
      </div>
      <div className={c.side}>
        {r.xp && (
          <>
            <span className={c.xpl}>Quest XP</span>
            <span className={c.xpv}>{r.xp}</span>
          </>
        )}
        <Link href={r.href} className={c.go}>
          {r.chapters.length ? "Open the story ›" : "Open ›"}
        </Link>
      </div>
    </article>
  );
}

/** A quest that is a line of one, in the compact list after the lines. */
export function SoloRow({ r }: { r: CategoryRow }) {
  return (
    <article className={c.t} aria-label={r.name}>
      <Link href={r.href} className={c.nm}>
        {r.name}
      </Link>
      {r.pitch && <i>{r.quoted ? `“${r.pitch}”` : r.pitch}</i>}
      <span className={c.m}>
        {r.prince && <span className={c.tag}>{r.prince}</span>}
        {r.levelNumber > 0 && <span className={`${c.tag} ${c.lv}`}>{r.level}</span>}
        <SourceTags sources={r.sources} />
        {r.also}
      </span>
    </article>
  );
}

/**
 * A category's lines as rows, then its single quests (WO-160). Search and Source narrow both; the search goes to the server (the
 * journal's words), the source filter is here. Main stories passes `fixed` and gets no filters.
 */
export function CategoryRows({ lines, solos, q, fixed = false, soloTitle = "Single quests", soloNote }: { lines: CategoryRow[]; solos: CategoryRow[]; q: string; fixed?: boolean; soloTitle?: string; soloNote?: string }) {
  const [source, setSource] = useState<"" | "base" | "mods">("");
  const [query, setQuery] = useState(q);
  const keep = (r: CategoryRow) => !source || (source === "base" ? r.sources.some((s) => s.base) : r.sources.some((s) => !s.base));
  const shownLines = useMemo(() => (fixed ? lines : lines.filter(keep).sort((a, b) => a.levelNumber - b.levelNumber || a.name.localeCompare(b.name))), [lines, source, fixed]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownSolos = useMemo(() => solos.filter(keep).sort((a, b) => a.levelNumber - b.levelNumber || a.name.localeCompare(b.name)), [solos, source]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {!fixed && (
        <div className={c.filters}>
          <form method="get" role="search" className={c.search}>
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
        </div>
      )}
      {shownLines.length + shownSolos.length === 0 && <p className="muted">Nothing matches.</p>}
      <div className={c.rows}>
        {shownLines.map((r, i) => (
          <LineRow key={r.id} r={r} n={fixed ? i + 1 : undefined} />
        ))}
      </div>
      {shownSolos.length > 0 && (
        <section className={c.tied} aria-labelledby="solo-h">
          <div className={c.tiedHead}>
            <h2 id="solo-h" className={c.h3}>
              {soloTitle}
            </h2>
            <span className={c.cap}>{soloNote ?? `${shownSolos.length} quest${shownSolos.length === 1 ? "" : "s"} that stand on their own.`}</span>
          </div>
          <div className={c.tiedGrid}>
            {shownSolos.map((r) => (
              <SoloRow key={r.id} r={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
