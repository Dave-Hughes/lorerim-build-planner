"use client";

import { useId, useState } from "react";
import { useGameData } from "@/components/game-data";
import { keepInView } from "@/lib/keep-in-view";
import { fitsSlot, itemById, searchItems, useItems, type GameItem } from "@/lib/items/items";
import { enchantLines, enchantTarget, fitsTarget, searchEnchantments } from "@/lib/rules/enchantments";
import { START_LIST_MAX } from "@/lib/rules/spells";
import type { Enchantment } from "@/lib/rules/data";
import { IconLabel, SlotIcon } from "@/components/ui/skill-icon";
import { GEAR_TYPES, gearAt, gearChangeText, gearChanges, madeStaffName, type GearType, type HeldGear } from "@/lib/rules/gear";
import type { BuildPlan, LevelState, MadeGear } from "@/lib/rules/types";
import { Tooltip } from "@/components/ui/tooltip";
import * as ops from "./plan-ops";
import styles from "./editor.module.css";

/** Which piece is being changed, by its type and name; "add" for Add gear. */
type Editing = { type: GearType; item: string } | "add" | null;

/**
 * The level's gear, by type (WO-82): what's worn here, carried pieces muted ("Steel spear, since
 * level 4"), changes made at this level in ember with Undo. A type holds any number of pieces and
 * nothing is checked against what the game allows together. Gear is optional: a build without any
 * shows only Add gear, and nothing here ever raises a problem.
 */
