"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import { InfoTip } from "@/components/ui/info-tip";
import { LevelRow, LevelRuler, WINDOW } from "@/components/build/level-nav";
import { Tree } from "@/components/build/tree";
import { TreeTabs } from "@/components/build/tree-tabs";
import { SKILLS, SKILL_GROUPS, STONES } from "@/lib/rules/data";
import { RULES } from "@/lib/rules/constants";
import { ATTRIBUTE_NAMES, levelMarks, nextDestinyLevel, skillStepInfo } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import type { Attribute, BuildPlan, GearItem } from "@/lib/rules/types";
import { PerkPanel } from "./perk-panel";
import * as ops from "./plan-ops";
import { useAutosave } from "./use-autosave";
import styles from "./editor.module.css";

interface Props {
  buildId: string;
  name: string;
  initialPlan: BuildPlan;
  initialLevel: number;
}

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];

export function Editor({ buildId, name, initialPlan, initialLevel }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const states = useMemo(() => computeBuild(plan), [plan]);
  const total = plan.levels.length;
  const [level, setLevelState] = useState(() => Math.min(total, Math.max(1, initialLevel || total)));
  const { status, error, retry } = useAutosave(buildId, plan, initialPlan);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const setLevel = useCallback(
    (n: number, max = total) => {
      const next = Math.min(max, Math.max(1, n));
      setLevelState(next);
      setConfirmRemove(false);
      const url = new URL(window.location.href);
      url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
      window.scrollTo({ top: 0 });
    },
    [total],
  );

  const s = states[level - 1];
  const lv = plan.levels[level - 1];
  const [tree, setTree] = useState<string>(() => initialPlan.majors[0] ?? "One-Handed");
  const [selected, setSelected] = useState<string | null>(null);
  const [extraSkill, setExtraSkill] = useState<string>(() => initialPlan.majors[0] ?? SKILLS[0]);

  const steps = useMemo(() => skillStepInfo(plan, states, level), [plan, states, level]);
  const marks = useMemo(() => levelMarks(plan, states), [plan, states]);
  const left = s.skillPointsAvailable - s.skillPointsSpent;
  const carriedIn = s.skillPointsAvailable - RULES.skillPointsPerLevel;
  const perkLeft = s.perkPoints - s.perkPointsSpent;
  const destinyLeft = s.destinyPoints - s.destinyPointsSpent;
  const nextDestiny = nextDestinyLevel(level);
  const trainerLeft = RULES.trainerSessionsPerLevel * level - s.trainerSessionsUsed;
  const prevStone = level > 1 ? states[level - 2].stone : "";

  const summary = (() => {
    if (s.issues.length) return null;
    const notes: string[] = [];
    if (level > 1 && left > 0) notes.push(`${left} skill point${left === 1 ? "" : "s"} will carry over.`);
    if (perkLeft > 0) notes.push(`${perkLeft} perk point${perkLeft === 1 ? "" : "s"} still unspent.`);
    if (destinyLeft > 0) notes.push(`${destinyLeft} Destiny point${destinyLeft === 1 ? "" : "s"} still unspent.`);
    return `Level ${level} follows every rule.${notes.length ? " " + notes.join(" ") : ""}`;
  })();

  const continueLevel = () => {
    const next = ops.addLevel(plan);
    setPlan(next);
    setLevel(total + 1, total + 1);
  };
  const removeLevel = () => {
    if (!confirmRemove) return setConfirmRemove(true);
    setPlan(ops.removeLastLevel(plan));
    setLevel(total - 1, total - 1);
  };

  const saveLabel = status === "saved" ? "Saved" : status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved" : "Couldn't save";

  return (
    <>
      <FocusHeader
        context={`Editing ${name}`}
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
            <Link href={`/b/${buildId}/setup`} className="btn btn-sm">
              Set up
            </Link>
            <Link href={`/b/${buildId}?level=${level}`} className="btn btn-sm">
              See it as a visitor
            </Link>
          </>
        }
      />
      {error && status === "failed" && <div className={`page ${styles.errorBar}`}>{error}</div>}

      <div className={`page ${styles.layout}`}>
        <section aria-label="Level" className={styles.levelBar}>
          <div className={styles.levelNav}>
            <button type="button" className={styles.levelArrow} aria-label="Previous level" disabled={level <= 1} onClick={() => setLevel(level - 1)}>
              ‹ {level > 1 ? level - 1 : ""}
            </button>
            <div className={styles.levelTitle}>
              <span className="label">{level === 1 ? "Level" : "Level up to"}</span>
              <span className={styles.levelNum}>{level}</span>
            </div>
            <button type="button" className={styles.levelArrow} aria-label="Next level" disabled={level >= total} onClick={() => setLevel(level + 1)}>
              {level < total ? level + 1 : ""} ›
            </button>
          </div>
          <dl className={styles.pools}>
            {level > 1 && <Pool label="Skill points" value={left} of={`left of ${s.skillPointsAvailable}`} />}
            <Pool label="Perk points" value={perkLeft} of="to spend" />
            <Pool label="Destiny" value={destinyLeft} of={nextDestiny ? `next at ${nextDestiny}` : "no more"} />
            <Pool label="Trainer sessions" value={trainerLeft} of="left" />
          </dl>
          {total > 1 && (
            <div className={styles.levelRow}>
              {total > WINDOW && <LevelRuler marks={marks} level={level} onChange={(n) => setLevel(n)} />}
              <LevelRow marks={marks} level={level} onChange={(n) => setLevel(n)} />
            </div>
          )}
        </section>

        <div className={styles.columns}>
          <section aria-label="Attribute and skills" className={styles.left}>
            {level > 1 && (
              <div className={styles.block}>
                <div className={styles.blockHead}>
                  <span className="label">Attribute</span>
                  <span className={styles.hint}>+5 to one</span>
                </div>
                <div role="group" aria-label="Attribute" className={styles.attrs}>
                  {ATTRS.map((a) => {
                    const on = lv.attribute === a;
                    return (
                      <button key={a} type="button" aria-pressed={on} className={`${styles.attr} ${styles[a]} ${on ? styles.attrOn : ""}`} onClick={() => setPlan(ops.setAttribute(plan, level, a))}>
                        <span className={styles.attrTop}>
                          <span>{ATTRIBUTE_NAMES[a]}</span>
                          <span className={styles.radio}>
                            <span />
                          </span>
                        </span>
                        <span className={styles.attrVal}>
                          <span className="big-num">{s[a]}</span>
                          {on && <span className={styles.plus}>+5</span>}
                        </span>
                        <span className={styles.attrBar} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.block}>
              <div className={styles.blockHead}>
                <span className="label">{level === 1 ? "Starting skills" : "Skills"}</span>
                <span className={styles.maxSkill}>
                  {level === 1 ? `Max skill ${s.maxSkill} at level 1` : `Up to +${RULES.maxRaisePerSkillPerLevel} each, max skill ${s.maxSkill}`}
                  <InfoTip
                    label="About the skill limit"
                    text={`No skill can go above 50 plus your character level. At level ${level} that's ${s.maxSkill}; skills can reach 100 from level 50.`}
                  />
                </span>
              </div>
              {level > 1 && (
                <>
                  <div className={styles.pointsBar}>
                    <div style={{ width: `${Math.min(100, (s.skillPointsSpent / s.skillPointsAvailable) * 100)}%` }} className={left < 0 ? styles.pointsOver : ""} />
                  </div>
                  <span className={styles.hint}>{carriedIn > 0 ? `Includes ${carriedIn} carried in from level ${level - 1}` : `${RULES.skillPointsPerLevel} this level-up`}</span>
                </>
              )}
              {SKILL_GROUPS.map((g) => (
                <div key={g.group} className={styles.skillGroup}>
                  <span className={`sub-label ${styles.skillGroupName}`}>{g.group}</span>
                  {g.skills.map((sk) => {
                    const info = steps.find((i) => i.skill === sk)!;
                    const active = tree === sk;
                    return (
                      <div key={sk} className={`${styles.skillRow} ${active ? styles.skillRowOn : ""}`}>
                        <button type="button" className={styles.skillName} onClick={() => setTree(sk)} aria-pressed={active}>
                          {sk}
                        </button>
                        <span className={`num ${styles.skillVals}`}>
                          {info.added > 0 ? (
                            <>
                              <span className="muted">{info.from} → </span>
                              <span className={styles.skillTo}>{info.to}</span>
                            </>
                          ) : (
                            <span>{info.from}</span>
                          )}
                        </span>
                        {level > 1 ? (
                          <>
                            <span className={styles.stepper}>
                              <button type="button" aria-label={`Lower ${sk}`} disabled={!info.canRemove} onClick={() => setPlan(ops.addSkillPoint(plan, level, sk, -1))}>
                                −
                              </button>
                              <span className={info.added ? styles.stepOn : styles.stepOff}>{info.added ? `+${info.added}` : "0"}</span>
                              <button type="button" aria-label={`Raise ${sk}`} disabled={!info.canAdd} onClick={() => setPlan(ops.addSkillPoint(plan, level, sk, 1))}>
                                +
                              </button>
                            </span>
                            <span className={styles.next}>
                              {info.atMax ? "at max" : info.atFive ? "+5 reached" : `${info.nextCost} pt${info.nextCost === 1 ? "" : "s"} next`}
                            </span>
                          </>
                        ) : (
                          <span className={styles.next} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Perks" className={styles.right}>
            <span className="label">Perks</span>
            <TreeTabs
              state={s}
              active={tree}
              onChange={(t) => {
                setTree(t);
                setSelected(null);
              }}
            />
            <div className={`frame ${styles.treeBox}`}>
              <div className={styles.treeArea}>
                <Tree tree={tree} states={states} level={level} selectedId={selected} onSelect={setSelected} />
              </div>
              <PerkPanel
                plan={plan}
                states={states}
                level={level}
                selectedId={selected}
                onTake={(id) => setPlan(ops.takePerk(plan, level, id))}
                onRemove={(id) => setPlan(ops.removePerk(plan, level, id))}
                onGoToLevel={(n) => setLevel(n)}
              />
            </div>
          </section>
        </div>

        <section aria-label="Also at this level" className={styles.also}>
          <div className={styles.alsoCol}>
            <span className="label">Between level-ups</span>
            {lv.extras.length > 0 && (
              <ul className={styles.extras}>
                {lv.extras.map((ex, i) => (
                  <li key={i}>
                    <span>
                      {ex.kind === "trainer" ? "Trainer session" : "Skill book"}: <b>{ex.skill}</b> +{ex.kind === "book" && plan.traits.includes("Skilled") ? 2 : 1}
                    </span>
                    <button type="button" className={styles.x} aria-label={`Remove ${ex.kind === "trainer" ? "trainer session" : "skill book"} for ${ex.skill}`} onClick={() => setPlan(ops.removeExtra(plan, level, i))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.extraForm}>
              <select className="select" aria-label="Skill" value={extraSkill} onChange={(e) => setExtraSkill(e.target.value)}>
                {SKILLS.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-sm" onClick={() => setPlan(ops.addExtra(plan, level, { kind: "trainer", skill: extraSkill }))}>
                Add trainer session
              </button>
              <button type="button" className="btn btn-sm" onClick={() => setPlan(ops.addExtra(plan, level, { kind: "book", skill: extraSkill }))}>
                Add skill book
              </button>
            </div>
          </div>
          <label className={`field ${styles.alsoCol}`}>
            <span className="label">Standing stone</span>
            <select className="select" value={lv.stone ?? ""} onChange={(e) => setPlan(ops.setStone(plan, level, e.target.value))}>
              <option value="">{prevStone ? `Keep The ${prevStone}` : level === 1 ? "No stone yet" : "No stone yet"}</option>
              {prevStone && <option value="none">Leave The {prevStone}</option>}
              {STONES.map((st) => (
                <option key={st.name} value={st.name}>
                  The {st.name} ({st.text})
                </option>
              ))}
            </select>
          </label>
          <label className={`field ${styles.alsoWide}`}>
            <span className="label">Note for this level</span>
            <textarea className="textarea" value={lv.note} maxLength={2000} onChange={(e) => setPlan(ops.setNote(plan, level, e.target.value))} placeholder="How you got here: quests, places cleared, where you trained" />
          </label>
        </section>

        <div className={styles.bottomBar}>
          <span className={styles.verdict}>
            {s.issues.length ? (
              <span className={styles.problems}>
                <i className={styles.diamondBad} />
                <span>
                  {s.issues.map((i, n) => (
                    <span key={n}>{i.message} </span>
                  ))}
                </span>
              </span>
            ) : (
              <>
                <i className={styles.diamondGood} />
                {summary}
              </>
            )}
          </span>
          <span className={styles.bottomActions}>
            {level === total && total > 1 && (
              <button type="button" className="btn btn-quiet" onClick={removeLevel}>
                {confirmRemove ? `Confirm: remove level ${total}` : `Remove level ${total}`}
              </button>
            )}
            {level === total ? (
              <button type="button" className="btn btn-primary" onClick={continueLevel}>
                Continue to level {total + 1}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setLevel(level + 1)}>
                Go to level {level + 1}
              </button>
            )}
          </span>
        </div>

        <GearAndNotes plan={plan} setPlan={setPlan} />
      </div>
    </>
  );
}

function Pool({ label, value, of }: { label: string; value: number; of: string }) {
  return (
    <div className={styles.pool}>
      <dt className={`label ${styles.poolLabel}`}>{label}</dt>
      <dd className={styles.poolVal}>
        <span className={`big-num ${styles.poolNum} ${value < 0 ? "bad" : ""}`}>{value}</span>
        <span className={styles.hint}>{of}</span>
      </dd>
    </div>
  );
}

function GearAndNotes({ plan, setPlan }: { plan: BuildPlan; setPlan: (p: BuildPlan) => void }) {
  const gear = plan.gear;
  const update = (i: number, patch: Partial<GearItem>) => setPlan(ops.setGear(plan, gear.map((g, n) => (n === i ? { ...g, ...patch } : g))));
  const add = () => setPlan(ops.setGear(plan, [...gear, { slot: "", name: "", fromLevel: 1, note: "" }]));
  const remove = (i: number) => setPlan(ops.setGear(plan, gear.filter((_, n) => n !== i)));
  return (
    <section aria-label="Gear and notes" className={styles.gearNotes}>
      <div className={styles.gear}>
        <span className="label">Gear</span>
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
      <label className={`field ${styles.notes}`}>
        <span className="label">Notes from the author</span>
        <textarea className="textarea" rows={6} value={plan.notes} maxLength={6000} onChange={(e) => setPlan(ops.setNotes(plan, e.target.value))} placeholder="Shown under the build. The full route and quest order can stay in your Discord write-up." />
      </label>
    </section>
  );
}
