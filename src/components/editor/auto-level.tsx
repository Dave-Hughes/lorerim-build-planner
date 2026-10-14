"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useGameData } from "@/components/game-data";
import { BottomSheet, Tree, ViewToggle, type GoalMark, type TreeView } from "@/components/build/tree";
import { AttributeIcon, SkillIcon } from "@/components/ui/skill-icon";
import { MAX_LEVELS } from "@/lib/builds/validate";
import { ATTRIBUTE_NAMES } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { TOUR_EVENT, tourDone, tourDue } from "@/lib/tour";
import type { Attribute, BuildPlan } from "@/lib/rules/types";
import { defaultAttribute, evenAttributes, fillToLevel, goalsToSettings, type AttributeChoice } from "./plan-ops";
import styles from "./auto-level.module.css";

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];
const QUICK = [10, 20, 30, 50];
const noop = () => () => {};
/** Below this width the list is the page and a skill's tree opens in a sheet (WO-62's phone pattern). */
const WIDE = 900;

function subscribeSize(on: () => void) {
  window.addEventListener("resize", on);
  return () => window.removeEventListener("resize", on);
}

/**
 * Auto level (WO-65), on a fresh build: goals are clicked in the trees and their paths come
 * along; the skills follow the goals; attributes are one choice. The preview beside them is
 * fillToLevel's (WO-64), worked out as you click. Run writes levels 2 to N. Nothing here is saved:
 * the levels are.
 */
