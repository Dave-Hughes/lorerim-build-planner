"use client";

import { useId, useState } from "react";
import { useGameData } from "@/components/game-data";
import { keepInView } from "@/lib/keep-in-view";
import { fitsSlot, itemById, searchItems, useItems, type GameItem } from "@/lib/items/items";
import { enchantTarget, fitsTarget, searchEnchantments } from "@/lib/rules/enchantments";
import { START_LIST_MAX } from "@/lib/rules/spells";
import type { Enchantment } from "@/lib/rules/data";
import { IconLabel, SlotIcon } from "@/components/ui/skill-icon";
import { GEAR_SLOTS, gearAt, gearChangeText, gearChanges, madeStaffName, type GearSlot, type HeldGear } from "@/lib/rules/gear";
import type { BuildPlan, MadeGear } from "@/lib/rules/types";
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
                    initial={{ name: h.name, note: h.note, itemId: h.itemId, made: h.made }}
                    submit="Save"
                    // Saving a carried item unchanged changes nothing.
                    onSubmit={(set) =>
                      !here && set.name.trim() === h.name && set.note.trim() === h.note ? setEditing(null) : done(ops.setGearAt(plan, level, h.slot, set, item))
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
                <span className={styles.gearSlot}>
                  <IconLabel icon={<SlotIcon slot={g.slot} />}>{g.slot}</IconLabel>
                </span>
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
          onSubmit={(set, slot) => done(ops.setGearAt(plan, level, slot, set))}
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
 * The item field (a search of the game's items that fit the slot, WO-23; free text is fine for
 * anything the index doesn't have) and an optional note; a slot select when adding.
 */
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
  initial: GearSet;
  submit: string;
  onSubmit: (set: GearSet, slot: GearSlot) => void;
  onCancel: () => void;
}) {
  const d = useGameData();
  const listId = useId();
  const [pick, setPick] = useState<GearSlot>(slot ?? slots?.[0] ?? "Other");
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
  const fitting = open && items && !itemId && !name.trim() ? items.filter((i) => fitsSlot(i, pick)).sort((a, b) => a.name.localeCompare(b.name)) : null;
  const found = !open || !items || itemId ? [] : fitting ? fitting.slice(0, START_LIST_MAX) : searchItems(items, name, 8, (i) => fitsSlot(i, pick));
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
      aria-label={slot ? `Change ${slot}` : "Add gear"}
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() && !(made && isStaff && !spell)) onSubmit(madeSet(), pick);
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        if (open && found.length) setOpen(false);
        else onCancel();
      }}
    >
      {slots ? (
        <span className={styles.gearSlotPick}>
          <SlotIcon slot={pick} />
          <select className="select" aria-label="Slot" value={pick} onChange={(e) => setPick(e.target.value as GearSlot)}>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </span>
      ) : (
        <span className={styles.gearSlot}>
          <IconLabel icon={<SlotIcon slot={slot!} />}>{slot}</IconLabel>
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
      </span>
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
            // The next line appears once the one before it has text.
            [0, 1, 2]
              .filter((i) => i === 0 || enchant[i - 1].trim() || enchant[i].trim())
              .map((i) => (
                <EnchantField
                  key={i}
                  n={i + 1}
                  value={enchant[i]}
                  target={target}
                  taken={enchant.filter((l, k) => k !== i && d.enchantmentById.has(l))}
                  onChange={(v) => setEnchant((x) => x.map((l, k) => (k === i ? v : l)))}
                />
              ))
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
