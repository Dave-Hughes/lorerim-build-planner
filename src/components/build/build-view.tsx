"use client";

import Link from "next/link";
import { Tooltip } from "@/components/ui/tooltip";
import { LikeButton } from "./like-button";
import { TAG_BY_SLUG } from "@/lib/builds/tags";
import { AuthorLink } from "@/components/ui/author-link";
import { traitWithChoice } from "@/lib/rules/trait-choices";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { copyBuild, copyBuildForVersion } from "@/lib/builds/actions";
import type { BuildRecord } from "@/lib/builds/types";
import { useGameData } from "@/components/game-data";
import { GuideFactsProvider, GuideMention } from "@/components/guide/guide-facts";
import { SkillGains, type SkillGain } from "./skill-gains";
import { GuideSection } from "@/components/guide/guide-section";
import { LevelNote } from "@/components/guide/level-note";
import { docWords, firstParagraph, isEmptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import { GuideView } from "@/components/guide/guide-view";
import { currentVersion, isOlderThanCurrent } from "@/lib/rules/versions";
import { ATTRIBUTE_NAMES, levelChanges, levelFacts, levelMarks, perksByLevel, stoneShare, type PerkListGroup } from "@/lib/rules/derive";
import { gearAt, gearChangeText } from "@/lib/rules/gear";
import { heldCount } from "@/lib/rules/tree-states";
import type { GameData } from "@/lib/rules/data";
import type { LevelState } from "@/lib/rules/types";
import { computeBuild } from "@/lib/rules/engine";
import { Avatar } from "@/components/ui/avatar";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, IconLabel, RaceIcon, SignIcon, SkillIcon, SkillLabel } from "@/components/ui/skill-icon";
import { LevelBars, LevelLegend, LevelStepper, useHoldInPlace } from "./level-nav";
import { BottomSheet, PerkDetails, Tree, ViewToggle, type TreeView } from "./tree";
import styles from "./build-view.module.css";

export type BuildViewData = Omit<BuildRecord, "createdAt" | "updatedAt"> & { updatedAt: string };

interface Props {
  build: BuildViewData;
  updatedLabel: string;
  isOwner: boolean;
  signedIn: boolean;
  initialLevel: number;
  /** Rendered when a visitor who isn't signed in wants to copy the build. */
  signInToCopy: React.ReactNode;
  /** Shown in place of Like when signed out: signs in, then back to the build. */
  signInToLike?: React.ReactNode;
  /** The tab to open on (`?tab=`). */
  initialTab?: BuildTab;
  /** True when the visitor signed in from "Copy to my builds"; the copy runs on load. */
  autoCopy?: boolean;
  /** The build's guide sections by key: `overview`, and `level:<n>` for level notes. */
  guide?: Record<string, GuideDoc>;
}

export type BuildTab = "levels" | "guide";

/**
 * The tree and perk picked in the Perks section. A selected perk stays selected across levels (its
 * status line follows the level); a tree picked without a perk is for its level only.
 */
type Picked = { level: number; tree: string; star: string | null } | null;

const ATTR_ORDER = ["health", "magicka", "stamina"] as const;

/** Whether the window is narrower than `px` (false on the server and before hydration). */
function useNarrower(px: number): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(`(max-width: ${px - 1}px)`);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(`(max-width: ${px - 1}px)`).matches,
    () => false,
  );
}

/**
 * The shared build page. Top to bottom: the hero; the intro; the about bar; then tabs (Levels,
 * Guide). Levels is for someone playing the build who has just levelled up: the level
 * navigation, then the level card (what to do, in the order the game asks, with the author's
 * note), then the reference (attributes, skills, perks).
 */
