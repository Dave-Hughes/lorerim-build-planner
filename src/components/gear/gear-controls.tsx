"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ItemTypeIcon } from "@/components/ui/skill-icon";
import { ARMOR_CLASSES, SORTS, gearHref, type ArmorClass, type GearQuery, type GearSource, type GearSort } from "@/lib/gear/query";
import styles from "./gear.module.css";

const SOURCE_LABEL: Record<Exclude<GearSource, "">, string> = { made: "Can be made", none: "Not listed" };

/**
 * The Gear page's filters (WO-92): the type chips, search, Armor, Source and Sort. Each change is a
 * new address (pushed, so Back steps through them); typing waits 300 ms. On a phone (GearPhone) the
 * chips, Armor and Source move into a Filters sheet, and what's on shows as pills.
 */
export function GearControls({ query, types, sortLabel }: { query: GearQuery; types: { name: string; n: number }[]; sortLabel: string }) {
  const router = useRouter();
  const [q, setQ] = useState(query.q);
  const [sheet, setSheet] = useState(false);
  const go = (next: Partial<GearQuery>) => router.push(gearHref({ ...query, q, ...next, page: 1 }), { scroll: false });
  const typed = useRef(false);
  useEffect(() => {
    if (!typed.current) return;
    const t = setTimeout(() => router.replace(gearHref({ ...query, q, page: 1 }), { scroll: false }), 300);
    return () => clearTimeout(t);
    // Only the typed text starts the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  const armorTab = query.kind === "armor";
  const on = [query.type, armorTab && query.armor, query.source].filter(Boolean).length;
  const chips = (
    <div role="group" aria-label="Type" className={styles.chips}>
      {types.map((t) => (
        <button key={t.name} type="button" className={styles.chip} aria-pressed={query.type === t.name} onClick={() => go({ type: query.type === t.name ? "" : t.name })}>
          <ItemTypeIcon kind={query.kind} type={t.name} />
          {t.name} <small>{t.n.toLocaleString("en-US")}</small>
        </button>
      ))}
    </div>
  );
  const armorField = armorTab && (
    <label className="field">
      <span className="label">Armor</span>
      <select className="select" value={query.armor} onChange={(e) => go({ armor: e.target.value as ArmorClass })}>
        <option value="">Any</option>
        {ARMOR_CLASSES.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </label>
  );
  const sourceField = (
    <label className="field">
      <span className="label">Source</span>
      <select className="select" value={query.source} onChange={(e) => go({ source: e.target.value as GearSource })}>
        <option value="">Any</option>
        <option value="made">{SOURCE_LABEL.made}</option>
        <option value="none">{SOURCE_LABEL.none}</option>
      </select>
    </label>
  );
  const sortOptions = SORTS[query.kind].map((s) => (
    <option key={s.sort} value={s.sort}>
      {s.label}
    </option>
  ));

  return (
    <section aria-label="Find gear" className={styles.controls}>
      <div className={styles.typeBlock}>
        <span className="label">Type</span>
        {chips}
      </div>
      <div className={styles.fields}>
        <label className={`field ${styles.search}`}>
          <span className="label">Search</span>
          <input
            type="search"
            className="input"
            value={q}
            placeholder="Name or the game's text"
            onChange={(e) => {
              typed.current = true;
              setQ(e.target.value);
            }}
          />
        </label>
        <span className={styles.wideOnly}>{armorField}</span>
        <span className={styles.wideOnly}>{sourceField}</span>
        <label className={`field ${styles.wideOnly}`}>
          <span className="label">Sort</span>
          <select className="select" value={query.sort} onChange={(e) => go({ sort: e.target.value as GearSort })}>
            {sortOptions}
          </select>
        </label>
      </div>

      {/* A phone: Filters and the sort as two buttons, then what's on as pills. */}
      <div className={styles.phoneBar}>
        <button type="button" className="btn" aria-expanded={sheet} onClick={() => setSheet(true)}>
          Filters{on > 0 && <span className={styles.onCount}>{on}</span>}
        </button>
        <label className={styles.sortButton}>
          <span className="sr-only">Sort</span>
          <select className="btn" value={query.sort} onChange={(e) => go({ sort: e.target.value as GearSort })} aria-label={`Sort: ${sortLabel}`}>
            {sortOptions}
          </select>
        </label>
      </div>
      {on > 0 && (
        <p className={styles.pills}>
          {query.type && (
            <button type="button" className={styles.pill} aria-label={`Remove ${query.type}`} onClick={() => go({ type: "" })}>
              <ItemTypeIcon kind={query.kind} type={query.type} />
              {query.type} <span aria-hidden="true">✕</span>
            </button>
          )}
          {armorTab && query.armor && (
            <button type="button" className={styles.pill} aria-label={`Remove ${query.armor}`} onClick={() => go({ armor: "" })}>
              {query.armor} <span aria-hidden="true">✕</span>
            </button>
          )}
          {query.source && (
            <button type="button" className={styles.pill} aria-label={`Remove ${SOURCE_LABEL[query.source]}`} onClick={() => go({ source: "" })}>
              {SOURCE_LABEL[query.source]} <span aria-hidden="true">✕</span>
            </button>
          )}
        </p>
      )}

      {sheet && (
        <div className={styles.sheetBackdrop} onClick={(e) => e.target === e.currentTarget && setSheet(false)}>
          <div role="dialog" aria-modal="true" aria-label="Filters" className={styles.sheet}>
            <div className={styles.typeSheet}>
              <span className="label">Type</span>
              {chips}
            </div>
            {armorField}
            {sourceField}
            <button type="button" className="btn btn-primary" onClick={() => setSheet(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
