"use client";

import Link from "next/link";
import { MAX_TAGS, TAGS, TAG_GROUPS, suggestedTags } from "@/lib/builds/tags";
import { useRouter } from "next/navigation";
import { TRAIT_CHOICES, keptTraitChoices } from "@/lib/rules/trait-choices";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import { Tooltip } from "@/components/ui/tooltip";
import { EditBar } from "@/components/editor/edit-bar";
import { authorTourPending } from "@/lib/tour";
import { AttributeIcon, IconLabel, RaceIcon, SignIcon, SkillLabel, ModeIcon, TagIcon, DeityIcon } from "@/components/ui/skill-icon";
import { copyBuildForVersion, createBuild, saveBuildDetails, saveBuildPlan } from "@/lib/builds/actions";
import { checkStep, type StepCheck } from "@/lib/builds/steps";
import { STEPS, STEP_NAMES, clearDraft, emptyDetails, emptyPlan, loadDraft, saveDraft, type Step } from "@/lib/builds/draft";
import type { BuildDetails } from "@/lib/builds/validate";
import { GameDataProvider, useGameData } from "@/components/game-data";
import { convertPlan, droppedSentence, missingIn } from "@/lib/rules/convert";
import { gameData, requireGameData } from "@/lib/rules/data";
import { shippedVersions } from "@/lib/rules/versions";
import { emptyLevel } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import type { BuildPlan } from "@/lib/rules/types";
import { ThemePicker } from "./theme-picker";
import { themeOf } from "@/lib/themes";
import { useDismiss } from "@/lib/use-dismiss";
import { YOUTUBE_ERROR, youtubeVideoId } from "@/lib/builds/youtube";
import styles from "./wizard.module.css";

interface WizardProps {
  mode: "create" | "edit";
  buildId?: string;
  initialPlan?: BuildPlan;
  initialDetails?: BuildDetails;
  signedIn: boolean;
  /** Sign-in button for the last step, rendered by the server. */
  signIn: React.ReactNode;
  /** The start of the build's guide intro, for the theme preview (edit only). */
  introStart?: string;
}

function plainTraitText(text: string): string {
  return text.replace(/<([^<>]*)>/g, "$1");
}

/** The game's description, with the numbers it highlights set in a brighter weight. */
function TraitText({ text }: { text: string }) {
  const parts = text.split(/<([^<>]*)>/);
  return (
    <>
      {parts.map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part))}
    </>
  );
}

