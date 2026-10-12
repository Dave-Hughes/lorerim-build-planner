"use client";

import { SkillIcon } from "@/components/ui/skill-icon";
import type { GameData } from "@/lib/rules/data";
import { SCHOOLS, spellsLearned, type LearnedSpell } from "@/lib/rules/spells";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./spell-view.module.css";

/**
 * The Spells section on the build page (WO-42), after Gear: the main spells first, in the
 * author's order with their text; then every spell learned by the level being viewed, by school in
 * the game's order, each with its tier, the level it was learned at and where. Spells learned
 * later stay hidden, as perks do.
 */
export function SpellView({ d, plan, level }: { d: GameData; plan: BuildPlan; level: number }) {
  const learned = spellsLearned(d, plan, level).filter((s) => s.spell);
  if (!learned.length) return null;
  const byId = new Map(learned.map((s) => [s.id, s]));
  const main = (plan.mainSpells ?? []).map((id) => byId.get(id)).filter((s): s is LearnedSpell => !!s);
  const starred = new Set(main.map((s) => s.id));
  const schools = SCHOOLS.map((school) => ({ school, rows: learned.filter((s) => s.spell!.school === school) })).filter((g) => g.rows.length);
  // Spells whose school isn't one of the five (a few creature powers) go last, under their own.
  const others = learned.filter((s) => !(SCHOOLS as readonly string[]).includes(s.spell!.school));
  return (
    <section id="spells" aria-label={`Spells at level ${level}`} className={styles.section}>
      <span className="label">Spells at level {level}</span>
      {main.length > 0 && (
        <div className={`frame ${styles.main}`} role="group" aria-label="Main spells">
          <span className={styles.mainTitle}>Main spells</span>
          <ul className={styles.mainList}>
            {main.map((s) => (
              <li key={s.id} className={styles.mainItem}>
                <SkillIcon name={s.spell!.school} size={24} />
                <span>
                  <b>{s.spell!.name}</b>{" "}
                  <span className={styles.meta}>
                    {s.spell!.tier}
                    {s.spell!.cast ? `, ${s.spell!.cast}` : ""}
                  </span>
                </span>
                <span />
                <span className={styles.text}>{s.spell!.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.schools}>
        {[...schools, ...(others.length ? [{ school: "Other", rows: others }] : [])].map((g) => (
          <div key={g.school} role="group" aria-label={g.school} className={styles.school}>
            <div className={styles.schoolHead}>
              {g.school !== "Other" && <SkillIcon name={g.school} size={24} />}
              <span className={styles.schoolName}>{g.school}</span>
            </div>
            <ul className={styles.rows}>
              {g.rows.map((s) => (
                <li key={s.id} className={styles.row}>
                  <span className={styles.rowName}>
                    {s.spell!.name}
                    {starred.has(s.id) && (
                      <span className={styles.star} aria-label="Main spell">
                        {" "}
                        ★
                      </span>
                    )}
                  </span>
                  <span className={styles.lvl}>Lv {s.level}</span>
                  <span className={styles.meta}>
                    {s.spell!.tier}
                    {s.where ? ` | ${s.where}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
