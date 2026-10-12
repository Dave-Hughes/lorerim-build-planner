"use client";

import Link from "next/link";
import { Tooltip } from "@/components/ui/tooltip";
import { LikeButton } from "./like-button";
import { TAG_BY_SLUG } from "@/lib/builds/tags";
import { AuthorLink } from "@/components/ui/author-link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { copyBuild, copyBuildForVersion, setFeatured } from "@/lib/builds/actions";
import type { BuildRecord } from "@/lib/builds/types";
import { useGameData } from "@/components/game-data";
import { GuideFactsProvider } from "@/components/guide/guide-facts";
import { SkillGains, type SkillGain } from "./skill-gains";
import { EditBar, MenuButton } from "@/components/editor/edit-bar";
import menuStyles from "@/components/editor/edit-bar.module.css";
import { PlayMark } from "./play-mark";
import { spellsAt, spellsLearned } from "@/lib/rules/spells";
import { SpellView } from "./spell-view";
import { VideoGuide } from "./video-guide";
import { ReportBuild } from "./report-build";
import { AboutBar } from "./about-bar";
import { GearView, MadeMark } from "./gear-view";
import { ContentsRail, type RailItem } from "./contents-rail";
import { guideHeadings } from "@/components/guide/guide-view";
import { LocalDate } from "@/components/ui/local-date";
import { GuideSection } from "@/components/guide/guide-section";
import { LevelNote } from "@/components/guide/level-note";
import { docWords, firstParagraph, isEmptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import { GuideView } from "@/components/guide/guide-view";
import { currentVersion, isOlderThanCurrent } from "@/lib/rules/versions";
import { ATTRIBUTE_NAMES, levelChanges, levelFacts, levelMarks, nextDestinyLevel, perksByLevel, stoneShare, type PerkListGroup } from "@/lib/rules/derive";
import { gearAt, gearChangeText } from "@/lib/rules/gear";
import { heldCount } from "@/lib/rules/tree-states";
import type { GameData } from "@/lib/rules/data";
import type { LevelState } from "@/lib/rules/types";
import { computeBuild } from "@/lib/rules/engine";
import { Avatar } from "@/components/ui/avatar";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, DeityIcon, IconLabel, SignIcon, SkillIcon, SkillLabel, MarkIcon, SlotIcon, TagIcon } from "@/components/ui/skill-icon";
import { LevelBars, LevelLegend, LevelStepper, useHoldInPlace } from "./level-nav";
import { BottomSheet, PerkDetails, Tree, ViewToggle, type TreeView } from "./tree";
import styles from "./build-view.module.css";
import { pageZoom } from "@/lib/zoom";
import { themeOf, themeStyle } from "@/lib/themes";
import { useDismiss } from "@/lib/use-dismiss";
import { HIDDEN_IMAGE_TEXT } from "@/lib/moderation/reports";

export type BuildViewData = Omit<BuildRecord, "createdAt" | "updatedAt" | "featuredAt"> & { updatedAt: string };

interface Props {
  build: BuildViewData;
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
  /** Set for admins (WO-39): whether this build is the featured one, for the More menu. */
  admin?: { featured: boolean } | null;
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
export function BuildView({ build, isOwner, signedIn, initialLevel, initialTab = "levels", signInToCopy, signInToLike, autoCopy, guide = {}, admin = null }: Props) {
  const d = useGameData();
  const noted = useMemo(() => notedLevels(guide), [guide]);
  const { plan } = build;
  const total = plan.levels.length;
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);

  // Tabs: one with nothing in it isn't shown; with only Levels there's no tab row.
  const overview = guide.overview && !isEmptyDoc(guide.overview) ? guide.overview : null;
  // The Guide tab holds the guide and the video guide (WO-39), either or both.
  const tabs: BuildTab[] = ["levels", ...(overview || plan.videoId ? (["guide"] as const) : [])];
  // "Watch the video guide" in the hero: opens the Guide tab at the video and starts it.
  const [play, setPlay] = useState(0);
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

  // The intro, else the guide's first paragraph, else nothing.
  const intro = guide.intro && !isEmptyDoc(guide.intro) ? guide.intro : firstParagraph(overview);
  const TAB_NAMES: Record<BuildTab, string> = { levels: "Levels", guide: "Guide" };
  // Each tab's second line: what's in it.
  const minutes = overview ? Math.max(1, Math.ceil(docWords(overview) / 200)) : 0;
  const TAB_SUB: Record<BuildTab, string> = {
    levels: `Levels 1 to ${total}`,
    guide: overview ? `${minutes} min read${plan.videoId ? " | Video" : ""}` : "Video",
  };

