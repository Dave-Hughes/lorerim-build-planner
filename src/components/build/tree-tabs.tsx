"use client";

import { useEffect, useRef } from "react";
import { useGameData } from "@/components/game-data";
import { heldCount } from "@/lib/rules/tree-states";
import type { LevelState } from "@/lib/rules/types";
import { SkillIcon } from "@/components/ui/skill-icon";
import { ViewToggle, type TreeView } from "./tree";
import styles from "./tree-tabs.module.css";

export function TreeTabs({
  state,
  active,
  onChange,
  view,
  onView,
}: {
  state: LevelState;
  active: string;
  onChange: (tree: string) => void;
  /** When given, phones show the Tree / List switch at the end of the row. */
  view?: TreeView;
  onView?: (view: TreeView) => void;
}) {
  const d = useGameData();
  const destinyLeft = state.destinyPoints - state.destinyPointsSpent;
  // On phones each group is one sideways row: keep the current chip in view, moving its row only.
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tab = row.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    const el = tab?.parentElement;
    if (!el || !tab || el.scrollWidth <= el.clientWidth) return;
    const left = tab.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + tab.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollTo({ left: left - (el.clientWidth - tab.offsetWidth) / 2 });
  }, [active]);
  const tabLabel = (tree: string, value: string) => {
    const n = heldCount(d, tree, state);
    return `${tree} ${value}${n ? `, ${n} held` : ""}`;
  };
  // How many perks the build holds in a tree: a badge after the level; nothing when none.
  const held = (tree: string) => {
    const n = heldCount(d, tree, state);
    return n ? (
      <span className={styles.held} aria-hidden="true">
        {n}
      </span>
    ) : null;
  };
  const chip = (tree: string, value: React.ReactNode, label: string) => (
    <button key={tree} role="tab" type="button" aria-selected={active === tree} aria-label={label} className={styles.tab} onClick={() => onChange(tree)}>
      <SkillIcon name={tree} />
      <span className={styles.name}>{tree}</span>
      <span className={styles.val}>{value}</span>
      {held(tree)}
    </button>
  );
  // One row per game group (Warrior, Thief, Mage), each chip with its icon, name, level and held
  // count; Destiny beside them, its own control.
  return (
    <div className={styles.bar}>
      <div ref={row} role="tablist" aria-label="Perk trees" className={styles.groups}>
        {d.skillGroups.map((g) => (
          <div key={g.group} className={styles.group}>
            <span className={`sub-label ${styles.groupName}`}>{g.group}</span>
            <div className={styles.tabs}>{g.skills.map((s) => chip(s, state.skills[s], tabLabel(s, `${state.skills[s]}`)))}</div>
          </div>
        ))}
      </div>
      {/* Destiny: its own control in its own colour, gold-filled while there's a point to spend. */}
      <div role="tablist" aria-label="Destiny" className={styles.destinyWrap}>
        <button
          role="tab"
          type="button"
          aria-selected={active === "Destiny"}
          aria-label={tabLabel("Destiny", `${destinyLeft} left`)}
          className={`${styles.destiny} ${destinyLeft > 0 ? styles.destinyToSpend : ""}`}
          onClick={() => onChange("Destiny")}
        >
          <span className={styles.destinyName}>
            <i className={styles.diamond} aria-hidden="true" />
            Destiny
          </span>
          <span className={styles.destinyLeft}>{destinyLeft} left</span>
        </button>
      </div>
      {view && onView && <ViewToggle view={view} onView={onView} className={styles.toggle} />}
    </div>
  );
}
