"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { perkText } from "@/lib/rules/data";
import { perkRequirementText, perkStatus, type PerkStatus } from "@/lib/rules/derive";
import { treeLayout } from "@/lib/rules/layout";
import type { LevelState } from "@/lib/rules/types";
import styles from "./tree.module.css";

export interface TreeProps {
  tree: string;
  states: LevelState[];
  level: number;
  selectedId?: string | null;
  /** When given, nodes are buttons; otherwise the tree is read-only. */
  onSelect?: (id: string) => void;
}

export function Tree({ tree, states, level, selectedId, onSelect }: TreeProps) {
  const d = useGameData();
  const scroller = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState(600);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setRoom(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const layout = useMemo(() => treeLayout(d, tree, room), [d, tree, room]);
  const status = useMemo(() => {
    const m = new Map<string, PerkStatus>();
    for (const n of layout.nodes) m.set(n.id, perkStatus(d, states, level, n.id));
    return m;
  }, [d, layout, states, level]);
  const pos = useMemo(() => new Map(layout.nodes.map((n) => [n.id, n])), [layout]);
  const isDestiny = tree === "Destiny";

  return (
    <div className={styles.scroller} ref={scroller}>
      <div className={styles.canvas} style={{ width: layout.width, height: layout.height }}>
        <svg width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" className={styles.edges}>
          <g fill="none">
            {layout.edges.map((e) => {
              const a = pos.get(e.from)!;
              const b = pos.get(e.to)!;
              const child = status.get(e.to)!;
              const parent = status.get(e.from)!;
              const lit = child.state === "taken" && parent.state === "taken";
              const preview = e.to === selectedId && child.state === "open" && parent.state === "taken";
              const cls = lit ? styles.edgeLit : preview ? styles.edgePreview : e.anyOf ? styles.edgeEither : styles.edge;
              return <line key={`${e.from}>${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={cls} />;
            })}
          </g>
        </svg>
        {layout.nodes.map((n) => {
          const p = d.perkById.get(n.id)!;
          const st = status.get(n.id)!;
          const selected = n.id === selectedId;
          const ext = layout.external.filter((x) => x.forId === n.id);
          const rank = Math.min(st.ranksTaken, st.ranks - 1);
          let req = isDestiny ? "" : perkRequirementText(p, rank);
          if (!isDestiny && !req) req = p.book ? "Book" : "No requirement";
          if (st.ranks > 1) req += ` (${st.ranksTaken}/${st.ranks})`;
          if (isDestiny && st.state === "taken") req = `Level ${st.takenAt[0]}`;
          const aria = `${p.name}${req ? `, ${req}` : ""}, ${st.state === "taken" ? "taken" : st.state === "open" ? "can take now" : "not available yet"}`;
          const cls = [styles.node, styles[st.state], selected ? styles.selected : "", st.ranksTaken > 0 && st.state !== "taken" ? styles.partial : ""].join(" ");
          const inner = (
            <>
              <span className={styles.dot} />
              <span className={styles.name}>{p.name}</span>
              {req && <span className={styles.req}>{req}</span>}
              {ext.map((x) => (
                <span key={x.id} className={styles.req}>
                  {p.anyOf ? "or" : "and"} {x.tree}: {x.name}
                </span>
              ))}
              {(p.excludes ?? []).map((x) => {
                const other = d.perkById.get(x);
                return (
                  <span key={x} className={styles.req}>
                    Not with {other && other.tree !== p.tree ? `${other.tree}: ` : ""}
                    {other?.name ?? x}
                  </span>
                );
              })}
            </>
          );
          const style = { left: n.x - 55, top: n.y - 8 };
          const words = perkText(p, Math.max(0, st.ranksTaken - 1));
          const title = [words.text, words.effect].filter(Boolean).join("\n");
          return onSelect ? (
            <button key={n.id} type="button" className={cls} style={style} aria-label={aria} aria-pressed={selected} onClick={() => onSelect(n.id)}>
              {inner}
            </button>
          ) : (
            <div key={n.id} className={cls} style={style} aria-label={aria} role="img" title={title || undefined}>
              {inner}
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <span>
          <i className={styles.keyTaken} />
          Taken
        </span>
        <span>
          <i className={styles.keyOpen} />
          Can take now
        </span>
        <span>
          <i className={styles.keyLocked} />
          Not available yet
        </span>
      </div>
    </div>
  );
}
