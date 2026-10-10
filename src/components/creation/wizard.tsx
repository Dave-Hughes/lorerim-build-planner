"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FocusHeader } from "@/components/ui/focus-header";
import { SkillLabel } from "@/components/ui/skill-icon";
import { createBuild, saveBuildDetails, saveBuildPlan } from "@/lib/builds/actions";
import { STEPS, STEP_NAMES, clearDraft, emptyDetails, emptyPlan, loadDraft, saveDraft, type Step } from "@/lib/builds/draft";
import type { BuildDetails } from "@/lib/builds/validate";
import { BIRTHSIGNS, GAME_MODES, RACES, SKILLS, SKILL_GROUPS, STARTING_DEITIES, STARTS, TRAITS } from "@/lib/rules/data";
import { RULES } from "@/lib/rules/constants";
import { emptyLevel } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import type { BuildPlan } from "@/lib/rules/types";
import styles from "./wizard.module.css";

interface WizardProps {
  mode: "create" | "edit";
  buildId?: string;
  initialPlan?: BuildPlan;
  initialDetails?: BuildDetails;
  signedIn: boolean;
  /** Sign-in button for the last step, rendered by the server. */
  signIn: React.ReactNode;
}

const MATH_TRAITS = new Set(TRAITS.filter((t) => t.simulated).map((t) => t.name));

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

