"use client";

import { MarkIcon, SkillIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import type { GameData } from "@/lib/rules/data";
import { abilitiesKnown, shoutsKnown, shoutWordsLine, type GainedAbility, type KnownShout } from "@/lib/rules/powers";
import { SCHOOLS, spellsLearned, type LearnedSpell } from "@/lib/rules/spells";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./spell-view.module.css";

/** The first sentence of the game's text, for a main spell's row. */
export function firstSentence(text: string): string {
  const t = text.trim();
  const m = t.match(/^[\s\S]+?[.!?](?=\s|$)/);
  return (m ? m[0] : t).replace(/\s+/g, " ");
}

/** What a build has by a level (WO-52): its spells, abilities and shouts. */
export function spellsAndAbilities(d: GameData, plan: BuildPlan, level: number) {
  return {
    spells: spellsLearned(d, plan, level).filter((s) => s.spell),
    abilities: abilitiesKnown(d, plan, level).filter((a) => a.ability),
    shouts: shoutsKnown(d, plan, level).filter((s) => s.shout),
  };
}

function SpellTip({ s, full }: { s: LearnedSpell; full?: boolean }) {
  const sp = s.spell!;
  return (
    <span className={styles.tip}>
      <span className="muted">{[full ? undefined : sp.school, sp.tier, sp.cast].filter(Boolean).join(", ")}</span>
      <span>{sp.text}</span>
      {s.where && <span className="muted">Where: {s.where}</span>}
    </span>
  );
}

export function AbilityTip({ a, d }: { a: GainedAbility; d: GameData }) {
  const perk = a.fromPerk ? d.perkById.get(a.fromPerk)?.name ?? a.fromPerk : undefined;
  return (
    <span className={styles.tip}>
      <span className="muted">{a.ability!.kind}</span>
      {a.ability!.text && <span>{a.ability!.text}</span>}
      {perk ? <span className="muted">From the {perk} perk</span> : a.where ? <span className="muted">Where: {a.where}</span> : null}
    </span>
  );
}

export function ShoutTip({ s }: { s: KnownShout }) {
  return (
    <span className={styles.tip}>
      <span>{shoutWordsLine(s.shout!)}</span>
      {s.shout!.text && <span>{s.shout!.text}</span>}
      {s.where && <span className="muted">Where: {s.where}</span>}
    </span>
  );
}

/**
 * Spells and abilities at the level being viewed (WO-52, to the canvas artboard "Leaner…", part 2).
 * The main spells first, two columns, each with its first sentence (the rest in the tooltip). Every
 * other spell is a chip in its school's row, in the game's order; then a row of abilities and a row
 * of shouts under a thin rule. Chips new at this level are blue (Magicka). What's learned later
 * stays hidden, as perks do.
 */
export function SpellView({ d, plan, level }: { d: GameData; plan: BuildPlan; level: number }) {
  const { spells, abilities, shouts } = spellsAndAbilities(d, plan, level);
  if (!spells.length && !abilities.length && !shouts.length) return null;
  const byId = new Map(spells.map((s) => [s.id, s]));
  const main = (plan.mainSpells ?? []).map((id) => byId.get(id)).filter((s): s is LearnedSpell => !!s);
  const starred = new Set(main.map((s) => s.id));
  const rest = spells.filter((s) => !starred.has(s.id));
  const schools = SCHOOLS.map((school) => ({ school, rows: rest.filter((s) => s.spell!.school === school) })).filter((g) => g.rows.length);
  // Spells whose school isn't one of the five (a few creature powers) go last, under their own.
  const others = rest.filter((s) => !(SCHOOLS as readonly string[]).includes(s.spell!.school));
  const groups = [...schools, ...(others.length ? [{ school: "Other", rows: others }] : [])];
  const chip = (isNew: boolean) => `${styles.chip} ${isNew ? styles.chipNew : ""}`;
  return (
    <section id="spells" aria-label={`Spells and abilities at level ${level}`} className={styles.section}>
      <div className="section-head">
        <h2 className="section-title">
          Spells and abilities <span className="section-title-at">at level {level}</span>
        </h2>
      </div>
      {main.length > 0 && (
        <div className={`frame ${styles.main}`} role="group" aria-label="Main spells">
          <span className={styles.mainTitle}>Main spells</span>
          <ul className={styles.mainList}>
            {main.map((s) => (
              <li key={s.id} className={styles.mainItem}>
                <SkillIcon name={s.spell!.school} size={24} />
                <Tooltip content={<SpellTip s={s} full />}>
                  <span tabIndex={0} className={styles.mainLine}>
                    <b>{s.spell!.name}</b> <span className={styles.meta}>{s.spell!.tier}</span> <span className={styles.lead}>{firstSentence(s.spell!.text)}</span>
                  </span>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
      )}
      {(groups.length > 0 || abilities.length > 0 || shouts.length > 0) && (
        <div className={styles.rowsGrid}>
          {groups.map((g) => (
            <div key={g.school} role="group" aria-label={g.school} className={styles.group}>
              <span className={styles.groupHead}>
                {g.school !== "Other" && <SkillIcon name={g.school} />}
                <span className={styles.groupName}>{g.school}</span>
              </span>
              <span className={styles.chips}>
                {g.rows.map((s) => (
                  <Tooltip key={s.id} content={<SpellTip s={s} />}>
                    <span tabIndex={0} className={chip(s.level === level)}>
                      {s.spell!.name} <small>Lv {s.level}</small>
                    </span>
                  </Tooltip>
                ))}
              </span>
            </div>
          ))}
          {(abilities.length > 0 || shouts.length > 0) && groups.length > 0 && <span className={styles.rule} aria-hidden="true" />}
          {abilities.length > 0 && (
            <div role="group" aria-label="Abilities" className={styles.group}>
              <span className={styles.groupHead}>
                <MarkIcon name="power" />
                <span className={styles.groupName}>Abilities</span>
              </span>
              <span className={styles.chips}>
                {abilities.map((a) => (
                  <Tooltip key={a.id} content={<AbilityTip a={a} d={d} />}>
                    <span tabIndex={0} className={chip(a.level === level)}>
                      {a.ability!.name} <small>Lv {a.level}</small>
                    </span>
                  </Tooltip>
                ))}
              </span>
            </div>
          )}
          {shouts.length > 0 && (
            <div role="group" aria-label="Shouts" className={styles.group}>
              <span className={styles.groupHead}>
                <MarkIcon name="shout" />
                <span className={styles.groupName}>Shouts</span>
              </span>
              <span className={styles.chips}>
                {shouts.map((s) => (
                  <Tooltip key={s.id} content={<ShoutTip s={s} />}>
                    <span tabIndex={0} className={chip(s.level === level)}>
                      {s.shout!.name} <small>{s.words} of 3 words</small>
                    </span>
                  </Tooltip>
                ))}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
