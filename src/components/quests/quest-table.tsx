"use client";
/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { PreviewLink } from "@/components/pages/preview-link";
import type { TableRow } from "@/lib/quests/table-rows";
import c from "./quest-table.module.css";

type Key = "name" | "who" | "where" | "level" | "length" | "from" | "xp" | "category";
const LEVELS = [
  { key: "", label: "Any" },
  { key: "none", label: "No level needed" },
  { key: "1-10", label: "Level 1 to 10" },
  { key: "11-20", label: "Level 11 to 20" },
  { key: "21-30", label: "Level 21 to 30" },
  { key: "31+", label: "Level 31 and up" },
];
const inLevel = (r: TableRow, k: string) => (k === "" ? true : k === "none" ? r.level === 0 && r.levelKnown : r.level > 0 && (k === "31+" ? r.level >= 31 : r.level >= Number(k.split("-")[0]) && r.level <= Number(k.split("-")[1])));
const known = (s: string | null) => (s ?? "").toLowerCase();

/**
 * A quest category as a table (WO-163, the board QuestCategoryTable): search, Hold, Level and From filters that apply as you pick them, pills
 * with real counts, and one sortable table with a sticky header. On a phone each row is two lines. `across` adds the category as a column
 * (the Quests home's table across every category).
 */
/** A line of several quests: a line of one has a page of its own (or none), and is not one of the lines the pill counts (a Creation Club line of one quest without a page was). */
const several = (r: { kind: string; length: number }) => r.kind === "line" && r.length > 1;

