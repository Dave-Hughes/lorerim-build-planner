"use client";

import { useId, useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { SkillIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import type { Spell } from "@/lib/rules/data";
import { spellsAt, spellsLearned, tierPicksAt } from "@/lib/rules/spells";
import type { BuildPlan } from "@/lib/rules/types";
import * as ops from "./plan-ops";
import styles from "./spell-block.module.css";

const byName = (a: Spell, b: Spell) => a.name.localeCompare(b.name);

/** The game's text for a spell, for its tooltip: the tier (or the perk), the cast type, then the text. */
function SpellTip({ spell, first }: { spell: Spell; first?: string }) {
  return (
    <span className={styles.tip}>
      <span className="muted">{[first ?? `${spell.school}, ${spell.tier}`, spell.cast].filter(Boolean).join(", ")}</span>
      <span>{spell.text}</span>
      {spell.also && spell.also.length > 0 && <span className="muted">Also: {spell.also.join(", ")}</span>}
    </span>
  );
}

/**
 * Under a tier perk taken this level (WO-42): "Choose 2 spells" from its pool, search plus A to
 * Z, chosen ones pinned on top ("1 of 2 chosen"). Spells the build already knows are left out.
 * A pick saves as a spell row with the perk's name as where it came from.
 */
export function SpellPicks({ plan, level, setPlan }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void }) {
  const d = useGameData();
  const tiers = tierPicksAt(d, plan, level);
  if (!tiers.length) return null;
  return (
    <div className={styles.picks}>
      {tiers.map((t) => (
        <PickList key={t.perk} plan={plan} level={level} setPlan={setPlan} perk={t.perk} count={t.count} pool={t.pool} />
      ))}
    </div>
  );
}

function PickList({ plan, level, setPlan, perk, count, pool }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void; perk: string; count: number; pool: string[] }) {
  const d = useGameData();
  const [q, setQ] = useState("");
  const p = d.perkById.get(perk);
  const name = p?.name ?? perk;
  const rows = spellsAt(d, plan, level);
  const chosen = rows.filter((r) => r.freeFrom === perk && r.spell);
  const known = new Set(spellsLearned(d, plan).map((s) => s.id));
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const rest = pool
    .map((id) => d.spellById.get(id))
    .filter((s): s is Spell => !!s && !known.has(s.id))
    .filter((s) => words.every((w) => s.name.toLowerCase().includes(w)))
    .sort(byName);
  const full = chosen.length >= count;
  return (
    <section aria-label={`${name} spells`} className={`frame ${styles.pickCard}`}>
      <div className={styles.pickHead}>
        <SkillIcon name={p?.tree ?? ""} />
        <span className={styles.pickPerk}>{name}</span>
        <span className="muted">({p?.tree})</span>
      </div>
      <div className={styles.pickBar}>
        <span className={styles.pickTitle}>
          Choose {count} {count === 1 ? "spell" : "spells"}
        </span>
        <span className={chosen.length ? "ember" : "muted"}>
          {chosen.length} of {count} chosen
        </span>
        <input className={`input ${styles.pickSearch}`} type="search" placeholder="Search spells" aria-label={`Search ${name} spells`} value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {/* Chosen ones stay pinned above the list, whatever it's scrolled to. */}
      {chosen.length > 0 && (
        <ul className={styles.pickChosen} aria-label="Chosen">
          {chosen.map((r) => (
          <li key={`c${r.index}`} className={`${styles.pickRow} ${styles.pickRowOn}`}>
            <Tooltip content={<SpellTip spell={r.spell!} first={name} />}>
              <span className={styles.pickName} tabIndex={0}>
                {r.spell!.name}
              </span>
            </Tooltip>
            <span className={styles.pickCast}>{r.spell!.cast}</span>
            <button type="button" className="btn btn-sm" aria-pressed="true" aria-label={`Remove ${r.spell!.name}`} onClick={() => setPlan(ops.removeSpell(plan, level, r.index))}>
              Remove
            </button>
          </li>
          ))}
        </ul>
      )}
      <ul className={styles.pickList}>
        {rest.map((s) => (
          <li key={s.id} className={styles.pickRow}>
            <Tooltip content={<SpellTip spell={s} first={name} />}>
              <span className={styles.pickName} tabIndex={0}>
                {s.name}
              </span>
            </Tooltip>
            <span className={styles.pickCast}>{s.cast}</span>
            <button type="button" className="btn btn-sm" aria-pressed="false" aria-label={`Choose ${s.name}`} disabled={full} onClick={() => setPlan(ops.addSpell(plan, level, { id: s.id, where: name }))}>
              Choose
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The level's spells (WO-42): every spell learned here, with where, a star for a main spell and
 * Remove; and Add spell, for one learned any other way (bought, found, taught), with an optional
 * Where line.
 */
export function SpellBlock({ plan, level, setPlan }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void }) {
  const d = useGameData();
  const rows = spellsAt(d, plan, level);
  const [adding, setAdding] = useState(false);
  const main = new Set(plan.mainSpells ?? []);
  return (
    <section aria-label="Spells" className={styles.block}>
      <span className="label">Spells</span>
      {rows.length > 0 && (
        <ul className={styles.rows}>
          {rows.map((r) => {
            const s = r.spell;
            const label = s?.name ?? "Unknown spell";
            return (
              <li key={r.index} className={styles.row}>
                <span className={styles.rowName}>
                  {s && <SkillIcon name={s.school} />}
                  {s ? (
                    <Tooltip content={<SpellTip spell={s} />}>
                      <span tabIndex={0}>{s.name}</span>
                    </Tooltip>
                  ) : (
                    <span className="bad">{label}</span>
                  )}
                  {s && <span className="muted">{s.tier}</span>}
                </span>
                {r.freeFrom ? (
                  <span className={styles.rowWhere}>{r.where ?? d.perkById.get(r.freeFrom)?.name}</span>
                ) : (
                  <input
                    className={`input ${styles.whereInput}`}
                    aria-label={`Where for ${label}`}
                    placeholder="Where"
                    maxLength={80}
                    value={r.where ?? ""}
                    onChange={(e) => setPlan(ops.setSpellWhere(plan, level, r.index, e.target.value))}
                  />
                )}
                <span className={styles.rowActions}>
                  {s && (
                    <button
                      type="button"
                      className={`btn btn-sm btn-icon ${styles.star} ${main.has(r.id) ? styles.starOn : ""}`}
                      aria-pressed={main.has(r.id)}
                      aria-label={`Main spell: ${s.name}`}
                      disabled={!main.has(r.id) && main.size >= 8}
                      onClick={() => setPlan(ops.toggleMainSpell(plan, r.id))}
                    >
                      ★
                    </button>
                  )}
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Remove ${label}`} onClick={() => setPlan(ops.removeSpell(plan, level, r.index))}>
                    Remove
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {adding ? (
        <AddSpell
          onAdd={(id, where) => {
            setPlan(ops.addSpell(plan, level, { id, where }));
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setAdding(true)}>
          Add spell
        </button>
      )}
    </section>
  );
}

/** Search every spell by name, the school and tier beside each; an optional Where line. */
function AddSpell({ onAdd, onCancel }: { onAdd: (id: string, where: string) => void; onCancel: () => void }) {
  const d = useGameData();
  const listId = useId();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Spell | null>(null);
  const [where, setWhere] = useState("");
  const [index, setIndex] = useState(0);
  const found = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length || picked) return [];
    return d.spells
      .filter((s) => words.every((w) => s.name.toLowerCase().includes(w)))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(words[0])) - Number(!b.name.toLowerCase().startsWith(words[0])) || byName(a, b))
      .slice(0, 10);
  }, [d, q, picked]);
  const choose = (s: Spell) => {
    setPicked(s);
    setQ(s.name);
  };
  return (
    <form
      className={styles.addForm}
      aria-label="Add spell"
      onSubmit={(e) => {
        e.preventDefault();
        if (picked) onAdd(picked.id, where);
      }}
      onKeyDown={(e) => e.key === "Escape" && (found.length ? setQ("") : onCancel())}
    >
      <span className={styles.addSearch}>
        <input
          className="input"
          role="combobox"
          aria-label="Spell"
          aria-autocomplete="list"
          aria-expanded={found.length > 0}
          aria-controls={listId}
          aria-activedescendant={found.length ? `${listId}-${index}` : undefined}
          placeholder="Search spells"
          autoFocus
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPicked(null);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (!found.length) return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + found.length) % found.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(found[Math.min(index, found.length - 1)]);
            }
          }}
        />
        {found.length > 0 && (
          <ul role="listbox" id={listId} aria-label="Spells" className={styles.options}>
            {found.map((s, n) => (
              <li
                key={s.id}
                id={`${listId}-${n}`}
                role="option"
                aria-selected={n === index}
                className={styles.option}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
              >
                <SkillIcon name={s.school} />
                <span className={styles.optionName}>{s.name}</span>
                <span className="muted">
                  {s.school}, {s.tier}
                </span>
              </li>
            ))}
          </ul>
        )}
      </span>
      <input className="input" aria-label="Where (optional)" placeholder="Where (optional)" maxLength={80} value={where} onChange={(e) => setWhere(e.target.value)} />
      <span className={styles.addActions}>
        <button type="submit" className="btn btn-sm btn-primary" disabled={!picked}>
          Add
        </button>
        <button type="button" className="btn btn-sm btn-quiet" onClick={onCancel}>
          Cancel
        </button>
      </span>
    </form>
  );
}
