"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { EditBar } from "./edit-bar";
import type { BuildVisibility } from "@/lib/builds/validate";
import { InfoTip } from "@/components/ui/info-tip";
import { Tooltip } from "@/components/ui/tooltip";
import { LevelBars, useHoldInPlace } from "@/components/build/level-nav";
import { Tree, type TreeView } from "@/components/build/tree";
import { TreeTabs } from "@/components/build/tree-tabs";
import { useGameData } from "@/components/game-data";
import { ATTRIBUTE_NAMES, levelMarks, nextDestinyLevel, skillStepInfo, stoneLabel, stoneShare } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import type { Attribute, BuildPlan } from "@/lib/rules/types";
import { GearBlock } from "./gear-block";
import { SpellBlock, SpellPicks } from "./spell-block";
import { PerkPanel } from "./perk-panel";
import { SkillGains } from "@/components/build/skill-gains";
import { AttributeIcon, DeityIcon, IconLabel, SignIcon, SkillIcon, MarkIcon } from "@/components/ui/skill-icon";
import { GuideEditor, guideSaveLabel } from "@/components/guide/guide-editor";
import { GuideFactsProvider } from "@/components/guide/guide-facts";
import { saveKeptGuides } from "@/components/guide/use-guide-autosave";
import type { GuideSaveStatus } from "@/components/guide/use-guide-autosave";
import { emptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import * as ops from "./plan-ops";
import { useAutosave } from "./use-autosave";
import styles from "./editor.module.css";
import { pageZoom } from "@/lib/zoom";

interface Props {
  buildId: string;
  name: string;
  visibility: BuildVisibility;
  initialPlan: BuildPlan;
  initialLevel: number;
  /** Set when this build was just copied from an older LoreRim version. */
  converted?: { from: string; dropped: string };
  /** The build's guide sections by key (`level:<n>` for level notes). */
  guide: Record<string, GuideDoc>;
}

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];

