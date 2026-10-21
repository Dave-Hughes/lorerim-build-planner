"use client";

import { useMemo } from "react";
import { useGameData } from "@/components/game-data";
import { levelFacts } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { gearChangeText, gearChanges } from "@/lib/rules/gear";
import { THEMES, themeOf, themeStyle, type ThemeId } from "@/lib/themes";
import type { BuildPlan } from "@/lib/rules/types";
import { GameIcon } from "@/components/ui/skill-icon";
import { InfoTip } from "@/components/ui/info-tip";
import styles from "./theme-picker.module.css";

/**
 * The guide theme, in Set up's Details step (WO-37): five cards, each a small drawing of the build
 * page in that theme, then the top of this build's own page in the chosen one.
 */
export function ThemePicker({
  plan,
  onPick,
  name,
  description,
  coverImageUrl,
  introStart,
}: {
  plan: BuildPlan;
  onPick: (theme: ThemeId) => void;
  name: string;
  description: string;
  coverImageUrl: string;
  introStart?: string;
}) {
  const current = themeOf(plan.theme).id;
  return (
    <fieldset className={styles.fieldset}>
      <legend className="label">
        Theme<InfoTip label="About the theme" text="The look of this build's page. Layout stays the same." />
      </legend>
      <div className={styles.cards}>
        {THEMES.map((t) => (
          <button key={t.id} type="button" className={styles.card} aria-pressed={t.id === current} onClick={() => onPick(t.id)}>
            <span className={styles.mini} style={themeStyle(t.id)} aria-hidden="true">
              <span className={styles.miniHero}>
                <span className={styles.miniTitle} />
              </span>
              <span className={styles.miniIntro}>
                <span className={styles.miniCap} />
                <span className={styles.miniLines}>
                  <span />
                  <span />
                </span>
              </span>
              <span className={styles.miniRule} />
              <span className={styles.miniChips}>
                <span />
                <span />
                <span />
              </span>
              <span className={styles.miniPanel} />
            </span>
            <span className={styles.cardName}>{t.name}</span>
            <span className={styles.cardLine}>{t.line}</span>
          </button>
        ))}
      </div>
      <ThemePreview plan={plan} name={name} description={description} coverImageUrl={coverImageUrl} introStart={introStart} />
    </fieldset>
  );
}

const SAMPLE_INTRO = "The intro you write in the Guide opens here, with a large first letter, like the game's books.";

/** The top of this build's page in the chosen theme: name, description, intro start and a level. */
function ThemePreview({ plan, name, description, coverImageUrl, introStart }: { plan: BuildPlan; name: string; description: string; coverImageUrl: string; introStart?: string }) {
  const d = useGameData();
  const theme = themeOf(plan.theme);
  const level = useMemo(() => {
    const states = computeBuild(plan, d);
    // The last level that changed gear, else the last level that raised a skill, else the last.
    const n = plan.levels.length;
    const withGear = [...Array(n).keys()].reverse().find((i) => gearChanges(plan, i + 1).length > 0);
    const withSkill = [...Array(n).keys()].reverse().find((i) => Object.values(plan.levels[i].skillPoints).some((v) => v > 0));
    const at = (withGear ?? withSkill ?? n - 1) + 1;
    const facts = levelFacts(d, plan, states, at);
    return { at, raised: facts.raised[0], gear: gearChanges(plan, at)[0] };
  }, [plan, d]);
  // About four lines: cut at a word.
  const full = introStart || SAMPLE_INTRO;
  const intro = full.length > 320 ? `${full.slice(0, 320).replace(/[\s,.;:]+\S*$/, "")}…` : full;
  const chips = [plan.race, plan.birthsign && `The ${plan.birthsign}`, plan.deity].filter(Boolean).join(", ");
  return (
    <div className={styles.preview} style={themeStyle(theme.id)} data-theme={theme.id} aria-label={`Preview in ${theme.name}`} role="img">
      <div className={styles.hero}>
        {coverImageUrl && (
          <>
            <span className={styles.heroImage} style={{ backgroundImage: `url("${coverImageUrl}")`, backgroundPosition: plan.coverFocus ? `${plan.coverFocus.x}% ${plan.coverFocus.y}%` : undefined }} />
            <span className={styles.heroTint} />
          </>
        )}
        <span className={styles.heroFade} />
        <div className={styles.heroText}>
          <span className={`title ${styles.name}`}>{name || "This build"}</span>
          {description && <span className={`flavor ${styles.description}`}>{description}</span>}
        </div>
      </div>
      <div className={styles.body}>
        <span className={styles.ornament} aria-hidden="true">
          <span />
          <span className={styles.diamond} />
          <span />
        </span>
        <p className={styles.intro}>
          <span className={styles.cap}>{intro.charAt(0)}</span>
          {intro.slice(1)}
        </p>
        {/* The build page's folder tabs (WO-60), small, Levels open (WO-73). */}
        <div className={styles.tabs}>
          <span className={`${styles.tab} ${styles.tabOn}`}>
            <GameIcon file="tab-levels" size={16} />
            Levels
          </span>
          <span className={styles.tab}>
            <GameIcon file="tab-guide" size={16} />
            Guide
          </span>
        </div>
        {chips && (
          <div className={styles.chips}>
            <span className={`${styles.chip} ${styles.chipMuted}`}>{chips}</span>
          </div>
        )}
        <div className={styles.panel}>
          <span className={`title ${styles.level}`}>Level {level.at}</span>
          {level.raised && (
            <span>
              {level.raised.sk} <b className={styles.accent}>+{level.raised.n}</b>{" "}
              <span className={styles.muted}>
                {level.raised.from} → {level.raised.to}
              </span>
            </span>
          )}
          {level.gear && (
            <span>
              <span className={styles.gear}>{level.gear.name.trim() || gearChangeText(level.gear)}</span>
              {level.gear.name.trim() && level.gear.replaces && <span className={styles.muted}> replaces {level.gear.replaces}</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
