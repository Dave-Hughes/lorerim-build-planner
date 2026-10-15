"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Editor as TiptapEditor } from "@tiptap/react";
import { EditBar } from "./edit-bar";
import type { BuildVisibility } from "@/lib/builds/validate";
import { InfoTip } from "@/components/ui/info-tip";
import { Tooltip } from "@/components/ui/tooltip";
import { LevelBars, useHoldInPlace } from "@/components/build/level-nav";
import { Tree, type TreeView } from "@/components/build/tree";
import { heldCount } from "@/lib/rules/tree-states";
import { BottomSheet, ViewToggle } from "@/components/build/tree";
import { useGameData } from "@/components/game-data";
import { ATTRIBUTE_NAMES, levelMarks, skillStepInfo, stoneLabel, stoneShare } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import type { Attribute, BuildPlan } from "@/lib/rules/types";
import { GearBlock } from "./gear-block";
import { SpellBlock, SpellPicks } from "./spell-block";
import { AbilityBlock, ShoutBlock } from "./powers-block";
import { PerkPanel } from "./perk-panel";
import { SkillGains } from "@/components/build/skill-gains";
import { AttributeIcon, DeityIcon, IconLabel, SignIcon, SkillIcon, MarkIcon } from "@/components/ui/skill-icon";
import { GuideEditor, guideSaveLabel } from "@/components/guide/guide-editor";
import { GuideFactsProvider } from "@/components/guide/guide-facts";
import { saveKeptGuides } from "@/components/guide/use-guide-autosave";
import type { GuideSaveStatus } from "@/components/guide/use-guide-autosave";
import { emptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import * as ops from "./plan-ops";
import { MAX_LEVELS } from "@/lib/builds/validate";
import { ruledOut } from "@/lib/rules/ruled-out";
import { levelUps, skips, stretchAt, stretches } from "@/lib/rules/stretches";
import { picksAt, spellsToChoose } from "@/lib/rules/spells";
import { Tour } from "@/components/tour/tour";
import { AUTHOR_TOUR } from "@/lib/tour";
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
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
/** A stretch's pool (WO-69): "510 of 625 spent, 175 carried in". What it had counts what it carried in. */
const spentOf = (spent: number, had: number, carried: number, always = false) => `${spent} of ${had} spent${carried > 0 || always ? `, ${carried} carried in` : ""}`;

export function Editor({ buildId, name, visibility, initialPlan, initialLevel, converted, guide }: Props) {
  const d = useGameData();
  const [plan, setPlan] = useState(initialPlan);
  // Repeat last level (WO-56): the plan it made, what the level had before (for Undo) and what
  // didn't fit. Both show only until the next change.
  const [repeated, setRepeated] = useState<{ level: number; after: BuildPlan; before: ops.LevelSpend; skipped: string[] } | null>(null);
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const total = plan.levels.length;
  // The open level is always the one that holds its stretch's choices (WO-69): a skipped level opens its stretch.
  const [level, setLevelState] = useState(() => stretchAt(initialPlan, Math.min(total, Math.max(1, initialLevel || total))).to);
  const { status, error, retry } = useAutosave(buildId, plan, initialPlan);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // Skip ahead (WO-69): the level the footer's button goes to, chosen first; 10 levels on to start.
  const [skipTo, setSkipTo] = useState<number | null>(null);
  // Level notes as edited here, so going back to a level shows the latest text. Kept out of state
  // (WO-71): a keystroke in the notes must not redraw the whole editor. Only the set of levels with
  // notes (the ruler's marks, the Remove label) is state, and it changes only when a level gains or
  // loses its notes.
  const notes = useRef<Record<string, GuideDoc>>(guide);
  const [noted, setNoted] = useState(() => notedLevels(guide));
  const editNotes = (n: number, doc: GuideDoc) => {
    notes.current = { ...notes.current, [`level:${n}`]: doc };
    const has = notedLevels({ [`level:${n}`]: doc }).has(n);
    // Most keystrokes leave it as it was: no state update at all, so the editor isn't run again.
    if (noted.has(n) === has) return;
    setNoted((was) => {
      if (was.has(n) === has) return was;
      const next = new Set(was);
      if (has) next.add(n);
      else next.delete(n);
      return next;
    });
  };
  // Notes typed here before but never confirmed by the server (a closed tab, a lost connection).
  useEffect(() => saveKeptGuides(buildId), [buildId]);

  const { ref: levelBarRef, hold: holdLevelBar } = useHoldInPlace<HTMLElement>(level);
  // Changing level keeps the level bar where it is on screen; the buttons at the bottom of the
  // page go back to the top, since the next level starts there.
  // The open level's notes editor. Ended here, before React unmounts it on a new level (WO-74): left
  // live, Tiptap's unmount redraws its document twice just before throwing it away, the largest part
  // of a level change. (Its text is already saved, or saved by the autosave's own unmount.)
  const notesEditor = useRef<TiptapEditor | null>(null);
  const onNotesEditor = useCallback((e: TiptapEditor | null) => {
    notesEditor.current = e;
  }, []);
  const setLevel = useCallback(
    (n: number, max = total, toTop = false) => {
      const next = stretchAt(plan, Math.min(max, Math.max(1, n))).to;
      if (next !== level && notesEditor.current && !notesEditor.current.isDestroyed) notesEditor.current.destroy();
      if (!toTop) holdLevelBar();
      setLevelState(next);
      setConfirmRemove(false);
      setConfirmReset(false);
      const url = new URL(window.location.href);
      url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
      if (toTop) window.scrollTo({ top: 0 });
    },
    [total, holdLevelBar, plan, level],
  );

  // A tier perk's picker (WO-76): scrolled to, below the edit bar, with focus in its search. On
  // another level, once that level is open. Without a perk, the first picker with picks left.
  const pickFocus = useRef<{ perk: string | null } | null>(null);
  const [pickTick, setPickTick] = useState(0);
  const goToPicks = (perk: string | null, at = level) => {
    if (at !== level) setLevel(at);
    setSheetTree(null);
    pickFocus.current = { perk };
    setPickTick((n) => n + 1);
  };
  useEffect(() => {
    const want = pickFocus.current;
    pickFocus.current = null;
    if (!want) return;
    const box = want.perk ? document.querySelector<HTMLElement>(`[data-picks="${CSS.escape(want.perk)}"]`) : document.querySelector<HTMLElement>("[data-picks]");
    if (!box) return;
    const bar = document.querySelector<HTMLElement>("[data-edit-bar]")?.offsetHeight ?? 0;
    window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - bar - 16 });
    box.querySelector<HTMLElement>('input[type="search"]')?.focus({ preventScroll: true });
  }, [pickTick, level]);

  const s = states[level - 1];
  const lv = plan.levels[level - 1];
  // The open stretch (WO-69): `level` is its last level; a single level is a stretch of one.
  const st = stretchAt(plan, level);
  const ups = levelUps(st);
  const isStretch = st.from > 1 && st.from < st.to;
  const allStretches = stretches(plan);
  const skipping = skips(plan);
  const at = allStretches.findIndex((x) => x.to === st.to);
  const prevStretch = allStretches[at - 1];
  const nextStretch = allStretches[at + 1];
  /** The state before the stretch: what it carries in. */
  const before = st.from > 1 ? states[st.from - 2] : null;
  const stretchLabel = (n: number) => {
    const x = stretchAt(plan, n);
    return x.from < x.to ? `levels ${x.from} to ${x.to}` : `level ${x.to}`;
  };
  const [tree, setTree] = useState<string>(() => initialPlan.majors[0] ?? "One-Handed");
  const [treeView, setTreeView] = useState<TreeView>("tree");
  const [selected, setSelected] = useState<string | null>(null);
  // The perk's card opens beside its star, inside the tree's frame (WO-59); on a phone (under
  // 900 wide) the tree's own bottom sheet shows it.
  const [perkArea, setPerkArea] = useState<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(1440);
  const [windowHeight, setWindowHeight] = useState(800);
  useEffect(() => {
    const set = () => {
      setWindowWidth(window.innerWidth / pageZoom());
      setWindowHeight(window.innerHeight / pageZoom());
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  const wide = windowWidth >= 900;
  // A perk just taken (WO-59): the line at the top of the tree with Undo, until the next change or
  // 6 seconds; the pop and sparks at its star.
  const [taken, setTaken] = useState<{ id: string; before: BuildPlan; after: BuildPlan; key: number } | null>(null);
  const [burst, setBurst] = useState<{ x: number; y: number; key: number } | null>(null);
  useEffect(() => {
    if (!taken) return;
    const t = setTimeout(() => setTaken((x) => (x?.key === taken.key ? null : x)), 6000);
    return () => clearTimeout(t);
  }, [taken]);
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst((x) => (x?.key === burst.key ? null : x)), 800);
    return () => clearTimeout(t);
  }, [burst]);

  // The tree panel (WO-62): the window's height less the site header and the edit bar, less 24px
  // and the panel's own heading and legend; never under 520px, no maximum (WO-26).
  const [treeHeight, setTreeHeight] = useState(520);
  useEffect(() => {
    const set = () => {
      const bar = document.querySelector<HTMLElement>("[data-edit-bar]")?.offsetHeight ?? 0;
      const legend = 48;
      const head = 64;
      setTreeHeight(Math.max(520, Math.round(window.innerHeight / pageZoom() - bar - head - legend - 32)));
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  // On a phone a skill's perks open in a sheet from the bottom (WO-62).
  const [sheetTree, setSheetTree] = useState<string | null>(null);
  const openTree = (t: string, row?: HTMLElement) => {
    setTree(t);
    setSelected(null);
    if (!wide) {
      sheetReturn.current = row ?? null;
      setTreeView("list");
      setSheetTree(t);
    }
  };
  const sheetReturn = useRef<HTMLElement | null>(null);
  const pickPerk = (id: string) => setSelected(id);
  // Closing the card puts focus back on its star.
  const closeCard = () => {
    const id = selected;
    setSelected(null);
    if (id) requestAnimationFrame(() => perkArea?.querySelector<HTMLElement>(`[data-perk="${CSS.escape(id)}"]`)?.focus({ preventScroll: true }));
  };
  const takePerk = (pid: string) => {
    // A star whose prerequisites aren't held brings them too, at this level, when the skills reach them (WO-69).
    const next = ops.takePerks(plan, level, [...ops.missingPrerequisites(d, s, pid), pid]);
    setPlan(next);
    setSelected(null);
    const key = Date.now();
    setTaken({ id: pid, before: plan, after: next, key });
    // The star pops and sparks fly (none with reduced motion: the star just fills).
    const star = perkArea?.querySelector<HTMLElement>(`[data-perk="${CSS.escape(pid)}"]`);
    if (star && perkArea && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      star.animate([{ scale: 0.6 }, { scale: 1.25, offset: 0.6 }, { scale: 1 }], { duration: 300, easing: "ease-out" });
      const z = pageZoom();
      const a = perkArea.getBoundingClientRect();
      const b = star.getBoundingClientRect();
      setBurst({ x: (b.left + b.width / 2 - a.left) / z, y: (b.top + b.height / 2 - a.top) / z, key });
    }
    requestAnimationFrame(() => star?.focus({ preventScroll: true }));
  };
  const panel = (id: string | null, onCancel?: () => void) => (
    <PerkPanel
      onCancel={onCancel}
      plan={plan}
      states={states}
      level={level}
      selectedId={id}
      onTake={takePerk}
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
    () => states.filter((x) => x.level !== level).flatMap((x) => x.issues.map((i) => ({ level: x.level, message: i.message }))),
    [states, level],
  );
  const steps = useMemo(() => skillStepInfo(d, plan, states, level), [d, plan, states, level]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);
  const left = s.skillPointsAvailable - s.skillPointsSpent;
  // From level 3, when the level before spent anything. After a repeat, Undo until the next change.
  const prevLevel = plan.levels[level - 2];
  // Only from a single level to a single level (WO-69): a stretch's raises can't be repeated into one level.
  const prevSingle = level >= 3 && stretchAt(plan, level - 1).from === level - 1;
  const canRepeat = !isStretch && prevSingle && !!prevLevel && (!!prevLevel.attribute || Object.values(prevLevel.skillPoints).some((n) => n > 0));
  const justRepeated = !!repeated && repeated.level === level && repeated.after === plan;
  const carriedIn = s.skillPointsAvailable - d.rules.skillPointsPerLevel;
  const attrUsed = ATTRS.reduce((n, a) => n + (lv.attributes?.[a] ?? (lv.attribute === a ? 1 : 0)), 0);
  /** The most a skill's raise can be typed to here: the stretch's limit, the max skill and the points left (WO-69). */
  const raiseMax = (sk: string) => {
    const info = steps.find((i) => i.skill === sk)!;
    let budget = left;
    let v = info.to;
    let raise = info.added;
    while (raise < info.limit && v < s.maxSkill && d.skillPointCost(v) <= budget) {
      budget -= d.skillPointCost(v);
      v++;
      raise++;
    }
    return raise;
  };
  /**
   * The skill steppers: +1 or −1; Shift moves 5 at a time; Ctrl or ⌘ goes as far as the rules and
   * the points allow (or back to 0). Never past what `raiseMax` allows.
   */
  const step = (sk: string, by: 1 | -1, e: React.MouseEvent) => {
    const info = steps.find((i) => i.skill === sk)!;
    const far = e.metaKey || e.ctrlKey;
    const target = by > 0 ? (far ? raiseMax(sk) : Math.min(raiseMax(sk), info.added + (e.shiftKey ? 5 : 1))) : far ? 0 : Math.max(0, info.added - (e.shiftKey ? 5 : 1));
    setPlan(ops.setSkillRaise(plan, level, sk, target, info.limit));
  };
  // Perks that can't go with what's held at this level (WO-68, WO-69), with the reason.
  const ruled = (() => {
    const held = new Set([...Object.entries(s.perksTaken).filter(([, at]) => at.length > 0).map(([id]) => id), ...Object.keys(s.destinyTaken)]);
    const out = new Map<string, string>();
    for (const [id, r] of ruledOut(d, held)) {
      const by = d.perkById.get(r.by);
      out.set(id, `Not with ${by?.tree}: ${by?.name}, a perk you picked.${r.via !== id ? ` It needs ${d.perkById.get(r.via)?.name}, which that rules out.` : ""}`);
    }
    return out;
  })();
  const perkLeft = s.perkPoints - s.perkPointsSpent;
  // Free spell picks still to choose (WO-76): this level's tier perks, and the whole build's.
  const levelPicks = picksAt(d, plan, level);
  const toChooseHere = levelPicks.reduce((n, p) => n + p.left, 0);
  const toChoose = useMemo(() => spellsToChoose(d, plan), [d, plan]);
  const spellsWord = (n: number) => `${n} spell${n === 1 ? "" : "s"}`;
  const todoByLevel = useMemo(() => new Map(toChoose.levels.map((x) => [x.level, x.left])), [toChoose]);
  const destinyLeft = s.destinyPoints - s.destinyPointsSpent;
  // Trainer sessions: what is left of this level-up's own (unused ones carry over, but a running
  // total of 97 at level 20 reads as noise). Never more than the build has left overall.
  // A stretch allows them for each of its level-ups (WO-72): 6 to 10 has 25.
  const trainerLeft = Math.max(
    0,
    Math.min(d.rules.trainerSessionsPerLevel * Math.max(1, ups) - lv.extras.filter((x) => x.kind === "trainer").length, d.rules.trainerSessionsPerLevel * level - s.trainerSessionsUsed),
  );
  // Each trainer session and book, replayed from where this level's skill points left the skill.
  const extraSteps = (() => {
    const at: Record<string, number> = {};
    const perBook = plan.traits.includes("Skilled") ? 2 : 1;
    const start = (sk: string) => at[sk] ?? (s.skillsBefore[sk] ?? 0) + (lv.skillPoints[sk] ?? 0);
    return lv.extras.map((ex) => {
      // The Oghma Infinium (WO-44): +5 to each of its skills, up to 100.
      if (ex.kind === "oghma")
        return {
          from: 0,
          to: 0,
          oghma: ex.skills.map((sk) => {
            const from = start(sk);
            const to = Math.min(100, from + 5);
            at[sk] = to;
            return { skill: sk, gain: to - from, from, to };
          }),
        };
      const from = start(ex.skill);
      const to = ex.kind === "trainer" ? from + 1 : Math.min(s.maxSkill, from + perBook);
      at[ex.skill] = to;
      return { from, to, oghma: undefined };
    });
  })();
  const prevStone = level > 1 ? states[level - 2].stone : "";
  const oghmaLevel = plan.levels.findIndex((l) => l.extras.some((x) => x.kind === "oghma")) + 1;
  const prevDeity = level > 1 ? states[level - 2].deity : plan.deity;
  // The rules the planner applies (the engine's own numbers), for the labels' tooltips.
  const trainerRule = `+1 to a skill. ${d.rules.trainerSessionsPerLevel} sessions a level; unused ones carry over to later levels. A trainer can't raise a skill past the level's max skill.`;
  const bookRule = `+1 to a skill (+2 with the Skilled trait), never past the level's max skill.`;

  const summary = (() => {
    if (s.issues.length) return null;
    const notes: string[] = [];
    // The last level has nothing after it to carry them to (WO-72).
    if (level > 1 && left > 0) notes.push(`${left} skill point${left === 1 ? "" : "s"} ${level === total ? "unspent" : "will carry over"}.`);
    if (perkLeft > 0) notes.push(`${perkLeft} perk point${perkLeft === 1 ? "" : "s"} still unspent.`);
    if (destinyLeft > 0) notes.push(`${destinyLeft} Destiny point${destinyLeft === 1 ? "" : "s"} still unspent.`);
    return `${isStretch ? `Levels ${st.from} to ${st.to} follow` : `Level ${level} follows`} every rule.${notes.length ? " " + notes.join(" ") : ""}`;
  })();

  const continueLevel = () => {
    const next = ops.addLevel(plan);
    setPlan(next);
    setLevel(total + 1, total + 1, true);
  };
  // Continue and repeat (WO-57): add the next level and repeat this one onto it (WO-56), with its
  // didn't-fit line and Undo there. Shown when Repeat would show on the new level.
  const lastLevel = plan.levels[total - 1];
  const lastSingle = stretchAt(plan, total).from === total;
  const canContinueRepeat = total + 1 >= 3 && lastSingle && !!lastLevel && (!!lastLevel.attribute || Object.values(lastLevel.skillPoints).some((n) => n > 0));
  const continueRepeat = () => {
    const r = ops.repeatLevel(ops.addLevel(plan), total + 1, d);
    setPlan(r.plan);
    setRepeated({ level: total + 1, after: r.plan, before: r.before, skipped: r.skipped });
    setLevel(total + 1, total + 1, true);
  };
  const removeLevel = () => {
    if (!confirmRemove) return setConfirmRemove(true);
    const next = ops.removeLastStretch(plan);
    setPlan(next);
    setLevel(next.levels.length, next.levels.length);
  };
  // Reset (WO-69): the stretch's skill points, attribute picks, perks and Destiny, after a confirm.
  const resetLevel = () => {
    if (!confirmReset) return setConfirmReset(true);
    setPlan(ops.resetLevel(plan, level));
    setConfirmReset(false);
  };
  const skipTarget = Math.min(MAX_LEVELS, Math.max(total + 2, skipTo ?? total + 10));
  const skipAhead = () => {
    setPlan(ops.skipAhead(plan, skipTarget));
    setSkipTo(null);
    setLevel(skipTarget, skipTarget, true);
  };


  // A perk just taken (WO-59), with Undo; and a tier perk's free spells (WO-76). In the tree's frame,
  // and on a phone in the sheet.
  const takenLine = taken && taken.after === plan && (
    <div role="status" className={styles.takenLine}>
      <TakenMark />
      <span>
        <b>{d.perkById.get(taken.id)?.name ?? "Perk"}</b> taken. {perkLeft} perk point{perkLeft === 1 ? "" : "s"} left.
      </span>
      {/* A tier perk's free spells, said when it's taken (WO-76). */}
      {(levelPicks.find((p) => p.perk === taken.id)?.left ?? 0) > 0 && (
        <button type="button" className={`btn btn-sm ${styles.chooseSpells}`} onClick={() => goToPicks(taken.id)}>
          Choose {spellsWord(levelPicks.find((p) => p.perk === taken.id)!.left)}
        </button>
      )}
      <button
        type="button"
        className="btn btn-sm btn-quiet"
        onClick={() => {
          setPlan(taken.before);
          setTaken(null);
        }}
      >
        Undo
      </button>
    </div>
  );

  const saveLabel = status === "saved" ? "Saved" : status === "saving" ? "Saving…" : status === "unsaved" ? "Unsaved" : "Couldn't save";

  return (
    <>
      <EditBar
        buildId={buildId}
        name={name}
        current="levels"
        visibility={visibility}
        todo={
          toChoose.total > 0 && (
            // The whole build's free spell picks left (WO-76), each level a way there.
            <span className={styles.todoBar}>
              {spellsWord(toChoose.total)} to choose:{" "}
              {toChoose.levels.length > 1 ? "levels" : "level"}{" "}
              {toChoose.levels.map((x, i) => (
                <span key={x.level}>
                  {i > 0 && ", "}
                  <button type="button" className={styles.linkButton} onClick={() => goToPicks(null, x.level)}>
                    {x.level}
                  </button>
                </span>
              ))}
            </span>
          )
        }
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
            {/* The arrows step by stretch (WO-69). */}
            <button type="button" className={`btn ${styles.levelArrow}`} aria-label="Previous level" disabled={!prevStretch} onClick={() => prevStretch && setLevel(prevStretch.to)}>
              ‹ {prevStretch ? prevStretch.to : ""}
            </button>
            <div className={styles.levelTitle}>
              <span className="label">{level === 1 ? "Level" : isStretch ? `Levels ${st.from} to` : "Level up to"}</span>
              <span className={styles.levelNum}>{level}</span>
            </div>
            <button type="button" className={`btn ${styles.levelArrow}`} aria-label="Next level" disabled={!nextStretch} onClick={() => nextStretch && setLevel(nextStretch.to)}>
              {nextStretch ? nextStretch.to : ""} ›
            </button>
            {/* They act on the level shown, so they sit by its title; the footer keeps the ways forward (WO-73). */}
            {(level > 1 || (level === total && total > 1)) && (
              <span className={styles.levelActions}>
                {/* Reset (WO-69): this stretch's skill points, attribute picks, perks and Destiny; gear, spells and the note stay. */}
                {level > 1 && (
                  <button type="button" className="btn btn-sm btn-quiet" onClick={resetLevel}>
                    {confirmReset ? `Confirm: reset ${stretchLabel(level)}` : `Reset ${stretchLabel(level)}`}
                  </button>
                )}
                {level === total && total > 1 && (
                  <button type="button" className="btn btn-sm btn-quiet" onClick={removeLevel}>
                    {confirmRemove ? `Confirm: remove ${stretchLabel(total)}${noted.has(total) ? " and its notes" : ""}` : `Remove ${stretchLabel(total)}`}
                  </button>
                )}
              </span>
            )}
          </div>
          <dl className={styles.pools} data-tour="points">
            {/* A stretch counts its whole run (WO-69): spent of what it had, and what it carried in. */}
            {level > 1 && (
              <Pool label="Skill points" value={left} of={`left of ${s.skillPointsAvailable}`} detail={isStretch && before ? spentOf(s.skillPointsSpent, s.skillPointsAvailable, before.skillPointsBanked, true) : undefined} />
            )}
            {/* Flashes ember once when a perk is taken (WO-59). */}
            <Pool
              label="Perk points"
              icon={<MarkIcon name="perk-points" />}
              value={perkLeft}
              of="to spend"
              detail={isStretch && before ? spentOf(s.perkPointsSpent - before.perkPointsSpent, s.perkPoints - before.perkPointsSpent, before.perkPoints - before.perkPointsSpent) : undefined}
              flashKey={taken && taken.after === plan ? taken.key : undefined}
            />
            <Pool
              label="Destiny points"
              value={destinyLeft}
              of=""
              // No breakdown when the stretch had none to spend, earned or carried in (WO-72): just 0.
              detail={isStretch && before && s.destinyPoints - before.destinyPointsSpent > 0 ? spentOf(s.destinyPointsSpent - before.destinyPointsSpent, s.destinyPoints - before.destinyPointsSpent, before.destinyPoints - before.destinyPointsSpent) : undefined}
              destiny
            />
            <Pool label="Trainer sessions" value={trainerLeft} of={isStretch ? "left in these levels" : "left this level"} />
            {/* Free spell picks left here (WO-76): a to-do, not a problem. Goes to the first picker with picks left. */}
            {toChooseHere > 0 && (
              <div className={`${styles.pool} ${styles.poolTodo}`}>
                <dt className={`label ${styles.poolLabel}`}>Spells</dt>
                <dd className={styles.poolVal}>
                  <button type="button" className={styles.todoButton} aria-label={`${spellsWord(toChooseHere)} to choose`} onClick={() => goToPicks(null)}>
                    <span className={`big-num ${styles.poolNum}`}>{toChooseHere}</span>
                    <span className={styles.hint}>to choose</span>
                  </button>
                </dd>
              </div>
            )}
          </dl>
          {/* The same ruler and row as the build page; a build that skips ahead has a cell per stretch (WO-69). */}
          {total > 1 && (
            <div className={styles.levelRow}>
              <LevelBars marks={marks} level={level} onChange={(n) => setLevel(n)} spans={skipping ? allStretches : undefined} spellsToChoose={todoByLevel} />
            </div>
          )}
          {problems.length > 0 && (
            <div role="region" aria-label="Problems in this build" className={styles.problemBar}>
              {problems.map((pr, i) => (
                <p key={i} className={styles.problemLine}>
                  <i className={styles.diamondBad} />
                  <span>
                    <b>{cap(stretchLabel(pr.level))}:</b> {pr.message}
                  </span>
                  <button type="button" className={styles.linkButton} onClick={() => setLevel(pr.level)}>
                    Go to {stretchLabel(pr.level)}
                  </button>
                </p>
              ))}
            </div>
          )}
        </section>

        <div className={styles.columns} data-tour="skills-tree">
          <section aria-label="Attribute and skills" className={styles.left}>
            {level > 1 && (
              <div className={styles.block}>
                <div className={styles.blockHead}>
                  <span className="label">{isStretch ? "Attributes" : "Attribute"}</span>
                  <span className={styles.hint}>{isStretch ? `${ups} level-ups${ups - attrUsed ? `, ${ups - attrUsed} left` : ""}` : "+5 to one"}</span>
                  {justRepeated ? (
                    <button
                      type="button"
                      className={`btn btn-sm ${styles.repeatBtn}`}
                      onClick={() => {
                        setPlan(ops.restoreLevelSpend(plan, level, repeated!.before));
                        setRepeated(null);
                      }}
                    >
                      Undo
                    </button>
                  ) : (
                    canRepeat && (
                      <button
                        type="button"
                        className={`btn btn-sm ${styles.repeatBtn}`}
                        onClick={() => {
                          const r = ops.repeatLevel(plan, level, d);
                          setPlan(r.plan);
                          setRepeated({ level, after: r.plan, before: r.before, skipped: r.skipped });
                        }}
                      >
                        Repeat level {level - 1}
                      </button>
                    )
                  )}
                </div>
                {isStretch ? (
                  // A stretch (WO-69): each attribute's total, what the stretch adds, and its level-ups.
                  <div role="group" aria-label="Attributes" className={styles.attrs}>
                    {ATTRS.map((a) => {
                      const n = lv.attributes?.[a] ?? (lv.attribute === a ? 1 : 0);
                      return (
                        <div key={a} className={`${styles.attr} ${styles.attrCount} ${styles[a]} ${n ? styles.attrOn : ""}`}>
                          <span className={styles.attrTop}>
                            <IconLabel icon={<AttributeIcon name={a} />}>{ATTRIBUTE_NAMES[a]}</IconLabel>
                          </span>
                          <span className={styles.attrVal}>
                            <span className="big-num">{s[a]}</span>
                          </span>
                          <span className={styles.attrStepper}>
                            <button type="button" aria-label={`Fewer ${ATTRIBUTE_NAMES[a]} level-ups`} disabled={n <= 0} onClick={() => setPlan(ops.setAttributeCount(plan, level, a, n - 1))}>
                              −
                            </button>
                            <b aria-label={`${ATTRIBUTE_NAMES[a]} level-ups`}>{n}</b>
                            <button type="button" aria-label={`More ${ATTRIBUTE_NAMES[a]} level-ups`} disabled={attrUsed >= ups} onClick={() => setPlan(ops.setAttributeCount(plan, level, a, n + 1))}>
                              +
                            </button>
                          </span>
                          {stoneShare(d, s.stone, a) && <span className={styles.attrNote}>{stoneShare(d, s.stone, a)}</span>}
                          <span className={styles.attrBar} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
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
                )}
              </div>
            )}

            <div className={styles.block}>
              <div className={styles.blockHead}>
                <span className="label">{level === 1 ? "Starting skills and perks" : "Skills and perks"}</span>
                <span className={styles.maxSkill}>
                  {level === 1 ? (
                    `Max skill ${s.maxSkill} at level 1`
                  ) : (
                    <>
                      {/* A phone says just the max skill (canvas: EditorStickyPhone, WO-74). */}
                      <span className={styles.wideOnly}>{`Up to +${d.rules.maxRaisePerSkillPerLevel * Math.max(1, ups)} each, max skill ${s.maxSkill}`}</span>
                      <span className={styles.phoneOnly}>{`Max skill ${s.maxSkill}`}</span>
                    </>
                  )}
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
                  {!isStretch && carriedIn > 0 && <span className={styles.hint}>Includes {carriedIn} carried in from level {level - 1}</span>}
                  {justRepeated && repeated!.skipped.length > 0 && (
                    <span className={styles.hint} role="status">
                      {repeated!.skipped.join(" ")}
                    </span>
                  )}
                </>
              )}
              {d.skillGroups.map((g) => (
                <div key={g.group} className={styles.skillGroup}>
                  <span className={`sub-label ${styles.skillGroupName}`}>{g.group}</span>
                  {g.skills.map((sk) => {
                    const info = steps.find((i) => i.skill === sk)!;
                    const active = tree === sk;
                    return (
                      // Anywhere on the row picks its tree, except the stepper; the name stays the keyboard's button.
                      <div
                        key={sk}
                        className={`${styles.skillRow} ${styles.skillRowPick} ${active ? styles.skillRowOn : ""}`}
                        onClick={(e) => {
                          const t = e.target as HTMLElement;
                          if (t.closest("button, [data-stepper]")) return;
                          openTree(sk, e.currentTarget.querySelector<HTMLElement>("button") ?? undefined);
                        }}
                      >
                        {/* The name opens its tree (WO-62): the list is the editor's one tree picker. */}
                        <button type="button" className={styles.skillName} onClick={(e) => openTree(sk, e.currentTarget)} aria-pressed={active} aria-label={sk}>
                          <SkillIcon name={sk} /> {sk}
                          {heldCount(d, sk, s) > 0 && (
                            <span className={styles.heldCount} aria-hidden="true">
                              {heldCount(d, sk, s)}
                            </span>
                          )}
                        </button>
                        <span className={`num ${styles.skillVals}`}>
                          {info.added > 0 ? (
                            <>
                              <span className={`muted ${styles.skillFrom}`}>{info.from} → </span>
                              <span className={styles.skillTo}>{info.to}</span>
                            </>
                          ) : (
                            <span>{info.from}</span>
                          )}
                        </span>
                        {level > 1 ? (
                          <>
                            <Tooltip
                              content={
                                info.atMax
                                  ? `${sk} is at the max skill for this level.`
                                  : info.atFive
                                    ? isStretch
                                      ? `+${info.limit} reached: the most one skill can rise in ${ups} level-ups.`
                                      : "+5 reached: the most one skill can rise in a level-up."
                                    : `${info.nextCost} skill point${info.nextCost === 1 ? "" : "s"} for the next +1.`
                              }
                            >
                              <span className={styles.stepper} data-stepper="">
                                <button type="button" aria-label={`Lower ${sk}`} disabled={!info.canRemove} onClick={(e) => step(sk, -1, e)}>
                                  −
                                </button>
                                {/* On a stretch the raise can be typed (WO-69), kept within what the rules allow. */}
                                {isStretch ? (
                                  <RaiseField
                                    key={`${level}-${sk}-${info.added}`}
                                    skill={sk}
                                    value={info.added}
                                    onCommit={(n) => setPlan(ops.setSkillRaise(plan, level, sk, Math.min(n, raiseMax(sk)), info.limit))}
                                  />
                                ) : (
                                  <span className={info.added ? styles.stepOn : styles.stepOff}>{info.added ? `+${info.added}` : "0"}</span>
                                )}
                                <button type="button" aria-label={`Raise ${sk}`} disabled={!info.canAdd} onClick={(e) => step(sk, 1, e)}>
                                  +
                                </button>
                              </span>
                            </Tooltip>
                            <span className={styles.next}>
                              {info.atMax ? "at max" : info.atFive ? `+${info.limit} reached` : `${info.nextCost} pt${info.nextCost === 1 ? "" : "s"} next`}
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
              {/* Destiny, the last row, in gold: it opens the constellation in the tree panel. */}
              <div
                className={`${styles.skillRow} ${styles.skillRowPick} ${styles.destinyRow} ${tree === "Destiny" ? styles.skillRowOn : ""}`}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  openTree("Destiny", e.currentTarget.querySelector<HTMLElement>("button") ?? undefined);
                }}
              >
                <button type="button" className={styles.skillName} onClick={(e) => openTree("Destiny", e.currentTarget)} aria-pressed={tree === "Destiny"} aria-label="Destiny">
                  <i className={styles.destinyDiamond} aria-hidden="true" /> Destiny
                  {destinyLeft > 0 && <span className={styles.destinyLeft}>{destinyLeft} left</span>}
                </button>
              </div>
            </div>
          </section>

          <section aria-label="Perks" className={styles.right}>
            {/* The open tree, pinned under the edit bar while the list scrolls (WO-62). */}
            <div ref={setPerkArea} className={`frame ${styles.treeBox} ${tree === "Destiny" ? styles.treeBoxDestiny : ""}`}>
              <Tree
                tree={tree}
                states={states}
                level={level}
                selectedId={selected}
                onSelect={pickPerk}
                details={(id) => panel(id)}
                view={treeView}
                onView={setTreeView}
                height={treeHeight}
                sheetBelow={0}
                ruled={ruled}
                openLabel={isStretch ? `Can take by level ${level}` : undefined}
                heading={<TreeHeading tree={tree} value={tree === "Destiny" ? `${destinyLeft} left` : `${s.skills[tree] ?? ""}`} />}
              />
              {/* Beside the star that was clicked, inside the frame (WO-59); a sheet on phones. */}
              {wide && selected && perkArea && (
                <PerkCard box={perkArea} perkId={selected} onClose={closeCard}>
                  {panel(selected, closeCard)}
                </PerkCard>
              )}
              {takenLine}
              {burst && (
                <span key={burst.key} className={styles.burst} style={{ left: burst.x, top: burst.y }} aria-hidden="true">
                  {SPARKS.map(([dx, dy], i) => (
                    <i key={i} style={{ ["--dx" as string]: `${dx}px`, ["--dy" as string]: `${dy}px` }} />
                  ))}
                </span>
              )}
            </div>
          </section>
        </div>

        {/* On a phone, a skill's perks in a sheet from the bottom, opening on List (WO-62). */}
        {!wide && sheetTree && (
          <BottomSheet
            label={`${sheetTree} perks`}
            tall
            onClose={() => {
              setSheetTree(null);
              setSelected(null);
              const row = sheetReturn.current;
              requestAnimationFrame(() => row?.focus({ preventScroll: true }));
            }}
          >
            <div className={styles.sheetHead}>
              <TreeHeading tree={sheetTree} value={sheetTree === "Destiny" ? `${destinyLeft} left` : `${s.skills[sheetTree] ?? ""}`} />
            </div>
            {takenLine && <div className={styles.sheetTaken}>{takenLine}</div>}
            <ViewToggle view={treeView} onView={setTreeView} className={styles.sheetToggle} />
            {selected && <div className={styles.sheetPerk}>{panel(selected, () => setSelected(null))}</div>}
            <Tree tree={sheetTree} states={states} level={level} selectedId={selected} onSelect={pickPerk} view={treeView} onView={setTreeView} noToggle sheetBelow={0} ruled={ruled} openLabel={isStretch ? `Can take by level ${level}` : undefined} listBy="state" height={Math.max(300, Math.round(windowHeight * 0.85 - 250))} />
          </BottomSheet>
        )}

        {/* A tier perk taken here gives its free spells: pick them under it (WO-42). */}
        <SpellPicks key={`picks-${level}`} plan={plan} level={level} setPlan={setPlan} />



        <section aria-label="Also at this level" className={styles.also}>
          <div className={styles.alsoCol}>
            <span className="label">Between level-ups</span>
            {lv.extras.length > 0 && (
              <ul className={styles.extras}>
                {lv.extras.map((ex, i) =>
                  ex.kind === "oghma" ? (
                    <li key={i}>
                      <span className={styles.extraRow}>
                        <span className={styles.extraKind}>
                          <OghmaLabel />
                        </span>
                        <span className={styles.oghmaGains}>
                          <SkillGains rows={extraSteps[i].oghma ?? []} />
                          <span className="ember">+3 perk points</span>
                        </span>
                      </span>
                      <button type="button" className={styles.x} aria-label="Remove the Oghma Infinium" onClick={() => setPlan(ops.removeExtra(plan, level, i))}>
                        ×
                      </button>
                    </li>
                  ) : (
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
                  ),
                )}
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
            {/* The Oghma Infinium (WO-44): read once, so offered until the build has it. */}
            {!oghmaLevel && <OghmaForm skills={d.skills} onAdd={(skills) => setPlan(ops.addExtra(plan, level, { kind: "oghma", skills }))} />}
            {oghmaLevel > 0 && oghmaLevel !== level && <span className={styles.hint}>Oghma Infinium: read at level {oghmaLevel}.</span>}
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

        <GearBlock key={level} plan={plan} level={level} state={s} setPlan={setPlan} />
        <SpellBlock key={`spells-${level}`} plan={plan} level={level} setPlan={setPlan} />
        <AbilityBlock key={`abilities-${level}`} plan={plan} level={level} setPlan={setPlan} />
        <ShoutBlock key={`shouts-${level}`} plan={plan} level={level} setPlan={setPlan} />

        <GuideFactsProvider plan={plan} states={states}>
          <LevelNotes
            key={level}
            buildId={buildId}
            level={level}
            from={st.from}
            notes={notes}
            onEditor={onNotesEditor}
            onChange={(doc) => {
              editNotes(level, doc);
              // The level's old plain-text note now lives in the notes; clear it from the plan too.
              if (lv.note) setPlan(ops.setNote(plan, level, ""));
            }}
          />
        </GuideFactsProvider>

        {/* The author's first-time tour (WO-61), on level 1 of a build just made. */}
        {level === 1 && <Tour kind="author" script={AUTHOR_TOUR} />}
        <div className={styles.bottomBar} data-tour="footer">
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
            {level === total ? (
              <>
                {canContinueRepeat && (
                  <button type="button" className="btn" onClick={continueRepeat}>
                    Continue and repeat
                  </button>
                )}
                {total + 2 <= MAX_LEVELS && (
                  // Skip ahead (WO-69): the target is chosen first, then the button goes there.
                  <span className={styles.skipAhead} role="group" aria-label="Skip ahead">
                    <button type="button" className={`btn ${styles.skipStep}`} aria-label="Skip ahead to an earlier level" disabled={skipTarget <= total + 2} onClick={() => setSkipTo(skipTarget - 1)}>
                      ‹
                    </button>
                    <button type="button" className="btn" onClick={skipAhead}>
                      Skip ahead to level {skipTarget}
                    </button>
                    <button type="button" className={`btn ${styles.skipStep}`} aria-label="Skip ahead to a later level" disabled={skipTarget >= MAX_LEVELS} onClick={() => setSkipTo(skipTarget + 1)}>
                      ›
                    </button>
                  </span>
                )}
                {total < MAX_LEVELS && (
                  <button type="button" className="btn btn-primary" onClick={continueLevel}>
                    Continue to level {total + 1}
                  </button>
                )}
              </>
            ) : (
              <button type="button" className="btn btn-primary" onClick={() => nextStretch && setLevel(nextStretch.to, total, true)}>
                Go to {nextStretch ? stretchLabel(nextStretch.to) : ""}
              </button>
            )}
          </span>
        </div>

      </div>
    </>
  );
}

/** A pool of points. On a stretch (WO-69), `detail` ("510 of 625 spent, 175 carried in") is its tooltip, and read out. */
function Pool({ label, icon, value, of, destiny, flashKey, detail }: { label: string; icon?: React.ReactNode; value: number; of: string; destiny?: boolean; flashKey?: number; detail?: string }) {
  const hint = of ? <span className={styles.hint}>{of}</span> : null;
  return (
    <div className={`${styles.pool} ${destiny ? styles.poolDestiny : ""}`}>
      <dt className={`label ${styles.poolLabel}`}>{icon ? <IconLabel icon={icon}>{label}</IconLabel> : label}</dt>
      <dd key={flashKey ?? "still"} className={`${styles.poolVal} ${flashKey ? styles.poolFlash : ""}`}>
        {/* On a stretch the breakdown is the hint's tooltip, or the number's when there's no hint. */}
        {detail && !hint ? (
          <Tooltip content={detail}>
            <span tabIndex={0} className={styles.poolDetail}>
              <span className={`big-num ${styles.poolNum} ${value < 0 ? "bad" : ""}`}>{value}</span>
              <span className="sr-only">: {detail}</span>
            </span>
          </Tooltip>
        ) : (
          <span className={`big-num ${styles.poolNum} ${value < 0 ? "bad" : ""}`}>{value}</span>
        )}
        {detail && hint ? (
          <Tooltip content={detail}>
            <span tabIndex={0} className={styles.poolDetail}>
              {hint}
              <span className="sr-only">: {detail}</span>
            </span>
          </Tooltip>
        ) : (
          hint
        )}
      </dd>
    </div>
  );
}

/** The level's notes: the guide editor, compact (H3 the only heading). */
function LevelNotes({
  buildId,
  level,
  from,
  notes,
  onChange,
  onEditor,
}: {
  buildId: string;
  level: number;
  /** Where the open stretch starts: "About levels 6 to 10" (WO-72, WO-78). */
  from: number;
  notes: React.RefObject<Record<string, GuideDoc>>;
  onChange: (doc: GuideDoc) => void;
  onEditor: (editor: TiptapEditor | null) => void;
}) {
  // The latest text for this level, read once as the level opens (the editor keeps it from there).
  const [initial] = useState(() => notes.current[`level:${level}`] ?? emptyDoc());
  const [save, setSave] = useState<{ status: GuideSaveStatus; error: string | null }>({ status: "idle", error: null });
  const onStatus = useCallback((status: GuideSaveStatus, error: string | null) => setSave({ status, error }), []);
  const label = guideSaveLabel(save.status, save.error);
  // The heading says "this level"; the region and the text box keep the numbers (WO-78).
  const title = from < level ? `About levels ${from} to ${level}` : `About level ${level}`;
  return (
    <section aria-label={title} className={styles.levelNotes} data-tour="note">
      <div className={styles.blockHead}>
        <span className="label">{from < level ? "About this level range" : "About this level"}</span>
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
        label={title}
        headingLevels={[3]}
        compact
        onStatus={onStatus}
        onChange={onChange}
        onEditor={onEditor}
      />
    </section>
  );
}

/** "Oghma Infinium" with what it is on hover and keyboard focus (WO-57). */
function OghmaLabel() {
  return (
    <Tooltip content="Septimus Signus' reward in LoreRim. Read once: six skills of your choice go up 5, up to 100, and Hermaeus Mora gives 3 perk points.">
      <span tabIndex={0} className={styles.oghmaLabel}>
        <IconLabel icon={<MarkIcon name="skill-book" />}>Oghma Infinium</IconLabel>
      </span>
    </Tooltip>
  );
}

/**
 * The Oghma Infinium (WO-44): six different skills, picked as chips ("3 of 6 chosen"); each gets
 * +5, up to 100, and the level 3 perk points.
 */
function OghmaForm({ skills, onAdd }: { skills: string[]; onAdd: (skills: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  if (!open)
    return (
      <div role="group" aria-label="Oghma Infinium" className={styles.extraForm}>
        <span className={styles.extraKind}>
          <OghmaLabel />
        </span>
        <button type="button" className="btn btn-sm" onClick={() => setOpen(true)}>
          Add
        </button>
      </div>
    );
  const toggle = (sk: string) => setChosen((c) => (c.includes(sk) ? c.filter((x) => x !== sk) : c.length < 6 ? [...c, sk] : c));
  return (
    <div role="group" aria-label="Oghma Infinium" className={styles.oghmaForm}>
      <span className={styles.extraKind}>
        <OghmaLabel />
      </span>
      <span className={chosen.length ? "ember" : "muted"}>{chosen.length} of 6 chosen</span>
      <span className={styles.oghmaChips}>
        {skills.map((sk) => (
          <button key={sk} type="button" className={styles.oghmaChip} aria-pressed={chosen.includes(sk)} disabled={!chosen.includes(sk) && chosen.length >= 6} onClick={() => toggle(sk)}>
            <IconLabel icon={<SkillIcon name={sk} />}>{sk}</IconLabel>
          </button>
        ))}
      </span>
      <span className={styles.oghmaActions}>
        <button type="button" className="btn btn-sm btn-primary" disabled={chosen.length !== 6} onClick={() => onAdd(chosen)}>
          Add
        </button>
        <button type="button" className="btn btn-sm btn-quiet" onClick={() => (setOpen(false), setChosen([]))}>
          Cancel
        </button>
      </span>
    </div>
  );
}

/** The eight sparks of a taken perk (WO-59): 4px brass squares that fly out about 30px. */
const SPARKS: [number, number][] = [
  [-28, -10],
  [28, -10],
  [-20, 22],
  [20, 22],
  [0, -30],
  [-34, 8],
  [34, 8],
  [0, 30],
];

/** A small pixel check for the "taken" line. */
function TakenMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path d="M2 8h2v2h2v2h2v-2h2v-2h2v-2h2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2z" fill="currentColor" />
    </svg>
  );
}

const CARD_WIDTH = 340;
const CARD_GAP = 16;

/**
 * The perk's card beside its star, inside the tree's frame (WO-59): to the star's right with a
 * small pointer; to the left near the right edge; above near the bottom. It follows the star while
 * the tree pans or zooms. Esc closes it; focus goes to its first action when it opens.
 */
function PerkCard({ box, perkId, onClose, children }: { box: HTMLElement; perkId: string; onClose: () => void; children: React.ReactNode }) {
  const card = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; side: "left" | "right"; above: boolean; pointer: number; max: number } | null>(null);
  useLayoutEffect(() => {
    let frame = 0;
    let last = "";
    const place = () => {
      frame = requestAnimationFrame(place);
      const star = box.querySelector<HTMLElement>(`[data-perk="${CSS.escape(perkId)}"]`);
      const el = card.current;
      if (!star || !el) return;
      const z = pageZoom();
      const a = box.getBoundingClientRect();
      // A List view row (WO-72) runs the panel's width: the card goes beside its name and requirement.
      const texts = [...star.querySelectorAll<HTMLElement>("[data-row-text]")].map((t) => {
        // The text's own extent (the span may be a block as wide as the row).
        const range = document.createRange();
        range.selectNodeContents(t);
        return range.getBoundingClientRect();
      });
      const r = star.getBoundingClientRect();
      const b = texts.length ? { left: r.left, top: r.top, width: Math.max(...texts.map((t) => t.right)) - r.left, height: r.height } : r;
      const w = a.width / z;
      const h = a.height / z;
      // (h is the frame's height; the card also keeps to the part of it in the window.)
      const sx = (b.left - a.left) / z;
      const sy = (b.top - a.top) / z;
      const sw = b.width / z;
      const sh = b.height / z;
      const lo = Math.max(8, -a.top / z + 8);
      const hi = Math.min(h, (window.innerHeight - a.top) / z) - 8;
      const max = Math.max(160, hi - lo);
      const ch = Math.min(el.scrollHeight, max);
      let side: "left" | "right" = "right";
      let left = sx + sw + CARD_GAP;
      if (left + CARD_WIDTH > w - 8) {
        side = "left";
        left = sx - CARD_GAP - CARD_WIDTH;
      }
      left = Math.max(8, Math.min(left, w - CARD_WIDTH - 8));
      // Within the frame, and within the part of it on screen, so it never needs a scroll.
      let top = sy + sh / 2 - 40;
      const above = top + ch > hi && sy - ch - CARD_GAP >= lo;
      if (above) top = sy - ch - CARD_GAP;
      top = Math.max(lo, Math.min(top, hi - ch));
      const pointer = Math.max(14, Math.min(sy + sh / 2 - top, ch - 14));
      const key = `${Math.round(left)}|${Math.round(top)}|${side}|${above}|${Math.round(pointer)}|${Math.round(max)}`;
      if (key !== last) {
        last = key;
        setPos({ left, top, side, above, pointer, max });
      }
    };
    place();
    return () => cancelAnimationFrame(frame);
  }, [box, perkId]);
  // Focus moves to the card's first action once it's placed.
  const placed = !!pos;
  useLayoutEffect(() => {
    if (placed) card.current?.querySelector<HTMLElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  }, [placed, perkId]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      ref={card}
      role="dialog"
      aria-label="Perk details"
      className={`${styles.perkCard} ${pos?.side === "left" ? styles.perkCardLeft : ""} ${pos?.above ? styles.perkCardAbove : ""}`}
      style={pos ? { left: pos.left, top: pos.top, maxHeight: pos.max, ["--pointer" as string]: `${pos.pointer}px` } : { visibility: "hidden" }}
    >
      {children}
    </div>
  );
}

/** The open tree's icon, name and skill value (or Destiny points left), heading its panel or sheet (WO-62). */
function TreeHeading({ tree, value }: { tree: string; value: string }) {
  return (
    <>
      {tree === "Destiny" ? <i className={styles.destinyDiamond} aria-hidden="true" /> : <SkillIcon name={tree} size={32} />}
      <h2 className={styles.treeTitle}>{tree}</h2>
      <span className="muted">{value}</span>
    </>
  );
}

/** A stretch's raise, typed (WO-69): committed on Enter or leaving the field, kept within the rules by the editor. */
function RaiseField({ skill, value, onCommit }: { skill: string; value: number; onCommit: (n: number) => void }) {
  const [text, setText] = useState(String(value));
  const commit = () => {
    const n = Math.max(0, Math.round(Number(text.replace(/^\+/, ""))) || 0);
    if (n !== value) onCommit(n);
    else setText(String(value));
  };
  return (
    <input
      className={styles.raiseField}
      inputMode="numeric"
      aria-label={`${skill} raise`}
      value={text === "0" ? "0" : text.startsWith("+") ? text : `+${text}`}
      onChange={(e) => setText(e.target.value.replace(/^\+/, ""))}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
    />
  );
}