export function BuildView({ build, updatedLabel, isOwner, signedIn, initialLevel, initialTab = "levels", signInToCopy, signInToLike, autoCopy, guide = {} }: Props) {
  const d = useGameData();
  const noted = useMemo(() => notedLevels(guide), [guide]);
  const { plan } = build;
  const total = plan.levels.length;
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);

  // Tabs: one with nothing in it isn't shown; with only Levels there's no tab row.
  const overview = guide.overview && !isEmptyDoc(guide.overview) ? guide.overview : null;
  const tabs: BuildTab[] = ["levels", ...(overview ? (["guide"] as const) : [])];
  const [tabState, setTabState] = useState<BuildTab>(initialTab);
  const tab = tabs.includes(tabState) ? tabState : "levels";
  const setUrl = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
  };
  const setTab = (t: BuildTab) => {
    setTabState(t);
    setUrl("tab", t === "levels" ? null : t);
  };

  const [level, setLevelState] = useState(() => Math.min(total, Math.max(1, initialLevel)));
  // Changing level keeps the level row where it is on screen.
  const { ref: levelBarRef, hold: holdLevelBar } = useHoldInPlace<HTMLElement>(level);
  const setLevel = useCallback(
    (n: number) => {
      const next = Math.min(total, Math.max(1, n));
      holdLevelBar();
      setLevelState(next);
      const url = new URL(window.location.href);
      if (next === 1) url.searchParams.delete("level");
      else url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
    },
    [total, holdLevelBar],
  );

  // Left and right step through levels on the Levels tab (not inside a field or a tab row).
  useEffect(() => {
    if (tab !== "levels") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable || t.closest('[role="tablist"]'))) return;
      if (e.key === "ArrowLeft") setLevel(level - 1);
      if (e.key === "ArrowRight") setLevel(level + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, setLevel, tab]);

  const noSign = plan.traits.includes("Master of Destiny");
  const identity: [string, React.ReactNode][] = [
    ["Race", plan.race ? <IconLabel icon={<RaceIcon name={plan.race} />}>{plan.race}</IconLabel> : plan.race],
    [
      "Birthsign",
      noSign ? "None (Master of Destiny)" : plan.birthsign ? <IconLabel icon={<SignIcon name={plan.birthsign} />}>The {plan.birthsign}</IconLabel> : "Not chosen yet",
    ],
    ["Traits", plan.traits.length ? plan.traits.map((t) => traitWithChoice(t, plan.traitChoices)).join(", ") : "None"],
    ...(plan.masterOfOneSkill ? [["Master of One", plan.masterOfOneSkill] as [string, React.ReactNode]] : []),
    ["Game mode", plan.mode],
    ["Start", plan.start || "Not chosen yet"],
    ["Deity", plan.deity || "Not chosen yet"],
  ];

  // The intro, else the guide's first paragraph, else nothing.
  const intro = guide.intro && !isEmptyDoc(guide.intro) ? guide.intro : firstParagraph(overview);
  const TAB_NAMES: Record<BuildTab, string> = { levels: "Levels", guide: "Guide" };
  // Each tab's second line: what's in it.
  const minutes = overview ? Math.max(1, Math.ceil(docWords(overview) / 200)) : 0;
  const TAB_SUB: Record<BuildTab, string> = {
    levels: `Levels 1 to ${total}`,
    guide: `${minutes} min read`,
  };

  const [picked, setPicked] = useState<Picked>(null);

  // The pinned bar: once the tab row (or, with no tabs, the level navigation) scrolls off the top,
  // a slim bar on Levels holds the level stepper and what the level changed.
  const [tabRow, setTabRow] = useState<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = tabRow ?? levelBarRef.current;
      setPinned(!!el && el.getBoundingClientRect().bottom < 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [tabRow, levelBarRef, tab]);
  const tabRefs = useRef<Partial<Record<BuildTab, HTMLButtonElement | null>>>({});
  const onTabKey = (e: React.KeyboardEvent) => {
    const i = tabs.indexOf(tab);
    const next = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
    if (!next) return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <GuideFactsProvider plan={plan} states={states}>
      <main className={styles.main}>
        <Cover build={build} updatedLabel={updatedLabel} isOwner={isOwner} signedIn={signedIn} signInToCopy={signInToCopy} signInToLike={signInToLike} autoCopy={!!autoCopy} />

        <div className={`page ${styles.body}`}>
          <OldVersionNotice buildId={build.id} signedIn={signedIn} />
          {intro && (
            <section aria-label="Intro" className={styles.intro}>
              <GuideView doc={intro} idPrefix="intro" />
              {overview && (
                <button type="button" className={styles.linkButton} onClick={() => setTab("guide")}>
                  Read the full guide
                </button>
              )}
            </section>
          )}
          <section aria-label="Character" className={styles.identity}>
            {identity.map(([l, v]) => (
              <div key={l} className={styles.identityItem}>
                <span className="label">{l}</span>
                <span className={styles.identityValue}>{v}</span>
              </div>
            ))}
          </section>

          {tabs.length > 1 && (
            <div ref={setTabRow} role="tablist" aria-label="Build sections" className={styles.tabs} onKeyDown={onTabKey}>
              {tabs.map((t) => (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[t] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls={`panel-${t}`}
                  tabIndex={tab === t ? 0 : -1}
                  className={styles.tab}
                  onClick={() => setTab(t)}
                >
                  <span className={styles.tabName}>{TAB_NAMES[t]}</span>
                  <span className={styles.tabSub}>{TAB_SUB[t]}</span>
                </button>
              ))}
            </div>
          )}
          {pinned && tab === "levels" && (
            <div className={styles.pinnedBar} role="region" aria-label="Pinned bar">
              <div className={`page ${styles.pinnedInner}`}>
                <LevelStepper level={level} total={total} onChange={setLevel} slim />
                <LevelSummary
                  key={level}
                  d={d}
                  plan={plan}
                  states={states}
                  level={level}
                  noted={noted.has(level)}
                  onPerk={(id) => {
                    const p = d.perkById.get(id);
                    // Selects it in the Perks section, without scrolling the page.
                    if (p) setPicked({ level, tree: p.tree, star: id });
                  }}
                />
              </div>
            </div>
          )}

          {tab === "levels" && (
            <div id="panel-levels" role={tabs.length > 1 ? "tabpanel" : undefined} aria-labelledby={tabs.length > 1 ? "tab-levels" : undefined} className={styles.panelStack}>
              <LevelsTab
                build={build}
                states={states}
                marks={marks}
                level={level}
                setLevel={setLevel}
                levelBarRef={levelBarRef}
                note={noted.has(level) ? guide[`level:${level}`] : null}
                picked={picked}
                setPicked={setPicked}
              />
            </div>
          )}
          {tab === "guide" && overview && (
            <div id="panel-guide" role="tabpanel" aria-labelledby="tab-guide">
              <GuideSection buildId={build.id} doc={overview} full />
            </div>
          )}
        </div>
      </main>
    </GuideFactsProvider>
  );
}