export function Wizard({ mode, buildId, initialPlan, initialDetails, signedIn, signIn, introStart }: WizardProps) {
  const router = useRouter();
  // Rendered on the client only (see wizard-loader.tsx), so the draft in this
  // browser can seed the state directly.
  const [draft] = useState(() => (mode === "create" ? loadDraft() : null));
  // A draft for a version the planner no longer has starts over.
  const [plan, setPlan] = useState<BuildPlan>(() => initialPlan ?? (draft && gameData(draft.plan.gameVersion) ? draft.plan : null) ?? emptyPlan());
  // The wizard holds the plan, so it reads the plan's version directly and provides it to the steps.
  const d = requireGameData(plan.gameVersion);
  const [details, setDetails] = useState<BuildDetails>(() => initialDetails ?? draft?.details ?? emptyDetails());
  const [step, setStepState] = useState<Step>(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("step") as Step | null;
    if (fromUrl && STEPS.includes(fromUrl)) return fromUrl;
    return draft?.step ?? "race";
  });
  const [draftStatus, setDraftStatus] = useState<"none" | "saving" | "saved" | "failed">(draft ? "saved" : "none");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const dirty = useRef(false);

  // Keep the draft in this browser while a new build is being set up.
  useEffect(() => {
    if (mode !== "create" || !dirty.current) return;
    const t = setTimeout(() => setDraftStatus(saveDraft({ plan, details, step }) ? "saved" : "failed"), 300);
    return () => clearTimeout(t);
  }, [mode, plan, details, step]);

  // "Draft saved" means the latest change is in the browser, so a change clears it until the save runs.
  const touch = useCallback(() => {
    dirty.current = true;
    setDraftStatus((st) => (st === "failed" ? st : "saving"));
  }, []);
  const update = useCallback(
    (fn: (p: BuildPlan) => BuildPlan) => {
      touch();
      setPlan((p) => fn(p));
    },
    [touch],
  );
  const updateDetails = useCallback(
    (patch: Partial<BuildDetails>) => {
      touch();
      setDetails((d) => ({ ...d, ...patch }));
    },
    [touch],
  );
  const setStep = useCallback((s: Step) => {
    touch();
    setStepState(s);
    const url = new URL(window.location.href);
    url.searchParams.set("step", s);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  }, [touch]);

  const stepIndex = STEPS.indexOf(step);
  const masterOfDestiny = plan.traits.includes("Master of Destiny");

  const startState = useMemo(() => {
    if (!plan.race) return null;
    return computeBuild({ ...plan, levels: [emptyLevel()] }, d)[0];
  }, [plan, d]);

  // Each step done, not started or with a problem, from the same checks (WO-58).
  const checks = Object.fromEntries(STEPS.map((st) => [st, checkStep(d, plan, details.name, st)])) as Record<Step, StepCheck>;
  const summaries: Record<Step, React.ReactNode> = {
    race: plan.race || "Not chosen",
    birthsign: masterOfDestiny ? "Removed by Master of Destiny" : plan.birthsign ? `The ${plan.birthsign}` : "Not chosen",
    skills: `${plan.majors.length} major${plan.majors.length === 1 ? "" : "s"}, ${plan.minors.length} minor${plan.minors.length === 1 ? "" : "s"}`,
    traits: `${plan.traits.length} of ${d.rules.maxTraits} chosen`,
    deity: plan.deity ? d.deities.includes(plan.deity) ? <IconLabel icon={<DeityIcon name={plan.deity} />}>{plan.deity}</IconLabel> : plan.deity : "None",
    mode: `${plan.mode}${plan.start ? `, ${plan.start}${plan.startOption && plan.startOption !== "Random" ? `, ${plan.startOption}` : ""}` : ""}`,
    name: `${themeOf(plan.theme).name} theme`,
  };

  const finish = () =>
    start(async () => {
      setError(null);
      if (mode === "create") {
        // Tags not touched yet are the suggestions the Name step showed.
        const r = await createBuild({ details: { ...details, tags: details.tags ?? suggestedTags(plan.majors) }, plan });
        if (!r.ok) return setError(r.error);
        clearDraft();
        // Tapps shows the author round level 1, once (WO-61).
        authorTourPending();
        router.push(`/b/${r.value.id}/edit`);
      } else if (buildId) {
        const a = await saveBuildDetails(buildId, { ...details, tags: details.tags ?? suggestedTags(plan.majors) });
        if (!a.ok) return setError(a.error);
        const b = await saveBuildPlan(buildId, plan);
        if (!b.ok) return setError(b.error);
        router.push(`/b/${buildId}/edit`);
      }
    });

  const startOver = () => {
    clearDraft();
    dirty.current = false;
    setPlan(emptyPlan());
    setDetails(emptyDetails());
    setDraftStatus("none");
    setStep("race");
  };

  const headerStatus = mode === "create" ? (draftStatus === "saved" ? "Draft saved" : draftStatus === "failed" ? "Draft not saved" : null) : null;

  return (
    <>
      {mode === "edit" && buildId ? (
        <EditBar buildId={buildId} name={details.name || "This build"} current="setup" visibility={details.visibility} onVisibility={(visibility) => updateDetails({ visibility })} />
      ) : (
        <FocusHeader
          context="New build"
          status={headerStatus}
          actions={
            <Link href="/" className="btn btn-sm">
              Exit
            </Link>
          }
        />
      )}
      <div className={`page ${styles.layout}`}>
        <aside aria-label="Setup steps" className={styles.aside}>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => {
              const check = checks[s];
              const state = i === stepIndex ? "now" : check.state;
              return (
                <li key={s}>
                  <button
                    type="button"
                    className={`${styles.stepRow} ${styles[state]}`}
                    onClick={() => setStep(s)}
                    aria-current={state === "now" ? "step" : undefined}
                    aria-label={`${STEP_NAMES[s]}: ${state === "done" ? "done" : state === "problem" ? check.state === "problem" ? check.problem : "" : state === "now" ? "this step" : "not started"}`}
                  >
                    <span className={styles.stepMark} aria-hidden="true">
                      <span>{state === "done" ? <PixelCheck /> : state === "problem" ? "!" : i + 1}</span>
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepName}>{STEP_NAMES[s]}</span>
                      <span className={styles.stepVal}>{state === "problem" && check.state === "problem" ? check.problem : summaries[s]}</span>
                      {s === "race" && <span className={styles.stepVal}>{d.version.label}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {startState && (
            <div className={`frame ${styles.startPanel}`}>
              <span className="label">Starting point</span>
              <div className={styles.hms}>
                <div className={styles.health}>
                  <span className="big-num">{startState.health}</span>
                  <IconLabel icon={<AttributeIcon name="Health" />} className={styles.hmsName}>
                    Health
                  </IconLabel>
                </div>
                <div className={styles.magicka}>
                  <span className="big-num">{startState.magicka}</span>
                  <IconLabel icon={<AttributeIcon name="Magicka" />} className={styles.hmsName}>
                    Magicka
                  </IconLabel>
                </div>
                <div className={styles.stamina}>
                  <span className="big-num">{startState.stamina}</span>
                  <IconLabel icon={<AttributeIcon name="Stamina" />} className={styles.hmsName}>
                    Stamina
                  </IconLabel>
                </div>
              </div>
              <div className={styles.topSkills}>
                {/* Majors, then minors, then any other skill the race raises. */}
                {[...plan.majors, ...plan.minors, ...d.skills.filter((s) => !plan.majors.includes(s) && !plan.minors.includes(s) && startState.skills[s] > d.rules.baseSkill).sort((a, b) => startState.skills[b] - startState.skills[a])]
                  .map((s) => ({ s, v: startState.skills[s] }))
                  .map(({ s, v }) => (
                    <div key={s}>
                      <SkillLabel name={s} />
                      <span className={styles.topVal}>{v}</span>
                    </div>
                  ))}
              </div>
              <span className={styles.startNote}>
                {startState.perkPoints} perk point{startState.perkPoints === 1 ? "" : "s"} to spend at level 1
              </span>
            </div>
          )}
          {mode === "create" && draftStatus === "saved" && (
            <button type="button" className={`btn btn-quiet btn-sm ${styles.startOver}`} onClick={startOver}>
              Start over
            </button>
          )}
        </aside>

        <main className={styles.main}>
          <GameDataProvider version={plan.gameVersion}>
            {/* The version, the first thing a new build sees (WO-36); the sidebar keeps its line. */}
            {step === "race" && <VersionBand plan={plan} update={update} mode={mode} buildId={buildId} />}
            {step === "race" && <RaceStep plan={plan} update={update} />}
            {step === "birthsign" && <BirthsignStep plan={plan} update={update} />}
            {step === "skills" && <SkillsStep plan={plan} update={update} />}
            {step === "traits" && <TraitsStep plan={plan} update={update} />}
            {step === "deity" && <DeityStep plan={plan} update={update} />}
            {step === "mode" && <ModeStep plan={plan} update={update} />}
            {step === "name" && <NameStep details={details} updateDetails={updateDetails} plan={plan} update={update} signedIn={signedIn} introStart={introStart} />}
          </GameDataProvider>

          <div className={styles.nav}>
            {stepIndex > 0 ? (
              <button type="button" className="btn" onClick={() => setStep(STEPS[stepIndex - 1])}>
                Back: {STEP_NAMES[STEPS[stepIndex - 1]]}
              </button>
            ) : (
              <span />
            )}
            <div className={styles.navRight}>
              {error && <span className="field-error">{error}</span>}
              {step === "traits" && plan.traits.length === 0 && (
                <button type="button" className="btn btn-quiet" onClick={() => setStep("deity")}>
                  Skip traits
                </button>
              )}
              {step !== "name" ? (
                <button type="button" className="btn btn-primary" onClick={() => setStep(STEPS[stepIndex + 1])} disabled={step === "race" && !plan.race}>
                  Next: {STEP_NAMES[STEPS[stepIndex + 1]]}
                </button>
              ) : signedIn ? (
                <button type="button" className="btn btn-primary" onClick={finish} disabled={pending || !details.name.trim() || !plan.race}>
                  {pending ? "Saving…" : mode === "create" ? "Create build" : "Save changes"}
                </button>
              ) : (
                <span className={styles.signIn}>
                  <span className="muted">Sign in to save it</span>
                  {signIn}
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

type StepProps = { plan: BuildPlan; update: (fn: (p: BuildPlan) => BuildPlan) => void };


/**
 * A choice card. Clicking anywhere on it does what its Choose / Chosen button does; the
 * button stays the keyboard control. Clicks on the card's own controls (the button, the
 * Master of One select) are left to them. No `onChoose` when the button is disabled.
 */
function ChoiceCard({ className, onChoose, children }: { className: string; onChoose?: () => void; children: React.ReactNode }) {
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("button, select, input, textarea, label, a")) return;
    if (window.getSelection()?.toString()) return;
    onChoose?.();
  };
  return (
    <article className={`${className} ${onChoose ? styles.cardPick : ""}`} onClick={onChoose ? onClick : undefined}>
      {children}
    </article>
  );
}

/**
 * The LoreRim version the build is for, at the top of the Race step: hard to miss, never in
 * the way. "Change" opens the list in place. A new build switches version after the same
 * "won't carry over" check as before; an existing build (setup page) is copied for the other
 * version instead, since other people may have its link.
 */
function VersionBand({ plan, update, mode, buildId }: StepProps & { mode: "create" | "edit"; buildId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [copying, startCopy] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const versions = shippedVersions();
  const current = versions.find((v) => v.current);
  const d = requireGameData(plan.gameVersion);
  const target = pending ? requireGameData(pending) : null;
  const dropped = target ? missingIn(target, plan) : [];
  const choose = (id: string) => {
    if (id === plan.gameVersion) return setPending(null);
    const to = requireGameData(id);
    if (missingIn(to, plan).length) return setPending(id);
    setPending(null);
    setOpen(false);
    update((p) => convertPlan(to, p).plan);
  };
  const band = useRef<HTMLElement>(null);
  const bandButton = useRef<HTMLButtonElement>(null);
  useDismiss({ open, onClose: () => setOpen(false), inside: [band], trigger: bandButton });
  const copyFor = (id: string) =>
    startCopy(async () => {
      if (!buildId) return;
      const r = await copyBuildForVersion(buildId, id);
      if (!r.ok) return setError(r.error);
      const q = new URLSearchParams({ from: plan.gameVersion });
      if (r.value.dropped) q.set("dropped", r.value.dropped);
      router.push(`/b/${r.value.id}/edit?${q}`);
    });
  return (
    <section ref={band} aria-label="LoreRim version" className={`frame ${styles.band}`}>
      <div className={styles.bandRow}>
        <span className={styles.bandText}>
          Building for LoreRim <span className={styles.bandVersion}>{d.version.id}</span>
          {d.version.current && <span className={`tag ${styles.bandTag}`}>Latest</span>}
        </span>
        <button ref={bandButton} type="button" className={`btn btn-sm ${styles.bandChange}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Change
        </button>
      </div>
      {open && (
        <div className={styles.bandPanel}>
          <ul className={styles.versionList} aria-label="LoreRim versions">
            {versions.map((v) => {
              const here = v.id === plan.gameVersion;
              return (
                <li key={v.id} className={styles.versionRow}>
                  <span className={styles.versionName}>
                    LoreRim {v.id}
                    {v.id === current?.id && <span className={`tag tag-sm ${styles.bandTag}`}>Latest</span>}
                  </span>
                  {v.released ? <span className="muted">{v.released}</span> : <span />}
                  {here ? (
                    <span className={styles.versionHere}>{mode === "create" ? "Chosen" : "This build"}</span>
                  ) : mode === "create" ? (
                    <button type="button" className="btn btn-sm" onClick={() => choose(v.id)}>
                      Choose
                    </button>
                  ) : (
                    <button type="button" className="btn btn-sm" onClick={() => copyFor(v.id)} disabled={copying}>
                      {copying ? "Copying…" : `Copy for ${v.id}`}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {error && <span className="field-error">{error}</span>}
          {target && (
            <div className={styles.versionNotice} role="alert">
              <p>
                {droppedSentence(target.version.id, dropped)} {dropped.length === 1 ? "It'll be removed." : "They'll be removed."}
              </p>
              <span className={styles.versionActions}>
                <button type="button" className="btn btn-sm" onClick={() => setPending(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    update((p) => convertPlan(target, p).plan);
                    setPending(null);
                    setOpen(false);
                  }}
                >
                  Confirm
                </button>
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** A race's abilities (WO-55): its powers, then its passives, each with the game's text. */
function raceAbilities(d: ReturnType<typeof useGameData>, race: string): { id: string; name: string; text: string }[] {
  const r = d.abilityFromRaces[race];
  if (!r) return [];
  const powers = r.powers.map((id) => d.abilityById.get(id)).filter((a): a is NonNullable<typeof a> => !!a);
  return [...powers.map((a) => ({ id: a.id, name: a.name, text: a.text })), ...r.passives];
}

/**
 * The Race step (WO-58, to the canvas artboard "Set up: race, folded"): each card is the icon,
 * name, +15 and +10 skills, Health, Magicka and Stamina, and the racial abilities' names as small
 * tags (the text on hover or focus). The chosen race's abilities, in full, once, under the grid.
 */
function RaceStep({ plan, update }: StepProps) {
  const d = useGameData();
  const chosen = d.raceByName.get(plan.race);
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose a race</h1>
      <div className={styles.raceCards}>
        {d.races.map((r) => {
          const on = plan.race === r.name;
          const choose = () => update((p) => ({ ...p, race: r.name }));
          return (
            <ChoiceCard key={r.name} className={`${styles.card} ${styles.raceCard} ${on ? styles.cardOn : ""}`} onChoose={choose}>
              {/* The name is the control, as the canvas has it: the whole card chooses on click. */}
              <h2 className={styles.cardName}>
                <button type="button" className={styles.raceName} aria-pressed={on} aria-label={`${on ? "Chosen" : "Choose"}: ${r.name}`} onClick={choose}>
                  <IconLabel icon={<RaceIcon name={r.name} size={32} />}>{r.name}</IconLabel>
                </button>
              </h2>
              <div className={styles.raceSkills}>
                <span>
                  <span className={styles.bonus}>+15</span> {r.primary}
                </span>
                <span>
                  <span className={styles.bonus}>+10</span> {r.secondary.join(", ")}
                </span>
              </div>
              <div className={styles.raceHms}>
                <span className={styles.health}>{r.health} Health</span>
                <span className={styles.magicka}>{r.magicka} Magicka</span>
                <span className={styles.stamina}>{r.stamina} Stamina</span>
              </div>
              <ul className={styles.raceTags} aria-label={`${r.name} abilities`}>
                {raceAbilities(d, r.name).map((a) => (
                  <li key={a.id}>
                    <Tooltip
                      content={
                        <span className={styles.raceTip}>
                          <b>{a.name}</b>
                          {a.text}
                        </span>
                      }
                    >
                      <span tabIndex={0} className={styles.raceTag}>
                        {a.name}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </ChoiceCard>
          );
        })}
      </div>
      {chosen && (
        <section aria-labelledby="chosen-race" className={`frame ${styles.raceFull}`}>
          <h2 id="chosen-race" className={styles.raceFullName}>
            <IconLabel icon={<RaceIcon name={chosen.name} size={32} />}>{chosen.name}</IconLabel>
          </h2>
          <div className={styles.raceFullList}>
            {raceAbilities(d, chosen.name).map((a) => (
              <p key={a.id}>
                <b>{a.name}</b> {a.text}
              </p>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function BirthsignStep({ plan, update }: StepProps) {
  const d = useGameData();
  const removed = plan.traits.includes("Master of Destiny");
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose a birthsign</h1>
      {removed && <p className={styles.notice}>Master of Destiny removes the birthsign. Remove that trait to choose one.</p>}
      <div className={styles.cards}>
        {!removed && (
          // A build may have no sign: that is its own card.
          <ChoiceCard className={`${styles.card} ${plan.birthsign === "" ? styles.cardOn : ""}`} onChoose={() => update((p) => ({ ...p, birthsign: "" }))}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardName}>No birthsign yet</h2>
            </div>
            <button
              type="button"
              className={`btn btn-sm ${plan.birthsign === "" ? "btn-ember" : ""} ${styles.cardBtn}`}
              aria-pressed={plan.birthsign === ""}
              onClick={() => update((p) => ({ ...p, birthsign: "" }))}
            >
              {plan.birthsign === "" ? "Chosen" : "Choose"}
            </button>
          </ChoiceCard>
        )}
        {d.birthsigns.map((b) => {
          const on = plan.birthsign === b.name;
          // Choosing another sign replaces this one.
          const choose = () => update((p) => ({ ...p, birthsign: b.name }));
          return (
            <ChoiceCard key={b.name} className={`${styles.card} ${on ? styles.cardOn : ""} ${removed ? styles.cardOff : ""}`} onChoose={removed ? undefined : choose}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardName}>{removed ? `The ${b.name}` : <IconLabel icon={<SignIcon name={b.name} size={32} />}>The {b.name}</IconLabel>}</h2>
              </div>
              <p className={styles.cardText}>{b.text}</p>
              <button
                type="button"
                className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn}`}
                aria-pressed={on}
                disabled={removed}
                onClick={choose}
              >
                {on ? "Chosen" : "Choose"}
              </button>
            </ChoiceCard>
          );
        })}
      </div>
    </>
  );
}

