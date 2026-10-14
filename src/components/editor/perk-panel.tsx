"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { perkText } from "@/lib/rules/data";
import { dependants, perkName, perkStatus, saysNothingNew, type Dependant } from "@/lib/rules/derive";
import type { BuildPlan, LevelState } from "@/lib/rules/types";
import { missingPrerequisites } from "./plan-ops";
import styles from "./editor.module.css";

interface Props {
  plan: BuildPlan;
  states: LevelState[];
  level: number;
  selectedId: string | null;
  onTake: (id: string) => void;
  /** Removes the perk from this level and any picks (later or here) that need it. */
  onRemove: (id: string, also: Dependant[]) => void;
  onGoToLevel: (level: number) => void;
  /** The card beside the star (WO-59) has Cancel; the sheet on a phone closes its own way. */
  onCancel?: () => void;
}

const COUNT = ["", "", "both", "all three", "all four", "all five", "all six", "all seven", "all eight", "all nine", "all ten"];

/** "A (level 2)", "A (level 2) and B (level 3)", "A (level 2), B (level 3) and C (level 4)". */
function listWithLevels(names: string[]): string {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function PerkPanel(props: Props) {
  // A fresh panel per perk, so a pending "remove these too?" never carries over to another perk.
  return <PerkPanelFor key={`${props.selectedId}@${props.level}`} {...props} />;
}

function PerkPanelFor({ plan, states, level, selectedId, onTake, onRemove, onGoToLevel, onCancel }: Props) {
  const d = useGameData();
  const [asking, setAsking] = useState<Dependant[] | null>(null);
  // After Confirm or Remove the clicked button goes away: keep the page still and move focus to the
  // button that replaced it, without scrolling.
  const actions = useRef<HTMLDivElement>(null);
  const acted = useRef<number | null>(null);
  const act = (fn: () => void) => {
    acted.current = window.scrollY;
    fn();
  };
  useLayoutEffect(() => {
    if (acted.current === null) return;
    const y = acted.current;
    acted.current = null;
    actions.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
    if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo({ top: y, behavior: "instant" });
  });

  const p = selectedId ? d.perkById.get(selectedId) : undefined;
  if (!p) {
    return (
      <aside aria-label="Perk details" className={styles.panel}>
        <p className="muted">Pick a perk in the tree.</p>
      </aside>
    );
  }
  const st = perkStatus(d, states, level, p.id);
  const lv = plan.levels[level - 1];
  const takenHere = (p.tree === "Destiny" ? lv.destiny : lv.perks).includes(p.id);
  const lastTaken = st.takenAt.length ? st.takenAt[st.takenAt.length - 1] : null;
  // The rank in play: the next one to take, or the last one once all are taken.
  const rank = Math.min(st.ranksTaken + 1, st.ranks);
  const { text, effect } = perkText(p, rank - 1);
  const exceptions: string[] = [];
  if (p.book) exceptions.push(`No perk point: read ${p.book}.`);
  if (p.carryItems) exceptions.push(`Carry ${p.carryItems} when you take it.`);
  if (p.quest) exceptions.push(`${p.quest}.`);
  if (p.carryWeight && !saysNothingNew(`+${p.carryWeight} carry weight.`, text)) exceptions.push(`+${p.carryWeight} carry weight.`);
  const showEffect = effect && !saysNothingNew(effect, text);
  // Always say what it can't be held with, not only when it bites.
  const excludes = (p.excludes ?? []).map((x) => {
    const o = d.perkById.get(x);
    return o && o.tree !== p.tree ? `${o.tree}: ${o.name}` : perkName(d, x);
  });
  const biting = st.reasons.some((r) => r.startsWith("Can't be held"));
  // Only its prerequisites missing, and the skills reach them (WO-69): taking it takes them too.
  const s = states[level - 1];
  const chain = st.state === "locked" ? missingPrerequisites(d, s, p.id) : [];
  const pointsFor = chain.filter((x) => !d.perkById.get(x)?.book).length + (p.book ? 0 : 1);
  const canChain =
    chain.length > 0 &&
    st.reasons.every((r) => /^Needs .* first\.$/.test(r) && !/^Needs [^,]+ \d+\./.test(r)) &&
    (p.tree === "Destiny" ? s.destinyPoints - s.destinyPointsSpent : s.perkPoints - s.perkPointsSpent) >= pointsFor;
  const reasons = st.reasons.filter((r) => !r.startsWith("Can't be held"));
  // Ranks already taken, one line each; then the next rank's own text.
  const multi = st.ranks > 1 && !st.granted;
  const rankLines = multi ? st.takenAt.map((L, i) => `Rank ${i + 1} of ${st.ranks}, taken at level ${L}.`) : [];
  const nextRank = multi && st.ranksTaken < st.ranks ? `Rank ${st.ranksTaken + 1} of ${st.ranks}` : null;

  const remove = () => {
    const also = dependants(d, plan, states, level, p.id);
    if (also.length) setAsking(also);
    else act(() => onRemove(p.id, []));
  };

  return (
    <aside aria-label="Perk details" className={styles.panel}>
      <h2 className={`title ${styles.panelName}`}>{p.name}</h2>
      {rankLines.map((l) => (
        <p key={l} className={styles.panelLine}>
          {l}
        </p>
      ))}
      {nextRank && <p className={`${styles.panelLine} ${styles.panelRank}`}>{nextRank}</p>}
      {text && <p className={`flavor ${styles.panelText}`}>{text}</p>}
      {showEffect && <p className={styles.panelEffect}>{effect}</p>}
      {st.granted && <p className={styles.panelLine}>Comes with Master of One.</p>}
      {st.state === "taken" && !st.granted && !multi && lastTaken && <p className={styles.panelLine}>Taken at level {st.takenAt.join(", ")}.</p>}
      {st.state === "open" && st.openedThisLevel && <p className={`ember ${styles.panelLine}`}>{st.openedThisLevel}</p>}
      {exceptions.map((e) => (
        <p key={e} className={styles.panelLine}>
          {e}
        </p>
      ))}
      {excludes.length > 0 && <p className={`${styles.panelLine} ${biting ? "bad" : "muted"}`}>Can&apos;t be held with {excludes.join(" or ")}.</p>}
      {canChain && <p className={`ember ${styles.panelLine}`}>Takes {listWithLevels(chain.map((x) => perkName(d, x)))} too.</p>}
      {st.state === "locked" &&
        !canChain &&
        reasons.map((r) => (
          <p key={r} className={`muted ${styles.panelLine}`}>
            {r}
          </p>
        ))}
      {st.state !== "taken" && st.noPoint && <p className={`muted ${styles.panelLine}`}>{st.noPoint}</p>}
      {asking ? (
        <div className={styles.panelAsk} role="alert">
          <p className={styles.panelLine}>
            {listWithLevels(asking.map((x) => `${perkName(d, x.id)} (level ${x.level})`))} {asking.length === 1 ? "needs" : "need"} this.
          </p>
          <div ref={actions} className={styles.panelActions}>
            <button type="button" className="btn btn-primary" onClick={() => act(() => (setAsking(null), onRemove(p.id, asking)))}>
              Remove {COUNT[asking.length + 1] ?? `all ${asking.length + 1}`}
            </button>
            <button type="button" className="btn" onClick={() => act(() => setAsking(null))}>
              Keep
            </button>
          </div>
        </div>
      ) : (
        <div ref={actions} className={styles.panelActions}>
          {(st.state === "open" || canChain) && (
            <button type="button" className="btn btn-primary" disabled={!canChain && !!st.noPoint} onClick={() => act(() => onTake(p.id))}>
              Confirm
            </button>
          )}
          {takenHere && (
            <button type="button" className="btn" onClick={remove}>
              Remove
            </button>
          )}
          {!takenHere && lastTaken && lastTaken !== level && !st.granted && (
            <button type="button" className="btn btn-quiet" onClick={() => onGoToLevel(lastTaken)}>
              Go to level {lastTaken}
            </button>
          )}
          {onCancel && (
            <button type="button" className="btn btn-quiet" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
