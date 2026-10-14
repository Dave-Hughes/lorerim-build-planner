"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useGameData } from "@/components/game-data";
import { BottomSheet, Tree, ViewToggle, type GoalMark, type TreeView } from "@/components/build/tree";
import { Tour } from "@/components/tour/tour";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, SkillIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import { MAX_LEVELS } from "@/lib/builds/validate";
import { ATTRIBUTE_NAMES } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { AUTOLEVEL_TOUR } from "@/lib/tour";
import type { Attribute, BuildPlan } from "@/lib/rules/types";
import { attributeSettings, defaultAttribute, fillToLevel, goalFloor, goalsToSettings, scaleAttributes, shiftAttribute } from "./plan-ops";
import styles from "./auto-level.module.css";

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];
const QUICK = [10, 20, 30, 50];
type Preset = Attribute | "even";
/** Below this width the list is the page and a skill's tree opens in a sheet (WO-62's phone pattern). */
const WIDE = 900;

function subscribeSize(on: () => void) {
  window.addEventListener("resize", on);
  return () => window.removeEventListener("resize", on);
}

/**
 * Auto level (WO-65, WO-67), on a fresh build: goals are clicked in the trees and the perks they
 * need first are selected for them; the skills follow the goals; the attribute counters always
 * show, the presets filling them in. The level never drops below what the goals need: picking a
 * goal out of reach raises it, with Undo. The preview is fillToLevel's (WO-64), worked out as you
 * click. Run writes levels 2 to N. Nothing here is saved: the levels are.
 */
