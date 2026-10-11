"use client";

import { useEffect, useRef } from "react";
import { useGameData } from "@/components/game-data";
import { heldCount } from "@/lib/rules/tree-states";
import type { LevelState } from "@/lib/rules/types";
import { SkillIcon } from "@/components/ui/skill-icon";
import { ViewToggle, type TreeView } from "./tree";
import { Tooltip } from "@/components/ui/tooltip";
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
  // The chip's tooltip: "Two-Handed 27, 3 perks", "Destiny, 2 left".
  const tipFor = (tree: string, head: string) => {
    const n = heldCount(d, tree, state);
    return n ? `${head}, ${n} perk${n === 1 ? "" : "s"}` : head;
  };
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
  // The icon; on short-screen chips the held count is a badge on its corner instead.
  const icon = (tree: string) => {
    const n = heldCount(d, tree, state);
    return (
      <span className={styles.icon}>
        <SkillIcon name={tree} />
        {n > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {n}
          </span>
        )}
      </span>
    );
  };
  return (
    <div className={styles.bar}>
      <div ref={row} role="tablist" aria-label="Perk trees" className={styles.tabs}>
        {/* On short laptop windows the tabs are chips (icon and value): the name is in the tooltip and label. */}
        {d.skills.map((s) => (
          <Tooltip key={s} content={tipFor(s, `${s} ${state.skills[s]}`)}>
            <button role="tab" type="button" aria-selected={active === s} aria-label={tabLabel(s, `${state.skills[s]}`)} className={styles.tab} onClick={() => onChange(s)}>
              {icon(s)} <span className={styles.name}>{s}</span> {held(s)} <span className={styles.val}>{state.skills[s]}</span>
            </button>
          </Tooltip>
        ))}
        <Tooltip content={tipFor("Destiny", `Destiny, ${destinyLeft} left`)}>
          <button role="tab" type="button" aria-selected={active === "Destiny"} aria-label={tabLabel("Destiny", `${destinyLeft} left`)} className={styles.tab} onClick={() => onChange("Destiny")}>
            {icon("Destiny")} <span className={styles.name}>Destiny</span> {held("Destiny")} <span className={styles.val}>{destinyLeft} <span className={styles.name}>left</span></span>
          </button>
        </Tooltip>
      </div>
      {view && onView && <ViewToggle view={view} onView={onView} className={styles.toggle} />}
    </div>
  );
}
