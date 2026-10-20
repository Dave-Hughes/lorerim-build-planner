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
import { MenuButton, OwnerControls } from "@/components/editor/edit-bar";
import menuStyles from "@/components/editor/edit-bar.module.css";
import { PlayMark } from "./play-mark";
import { Tour } from "@/components/tour/tour";
import { READER_TOUR } from "@/lib/tour";
import { spellsAt } from "@/lib/rules/spells";
import { abilitiesAt, abilitySource, shoutsKnown } from "@/lib/rules/powers";
import { AbilityTip, ShoutTip, SpellView, spellsAndAbilities } from "./spell-view";
import { VideoGuide } from "./video-guide";
import { ReportBuild } from "./report-build";
import { AboutBar } from "./about-bar";
import { GearView, MadeMark } from "./gear-view";
import { ContentsRail, type RailItem } from "./contents-rail";
import { guideHeadings } from "@/components/guide/guide-view";
import { LocalDate } from "@/components/ui/local-date";
import { GuideSection } from "@/components/guide/guide-section";
import { LevelNote } from "@/components/guide/level-note";
import { docText, docWords, firstParagraph, isEmptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import { GuideView } from "@/components/guide/guide-view";
import { ReaderLink, useReading } from "@/components/reader/reader";
import { currentVersion, isOlderThanCurrent } from "@/lib/rules/versions";
import { ATTRIBUTE_NAMES, levelChanges, levelFacts, levelMarks, nextDestinyLevel, perksByLevel, stoneShare, stretchPerkOrder, stretchPerkRequirement, type PerkListGroup } from "@/lib/rules/derive";
import { gearAt, gearChangeText, replacedName } from "@/lib/rules/gear";
import { heldCount } from "@/lib/rules/tree-states";
import type { GameData } from "@/lib/rules/data";
import type { LevelState } from "@/lib/rules/types";
import { computeBuild } from "@/lib/rules/engine";
import { Avatar } from "@/components/ui/avatar";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, DeityIcon, GameIcon, IconLabel, SignIcon, SkillIcon, SkillLabel, MarkIcon, SlotIcon, TagIcon } from "@/components/ui/skill-icon";
import { ArrowTip, LevelBars, LevelLegend, LevelStepper, RunHere, useArrowTip, useHoldInPlace } from "./level-nav";
import { levelsLine, skips, stretchAt, stretches, writtenLevels } from "@/lib/rules/stretches";
import { BottomSheet, PerkDetails, Tree, ViewToggle, type TreeView } from "./tree";
import styles from "./build-view.module.css";
import { pageZoom } from "@/lib/zoom";
import { themeOf, themeStyle } from "@/lib/themes";
import { useDismiss } from "@/lib/use-dismiss";
import { HIDDEN_IMAGE_TEXT } from "@/lib/moderation/reports";
import { ExampleTag } from "./example-tag";

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
  /**
   * Set for admins (WO-39): whether this build is the featured one, for the More menu; and, just after
   * an import (WO-90), what the import left out.
   */
  admin?: { featured: boolean; imported?: { skipped: number; dropped: string[] } | null } | null;
  /**
   * A character with a run (WO-116): the run's Play view as the first tab, with its line ("Act I, 4 of
   * 16 done"); `here` is the run's level from the snapshot, "You are here" on the ruler.
   */
  playTab?: { node: React.ReactNode; sub: string; here: number | null } | null;
  /** The owner's Start a run, on a build without one (WO-116). */
  startRun?: string | null;
  /** The reader's first page (WO-116): "Read the story from the beginning" under the byline. */
  storyHref?: string | null;
}

export type BuildTab = "play" | "levels" | "guide";