/** What each slot holds at this level, after Skills; items set at this level in ember. */
function GearAt({ plan, level }: { plan: BuildViewData["plan"]; level: number }) {
  const held = gearAt(plan, level);
  return (
    <section aria-label={`Gear at level ${level}`} className={styles.gearAt}>
      <span className="label">Gear at level {level}</span>
      {held.length ? (
        <dl className={styles.gearList}>
          {held.map((g, i) => (
            <div key={i} className={styles.gearRow}>
              <dt>{g.slot}</dt>
              <dd className={g.since === level ? styles.gearNow : undefined}>{g.itemId ? <GuideMention kind="item" id={g.itemId} label={g.name} /> : g.name}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="muted">Nothing yet.</p>
      )}
    </section>
  );
}

/** The Levels tab: navigation, the level card, then where the build stands. */
function LevelsTab({
  build,
  states,
  marks,
  level,
  setLevel,
  levelBarRef,
  note,
  picked,
  setPicked,
}: {
  build: BuildViewData;
  states: LevelState[];
  marks: ReturnType<typeof levelMarks>;
  level: number;
  setLevel: (n: number) => void;
  levelBarRef: React.RefObject<HTMLElement | null>;
  note: GuideDoc | null;
  /** The perk picked in the Perks section (held by the page, so the pinned bar can pick one too). */
  picked: Picked;
  setPicked: React.Dispatch<React.SetStateAction<Picked>>;
}) {
  const d = useGameData();
  const { plan } = build;
  const total = plan.levels.length;
  const s = states[level - 1];
  const perks = useMemo(() => perksByLevel(d, plan, states, level), [d, plan, states, level]);


  // Perks: the tree picked for this level (by the player, a card link or the held list), else
  // the tree of this level's first perk, else the first major.
  const lv = plan.levels[level - 1];
  const firstPerk = lv.perks[0] ?? lv.destiny[0];
  const defaultTree = firstPerk ? (d.perkById.get(firstPerk)?.tree ?? plan.majors[0]) : (plan.majors[0] ?? d.skills[0]);
  const tree = picked && (picked.star || picked.level === level) ? picked.tree : defaultTree;
  const selected = picked?.star ?? null;
  const narrow = useNarrower(1100);
  const [viewChoice, setViewChoice] = useState<TreeView | null>(null);
  const view: TreeView = viewChoice ?? (narrow ? "list" : "tree");
  const perksRef = useRef<HTMLElement>(null);
  // Under 1100px a perk picked from the card or the held list opens in the bottom sheet.
  const [sheet, setSheet] = useState<string | null>(null);
  const showPerk = (id: string, scroll: boolean) => {
    const p = d.perkById.get(id);
    if (!p) return;
    setPicked({ level, tree: p.tree, star: id });
    if (narrow) setSheet(id);
    else if (scroll) perksRef.current?.scrollIntoView({ block: "start" });
  };
  const clearPick = useCallback(() => setPicked((p) => (p ? { ...p, star: null, level } : p)), [level, setPicked]);
  useEffect(() => {
    if (!selected || narrow) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && clearPick();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, narrow, clearPick]);

  return (
    <>
      <section ref={levelBarRef} aria-label="Level" className={styles.levelSection}>
        <div className={styles.levelHead}>
          <LevelStepper level={level} total={total} onChange={setLevel} />
          <LevelLegend />
        </div>
        <LevelBars marks={marks} level={level} onChange={setLevel} />
      </section>

      <LevelCard d={d} build={build} states={states} level={level} note={note} onPerk={(id) => showPerk(id, true)} />

      <div className={styles.reference}>
        <AttributesAt s={s} level={level} />
        <SkillsAt d={d} plan={plan} s={s} level={level} />
        {plan.gear.length > 0 && <GearAt plan={plan} level={level} />}
      </div>

      <section ref={perksRef} id="perks" data-tree-anchor="" aria-label={`Perks at level ${level}`} className={styles.perksSection}>
        <div className={styles.sectionHead}>
          <span className="label">Perks at level {level}</span>
          {narrow && <ViewToggle view={view} onView={setViewChoice} />}
        </div>
        {/* Phones in List view show the held list alone; the chips go with the tree. */}
        {(!narrow || view === "tree") && <PerkChips d={d} perks={perks} s={s} active={tree} onChange={(t) => setPicked({ level, tree: t, star: null })} />}
        <div className={styles.perksBody}>
          {(!narrow || view === "tree") && (
            <div className={`frame ${styles.treeBox}`}>
              <Tree tree={tree} states={states} level={level} selectedId={selected} onSelect={(id) => setPicked({ level, tree, star: id })} view="tree" noToggle sheetBelow={1100} />
            </div>
          )}
          {(!narrow || view === "list") && (
            <div className={styles.side}>
              {/* What the selected perk does, above the held list (wide screens; phones use the sheet). */}
              {!narrow && selected && <PerkDetails id={selected} states={states} level={level} onClose={clearPick} />}
              <HeldList perks={perks} s={s} level={level} onPick={(id) => showPerk(id, false)} />
            </div>
          )}
        </div>
        {narrow && sheet && (
          <BottomSheet label={d.perkById.get(sheet)?.name ?? "Perk"} onClose={() => setSheet(null)}>
            <PerkDetails id={sheet} states={states} level={level} />
          </BottomSheet>
        )}
      </section>
    </>
  );
}

/** One chip per tree the build holds perks in, plus Destiny; the rest in a menu. */
function PerkChips({ d, perks, s, active, onChange }: { d: GameData; perks: PerkListGroup[]; s: LevelState; active: string; onChange: (tree: string) => void }) {
  const [open, setOpen] = useState(false);
  const shown = [...perks.map((g) => g.tree).filter((t) => t !== "Destiny"), "Destiny"];
  if (!shown.includes(active)) shown.splice(shown.length - 1, 0, active);
  const others = d.skills.filter((t) => !shown.includes(t));
  // On phones the chips are one sideways row: keep the current one in view, moving the row only.
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current;
    const chip = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !chip || el.scrollWidth <= el.clientWidth) return;
    const left = chip.offsetLeft - el.offsetLeft;
    if (left < el.scrollLeft || left + chip.offsetWidth > el.scrollLeft + el.clientWidth) el.scrollTo({ left: left - (el.clientWidth - chip.offsetWidth) / 2 });
  }, [active]);
  return (
    <div className={styles.chipsRow}>
      <div ref={row} role="tablist" aria-label="Perk trees" className={styles.chips}>
        {shown.map((t) => {
          const n = heldCount(d, t, s);
          return (
            <button key={t} type="button" role="tab" aria-selected={active === t} className={styles.chip} onClick={() => onChange(t)}>
              <SkillIcon name={t} /> {t} {n > 0 && <span className={styles.chipCount}>{n}</span>}
            </button>
          );
        })}
      </div>
      {others.length > 0 && (
        <span className={styles.othersWrap}>
          <button type="button" className={styles.others} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
            Other trees ▾
          </button>
          {open && (
            <span role="menu" aria-label="Other trees" className={styles.othersMenu}>
              {others.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="menuitem"
                  className={styles.othersItem}
                  onClick={() => {
                    setOpen(false);
                    onChange(t);
                  }}
                >
                  <SkillIcon name={t} /> {t}
                </button>
              ))}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/** The perks held by this level, grouped by tree; this level's in ember. Each opens its star. */
function HeldList({ perks, s, level, onPick }: { perks: PerkListGroup[]; s: LevelState; level: number; onPick: (id: string) => void }) {
  return (
    <section aria-label={`Taken by level ${level}`} className={styles.held}>
      <span className={`sub-label ${styles.heldHead}`}>Taken by level {level}</span>
      {perks.length === 0 && <p className="muted">None yet.</p>}
      {perks.map((g) => (
        <div key={g.tree} className={styles.perkGroup}>
          <SkillLabel name={g.tree} className="muted" />
          <span className={styles.perkNames}>
            {g.perks.length === 0 && s.grantedTree === g.tree && <span className="soft">Every perk (Master of One)</span>}
            {g.perks.map((p, i) => (
              <button key={`${p.id}-${i}`} type="button" className={`${styles.perk} ${p.level === level ? styles.perkNow : ""}`} onClick={() => onPick(p.id)}>
                {p.name}
                {p.rank ? ` ${p.rank}` : ""}
                {p.book ? " (book)" : ""}
                <span className="tag tag-sm num">Lv {p.level}</span>
              </button>
            ))}
          </span>
        </div>
      ))}
    </section>
  );
}

function AttributesAt({ s, level }: { s: LevelState; level: number }) {
  const d = useGameData();
  const scale = Math.max(300, s.health, s.magicka, s.stamina);
  const perkLeft = s.perkPoints - s.perkPointsSpent;
  const destinyLeft = s.destinyPoints - s.destinyPointsSpent;
  return (
    <section aria-label={`Attributes at level ${level}`} className={styles.colStats}>
      <span className="label">Attributes at level {level}</span>
      {ATTR_ORDER.map((a) => (
        <div key={a} className={styles.attr}>
          <div className={styles.attrHead}>
            <span>
              <IconLabel icon={<AttributeIcon name={a} size={24} />}>{ATTRIBUTE_NAMES[a]}</IconLabel>
            </span>
            <span className={styles.attrNum}>{s[a]}</span>
          </div>
          <div className={styles.bar}>
            <div className={`${styles.barFill} ${styles[a]}`} style={{ width: `${(s[a] / scale) * 100}%` }} />
          </div>
          {stoneShare(d, s.stone, a) && <span className={styles.attrNote}>{stoneShare(d, s.stone, a)}</span>}
        </div>
      ))}
      <dl className={styles.stats}>
        <dt>Carry weight</dt>
        <dd>{s.carryWeight}</dd>
        <dt>Skill points carried over</dt>
        <dd>{level === 1 ? "0" : s.skillPointsBanked}</dd>
        {perkLeft > 0 && (
          <>
            <dt>Perk points left</dt>
            <dd>{perkLeft}</dd>
          </>
        )}
        {destinyLeft > 0 && (
          <>
            <dt>Destiny points left</dt>
            <dd>{destinyLeft}</dd>
          </>
        )}
      </dl>
    </section>
  );
}

function SkillsAt({ d, plan, s, level }: { d: GameData; plan: BuildViewData["plan"]; s: LevelState; level: number }) {
  const [all, setAll] = useState(false);
  const row = (sk: string) => {
    const v = s.skills[sk];
    const gain = v - s.skillsBefore[sk];
    return (
      <div key={sk} className={styles.skillRow}>
        <SkillLabel name={sk} />
        <span className={styles.skillVal}>{v}</span>
        <div className={styles.bar3}>
          <div className={`${styles.barFill} ${gain > 0 ? styles.barChanged : styles.barPlain}`} style={{ width: `${Math.min(100, v)}%` }} />
        </div>
        <span className={styles.skillDelta}>{gain > 0 ? `+${gain}` : ""}</span>
      </div>
    );
  };
  return (
    <section aria-label={`Skills at level ${level}`} className={styles.colSkills}>
      <div className={styles.sectionHead}>
        <span className={styles.skillsTitle}>
          <span className="label">Skills at level {level}</span>
          <InfoTip label="About the skill limit" text={`No skill can go above 50 plus your character level: ${s.maxSkill} at level ${level}. Skills can reach 100 from level 50.`} />
        </span>
        <button type="button" className={styles.linkButton} aria-expanded={all} onClick={() => setAll((a) => !a)}>
          {all ? "Majors and minors" : `All ${d.skills.length} skills`}
        </button>
      </div>
      {all ? (
        <div className={styles.skillCols}>
          {d.skillGroups.map((g) => (
            <div key={g.group} className={styles.group}>
              <span className={`sub-label ${styles.groupName}`}>{g.group}</span>
              {g.skills.map(row)}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.skillCols}>
          <div className={styles.group}>
            <span className={`sub-label ${styles.groupName}`}>Majors</span>
            {plan.majors.map(row)}
          </div>
          <div className={styles.group}>
            <span className={`sub-label ${styles.groupName}`}>Minors</span>
            {plan.minors.map(row)}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * The pinned bar's one-line summary of a level, in the card's order: the attribute, the skills raised
 * (points, trainers, books), the perks (each a button that selects it in the Perks section), the
 * stone and the gear when they change, and a note mark. Each chip's tooltip is the card's line. When
 * the chips don't fit, the skills lose their names first, then the gear goes, then the stone; perks stay.
 */
function LevelSummary({ d, plan, states, level, noted, onPerk }: { d: GameData; plan: BuildViewData["plan"]; states: LevelState[]; level: number; noted: boolean; onPerk: (id: string) => void }) {
  const f = levelFacts(d, plan, states, level);
  // Every skill this level raised, by points, trainers or books, biggest gain first.
  // Each skill's tooltip: the card's rows for it, under their labels (Skill points, Trainer, Skill book).
  const gains = new Map<string, { n: number; lines: { label: string; row: SkillGain }[] }>();
  const add = (sk: string, label: string, x: { n: number; from: number; to: number }) => {
    const g = gains.get(sk) ?? { n: 0, lines: [] };
    g.n += x.n;
    g.lines.push({ label, row: { skill: sk, gain: x.n, from: x.from, to: x.to } });
    gains.set(sk, g);
  };
  for (const x of f.raised) add(x.sk, "Skill points", x);
  for (const [sk, x] of f.extras.trainer) add(sk, "Trainer", x);
  for (const [sk, x] of f.extras.book) add(sk, "Skill book", x);
  const tip = (lines: { label: string; row: SkillGain }[]) => (
    <span className={styles.gainTip}>
      {lines.map((l, i) => (
        <span key={i} className={styles.gainTipLine}>
          <span className={styles.gainTipLabel}>{l.label}</span>
          <SkillGains rows={[l.row]} />
        </span>
      ))}
    </span>
  );
  const skills = [...gains].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]));
  // How much to fold away: 0 all, 1 skills without their names, 2 also no gear, 3 also no stone. Hidden
  // copies of the row at each fold are measured against the room there is, on every resize.
  const [fold, setFold] = useState(0);
  // Still cut off with everything folded: the row ends with "…".
  const [cut, setCut] = useState(false);
  const row = useRef<HTMLSpanElement>(null);
  const measures = useRef<(HTMLSpanElement | null)[]>([]);
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const check = () => {
      const room = el.clientWidth;
      const widths = measures.current.map((m) => m?.scrollWidth ?? 0);
      const f = widths.findIndex((w) => w <= room + 1);
      setFold(f === -1 ? 3 : f);
      setCut(f === -1);
    };
    const id = requestAnimationFrame(check);
    const ro = new ResizeObserver(() => requestAnimationFrame(check));
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [level]);
  const perkList = [...f.perks, ...f.destiny.map((p) => ({ ...p, tree: "Destiny", rank: undefined, book: undefined }))];
  // The chips at a fold. `plain` draws them without tooltips or buttons, for measuring.
  const chips = (at: number, plain: boolean) => {
    const chip = (key: string, tip: React.ReactNode, body: React.ReactNode, className = "") =>
      plain ? (
        <span key={key} className={`${styles.sumChip} ${className}`}>
          {body}
        </span>
      ) : (
        <Tooltip key={key} content={tip}>
          <span className={`${styles.sumChip} ${className}`} tabIndex={0}>
            {body}
          </span>
        </Tooltip>
      );
    return (
      <>
        {/* The attribute in its own colour, so it never reads as one more skill. */}
        {f.attribute &&
          chip(
            "attr",
            `+5 ${ATTRIBUTE_NAMES[f.attribute]}`,
            <IconLabel icon={<AttributeIcon name={f.attribute} />}>
              +5<span className={styles.sumAttrName}> {ATTRIBUTE_NAMES[f.attribute]}</span>
            </IconLabel>,
            `${styles.sumAttr} ${styles[`sumAttr_${f.attribute}`]} ${styles.sumKeep}`,
          )}
        {/* Every skill raised, named until there's no room for the names. */}
        {skills.map(([sk, g]) =>
          chip(sk, tip(g.lines), <IconLabel icon={<SkillIcon name={sk} />}>{at === 0 ? `${sk} +${g.n}` : `+${g.n}`}</IconLabel>, styles.sumWide),
        )}
        {/* Perks: ember, and each a button that selects it in the Perks section. */}
        {perkList.map((p, i) => {
          const body = (
            <IconLabel icon={<SkillIcon name={p.tree} />}>
              {p.name}
              {p.rank ? ` ${p.rank}` : ""}
            </IconLabel>
          );
          return plain ? (
            <span key={`${p.id}-${i}`} className={`${styles.sumChip} ${styles.sumPerk} ${styles.sumKeep}`}>
              {body}
            </span>
          ) : (
            <Tooltip key={`${p.id}-${i}`} content={`Perk: ${p.name}${p.rank ? ` ${p.rank}` : ""}${p.tree !== p.name ? ` (${p.tree}${p.book ? ", book" : ""})` : ""}`}>
              <button type="button" className={`${styles.sumChip} ${styles.sumPerk} ${styles.sumKeep}`} onClick={() => onPerk(p.id)}>
                {body}
              </button>
            </Tooltip>
          );
        })}
        {at < 3 &&
          f.stone &&
          chip(
            "stone",
            `${f.stone.name === "none" ? "No stone" : `The ${f.stone.name}`}${f.stone.prev ? ` (in place of The ${f.stone.prev})` : ""}`,
            f.stone.name === "none" ? "No stone" : <IconLabel icon={<SignIcon name={f.stone.name} />}>The {f.stone.name}</IconLabel>,
            styles.sumWide,
          )}
        {at < 2 && f.gear.map((g, i) => chip(`gear-${i}`, gearChangeText(g), g.name.trim() || gearChangeText(g), styles.sumWide))}
        {noted && chip("note", "The author left a note for this level", <i className={styles.sumNote} aria-label="Note" />, styles.sumWide)}
      </>
    );
  };
  return (
    <span ref={row} className={`${styles.summary} ${cut ? styles.summaryCut : ""}`} aria-label={`What level ${level} changed`}>
      {chips(fold, false)}
      {[0, 1, 2, 3].map((at) => (
        <span
          key={at}
          ref={(el) => {
            measures.current[at] = el;
          }}
          className={styles.sumMeasure}
          aria-hidden="true"
        >
          {chips(at, true)}
        </span>
      ))}
    </span>
  );
}

/**
 * The level card: what to do at this level, in the order the game asks (attribute, skill points,
 * perks, stone, trainers, books), with the author's note beside it.
 */
function LevelCard({ d, build, states, level, note, onPerk }: { d: GameData; build: BuildViewData; states: LevelState[]; level: number; note: GuideDoc | null; onPerk: (id: string) => void }) {
  const { plan } = build;
  const s = states[level - 1];
  const changes = levelChanges(d, plan, states, level);
  const rows: [string, React.ReactNode][] = [];
  // The rule behind a row, from the engine's own numbers (WO-17's wording in the editor).
  const tips: Record<string, string> = {
    Banked: "Skill points not spent at a level carry over to the next level-up.",
    Trainer: `${d.rules.trainerSessionsPerLevel} trainer sessions a level, +1 to a skill each; unused ones carry over to later levels. A trainer can't raise a skill past the level's max skill.`,
    "Skill book": `+1 to a skill (+2 with the Skilled trait), never past the level's max skill.`,
    "Skill books": `+1 to a skill each (+2 with the Skilled trait), never past the level's max skill.`,
    "Standing stone": "One stone at a time: choosing a new one replaces the old. Its bonus counts from that level on.",
  };

  const facts = levelFacts(d, plan, states, level);
  if (facts.attribute)
    rows.push([
      "Attribute",
      <IconLabel key="a" icon={<AttributeIcon name={facts.attribute} size={24} />}>+5 {ATTRIBUTE_NAMES[facts.attribute]}</IconLabel>,
    ]);

  // Skill points: biggest gain first; the level's limit said once, on the first skill that hit it.
  const { raised, capAt } = facts;
  if (raised.length)
    rows.push([
      "Skill points",
      <SkillGains
        key="s"
        rows={raised.map((r, i) => ({
          skill: r.sk,
          gain: r.n,
          from: r.from,
          to: r.to,
          note: i === capAt ? `(max skill ${s.maxSkill} at level ${level})` : undefined,
        }))}
      />,
    ]);

  const perkLines = [
    ...changes.perks.map((p, i) => (
      <span key={`${p.id}-${i}`}>
        <button type="button" className={styles.perkLink} onClick={() => onPerk(p.id)}>
          {p.name}
          {p.rank ? ` ${p.rank}` : ""}
        </button>{" "}
        <span className="muted">{p.tree !== p.name ? `(${p.tree}${p.book ? ", book" : ""})` : p.book ? "(book)" : ""}</span>
      </span>
    )),
    ...changes.destiny.map((p) => (
      <span key={p.id}>
        <button type="button" className={styles.perkLink} onClick={() => onPerk(p.id)}>
          {p.name}
        </button>
        {p.name !== "Destiny" && <span className="muted"> (Destiny)</span>}
      </span>
    )),
  ];
  if (perkLines.length)
    rows.push([
      perkLines.length > 1 ? "Perks" : "Perk",
      <span key="p" className={styles.stack}>
        {perkLines}
      </span>,
    ]);

  // The stone, when it changes: "The Lover (in place of The Warrior)".
  if (facts.stone)
    rows.push([
      "Standing stone",
      <span key="st">
        {facts.stone.name === "none" ? "No stone" : `The ${facts.stone.name}`}
        {facts.stone.prev && <span className="muted"> (in place of The {facts.stone.prev})</span>}
      </span>,
    ]);

  const extraLines = facts.extras;
  for (const kind of ["trainer", "book"] as const) {
    const m = extraLines[kind];
    if (!m.size) continue;
    rows.push([
      kind === "trainer" ? "Trainer" : m.size > 1 ? "Skill books" : "Skill book",
      <SkillGains key={kind} rows={[...m].map(([sk, l]) => ({ skill: sk, gain: l.n, from: l.from, to: l.to }))} />,
    ]);
  }
  // Gear, when something changes: "Steel spear (Main hand)", "Off hand emptied".
  if (facts.gear.length)
    rows.push([
      "Gear",
      <span key="g" className={styles.stack}>
        {facts.gear.map((g, i) => (
          <span key={i}>
            {g.itemId && g.name.trim() ? (
              <>
                <GuideMention kind="item" id={g.itemId} label={g.name.trim()} /> ({g.slot})
              </>
            ) : (
              gearChangeText(g)
            )}
            {g.note && <span className="muted"> {g.note}</span>}
          </span>
        ))}
      </span>,
    ]);
  if (changes.banked > 0) rows.push(["Banked", `${changes.banked} skill point${changes.banked === 1 ? "" : "s"}`]);

  return (
    <section aria-label={`Level ${level}`} className={`frame ${styles.card} ${styles.cardWithNote}`}>
      <div className={styles.cardMain}>
        <h2 className={styles.cardTitle}>Level {level}</h2>
        {rows.length ? (
          <div className={styles.changes}>
            {rows.map(([k, v]) => (
              <div key={k} className={styles.changeRow}>
                {tips[k] ? (
                  <Tooltip content={tips[k]}>
                    <span className={`${styles.changeKey} ${styles.ruleTip}`} tabIndex={0}>
                      {k}
                    </span>
                  </Tooltip>
                ) : (
                  <span className={styles.changeKey}>{k}</span>
                )}
                <span>{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">{level === 1 ? "No starting perks yet." : "Nothing yet."}</p>
        )}
        {s.issues.length > 0 && (
          <ul className={styles.issues} aria-label="Problems at this level">
            {s.issues.map((i, n) => (
              <li key={n}>{i.message}</li>
            ))}
          </ul>
        )}
      </div>
      {/* The author's column is always there: their name first, then the note (or that there isn't one). */}
      <aside aria-label="Author's note" className={styles.note}>
        <AuthorLink author={build.author} className={styles.noteBy} avatar={<Avatar name={build.author.name} image={build.author.image} size={24} />} />
        {note ? <LevelNote key={level} doc={note} level={level} /> : <p className={`muted ${styles.noNote}`}>No note for level {level}.</p>}
      </aside>
    </section>
  );
}

/** For a build made for an older LoreRim version: says so, and offers a converted copy. */
function OldVersionNotice({ buildId, signedIn }: { buildId: string; signedIn: boolean }) {
  const d = useGameData();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if (!isOlderThanCurrent(d.version.id)) return null;
  const current = currentVersion();
  const copy = () =>
    start(async () => {
      const r = await copyBuildForVersion(buildId);
      if (!r.ok) return setError(r.error);
      const q = new URLSearchParams({ from: d.version.id });
      if (r.value.dropped) q.set("dropped", r.value.dropped);
      router.push(`/b/${r.value.id}/edit?${q}`);
    });
  return (
    <section aria-label="LoreRim version" className={styles.versionNotice}>
      <p>
        Made for {d.version.label}. The current version is {current.id}.
      </p>
      {signedIn && (
        <button type="button" className="btn btn-sm" onClick={copy} disabled={pending}>
          {pending ? "Copying…" : `Copy for ${current.id}`}
        </button>
      )}
      {error && <span className="field-error">{error}</span>}
    </section>
  );
}

function Cover({
  build,
  updatedLabel,
  isOwner,
  signedIn,
  signInToCopy,
  signInToLike,
  autoCopy,
}: {
  build: BuildViewData;
  updatedLabel: string;
  isOwner: boolean;
  signedIn: boolean;
  signInToCopy: React.ReactNode;
  signInToLike?: React.ReactNode;
  autoCopy: boolean;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("?")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy. The link is in the address bar.");
    }
  };
  const copyToMine = useCallback(
    () =>
      start(async () => {
        const r = await copyBuild(build.id);
        if (r.ok) router.push(`/b/${r.value.id}/edit`);
        else setError(r.error);
      }),
    [build.id, router],
  );
  useEffect(() => {
    if (autoCopy && signedIn && !isOwner) {
      const url = new URL(window.location.href);
      url.searchParams.delete("copy");
      window.history.replaceState(null, "", url);
      copyToMine();
    }
    // Runs once on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const writeup = build.writeupUrl;
  const writeupLabel = writeup && /discord\.(com|gg)/i.test(writeup) ? "Read the write-up on Discord" : "Read the write-up";

  return (
    <section aria-label="Build" className={`${styles.cover} ${build.coverImageUrl ? "" : styles.coverPlain}`} style={
        build.coverImageUrl
          ? { backgroundImage: `url("${build.coverImageUrl}")`, backgroundPosition: build.plan.coverFocus ? `${build.plan.coverFocus.x}% ${build.plan.coverFocus.y}%` : undefined }
          : undefined
      }>
      <div className={styles.coverFade} />
      <div className={`page ${styles.coverInner}`}>
        <div className={styles.coverText}>
          <h1 className={`title ${styles.h1}`}>{build.name}</h1>
          {build.description && <p className={`flavor ${styles.description}`}>{build.description}</p>}
          <div className={styles.byline}>
            <AuthorLink author={build.author} className={styles.author} nameClassName={styles.authorName} avatar={<Avatar name={build.author.name} image={build.author.image} />} />
            {!build.isSample && <LikeButton buildId={build.id} liked={build.likedByViewer} count={build.likeCount} mode={isOwner ? "owner" : signedIn ? "can" : "signedOut"} signIn={signInToLike} />}
            <span className="tag">LoreRim {build.gameVersion}</span>
            {/* One unit, so a wrap never leaves the bar dangling at a line's end. */}
            <span className={styles.dates}>
              <span>Planned to level {build.plan.levels.length}</span>
              <span className={styles.pipe} aria-hidden="true">
                |
              </span>
              <span>Updated {updatedLabel}</span>
            </span>
          </div>
          {build.tags.length > 0 && (
            <ul className={styles.tagLine} aria-label="Tags">
              {build.tags.map((t) => (
                <li key={t}>
                  <Link href={`/?tags=${t}`} className={styles.tagLink}>
                    {TAG_BY_SLUG.get(t)?.name ?? t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className="btn" onClick={copyLink}>
            {copied ? "Copied" : "Copy link"}
          </button>
          {writeup && (
            <a className="btn" href={writeup} target="_blank" rel="noopener noreferrer">
              {writeupLabel}
            </a>
          )}
          {isOwner ? (
            <Link className="btn btn-primary" href={`/b/${build.id}/edit`}>
              Edit build
            </Link>
          ) : signedIn ? (
            <button type="button" className="btn btn-primary" onClick={copyToMine} disabled={pending}>
              {pending ? "Copying…" : "Copy to my builds"}
            </button>
          ) : (
            signInToCopy
          )}
          {error && <span className={`field-error ${styles.actionError}`}>{error}</span>}
        </div>
      </div>
    </section>
  );
}
