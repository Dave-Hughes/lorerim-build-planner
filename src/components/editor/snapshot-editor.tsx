"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useGameData } from "@/components/game-data";
import { BottomSheet, Tree, ViewToggle, type GoalMark, type TreeView } from "@/components/build/tree";
import { Tour } from "@/components/tour/tour";
import { AttributeIcon, SkillIcon } from "@/components/ui/skill-icon";
import { Tooltip } from "@/components/ui/tooltip";
import { saveBuildPlan } from "@/lib/builds/actions";
import { MAX_LEVELS } from "@/lib/builds/limits";
import type { GameData } from "@/lib/rules/data";
import { ATTRIBUTE_NAMES } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { fillSnapshot, ruledOut, skillCap, skillNeedOf, snapshotFloor } from "@/lib/rules/snapshot";
import { SNAPSHOT_TOUR } from "@/lib/tour";
import type { Attribute, BuildPlan, Snapshot } from "@/lib/rules/types";
import { attributeSettings, defaultAttribute, scaleAttributes, shiftAttribute } from "./plan-ops";
import styles from "./snapshot-editor.module.css";

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];
const QUICK = [10, 20, 30, 50];
type Preset = Attribute | "even";
const PRESETS: Preset[] = [...ATTRS, "even"];
/** Below this width the list is the page and a skill's tree opens in a sheet (WO-62's phone pattern). */
const WIDE = 900;

function subscribeSize(on: () => void) {
  window.addEventListener("resize", on);
  return () => window.removeEventListener("resize", on);
}

/** A new snapshot (WO-68): level 50, the attributes leaning on the first major's school, nothing picked. */
export function newSnapshot(plan: BuildPlan, d: GameData): Snapshot {
  return { level: 50, attributes: attributeSettings(defaultAttribute(plan, d), 50).attributes, perks: [], skills: {} };
}

/**
 * The snapshot editor (WO-68): the build at one level. The level and attribute level-ups across
 * the top; the skills (with a value field each), the tree to pick perks in, and the picks on the
 * right. What a pick needs first is selected for it; what can't go with the picks is ruled out;
 * the level never drops below what the picks and set values need. Every change is a plan change,
 * so the editor's autosave keeps it; the server checks the snapshot again on save.
 */