export function AutoLevel({ plan, onRun, onCancel }: { plan: BuildPlan; onRun: (next: BuildPlan, to: number) => void; onCancel: () => void }) {
  const d = useGameData();
  const states = useMemo(() => computeBuild(plan, d).slice(0, 1), [plan, d]);
  const start = states[0];
  const [toText, setToText] = useState("20");
  const to = Math.min(MAX_LEVELS, Math.max(2, Math.round(Number(toText)) || 2));
  const [goals, setGoals] = useState<string[]>([]);
  const [style, setStyle] = useState<Attribute | "even" | "custom">(() => defaultAttribute(plan, d));
  const [custom, setCustom] = useState<Record<Attribute, number>>(() => evenAttributes(19));
  const [tree, setTree] = useState(plan.majors[0] ?? "Destruction");
  const [sheet, setSheet] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<TreeView>("list");
  const width = useSyncExternalStore(subscribeSize, () => window.innerWidth, () => 1440);
  const height = useSyncExternalStore(subscribeSize, () => window.innerHeight, () => 900);
  const wide = width >= WIDE;

  // The level changes: Custom's counts follow, on the attribute with the most.
  const setLevel = (text: string) => {
    setToText(text);
    const n = Math.min(MAX_LEVELS, Math.max(2, Math.round(Number(text)) || 2)) - 1;
    const diff = n - ATTRS.reduce((t, a) => t + custom[a], 0);
    const top = ATTRS.reduce((a, b) => (custom[b] > custom[a] ? b : a));
    setCustom({ ...custom, [top]: Math.max(0, custom[top] + diff) });
  };
  const choice: AttributeChoice = style === "custom" ? custom : style;
  const used = ATTRS.reduce((t, a) => t + custom[a], 0);
  const customOff = style === "custom" && used !== to - 1;

  const g = useMemo(() => goalsToSettings(plan, goals, to, choice, d), [plan, goals, to, choice, d]);
  const { report } = useMemo(() => fillToLevel(plan, g.settings, d), [plan, g, d]);
  const chosen = useMemo(() => new Set([...goals, ...g.along]), [goals, g]);
  const late = report.perks.some((p) => p.level === null) || report.targets.some((t) => chosen.size > 0 && t.reachedAt === null);
  // "At the earliest": the same goals filled to the top level, worked out once per set of goals.
  const full = useMemo(() => (late ? fillToLevel(plan, goalsToSettings(plan, goals, MAX_LEVELS, "even", d).settings, d).report : null), [late, plan, goals, d]);

  const marks = useMemo(() => {
    const m = new Map<string, GoalMark>();
    for (const id of g.along) m.set(id, "along");
    for (const id of goals) m.set(id, "goal");
    for (const c of g.clashes) for (const id of [c.a, c.b]) m.set(id, "clash");
    return m;
  }, [g, goals]);
  const toggle = (id: string) => setGoals(goals.includes(id) ? goals.filter((x) => x !== id) : [...goals, id]);

  const need = (id: string) => {
    const p = d.perkById.get(id);
    return p?.rankSkills?.[0] ?? p?.skill ?? 0;
  };
  /** A tree's row: how many goals (or perks coming along) and the skill they need, by when. */
  const rowOf = (sk: string) => {
    const mine = [...chosen].filter((id) => d.perkById.get(id)?.tree === sk);
    const count = mine.filter((id) => goals.includes(id)).length || mine.length;
    if (sk === "Destiny") return { count, text: "", cls: "muted" };
    if (!mine.length) return { count, text: String(start.skills[sk] ?? 0), cls: "muted" };
    const top = Math.max(...mine.map(need));
    if (top <= (start.skills[sk] ?? 0)) return { count, text: `${top} now`, cls: styles.ok };
    const at = report.targets.find((t) => t.skill === sk)?.reachedAt ?? full?.targets.find((t) => t.skill === sk)?.reachedAt ?? null;
    if (at === null) return { count, text: `${top}, not by ${MAX_LEVELS}`, cls: styles.warn };
    return { count, text: `${top} by ${at}`, cls: at <= to ? styles.ok : styles.warn };
  };

  /** When a goal lands, or why not by the level to reach. */
  const whenOf = (id: string): { text: string; ok: boolean } => {
    const clash = g.clashes.find((c) => c.a === id || c.b === id);
    if (clash) return { text: clash.message, ok: false };
    const lvl = report.perks.find((p) => p.id === id)?.level ?? null;
    if (lvl !== null) return { text: `Level ${lvl}`, ok: true };
    const p = d.perkById.get(id)!;
    const earliest = full?.perks.find((x) => x.id === id)?.level ?? null;
    const n = need(id);
    const short = p.tree !== "Destiny" && (report.targets.find((t) => t.skill === p.tree)?.end ?? 0) < n;
    if (earliest === null) return { text: report.perks.find((x) => x.id === id)?.reason ?? `Not by ${to}`, ok: false };
    return { text: short ? `Not by ${to}: needs ${p.tree} ${n}, level ${earliest} at the earliest` : `Not by ${to}: level ${earliest} at the earliest`, ok: false };
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

  const blocked = g.clashes.length > 0 ? "Drop one of the goals that rule each other out." : customOff ? `The attributes take ${to - 1} level-ups: ${used} so far.` : null;
  // Under the preview on a wide screen; pinned to the bottom of the window on a narrow one.
  const actions = (where: string) => (
    <div className={where}>
      <button type="button" className={`btn btn-primary ${styles.run}`} disabled={!!blocked} onClick={() => onRun(fillToLevel(plan, g.settings, d).plan, to)}>
        Auto level to {to}
      </button>
      {blocked && <p className={`${styles.bad} ${styles.small}`}>{blocked}</p>}
    </div>
  );

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.settings}>
        <span className={styles.titleBox}>
          <button type="button" className={`btn btn-quiet ${styles.back}`} onClick={onCancel}>
            ‹ Level 1
          </button>
          <h1 className={styles.title}>Auto level</h1>
        </span>
        <span className={styles.setting} role="group" aria-labelledby="al-to">
          <span id="al-to" className={styles.lab}>
            To level
          </span>
          {QUICK.map((n) => (
            <button key={n} type="button" aria-pressed={to === n} className={`${styles.chip} ${to === n ? styles.chipOn : ""}`} onClick={() => setLevel(String(n))}>
              {n}
            </button>
          ))}
          <input className={`input ${styles.toInput}`} type="number" min={2} max={MAX_LEVELS} aria-label="Level to reach" value={toText} onChange={(e) => setLevel(e.target.value)} onBlur={() => setToText(String(to))} />
        </span>
        <span className={styles.setting} role="group" aria-labelledby="al-attrs">
          <span id="al-attrs" className={styles.lab}>
            Attributes
          </span>
          {([...ATTRS, "even", "custom"] as const).map((a) => (
            <button key={a} type="button" aria-pressed={style === a} className={`${styles.chip} ${style === a ? styles.chipOn : ""}`} onClick={() => setStyle(a)}>
              {a === "even" ? "Even" : a === "custom" ? "Custom" : `${ATTRIBUTE_NAMES[a]} first`}
            </button>
          ))}
        </span>
      </div>
      {style === "custom" && (
        <div className={styles.customRow} role="group" aria-label="Custom attributes">
          {ATTRS.map((a) => (
            <div key={a} className={`${styles.att} ${styles[a]}`}>
              <span className={styles.attName}>
                <AttributeIcon name={a} />
                {ATTRIBUTE_NAMES[a]}
              </span>
              <span className={styles.stepper}>
                <button type="button" aria-label={`Fewer ${ATTRIBUTE_NAMES[a]}`} disabled={custom[a] <= 0} onClick={() => setCustom({ ...custom, [a]: custom[a] - 1 })}>
                  −
                </button>
                <b aria-label={`${ATTRIBUTE_NAMES[a]} level-ups`}>{custom[a]}</b>
                <button type="button" aria-label={`More ${ATTRIBUTE_NAMES[a]}`} disabled={used >= to - 1} onClick={() => setCustom({ ...custom, [a]: custom[a] + 1 })}>
                  +
                </button>
              </span>
            </div>
          ))}
          <span className={`muted ${styles.small}`}>
            {used} of {to - 1} level-ups
          </span>
        </div>
      )}
      <TappsCard />

      <div className={styles.columns}>
        <nav className={styles.skills} aria-label="Skills">
          {d.skillGroups.map((grp) => (
            <div key={grp.group} className={styles.group}>
              <span className={styles.lab}>{grp.group}</span>
              {grp.skills.map((sk) => row(sk))}
            </div>
          ))}
          {row("Destiny", true)}
        </nav>
        {wide && (
          <section className={styles.treeCol} aria-label={`${tree} tree`}>
            <Tree key={tree} tree={tree} states={states} level={1} marks={marks} startFit onSelect={toggle} heading={heading(tree)} height={Math.max(420, Math.min(760, height - 330))} />
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
                    {along.length > 0 && <span className={`muted ${styles.along}`}>with {along.join(", ")}</span>}
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
              {chosen.size} perk{chosen.size === 1 ? "" : "s"} with what comes along.
            </p>
          )}
          {(report.skillPointsLeft > 0 || report.perkPointsLeft > 0) && (
            <p className={styles.leftover}>
              <b className={styles.warn}>Left over at level {to}:</b>{" "}
              {[report.skillPointsLeft > 0 && `${report.skillPointsLeft} skill point${report.skillPointsLeft === 1 ? "" : "s"}`, report.perkPointsLeft > 0 && `${report.perkPointsLeft} perk point${report.perkPointsLeft === 1 ? "" : "s"}`]
                .filter(Boolean)
                .join(" and ")}
              . Add goals to spend them.
            </p>
          )}
          {actions(styles.actionsWide)}
        </aside>
      </div>
      {actions(styles.actionsPinned)}

      {!wide && sheet && (
        <BottomSheet label={`${sheet} perks`} tall onClose={() => setSheet(null)}>
          <div className={styles.sheetHead}>{heading(sheet)}</div>
          <ViewToggle view={sheetView} onView={setSheetView} className={styles.sheetToggle} />
          <Tree tree={sheet} states={states} level={1} marks={marks} startFit onSelect={toggle} view={sheetView} onView={setSheetView} noToggle sheetBelow={0} height={Math.max(300, Math.round(height * 0.85 - 250))} />
        </BottomSheet>
      )}
    </div>
  );
}

/** Tapps explains, the first time the page opens; Show me around brings him back. */
function TappsCard() {
  const due = useSyncExternalStore(noop, () => tourDue("autolevel"), () => false);
  const [shown, setShown] = useState<boolean | null>(null);
  useEffect(() => {
    const again = () => setShown(true);
    window.addEventListener(TOUR_EVENT, again);
    return () => window.removeEventListener(TOUR_EVENT, again);
  }, []);
  if (!(shown ?? due)) return null;
  return (
    <div className={styles.tapps}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/tapps.svg" alt="Tapps" width={72} height={72} className={styles.tappsImg} />
      <div role="note" className={styles.tappsCard}>
        <span className={styles.tappsTail} aria-hidden="true" />
        <div className={styles.tappsWords}>
          <b className={styles.tappsTitle}>Tapps does the levels</b>
          <span>Click the perks you want. Tapps brings the ones before them, raises the skills, and fills every level between. Can&apos;t happen by then? Tapps says so.</span>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            tourDone("autolevel");
            setShown(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
