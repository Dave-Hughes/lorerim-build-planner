"use client";

import { useId, useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { keepInView } from "@/lib/keep-in-view";
import { MarkIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import type { Ability, Shout } from "@/lib/rules/data";
import { abilitySource, addableAbilities, perkAbilitiesAt, raceAbilitiesAt, shoutWordsLine } from "@/lib/rules/powers";
import { START_LIST_MAX } from "@/lib/rules/spells";
import type { BuildPlan } from "@/lib/rules/types";
import * as ops from "./plan-ops";
import styles from "./spell-block.module.css";

type Words = 1 | 2 | 3;

function AbilityTip({ ability }: { ability: Ability }) {
  return (
    <span className={styles.tip}>
      <span className="muted">{ability.kind}</span>
      {ability.text && <span>{ability.text}</span>}
    </span>
  );
}

function ShoutTip({ shout, words = 3 }: { shout: Shout; words?: number }) {
  return (
    <span className={styles.tip}>
      <span className="muted">{shoutWordsLine(shout, words)}</span>
      {shout.text && <span>{shout.text}</span>}
    </span>
  );
}

/**
 * A level's abilities (WO-51), built like its spells: the ones a perk taken here grants as
 * read-only lines ("War Cry, from the War Cry perk"), then the author's rows (search, Where, remove).
 */
export function AbilityBlock({ plan, level, setPlan }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void }) {
  const d = useGameData();
  // The race's powers at level 1 (WO-55), then the perks', all read-only.
  const fromPerks = [...raceAbilitiesAt(d, plan, level), ...perkAbilitiesAt(d, plan, level)];
  const rows = plan.levels[level - 1]?.abilities ?? [];
  const [adding, setAdding] = useState(false);
  // A race's power is never added by hand: its race has it already, and no other race can get it.
  const addable = useMemo(() => addableAbilities(d), [d]);
  if (!d.abilities.length) return null;
  return (
    <section aria-label="Abilities" className={styles.block}>
      <span className="label">Abilities</span>
      {(fromPerks.length > 0 || rows.length > 0) && (
        <ul className={styles.rows}>
          {fromPerks.map((a) => (
            <li key={`${a.fromRace ?? a.fromPerk}-${a.id}`} className={`${styles.row} ${styles.rowPower}`}>
              <span className={styles.rowName}>
                <MarkIcon name="power" />
                {a.ability ? (
                  <Tooltip content={<AbilityTip ability={a.ability} />}>
                    <span tabIndex={0}>{a.ability.name}</span>
                  </Tooltip>
                ) : (
                  <span className="bad">Unknown ability</span>
                )}
              </span>
              <span className={styles.rowWhere}>
                {a.ability?.name ?? "It"}, {abilitySource(d, a)}
              </span>
              <span />
            </li>
          ))}
          {rows.map((r, index) => {
            const a = d.abilityById.get(r.id);
            const label = a?.name ?? "Unknown ability";
            return (
              <li key={index} className={`${styles.row} ${styles.rowPower}`}>
                <span className={styles.rowName}>
                  <MarkIcon name="power" />
                  {a ? (
                    <Tooltip content={<AbilityTip ability={a} />}>
                      <span tabIndex={0}>{a.name}</span>
                    </Tooltip>
                  ) : (
                    <span className="bad">{label}</span>
                  )}
                  {a && <span className="muted">{a.kind}</span>}
                </span>
                <input
                  className={`input ${styles.whereInput}`}
                  aria-label={`Where for ${label}`}
                  placeholder="Where"
                  maxLength={80}
                  value={r.where ?? ""}
                  onChange={(e) => setPlan(ops.setAbilityWhere(plan, level, index, e.target.value))}
                />
                <span className={styles.rowActions}>
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Remove ${label}`} onClick={() => setPlan(ops.removeAbility(plan, level, index))}>
                    Remove
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {adding ? (
        <AddPower
          kind="ability"
          items={addable}
          detail={(a) => a.kind}
          onAdd={(id, where) => {
            setPlan(ops.addAbility(plan, level, { id, where }));
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setAdding(true)}>
          Add ability
        </button>
      )}
    </section>
  );
}

/** A level's shouts (WO-51): each row with how many words are known from here (1, 2 or 3). */
export function ShoutBlock({ plan, level, setPlan }: { plan: BuildPlan; level: number; setPlan: (p: BuildPlan) => void }) {
  const d = useGameData();
  const rows = plan.levels[level - 1]?.shouts ?? [];
  const [adding, setAdding] = useState(false);
  if (!d.shouts.length) return null;
  return (
    <section aria-label="Shouts" className={styles.block}>
      <span className="label">Shouts</span>
      {rows.length > 0 && (
        <ul className={styles.rows}>
          {rows.map((r, index) => {
            const s = d.shoutById.get(r.id);
            const label = s?.name ?? "Unknown shout";
            return (
              <li key={index} className={`${styles.row} ${styles.rowShout}`}>
                <span className={styles.rowName}>
                  <MarkIcon name="shout" />
                  {s ? (
                    <Tooltip content={<ShoutTip shout={s} words={r.words} />}>
                      <span tabIndex={0}>{s.name}</span>
                    </Tooltip>
                  ) : (
                    <span className="bad">{label}</span>
                  )}
                  <WordsControl label={label} words={r.words} onChange={(w) => setPlan(ops.setShoutWords(plan, level, index, w))} />
                </span>
                <input
                  className={`input ${styles.whereInput}`}
                  aria-label={`Where for ${label}`}
                  placeholder="Where"
                  maxLength={80}
                  value={r.where ?? ""}
                  onChange={(e) => setPlan(ops.setShoutWhere(plan, level, index, e.target.value))}
                />
                <span className={styles.rowActions}>
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Remove ${label}`} onClick={() => setPlan(ops.removeShout(plan, level, index))}>
                    Remove
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {adding ? (
        <AddPower
          kind="shout"
          items={d.shouts}
          detail={(s) => s.words.join(" ")}
          withWords
          onAdd={(id, where, words) => {
            setPlan(ops.addShout(plan, level, { id, words, where }));
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button type="button" className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setAdding(true)}>
          Add shout
        </button>
      )}
    </section>
  );
}

/** 1 / 2 / 3 words, as a small radio group. */
function WordsControl({ label, words, onChange }: { label: string; words: Words; onChange: (w: Words) => void }) {
  return (
    <span role="radiogroup" aria-label={`Words of ${label}`} className={styles.words}>
      {([1, 2, 3] as const).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={words === n}
          aria-label={`${n} ${n === 1 ? "word" : "words"}`}
          className={`btn btn-sm ${styles.word} ${words === n ? styles.wordOn : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </span>
  );
}

/** Search abilities or shouts by name; an optional Where line, and for a shout its words. */
function AddPower<T extends Ability | Shout>({
  kind,
  items,
  detail,
  withWords,
  onAdd,
  onCancel,
}: {
  kind: "ability" | "shout";
  items: T[];
  detail: (t: T) => string;
  withWords?: boolean;
  onAdd: (id: string, where: string, words: Words) => void;
  onCancel: () => void;
}) {
  const listId = useId();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<T | null>(null);
  const [where, setWhere] = useState("");
  const [words, setWords] = useState<Words>(1);
  const [index, setIndex] = useState(0);
  // Open from focus (WO-57): with nothing typed, every one A to Z.
  const [open, setOpen] = useState(false);
  const found = useMemo(() => {
    const ws = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!open || picked) return [];
    if (!ws.length) return [...items].sort((a, b) => a.name.localeCompare(b.name)).slice(0, START_LIST_MAX);
    return items
      .filter((s) => ws.every((w) => s.name.toLowerCase().includes(w)))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(ws[0])) - Number(!b.name.toLowerCase().startsWith(ws[0])) || a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [items, q, picked, open]);
  const more = open && !picked && !q.trim() && items.length > START_LIST_MAX;
  const choose = (s: T) => {
    setPicked(s);
    setQ(s.name);
    setOpen(false);
  };
  const Name = kind === "ability" ? "Ability" : "Shout";
  return (
    <form
      className={`${styles.addForm} ${withWords ? styles.addFormWords : ""}`}
      aria-label={`Add ${kind}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (picked) onAdd(picked.id, where, words);
      }}
      onKeyDown={(e) => e.key === "Escape" && (found.length ? (q ? setQ("") : setOpen(false)) : onCancel())}
    >
      <span className={styles.addSearch}>
        <input
          className="input"
          role="combobox"
          aria-label={Name}
          aria-autocomplete="list"
          aria-expanded={found.length > 0}
          aria-controls={listId}
          aria-activedescendant={found.length ? `${listId}-${index}` : undefined}
          placeholder={kind === "ability" ? "Search abilities" : "Search shouts"}
          autoFocus
          autoComplete="off"
          value={q}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            setQ(e.target.value);
            setPicked(null);
            setIndex(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (!found.length) return;
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => keepInView(listId, (i + (e.key === "ArrowDown" ? 1 : -1) + found.length) % found.length));
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(found[Math.min(index, found.length - 1)]);
            }
          }}
        />
        {found.length > 0 && (
          <ul role="listbox" id={listId} aria-label={kind === "ability" ? "Abilities" : "Shouts"} className={styles.options}>
            {found.map((s, n) => (
              <li
                key={s.id}
                id={`${listId}-${n}`}
                role="option"
                aria-selected={n === index}
                className={styles.option}
                onMouseEnter={() => setIndex(n)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
              >
                <MarkIcon name={kind === "ability" ? "power" : "shout"} />
                <span className={styles.optionName}>{s.name}</span>
                <span className="muted">{detail(s)}</span>
              </li>
            ))}
            {more && (
              <li role="presentation" className={`muted ${styles.optionRest}`}>
                Search for the rest
              </li>
            )}
          </ul>
        )}
      </span>
      {withWords && <WordsControl label="the shout" words={words} onChange={setWords} />}
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