export function AutoLevel({ plan, onRun, onCancel }: { plan: BuildPlan; onRun: (next: BuildPlan, to: number) => void; onCancel: () => void }) {
  const d = useGameData();
  const states = useMemo(() => computeBuild(plan, d).slice(0, 1), [plan, d]);
  const start = states[0];
  const [toText, setToText] = useState("20");
  const [goals, setGoals] = useState<string[]>([]);
  const [preset, setPreset] = useState<Preset | null>(() => defaultAttribute(plan, d));
  const [counts, setCounts] = useState<Record<Attribute, number>>(() => attributeSettings(defaultAttribute(plan, d), 20).attributes);
  // "Level raised to 25 for Expert Destruction": shown until the next change (the goals or the level move on).
  const [raised, setRaised] = useState<{ from: number; goal: string; goals: string[]; to: number } | null>(null);
  const [tree, setTree] = useState(plan.majors[0] ?? "Destruction");
  const [sheet, setSheet] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<TreeView>("list");
  const width = useSyncExternalStore(subscribeSize, () => window.innerWidth, () => 1440);
  const height = useSyncExternalStore(subscribeSize, () => window.innerHeight, () => 900);
  const wide = width >= WIDE;

  // The floor: the lowest level every goal can make. Nothing under it can be picked or typed.
  // (The React Compiler memoizes these: each is a fill of the build, about 25ms to the top level.)
  const floor = goalFloor(plan, goals, d, MAX_LEVELS);
  const clampLevel = (text: string, min = floor) => Math.min(MAX_LEVELS, Math.max(min, Math.round(Number(text)) || 2));
  const to = clampLevel(toText);

  // A new level keeps the attributes' shares (a lit preset fills them in again), so they still add up.
  const setLevel = (n: number) => {
    setToText(String(n));
    setCounts(preset ? attributeSettings(preset, n).attributes : scaleAttributes(counts, n - 1));
  };
  const pickPreset = (p: Preset) => {
    setPreset(p);
    setCounts(attributeSettings(p, to).attributes);
  };
  const shift = (a: Attribute, by: 1 | -1) => {
    const next = shiftAttribute(counts, a, by);
    if (!next) return;
    setCounts(next);
    setPreset(null);
  };

  const g = goalsToSettings(plan, goals, to, counts, d);
  const { report } = fillToLevel(plan, g.settings, d);
  const chosen = new Set([...goals, ...g.along]);
  const showRaised = raised && raised.goals === goals && raised.to === to ? raised : null;

  const marks = new Map<string, GoalMark>();
  for (const id of g.along) marks.set(id, "along");
  for (const id of goals) marks.set(id, "goal");
  for (const c of g.clashes) for (const id of [c.a, c.b]) marks.set(id, "clash");
  // Picking a goal the level can't reach raises the level to what the goals need; dropping one never lowers it.
  const toggle = (id: string) => {
    if (goals.includes(id)) return setGoals(goals.filter((x) => x !== id));
    const next = [...goals, id];
    setGoals(next);
    const need = goalFloor(plan, next, d, MAX_LEVELS);
    if (need > to) {
      setLevel(need);
      setRaised({ from: to, goal: id, goals: next, to: need });
    }
  };
  const undoRaise = () => {
    if (!showRaised) return;
    setGoals(goals.filter((x) => x !== showRaised.goal));
    setToText(String(showRaised.from));
    setCounts(preset ? attributeSettings(preset, showRaised.from).attributes : scaleAttributes(counts, showRaised.from - 1));
    setRaised(null);
  };

  const need = (id: string) => {
    const p = d.perkById.get(id);
    return p?.rankSkills?.[0] ?? p?.skill ?? 0;
  };
  /** A tree's row: how many goals (or perks selected for them) and the skill they need, by when. */
  const rowOf = (sk: string) => {
    const mine = [...chosen].filter((id) => d.perkById.get(id)?.tree === sk);
    const count = mine.filter((id) => goals.includes(id)).length || mine.length;
    if (sk === "Destiny") return { count, text: "", cls: "muted" };
    if (!mine.length) return { count, text: String(start.skills[sk] ?? 0), cls: "muted" };
    const top = Math.max(...mine.map(need));
    if (top <= (start.skills[sk] ?? 0)) return { count, text: `${top} now`, cls: styles.ok };
    const at = report.targets.find((t) => t.skill === sk)?.reachedAt ?? null;
    return { count, text: at === null ? String(top) : `${top} by ${at}`, cls: at !== null && at <= to ? styles.ok : styles.warn };
  };

  /** When a goal lands (the level is never under what the goals need), or the game's reason it can't be held. */
  const whenOf = (id: string): { text: string; ok: boolean } => {
    const clash = g.clashes.find((c) => c.a === id || c.b === id);
    if (clash) return { text: clash.message, ok: false };
    const r = report.perks.find((p) => p.id === id);
    return r?.level ? { text: `Level ${r.level}`, ok: true } : { text: r?.reason ?? "Not placed", ok: false };
  };

  const open = (sk: string) => {
    setTree(sk);
    if (!wide) setSheet(sk);
  };
  const row = (sk: string, destiny = false) => {
    const r = rowOf(sk);
    const on = wide && tree === sk;
    return (
      <button key={sk} type="button" className={`${styles.row} ${destiny ? styles.destinyRow : ""} ${on ? styles.rowOn : ""}`} aria-pressed={on} aria-label={sk} data-skill={sk} onClick={() => open(sk)}>
        <span className={styles.rowName}>
          {destiny ? <i className={styles.destinyDiamond} aria-hidden="true" /> : <SkillIcon name={sk} />}
          <span className={styles.nm}>{sk}</span>
          {r.count > 0 && <span className={styles.badge}>{r.count}</span>}
        </span>
        <span className={`${styles.need} ${r.cls}`} data-need="">
          {r.text}
        </span>
      </button>
    );
  };

  const heading = (t: string) => (
    <span className={styles.treeHead}>
      {t === "Destiny" ? <i className={styles.destinyDiamond} aria-hidden="true" /> : <SkillIcon name={t} size={32} />}
      <h2 className={styles.treeTitle}>{t}</h2>
      {t !== "Destiny" && <span className="muted">{start.skills[t] ?? 0} now</span>}
    </span>
  );

  // Only goals that rule each other out block the run; the level never does.
  const blocked = g.clashes.length > 0 ? "Drop one of the goals that rule each other out." : null;
  // Under the preview on a wide screen; pinned to the bottom of the window on a narrow one.
  const actions = (here: boolean, cls: string) => (
    <div className={cls} data-tour={here ? "al-run" : undefined}>
      <button type="button" className={`btn btn-primary ${styles.run}`} disabled={!!blocked} onClick={() => onRun(fillToLevel(plan, g.settings, d).plan, to)}>
        Auto level to {to}
      </button>
      {blocked && <p className={`${styles.bad} ${styles.small}`}>{blocked}</p>}
    </div>
  );
  const levelChip = (n: number, label: string) => {
    const under = n < floor;
    const chip = (
      <button key={label} type="button" aria-pressed={to === n} disabled={under} className={`${styles.chip} ${to === n ? styles.chipOn : ""}`} onClick={() => setLevel(n)}>
        {label}
      </button>
    );
    // A disabled button gets no hover: the tooltip sits on a wrapper.
    return under ? (
      <Tooltip key={label} content={`Your goals need level ${floor}.`}>
        <span tabIndex={0} className={styles.chipWrap}>
          {chip}
        </span>
      </Tooltip>
    ) : (
      chip
    );
  };

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.settings}>
        <span className={styles.titleBox}>
          <button type="button" className={`btn btn-quiet ${styles.back}`} onClick={onCancel}>
            ‹ Level 1
          </button>
          <h1 className={styles.title}>Auto level</h1>
        </span>
        <span className={styles.setting} role="group" aria-labelledby="al-to" data-tour="al-level">
          <span id="al-to" className={styles.lab}>
            To level
          </span>
          {QUICK.map((n) => levelChip(n, String(n)))}
          {levelChip(MAX_LEVELS, "Max")}
          <input
            className={`input ${styles.toInput}`}
            type="number"
            min={floor}
            max={MAX_LEVELS}
            aria-label="Level to reach"
            value={toText}
            onChange={(e) => {
              setToText(e.target.value);
              if (Number(e.target.value) >= floor) setCounts(preset ? attributeSettings(preset, clampLevel(e.target.value)).attributes : scaleAttributes(counts, clampLevel(e.target.value) - 1));
            }}
            onBlur={() => setLevel(to)}
          />
        </span>
        {showRaised && (
          <p role="status" className={styles.raised}>
            Level raised to {showRaised.to} for {d.perkById.get(showRaised.goal)?.name}.{" "}
            <button type="button" className={styles.linkButton} onClick={undoRaise}>
              Undo
            </button>
          </p>
        )}
      </div>
      <div className={styles.attrRow} role="group" aria-labelledby="al-attrs" data-tour="al-attrs">
        <span id="al-attrs" className={styles.lab}>
          Attributes
        </span>
        {ATTRS.map((a) => (
          <div key={a} className={`${styles.att} ${styles[a]}`}>
            <span className={styles.attName}>
              <AttributeIcon name={a} />
              {ATTRIBUTE_NAMES[a]}
            </span>
            <span className={styles.stepper}>
              <button type="button" aria-label={`Fewer ${ATTRIBUTE_NAMES[a]}`} disabled={counts[a] <= 0} onClick={() => shift(a, -1)}>
                −
              </button>
              <b aria-label={`${ATTRIBUTE_NAMES[a]} level-ups`}>{counts[a]}</b>
              <button type="button" aria-label={`More ${ATTRIBUTE_NAMES[a]}`} disabled={!shiftAttribute(counts, a, 1)} onClick={() => shift(a, 1)}>
                +
              </button>
            </span>
          </div>
        ))}
        <span className={styles.presets}>
          {([...ATTRS, "even"] as const).map((p) => (
            <button key={p} type="button" aria-pressed={preset === p} className={`${styles.chip} ${preset === p ? styles.chipOn : ""}`} onClick={() => pickPreset(p)}>
              {p === "even" ? "Even" : `${ATTRIBUTE_NAMES[p]} first`}
            </button>
          ))}
        </span>
      </div>

      <div className={styles.columns}>
        <nav className={styles.skills} aria-label="Skills" data-tour="al-skills">
          {d.skillGroups.map((grp) => (
            <div key={grp.group} className={styles.group}>
              <span className={styles.lab}>{grp.group}</span>
              {grp.skills.map((sk) => row(sk))}
            </div>
          ))}
          {row("Destiny", true)}
        </nav>
        {wide && (
          <section className={styles.treeCol} aria-label={`${tree} tree`} data-tour="al-tree">
            <Tree key={tree} tree={tree} states={states} level={1} marks={marks} startFit onSelect={toggle} heading={heading(tree)} height={Math.max(420, Math.min(760, height - 360))} />
          </section>
        )}
        <aside className={styles.preview} aria-labelledby="al-preview">
          <h2 id="al-preview" className={styles.h2}>
            At level {to}
          </h2>
          <div className={styles.hms}>
            {ATTRS.map((a) => (
              <div key={a}>
                <b className={`${styles.hmsNum} ${styles[`${a}Text`]}`}>{report[a]}</b>
                <span className={`muted ${styles.small}`}>{ATTRIBUTE_NAMES[a]}</span>
              </div>
            ))}
          </div>
          <span className={styles.lab}>Goals</span>
          <ul className={styles.goals}>
            {goals.map((id) => {
              const p = d.perkById.get(id);
              const w = whenOf(id);
              const along = (g.paths[id] ?? []).filter((x) => !goals.includes(x)).map((x) => d.perkById.get(x)?.name ?? x);
              return (
                <li key={id} className={styles.goal} data-goal={id}>
                  <span>
                    {p?.name ?? id} <span className={`muted ${styles.small}`}>{p?.tree}</span>
                    {along.length > 0 && <span className={`muted ${styles.along}`}>Auto selected: {along.join(", ")}</span>}
                  </span>
                  <span className={styles.goalEnd}>
                    <span className={`${styles.when} ${w.ok ? styles.ok : styles.bad}`}>{w.text}</span>
                    <button type="button" className={styles.x} aria-label={`Remove ${p?.name ?? id}`} onClick={() => toggle(id)}>
                      ×
                    </button>
                  </span>
                </li>
              );
            })}
            {!goals.length && <li className="muted">No goals yet. Click the perks you want in the trees.</li>}
          </ul>
          {chosen.size > 0 && (
            <p className={`muted ${styles.small} ${styles.line}`}>
              {chosen.size} perk{chosen.size === 1 ? "" : "s"}, with the auto selected ones.
            </p>
          )}
          {(report.skillPointsLeft > 0 || report.perkPointsLeft > 0) && (
            <p className={styles.leftover}>
              <b className={styles.warn}>Not spent by level {to}:</b>{" "}
              {[report.skillPointsLeft > 0 && `${report.skillPointsLeft} skill point${report.skillPointsLeft === 1 ? "" : "s"}`, report.perkPointsLeft > 0 && `${report.perkPointsLeft} perk point${report.perkPointsLeft === 1 ? "" : "s"}`]
                .filter(Boolean)
                .join(" and ")}
              . <InfoTip label="About points not spent" text="Points the goals didn't need. They stay banked; pick more perks to use them." />
            </p>
          )}
          {actions(wide, styles.actionsWide)}
        </aside>
      </div>
      {actions(!wide, styles.actionsPinned)}

      {!wide && sheet && (
        <BottomSheet label={`${sheet} perks`} tall onClose={() => setSheet(null)}>
          <div className={styles.sheetHead}>{heading(sheet)}</div>
          <ViewToggle view={sheetView} onView={setSheetView} className={styles.sheetToggle} />
          <Tree tree={sheet} states={states} level={1} marks={marks} startFit onSelect={toggle} view={sheetView} onView={setSheetView} noToggle sheetBelow={0} height={Math.max(300, Math.round(height * 0.85 - 250))} />
        </BottomSheet>
      )}
      {/* Tapps' plain tour of the page (WO-67), once; Show me around restarts it. */}
      <Tour kind="autolevel" script={AUTOLEVEL_TOUR(to, wide)} />
    </div>
  );
}
