"use client";

import { PERK_BY_ID, perkText } from "@/lib/rules/data";
import { perkStatus } from "@/lib/rules/derive";
import type { BuildPlan, LevelState } from "@/lib/rules/types";
import styles from "./editor.module.css";

interface Props {
  plan: BuildPlan;
  states: LevelState[];
  level: number;
  selectedId: string | null;
  onTake: (id: string) => void;
  onRemove: (id: string) => void;
  onGoToLevel: (level: number) => void;
}

export function PerkPanel({ plan, states, level, selectedId, onTake, onRemove, onGoToLevel }: Props) {
  const p = selectedId ? PERK_BY_ID.get(selectedId) : undefined;
  if (!p) {
    return (
      <aside aria-label="Perk details" className={styles.panel}>
        <p className="muted">Pick a perk in the tree.</p>
      </aside>
    );
  }
  const st = perkStatus(states, level, p.id);
  const lv = plan.levels[level - 1];
  const takenHere = (p.tree === "Destiny" ? lv.destiny : lv.perks).includes(p.id);
  const lastTaken = st.takenAt.length ? st.takenAt[st.takenAt.length - 1] : null;
  const exceptions: string[] = [];
  if (p.book) exceptions.push(`No perk point: read ${p.book}.`);
  if (p.carryItems) exceptions.push(`Carry ${p.carryItems} when you take it.`);
  if (p.quest) exceptions.push(`${p.quest}.`);
  if (p.carryWeight) exceptions.push(`+${p.carryWeight} carry weight.`);
  // The rank in play: the next one to take, or the last one once all are taken.
  const rank = Math.min(st.ranksTaken + 1, st.ranks);
  const rankLine = st.ranks > 1 ? `Rank ${rank} of ${st.ranks}` : null;
  const { text, effect } = perkText(p, rank - 1);

  return (
    <aside aria-label="Perk details" className={styles.panel}>
      <h2 className={`title ${styles.panelName}`}>{p.name}</h2>
      {rankLine && <p className={styles.panelLine}>{rankLine}</p>}
      {text && <p className={`flavor ${styles.panelText}`}>{text}</p>}
      {effect && <p className={styles.panelEffect}>{effect}</p>}
      {st.granted && <p className={styles.panelLine}>Comes with Master of One.</p>}
      {st.state === "taken" && !st.granted && lastTaken && (
        <p className={styles.panelLine}>
          Taken at level {st.takenAt.join(", ")}.
        </p>
      )}
      {st.state === "open" && st.openedThisLevel && <p className={`ember ${styles.panelLine}`}>{st.openedThisLevel}</p>}
      {exceptions.map((e) => (
        <p key={e} className={styles.panelLine}>
          {e}
        </p>
      ))}
      {st.state === "locked" &&
        st.reasons.map((r) => (
          <p key={r} className={`muted ${styles.panelLine}`}>
            {r}
          </p>
        ))}
      <div className={styles.panelActions}>
        {st.state === "open" && (
          <button type="button" className="btn btn-primary" onClick={() => onTake(p.id)}>
            Confirm
          </button>
        )}
        {takenHere && (
          <button type="button" className="btn" onClick={() => onRemove(p.id)}>
            Remove
          </button>
        )}
        {!takenHere && lastTaken && lastTaken !== level && !st.granted && (
          <button type="button" className="btn btn-quiet" onClick={() => onGoToLevel(lastTaken)}>
            Go to level {lastTaken}
          </button>
        )}
      </div>
    </aside>
  );
}
