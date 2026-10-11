"use client";

import { useState } from "react";
import { GEAR_SLOTS, gearAt, gearChangeText, gearChanges, type GearSlot, type HeldGear } from "@/lib/rules/gear";
import type { BuildPlan } from "@/lib/rules/types";
import * as ops from "./plan-ops";
import styles from "./editor.module.css";

/** Which entry is being changed: a slot, or one `Other` item by its name; "add" for Add gear. */
type Editing = { slot: GearSlot; item?: string } | "add" | null;

/**
 * The level's gear: what each slot holds here, carried items muted ("Steel spear, since level 4"),
 * changes made at this level in ember with Undo. Gear is optional: a build without any shows only
 * Add gear, and nothing here ever raises a problem.
 */
export function GearBlock({ plan, level, setPlan }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void }) {
  const [editing, setEditing] = useState<Editing>(null);
  const held = gearAt(plan, level);
  const emptied = gearChanges(plan, level).filter((g) => !g.name.trim());
  const free = GEAR_SLOTS.filter((s) => s === "Other" || !held.some((h) => h.slot === s));
  const what = (slot: string, item?: string) => (slot === "Other" ? `${item} (Other)` : slot);
  const isEditing = (h: HeldGear) => editing !== null && editing !== "add" && editing.slot === h.slot && (h.slot !== "Other" || editing.item === h.name);
  const done = (p: BuildPlan) => {
    setPlan(p);
    setEditing(null);
  };

  return (
    <section aria-label="Gear" className={styles.gearBlock}>
      <div className={styles.blockHead}>
        <span className="label">Gear</span>
        <span className={styles.hint}>Optional. Carries over until you change it.</span>
      </div>
      {(held.length > 0 || emptied.length > 0) && (
        <ul className={styles.gearList}>
          {held.map((h) => {
            const here = h.since === level;
            const item = h.slot === "Other" ? h.name : undefined;
            if (isEditing(h))
              return (
                <li key={`${h.slot}-${h.name}`}>
                  <GearForm
                    slot={h.slot}
                    initial={{ name: h.name, note: h.note }}
                    submit="Save"
                    // Saving a carried item unchanged changes nothing.
                    onSubmit={(name, note) =>
                      !here && name.trim() === h.name && note.trim() === h.note ? setEditing(null) : done(ops.setGearAt(plan, level, h.slot, name, note, item))
                    }
                    onCancel={() => setEditing(null)}
                  />
                </li>
              );
            return (
              <li key={`${h.slot}-${h.name}`} className={`${styles.gearItem} ${here ? styles.gearItemHere : ""}`}>
                <span className={styles.gearSlot}>{h.slot}</span>
                <span className={styles.gearWhat}>
                  {here ? <span className={styles.gearSet}>{h.name}</span> : <span className={styles.gearCarried}>{`${h.name}, since level ${h.since}`}</span>}
                  {h.note && <span className={styles.gearNote}>{h.note}</span>}
                </span>
                <span className={styles.gearActions}>
                  <button type="button" className="btn btn-sm" aria-label={`Change ${what(h.slot, item)}`} onClick={() => setEditing({ slot: h.slot, item })}>
                    Change
                  </button>
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Empty ${what(h.slot, item)} from here`} onClick={() => done(ops.emptyGearAt(plan, level, h.slot, item))}>
                    Empty from here
                  </button>
                  {here && (
                    <button type="button" className="btn btn-sm btn-quiet" aria-label={`Undo ${what(h.slot, item)}`} onClick={() => done(ops.undoGearAt(plan, level, h.slot, item))}>
                      Undo
                    </button>
                  )}
                </span>
              </li>
            );
          })}
          {emptied.map((g) => {
            const item = g.slot === "Other" ? (g.replaces ?? "") : undefined;
            return (
              <li key={`emptied-${g.slot}-${item ?? ""}`} className={`${styles.gearItem} ${styles.gearItemHere}`}>
                <span className={styles.gearSlot}>{g.slot}</span>
                <span className={styles.gearWhat}>
                  <span className={styles.gearSet}>{gearChangeText(g)}</span>
                </span>
                <span className={styles.gearActions}>
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Undo ${g.slot === "Other" ? `${item} (Other)` : g.slot} emptied`} onClick={() => done(ops.undoGearAt(plan, level, g.slot, item))}>
                    Undo
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {editing === "add" ? (
        <GearForm
          slots={free}
          initial={{ name: "", note: "" }}
          submit="Add"
          onSubmit={(name, note, slot) => done(ops.setGearAt(plan, level, slot, name, note))}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setEditing("add")}>
          Add gear
        </button>
      )}
    </section>
  );
}

/** An item field (plain text until the item index exists) and an optional note; a slot select when adding. */
function GearForm({
  slot,
  slots,
  initial,
  submit,
  onSubmit,
  onCancel,
}: {
  slot?: GearSlot;
  slots?: GearSlot[];
  initial: { name: string; note: string };
  submit: string;
  onSubmit: (name: string, note: string, slot: GearSlot) => void;
  onCancel: () => void;
}) {
  const [pick, setPick] = useState<GearSlot>(slot ?? slots?.[0] ?? "Other");
  const [name, setName] = useState(initial.name);
  const [note, setNote] = useState(initial.note);
  return (
    <form
      className={styles.gearForm}
      aria-label={slot ? `Change ${slot}` : "Add gear"}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onSubmit(name, note, pick);
      }}
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
    >
      {slots ? (
        <select className="select" aria-label="Slot" value={pick} onChange={(e) => setPick(e.target.value as GearSlot)}>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : (
        <span className={styles.gearSlot}>{slot}</span>
      )}
      <input className="input" aria-label="Item" value={name} maxLength={120} placeholder="Steel sword" autoFocus onChange={(e) => setName(e.target.value)} />
      <input className="input" aria-label="Note (optional)" value={note} maxLength={300} placeholder="Note (optional)" onChange={(e) => setNote(e.target.value)} />
      <span className={styles.gearFormActions}>
        <button type="submit" className="btn btn-sm btn-primary" disabled={!name.trim()}>
          {submit}
        </button>
        <button type="button" className="btn btn-sm btn-quiet" onClick={onCancel}>
          Cancel
        </button>
      </span>
    </form>
  );
}