export function SnapshotEditor({ buildId, plan, setPlan }: { buildId: string; plan: BuildPlan; setPlan: (p: BuildPlan) => void }) {
  const d = useGameData();
  const router = useRouter();
  const snap = plan.snapshot!;
  const L = snap.level;
  const [levelText, setLevelText] = useState<string | null>(null);
  // "Level raised to 25 for Cremation" and a skill's "Most it can be" line: each shown until the next change.
  const [raised, setRaised] = useState<{ from: Snapshot; goal: string; after: Snapshot } | null>(null);
  const [skillNote, setSkillNote] = useState<{ text: string; after: Snapshot } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [tree, setTree] = useState(plan.majors[0] ?? "Destruction");
  const [sheet, setSheet] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<TreeView>("list");
  const [saving, setSaving] = useState<string | null>(null);
  const width = useSyncExternalStore(subscribeSize, () => window.innerWidth, () => 1440);
  const height = useSyncExternalStore(subscribeSize, () => window.innerHeight, () => 900);
  const wide = width >= WIDE;

  // (The React Compiler memoizes these: each fill of the build is about 25ms to the top level.)
  const start = computeBuild({ ...plan, levels: plan.levels.slice(0, 1) }, d)[0];
  const { g, report, states } = fillSnapshot(plan, snap, d);
  const at = states[L - 1];
  const floor = snapshotFloor(plan, snap, d);
  const chosen = new Set([...snap.perks, ...g.along]);
  const ruled = ruledOut(d, chosen);
  const name = (id: string) => d.perkById.get(id)?.name ?? id;

  const marks = new Map<string, GoalMark>();
  const notes = new Map<string, string>();
  for (const [id, r] of ruled) {
    marks.set(id, "ruled");
    const by = d.perkById.get(r.by);
    notes.set(id, `Not with ${by?.tree}: ${by?.name}, ${snap.perks.includes(r.by) ? "a perk you picked" : "a perk that's auto selected"}.${r.via !== id ? ` It needs ${name(r.via)}, which that rules out.` : ""}`);
  }
  for (const id of g.along) marks.set(id, "along");
  for (const id of snap.perks) marks.set(id, "goal");

  /** The snapshot changed: a new plan for the autosave (the stored result is worked out again on save). */
  const put = (next: Snapshot) => {
    const { result: _result, ...rest } = next;
    void _result;
    setPlan({ ...plan, snapshot: rest });
    return rest;
  };
  const preset = PRESETS.find((p) => ATTRS.every((a) => attributeSettings(p, L).attributes[a] === snap.attributes[a])) ?? null;
  /** The same snapshot at another level: the attribute shares kept (a lit preset fills them in again). */
  const atLevel = (s: Snapshot, level: number): Snapshot => ({ ...s, level, attributes: preset ? attributeSettings(preset, level).attributes : scaleAttributes(s.attributes, level - 1) });
  const setLevel = (n: number) => {
    setLevelText(null);
    put(atLevel(snap, Math.min(MAX_LEVELS, Math.max(floor, n))));
  };

  // Picking a perk the level can't reach raises the level to what the picks need; dropping one never lowers it.
  const toggle = (id: string) => {
    if (ruled.has(id)) return;
    if (snap.perks.includes(id)) return put({ ...snap, perks: snap.perks.filter((x) => x !== id) });
    const p = d.perkById.get(id);
    const need = p?.rankSkills?.[0] ?? p?.skill ?? 0;
    // A value set under what the new pick needs goes up to it.
    const skills = p && p.tree in snap.skills ? { ...snap.skills, [p.tree]: Math.max(snap.skills[p.tree], need) } : snap.skills;
    let next: Snapshot = { ...snap, perks: [...snap.perks, id], skills };
    const needLevel = snapshotFloor(plan, next, d);
    if (needLevel > MAX_LEVELS) return;
    if (needLevel > L) {
      next = atLevel(next, needLevel);
      setRaised({ from: snap, goal: id, after: put(next) });
    } else put(next);
  };
  const showRaised = raised && raised.after === snap ? raised : null;
  const showNote = skillNote && skillNote.after === snap ? skillNote.text : null;

  /** A typed skill value, kept between what the picks need and the most the points allow with the others. */
  const commitSkill = (sk: string, text: string) => {
    setDrafts((x) => {
      const { [sk]: _drop, ...rest } = x;
      void _drop;
      return rest;
    });
    const v = Math.round(Number(text));
    if (!Number.isFinite(v)) return;
    const low = skillNeedOf(d, chosen, sk, start.skills[sk] ?? 0);
    if (v < low) {
      const after = put({ ...snap, skills: { ...snap.skills, [sk]: low } });
      return setSkillNote({ text: `At least ${low} for the perks you picked.`, after });
    }
    const next = { ...snap, skills: { ...snap.skills, [sk]: v } };
    if (snapshotFloor(plan, next, d) <= L) return put(next);
    const cap = skillCap(plan, snap, sk, low, d);
    const after = put({ ...snap, skills: { ...snap.skills, [sk]: cap } });
    setSkillNote({ text: `Most it can be with the others: ${cap}.`, after });
  };
  const resetSkill = (sk: string) => {
    const { [sk]: _drop, ...skills } = snap.skills;
    void _drop;
    put({ ...snap, skills });
  };
  const shift = (a: Attribute, by: 1 | -1) => {
    const next = shiftAttribute(snap.attributes, a, by);
    if (next) put({ ...snap, attributes: next });
  };

  const open = (sk: string) => {
    setTree(sk);
    if (!wide) setSheet(sk);
  };
  const row = (sk: string) => {
    const mine = [...chosen].filter((id) => d.perkById.get(id)?.tree === sk);
    const count = mine.filter((id) => snap.perks.includes(id)).length || mine.length;
    const on = wide && tree === sk;
    const set = sk in snap.skills;
    const low = skillNeedOf(d, chosen, sk, start.skills[sk] ?? 0);
    const value = drafts[sk] ?? String(set ? snap.skills[sk] : (at.skills[sk] ?? 0));
    const tip = low > (start.skills[sk] ?? 0) ? `At least ${low} for the perks you picked.` : set ? "Set by you." : plan.majors.includes(sk) ? "A major: spare points go here." : plan.minors.includes(sk) ? "A minor: spare points go here after the majors." : "Its value at level 1.";
    return (
      <div key={sk} className={`${styles.row} ${on ? styles.rowOn : ""}`} data-skill={sk}>
        <button type="button" className={styles.pick} aria-pressed={on} aria-label={sk} onClick={() => open(sk)}>
          <SkillIcon name={sk} />
          <span className={styles.nm}>{sk}</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
        {set && (
          <button type="button" className={styles.reset} aria-label={`Reset ${sk}`} title="Back to what the rules give it" onClick={() => resetSkill(sk)}>
            ↺
          </button>
        )}
        <Tooltip content={tip}>
          <input
            className={`${styles.val} ${set ? styles.valSet : ""}`}
            type="number"
            min={low}
            max={100}
            aria-label={`${sk} at level ${L}`}
            value={value}
            onChange={(e) => setDrafts({ ...drafts, [sk]: e.target.value })}
            onBlur={(e) => drafts[sk] !== undefined && commitSkill(sk, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
          />
        </Tooltip>
      </div>
    );
  };

  const heading = (t: string) => (
    <span className={styles.treeHead}>
      {t === "Destiny" ? <i className={styles.destinyDiamond} aria-hidden="true" /> : <SkillIcon name={t} size={32} />}
      <h2 className={styles.treeTitle}>{t}</h2>
      {t !== "Destiny" && (
        <span className="muted">
          {at.skills[t] ?? 0} at level {L}
        </span>
      )}
    </span>
  );

  const save = async () => {
    setSaving("Saving…");
    const r = await saveBuildPlan(buildId, plan);
    if (r.ok) router.push(`/b/${buildId}`);
    else setSaving(r.error);
  };
  const saveBox = (here: boolean, cls: string) => (
    <div className={cls} data-tour={here ? "sn-save" : undefined}>
      <button type="button" className={`btn btn-primary ${styles.run}`} disabled={saving === "Saving…"} onClick={save}>
        Save snapshot
      </button>
      {saving && saving !== "Saving…" && <p className={`${styles.bad} ${styles.small}`}>{saving}</p>}
    </div>
  );
  const levelChip = (n: number, label: string) => {
    const under = n < floor;
    const chip = (
      <button key={label} type="button" aria-pressed={L === n} disabled={under} className={`${styles.chip} ${L === n ? styles.chipOn : ""}`} onClick={() => setLevel(n)}>
        {label}
      </button>
    );
    // A disabled button gets no hover: the tooltip sits on a wrapper.
    return under ? (
      <Tooltip key={label} content={`Your perks need level ${floor}.`}>
        <span tabIndex={0} className={styles.chipWrap}>
          {chip}
        </span>
      </Tooltip>
    ) : (
      chip
    );
  };
  const destinyRow = (() => {
    const mine = [...chosen].filter((id) => d.perkById.get(id)?.tree === "Destiny");
    const count = mine.filter((id) => snap.perks.includes(id)).length || mine.length;
    const on = wide && tree === "Destiny";
    return (
      <div className={`${styles.row} ${styles.destinyRow} ${on ? styles.rowOn : ""}`}>
        <button type="button" className={styles.pick} aria-pressed={on} aria-label="Destiny" onClick={() => open("Destiny")}>
          <i className={styles.destinyDiamond} aria-hidden="true" />
          <span className={styles.nm}>Destiny</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
      </div>
    );
  })();

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.settings}>
        <span className={styles.setting} role="group" aria-labelledby="sn-at" data-tour="sn-level">
          <span id="sn-at" className={styles.lab}>
            At level
          </span>
          {QUICK.map((n) => levelChip(n, String(n)))}
          {levelChip(MAX_LEVELS, "Max")}
          <input
            className={`input ${styles.toInput}`}
            type="number"
            min={floor}
            max={MAX_LEVELS}
            aria-label="Level"
            value={levelText ?? String(L)}
            onChange={(e) => setLevelText(e.target.value)}
            onBlur={() => levelText !== null && setLevel(Math.round(Number(levelText)) || floor)}
            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
          />
        </span>
        <span className={styles.setting} role="group" aria-labelledby="sn-attrs" data-tour="sn-attrs">
          <span id="sn-attrs" className={styles.lab}>
            Attributes
          </span>
          {PRESETS.map((p) => (
            <button key={p} type="button" aria-pressed={preset === p} className={`${styles.chip} ${preset === p ? styles.chipOn : ""}`} onClick={() => put({ ...snap, attributes: attributeSettings(p, L).attributes })}>
              {p === "even" ? "Even" : `${ATTRIBUTE_NAMES[p]} first`}
            </button>
          ))}
          <span className={styles.counters}>
            {ATTRS.map((a) => (
              <span key={a} className={`${styles.att} ${styles[a]}`}>
                <span className={styles.attName}>
                  <AttributeIcon name={a} />
                  {ATTRIBUTE_NAMES[a]}
                </span>
                <button type="button" aria-label={`Fewer ${ATTRIBUTE_NAMES[a]}`} disabled={!shiftAttribute(snap.attributes, a, -1)} onClick={() => shift(a, -1)}>
                  −
                </button>
                <b aria-label={`${ATTRIBUTE_NAMES[a]} level-ups`}>{snap.attributes[a]}</b>
                <button type="button" aria-label={`More ${ATTRIBUTE_NAMES[a]}`} disabled={!shiftAttribute(snap.attributes, a, 1)} onClick={() => shift(a, 1)}>
                  +
                </button>
              </span>
            ))}
          </span>
        </span>
        {showRaised && (
          <p role="status" className={styles.raised}>
            Level raised to {showRaised.after.level} for {name(showRaised.goal)}.
            <button type="button" className="btn btn-sm" onClick={() => put(showRaised.from)}>
              Undo
            </button>
          </p>
        )}
      </div>

      <div className={styles.columns}>
        <nav className={styles.skills} aria-label="Skills" data-tour="sn-skills">
          <span className={`${styles.lab} ${styles.skillsHead}`}>Skills at level {L}</span>
          {showNote && (
            <p role="status" className={styles.note}>
              {showNote}
            </p>
          )}
          {d.skillGroups.map((grp) => (
            <div key={grp.group} className={styles.group}>
              <span className={styles.lab}>{grp.group}</span>
              {grp.skills.map(row)}
            </div>
          ))}
          {destinyRow}
        </nav>
        {wide && (
          <section className={styles.treeCol} aria-label={`${tree} tree`} data-tour="sn-tree">
            <Tree key={tree} tree={tree} states={[at]} level={1} marks={marks} markNotes={notes} startFit onSelect={toggle} heading={heading(tree)} height={Math.max(420, Math.min(760, height - 300))} />
          </section>
        )}
        <aside className={styles.preview} aria-labelledby="sn-panel">
          <h2 id="sn-panel" className={styles.h2}>
            Level {L}
          </h2>
          <div className={styles.hms}>
            {ATTRS.map((a) => (
              <div key={a}>
                <b className={`${styles.hmsNum} ${styles[`${a}Text`]}`}>{at[a]}</b>
                <span className={`muted ${styles.small}`}>{ATTRIBUTE_NAMES[a]}</span>
              </div>
            ))}
          </div>
          <p className={`muted ${styles.line}`}>
            {chosen.size} perk{chosen.size === 1 ? "" : "s"}, with the auto selected ones.
          </p>
          <span className={styles.lab}>Perks you picked</span>
          <ul className={styles.goals}>
            {snap.perks.map((id) => {
              const p = d.perkById.get(id);
              const along = (g.paths[id] ?? []).filter((x) => !snap.perks.includes(x)).map(name);
              const lvl = report.perks.find((x) => x.id === id)?.level;
              return (
                <li key={id} className={styles.goal} data-goal={id}>
                  <span>
                    {p?.name ?? id} <span className={`muted ${styles.small}`}>{p?.tree}</span>
                    {along.length > 0 && <span className={`muted ${styles.along}`}>Auto selected: {along.join(", ")}</span>}
                  </span>
                  <span className={styles.goalEnd}>
                    {lvl ? <span className={`${styles.when} ${styles.ok}`}>From level {lvl}</span> : null}
                    <button type="button" className={styles.x} aria-label={`Remove ${p?.name ?? id}`} onClick={() => toggle(id)}>
                      ×
                    </button>
                  </span>
                </li>
              );
            })}
            {!snap.perks.length && <li className="muted">No perks picked yet. Click the perks you want in the trees.</li>}
          </ul>
          <p className={`muted ${styles.small} ${styles.line}`}>Spare skill points go to your majors.</p>
          {saveBox(wide, styles.actionsWide)}
        </aside>
      </div>
      {saveBox(!wide, styles.actionsPinned)}

      {!wide && sheet && (
        <BottomSheet label={`${sheet} perks`} tall onClose={() => setSheet(null)}>
          <div className={styles.sheetHead}>{heading(sheet)}</div>
          <ViewToggle view={sheetView} onView={setSheetView} className={styles.sheetToggle} />
          <Tree tree={sheet} states={[at]} level={1} marks={marks} markNotes={notes} startFit onSelect={toggle} view={sheetView} onView={setSheetView} noToggle sheetBelow={0} height={Math.max(300, Math.round(height * 0.85 - 250))} />
        </BottomSheet>
      )}
      {/* Tapps' plain tour of the editor (WO-68), once; Show me around restarts it. */}
      <Tour kind="snapshot" script={SNAPSHOT_TOUR(wide)} />
    </div>
  );
}
