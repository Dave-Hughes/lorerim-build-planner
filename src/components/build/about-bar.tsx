"use client";

import { useId, useRef, useState } from "react";
import { useGameData } from "@/components/game-data";
import { deityChanges } from "@/lib/rules/derive";
import { Tooltip } from "@/components/ui/tooltip";
import { IconLabel, RaceIcon, SignIcon, ModeIcon, DeityIcon } from "@/components/ui/skill-icon";
import { traitWithChoice } from "@/lib/rules/trait-choices";
import type { BuildPlan } from "@/lib/rules/types";
import { useDismiss } from "@/lib/use-dismiss";
import styles from "./about-bar.module.css";

const plain = (s: string) => s.replace(/<([^<>]*)>/g, "$1");

/** A value with the WO-17 tooltip: a dotted underline, the tip on hover and focus. */
function Tip({ tip, children }: { tip: React.ReactNode; children: React.ReactNode }) {
  return (
    <Tooltip content={<span className={styles.tip}>{tip}</span>}>
      <span className={styles.tipValue} tabIndex={0}>
        {children}
      </span>
    </Tooltip>
  );
}

/**
 * The about bar: Race, Birthsign, Deity, Traits, Game mode, Start. Every value explains itself
 * from facts the planner holds or the game's own words; the Start opens a popover.
 */
export function AboutBar({ plan }: { plan: BuildPlan }) {
  const d = useGameData();
  const race = d.raceByName.get(plan.race);
  const sign = d.signByName.get(plan.birthsign);
  const deity = d.deityText[plan.deity];
  const noSign = plan.traits.includes("Master of Destiny");
  const changes = deityChanges(plan);

  const items: [string, React.ReactNode][] = [
    [
      "Race",
      race ? (
        <Tip
          tip={
            <>
              <span>
                Starts with {race.health} Health, {race.magicka} Magicka, {race.stamina} Stamina.
              </span>
              <span>
                +15 {race.primary}. +10 {race.secondary.join(", ")}.
              </span>
            </>
          }
        >
          <IconLabel icon={<RaceIcon name={race.name} />}>{race.name}</IconLabel>
        </Tip>
      ) : (
        plan.race || "Not chosen yet"
      ),
    ],
    [
      "Birthsign",
      noSign ? (
        "None (Master of Destiny)"
      ) : sign ? (
        <Tip tip={<span className={styles.gameWords}>{sign.text}</span>}>
          <IconLabel icon={<SignIcon name={sign.name} />}>The {sign.name}</IconLabel>
        </Tip>
      ) : (
        "Not chosen yet"
      ),
    ],
    [
      "Deity",
      <span key="deity" className={styles.deityValue}>
        {plan.deity && deity ? (
        <Tip
          tip={
            <>
              {/* The head: the deity's icon and name (WO-34). */}
              <span className={styles.tipDeity}>
                <IconLabel icon={<DeityIcon name={plan.deity} size={24} />}>{plan.deity}</IconLabel>
              </span>
              {(["follower", "devotee"] as const).map((part) =>
                deity[part] ? (
                  <span key={part} className={styles.tipPart}>
                    <span className={styles.tipHead}>
                      {part === "follower" ? "Follower" : "Devotee"}: {deity[part]!.name}
                    </span>
                    <span className={styles.gameWords}>{plain(deity[part]!.text)}</span>
                  </span>
                ) : null,
              )}
              {deity.tenets && (
                <span className={styles.tipPart}>
                  <span className={styles.tipHead}>{deity.tenets.name}</span>
                  <span className={styles.gameWords}>{plain(deity.tenets.text)}</span>
                </span>
              )}
            </>
          }
        >
          <IconLabel icon={<DeityIcon name={plan.deity} />}>{plan.deity}</IconLabel>
        </Tip>
        ) : (
          plan.deity || "Not chosen yet"
        )}
        {/* Later changes (WO-43): the starting deity stays; an "i" says when it changes. */}
        {changes.length > 0 && (
          <span className="tip">
            <Tooltip
              content={
                <span className={styles.changeLines}>
                  {changes.map((c) => (
                    <span key={c.level}>
                      Changes to {c.name} at level {c.level}.
                    </span>
                  ))}
                </span>
              }
            >
              <button type="button" aria-label="Deity changes">
                <span>i</span>
              </button>
            </Tooltip>
          </span>
        )}
      </span>,
    ],
    [
      "Traits",
      plan.traits.length ? (
        <span className={styles.list}>
          {plan.traits.map((t, i) => {
            const trait = d.traitByName.get(t);
            const label = traitWithChoice(t, plan.traitChoices);
            return (
              <span key={t}>
                {trait ? <Tip tip={<span className={styles.gameWords}>{plain(trait.text)}</span>}>{label}</Tip> : label}
                {i < plan.traits.length - 1 ? ", " : ""}
              </span>
            );
          })}
        </span>
      ) : (
        "None"
      ),
    ],
    ...(plan.masterOfOneSkill ? [["Master of One", plan.masterOfOneSkill] as [string, React.ReactNode]] : []),
    [
      "Game mode",
      <Tip
        key="mode"
        tip={
          plan.mode === "Naaktiid"
            ? `+${d.rules.naaktiidBonusPerkPoints} perk points at level 1 and +${d.rules.naaktiidCarryWeight} carry weight.`
            : "The classic rules: no extra perk points or carry weight."
        }
      >
        <IconLabel icon={<ModeIcon mode={plan.mode} />}>{plan.mode}</IconLabel>
      </Tip>,
    ],
    ["Start", <StartValue key="start" plan={plan} />],
  ];

  return (
    <section aria-label="Character" className={styles.bar}>
      {items.map(([label, value]) => (
        <div key={label} className={styles.item}>
          <span className="label">{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
      ))}
    </section>
  );
}

/**
 * The start: its name with the choice muted ("Mercenary, Hammerfell"; the name alone with no
 * choice or Random). A popover with the start's own text opens on hover and on click or tap, and
 * closes on Esc or a click outside.
 */
function StartValue({ plan }: { plan: BuildPlan }) {
  const d = useGameData();
  const start = d.startByName.get(plan.start);
  const id = useId();
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const open = hover || pinned;
  const button = useRef<HTMLButtonElement>(null);
  useDismiss({
    open,
    onClose: () => {
      setHover(false);
      setPinned(false);
    },
    inside: [wrap],
    trigger: button,
  });
  if (!start) return <>{plan.start || "Not chosen yet"}</>;
  const option = plan.startOption && plan.startOption !== "Random" ? plan.startOption : null;
  return (
    <span ref={wrap} className={styles.startWrap} onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)} onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}>
      <button ref={button} type="button" className={styles.startButton} aria-expanded={open} aria-controls={id} aria-haspopup="dialog" onClick={() => setPinned((p) => !p)}>
        <span className={styles.startName}>{start.name}</span>
        {option && <span className={styles.startOption}>, {option}</span>}
      </button>
      {open && (
        <span id={id} role="dialog" aria-label={`Start: ${start.name}`} className={styles.popover}>
          <span className={styles.popName}>{start.name}</span>
          {plan.startOption && (
            <span className={styles.popChoice}>
              {start.optionLabel ?? "Choice"}: {plan.startOption}
            </span>
          )}
          <span className={`${styles.popText} ${styles.gameWords}`}>{start.text}</span>
          <span className={styles.popSource}>{start.source}</span>
        </span>
      )}
    </span>
  );
}
