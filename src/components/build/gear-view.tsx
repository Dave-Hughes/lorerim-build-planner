"use client";

import { useGameData } from "@/components/game-data";
import { IconLabel, SlotIcon } from "@/components/ui/skill-icon";
import { itemById, useItems } from "@/lib/items/items";
import { GEAR_SLOTS, gearAt, type GearSlot } from "@/lib/rules/gear";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./gear-view.module.css";

/** One stretch of levels an item is held for, in one slot (Other can hold several: one lane each). */
interface Segment {
  slot: GearSlot;
  lane: number;
  name: string;
  from: number;
  to: number;
}

/** Every item the build holds, as runs of levels, by slot; Other's items spread over lanes so none overlap. */
function timeline(plan: BuildPlan): Segment[] {
  const total = plan.levels.length;
  const open = new Map<string, Segment>();
  const done: Segment[] = [];
  for (let L = 1; L <= total; L++) {
    const held = gearAt(plan, L);
    const keys = new Set<string>();
    for (const g of held) {
      const key = `${g.slot}|${g.name}|${g.since}`;
      keys.add(key);
      const run = open.get(key);
      if (run) run.to = L;
      else open.set(key, { slot: g.slot, lane: 0, name: g.name, from: L, to: L });
    }
    // A run whose item is no longer held ends at the level before.
    for (const [key, run] of open) {
      if (!keys.has(key)) {
        done.push(run);
        open.delete(key);
      }
    }
  }
  done.push(...open.values());
  // Lanes: within a slot, the first lane free when a run starts.
  const lanesBySlot = new Map<GearSlot, number[]>();
  for (const s of done.sort((a, b) => a.from - b.from)) {
    const lanes = lanesBySlot.get(s.slot) ?? [];
    let lane = lanes.findIndex((end) => end < s.from);
    if (lane < 0) lane = lanes.length;
    lanes[lane] = s.to;
    s.lane = lane;
    lanesBySlot.set(s.slot, lanes);
  }
  return done;
}

/**
 * Gear at this level (WO-32): a card per slot in the fixed slot order, what's new at this level in
 * ember with what it replaced, then the timeline of every slot across the whole build.
 */
export function GearView({ plan, level, onLevel }: { plan: BuildPlan; level: number; onLevel: (n: number) => void }) {
  const d = useGameData();
  // The item index, for the stats line of items picked from it.
  const items = useItems(d.version.id, plan.gear.some((g) => g.itemId));
  const total = plan.levels.length;
  const held = gearAt(plan, level);
  const before = level > 1 ? gearAt(plan, level - 1) : [];
  const segments = timeline(plan);
  const rows = GEAR_SLOTS.flatMap((slot) => {
    const mine = segments.filter((s) => s.slot === slot);
    const lanes = mine.length ? Math.max(...mine.map((s) => s.lane)) + 1 : 0;
    return Array.from({ length: lanes }, (_, lane) => ({ slot, lane, segs: mine.filter((s) => s.lane === lane) }));
  });

  return (
    <section id="gear-at-level" aria-label={`Gear at level ${level}`} className={styles.section}>
      <span className="label">Gear at level {level}</span>
      {held.length === 0 ? (
        <p className="muted">Nothing yet.</p>
      ) : (
        <ul className={styles.cards}>
          {held.map((g) => {
            const isNew = g.since === level;
            const item = g.itemId && items ? itemById(d.version.id, g.itemId) : undefined;
            const was = isNew ? before.find((b) => b.slot === g.slot && (g.slot !== "Other" || b.name !== g.name))?.name : undefined;
            const wasOther = isNew && g.slot === "Other" ? plan.gear.find((r) => r.fromLevel === level && r.slot === "Other" && r.name.trim() === g.name)?.replaces : undefined;
            const replaced = g.slot === "Other" ? wasOther : was;
            return (
              <li key={`${g.slot}-${g.name}`} className={`${styles.card} ${isNew ? styles.cardNew : ""}`}>
                <span className={styles.slot}>
                  <IconLabel icon={<SlotIcon slot={g.slot} size={24} />}>{g.slot}</IconLabel>
                </span>
                <span className={styles.name}>{g.name}</span>
                <span className={styles.stats}>{item?.stats ?? g.note}</span>
                <span className={styles.status}>{isNew ? `New at level ${level}${replaced ? `, was ${replaced}` : ""}` : `Since level ${g.since}`}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Every slot across the whole build: what was held when. Bars go to the level they start at. */}
      {rows.length > 0 && (
        <div className={`frame ${styles.timelineBox}`} role="group" aria-label="Gear over the whole build">
          <div className={styles.timeline} style={{ ["--levels" as string]: total }}>
            <span />
            <div className={styles.ticks} aria-hidden="true">
              {Array.from({ length: total }, (_, i) => {
                const n = i + 1;
                return (
                  <span key={n} className={n === level ? styles.tickNow : undefined}>
                    {n === 1 || n % 5 === 0 || n === level ? n : ""}
                  </span>
                );
              })}
            </div>
            {rows.map((r) => (
              <div key={`${r.slot}-${r.lane}`} className={styles.rowContents}>
                <span className={styles.rowSlot}>{r.lane === 0 ? <IconLabel icon={<SlotIcon slot={r.slot} />}>{r.slot}</IconLabel> : null}</span>
                <div className={styles.track}>
                  <span className={styles.now} style={{ gridColumn: `${level} / ${level + 1}` }} aria-hidden="true" />
                  {r.segs.map((s) => {
                    const state = s.from === level ? styles.barNew : s.from <= level && level <= s.to ? styles.barHeld : styles.barOther;
                    const label = `${s.name}, ${s.from === s.to ? `level ${s.from}` : `levels ${s.from} to ${s.to}`}`;
                    return (
                      <a
                        key={`${s.name}-${s.from}`}
                        href={`?level=${s.from}`}
                        className={`${styles.bar} ${state}`}
                        style={{ gridColumn: `${s.from} / ${s.to + 1}` }}
                        title={label}
                        aria-label={label}
                        onClick={(e) => {
                          e.preventDefault();
                          onLevel(s.from);
                        }}
                      >
                        {s.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
