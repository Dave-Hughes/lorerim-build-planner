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
  // On phones the tabs are one sideways row: keep the current one in view, moving the row only.
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current;
    const tab = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !tab || el.scrollWidth <= el.clientWidth) return;
    const left = tab.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + tab.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollTo({ left: left - (el.clientWidth - tab.offsetWidth) / 2 });
  }, [active]);
  const tabLabel = (tree: string, value: string) => {
    const n = heldCount(d, tree, state);
    return `${tree} ${value}${n ? `, ${n} held` : ""}`;
  };
  // How many perks the build holds in a tree, in ember after its name; nothing when none.
  const held = (tree: string) => {
    const n = heldCount(d, tree, state);
    return n ? (
      <span className={styles.held}>
        {n}
        <span className="sr-only"> held</span>
      </span>
    ) : null;
  };
  return (
    <div className={styles.bar}>
      <div ref={row} role="tablist" aria-label="Perk trees" className={styles.tabs}>
        {/* On short laptop windows the tabs are chips (icon and value): the name is in the tooltip and label. */}
        {d.skills.map((s) => (
          <button key={s} role="tab" type="button" aria-selected={active === s} aria-label={tabLabel(s, `${state.skills[s]}`)} title={s} className={styles.tab} onClick={() => onChange(s)}>
            <SkillIcon name={s} /> <span className={styles.name}>{s}</span> {held(s)} <span className={styles.val}>{state.skills[s]}</span>
          </button>
        ))}
        <button
          role="tab"
          type="button"
          aria-selected={active === "Destiny"}
          aria-label={tabLabel("Destiny", `${destinyLeft} left`)}
          title="Destiny"
          className={styles.tab}
          onClick={() => onChange("Destiny")}
        >
          <SkillIcon name="Destiny" /> <span className={styles.name}>Destiny</span> {held("Destiny")} <span className={styles.val}>{destinyLeft} <span className={styles.name}>left</span></span>
        </button>
      </div>
      {view && onView && <ViewToggle view={view} onView={onView} className={styles.toggle} />}
    </div>
  );
}