function SkillsStep({ plan, update }: StepProps) {
  const d = useGameData();
  const set = (skill: string, kind: "none" | "major" | "minor") =>
    update((p) => {
      const majors = p.majors.filter((s) => s !== skill);
      const minors = p.minors.filter((s) => s !== skill);
      if (kind === "major") majors.push(skill);
      if (kind === "minor") minors.push(skill);
      return { ...p, majors, minors };
    });
  const majorsFull = plan.majors.length >= d.rules.majorCount;
  const minorsFull = plan.minors.length >= d.rules.minorCount;
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose major and minor skills</h1>
      <div className={styles.tiles} aria-live="polite">
        <CountTile chosen={plan.majors.length} of={d.rules.majorCount} label={`Majors +${d.rules.majorBonus}`} />
        <CountTile chosen={plan.minors.length} of={d.rules.minorCount} label={`Minors +${d.rules.minorBonus}`} />
      </div>
      <div className={styles.skillGroups}>
        {d.skillGroups.map((g) => (
          <div key={g.group} className={styles.skillGroup}>
            <span className={`sub-label ${styles.skillGroupName}`}>{g.group}</span>
            {g.skills.map((s) => {
              const kind = plan.majors.includes(s) ? "major" : plan.minors.includes(s) ? "minor" : "none";
              return (
                <div key={s} className={styles.skillRow}>
                  <span className={styles.skillName}>
                    <SkillLabel name={s} className={kind !== "none" ? styles.skillOn : ""} />
                  </span>
                  <span className={styles.seg} role="group" aria-label={s}>
                    <button type="button" aria-pressed={kind === "none"} onClick={() => set(s, "none")}>
                      —
                    </button>
                    <button type="button" aria-pressed={kind === "major"} disabled={kind !== "major" && majorsFull} onClick={() => set(s, "major")}>
                      Major
                    </button>
                    <button type="button" aria-pressed={kind === "minor"} disabled={kind !== "minor" && minorsFull} onClick={() => set(s, "minor")}>
                      Minor
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

/** How many majors or minors are chosen: ember while short of the count, plain once full. */
function CountTile({ chosen, of, label }: { chosen: number; of: number; label: string }) {
  const full = chosen >= of;
  return (
    <div className={`${styles.tile} ${full ? styles.tileFull : ""}`}>
      <span className={`big-num ${styles.tileNum}`}>
        {chosen} of {of}
      </span>
      <span className={`label ${styles.tileLabel}`}>
        {label}
        {full ? ", full" : ""}
      </span>
    </div>
  );
}

function TraitsStep({ plan, update }: StepProps) {
  const d = useGameData();
  const math = new Set(d.traits.filter((t) => t.simulated).map((t) => t.name));
  const [q, setQ] = useState("");
  const chosen = new Set(plan.traits);
  // Traits chosen before the step opened sort to the front; the order then holds while it's open.
  const [front] = useState(() => new Set(plan.traits));
  const full = plan.traits.length >= d.rules.maxTraits;
  const query = q.trim().toLowerCase();
  const list = d.traits.filter((t) => chosen.has(t.name) || !query || t.name.toLowerCase().includes(query) || plainTraitText(t.text).toLowerCase().includes(query)).sort(
    (a, b) => Number(front.has(b.name)) - Number(front.has(a.name)) || a.name.localeCompare(b.name),
  );
  const toggle = (name: string) =>
    update((p) => {
      const traits = p.traits.includes(name) ? p.traits.filter((t) => t !== name) : [...p.traits, name];
      const next = { ...p, traits };
      if (!traits.includes("Master of One")) delete next.masterOfOneSkill;
      const choices = keptTraitChoices(traits, p.traitChoices);
      if (choices) next.traitChoices = choices;
      else delete next.traitChoices;
      if (traits.includes("Master of Destiny")) next.birthsign = "";
      return next;
    });
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose up to two traits</h1>
      <section aria-label="Find a trait" className={styles.search}>
        <label className="field">
          <span className="label">Search {d.traits.length} traits</span>
          <input type="search" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “potion”, “shield” or “dragon soul”" />
        </label>
        <span className={styles.count}>
          {plan.traits.length} of {d.rules.maxTraits} chosen
        </span>
      </section>
      <section aria-label="Traits" className={styles.cards}>
        {list.map((t) => {
          const on = chosen.has(t.name);
          const disabled = !on && full;
          return (
            <ChoiceCard key={t.name} className={`${styles.card} ${styles.traitCard} ${on ? styles.cardOn : ""}`} onChoose={disabled ? undefined : () => toggle(t.name)}>
              {t.image && (
                <>
                  <div className={styles.traitArt} style={{ backgroundImage: `url(${t.image})` }} aria-hidden="true" />
                  <div className={styles.traitFade} aria-hidden="true" />
                  <div className={styles.traitBand} aria-hidden="true" />
                </>
              )}
              <div className={`${styles.cardHead} ${styles.over}`}>
                <h2 className={styles.cardName}>{t.name}</h2>
                {!on && math.has(t.name) ? <span className={`label ${styles.math}`}>Changes your numbers</span> : null}
              </div>
              <p className={`${styles.cardText} ${styles.over}`}>
                <TraitText text={t.text} />
              </p>
              {on && t.name === "Master of One" && (
                <label className={`field ${styles.over}`}>
                  <span className="field-hint">Which skill?</span>
                  <select className="select" value={plan.masterOfOneSkill ?? ""} onChange={(e) => update((p) => ({ ...p, masterOfOneSkill: e.target.value || undefined }))}>
                    <option value="">Choose a skill</option>
                    {d.skills.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {on && TRAIT_CHOICES[t.name] && (
                <label className={`field ${styles.over}`}>
                  <span className="field-hint">{TRAIT_CHOICES[t.name].question}</span>
                  <select
                    className="select"
                    value={plan.traitChoices?.[t.name] ?? ""}
                    onChange={(e) =>
                      update((p) => {
                        const next = { ...(p.traitChoices ?? {}) };
                        if (e.target.value) next[t.name] = e.target.value;
                        else delete next[t.name];
                        return { ...p, traitChoices: Object.keys(next).length ? next : undefined };
                      })
                    }
                  >
                    <option value="">Choose</option>
                    {TRAIT_CHOICES[t.name].options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button type="button" className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn} ${styles.over}`} aria-pressed={on} disabled={disabled} onClick={() => toggle(t.name)}>
                {on ? "Chosen" : "Choose"}
              </button>
            </ChoiceCard>
          );
        })}
        {list.length === 0 && <p className="muted">No trait matches that.</p>}
      </section>
    </>
  );
}

function ModeStep({ plan, update }: StepProps) {
  const d = useGameData();
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Game mode and start</h1>
      <section aria-label="Game mode" className={styles.cards}>
        {d.gameModes.map((m) => {
          const on = plan.mode === m.name;
          const choose = () => update((p) => ({ ...p, mode: m.name }));
          return (
            <ChoiceCard key={m.name} className={`${styles.card} ${on ? styles.cardOn : ""}`} onChoose={choose}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardName}>
                  <IconLabel icon={<ModeIcon mode={m.name} size={24} />}>{m.name}</IconLabel>
                </h2>
              </div>
              <p className={styles.cardText}>{m.text}</p>
              <button type="button" className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn}`} aria-pressed={on} onClick={choose}>
                {on ? "Chosen" : "Choose"}
              </button>
            </ChoiceCard>
          );
        })}
      </section>
      <div className={styles.fields}>
        <StartPicker plan={plan} update={update} />
      </div>
    </>
  );
}

/**
 * The Deity step (WO-58): each god a card with its icon and name, grouped as the game offers them
 * (the race's gods at the start, None first, then any other at a shrine). Click a card to choose
 * it. The chosen god's Wintersun text sits beside the grid (under it on a phone). A saved name that
 * matches none (old free text) shows as a problem line.
 */
/** "an Altmer", "a Nord". */
const anA = (word: string) => `${/^[AEIOU]/i.test(word) ? "an" : "a"} ${word}`;

function DeityStep({ plan, update }: StepProps) {
  const d = useGameData();
  const offered = d.startingDeities[plan.race] ?? [];
  const rest = d.deities.filter((g) => !offered.includes(g));
  const known = !plan.deity || d.deities.includes(plan.deity);
  const text = d.deityText[plan.deity];
  const plainText = (s: string) => s.replace(/<([^<>]*)>/g, "$1");
  const choose = (g: string) => update((p) => ({ ...p, deity: g }));
  const card = (g: string) => {
    const on = plan.deity === g;
    return (
      <button key={g || "none"} type="button" className={`${styles.god} ${on ? styles.godOn : ""}`} aria-pressed={on} onClick={() => choose(g)}>
        {g ? <DeityIcon name={g} size={32} /> : <span className={styles.godNone} aria-hidden="true" />}
        <span className={`${styles.godName} ${g ? "" : "muted"}`}>{g || "None"}</span>
      </button>
    );
  };
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose a deity</h1>
      {!known && (
        <p role="alert" className={styles.startProblem}>
          This build&apos;s deity was “{plan.deity}”, which isn&apos;t one the planner knows. Pick one, or None.
        </p>
      )}
      <div className={styles.deityLayout}>
        <div className={styles.deityGroups}>
          <section aria-label={offered.length ? `Offered to ${anA(plan.race)} at the start` : "No god"} className={styles.deityGroup}>
            {offered.length > 0 && <h2 className={styles.deityGroupTitle}>Offered to {anA(plan.race)} at the start</h2>}
            <div className={styles.gods}>
              {card("")}
              {offered.map(card)}
            </div>
          </section>
          <section aria-label={offered.length ? "Any other god, at a shrine" : "At a shrine"} className={styles.deityGroup}>
            <h2 className={styles.deityGroupTitle}>{offered.length ? "Any other god, at a shrine" : "At a shrine"}</h2>
            <div className={styles.gods}>{rest.map(card)}</div>
          </section>
        </div>
        <section aria-label="The chosen god" className={`frame ${styles.deityPanel}`}>
          {text ? (
            <>
              <h2 className={styles.deityPanelName}>
                <IconLabel icon={<DeityIcon name={plan.deity} size={32} />}>{plan.deity}</IconLabel>
              </h2>
              {(["follower", "devotee"] as const).map((part) =>
                text[part] ? (
                  <p key={part}>
                    <span className={styles.deityHead}>
                      {part === "follower" ? "Follower" : "Devotee"}: {text[part]!.name}
                    </span>
                    <span className={styles.deityWords}>{plainText(text[part]!.text)}</span>
                  </p>
                ) : null,
              )}
              {text.tenets && (
                <p className={styles.deityTenets}>
                  <span className={styles.deityHead}>{text.tenets.name}</span>
                  <span className={styles.deityWords}>{plainText(text.tenets.text)}</span>
                </p>
              )}
            </>
          ) : (
            <p className="muted">{plan.deity && known ? plan.deity : "No deity at the start."}</p>
          )}
        </section>
      </div>
    </>
  );
}

/**
 * The game's 25 starts in its order, grouped by the mod each comes from. The chosen one shows its
 * own text and, when it has a choice (an inn, a hold, a homeland...), a select for it: optional,
 * with Random a choice like any other.
 */
function StartPicker({ plan, update }: StepProps) {
  const d = useGameData();
  const sources = [...new Set(d.starts.map((s) => s.source))];
  const chosen = d.startByName.get(plan.start);
  const choose = (name: string) =>
    update((p) => {
      const next = { ...p, start: name };
      delete next.startOption;
      delete next.startWas;
      return next;
    });
  return (
    <div className={styles.starts}>
      <span className="label">Start</span>
      {plan.startWas && !plan.start && (
        <p role="alert" className={styles.startProblem}>
          {/^merchant or mercenary$/i.test(plan.startWas)
            ? "This build's start was \u201cMerchant or mercenary\u201d. In LoreRim they're two starts: pick Merchant or Mercenary."
            : `This build's start was \u201c${plan.startWas}\u201d, which isn't one of LoreRim's starts. Pick the closest one.`}
        </p>
      )}
      {sources.map((src) => (
        <fieldset key={src} className={styles.startGroup}>
          <legend className="sub-label">{src}</legend>
          {d.starts
            .filter((s) => s.source === src)
            .map((s) => {
              const on = plan.start === s.name;
              return (
                <div key={s.name} className={`${styles.startRow} ${on ? styles.startOn : ""}`}>
                  <label className={styles.radio}>
                    <input type="radio" name="start" value={s.name} checked={on} onChange={() => choose(s.name)} />
                    <span>{s.name}</span>
                  </label>
                  {on && (
                    <div className={styles.startMore}>
                      <p className={styles.startText}>{s.text}</p>
                      {s.options.length > 0 && (
                        <label className={`field ${styles.startOption}`}>
                          <span className="label">{s.optionLabel ?? "Choice"}</span>
                          <select className="select" value={plan.startOption ?? ""} onChange={(e) => update((p) => ({ ...p, startOption: e.target.value || undefined }))}>
                            <option value="">Not chosen</option>
                            {s.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </fieldset>
      ))}
      {chosen && (
        <button type="button" className="btn btn-sm btn-quiet" style={{ alignSelf: "flex-start" }} onClick={() => choose("")}>
          No start
        </button>
      )}
    </div>
  );
}

function NameStep({ details, updateDetails, plan, update, signedIn, introStart }: { details: BuildDetails; updateDetails: (p: Partial<BuildDetails>) => void; plan: BuildPlan; update: StepProps["update"]; signedIn: boolean; introStart?: string }) {
  const d = useGameData();
  const noSign = plan.traits.includes("Master of Destiny");
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Details</h1>
      {/* What is being created. */}
      <dl className={styles.summary}>
        <div>
          <dt className="label">Race</dt>
          <dd>{plan.race ? <IconLabel icon={<RaceIcon name={plan.race} />}>{plan.race}</IconLabel> : "Not chosen"}</dd>
        </div>
        <div>
          <dt className="label">Birthsign</dt>
          <dd>{noSign ? "None (Master of Destiny)" : plan.birthsign ? <IconLabel icon={<SignIcon name={plan.birthsign} />}>The {plan.birthsign}</IconLabel> : "Not chosen"}</dd>
        </div>
        <div>
          <dt className="label">LoreRim version</dt>
          <dd>{d.version.label}</dd>
        </div>
      </dl>
      <div className={styles.fields}>
        <label className="field">
          <span className="label">Build name</span>
          <input className="input" value={details.name} maxLength={80} onChange={(e) => updateDetails({ name: e.target.value })} autoFocus />
        </label>
        <label className="field">
          <span className="label">Description</span>
          <input className="input" value={details.description} maxLength={300} onChange={(e) => updateDetails({ description: e.target.value })} placeholder="One line under the name" />
        </label>
        <TagPicker chosen={details.tags ?? suggestedTags(plan.majors)} suggested={details.tags == null} onChange={(tags) => updateDetails({ tags })} />
        <CoverField
          url={details.coverImageUrl}
          signedIn={signedIn}
          onChange={(coverImageUrl) => {
            updateDetails({ coverImageUrl });
            // A new image starts centred.
            update((p) => {
              const next = { ...p };
              delete next.coverFocus;
              return next;
            });
          }}
          focus={plan.coverFocus}
          onFocus={(coverFocus) => update((p) => ({ ...p, coverFocus }))}
        />
        <VideoField
          videoId={plan.videoId}
          onChange={(videoId) =>
            update((p) => {
              const next = { ...p };
              if (videoId) next.videoId = videoId;
              else delete next.videoId;
              return next;
            })
          }
        />
        <label className="field">
          <span className="label">Write-up link</span>
          <input className="input" type="url" value={details.writeupUrl} maxLength={500} onChange={(e) => updateDetails({ writeupUrl: e.target.value })} placeholder="https://discord.com/channels/…" />
          <span className="field-hint">Your Discord post or guide.</span>
        </label>
        <fieldset className={styles.radios}>
          <legend className="label">Who can see it</legend>
          {(
            [
              ["public", "Listed on Browse builds"],
              ["unlisted", "Anyone with the link"],
              ["private", "Only you"],
            ] as const
          ).map(([v, l]) => (
            <label key={v} className={styles.radio}>
              <input type="radio" name="visibility" value={v} checked={details.visibility === v} onChange={() => updateDetails({ visibility: v })} />
              <span>{l}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <ThemePicker
        plan={plan}
        onPick={(theme) => update((p) => ({ ...p, theme }))}
        name={details.name}
        description={details.description}
        coverImageUrl={details.coverImageUrl}
        introStart={introStart}
      />
    </>
  );
}

/**
 * The video guide (WO-39): a YouTube link in any common form. Only the video's id is kept; anything
 * that isn't a YouTube link says so and isn't kept.
 */
function VideoField({ videoId, onChange }: { videoId: string | undefined; onChange: (id: string | undefined) => void }) {
  const [text, setText] = useState(() => (videoId ? `https://youtu.be/${videoId}` : ""));
  const bad = text.trim() !== "" && !youtubeVideoId(text);
  return (
    <label className="field">
      <span className="label">Video guide (optional)</span>
      <input
        className="input"
        type="url"
        value={text}
        maxLength={300}
        placeholder="https://www.youtube.com/watch?v=…"
        aria-invalid={bad || undefined}
        aria-describedby="video-guide-hint"
        onChange={(e) => {
          setText(e.target.value);
          onChange(youtubeVideoId(e.target.value) ?? undefined);
        }}
      />
      {bad ? (
        <span id="video-guide-hint" className="field-error" role="alert">
          {YOUTUBE_ERROR}
        </span>
      ) : (
        <span id="video-guide-hint" className="field-hint">
          A YouTube video. It opens the build page and the Guide tab.
        </span>
      )}
    </label>
  );
}

/** The cover image: upload one (signed in), or paste a link to one already posted. */
function CoverField({
  url,
  signedIn,
  onChange,
  focus,
  onFocus,
}: {
  url: string;
  signedIn: boolean;
  onChange: (url: string) => void;
  focus: { x: number; y: number } | undefined;
  onFocus: (focus: { x: number; y: number }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/covers", { method: "POST", body: form });
      const body = (await r.json().catch(() => ({}))) as { url?: string; error?: string };
      if (r.ok && body.url) onChange(body.url);
      else setError(body.error ?? "The upload didn't finish. Try again.");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={`field ${styles.cover}`}>
      <span className="label">Cover image</span>
      {url && (
        <>
          {/* The whole image: click where the hero should centre it (a face, say). */}
          <button
            type="button"
            className={styles.coverFocusPick}
            aria-label="Set where the cover centres: click a point on the image"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const pct = (v: number) => Math.round(Math.min(100, Math.max(0, v)));
              onFocus({ x: pct(((e.clientX - r.left) / r.width) * 100), y: pct(((e.clientY - r.top) / r.height) * 100) });
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className={styles.coverPreview} />
            <span className={styles.coverFocusMark} style={{ left: `${focus?.x ?? 50}%`, top: `${focus?.y ?? 50}%` }} aria-hidden="true" />
          </button>
          {/* The crop the hero shows: its band's proportions, centred on the marker. */}
          <span className={styles.coverCropWrap}>
            <span className="sub-label">On the build page</span>
            <span
              className={styles.coverCrop}
              style={{ backgroundImage: `url("${url}")`, backgroundPosition: `${focus?.x ?? 50}% ${focus?.y ?? 50}%` }}
              aria-hidden="true"
            />
          </span>
        </>
      )}
      <div className={styles.coverActions}>
        {signedIn ? (
          <label className={`btn btn-sm ${busy ? styles.coverBusy : ""}`}>
            {busy ? "Uploading…" : url ? "Upload another" : "Upload an image"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" disabled={busy} onChange={(e) => void upload(e.target.files?.[0])} />
          </label>
        ) : (
          <span className="field-hint">Sign in to upload one, or paste a link below.</span>
        )}
        {url && (
          <button type="button" className="btn btn-sm btn-quiet" onClick={() => onChange("")}>
            Remove
          </button>
        )}
      </div>
      {error && (
        <span role="alert" className="bad">
          {error}
        </span>
      )}
      <label className={styles.coverLink}>
        <span className="field-hint">Or a link to a screenshot you have already posted</span>
        <input className="input" type="url" aria-label="Cover image link" value={url} maxLength={500} onChange={(e) => onChange(e.target.value)} />
      </label>
      <span className="field-hint">Shown full width above the build. PNG, JPEG, WebP or GIF, up to 4 MB.</span>
    </div>
  );
}

/**
 * Up to five tags from the set list, grouped. Before the player has touched them, the tags their
 * majors suggest are shown chosen, and said to be suggestions; nothing is saved unseen.
 */
function TagPicker({ chosen, suggested, onChange }: { chosen: string[]; suggested: boolean; onChange: (tags: string[]) => void }) {
  const full = chosen.length >= MAX_TAGS;
  return (
    <fieldset className={styles.tagPicker} aria-label="Tags">
      {/* A heading with the count beside it, under a rule, so the chips read as their own section (WO-57). */}
      <legend className={styles.tagsLegend}>
        <h2 className="section-title">
          Tags{" "}
          <span className="section-title-at">
            {chosen.length} of {MAX_TAGS} chosen
          </span>
        </h2>
      </legend>
      {suggested && chosen.length > 0 && <span className="field-hint">Suggested from your majors. Remove any that don&apos;t fit.</span>}
      {TAG_GROUPS.map((g) => (
        <div key={g} className={styles.tagGroup}>
          <span className="sub-label">{g}</span>
          <span className={styles.tagChips}>
            {TAGS.filter((t) => t.group === g).map((t) => {
              const on = chosen.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  className={styles.tagChip}
                  aria-pressed={on}
                  disabled={!on && full}
                  onClick={() => onChange(on ? chosen.filter((x) => x !== t.slug) : [...chosen, t.slug])}
                >
                  <IconLabel icon={<TagIcon tag={t.slug} />}>{t.name}</IconLabel>
                </button>
              );
            })}
          </span>
        </div>
      ))}
    </fieldset>
  );
}

/** A done step's check (WO-58), drawn in pixels like the planner's icons rather than a font's glyph. */
function PixelCheck() {
  return (
    <svg width="14" height="12" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true" className={styles.check}>
      <path d="M6 0h1v1H6zM5 1h2v1H5zM0 2h1v1H0zM4 2h2v1H4zM0 3h2v1H0zM3 3h2v1H3zM1 4h3v1H1zM2 5h1v1H2z" fill="currentColor" />
    </svg>
  );
}