export function Editor({ buildId, name, visibility, initialPlan, initialLevel, converted, guide }: Props) {
  const d = useGameData();
  const [plan, setPlan] = useState(initialPlan);
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const total = plan.levels.length;
  const [level, setLevelState] = useState(() => Math.min(total, Math.max(1, initialLevel || total)));
  const { status, error, retry } = useAutosave(buildId, plan, initialPlan);
  const [confirmRemove, setConfirmRemove] = useState(false);
  // Level notes as edited here, so going back to a level shows the latest text.
  const [notes, setNotes] = useState<Record<string, GuideDoc>>(guide);
  const noted = useMemo(() => notedLevels(notes), [notes]);
  // Notes typed here before but never confirmed by the server (a closed tab, a lost connection).
  useEffect(() => saveKeptGuides(buildId), [buildId]);

  const { ref: levelBarRef, hold: holdLevelBar } = useHoldInPlace<HTMLElement>(level);
  // Changing level keeps the level bar where it is on screen; the buttons at the bottom of the
  // page go back to the top, since the next level starts there.
  const setLevel = useCallback(
    (n: number, max = total, toTop = false) => {
      const next = Math.min(max, Math.max(1, n));
      if (!toTop) holdLevelBar();
      setLevelState(next);
      setConfirmRemove(false);
      const url = new URL(window.location.href);
      url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
      if (toTop) window.scrollTo({ top: 0 });
    },
    [total, holdLevelBar],
  );

  const s = states[level - 1];
  const lv = plan.levels[level - 1];
  const [tree, setTree] = useState<string>(() => initialPlan.majors[0] ?? "One-Handed");
  const [treeView, setTreeView] = useState<TreeView>("tree");
  const [selected, setSelected] = useState<string | null>(null);
  // The perk area's width decides where the details go: beside the tree at 1100px and up,
  // otherwise a card pinned to the bottom of the window (phones use the tree's bottom sheet).
  const [perkArea, setPerkArea] = useState<HTMLDivElement | null>(null);
  const [areaWidth, setAreaWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1440);
  // Where the pinned panel goes: over the skills column when it sits beside the tree, so the
  // panel never covers the tree; otherwise the window's bottom-right corner.
  const [skillsCol, setSkillsCol] = useState<HTMLElement | null>(null);
  const [pinOver, setPinOver] = useState<{ left: number; width: number } | null>(null);
  useEffect(() => {
    if (!perkArea) return;
    const set = () => {
      setAreaWidth(perkArea.clientWidth);
      // In the page's own pixels (it may be scaled up on a big monitor).
      const z = pageZoom();
      setWindowWidth(window.innerWidth / z);
      const col = skillsCol?.getBoundingClientRect();
      const area = perkArea.getBoundingClientRect();
      setPinOver(col && col.right <= area.left ? { left: Math.round(col.left / z), width: Math.round(Math.min(420, col.width / z)) } : null);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(perkArea);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, [perkArea, skillsCol]);
  const pinned = windowWidth >= 900 && areaWidth > 0 && areaWidth < 1100;
  // The tree box: the window's height less the site header, the edit bar, the tree chips and the
  // legend, less 16px; never under 520px, no maximum (WO-26).
  const [chipsEl, setChipsEl] = useState<HTMLDivElement | null>(null);
  const [treeHeight, setTreeHeight] = useState(520);
  useEffect(() => {
    if (!chipsEl) return;
    const set = () => {
      const header = document.querySelector<HTMLElement>("body > header, header")?.offsetHeight ?? 0;
      const bar = document.querySelector<HTMLElement>("[data-edit-bar]")?.offsetHeight ?? 0;
      const legend = 48;
      setTreeHeight(Math.max(520, Math.round(window.innerHeight / pageZoom() - header - bar - chipsEl.offsetHeight - legend - 16)));
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(chipsEl);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, [chipsEl]);
  const pickPerk = (id: string) => setSelected(id);
  useEffect(() => {
    if (!pinned || !selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned, selected]);
  const panel = (id: string | null) => (
    <PerkPanel
      plan={plan}
      states={states}
      level={level}
      selectedId={id}
      onTake={(pid) => {
        setPlan(ops.takePerk(plan, level, pid));
        // The star's new state says it was taken: the card closes, so it never covers the page.
        setSelected(null);
      }}
      onRemove={(pid, also) => setPlan(ops.removePerks(plan, [{ id: pid, level }, ...also]))}
      onGoToLevel={(n) => setLevel(n)}
    />
  );
  const [extraSkill, setExtraSkill] = useState(() => {
    const first = initialPlan.majors[0] ?? d.skills[0];
    return { trainer: first, book: first };
  });

  // Other levels' problems, so breaking an earlier level shows wherever you are (this level's own
  // are in the bar at the bottom).
  const problems = useMemo(
    () => states.filter((st) => st.level !== level).flatMap((st) => st.issues.map((i) => ({ level: st.level, message: i.message }))),
    [states, level],
  );
  const steps = useMemo(() => skillStepInfo(d, plan, states, level), [d, plan, states, level]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);
  const left = s.skillPointsAvailable - s.skillPointsSpent;
  const carriedIn = s.skillPointsAvailable - d.rules.skillPointsPerLevel;
  const perkLeft = s.perkPoints - s.perkPointsSpent;
  const destinyLeft = s.destinyPoints - s.destinyPointsSpent;
  const nextDestiny = nextDestinyLevel(d, level);
  // Trainer sessions: what is left of this level-up's own (unused ones carry over, but a running
  // total of 97 at level 20 reads as noise). Never more than the build has left overall.
  const trainerLeft = Math.max(
    0,
    Math.min(d.rules.trainerSessionsPerLevel - lv.extras.filter((x) => x.kind === "trainer").length, d.rules.trainerSessionsPerLevel * level - s.trainerSessionsUsed),
  );
  // Each trainer session and book, replayed from where this level's skill points left the skill.
  const extraSteps = (() => {
    const at: Record<string, number> = {};
    const perBook = plan.traits.includes("Skilled") ? 2 : 1;
    return lv.extras.map((ex) => {
      const from = at[ex.skill] ?? (s.skillsBefore[ex.skill] ?? 0) + (lv.skillPoints[ex.skill] ?? 0);
      const to = ex.kind === "trainer" ? from + 1 : Math.min(s.maxSkill, from + perBook);
      at[ex.skill] = to;
      return { from, to };
    });
  })();
  const prevStone = level > 1 ? states[level - 2].stone : "";
  const prevDeity = level > 1 ? states[level - 2].deity : plan.deity;
  // The rules the planner applies (the engine's own numbers), for the labels' tooltips.
  const trainerRule = `+1 to a skill. ${d.rules.trainerSessionsPerLevel} sessions a level; unused ones carry over to later levels. A trainer can't raise a skill past the level's max skill.`;
  const bookRule = `+1 to a skill (+2 with the Skilled trait), never past the level's max skill.`;

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
    setLevel(total + 1, total + 1, true);
  };
  const removeLevel = () => {
    if (!confirmRemove) return setConfirmRemove(true);
    setPlan(ops.removeLastLevel(plan));
    setLevel(total - 1, total - 1);
  };

  const saveLabel = status === "saved" ? "Saved" : status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved" : "Couldn't save";

  return (
    <>
      <EditBar
        buildId={buildId}
        name={name}
        current="levels"
        visibility={visibility}
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
      />
      {error && status === "failed" && <div className={`page ${styles.errorBar}`}>{error}</div>}

      <div className={`page ${styles.layout}`}>
        {converted && (
          <section aria-label="Copied from an older version" className={styles.converted}>
            Copied from LoreRim {converted.from} to {d.version.id}. {converted.dropped ? `${converted.dropped} Removed from the copy.` : "Everything carried over."}
          </section>
        )}
        <section ref={levelBarRef} aria-label="Level" className={styles.levelBar}>
          <div className={styles.levelNav}>
            <button type="button" className={`btn ${styles.levelArrow}`} aria-label="Previous level" disabled={level <= 1} onClick={() => setLevel(level - 1)}>
              ‹ {level > 1 ? level - 1 : ""}
            </button>
            <div className={styles.levelTitle}>
              <span className="label">{level === 1 ? "Level" : "Level up to"}</span>
              <span className={styles.levelNum}>{level}</span>
            </div>
            <button type="button" className={`btn ${styles.levelArrow}`} aria-label="Next level" disabled={level >= total} onClick={() => setLevel(level + 1)}>
              {level < total ? level + 1 : ""} ›
            </button>
          </div>
          <dl className={styles.pools}>
            {level > 1 && <Pool label="Skill points" value={left} of={`left of ${s.skillPointsAvailable}`} />}
            <Pool label="Perk points" icon={<MarkIcon name="perk-points" />} value={perkLeft} of="to spend" />
            <Pool label="Destiny points" value={destinyLeft} of={nextDestiny ? `next at ${nextDestiny}` : "no more"} destiny />
            <Pool label="Trainer sessions" value={trainerLeft} of="left this level" />
          </dl>
          {total > 1 && (
            <div className={styles.levelRow}>
              <LevelBars marks={marks} level={level} onChange={(n) => setLevel(n)} />
            </div>
          )}
          {problems.length > 0 && (
            <div role="region" aria-label="Problems in this build" className={styles.problemBar}>
              {problems.map((pr, i) => (
                <p key={i} className={styles.problemLine}>
                  <i className={styles.diamondBad} />
                  <span>
                    <b>Level {pr.level}:</b> {pr.message}
                  </span>
                  <button type="button" className={styles.linkButton} onClick={() => setLevel(pr.level)}>
                    Go to level {pr.level}
                  </button>
                </p>
              ))}
            </div>
          )}
        </section>

        <div className={styles.columns}>
          <section ref={setSkillsCol} aria-label="Attribute and skills" className={styles.left}>
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
                          <IconLabel icon={<AttributeIcon name={a} />}>{ATTRIBUTE_NAMES[a]}</IconLabel>
                        </span>
                        {/* The choice circle sits on the number's line, so it never covers the name. */}
                        <span className={styles.attrVal}>
                          <span className="big-num">{s[a]}</span>
                          {on && <span className={styles.plus}>+5</span>}
                          <span className={styles.radio}>
                            <span />
                          </span>
                        </span>
                        {stoneShare(d, s.stone, a) && <span className={styles.attrNote}>{stoneShare(d, s.stone, a)}</span>}
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
                  {level === 1 ? `Max skill ${s.maxSkill} at level 1` : `Up to +${d.rules.maxRaisePerSkillPerLevel} each, max skill ${s.maxSkill}`}
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
                  {carriedIn > 0 && <span className={styles.hint}>Includes {carriedIn} carried in from level {level - 1}</span>}
                </>
              )}
              {d.skillGroups.map((g) => (
                <div key={g.group} className={styles.skillGroup}>
                  <span className={`sub-label ${styles.skillGroupName}`}>{g.group}</span>
                  {g.skills.map((sk) => {
                    const info = steps.find((i) => i.skill === sk)!;
                    const active = tree === sk;
                    return (
                      <div key={sk} className={`${styles.skillRow} ${active ? styles.skillRowOn : ""}`}>
                        <button type="button" className={styles.skillName} onClick={() => setTree(sk)} aria-pressed={active}>
                          <SkillIcon name={sk} /> {sk}
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
                            <Tooltip content={info.atMax ? `${sk} is at the max skill for this level.` : info.atFive ? "+5 reached: the most one skill can rise in a level-up." : `${info.nextCost} skill point${info.nextCost === 1 ? "" : "s"} for the next +1.`}>
                              <span className={styles.stepper}>
                                <button type="button" aria-label={`Lower ${sk}`} disabled={!info.canRemove} onClick={() => setPlan(ops.addSkillPoint(plan, level, sk, -1))}>
                                  −
                                </button>
                                <span className={info.added ? styles.stepOn : styles.stepOff}>{info.added ? `+${info.added}` : "0"}</span>
                                <button type="button" aria-label={`Raise ${sk}`} disabled={!info.canAdd} onClick={() => setPlan(ops.addSkillPoint(plan, level, sk, 1))}>
                                  +
                                </button>
                              </span>
                            </Tooltip>
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
            <div ref={setChipsEl}>
              <TreeTabs
                state={s}
                active={tree}
                onChange={(t) => {
                  setTree(t);
                  setSelected(null);
                }}
                view={treeView}
                onView={setTreeView}
              />
            </div>
            <div ref={setPerkArea} className={`frame ${styles.treeBox} ${tree === "Destiny" ? styles.treeBoxDestiny : ""}`}>
              <div className={styles.treeRow}>
                <div className={styles.treeArea}>
                  <Tree tree={tree} states={states} level={level} selectedId={selected} onSelect={pickPerk} details={(id) => panel(id)} view={treeView} onView={setTreeView} height={treeHeight} />
                </div>
                {/* Beside the tree when there is room; pinned over the page otherwise; a sheet on phones. */}
                {!pinned && <div className={styles.panelSlot}>{panel(selected)}</div>}
              </div>
            </div>
          </section>
        </div>

        {/* A tier perk taken here gives its free spells: pick them under it (WO-42). */}
        <SpellPicks key={`picks-${level}`} plan={plan} level={level} setPlan={setPlan} />

        {pinned &&
          selected &&
          createPortal(
            <div className={styles.pinned} style={pinOver ? { left: pinOver.left, right: "auto", width: pinOver.width } : undefined}>
              <button type="button" className={`btn btn-sm btn-icon ${styles.pinnedClose}`} aria-label="Close perk details" onClick={() => setSelected(null)}>
                ×
              </button>
              {panel(selected)}
            </div>,
            document.body,
          )}

        <section aria-label="Also at this level" className={styles.also}>
          <div className={styles.alsoCol}>
            <span className="label">Between level-ups</span>
            {lv.extras.length > 0 && (
              <ul className={styles.extras}>
                {lv.extras.map((ex, i) => (
                  <li key={i}>
                    <span className={styles.extraRow}>
                      <span className={styles.extraKind}>
                        <IconLabel icon={<MarkIcon name={ex.kind === "trainer" ? "trainer" : "skill-book"} />}>{ex.kind === "trainer" ? "Trainer session" : "Skill book"}</IconLabel>
                      </span>
                      <SkillGains rows={[{ skill: ex.skill, gain: extraSteps[i].to - extraSteps[i].from, from: extraSteps[i].from, to: extraSteps[i].to }]} />
                    </span>
                    <button type="button" className={styles.x} aria-label={`Remove ${ex.kind === "trainer" ? "trainer session" : "skill book"} for ${ex.skill}`} onClick={() => setPlan(ops.removeExtra(plan, level, i))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {(["trainer", "book"] as const).map((kind) => {
              const what = kind === "trainer" ? "Trainer session" : "Skill book";
              return (
                <div key={kind} role="group" aria-label={what} className={styles.extraForm}>
                  <Tooltip content={kind === "trainer" ? trainerRule : bookRule}>
                    <span className={`${styles.extraKind} ${styles.ruleTip}`} tabIndex={0}>
                      <IconLabel icon={<MarkIcon name={kind === "trainer" ? "trainer" : "skill-book"} />}>{what}</IconLabel>
                    </span>
                  </Tooltip>
                  <select className="select" aria-label={`${what} skill`} value={extraSkill[kind]} onChange={(e) => setExtraSkill((x) => ({ ...x, [kind]: e.target.value }))}>
                    {d.skills.map((sk) => (
                      <option key={sk} value={sk}>
                        {sk}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-sm" onClick={() => setPlan(ops.addExtra(plan, level, { kind, skill: extraSkill[kind] }))}>
                    Add
                  </button>
                </div>
              );
            })}
          </div>
          <label className={`field ${styles.alsoCol}`}>
            <Tooltip content="One stone at a time: choosing a new one replaces the old. Its bonus counts from that level on.">
              <span className={`label ${styles.ruleTip}`} tabIndex={0}>
                Standing stone
              </span>
            </Tooltip>
            <span className={styles.stoneRow}>
              {/* A native select can't show images: the stone in effect at this level sits beside it. */}
              <span className={styles.stoneIcon}>{s.stone ? <SignIcon name={s.stone} /> : null}</span>
              <select className="select" value={lv.stone ?? ""} onChange={(e) => setPlan(ops.setStone(plan, level, e.target.value))}>
                <option value="">{prevStone ? `Keep The ${prevStone}` : level === 1 ? "No stone yet" : "No stone yet"}</option>
                {prevStone && <option value="none">Leave The {prevStone}</option>}
                {d.stones.map((st) => (
                  <option key={st.name} value={st.name}>
                    {stoneLabel(d, st.name)}
                  </option>
                ))}
              </select>
            </span>
          </label>
          {/* A deity change from this level on (WO-43): any deity, since a shrine takes anyone later. The starting one is set in Set up. */}
          {level > 1 && (
            <label className={`field ${styles.alsoCol}`}>
              <span className="label">Deity</span>
              <span className={styles.stoneRow}>
                <span className={styles.stoneIcon}>{s.deity ? <DeityIcon name={s.deity} /> : null}</span>
                <select className="select" value={lv.deity ?? ""} onChange={(e) => setPlan(ops.setDeity(plan, level, e.target.value))}>
                  <option value="">{prevDeity ? `Keep ${prevDeity}` : "No deity yet"}</option>
                  {d.deities
                    .filter((g) => g !== prevDeity)
                    .map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                </select>
              </span>
            </label>
          )}
        </section>

        <GearBlock key={level} plan={plan} level={level} setPlan={setPlan} />
        <SpellBlock key={`spells-${level}`} plan={plan} level={level} setPlan={setPlan} />

        <GuideFactsProvider plan={plan} states={states}>
          <LevelNotes
            key={level}
            buildId={buildId}
            level={level}
            initial={notes[`level:${level}`] ?? emptyDoc()}
            onChange={(doc) => {
              setNotes((n) => ({ ...n, [`level:${level}`]: doc }));
              // The level's old plain-text note now lives in the notes; clear it from the plan too.
              if (lv.note) setPlan(ops.setNote(plan, level, ""));
            }}
          />
        </GuideFactsProvider>

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
                {confirmRemove ? `Confirm: remove level ${total}${noted.has(total) ? " and its notes" : ""}` : `Remove level ${total}`}
              </button>
            )}
            {level === total ? (
              <button type="button" className="btn btn-primary" onClick={continueLevel}>
                Continue to level {total + 1}
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => setLevel(level + 1, total, true)}>
                Go to level {level + 1}
              </button>
            )}
          </span>
        </div>

      </div>
    </>
  );
}

function Pool({ label, icon, value, of, destiny }: { label: string; icon?: React.ReactNode; value: number; of: string; destiny?: boolean }) {
  return (
    <div className={`${styles.pool} ${destiny ? styles.poolDestiny : ""}`}>
      <dt className={`label ${styles.poolLabel}`}>{icon ? <IconLabel icon={icon}>{label}</IconLabel> : label}</dt>
      <dd className={styles.poolVal}>
        <span className={`big-num ${styles.poolNum} ${value < 0 ? "bad" : ""}`}>{value}</span>
        <span className={styles.hint}>{of}</span>
      </dd>
    </div>
  );
}

/** The level's notes: the guide editor, compact (H3 the only heading). */
function LevelNotes({ buildId, level, initial, onChange }: { buildId: string; level: number; initial: GuideDoc; onChange: (doc: GuideDoc) => void }) {
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null }>({ status: "idle", error: null });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null) => setSave({ status, error }), []);
  const label = guideSaveLabel(save.status, save.error);
  return (
    <section aria-label={`Notes for level ${level}`} className={styles.levelNotes}>
      <div className={styles.blockHead}>
        <span className="label">Notes for level {level}</span>
        {label && (
          <span role="status" className={save.status === "failed" ? styles.notesFailed : styles.hint}>
            {label}
          </span>
        )}
      </div>
      <GuideEditor
        buildId={buildId}
        sectionKey={`level:${level}`}
        initial={initial}
        label={`Notes for level ${level}`}
        headingLevels={[3]}
        compact
        onStatus={onStatus}
        onChange={onChange}
      />
    </section>
  );
}