  const [picked, setPicked] = useState<Picked>(null);
  const [destinyOpenChoice, setDestinyOpenChoice] = useState(false);

  // The contents rail on wide screens (WO-35): the Levels tab's sections, or the guide's headings.
  const railPerks = useMemo(() => perksByLevel(d, plan, states, level), [d, plan, states, level]);
  const railTree = openTreeFor(d, plan, level, picked);
  const railState = states[level - 1];
  const skillGroups = railPerks.filter((g) => g.tree !== "Destiny");
  const destinyCount = railPerks.filter((g) => g.tree === "Destiny").reduce((n, g) => n + g.perks.length, 0);
  const railItems: RailItem[] =
    tab === "guide" && overview
      ? [
          ...guideHeadings(overview, "guide").map((h) => ({ key: h.id, label: h.text, target: h.id })),
          { key: "levels", label: "Levels", onGo: () => setTab("levels") },
        ]
      : [
          { key: "level", label: `Level ${level}`, target: "level-card" },
          { key: "attributes", label: "Attributes and skills", target: "attributes-skills" },
          // Counts as the tree chips count them: perks held, a perk's ranks as one.
          { key: "perks", label: "Perks", count: skillGroups.reduce((n, g) => n + heldCount(d, g.tree, railState), 0), target: "perks" },
          ...skillGroups.map((g) => ({
            key: `tree-${g.tree}`,
            label: g.tree,
            count: heldCount(d, g.tree, railState),
            sub: true,
            marked: g.tree === railTree,
            target: "perks",
            onGo: () => setPicked({ level, tree: g.tree, star: null }),
          })),
          ...(plan.levels.some((l) => l.destiny.length > 0)
            ? [{ key: "destiny", label: "Destiny", count: destinyCount, destiny: true, target: "destiny", onGo: () => setDestinyOpenChoice(true) }]
            : []),
          ...(plan.gear.length ? [{ key: "gear", label: "Gear", count: gearAt(plan, level).length, target: "gear-at-level" }] : []),
          ...(spellsLearned(d, plan, level).some((x) => x.spell) ? [{ key: "spells", label: "Spells", count: spellsLearned(d, plan, level).filter((x) => x.spell).length, target: "spells" }] : []),
          ...(tabs.includes("guide") ? [{ key: "guide", label: "Guide", onGo: () => setTab("guide") }] : []),
        ];

  // The pinned bar: once the tab row (or, with no tabs, the level navigation) scrolls off the top,
  // a slim bar on Levels holds the level stepper and what the level changed.
  const [tabRow, setTabRow] = useState<HTMLDivElement | null>(null);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = tabRow ?? levelBarRef.current;
      // Under the owner's edit bar, when there is one.
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-top")) || 0;
      setPinned(!!el && el.getBoundingClientRect().bottom < top * pageZoom());
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
        {/* The owner's edit bar: one click to edit, as View build is one click back. */}
        {isOwner && !build.isSample && <EditBar buildId={build.id} name={build.name} current={null} visibility={build.visibility} />}
        {/* The build's guide theme (WO-37): everything below the edit bar takes its colours. */}
        <div className={styles.themed} data-theme={themeOf(plan.theme).id} style={themeStyle(plan.theme)}>
        <Cover
          build={build}
          isOwner={isOwner}
          signedIn={signedIn}
          signInToCopy={signInToCopy}
          signInToLike={signInToLike}
          autoCopy={!!autoCopy}
          admin={admin}
          onWatch={() => {
            setTab("guide");
            setPlay((n) => n + 1);
          }}
        />

        <div className={`page ${styles.body}`}>
          <OldVersionNotice buildId={build.id} signedIn={signedIn} />
          {intro && (
            <section aria-label="Intro" className={styles.intro}>
              <Ornament />
              {/* Opens like the game's books: a large framed first letter, the first line in small caps. */}
              <div className={styles.introBook}>
                <GuideView doc={intro} idPrefix="intro" />
              </div>
              <Ornament />
              {overview && (
                <button type="button" className={styles.linkButton} onClick={() => setTab("guide")}>
                  Read the full guide
                </button>
              )}
            </section>
          )}
          <AboutBar plan={plan} />

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