export function GearBlock({ plan, level, state, setPlan }: { plan: BuildPlan; level: number; state: LevelState; setPlan: (p: BuildPlan) => void }) {
  // The enchantment lines the build's perks allow by this level (WO-72).
  const lines = enchantLines(useGameData(), state);
  const [editing, setEditing] = useState<Editing>(null);
  const held = gearAt(plan, level);
  const emptied = gearChanges(plan, level).filter((g) => !g.name.trim());
  const what = (h: { slot: string; name: string }) => `${h.name} (${h.slot})`;
  const isEditing = (h: HeldGear) => editing !== null && editing !== "add" && editing.type === h.slot && editing.item === h.name;
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
            if (isEditing(h))
              return (
                <li key={`${h.slot}-${h.name}`}>
                  <GearForm
                    lines={lines}
                    type={h.slot}
                    // A note belongs to the row it was written on: a change at a later level starts a new row, with no note (WO-72).
                    initial={{ name: h.name, note: here ? h.note : "", itemId: h.itemId, made: h.made }}
                    submit="Save"
                    // Saving a carried piece unchanged (same item, no note of its own) changes nothing.
                    onSubmit={(set) =>
                      !here && set.name.trim() === h.name && !set.note.trim() ? setEditing(null) : done(ops.setGearAt(plan, level, h.slot, set, h.name))
                    }
                    onCancel={() => setEditing(null)}
                  />
                </li>
              );
            return (
              <li key={`${h.slot}-${h.name}`} className={`${styles.gearItem} ${here ? styles.gearItemHere : ""}`}>
                <span className={styles.gearSlot}>
                  <IconLabel icon={<SlotIcon slot={h.slot} />}>{h.slot}</IconLabel>
                </span>
                <span className={styles.gearWhat}>
                  {here ? <span className={styles.gearSet}>{h.name}</span> : <span className={styles.gearCarried}>{`${h.name}, since level ${h.since}`}</span>}
                  {h.note && <span className={styles.gearNote}>{h.note}</span>}
                </span>
                <span className={styles.gearActions}>
                  <button type="button" className="btn btn-sm" aria-label={`Change ${what(h)}`} onClick={() => setEditing({ type: h.slot, item: h.name })}>
                    Change
                  </button>
                  <button type="button" className="btn btn-sm btn-quiet" aria-label={`Empty ${what(h)} from here`} onClick={() => done(ops.emptyGearAt(plan, level, h.slot, h.name))}>
                    Empty from here
                  </button>
                  {here && (
                    <button type="button" className="btn btn-sm btn-quiet" aria-label={`Undo ${what(h)}`} onClick={() => done(ops.undoGearAt(plan, level, h.slot, h.name))}>
                      Undo
                    </button>
                  )}
                </span>
              </li>
            );
          })}
          {emptied.map((g) => (
            <li key={`emptied-${g.slot}-${g.replaces ?? ""}`} className={`${styles.gearItem} ${styles.gearItemHere}`}>
              <span className={styles.gearSlot}>
                <IconLabel icon={<SlotIcon slot={g.slot} />}>{g.slot}</IconLabel>
              </span>
              <span className={styles.gearWhat}>
                <span className={styles.gearSet}>{gearChangeText(g)}</span>
              </span>
              <span className={styles.gearActions}>
                <button type="button" className="btn btn-sm btn-quiet" aria-label={`Undo ${gearChangeText(g)}`} onClick={() => done(ops.undoGearAt(plan, level, g.slot, g.replaces ?? ""))}>
                  Undo
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {editing === "add" ? (
        <GearForm
          lines={lines}
          worn={held}
          initial={{ name: "", note: "" }}
          submit="Add"
          onSubmit={(set, type, replaces) => done(ops.setGearAt(plan, level, type, set, replaces))}
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

type GearSet = { name: string; note: string; itemId?: string; made?: MadeGear };

/**
 * The item field (a search of the game's items of the type, WO-23 and WO-82; free text is fine for
 * anything the index doesn't have) and an optional note. Adding, the type comes first, from a plain
 * list (design rule 10), and when that type is already worn, what the new piece replaces.
 */
function GearForm({
  lines,
  type,
  worn,
  initial,
  submit,
  onSubmit,
  onCancel,
}: {
  /** The piece's type, when changing one already worn. */
  type?: GearType;
  /** How many enchantment lines the perks allow, and the rule for the next (WO-72). */
  lines: { allowed: number; missing?: string };
  /** Adding: what's worn at this level, for Replaces. */
  worn?: HeldGear[];
  initial: GearSet;
  submit: string;
  onSubmit: (set: GearSet, type: GearType, replaces?: string) => void;
  onCancel: () => void;
}) {
  const d = useGameData();
  const listId = useId();
  const [pick, setPick] = useState<GearType>(type ?? GEAR_TYPES[0]);
  // What a new piece replaces: one worn of its type is offered, ticked; with several, picked from a list.
  const wornHere = (worn ?? []).filter((h) => h.slot === pick);
  const [replaces, setReplaces] = useState<string>(() => (wornHere.length === 1 ? wornHere[0].name : ""));
  // Search every item: the type filter dropped, for a piece filed under a type the author didn't expect.
  const [everything, setEverything] = useState(false);
  // A made item edits its base item; its name is the game's ("Staff of Forbidden Sun").
  const [name, setName] = useState(initial.made?.base ?? initial.name);
  const [made, setMade] = useState(!!initial.made);
  const [spellName, setSpellName] = useState(() => (initial.made?.spell ? (d.spellById.get(initial.made.spell)?.name ?? "") : ""));
  const [enchant, setEnchant] = useState<string[]>(() => [0, 1, 2].map((i) => initial.made?.enchantments?.[i] ?? ""));
  const [itemId, setItemId] = useState(initial.itemId);
  const [note, setNote] = useState(initial.note);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // The index loads the first time the field is used.
  const items = useItems(d.version.id, open);
  // Open from focus (WO-57): with nothing typed, the items that fit the slot, A to Z.
  const fits = (i: GameItem) => everything || fitsSlot(i, pick);
  const fitting = open && items && !itemId && !name.trim() && !everything ? items.filter(fits).sort((a, b) => a.name.localeCompare(b.name)) : null;
  const found = !open || !items || itemId ? [] : fitting ? fitting.slice(0, START_LIST_MAX) : searchItems(items, name, 8, fits);
  const moreItems = !!fitting && fitting.length > START_LIST_MAX;
  const choose = (i: GameItem) => {
    setName(i.name);
    setItemId(i.id);
    setOpen(false);
  };
  // Made by you (WO-45): a staff takes one spell; anything else up to three enchantment lines (WO-53).
  const base = itemId && items ? itemById(d.version.id, itemId) : undefined;
  const isStaff = base?.weaponType === "Staff" || /\bstaff\b/i.test(name);
  const spell = d.spells.find((sp) => sp.name.toLowerCase() === spellName.trim().toLowerCase());
  // Which enchantments fit (WO-54): from the base item when it's in the index, else the row's slot.
  const target = enchantTarget(pick, base);
  const madeSet = (): GearSet => {
    if (!made) return { name, note, itemId };
    if (isStaff && spell) return { name: madeStaffName(spell.name), note, itemId, made: { base: name.trim(), spell: spell.id } };
    // A typed name that is exactly a fitting enchantment's saves as its id; the same one only once.
    const lines = [
      ...new Set(
        enchant
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => (d.enchantmentById.has(l) ? l : (d.enchantments.find((e) => fitsTarget(e, target) && e.name.toLowerCase() === l.toLowerCase())?.id ?? l))),
      ),
    ];
    return { name, note, itemId, made: { base: name.trim(), ...(lines.length ? { enchantments: lines } : {}) } };
  };
  const spellsList = `${listId}-spells`;
  return (
    <form
      className={styles.gearForm}
      aria-label={type ? `Change ${initial.name} (${type})` : "Add gear"}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() && !(made && isStaff && !spell)) onSubmit(madeSet(), pick, replaces || undefined);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        if (open && found.length) setOpen(false);
        else onCancel();
      }}
    >
      {!type ? (
        <span className={styles.gearSlotPick}>
          <SlotIcon slot={pick} />
          <select
            className="select"
            aria-label="Type"
            value={pick}
            onChange={(e) => {
              const next = e.target.value as GearType;
              const here = (worn ?? []).filter((h) => h.slot === next);
              setPick(next);
              setReplaces(here.length === 1 ? here[0].name : "");
              setEverything(false);
            }}
          >
            {GEAR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </span>
      ) : (
        <span className={styles.gearSlot}>
          <IconLabel icon={<SlotIcon slot={type} />}>{type}</IconLabel>
        </span>
      )}
      <span className={styles.gearSearch}>
        <input
          className="input"
          role="combobox"
          aria-label="Item"
          aria-autocomplete="list"
          aria-expanded={found.length > 0}
          aria-controls={listId}
          aria-activedescendant={found.length ? `${listId}-${index}` : undefined}
          value={name}
          maxLength={120}
          placeholder="Search the game's items, or type one"
          autoFocus
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(e) => {
            setName(e.target.value);
            setItemId(undefined);
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
          <ul role="listbox" id={listId} aria-label="Items" className={styles.gearOptions}>
            {found.map((i, n) => (
              <li
                key={i.id}
                id={`${listId}-${n}`}
                role="option"
                aria-selected={n === index}
                className={styles.gearOption}
                onMouseEnter={() => setIndex(n)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(i);
                }}
              >
                <span className={styles.gearOptionName}>{i.name}</span>
                <span className={styles.gearOptionStats}>{i.stats}</span>
              </li>
            ))}
            {moreItems && (
              <li role="presentation" className={`muted ${styles.gearOptionRest}`}>
                Search for the rest
              </li>
            )}
          </ul>
        )}
        {!everything && !itemId && (
          <button
            type="button"
            className={`btn btn-sm btn-quiet ${styles.gearEvery}`}
            // Keeps focus in the field, so the list stays open on the wider search.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setEverything(true);
              setOpen(true);
            }}
          >
            Search every item
          </button>
        )}
      </span>
      {wornHere.length === 1 && !type && (
        <label className={styles.gearMadeCheck}>
          <input type="checkbox" checked={replaces === wornHere[0].name} onChange={(e) => setReplaces(e.target.checked ? wornHere[0].name : "")} />
          <span>Replaces {wornHere[0].name}</span>
        </label>
      )}
      {wornHere.length > 1 && !type && (
        <span className={styles.gearSlotPick}>
          <select className="select" aria-label="Replaces" value={replaces} onChange={(e) => setReplaces(e.target.value)}>
            <option value="">Replaces nothing</option>
            {wornHere.map((h) => (
              <option key={h.name} value={h.name}>
                Replaces {h.name}
              </option>
            ))}
          </select>
        </span>
      )}
      <input className="input" aria-label="Note (optional)" value={note} maxLength={300} placeholder="Note (optional)" onChange={(e) => setNote(e.target.value)} />
      <span className={styles.gearMade}>
        <label className={styles.gearMadeCheck}>
          <input type="checkbox" checked={made} onChange={(e) => setMade(e.target.checked)} />
          <span>Made by you</span>
        </label>
        {made &&
          (isStaff ? (
            <>
              <input
                className="input"
                aria-label="Spell"
                placeholder="Spell"
                list={spellsList}
                value={spellName}
                onChange={(e) => setSpellName(e.target.value)}
              />
              <datalist id={spellsList}>
                {d.spells.map((sp) => (
                  <option key={sp.id} value={sp.name} />
                ))}
              </datalist>
              {spell && <span className="muted">{madeStaffName(spell.name)}</span>}
            </>
          ) : (
            <>
              {/* The next line appears once the one before it has text, and only as far as the perks
                  allow (WO-72); a line already written stays, so the rules can say what's wrong. */}
              {[0, 1, 2]
                .filter((i) => i === 0 || enchant[i].trim() || (i < lines.allowed && enchant[i - 1].trim()))
                .map((i) => (
                  <EnchantField
                    key={i}
                    n={i + 1}
                    value={enchant[i]}
                    target={target}
                    taken={enchant.filter((l, k) => k !== i && d.enchantmentById.has(l))}
                    onChange={(v) => setEnchant((x) => x.map((l, k) => (k === i ? v : l)))}
                  />
                ))}
              {/* The first line the perks don't allow, with the rule. */}
              {lines.missing && lines.allowed < 3 && enchant[lines.allowed - 1].trim() && !enchant[lines.allowed].trim() && (
                <Tooltip content={lines.missing}>
                  <span tabIndex={0} className={`muted ${styles.ruleTip}`}>
                    Enchantment {lines.allowed + 1}
                  </span>
                </Tooltip>
              )}
            </>
          ))}
      </span>
      <span className={styles.gearFormActions}>
        <button type="submit" className="btn btn-sm btn-primary" disabled={!name.trim() || (made && isStaff && !spell)}>
          {submit}
        </button>
        <button type="button" className="btn btn-sm btn-quiet" onClick={onCancel}>
          Cancel
        </button>
      </span>
    </form>
  );
}

