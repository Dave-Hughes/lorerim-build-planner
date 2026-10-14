"use client";

import { useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { SkillIcon } from "@/components/ui/skill-icon";
import { checkSnapshot, fillSnapshot } from "@/lib/rules/snapshot";
import type { BuildPlan, SnapshotResult } from "@/lib/rules/types";
import { Tree } from "./tree";
import styles from "./snapshot-view.module.css";

/**
 * A snapshot build's Build tab (WO-68): the build at its one level. The totals; the 18 skills,
 * highest first, with bars (the majors' in ember); the perks by tree, the picks as key perks; then
 * the reader's tree view with the snapshot's perks taken. No level stepper, ruler or level cards.
 */
export function SnapshotTab({ plan }: { plan: BuildPlan }) {
  const d = useGameData();
  const snap = plan.snapshot!;
  const L = snap.level;
  // The stored result; worked out here for one saved before it was stored.
  const result: SnapshotResult | null = useMemo(() => {
    if (snap.result) return snap.result;
    const r = checkSnapshot(plan, snap, d);
    return r.ok ? r.result : null;
  }, [plan, snap, d]);
  // The levels the rules fill to it, for the tree view's states.
  const states = useMemo(() => fillSnapshot(plan, snap, d).states, [plan, snap, d]);
  const held = new Set(result?.perks ?? []);
  const skills = [...d.skills].sort((a, b) => (result?.skills[b] ?? 0) - (result?.skills[a] ?? 0) || d.skills.indexOf(a) - d.skills.indexOf(b));
  const trees = [...d.skills, "Destiny"]
    .map((t) => ({
      tree: t,
      perks: (d.perksByTree.get(t) ?? []).filter((p) => held.has(p.id)).sort((a, b) => (a.rankSkills?.[0] ?? a.skill ?? 0) - (b.rankSkills?.[0] ?? b.skill ?? 0)),
    }))
    .filter((x) => x.perks.length > 0);
  const [open, setOpen] = useState<string | null>(null);
  const tree = open && trees.some((t) => t.tree === open) ? open : (trees[0]?.tree ?? plan.majors[0] ?? "Destruction");
  if (!result) return <p className="bad">This snapshot doesn&apos;t work in this version of LoreRim.</p>;

  return (
    <div className={styles.wrap}>
      <div className={styles.top} id="snapshot-top">
        <h2 className={styles.title}>At level {L}</h2>
        <span className={styles.totals}>
          <span>
            <b className={styles.health}>{result.health}</b> <span className="muted">Health</span>
          </span>
          <span>
            <b className={styles.magicka}>{result.magicka}</b> <span className="muted">Magicka</span>
          </span>
          <span>
            <b className={styles.stamina}>{result.stamina}</b> <span className="muted">Stamina</span>
          </span>
        </span>
      </div>
      <div className={styles.cols}>
        <section aria-labelledby="snap-skills" id="snapshot-skills">
          <h3 id="snap-skills" className={styles.lab}>
            Skills
          </h3>
          <ul className={styles.skills}>
            {skills.map((s) => {
              const v = result.skills[s] ?? 0;
              return (
                <li key={s} className={styles.sk}>
                  <SkillIcon name={s} />
                  <span>{s}</span>
                  <span className={`${styles.bar} ${plan.majors.includes(s) ? styles.major : ""}`} aria-hidden="true">
                    <span style={{ width: `${v}%` }} />
                  </span>
                  <b className={styles.num}>{v}</b>
                </li>
              );
            })}
          </ul>
        </section>
        <section aria-labelledby="snap-perks" id="snapshot-perks">
          <h3 id="snap-perks" className={styles.lab}>
            Perks <span className={styles.count}>{held.size}</span>
          </h3>
          {trees.map(({ tree: t, perks }) => (
            <div key={t} className={styles.tr} data-tree-row={t}>
              <span className={styles.trName}>
                {t === "Destiny" ? <i className={styles.diamond} aria-hidden="true" /> : <SkillIcon name={t} />}
                <span className={styles.trTitle}>{t}</span>
                {t !== "Destiny" && <span className="muted">{result.skills[t] ?? 0}</span>}
              </span>
              <span>
                {perks.map((p) => (
                  <span key={p.id} className={`${styles.pk} ${snap.perks.includes(p.id) ? styles.key : ""}`}>
                    {p.name}
                  </span>
                ))}
              </span>
            </div>
          ))}
          <p className={styles.legend}>
            <span className={`${styles.pk} ${styles.key}`}>Key perks</span>, the ones the build is about
          </p>
        </section>
      </div>
      <section aria-label="Perk trees" className={styles.treeBox} id="snapshot-trees">
        <div className={styles.chips} role="tablist" aria-label="Trees">
          {trees.map(({ tree: t, perks }) => (
            <button key={t} type="button" role="tab" aria-selected={tree === t} className={styles.chip} onClick={() => setOpen(t)}>
              {t === "Destiny" ? <i className={styles.diamond} aria-hidden="true" /> : <SkillIcon name={t} />}
              {t} <span className={styles.chipCount}>{perks.length}</span>
            </button>
          ))}
        </div>
        <Tree key={tree} tree={tree} states={states} level={L} view="tree" noToggle sheetBelow={1100} />
      </section>
    </div>
  );
}