          <div className={styles.withRail}>
          <ContentsRail items={railItems} />
          <div className={styles.railMain}>
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
                destinyOpenChoice={destinyOpenChoice}
                setDestinyOpenChoice={setDestinyOpenChoice}
              />
            </div>
          )}
          {tab === "guide" && (overview || plan.videoId) && (
            <div id="panel-guide" role="tabpanel" aria-labelledby="tab-guide" className={styles.guidePanel}>
              {plan.videoId && <VideoGuide videoId={plan.videoId} title={build.name} play={play} />}
              {overview && <GuideSection buildId={build.id} doc={overview} full />}
            </div>
          )}
          </div>
          </div>
          {/* Report, quietly, at the foot (WO-40): signed-in players, not the owner. */}
          {signedIn && !isOwner && !build.isSample && <ReportBuild buildId={build.id} />}
        </div>
        </div>
      </main>
    </GuideFactsProvider>
  );
}

/** The skill tree open in the Perks section: the one picked, else this level's first perk's, else the first major. */
function openTreeFor(d: GameData, plan: BuildViewData["plan"], level: number, picked: Picked): string {
  const pickedSkill = picked && picked.tree !== "Destiny" ? picked : null;
  if (pickedSkill && (pickedSkill.star || pickedSkill.level === level)) return pickedSkill.tree;
  const firstPerk = plan.levels[level - 1].perks[0];
  return firstPerk ? (d.perkById.get(firstPerk)?.tree ?? plan.majors[0]) : (plan.majors[0] ?? d.skills[0]);
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
  destinyOpenChoice,
  setDestinyOpenChoice,
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
  /** Destiny unfolded by the viewer (or the rail), kept as they move between levels. */
  destinyOpenChoice: boolean;
  setDestinyOpenChoice: (open: boolean) => void;
}) {
  const d = useGameData();
  const { plan } = build;
  const total = plan.levels.length;
  const s = states[level - 1];
  const perks = useMemo(() => perksByLevel(d, plan, states, level), [d, plan, states, level]);


  // Perks: the tree picked for this level (by the player, a card link or the held list), else
  // the tree of this level's first perk, else the first major.
  const lv = plan.levels[level - 1];
  // Destiny has its own section (WO-27): the Perks section is the skill trees only.
  const skillPerks = perks.filter((g) => g.tree !== "Destiny");
  const destinyPerks = perks.filter((g) => g.tree === "Destiny");
  const hasDestiny = plan.levels.some((l) => l.destiny.length > 0);
  const pickedSkill = picked && picked.tree !== "Destiny" ? picked : null;
  const tree = openTreeFor(d, plan, level, picked);
  const selected = pickedSkill?.star ?? null;
  const destinySelected = picked?.tree === "Destiny" ? picked.star : null;
  const destinyRef = useRef<HTMLElement>(null);
  // Destiny folds to one line (WO-32). It opens by itself where a star is taken, or when a Destiny
  // star is picked (the card, the pinned bar); otherwise it stays as the viewer left it.
  const [closedAt, setClosedAt] = useState<ReadonlySet<number>>(new Set());
  const takenHere = lv.destiny.length > 0;
  const destinyOpen = destinyOpenChoice || (takenHere && !closedAt.has(level)) || !!destinySelected;
  const toggleDestiny = () => {
    if (destinyOpen) {
      setDestinyOpenChoice(false);
      if (takenHere) setClosedAt((c) => new Set(c).add(level));
      if (destinySelected) clearPick();
    } else setDestinyOpenChoice(true);
  };
  const nextStar = nextDestinyLevel(d, level);
  const starsSoFar = destinyPerks.flatMap((g) => g.perks.map((p) => p.name));
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
    else if (scroll) (p.tree === "Destiny" ? destinyRef : perksRef).current?.scrollIntoView({ block: "start" });
  };
  const clearPick = useCallback(() => setPicked((p) => (p ? { ...p, star: null, level } : p)), [level, setPicked]);
  useEffect(() => {
    if (!(selected || destinySelected) || narrow) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && clearPick();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, destinySelected, narrow, clearPick]);

  return (
    <>
      <section ref={levelBarRef} aria-label="Level" className={styles.levelSection}>
        <div className={styles.levelHead}>
          <LevelStepper level={level} total={total} onChange={setLevel} />
          <LevelLegend marks={marks} />
        </div>
        <LevelBars marks={marks} level={level} onChange={setLevel} />
      </section>

      <LevelCard d={d} build={build} states={states} level={level} note={note} onPerk={(id) => showPerk(id, true)} />

      <div id="attributes-skills" className={styles.reference}>
        <AttributesAt s={s} level={level} />
        <SkillsAt d={d} plan={plan} s={s} level={level} />
      </div>

      <section ref={perksRef} id="perks" data-tree-anchor="" aria-label={`Perks at level ${level}`} className={styles.perksSection}>
        <div className="section-head">
          <h2 className="section-title">
            Perks <span className="section-title-at">at level {level}</span>
          </h2>
          {narrow && <ViewToggle view={view} onView={setViewChoice} />}
        </div>
        {/* Phones in List view show the held list alone; the chips go with the tree. */}
        {(!narrow || view === "tree") && <PerkChips d={d} perks={skillPerks} s={s} active={tree} onChange={(t) => setPicked({ level, tree: t, star: null })} />}
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
              {/* Beside the tree, the open tree's perks in full and the rest folded (WO-35); the phone list view lists them all. */}
              <HeldList perks={skillPerks} s={s} level={level} onPick={(id) => showPerk(id, false)} {...(narrow ? {} : { open: tree, onOpen: (t: string) => setPicked({ level, tree: t, star: null }) })} />
            </div>
          )}
        </div>
        {narrow && sheet && (
          <BottomSheet label={d.perkById.get(sheet)?.name ?? "Perk"} onClose={() => setSheet(null)}>
            <PerkDetails id={sheet} states={states} level={level} />
          </BottomSheet>
        )}
      </section>

      {/* Destiny, its own thing (WO-27), folded to one line unless it's open (WO-32). Left out when
          the build takes no Destiny perks. */}
      {hasDestiny && (
        <section ref={destinyRef} id="destiny" data-tree-anchor="" aria-label={`Destiny at level ${level}`} className={styles.destinySection}>
          <div className={styles.destinyLine}>
            <h2 className={styles.destinyTitle}>
              <i className={styles.destinyMark} aria-hidden="true" />
              Destiny
            </h2>
            <span className={styles.destinyStars}>{starsSoFar.length ? starsSoFar.join(", ") : "No stars yet"}</span>
            {nextStar && <span className={styles.destinyNext}>Next star at level {nextStar}</span>}
            <button type="button" className={styles.destinyToggle} aria-expanded={destinyOpen} aria-controls="destiny-tree" onClick={toggleDestiny}>
              {destinyOpen ? "Hide the tree" : "Show the tree"}
            </button>
          </div>
          {destinyOpen && (
            <div id="destiny-tree" className={styles.perksBody}>
              <div className={`frame ${styles.treeBox} ${styles.destinyBox}`}>
                <Tree tree="Destiny" states={states} level={level} selectedId={destinySelected} onSelect={(id) => setPicked({ level, tree: "Destiny", star: id })} view="tree" noToggle sheetBelow={1100} />
              </div>
              <div className={styles.side}>
                {!narrow && destinySelected && <PerkDetails id={destinySelected} states={states} level={level} onClose={clearPick} />}
                <HeldList perks={destinyPerks} s={s} level={level} onPick={(id) => showPerk(id, false)} destiny />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Gear, last and its own section (WO-32): slot cards, then the timeline. */}
      {plan.gear.length > 0 && <GearView plan={plan} level={level} onLevel={setLevel} />}
      {/* Spells, after Gear (WO-42). */}
      <SpellView d={d} plan={plan} level={level} />
    </>
  );
}

/** One chip per skill tree the build holds perks in; the rest in a menu. Destiny has its own section. */
function PerkChips({ d, perks, s, active, onChange }: { d: GameData; perks: PerkListGroup[]; s: LevelState; active: string; onChange: (tree: string) => void }) {
  const [open, setOpen] = useState(false);
  const othersWrap = useRef<HTMLSpanElement>(null);
  const othersButton = useRef<HTMLButtonElement>(null);
  useDismiss({ open, onClose: () => setOpen(false), inside: [othersWrap], trigger: othersButton });
  const shown = perks.map((g) => g.tree).filter((t) => t !== "Destiny");
  if (!shown.includes(active)) shown.push(active);
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
        <span ref={othersWrap} className={styles.othersWrap}>
          <button ref={othersButton} type="button" className={styles.others} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
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

/**
 * The perks held by this level, grouped by tree; this level's in ember. Each opens its star. With
 * `open` (beside the tree, WO-35) only the open tree is listed in full; the rest are one line each,
 * name and count, which open that tree.
 */
function HeldList({
  perks,
  s,
  level,
  onPick,
  destiny,
  open,
  onOpen,
}: {
  perks: PerkListGroup[];
  s: LevelState;
  level: number;
  onPick: (id: string) => void;
  destiny?: boolean;
  open?: string;
  onOpen?: (tree: string) => void;
}) {
  const d = useGameData();
  // As the tree chips count: perks held, a perk's ranks as one.
  const count = (tree: string) => heldCount(d, tree, s);
  const total = perks.reduce((n, g) => n + count(g.tree), 0);
  return (
    <section aria-label={`${destiny ? "Destiny taken" : "Taken"} by level ${level}`} className={`${styles.held} ${destiny ? styles.heldDestiny : ""}`}>
      <span className={`sub-label ${styles.heldHead}`}>
        Taken by level {level}
        {onOpen && total > 0 && <span className={styles.heldTotal}>{total}</span>}
      </span>
      {perks.length === 0 && <p className="muted">None yet.</p>}
      {perks.map((g) =>
        onOpen && g.tree !== open ? (
          <button key={g.tree} type="button" className={styles.heldFolded} onClick={() => onOpen(g.tree)}>
            <SkillLabel name={g.tree} />
            <span className={styles.heldFoldedCount}>{`${count(g.tree)} ▸`}</span>
          </button>
        ) : (
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
        ),
      )}
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
      <div className="section-head">
        <h2 className="section-title">
          Attributes <span className="section-title-at">at level {level}</span>
        </h2>
      </div>
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
        <dt>Perk points left</dt>
        <dd>{perkLeft}</dd>
        {/* Destiny's own points, in its gold, next to the perk points (WO-27). */}
        <dt className={styles.destinyText}>Destiny points left</dt>
        <dd className={styles.destinyText}>{destinyLeft}</dd>
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
      <div className="section-head">
        <span className={styles.skillsTitle}>
          <h2 className="section-title">
            Skills <span className="section-title-at">at level {level}</span>
          </h2>
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
  for (const x of f.oghma?.skills ?? []) add(x.sk, "Oghma Infinium", x);
  const tip = (lines: { label: string; row: SkillGain }[]) => (
    <span className={styles.gainTip}>
      {lines.map((l, i) => (
        <span key={i} className={styles.gainTipLine}>
          <span className={styles.gainTipLabel}>
            {l.label === "Trainer" ? <IconLabel icon={<MarkIcon name="trainer" />}>Trainer</IconLabel> : l.label === "Skill book" ? <IconLabel icon={<MarkIcon name="skill-book" />}>Skill book</IconLabel> : l.label}
          </span>
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
          // Destiny's chip is gold, with the diamond (WO-27); perks stay ember.
          const destiny = p.tree === "Destiny";
          const body = destiny ? (
            <span className={styles.sumDestinyBody}>
              <i className={styles.destinyMark} aria-hidden="true" />
              {p.name}
            </span>
          ) : (
            <IconLabel icon={<SkillIcon name={p.tree} />}>
              {p.name}
              {p.rank ? ` ${p.rank}` : ""}
            </IconLabel>
          );
          const cls = `${styles.sumChip} ${destiny ? styles.sumDestiny : styles.sumPerk} ${styles.sumKeep}`;
          return plain ? (
            <span key={`${p.id}-${i}`} className={cls}>
              {body}
            </span>
          ) : (
            <Tooltip
              key={`${p.id}-${i}`}
              content={destiny ? `Destiny: ${p.name}` : `Perk: ${p.name}${p.rank ? ` ${p.rank}` : ""}${p.tree !== p.name ? ` (${p.tree}${p.book ? ", book" : ""})` : ""}`}
            >
              <button type="button" className={cls} onClick={() => onPerk(p.id)}>
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
        {/* One Gear chip at a level with new gear, which goes to Gear at level N (WO-32). */}
        {at < 2 &&
          f.gear.length > 0 &&
          (plain ? (
            <span key="gear" className={`${styles.sumChip} ${styles.sumWide}`}>
              <IconLabel icon={<SlotIcon slot="Other" />}>Gear</IconLabel>
            </span>
          ) : (
            <Tooltip key="gear" content={f.gear.map(gearChangeText).join("\n")}>
              <button type="button" className={`${styles.sumChip} ${styles.sumGear} ${styles.sumWide}`} onClick={() => document.getElementById("gear-at-level")?.scrollIntoView({ block: "start" })}>
                <IconLabel icon={<SlotIcon slot="Other" />}>Gear</IconLabel>
              </button>
            </Tooltip>
          ))}
        {noted && chip("note", "The author left a note for this level", <IconLabel icon={<MarkIcon name="note" />}>Note</IconLabel>, styles.sumWide)}
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

/** The level card's labels that have a marker icon (WO-30). */
const KEY_MARKS: Record<string, "trainer" | "skill-book" | "banked"> = { Trainer: "trainer", "Skill book": "skill-book", "Skill books": "skill-book", Banked: "banked" };

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
  ];
  if (perkLines.length)
    rows.push([
      perkLines.length > 1 ? "Perks" : "Perk",
      <span key="p" className={styles.stack}>
        {perkLines}
      </span>,
    ]);
  // Destiny: its own row after the perks, in its own colour (WO-27).
  if (changes.destiny.length)
    rows.push([
      "Destiny",
      <span key="d" className={styles.stack}>
        {changes.destiny.map((p) => (
          <span key={p.id}>
            <button type="button" className={`${styles.perkLink} ${styles.destinyLink}`} onClick={() => onPerk(p.id)}>
              {p.name}
            </button>
          </span>
        ))}
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

  // The deity, when it changes (WO-43): "The Magna-Ge (was Syrabane)".
  if (facts.deity)
    rows.push([
      "Deity",
      <span key="dy">
        <IconLabel icon={<DeityIcon name={facts.deity.name} />}>{facts.deity.name}</IconLabel>
        {facts.deity.prev && <span className="muted"> (was {facts.deity.prev})</span>}
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
  // The Oghma Infinium (WO-44): its six +5 skills and +3 perk points.
  if (facts.oghma)
    rows.push([
      "Oghma Infinium",
      <span key="og" className={styles.stack}>
        <SkillGains rows={facts.oghma.skills.map((x) => ({ skill: x.sk, gain: x.n, from: x.from, to: x.to }))} />
        <span className="ember">+{facts.oghma.perkPoints} perk points</span>
      </span>,
    ]);
  // New gear (WO-32): each item in an ember chip with its slot and what it replaces; an emptied
  // slot as "Off hand emptied", "Poison vials (Other) removed".
  if (facts.gear.length) {
    const before = level > 1 ? gearAt(plan, level - 1) : [];
    rows.push([
      "New gear",
      <span key="g" className={styles.newGear}>
        {facts.gear.map((g, i) => {
          const name = g.name.trim();
          const was = g.slot === "Other" ? g.replaces : before.find((b) => b.slot === g.slot)?.name;
          return (
            <span key={i} className={styles.newGearRow}>
              <SlotIcon slot={g.itemId || g.made ? g.slot : "Other"} size={24} />
              {name ? (
                <span className={styles.newGearWhat}>
                  <span className={styles.newGearChip}>{name}</span>
                  {g.made && <MadeMark made={g.made} />}
                  <span className="muted">
                    {g.slot}, replaces {was ?? "nothing"}
                  </span>
                  {/* The author's note on its own line (WO-47), as a new spell shows its where. */}
                  {g.note.trim() && <span className={styles.newGearNote}>{g.note.trim()}</span>}
                </span>
              ) : (
                <span>{gearChangeText(g)}</span>
              )}
            </span>
          );
        })}
      </span>,
    ]);
  }
  // New spells (WO-42): each in a chip with its school's icon and where; the tooltip has the tier,
  // cast type, the game's text and where.
  const newSpells = spellsAt(d, plan, level).filter((x) => x.spell);
  if (newSpells.length)
    rows.push([
      "New spells",
      <span key="sp" className={styles.newSpells}>
        {newSpells.map((x) => (
          <span key={x.index} className={styles.newSpell}>
            <SkillIcon name={x.spell!.school} size={24} />
            <Tooltip
              content={
                <span className={styles.spellTip}>
                  <span className="muted">{[x.spell!.school, x.spell!.tier, x.spell!.cast].filter(Boolean).join(", ")}</span>
                  <span>{x.spell!.text}</span>
                  {x.where && <span className="muted">Where: {x.where}</span>}
                </span>
              }
            >
              <span className={styles.newSpellChip} tabIndex={0}>
                {x.spell!.name}
              </span>
            </Tooltip>
            {x.where && <span className="muted">{x.where}</span>}
          </span>
        ))}
      </span>,
    ]);
  if (changes.banked > 0) rows.push(["Banked", `${changes.banked} skill point${changes.banked === 1 ? "" : "s"}`]);

  return (
    <section id="level-card" aria-label={`Level ${level}`} className={`frame ${styles.card} ${styles.cardWithNote}`}>
      <div className={styles.cardMain}>
        <h2 className={styles.cardTitle}>Level {level}</h2>
        {rows.length ? (
          <div className={styles.changes}>
            {rows.map(([k, v]) => (
              <div key={k} className={styles.changeRow}>
                {tips[k] ? (
                  <Tooltip content={tips[k]}>
                    <span className={`${styles.changeKey} ${styles.ruleTip}`} tabIndex={0}>
                      {KEY_MARKS[k] ? <IconLabel icon={<MarkIcon name={KEY_MARKS[k]} />}>{k}</IconLabel> : k}
                    </span>
                  </Tooltip>
                ) : k === "Destiny" ? (
                  <span className={`${styles.changeKey} ${styles.destinyKey}`}>
                    <i className={styles.destinyMark} aria-hidden="true" />
                    {k}
                  </span>
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
        {note ? <LevelNote key={level} doc={note} level={level} lines={12} /> : <p className={`muted ${styles.noNote}`}>No note for level {level}.</p>}
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

/** A thin gold rule with a small diamond in the middle, above and below the intro (SVG, gold at 60%). */
function Ornament() {
  const rule = (
    <svg className={styles.ornamentRule} viewBox="0 0 100 2" preserveAspectRatio="none" focusable="false">
      <line x1="0" y1="1" x2="100" y2="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
  return (
    <span className={styles.ornament} aria-hidden="true">
      {rule}
      <svg className={styles.ornamentDiamond} viewBox="0 0 12 12" focusable="false">
        <path d="M6 0.8 L11.2 6 L6 11.2 L0.8 6 Z" />
      </svg>
      {rule}
    </span>
  );
}

function Cover({
  build,
  isOwner,
  signedIn,
  signInToCopy,
  signInToLike,
  autoCopy,
  admin,
  onWatch,
}: {
  build: BuildViewData;
  isOwner: boolean;
  signedIn: boolean;
  signInToCopy: React.ReactNode;
  signInToLike?: React.ReactNode;
  autoCopy: boolean;
  admin: { featured: boolean } | null;
  onWatch: () => void;
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
  // The owner's edit bar shows on their own builds (not the sample).
  const ownerBar = isOwner && !build.isSample;
  const video = build.plan.videoId;
  const writeup = build.writeupUrl;
  const writeupLabel = writeup && /discord\.(com|gg)/i.test(writeup) ? "Read the write-up on Discord" : "Read the write-up";

  // While the hero is in view: the cover at half the scroll speed, the text rising a little faster and
  // fading out by the time the hero's foot reaches the top, the fade at its foot deepening. Transforms
  // and opacity only, one frame per scroll; nothing under prefers-reduced-motion.
  const hero = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const textLayer = useRef<HTMLDivElement>(null);
  const deepen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const apply = () => {
      frame = 0;
      const el = hero.current;
      if (!el) return;
      const total = el.offsetTop + el.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), total);
      const p = total ? y / total : 0;
      if (layer.current) layer.current.style.transform = `translate3d(0, ${(y * 0.5).toFixed(1)}px, 0)`;
      if (textLayer.current) {
        textLayer.current.style.transform = `translate3d(0, ${(-y * 0.25).toFixed(1)}px, 0)`;
        textLayer.current.style.opacity = (1 - p).toFixed(3);
      }
      if (deepen.current) deepen.current.style.opacity = p.toFixed(3);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={hero} aria-label="Build" className={`${styles.cover} ${build.coverImageUrl ? "" : styles.coverPlain}`}>
      {build.coverImageUrl && (
        <div ref={layer} className={styles.coverLayer} aria-hidden="true">
          <div
            className={styles.coverImage}
            style={{ backgroundImage: `url("${build.coverImageUrl}")`, backgroundPosition: build.plan.coverFocus ? `${build.plan.coverFocus.x}% ${build.plan.coverFocus.y}%` : undefined }}
          />
          {/* The theme's tint over the image (none for Ember). */}
          <div className={styles.coverTint} />
        </div>
      )}
      {build.coverHeld && <span className={styles.coverHeld}>{HIDDEN_IMAGE_TEXT}</span>}
      <div className={styles.coverFade} />
      <div ref={deepen} className={styles.coverDeepen} />
      <div ref={textLayer} className={`page ${styles.coverInner}`}>
        <div className={styles.coverText}>
          <h1 className={`title ${styles.h1} ${styles.heroIn} ${styles.heroIn1}`}>{build.name}</h1>
          {build.description && <p className={`flavor ${styles.description} ${styles.heroIn} ${styles.heroIn2}`}>{build.description}</p>}
          <div className={`${styles.byline} ${styles.heroIn} ${styles.heroIn3}`}>
            <AuthorLink author={build.author} className={styles.author} nameClassName={styles.authorName} avatar={<Avatar name={build.author.name} image={build.author.image} />} />
            {!build.isSample && <LikeButton buildId={build.id} liked={build.likedByViewer} count={build.likeCount} mode={isOwner && build.visibility === "private" ? "owner" : signedIn ? "can" : "signedOut"} signIn={signInToLike} />}
            <span className="tag">LoreRim {build.gameVersion}</span>
            {/* One unit, so a wrap never leaves the bar dangling at a line's end. */}
            <span className={styles.dates}>
              <span>Planned to level {build.plan.levels.length}</span>
              <span className={styles.pipe} aria-hidden="true">
                |
              </span>
              <span>
                Updated <LocalDate date={build.updatedAt} />
              </span>
            </span>
          </div>
          {build.tags.length > 0 && (
            <ul className={`${styles.tagLine} ${styles.heroIn} ${styles.heroIn3}`} aria-label="Tags">
              {build.tags.map((t) => (
                <li key={t}>
                  <Link href={`/?tags=${t}`} className={styles.tagLink}>
                    <IconLabel icon={<TagIcon tag={t} />}>{TAG_BY_SLUG.get(t)?.name ?? t}</IconLabel>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={`${styles.actions} ${styles.heroIn} ${styles.heroIn4}`}>
          {/* A video guide comes first, and largest (WO-39): a creator's video is front and centre. */}
          {video && (
            <button type="button" className={`btn btn-primary ${styles.watch}`} onClick={onWatch}>
              <PlayMark size={18} /> Watch the video guide
            </button>
          )}
          {/* The owner has Copy link and Edit in the edit bar; the hero doesn't repeat them. */}
          {!ownerBar && (
            <button type="button" className="btn" onClick={copyLink}>
              {copied ? "Copied" : "Copy link"}
            </button>
          )}
          {writeup && (
            <a className="btn" href={writeup} target="_blank" rel="noopener noreferrer">
              {writeupLabel}
            </a>
          )}
          {isOwner ? (
            ownerBar ? null : (
              <Link className="btn btn-primary" href={`/b/${build.id}/edit`}>
                Edit build
              </Link>
            )
          ) : signedIn ? (
            <button type="button" className={video ? "btn" : "btn btn-primary"} onClick={copyToMine} disabled={pending}>
              {pending ? "Copying…" : "Copy to my builds"}
            </button>
          ) : (
            signInToCopy
          )}
          {admin && <AdminMenu buildId={build.id} featured={admin.featured} listed={build.visibility === "public"} onError={setError} />}
          {error && <span className={`field-error ${styles.actionError}`}>{error}</span>}
        </div>
      </div>
    </section>
  );
}

/**
 * The admin's More menu on a build page (WO-39): feature the build on Browse, or stop. Only Listed
 * builds can be featured; featuring one replaces the last.
 */
function AdminMenu({ buildId, featured: initial, listed, onError }: { buildId: string; featured: boolean; listed: boolean; onError: (e: string | null) => void }) {
  const router = useRouter();
  const [featured, setFeaturedState] = useState(initial);
  const [pending, start] = useTransition();
  const toggle = (close: (refocus?: boolean) => void) => {
    close(true);
    const next = !featured;
    onError(null);
    start(async () => {
      const r = await setFeatured(buildId, next);
      if (!r.ok) return onError(r.error);
      setFeaturedState(next);
      router.refresh();
    });
  };
  return (
    <MenuButton buttonClassName="btn btn-icon" buttonLabel="More" menuLabel="More" button="⋯">
      {(close) => (
        <button type="button" role="menuitem" tabIndex={-1} className={menuStyles.menuItem} onClick={() => toggle(close)} disabled={pending || (!featured && !listed)}>
          <span className={menuStyles.menuText}>
            <span className={menuStyles.menuLabel}>{featured ? "Stop featuring" : "Feature this build"}</span>
            <span className={menuStyles.menuSub}>{featured ? "Browse goes back to its usual order." : listed ? "First on Browse, and larger." : "Only Listed builds can be featured."}</span>
          </span>
        </button>
      )}
    </MenuButton>
  );
}