/**
 * One enchantment line (WO-54): a search of the game's enchantments that fit the item. Picking one
 * saves its id; anything else typed stays as text, for what the list doesn't have. One already on
 * the item isn't offered again.
 */
function EnchantField({
  n,
  value,
  target,
  taken,
  onChange,
}: {
  n: number;
  value: string;
  target: ReturnType<typeof enchantTarget>;
  taken: string[];
  onChange: (v: string) => void;
}) {
  const d = useGameData();
  const listId = useId();
  const picked = d.enchantmentById.get(value);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // With nothing typed, every one that fits (WO-57); typing narrows it.
  const found = open && !picked ? searchEnchantments(d, target, value, value.trim() ? 8 : START_LIST_MAX).filter((e) => !taken.includes(e.id)) : [];
  const choose = (e: Enchantment) => {
    onChange(e.id);
    setOpen(false);
  };
  return (
    <span className={styles.gearSearch}>
      <input
        className="input"
        role="combobox"
        aria-label={`Enchantment ${n}`}
        aria-autocomplete="list"
        aria-expanded={found.length > 0}
        aria-controls={listId}
        aria-activedescendant={found.length ? `${listId}-${index}` : undefined}
        placeholder="Search enchantments, or type one"
        maxLength={120}
        autoComplete="off"
        value={picked ? picked.name : value}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          onChange(e.target.value);
          setIndex(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if (!found.length) return;
            e.preventDefault();
            setIndex((i) => keepInView(listId, (i + (e.key === "ArrowDown" ? 1 : -1) + found.length) % found.length));
          } else if (e.key === "Escape" && found.length) {
            // Esc closes this list first, not the whole form.
            e.stopPropagation();
            setOpen(false);
          } else if (e.key === "Enter" && open && !picked) {
            // Enter picks the one highlighted, or keeps what's typed as text.
            e.preventDefault();
            if (found.length) choose(found[Math.min(index, found.length - 1)]);
            else setOpen(false);
          }
        }}
      />
      {found.length > 0 && (
        <ul role="listbox" id={listId} aria-label="Enchantments" className={styles.gearOptions}>
          {found.map((e, k) => (
            <li
              key={e.id}
              id={`${listId}-${k}`}
              role="option"
              aria-selected={k === index}
              className={styles.gearOption}
              onMouseEnter={() => setIndex(k)}
              onMouseDown={(ev) => {
                ev.preventDefault();
                choose(e);
              }}
            >
              <span className={styles.gearOptionName}>{e.name}</span>
              <span className={styles.gearOptionStats}>{e.text}</span>
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
