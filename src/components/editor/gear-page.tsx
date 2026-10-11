"use client";

import Link from "next/link";
import { useState } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import type { BuildPlan, GearItem } from "@/lib/rules/types";
import * as ops from "./plan-ops";
import { useAutosave } from "./use-autosave";
import styles from "./editor.module.css";

/** The owner's page for the build's gear, which belongs to the whole build rather than one level. */
export function GearPage({ buildId, name, initialPlan }: { buildId: string; name: string; initialPlan: BuildPlan }) {
  const [plan, setPlan] = useState(initialPlan);
  const { status, error, retry } = useAutosave(buildId, plan, initialPlan);
  const saveLabel = status === "saved" ? "Saved" : status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved" : "Couldn't save";
  return (
    <>
      <FocusHeader
        context={`Gear for ${name}`}
        status={
          <span className={status === "failed" ? "bad" : undefined}>
            {saveLabel}
            {status === "failed" && (
              <>
                {" "}
                <button type="button" className={styles.linkButton} onClick={retry}>
                  Try again
                </button>
              </>
            )}
          </span>
        }
        actions={
          <>
            <Link href={`/b/${buildId}/edit`} className="btn btn-sm">
              Levels
            </Link>
            <Link href={`/b/${buildId}/guide`} className="btn btn-sm">
              Guide
            </Link>
            <Link href={`/b/${buildId}`} className="btn btn-sm">
              See it as a visitor
            </Link>
          </>
        }
      />
      {error && status === "failed" && <div className={`page ${styles.errorBar}`}>{error}</div>}
      <main className={`page ${styles.gearPage}`}>
        <h1 className={`title ${styles.gearTitle}`}>Gear</h1>
        <Gear plan={plan} setPlan={setPlan} />
      </main>
    </>
  );
}

function Gear({ plan, setPlan }: { plan: BuildPlan; setPlan: (p: BuildPlan) => void }) {
  const gear = plan.gear;
  const update = (i: number, patch: Partial<GearItem>) => setPlan(ops.setGear(plan, gear.map((g, n) => (n === i ? { ...g, ...patch } : g))));
  const add = () => setPlan(ops.setGear(plan, [...gear, { slot: "", name: "", fromLevel: 1, note: "" }]));
  const remove = (i: number) => setPlan(ops.setGear(plan, gear.filter((_, n) => n !== i)));
  return (
    <section aria-label="Gear" className={styles.gearNotes}>
      <div className={styles.gear}>
        {gear.length > 0 && (
          <div className={styles.gearRows}>
            <div className={`${styles.gearRow} ${styles.gearHead}`}>
              <span>Slot</span>
              <span>Item</span>
              <span>From level</span>
              <span>Note</span>
              <span />
            </div>
            {gear.map((g, i) => (
              <div key={i} className={styles.gearRow}>
                <input className="input" aria-label="Slot" value={g.slot} maxLength={40} placeholder="Weapon" onChange={(e) => update(i, { slot: e.target.value })} />
                <input className="input" aria-label="Item" value={g.name} maxLength={120} placeholder="Steel sword" onChange={(e) => update(i, { name: e.target.value })} />
                <input
                  className="input num"
                  aria-label="From level"
                  type="number"
                  min={1}
                  max={plan.levels.length}
                  value={g.fromLevel}
                  onChange={(e) => update(i, { fromLevel: Math.max(1, Math.min(100, Number(e.target.value) || 1)) })}
                />
                <input className="input" aria-label="Note" value={g.note} maxLength={300} placeholder="Where it comes from" onChange={(e) => update(i, { note: e.target.value })} />
                <button type="button" className={styles.x} aria-label="Remove gear row" onClick={() => remove(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" className="btn btn-sm" onClick={add} style={{ alignSelf: "flex-start" }}>
          Add gear
        </button>
      </div>
    </section>
  );
}