/** What the reader may be looking at on the Levels tab, top to bottom: held still when the level changes (WO-49). */
const HELD_SECTIONS = ["level-card", "attributes-skills", "perks", "destiny", "gear-at-level", "spells"] as const;

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
export function BuildView({ build, isOwner, signedIn, initialLevel, initialTab = "levels", signInToCopy, signInToLike, autoCopy, guide = {}, admin = null, playTab = null, startRun = null, storyHref = null }: Props) {
  const d = useGameData();
  const reading = useReading();
  const noted = useMemo(() => notedLevels(guide), [guide]);
  const { plan } = build;
  const total = plan.levels.length;
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);

  // Tabs: one with nothing in it isn't shown; with only Levels there's no tab row.
  const overview = guide.overview && !isEmptyDoc(guide.overview) ? guide.overview : null;
  // The Guide tab holds the guide and the video guide (WO-39), either or both. A character's run is
  // the first tab, Play (WO-116); the Story is no tab, it opens in the reader.
  const tabs: BuildTab[] = [...(playTab ? (["play"] as const) : []), "levels", ...(overview || plan.videoId ? (["guide"] as const) : [])];
  // "Watch the video guide" in the hero: opens the Guide tab at the video and starts it.
  const [play, setPlay] = useState(0);
  const [tabState, setTabState] = useState<BuildTab>(initialTab);
  const tab = tabs.includes(tabState) ? tabState : "levels";
  const home: BuildTab = playTab ? "play" : "levels";
  const setUrl = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
  };
  const setTab = (t: BuildTab) => {
    setTabState(t);
    setUrl("tab", t === home ? null : t);
  };

  // The open level is the one that holds its stretch's choices (WO-69): `?level=20` opens the stretch holding 20.
  const [level, setLevelState] = useState(() => stretchAt(plan, Math.min(total, Math.max(1, initialLevel))).to);
  // Changing level keeps the level row where it is on screen.
  const { ref: levelBarRef, hold: holdLevelBar } = useHoldInPlace<HTMLElement>(level, HELD_SECTIONS);
  const setLevel = useCallback(
    (n: number) => {
      const next = stretchAt(plan, Math.min(total, Math.max(1, n))).to;
      holdLevelBar();
      setLevelState(next);
      const url = new URL(window.location.href);
      if (next === 1) url.searchParams.delete("level");
      else url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
    },
    [total, holdLevelBar, plan],
  );
  // The stretches either side, for the arrows and the arrow keys (WO-69).
  const allStretches = stretches(plan);
  const stretchIndex = allStretches.findIndex((x) => x.to === level);
  const prevTo = allStretches[stretchIndex - 1]?.to ?? null;
  const nextTo = allStretches[stretchIndex + 1]?.to ?? null;
  const openFrom = stretchAt(plan, level).from;

  // The one-time hint that the arrow keys step through levels (WO-49).
  const arrowTip = useArrowTip();
  const doneTip = arrowTip.done;

  // Left and right step through levels on the Levels tab (not inside a field or a tab row).
  useEffect(() => {
    if (tab !== "levels") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable || t.closest('[role="tablist"]'))) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const to = e.key === "ArrowRight" ? nextTo : prevTo;
      if (to !== null) setLevel(to);
      // Using the keys means the hint has done its job: it never shows again.
      doneTip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, setLevel, tab, doneTip, prevTo, nextTo]);

  // The intro, else the guide's first paragraph, else nothing.
  const intro = guide.intro && !isEmptyDoc(guide.intro) ? guide.intro : firstParagraph(overview);
  const TAB_NAMES: Record<BuildTab, string> = { play: "Play", levels: "Levels", guide: "Guide" };
  // Each tab's second line: what's in it.
  const minutes = overview ? Math.max(1, Math.ceil(docWords(overview) / 200)) : 0;
  const TAB_SUB: Record<BuildTab, string> = {
    levels: `Levels 1 to ${total}`,
    guide: overview ? `${minutes} min read${plan.videoId ? " | Video" : ""}` : "Video",
    play: playTab?.sub ?? "",
  };

  const hasGuideTab = tabs.includes("guide");
  const readerTour = useMemo(() => READER_TOUR({ guide: hasGuideTab, story: false }), [hasGuideTab]);
  const [picked, setPicked] = useState<Picked>(null);
  const [destinyOpenChoice, setDestinyOpenChoice] = useState(false);

  // The contents rail on wide screens (WO-35): the Levels tab's sections, or the guide's headings.
  const railPerks = useMemo(() => perksByLevel(d, plan, states, level), [d, plan, states, level]);
  const railTree = openTreeFor(d, plan, level, picked);
  const railState = states[level - 1];
  const skillGroups = railPerks.filter((g) => g.tree !== "Destiny");
  const destinyCount = railPerks.filter((g) => g.tree === "Destiny").reduce((n, g) => n + g.perks.length, 0);
  const railSpells = spellsAndAbilities(d, plan, level);
  const spellsCount = railSpells.spells.length + railSpells.abilities.length + railSpells.shouts.length;
  const railItems: RailItem[] =
    tab === "play"
      ? []
      : tab === "guide" && overview
      ? [
          // Only this tab's sections (WO-57): the tabs themselves switch tabs.
          ...guideHeadings(overview, "guide").map((h) => ({ key: h.id, label: h.text, target: h.id })),
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
          ...(spellsCount ? [{ key: "spells", label: "Spells and abilities", count: spellsCount, target: "spells" }] : []),
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
  // "Read the full guide" (WO-49): open the Guide tab and bring its tab row up under the pinned
  // bars, unless it's already wholly on screen. Smoothly, or at once with reduced motion.
  const readGuide = () => {
    setTab("guide");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!tabRow) return;
        const z = pageZoom();
        const sticky = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-top")) || 0) * z;
        const r = tabRow.getBoundingClientRect();
        if (r.top >= sticky && r.bottom <= window.innerHeight) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + r.top - sticky - 12 * z, behavior: still ? "instant" : "smooth" });
      }),
    );
  };
  // The owner's controls (WO-116a), in the hero and the pinned bar; one visibility between them.
  const [visibility, setVisibility] = useState(build.visibility);
  const ownerControls = isOwner && !build.isSample ? <OwnerControls key={visibility} buildId={build.id} current={null} visibility={visibility} onVisibility={setVisibility} /> : null;
  // A tab picked in the pinned bar opens at its top: the tab row comes back under the bars (WO-116).
  const openFromBar = (t: BuildTab) => {
    setTab(t);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (!tabRow) return;
        const z = pageZoom();
        const sticky = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sticky-top")) || 0) * z;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + tabRow.getBoundingClientRect().top - sticky - 12 * z, behavior: still ? "instant" : "smooth" });
      }),
    );
  };
  const onTabKey = (e: React.KeyboardEvent) => {
    const i = tabs.indexOf(tab);
    const next = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
    if (!next) return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <RunHere.Provider value={playTab?.here ?? null}>
    <GuideFactsProvider plan={plan} states={states}>
      <main className={styles.main}>
        {/* The build's guide theme (WO-37): everything below the edit bar takes its colours. */}
        <div className={styles.themed} data-theme={themeOf(plan.theme).id} style={themeStyle(plan.theme)}>
        <Cover
          ownerControls={ownerControls}
          startRun={startRun}
          storyHref={storyHref}
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
          {admin?.imported && (
            <p role="status" className={styles.importNote}>
              Imported. Its id is <code>{build.id}</code>, the one <code>SAMPLE_BUILD_ID</code> wants.
              {admin.imported.skipped > 0 && ` ${admin.imported.skipped} image${admin.imported.skipped === 1 ? "" : "s"} couldn't be copied and ${admin.imported.skipped === 1 ? "was" : "were"} left out.`}
              {admin.imported.dropped.length > 0 && ` Tags this planner doesn't have were dropped: ${admin.imported.dropped.join(", ")}.`}
            </p>
          )}
          {/* A character's page goes from the hero to its tabs (WO-116); the guide's intro stays on the Guide tab. */}
          {intro && !playTab && (
            <section aria-label="Intro" className={styles.intro}>
              <Ornament />
              {/* Opens like the game's books: a large framed first letter, the first line in small caps. */}
              <div className={styles.introBook}>
                <GuideView doc={intro} idPrefix="intro" />
              </div>
              <Ornament />
              {overview && (
                <button type="button" className={styles.linkButton} onClick={readGuide}>
                  Read the full guide
                </button>
              )}
            </section>
          )}
          {!playTab && <AboutBar plan={plan} />}

          {tabs.length > 1 && (
            <div ref={setTabRow} role="tablist" aria-label="Build sections" data-tour="build-tabs" className={styles.tabs} onKeyDown={onTabKey}>
              {tabs.map((t) => (
                <button
                  key={t}
                  ref={(el) => {
                    tabRefs.current[t] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t}`}
                  data-tour={`${t}-tab`}
                  aria-selected={tab === t}
                  aria-controls={`panel-${t}`}
                  tabIndex={tab === t ? 0 : -1}
                  className={styles.tab}
                  onClick={() => setTab(t)}
                >
                  {/* Folder tabs (WO-60): the 32px icon, the name, what's inside. */}
                  <GameIcon file={`tab-${t}`} size={32} className={styles.tabIcon} />
                  <span className={styles.tabText}>
                    <span className={styles.tabName}>{TAB_NAMES[t]}</span>
                    <span className={styles.tabSub}>{TAB_SUB[t]}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {/* Pinned once the tab row scrolls off (WO-116): the name and the tabs, thin, on every tab; on
              Levels, the level stepper and what the level changed under them. */}
          {/* The one pinned bar (WO-116a): the name, the page's tabs, the owner's controls. */}
          {pinned && (tabs.length > 1 || tab === "levels" || ownerControls) && (
            <div className={styles.pinnedBar} role="region" aria-label="Pinned bar" data-pinned-bar="" data-tour="pinned-bar">
              {(tabs.length > 1 || ownerControls) && (
                <div className={`page ${styles.pinnedTabs}`}>
                  <span className={styles.pinnedName}>{build.name}</span>
                  {tabs.length > 1 && (
                    <span className={styles.pinnedTabRow} role="group" aria-label="Sections">
                      {tabs.map((t) => (
                        <button key={t} type="button" aria-pressed={tab === t} className={styles.pinnedTab} onClick={() => openFromBar(t)}>
                          {TAB_NAMES[t]}
                        </button>
                      ))}
                    </span>
                  )}
                  {ownerControls}
                </div>
              )}
              {tab === "levels" && (
              <div className={`page ${styles.pinnedInner}`}>
                {(
                <>
                <LevelStepper
                  level={level}
                  total={total}
                  onChange={setLevel}
                  from={openFrom}
                  prev={prevTo}
                  next={nextTo}
                  slim
                  onStep={() => arrowTip.stepped("pinned")}
                  tip={arrowTip.open === "pinned" ? <ArrowTip onClose={arrowTip.done} /> : null}
                />
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
                </>
                )}
              </div>
              )}
            </div>
          )}

          {/* The reader's first-time tour (WO-61), on the Levels tab where its stops are. */}
          {tab === "levels" && !playTab && !reading && <Tour kind="reader" script={readerTour} firstStop={build.example ? <ExampleTag small /> : undefined} />}
          {tab !== "play" && (
          <div className={styles.withRail}>
          <ContentsRail items={railItems} />
          <div className={styles.railMain}>
          {tab === "levels" && (
            <div id="panel-levels" role={tabs.length > 1 ? "tabpanel" : undefined} aria-labelledby={tabs.length > 1 ? "tab-levels" : undefined} className={styles.panelStack}>
              {playTab && <AboutBar plan={plan} />}
              <LevelsTab
                build={build}
                states={states}
                marks={marks}
                level={level}
                setLevel={setLevel}
                levelBarRef={levelBarRef}
                arrowTip={arrowTip}
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
          )}
          {tab === "play" && playTab && (
            <div id="panel-play" role="tabpanel" aria-labelledby="tab-play">
              {playTab.node}
            </div>
          )}
          {/* Report, quietly, at the foot (WO-40): signed-in players, not the owner. */}
          {signedIn && !isOwner && !build.isSample && <ReportBuild buildId={build.id} />}
        </div>
        </div>
      </main>
    </GuideFactsProvider>
    </RunHere.Provider>
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
  arrowTip,
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
  arrowTip: ReturnType<typeof useArrowTip>;
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
      <section ref={levelBarRef} aria-label="Level" className={styles.levelSection} data-tour="level-row">
        <div className={styles.levelHead}>
          <LevelStepper
            level={level}
            total={total}
            onChange={setLevel}
            {...stretchSteps(plan, level)}
            onStep={() => arrowTip.stepped("page")}
            tip={arrowTip.open === "page" ? <ArrowTip onClose={arrowTip.done} /> : null}
          />
          <LevelLegend marks={marks} />
        </div>
        {/* The same ruler and row for every build; one that skips ahead has a cell per stretch (WO-69). */}
        <LevelBars marks={marks} level={level} onChange={setLevel} spans={skips(plan) ? stretches(plan) : undefined} />
      </section>

      <LevelCard d={d} build={build} states={states} level={level} note={note} onPerk={(id) => showPerk(id, true)} />

      <div id="attributes-skills" data-tour="attributes-skills" className={styles.reference}>
        <AttributesAt s={s} level={level} />
        <SkillsAt d={d} plan={plan} s={s} level={level} />
      </div>

      <section ref={perksRef} id="perks" data-tree-anchor="" data-tour="perks" aria-label={`Perks at level ${level}`} className={styles.perksSection}>
        <div className="section-head">
          <h2 className="section-title">
            Perks <span className="section-title-at">at level {level}</span>
          </h2>
          {narrow && <ViewToggle view={view} onView={setViewChoice} />}
        </div>
        {/* Phones in List view show the held list alone; the chips go with the tree, and the held list under it. */}
        {(!narrow || view === "tree") && <PerkChips d={d} perks={skillPerks} s={s} active={tree} onChange={(t) => setPicked({ level, tree: t, star: null })} />}
        <div className={styles.perksBody}>
          {(!narrow || view === "tree") && (
            <div className={`frame ${styles.treeBox}`}>
              <Tree tree={tree} states={states} level={level} selectedId={selected} onSelect={(id) => setPicked({ level, tree, star: id })} view="tree" noToggle sheetBelow={1100} />
            </div>
          )}
          <div className={styles.side}>
            {/* What the selected perk does, above the held list (wide screens; phones use the sheet). */}
            {!narrow && selected && <PerkDetails id={selected} states={states} level={level} onClose={clearPick} />}
            {/* Beside the tree, the open tree's perks in full and the rest folded (WO-35); the phone list view lists them all.
                On a phone it sits under the tree too (WO-75): a 356px tree can't name every perk, the list does. */}
            <HeldList perks={skillPerks} s={s} level={level} onPick={(id) => showPerk(id, false)} {...(narrow && view === "list" ? {} : { open: tree, onOpen: (t: string) => setPicked({ level, tree: t, star: null }) })} />
          </div>
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

/** The pinned bar summary's folds (see LevelSummary). */
const FOLDS = 7;

/**
 * The pinned bar's one-line summary of a level, in the card's order: the attribute, the skills raised
 * (points, trainers, books), the perks (each a button that selects it in the Perks section), the
 * stone and the gear when they change, and a note mark. Each chip's tooltip is the card's line. When
 * the chips don't fit, the skills lose their names first, then the gear goes, then the stone;
 * then the perks fold by tree, then into one chip, then the skills into one. Past that, the row ends
 * with a `+N more` button (WO-77).
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
  // How much to fold away: 0 all, 1 skills without their names, 2 also no gear, 3 also no stone, 4 perks
  // by tree, 5 perks as one chip, 6 skills as one chip (WO-77). Hidden copies of the row at each fold are
  // measured against the room there is, on every resize.
  const [fold, setFold] = useState(0);
  // Still too wide with everything folded: how many chips fit before the `+N more` button.
  const [keep, setKeep] = useState<number | null>(null);
  const row = useRef<HTMLSpanElement>(null);
  const measures = useRef<(HTMLSpanElement | null)[]>([]);
  useLayoutEffect(() => {
    const el = row.current;
    if (!el) return;
    const check = () => {
      const room = el.clientWidth;
      const widths = measures.current.map((m) => m?.scrollWidth ?? 0);
      const f = widths.findIndex((w) => w <= room + 1);
      setFold(f === -1 ? FOLDS - 1 : f);
      if (f !== -1) return setKeep(null);
      // The last copy ends with a `+N more` button: keep as many whole chips as fit beside it.
      const last = measures.current[FOLDS - 1];
      if (!last) return;
      const kids = [...last.children] as HTMLElement[];
      const more = kids.pop()!;
      const gap = 6;
      let n = kids.length;
      while (n > 0 && kids[n - 1].offsetLeft + kids[n - 1].offsetWidth + gap + more.offsetWidth > room) n--;
      setKeep(n);
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
  const perkName = (p: (typeof perkList)[number]) => `${p.name}${p.rank ? ` ${p.rank}` : ""}`;
  // The perks by tree, in the order they were taken; Destiny keeps its own chips until fold 5.
  const byTree = new Map<string, typeof perkList>();
  for (const p of perkList) byTree.set(p.tree, [...(byTree.get(p.tree) ?? []), p]);
  const treeTip = (trees: [string, typeof perkList][]) => (
    <span className={styles.gainTip}>
      {trees.map(([tree, ps]) => (
        <span key={tree} className={styles.gainTipLine}>
          <span className={styles.gainTipLabel}>{tree}</span>
          {ps.map(perkName).join(", ")}
        </span>
      ))}
    </span>
  );
  // The chips at a fold, each with its key. `plain` draws them without tooltips or buttons, for measuring.
  const chips = (at: number, plain: boolean): React.ReactElement[] => {
    const chip = (key: string, tip: React.ReactNode, body: React.ReactNode, className = "", onClick?: () => void) => {
      const cls = `${styles.sumChip} ${className}`;
      if (plain)
        return (
          <span key={key} className={cls}>
            {body}
          </span>
        );
      return (
        <Tooltip key={key} content={tip}>
          {onClick ? (
            <button type="button" className={cls} onClick={onClick}>
              {body}
            </button>
          ) : (
            <span className={cls} tabIndex={0}>
              {body}
            </span>
          )}
        </Tooltip>
      );
    };
    const out: React.ReactElement[] = [];
    // The attribute in its own colour, so it never reads as one more skill.
    if (f.attribute)
      out.push(
        chip(
          "attr",
          `+5 ${ATTRIBUTE_NAMES[f.attribute]}`,
          <IconLabel icon={<AttributeIcon name={f.attribute} />}>
            +5<span className={styles.sumAttrName}> {ATTRIBUTE_NAMES[f.attribute]}</span>
          </IconLabel>,
          `${styles.sumAttr} ${styles[`sumAttr_${f.attribute}`]} ${styles.sumKeep}`,
        ),
      );
    // Every skill raised, named until there's no room for the names; at fold 6, one chip for them all.
    if (at >= 6 && skills.length > 1) {
      const total = skills.reduce((n, [, g]) => n + g.n, 0);
      const rows = skills.map(([sk, g]) => ({ skill: sk, gain: g.n, from: Math.min(...g.lines.map((l) => l.row.from)), to: Math.max(...g.lines.map((l) => l.row.to)) }));
      out.push(chip("skills", <SkillGains rows={rows} />, `${skills.length} skills, +${total}`, styles.sumWide));
    } else
      for (const [sk, g] of skills)
        out.push(chip(sk, tip(g.lines), <IconLabel icon={<SkillIcon name={sk} />}>{at === 0 ? `${sk} +${g.n}` : `+${g.n}`}</IconLabel>, styles.sumWide));
    // Perks: ember, and each a button that selects it in the Perks section.
    const perkCls = `${styles.sumPerk} ${styles.sumKeep}`;
    const destinyChip = (p: (typeof perkList)[number], i: number) =>
      chip(
        `${p.id}-${i}`,
        `Destiny: ${p.name}`,
        // Destiny's chip is gold, with the diamond (WO-27); perks stay ember.
        <span className={styles.sumDestinyBody}>
          <i className={styles.destinyMark} aria-hidden="true" />
          {p.name}
        </span>,
        `${styles.sumDestiny} ${styles.sumKeep}`,
        () => onPerk(p.id),
      );
    if (at >= 5 && perkList.length > 1) {
      out.push(chip("perks", treeTip([...byTree]), `${perkList.length} perks`, perkCls, () => onPerk(perkList[0].id)));
    } else if (at >= 4) {
      for (const [tree, ps] of byTree) {
        if (tree === "Destiny") ps.forEach((p, i) => out.push(destinyChip(p, i)));
        else
          out.push(
            chip(`tree-${tree}`, treeTip([[tree, ps]]), <IconLabel icon={<SkillIcon name={tree} />}>{`${tree} ×${ps.length}`}</IconLabel>, perkCls, () => onPerk(ps[0].id)),
          );
      }
    } else
      perkList.forEach((p, i) =>
        out.push(
          p.tree === "Destiny"
            ? destinyChip(p, i)
            : chip(
                `${p.id}-${i}`,
                `Perk: ${perkName(p)}${p.tree !== p.name ? ` (${p.tree}${p.book ? ", book" : ""})` : ""}`,
                <IconLabel icon={<SkillIcon name={p.tree} />}>{perkName(p)}</IconLabel>,
                perkCls,
                () => onPerk(p.id),
              ),
        ),
      );
    if (at < 3 && f.stone)
      out.push(
        chip(
          "stone",
          `${f.stone.name === "none" ? "No stone" : `The ${f.stone.name}`}${f.stone.prev ? ` (in place of The ${f.stone.prev})` : ""}`,
          f.stone.name === "none" ? "No stone" : <IconLabel icon={<SignIcon name={f.stone.name} />}>The {f.stone.name}</IconLabel>,
          styles.sumWide,
        ),
      );
    // One Gear chip at a level with new gear, which goes to Gear at level N (WO-32).
    if (at < 2 && f.gear.length > 0)
      out.push(
        chip("gear", f.gear.map(gearChangeText).join("\n"), <IconLabel icon={<SlotIcon slot="Other" />}>Gear</IconLabel>, `${styles.sumGear} ${styles.sumWide}`, () =>
          document.getElementById("gear-at-level")?.scrollIntoView({ block: "start" }),
        ),
      );
    if (noted) out.push(chip("note", "The author left a note for this level", <IconLabel icon={<MarkIcon name="note" />}>Note</IconLabel>, styles.sumWide));
    return out;
  };
  const shown = chips(fold, false);
  // A chip is never cut: what doesn't fit is behind `+N more`, which goes to the level card (WO-77).
  const moreButton = (n: number, plain: boolean) =>
    plain ? (
      <span key="more" className={`${styles.sumChip} ${styles.sumMore}`}>
        +{n} more
      </span>
    ) : (
      <button key="more" type="button" className={`${styles.sumChip} ${styles.sumMore}`} onClick={() => document.getElementById("level-card")?.scrollIntoView({ block: "start" })}>
        +{n} more
      </button>
    );
  return (
    <span ref={row} className={styles.summary} aria-label={`What level ${level} changed`}>
      {keep === null ? shown : [...shown.slice(0, keep), moreButton(shown.length - keep, false)]}
      {Array.from({ length: FOLDS }, (_, at) => {
        const copy = chips(at, true);
        return (
          <span
            key={at}
            ref={(el) => {
              measures.current[at] = el;
            }}
            className={styles.sumMeasure}
            aria-hidden="true"
          >
            {copy}
            {at === FOLDS - 1 && moreButton(copy.length, true)}
          </span>
        );
      })}
    </span>
  );
}

/** The level card's labels that have a marker icon (WO-30). */
const KEY_MARKS: Record<string, "trainer" | "skill-book" | "banked"> = { Trainer: "trainer", "Skill book": "skill-book", "Skill books": "skill-book", Banked: "banked", Unspent: "banked" };

/**
 * The level card: what to do at this level, in the order the game asks (attribute, skill points,
 * perks, stone, trainers, books), with the author's note beside it.
 */
export function LevelCard({
  d,
  build,
  states,
  level,
  note,
  onPerk,
  glance,
}: {
  d: GameData;
  build: Pick<BuildViewData, "plan" | "author">;
  states: LevelState[];
  level: number;
  note: GuideDoc | null;
  onPerk?: (id: string) => void;
  /**
   * A card to look at, one after another (the coming soon page, WO-86): the first three skills, four
   * perks and three gear lines ("and N more"), the note's opening sentences, nothing to press, and a
   * fixed height so it never jumps.
   */
  glance?: boolean;
}) {
  const { plan } = build;
  // "and 4 more", under a list cut short.
  const more = (n: number) => (n > 0 ? <span className="muted">and {n} more</span> : null);
  const s = states[level - 1];
  const changes = levelChanges(d, plan, states, level);
  const rows: [string, React.ReactNode][] = [];
  // The rule behind a row, from the engine's own numbers (WO-17's wording in the editor).
  const tips: Record<string, string> = {
    Banked: "Skill points not spent at a level carry over to the next level-up.",
    Unspent: "Skill points the build's last level leaves unspent.",
    Trainer: `${d.rules.trainerSessionsPerLevel} trainer sessions a level, +1 to a skill each; unused ones carry over to later levels. A trainer can't raise a skill past the level's max skill.`,
    "Skill book": `+1 to a skill (+2 with the Skilled trait), never past the level's max skill.`,
    "Skill books": `+1 to a skill each (+2 with the Skilled trait), never past the level's max skill.`,
    "Standing stone": "One stone at a time: choosing a new one replaces the old. Its bonus counts from that level on.",
  };

  const facts = levelFacts(d, plan, states, level);
  // A stretch (WO-69): its attribute level-ups, most first; each perk with its requirement; long lists in two columns.
  const span = stretchAt(plan, level);
  const isStretch = span.from > 1 && span.from < span.to;
  const title = isStretch ? `Levels ${span.from} to ${span.to}` : `Level ${level}`;
  const counts = Object.entries(plan.levels[level - 1].attributes ?? {})
    .filter(([, n]) => (n ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)) as [keyof typeof ATTRIBUTE_NAMES, number][];
  if (isStretch && counts.length)
    rows.push([
      "Attributes",
      <span key="as" className={styles.attrCounts}>
        {counts.map(([a, n]) => (
          <IconLabel key={a} icon={<AttributeIcon name={a} size={24} />}>
            +{d.rules.attributePerLevel * n} {ATTRIBUTE_NAMES[a]}
          </IconLabel>
        ))}
      </span>,
    ]);
  if (facts.attribute)
    rows.push([
      "Attribute",
      <IconLabel key="a" icon={<AttributeIcon name={facts.attribute} size={24} />}>+5 {ATTRIBUTE_NAMES[facts.attribute]}</IconLabel>,
    ]);

  // Skill points: biggest gain first; the level's limit under every skill that reached it (WO-72).
  const { raised } = facts;
  if (raised.length)
    rows.push([
      "Skill points",
      <GainColumns
        key="s"
        columns={!glance && isStretch && raised.length > 6}
        more={glance ? more(raised.length - 3) : null}
        rows={(glance ? raised.slice(0, 3) : raised).map((r) => ({
          skill: r.sk,
          gain: r.n,
          from: r.from,
          to: r.to,
          note: !glance && r.to >= s.maxSkill ? `(max skill ${s.maxSkill} at level ${level})` : undefined,
        }))}
      />,
    ]);

  // A stretch lists its perks by tree, requirement and name (WO-72).
  const perksShown = isStretch ? stretchPerkOrder(d, changes.perks) : changes.perks;
  const perkLines = [
    ...(glance ? perksShown.slice(0, 4) : perksShown).map((p, i) => (
      <span key={`${p.id}-${i}`}>
        {glance ? (
          <span className={styles.perkLink}>
            {p.name}
            {p.rank ? ` ${p.rank}` : ""}
          </span>
        ) : (
          <button type="button" className={styles.perkLink} onClick={() => onPerk?.(p.id)}>
            {p.name}
            {p.rank ? ` ${p.rank}` : ""}
          </button>
        )}{" "}
        <span className="muted">{isStretch ? stretchPerkRequirement(d, p.id, p.tree, p.rank) : p.tree !== p.name ? `(${p.tree}${p.book ? ", book" : ""})` : p.book ? "(book)" : ""}</span>
      </span>
    )),
  ];
  if (perkLines.length)
    rows.push([
      perksShown.length > 1 ? "Perks" : "Perk",
      <span key="p" className={`${styles.stack} ${isStretch && perkLines.length > 6 ? styles.twoCols : ""}`}>
        {perkLines}
        {glance && more(perksShown.length - 4)}
      </span>,
    ]);
  // Destiny: its own row after the perks, in its own colour (WO-27).
  if (changes.destiny.length)
    rows.push([
      "Destiny",
      <span key="d" className={styles.stack}>
        {changes.destiny.map((p) => (
          <span key={p.id}>
            {glance ? (
              <span className={`${styles.perkLink} ${styles.destinyLink}`}>{p.name}</span>
            ) : (
              <button type="button" className={`${styles.perkLink} ${styles.destinyLink}`} onClick={() => onPerk?.(p.id)}>
                {p.name}
              </button>
            )}
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
  // New gear (WO-32): each piece as "Cloak: Fur Cape, replaces Imperial Cloak", or "Accessory:
  // Histus Flask" for one that adds (WO-82), the piece in an ember chip; one taken off as
  // "Imperial Cloak (Cloak) removed", an old emptied slot as "Off hand emptied".
  if (facts.gear.length) {
    const before = level > 1 ? gearAt(plan, level - 1) : [];
    rows.push([
      "New gear",
      <span key="g" className={styles.newGear}>
        {(glance ? facts.gear.slice(0, 3) : facts.gear).map((g, i) => {
          const name = g.name.trim();
          const was = replacedName(g, before);
          return (
            <span key={i} className={styles.newGearRow}>
              {/* Free text, with no item behind it: the plain icon (WO-46). */}
              <SlotIcon slot={g.itemId || g.made ? g.slot : "Other"} size={24} />
              {name ? (
                <span className={styles.newGearWhat}>
                  <span className="muted">{g.slot}:</span>{" "}
                  <span className={styles.newGearChip}>{name}</span>
                  {g.made && <MadeMark made={g.made} />}
                  {/* One that adds: just the type and the piece (WO-73, WO-82). */}
                  {was && <span className={`muted ${styles.newGearReplaces}`}>, replaces {was}</span>}
                  {/* The author's note on its own line (WO-47), as a new spell shows its where. */}
                  {g.note.trim() && <span className={styles.newGearNote}>{g.note.trim()}</span>}
                </span>
              ) : (
                <span>{gearChangeText(g)}</span>
              )}
            </span>
          );
        })}
        {glance && more(facts.gear.length - 3)}
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
  // New abilities and shouts (WO-52), built the same way; a perk's ability shows at the perk's level.
  const newAbilities = abilitiesAt(d, plan, level).filter((x) => x.ability);
  if (newAbilities.length)
    rows.push([
      "New abilities",
      <span key="ab" className={styles.newSpells}>
        {newAbilities.map((x) => (
          <span key={`${x.fromRace ?? x.fromPerk ?? "row"}-${x.id}`} className={styles.newSpell}>
            <MarkIcon name="power" size={24} />
            <Tooltip content={<AbilityTip a={x} d={d} />}>
              <span className={styles.newSpellChip} tabIndex={0}>
                {x.ability!.name}
              </span>
            </Tooltip>
            <span className="muted">{abilitySource(d, x) ?? x.where}</span>
          </span>
        ))}
      </span>,
    ]);
  const newShouts = shoutsKnown(d, plan, level).filter((x) => x.shout && x.level === level);
  if (newShouts.length)
    rows.push([
      "New shouts",
      <span key="sh" className={styles.newSpells}>
        {newShouts.map((x) => (
          <span key={x.id} className={styles.newSpell}>
            <MarkIcon name="shout" size={24} />
            <Tooltip content={<ShoutTip s={x} />}>
              <span className={styles.newSpellChip} tabIndex={0}>
                {x.shout!.name}
              </span>
            </Tooltip>
            <span className="muted">
              {x.words} of 3 words{x.where ? `, ${x.where}` : ""}
            </span>
          </span>
        ))}
      </span>,
    ]);
  // On the build's last level nothing comes after to carry them to (WO-72).
  if (changes.banked > 0) rows.push([level === plan.levels.length ? "Unspent" : "Banked", `${changes.banked} skill point${changes.banked === 1 ? "" : "s"}`]);

  return (
    <section id={glance ? undefined : "level-card"} data-tour={glance ? undefined : "level-card"} aria-label={title} className={`${glance ? "" : "frame"} ${styles.card} ${styles.cardWithNote} ${glance ? styles.cardGlance : ""}`}>
      <div className={styles.cardMain}>
        <h2 className={styles.cardTitle}>{title}</h2>
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
        {!glance && s.issues.length > 0 && (
          <ul className={styles.issues} aria-label="Problems at this level">
            {s.issues.map((i, n) => (
              <li key={n}>{i.message}</li>
            ))}
          </ul>
        )}
      </div>
      {/* The author's column is always there: their name first, then the note (or that there isn't one). */}
      <aside aria-label="Author's note" className={styles.note}>
        {glance ? (
          <span className={styles.noteBy}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {build.author.image && <img src={build.author.image} alt="" width={24} height={24} className={styles.noteByPix} />}
            {build.author.name}
          </span>
        ) : (
          <AuthorLink author={build.author} className={styles.noteBy} avatar={<Avatar name={build.author.name} image={build.author.image} size={24} />} />
        )}
        <h3 className={`label ${styles.noteHead}`}>{isStretch ? "About this level range" : "About this level"}</h3>
        {note && glance ? (
          <p className={styles.glanceNote}>{openingSentences(docText(note))}</p>
        ) : note ? (
          <LevelNote key={level} doc={note} level={level} lines={12} label={isStretch ? `About levels ${span.from} to ${span.to}` : undefined} />
        ) : (
          <p className={`muted ${styles.noNote}`}>No note for this level{isStretch ? " range" : ""}.</p>
        )}
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
  ownerControls,
  startRun,
  storyHref,
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
  ownerControls?: React.ReactNode;
  startRun?: string | null;
  storyHref?: string | null;
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
    <section
      ref={hero}
      aria-label="Build"
      className={`${styles.cover} ${build.coverImageUrl ? "" : styles.coverPlain} ${!build.coverImageUrl && themeOf(build.plan.theme).vars["hero-art"] !== "none" ? styles.coverArt : ""}`}
    >
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
            {build.example && <ExampleTag />}
            {/* A build that skips ahead (WO-69): the levels written, runs collapsed. */}
            {skips(build.plan) && <span className={styles.writtenLevels}>{levelsLine(writtenLevels(build.plan))}</span>}
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
          {/* Drafted by an assistant's tools (WO-110), while the author shows it. */}
          {build.draftedBy && build.showDrafted !== false && <p className={`${styles.drafted} ${styles.heroIn} ${styles.heroIn3}`}>Drafted with {build.draftedBy}</p>}
          {storyHref && (
            <span className={`${styles.readStory} ${styles.heroIn} ${styles.heroIn3}`}>
              <ReaderLink href={storyHref} className={`btn ${styles.readStoryButton}`}>
                Read the story from the beginning
              </ReaderLink>
            </span>
          )}
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
          {/* The owner has Copy link and Edit in their controls; the hero doesn't repeat them. */}
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
          {/* The owner's controls (WO-116a): who can see it, Copy link, Set up, Edit; then Start a run (WO-116). */}
          {ownerControls}
          {startRun && (
            <Link className="btn" href={startRun}>
              Start a run
            </Link>
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
 * The admin's More menu on a build page (WO-39): feature the build on Browse, or stop (only Listed
 * builds can be featured; featuring one replaces the last), and Export it (WO-90).
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
        <>
          <button type="button" role="menuitem" tabIndex={-1} className={menuStyles.menuItem} onClick={() => toggle(close)} disabled={pending || (!featured && !listed)}>
            <span className={menuStyles.menuText}>
              <span className={menuStyles.menuLabel}>{featured ? "Stop featuring" : "Feature this build"}</span>
              <span className={menuStyles.menuSub}>{featured ? "Browse goes back to its usual order." : listed ? "First on Browse, and larger." : "Only Listed builds can be featured."}</span>
            </span>
          </button>
          {/* Export (WO-90): the build as a file, to import into another environment from /admin. */}
          <a role="menuitem" tabIndex={-1} className={menuStyles.menuItem} href={`/api/builds/${buildId}/export`} download onClick={() => close()}>
            <span className={menuStyles.menuText}>
              <span className={menuStyles.menuLabel}>Export</span>
              <span className={menuStyles.menuSub}>The build, its tags and its guide, as a file to import elsewhere.</span>
            </span>
          </a>
        </>
      )}
    </MenuButton>
  );
}

/** The stepper's stretch (WO-69): where the open one starts, and the ones either side. */
function stretchSteps(plan: BuildViewData["plan"], level: number): { from: number; prev: number | null; next: number | null } {
  const all = stretches(plan);
  const i = all.findIndex((x) => x.to === level);
  return { from: all[i]?.from ?? level, prev: all[i - 1]?.to ?? null, next: all[i + 1]?.to ?? null };
}


/** A note's opening sentences, about 180 characters, for a card at a glance (WO-86). */
function openingSentences(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    if (out && (out + s).length > 180) break;
    out += s;
  }
  return out.trim();
}

/** Skill gains, in two columns when a stretch raises more than 6 skills (WO-69); `more` under them. */
function GainColumns({ rows, columns, more }: { rows: React.ComponentProps<typeof SkillGains>["rows"]; columns: boolean; more?: React.ReactNode }) {
  if (!columns)
    return more ? (
      <span className={styles.stack}>
        <SkillGains rows={rows} />
        {more}
      </span>
    ) : (
      <SkillGains rows={rows} />
    );
  const half = Math.ceil(rows.length / 2);
  return (
    <span className={styles.twoCols}>
      <SkillGains rows={rows.slice(0, half)} />
      <SkillGains rows={rows.slice(half)} />
    </span>
  );
}