export function Wizard({ mode, buildId, initialPlan, initialDetails, signedIn, signIn }: WizardProps) {
  const router = useRouter();
  // Rendered on the client only (see wizard-loader.tsx), so the draft in this
  // browser can seed the state directly.
  const [draft] = useState(() => (mode === "create" ? loadDraft() : null));
  const [plan, setPlan] = useState<BuildPlan>(() => initialPlan ?? draft?.plan ?? emptyPlan());
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
    return computeBuild({ ...plan, levels: [emptyLevel()] })[0];
  }, [plan]);

  const filled: Record<Step, boolean> = {
    race: !!plan.race,
    birthsign: masterOfDestiny || !!plan.birthsign,
    skills: plan.majors.length > 0 || plan.minors.length > 0,
    traits: plan.traits.length > 0,
    mode: true,
    name: !!details.name.trim(),
  };
  const summaries: Record<Step, string> = {
    race: plan.race || "Not chosen",
    birthsign: masterOfDestiny ? "Removed by Master of Destiny" : plan.birthsign ? `The ${plan.birthsign}` : "Not chosen",
    skills: `${plan.majors.length} major${plan.majors.length === 1 ? "" : "s"}, ${plan.minors.length} minor${plan.minors.length === 1 ? "" : "s"}`,
    traits: `${plan.traits.length} of ${RULES.maxTraits} chosen`,
    mode: `${plan.mode}${plan.start ? `, ${plan.start}` : ""}`,
    name: details.name || "Not named",
  };

  const finish = () =>
    start(async () => {
      setError(null);
      if (mode === "create") {
        const r = await createBuild({ details, plan });
        if (!r.ok) return setError(r.error);
        clearDraft();
        router.push(`/b/${r.value.id}/edit`);
      } else if (buildId) {
        const a = await saveBuildDetails(buildId, details);
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
      <FocusHeader
        context={mode === "create" ? "New build" : `Setting up ${details.name || "this build"}`}
        status={headerStatus}
        actions={
          mode === "create" ? (
            <Link href="/" className="btn btn-sm">
              Exit
            </Link>
          ) : (
            <Link href={`/b/${buildId}/edit`} className="btn btn-sm">
              Back to levels
            </Link>
          )
        }
      />
      <div className={`page ${styles.layout}`}>
        <aside aria-label="Setup steps" className={styles.aside}>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => {
              const state = i === stepIndex ? "now" : filled[s] ? "done" : "next";
              return (
                <li key={s}>
                  <button type="button" className={`${styles.stepRow} ${styles[state]}`} onClick={() => setStep(s)} aria-current={state === "now" ? "step" : undefined}>
                    <span className={styles.stepMark}>
                      <span>{i + 1}</span>
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepName}>{STEP_NAMES[s]}</span>
                      <span className={styles.stepVal}>{summaries[s]}</span>
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
                  <span>Health</span>
                </div>
                <div className={styles.magicka}>
                  <span className="big-num">{startState.magicka}</span>
                  <span>Magicka</span>
                </div>
                <div className={styles.stamina}>
                  <span className="big-num">{startState.stamina}</span>
                  <span>Stamina</span>
                </div>
              </div>
              <div className={styles.topSkills}>
                {SKILLS.map((s) => ({ s, v: startState.skills[s] }))
                  .sort((a, b) => b.v - a.v)
                  .slice(0, 6)
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
          {step === "race" && <RaceStep plan={plan} update={update} />}
          {step === "birthsign" && <BirthsignStep plan={plan} update={update} />}
          {step === "skills" && <SkillsStep plan={plan} update={update} />}
          {step === "traits" && <TraitsStep plan={plan} update={update} />}
          {step === "mode" && <ModeStep plan={plan} update={update} />}
          {step === "name" && <NameStep details={details} updateDetails={updateDetails} mode={mode} />}

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
                <button type="button" className="btn btn-quiet" onClick={() => setStep("mode")}>
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

function Chosen() {
  return <span className={`label ${styles.chosen}`}>✓ Chosen</span>;
}

/**
 * A choice card. Clicking anywhere on it does what its Choose / Remove button does; the
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

function RaceStep({ plan, update }: StepProps) {
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose a race</h1>
      <div className={styles.cards}>
        {RACES.map((r) => {
          const on = plan.race === r.name;
          const choose = () => update((p) => ({ ...p, race: r.name }));
          return (
            <ChoiceCard key={r.name} className={`${styles.card} ${on ? styles.cardOn : ""}`} onChoose={choose}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardName}>{r.name}</h2>
                {on && <Chosen />}
              </div>
              <div className={styles.raceSkills}>
                <span>
                  <span className={styles.bonus}>+15</span> <SkillLabel name={r.primary} />
                </span>
                <span>
                  <span className={styles.bonus}>+10</span>{" "}
                  {r.secondary.map((sk, i) => (
                    <span key={sk}>
                      <SkillLabel name={sk}>
                        {sk}
                        {i < r.secondary.length - 1 ? "," : ""}
                      </SkillLabel>{" "}
                    </span>
                  ))}
                </span>
              </div>
              <div className={styles.raceHms}>
                <span className={styles.health}>{r.health} Health</span>
                <span className={styles.magicka}>{r.magicka} Magicka</span>
                <span className={styles.stamina}>{r.stamina} Stamina</span>
              </div>
              <button type="button" className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn}`} aria-pressed={on} onClick={choose}>
                {on ? "Chosen" : "Choose"}
              </button>
            </ChoiceCard>
          );
        })}
      </div>
    </>
  );
}

function BirthsignStep({ plan, update }: StepProps) {
  const removed = plan.traits.includes("Master of Destiny");
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose a birthsign</h1>
      {removed && <p className={styles.notice}>Master of Destiny removes the birthsign. Remove that trait to choose one.</p>}
      <div className={styles.cards}>
        {BIRTHSIGNS.map((b) => {
          const on = plan.birthsign === b.name;
          const choose = () => update((p) => ({ ...p, birthsign: on ? "" : b.name }));
          return (
            <ChoiceCard key={b.name} className={`${styles.card} ${on ? styles.cardOn : ""} ${removed ? styles.cardOff : ""}`} onChoose={removed ? undefined : choose}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardName}>The {b.name}</h2>
                {on && !removed && <Chosen />}
              </div>
              <p className={styles.cardText}>{b.text}</p>
              <button
                type="button"
                className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn}`}
                aria-pressed={on}
                disabled={removed}
                onClick={choose}
              >
                {on ? "Remove" : "Choose"}
              </button>
            </ChoiceCard>
          );
        })}
      </div>
    </>
  );
}

function SkillsStep({ plan, update }: StepProps) {
  const set = (skill: string, kind: "none" | "major" | "minor") =>
    update((p) => {
      const majors = p.majors.filter((s) => s !== skill);
      const minors = p.minors.filter((s) => s !== skill);
      if (kind === "major") majors.push(skill);
      if (kind === "minor") minors.push(skill);
      return { ...p, majors, minors };
    });
  const majorsFull = plan.majors.length >= RULES.majorCount;
  const minorsFull = plan.minors.length >= RULES.minorCount;
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose major and minor skills</h1>
      <p className={styles.count}>
        {plan.majors.length} of {RULES.majorCount} majors (+{RULES.majorBonus}), {plan.minors.length} of {RULES.minorCount} minors (+{RULES.minorBonus})
      </p>
      <div className={styles.skillGroups}>
        {SKILL_GROUPS.map((g) => (
          <div key={g.group} className={styles.skillGroup}>
            <span className={`sub-label ${styles.skillGroupName}`}>{g.group}</span>
            {g.skills.map((s) => {
              const kind = plan.majors.includes(s) ? "major" : plan.minors.includes(s) ? "minor" : "none";
              return (
                <div key={s} className={styles.skillRow}>
                  <SkillLabel name={s} className={kind !== "none" ? styles.skillOn : ""} />
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

function TraitsStep({ plan, update }: StepProps) {
  const [q, setQ] = useState("");
  const chosen = new Set(plan.traits);
  const full = plan.traits.length >= RULES.maxTraits;
  const query = q.trim().toLowerCase();
  const list = TRAITS.filter((t) => chosen.has(t.name) || !query || t.name.toLowerCase().includes(query) || plainTraitText(t.text).toLowerCase().includes(query)).sort(
    (a, b) => Number(chosen.has(b.name)) - Number(chosen.has(a.name)) || a.name.localeCompare(b.name),
  );
  const toggle = (name: string) =>
    update((p) => {
      const traits = p.traits.includes(name) ? p.traits.filter((t) => t !== name) : [...p.traits, name];
      const next = { ...p, traits };
      if (!traits.includes("Master of One")) delete next.masterOfOneSkill;
      if (traits.includes("Master of Destiny")) next.birthsign = "";
      return next;
    });
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Choose up to two traits</h1>
      <section aria-label="Find a trait" className={styles.search}>
        <label className="field">
          <span className="label">Search {TRAITS.length} traits</span>
          <input type="search" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “potion”, “shield” or “dragon soul”" />
        </label>
        <span className={styles.count}>
          {plan.traits.length} of {RULES.maxTraits} chosen
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
                {on ? <Chosen /> : MATH_TRAITS.has(t.name) ? <span className={`label ${styles.math}`}>Changes your numbers</span> : null}
              </div>
              <p className={`${styles.cardText} ${styles.over}`}>
                <TraitText text={t.text} />
              </p>
              {on && t.name === "Master of One" && (
                <label className={`field ${styles.over}`}>
                  <span className="field-hint">Which skill?</span>
                  <select className="select" value={plan.masterOfOneSkill ?? ""} onChange={(e) => update((p) => ({ ...p, masterOfOneSkill: e.target.value || undefined }))}>
                    <option value="">Choose a skill</option>
                    {SKILLS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button type="button" className={`btn btn-sm ${on ? "btn-ember" : ""} ${styles.cardBtn} ${styles.over}`} aria-pressed={on} disabled={disabled} onClick={() => toggle(t.name)}>
                {on ? "Remove" : "Choose"}
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
  const deities = STARTING_DEITIES[plan.race] ?? [];
  return (
    <>
      <h1 className={`title ${styles.h1}`}>Game mode and start</h1>
      <section aria-label="Game mode" className={styles.cards}>
        {GAME_MODES.map((m) => {
          const on = plan.mode === m.name;
          const choose = () => update((p) => ({ ...p, mode: m.name }));
          return (
            <ChoiceCard key={m.name} className={`${styles.card} ${on ? styles.cardOn : ""}`} onChoose={choose}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardName}>{m.name}</h2>
                {on && <Chosen />}
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
        <label className="field">
          <span className="label">Start</span>
          <input className="input" list="starts" value={plan.start} maxLength={120} onChange={(e) => update((p) => ({ ...p, start: e.target.value }))} placeholder="Where the build begins" />
          <datalist id="starts">
            {STARTS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>
        <label className="field">
          <span className="label">Deity</span>
          <input className="input" list="deities" value={plan.deity} maxLength={80} onChange={(e) => update((p) => ({ ...p, deity: e.target.value }))} placeholder="Optional" />
          <datalist id="deities">
            {deities.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          {deities.length > 0 && <span className="field-hint">Offered to a {plan.race} at the start: {deities.join(", ")}. Any god can be joined at a shrine.</span>}
        </label>
      </div>
    </>
  );
}

function NameStep({ details, updateDetails, mode }: { details: BuildDetails; updateDetails: (p: Partial<BuildDetails>) => void; mode: "create" | "edit" }) {
  return (
    <>
      <h1 className={`title ${styles.h1}`}>{mode === "create" ? "Name the build" : "Name and sharing"}</h1>
      <div className={styles.fields}>
        <label className="field">
          <span className="label">Build name</span>
          <input className="input" value={details.name} maxLength={80} onChange={(e) => updateDetails({ name: e.target.value })} placeholder="[Build name]" autoFocus />
        </label>
        <label className="field">
          <span className="label">Description</span>
          <input className="input" value={details.description} maxLength={300} onChange={(e) => updateDetails({ description: e.target.value })} placeholder="One line under the name" />
        </label>
        <label className="field">
          <span className="label">Cover image link</span>
          <input className="input" type="url" value={details.coverImageUrl} maxLength={500} onChange={(e) => updateDetails({ coverImageUrl: e.target.value })} placeholder="https://" />
          <span className="field-hint">A screenshot you have already posted. Shown full width above the build.</span>
        </label>
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
    </>
  );
}