export function QuestTable({ rows, across = false, defaultSort = "name", q = "", label = "Quests" }: { rows: TableRow[]; across?: boolean; defaultSort?: Key; q?: string; label?: string }) {
  const [text, setText] = useState(q);
  const [hold, setHold] = useState("");
  const [level, setLevel] = useState("");
  const [from, setFrom] = useState<"" | "base" | "cc" | "mod">("");
  const [lines, setLines] = useState(false);
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: defaultSort, dir: 1 });
  const holds = useMemo(() => [...new Set(rows.map((r) => r.hold).filter((h): h is string => !!h))].sort(), [rows]);
  const counts = useMemo(() => ({ all: rows.length, base: rows.filter((r) => r.from.kind === "base").length, cc: rows.filter((r) => r.from.kind === "cc").length, mod: rows.filter((r) => r.from.kind === "mod").length, lines: rows.filter(several).length }), [rows]);
  const shown = useMemo(() => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const got = rows.filter(
      (r) => (!hold || r.hold === hold) && inLevel(r, level) && (!from || r.from.kind === from) && (!lines || several(r)) && words.every((w) => [r.name, r.who, r.where].some((f) => known(f).includes(w))),
    );
    const val = (r: TableRow): string | number => {
      switch (sort.key) {
        case "name":
          return r.name.toLowerCase();
        case "who":
          return r.who ? r.who.toLowerCase() : "￿";
        case "where":
          return r.where ? r.where.toLowerCase() : "￿";
        case "level":
          return r.level;
        case "length":
          return r.length;
        case "from":
          return `${r.from.kind === "base" ? 0 : r.from.kind === "cc" ? 1 : 2}${r.from.name.toLowerCase()}`;
        case "xp":
          return r.xp;
        case "category":
          return r.category.toLowerCase();
      }
    };
    return [...got].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir || a.name.localeCompare(b.name);
    });
  }, [rows, text, hold, level, from, lines, sort]);
  const th = (key: Key, name: string, right = false) => (
    <th scope="col" className={`${sort.key === key ? c.on : ""} ${right ? c.r : ""}`} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" onClick={() => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))}>
        {name}
        {sort.key === key && <i className={`${c.ar} ${sort.dir === -1 ? c.up : ""}`} aria-hidden="true" />}
      </button>
    </th>
  );
  const pill = (on: boolean, text: string, n: number, set: () => void) => (
    <button type="button" className={`${c.pill} ${on ? c.pillOn : ""}`} aria-pressed={on} onClick={set}>
      {text} <span>{n}</span>
    </button>
  );
  const reset = () => {
    setFrom("");
    setLines(false);
  };
  return (
    <div className={c.root}>
      <div className={c.tools}>
        {/* Typing narrows the table at once by name, person and place; Enter searches the journals' words on the server (?q=). */}
        <form method="get" role="search" className={c.inp}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8e9bab" strokeWidth="1.6" aria-hidden="true">
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l4 4" />
          </svg>
          <span className="sr-only">Search {label}</span>
          <input type="search" name="q" value={text} placeholder="Name, person, place or journal" onChange={(e) => setText(e.target.value)} />
        </form>
        <label className={c.sel}>
          <b>Hold</b>
          <select value={hold} onChange={(e) => setHold(e.target.value)}>
            <option value="">Any</option>
            {holds.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </label>
        <label className={c.sel}>
          <b>Level</b>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className={c.sel}>
          <b>From</b>
          <select value={from} onChange={(e) => setFrom(e.target.value as typeof from)}>
            <option value="">Any</option>
            <option value="base">Base game</option>
            <option value="cc">Creation Club</option>
            <option value="mod">Mods</option>
          </select>
        </label>
      </div>
      <div className={c.tools} role="group" aria-label="Show">
        {pill(!from && !lines, "All", counts.all, reset)}
        {pill(from === "base" && !lines, "Base game", counts.base, () => (setFrom("base"), setLines(false)))}
        {counts.cc > 0 && pill(from === "cc" && !lines, "Creation Club", counts.cc, () => (setFrom("cc"), setLines(false)))}
        {pill(from === "mod" && !lines, "Mods", counts.mod, () => (setFrom("mod"), setLines(false)))}
        {pill(lines, "Lines of several quests", counts.lines, () => (setLines((v) => !v), setFrom("")))}
      </div>
      <table className={c.table} data-across={across ? "" : undefined}>
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {th("name", "Quest")}
            {th("who", "Starts with")}
            {th("where", "Where")}
            {th("level", "Level")}
            {th("length", "Length")}
            {th("from", "From")}
            {across && th("category", "Category")}
            {th("xp", "Quest XP", true)}
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id}>
              <td className={c.name}>
                <span className={c.qn}>
                  <img className={c.px} src={`/icons/${r.kind === "line" ? "tab-play" : "quest-side-stories"}.svg`} alt="" width={20} height={20} />
                  <PreviewLink href={r.href}>{r.name}</PreviewLink>
                </span>
              </td>
              <td className={c.who} title={r.who ?? undefined}>{r.who ? r.whoHref ? <PreviewLink href={r.whoHref}>{r.who}</PreviewLink> : r.who : <span className={c.mut}>Not known yet</span>}</td>
              <td className={c.where} title={r.where ?? undefined}>{r.where ? <span className={c.pl}>{r.whereHref ? <PreviewLink href={r.whereHref}>{r.where}</PreviewLink> : r.where}</span> : <span className={c.mut}>Not known yet</span>}</td>
              <td className={c.level}>{r.level ? <span className={c.lv} data-level={r.level}>{r.level}</span> : <span className={c.mut}>{r.levelKnown ? "Any" : "Not sure yet"}</span>}</td>
              <td className={c.length}>{r.length === 1 ? "1 quest" : `${r.length} quests`}</td>
              <td className={c.from}>
                {r.from.kind === "base" ? (
                  <span className={c.base}>Base game</span>
                ) : r.from.href ? (
                  <a className={c.mod} href={r.from.href} target="_blank" rel="noreferrer" title={r.from.name}>
                    <span className={c.modName}>{r.from.short}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className={c.mod} title={r.from.name}>
                    <span className={c.modName}>{r.from.short}</span>
                  </span>
                )}
              </td>
              {across && <td className={c.cat}>{r.category}</td>}
              <td className={`${c.xp} ${c.r}`}>{r.xp > 0 ? <span className={c.xpv}>{r.xp.toLocaleString("en-US")}</span> : <span className={c.mut}>No XP</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {shown.length === 0 && <p className="muted">Nothing matches.</p>}
      <span className={c.cap}>
        {shown.length} of {rows.length} shown.
      </span>
    </div>
  );
}
