"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { IconLabel, SlotIcon } from "@/components/ui/skill-icon";
import { itemById, useItems } from "@/lib/items/items";
import { GEAR_TYPES, gearAt, replacedName, type GearType } from "@/lib/rules/gear";
import type { BuildPlan, MadeGear } from "@/lib/rules/types";
import { Tooltip } from "@/components/ui/tooltip";
import type { GameData } from "@/lib/rules/data";
import { BASE_VALUES_NOTE, readEnchantLine } from "@/lib/rules/enchantments";
import { useDismiss } from "@/lib/use-dismiss";
import { pageZoom } from "@/lib/zoom";
import styles from "./gear-view.module.css";

/** One stretch of levels a piece is worn for, in one type (a type holds several: one lane each, WO-82). */
interface Segment {
  slot: GearType;
  lane: number;
  name: string;
  from: number;
  to: number;
  /** The author's note on the row (WO-47). */
  note: string;
  itemId?: string;
  made?: MadeGear;
  /** What it took the place of, for its card (WO-50). */
  replaces?: string;
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
      else open.set(key, { slot: g.slot, lane: 0, name: g.name, from: L, to: L, note: g.note.trim(), ...(g.itemId ? { itemId: g.itemId } : {}), ...(g.made ? { made: g.made } : {}) });
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
  // What each run replaced: its row's own `replaces`, or for an old single-slot row, what was worn the level before.
  for (const s of done) {
    const row = plan.gear.find((r) => r.slot === s.slot && r.fromLevel === s.from && r.name.trim() === s.name);
    if (row) s.replaces = replacedName(row, s.from > 1 ? gearAt(plan, s.from - 1) : []);
  }
  // Lanes: within a slot, the first lane free when a run starts.
  const lanesBySlot = new Map<GearType, number[]>();
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

const keyOf = (s: Segment) => `${s.slot}|${s.lane}|${s.from}`;
const CARD_WIDTH = 400;

/**
 * Gear at this level (WO-50, to the canvas artboard "Leaner: gear as the timeline"): the timeline is
 * the section. The viewed level is a faint ember column; what's held then is lit, what's new then is
 * ember. A bar opens its card under it (name and slot, stats, the game's text, the note, how it was
 * made, its levels and what it replaced, and Go to level); one at a time, closed on Esc, a click
 * outside, the same bar again, or another bar.
 */
export function GearView({
  plan,
  level,
  onLevel,
  play,
}: {
  plan: BuildPlan;
  level: number;
  onLevel?: (n: number) => void;
  /**
   * Played level by level (the coming soon page, WO-86): the bars are labels, not buttons, and a piece
   * put on at this level or the two before shows in ember, named at the top right ("New: ...").
   */
  play?: boolean;
}) {
  const d = useGameData();
  // The item index, for the cards' stats and text.
  const items = useItems(d.version.id, plan.gear.some((g) => g.itemId));
  const total = plan.levels.length;
  const segments = timeline(plan);
  // Playing: pieces put on in the last three levels (not the ones she starts with).
  const fresh = (s: Segment) => !!play && s.from > 1 && s.from <= level && level - s.from < 3 && level <= s.to;
  const freshNames = play ? segments.filter(fresh).sort((a, b) => a.from - b.from).map((s) => s.name) : [];
  const rows = GEAR_TYPES.flatMap((slot) => {
    const mine = segments.filter((s) => s.slot === slot);
    const lanes = mine.length ? Math.max(...mine.map((s) => s.lane)) + 1 : 0;
    return Array.from({ length: lanes }, (_, lane) => ({ slot, lane, segs: mine.filter((s) => s.lane === lane) }));
  });

  // The open card: its bar's key, and where it sits in the section.
  // Opened at a level: a new level closes it.
  const [opened, setOpened] = useState<{ key: string; level: number } | null>(null);
  const openKey = opened && opened.level === level ? opened.key : null;
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const bars = useRef(new Map<string, HTMLButtonElement>());
  const openBar = useRef<HTMLButtonElement | null>(null);
  const seg = openKey ? segments.find((s) => keyOf(s) === openKey) : undefined;
  const close = useCallback(() => setOpened(null), []);
  useDismiss({ open: !!seg, onClose: close, inside: [card, openBar], trigger: openBar });

  // Under its bar, right-aligned to it when it would run off the section; full width on a phone.
  const place = useCallback(() => {
    const bar = openKey ? bars.current.get(openKey) : undefined;
    const sec = section.current;
    if (!bar || !sec) return;
    const z = pageZoom();
    const b = bar.getBoundingClientRect();
    const sr = sec.getBoundingClientRect();
    const width = sr.width / z;
    const top = (b.bottom - sr.top) / z + 8;
    if (width < 600) return setPos({ top, left: 0, width });
    let left = (b.left - sr.left) / z;
    if (left + CARD_WIDTH > width) left = Math.max(0, (b.right - sr.left) / z - CARD_WIDTH);
    setPos({ top, left, width: CARD_WIDTH });
  }, [openKey]);
  useLayoutEffect(() => {
    if (!openKey) return;
    place();
    const el = box.current;
    el?.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      el?.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [openKey, place]);

  // Focus moves into the card once it's placed (a hidden card can't take focus).
  const placed = !!(openKey && pos);
  useLayoutEffect(() => {
    if (placed) card.current?.focus({ preventScroll: true });
  }, [placed, openKey]);

  const item = seg?.itemId && items ? itemById(d.version.id, seg.itemId) : undefined;
  const spell = seg?.made?.spell ? d.spellById.get(seg.made.spell) : undefined;

  return (
    <section ref={section} id={play ? undefined : "gear-at-level"} data-tour={play ? undefined : "gear"} aria-label={`Gear at level ${level}`} className={`${styles.section} ${play ? styles.playing : ""}`}>
      <div className={`section-head ${play ? styles.playHead : ""}`}>
        <h2 className="section-title">
          Gear <span className="section-title-at">at level {level}</span>
        </h2>
        {play && freshNames.length > 0 && <span className={styles.fresh}>New: {freshNames.join(", ")}</span>}
      </div>
      {rows.length === 0 ? (
        <p className="muted">Nothing yet.</p>
      ) : (
        <div ref={box} className={`${play ? "" : "frame"} ${styles.timelineBox}`} role="group" aria-label="Gear over the whole build">
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
                    const state = (play ? fresh(s) : s.from === level) ? styles.barNew : s.from <= level && level <= s.to ? styles.barHeld : styles.barOther;
                    // "Staff of Fireball, levels 5 to 29. On the Altar of Magnus." (WO-47)
                    const label = `${s.name}, ${s.from === s.to ? `level ${s.from}` : `levels ${s.from} to ${s.to}`}.${s.note ? ` ${s.note}` : ""}`;
                    const k = keyOf(s);
                    if (play)
                      return (
                        <span key={k} className={`${styles.bar} ${state}`} style={{ gridColumn: `${s.from} / ${s.to + 1}` }}>
                          {s.name}
                        </span>
                      );
                    return (
                      <button
                        key={k}
                        ref={(el) => {
                          if (el) bars.current.set(k, el);
                          else bars.current.delete(k);
                        }}
                        type="button"
                        className={`${styles.bar} ${state}`}
                        style={{ gridColumn: `${s.from} / ${s.to + 1}` }}
                        title={label}
                        aria-label={label}
                        aria-expanded={openKey === k}
                        aria-haspopup="dialog"
                        onClick={(e) => {
                          openBar.current = e.currentTarget;
                          setOpened(openKey === k ? null : { key: k, level });
                        }}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {seg && (
        <div
          ref={card}
          role="dialog"
          aria-label={seg.name}
          tabIndex={-1}
          className={styles.card}
          style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { visibility: "hidden" }}
        >
          <span className={styles.cardHead}>
            <b className={styles.cardName}>{seg.name}</b>
            <span className="muted">{seg.slot}</span>
          </span>
          {item?.stats && <span className="muted">{item.stats}</span>}
          {item?.text && <span className={styles.cardText}>{item.text}</span>}
          {seg.note && <span>{seg.note}</span>}
          {seg.made && (
            <span className={styles.cardMade}>
              <MadeMark made={seg.made} /> Made by you from {seg.made.base}
              {spell ? `, with ${spell.name}` : ""}
            </span>
          )}
          {seg.made && !seg.made.spell && <EnchantList d={d} lines={seg.made.enchantments ?? []} />}
          <span className={styles.cardFoot}>
            <span className="muted">
              {seg.from === seg.to ? `Level ${seg.from}` : `Levels ${seg.from} to ${seg.to}`}
              {seg.replaces ? `, replaces ${seg.replaces}` : ""}
            </span>
            <button
              type="button"
              className={styles.cardGo}
              onClick={() => {
                close();
                onLevel?.(seg.from);
              }}
            >
              Go to level {seg.from}
            </button>
          </span>
        </div>
      )}
    </section>
  );
}

/**
 * A made item's enchantments (WO-54): one picked from the game's list shows its name, the game's
 * text and where it's learned; the author's own words show as they are. A note on the numbers
 * follows when any came from the list.
 */
function EnchantList({ d, lines }: { d: GameData; lines: string[] }) {
  if (!lines.length) return null;
  const read = lines.map((l) => readEnchantLine(d, l));
  return (
    <span className={styles.enchantList}>
      {read.map((r, i) =>
        r.enchantment ? (
          <span key={i} className={styles.enchant}>
            <b>{r.name}</b>
            <span>{r.enchantment.text}</span>
            <span className="muted">{r.enchantment.learned}</span>
          </span>
        ) : (
          <span key={i}>{r.name}</span>
        ),
      )}
      {read.some((r) => r.enchantment) && <span className="muted">{BASE_VALUES_NOTE}</span>}
    </span>
  );
}

/** A small hammer: an item the player made (WO-45). */
function Hammer() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="2" y="2" width="8" height="4" fill="currentColor" />
      <rect x="9" y="3" width="2" height="2" fill="currentColor" />
      <rect x="5" y="6" width="2" height="8" fill="currentColor" />
    </svg>
  );
}

/** The made mark (WO-45): the hammer, and on hover or tap the base item, then the spell or enchantments. */
export function MadeMark({ made }: { made: MadeGear }) {
  const d = useGameData();
  const spell = made.spell ? d.spellById.get(made.spell) : undefined;
  return (
    <Tooltip
      content={
        <span className={styles.madeTip}>
          <span className="muted">Made by you</span>
          <span>{made.base}</span>
          {spell && <span>Spell: {spell.name}</span>}
          {!made.spell && <EnchantList d={d} lines={made.enchantments ?? []} />}
        </span>
      }
    >
      <span className={styles.made} tabIndex={0} aria-label="Made by you">
        <Hammer />
      </span>
    </Tooltip>
  );
}
