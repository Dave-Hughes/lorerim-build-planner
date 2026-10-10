"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { copyBuild, copyBuildForVersion } from "@/lib/builds/actions";
import type { BuildRecord } from "@/lib/builds/types";
import { useGameData } from "@/components/game-data";
import { GuideFactsProvider } from "@/components/guide/guide-facts";
import { GuideSection } from "@/components/guide/guide-section";
import { LevelNote } from "@/components/guide/level-note";
import { isEmptyDoc, notedLevels, type GuideDoc } from "@/lib/guide/doc";
import { currentVersion, isOlderThanCurrent } from "@/lib/rules/versions";
import { ATTRIBUTE_NAMES, levelChanges, levelMarks, perksByLevel } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { Avatar } from "@/components/ui/avatar";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, IconLabel, RaceIcon, SignIcon, SkillLabel } from "@/components/ui/skill-icon";
import { LevelLegend, LevelRow, LevelRuler, LevelStepper, WINDOW } from "./level-nav";
import { Tree, type TreeView } from "./tree";
import { TreeTabs } from "./tree-tabs";
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
  /** True when the visitor signed in from "Copy to my builds"; the copy runs on load. */
  autoCopy?: boolean;
  /** The build's guide sections by key: `overview`, and `level:<n>` for level notes. */
  guide?: Record<string, GuideDoc>;
}

export function BuildView({ build, updatedLabel, isOwner, signedIn, initialLevel, signInToCopy, autoCopy, guide = {} }: Props) {
  const d = useGameData();
  const noted = useMemo(() => notedLevels(guide), [guide]);
  const { plan } = build;
  const total = plan.levels.length;
  const states = useMemo(() => computeBuild(plan, d), [plan, d]);
  const marks = useMemo(() => levelMarks(d, plan, states, noted), [d, plan, states, noted]);
  const [level, setLevelState] = useState(() => Math.min(total, Math.max(1, initialLevel)));
  const setLevel = useCallback(
    (n: number) => {
      const next = Math.min(total, Math.max(1, n));
      setLevelState(next);
      const url = new URL(window.location.href);
      if (next === 1) url.searchParams.delete("level");
      else url.searchParams.set("level", String(next));
      window.history.replaceState(null, "", url);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") setLevel(level - 1);
      if (e.key === "ArrowRight") setLevel(level + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, setLevel]);

  const s = states[level - 1];
  const changes = useMemo(() => levelChanges(d, plan, states, level), [d, plan, states, level]);
  const perks = useMemo(() => perksByLevel(d, plan, states, level), [d, plan, states, level]);
  const [treesOpen, setTreesOpen] = useState(false);
  const [tree, setTree] = useState<string>(() => plan.majors[0] ?? "One-Handed");
  const [treeView, setTreeView] = useState<TreeView>("tree");

  const noSign = plan.traits.includes("Master of Destiny");
  const identity: [string, React.ReactNode][] = [
    ["Race", plan.race ? <IconLabel icon={<RaceIcon name={plan.race} />}>{plan.race}</IconLabel> : plan.race],
    [
      "Birthsign",
      noSign ? "None (Master of Destiny)" : plan.birthsign ? <IconLabel icon={<SignIcon name={plan.birthsign} />}>The {plan.birthsign}</IconLabel> : "Not chosen yet",
    ],
    ["Traits", plan.traits.length ? plan.traits.join(", ") : "None"],
    ...(plan.masterOfOneSkill ? [["Master of One", plan.masterOfOneSkill] as [string, React.ReactNode]] : []),
    ["Game mode", plan.mode],
    ["Start", plan.start || "Not chosen yet"],
    ["Deity", plan.deity || "Not chosen yet"],
  ];

  const attrScale = Math.max(300, s.health, s.magicka, s.stamina);

  return (
    <GuideFactsProvider plan={plan} states={states}>
      <main className={styles.main}>
        <Cover build={build} updatedLabel={updatedLabel} isOwner={isOwner} signedIn={signedIn} signInToCopy={signInToCopy} autoCopy={!!autoCopy} />

        <div className={`page ${styles.body}`}>
          <OldVersionNotice buildId={build.id} signedIn={signedIn} />
          <section aria-label="Character" className={styles.identity}>
            {identity.map(([l, v]) => (
              <div key={l} className={styles.identityItem}>
                <span className="label">{l}</span>
                <span className={styles.identityValue}>{v}</span>
              </div>
            ))}
          </section>

          {guide.overview && !isEmptyDoc(guide.overview) && <GuideSection buildId={build.id} doc={guide.overview} />}

          <section aria-label="Level" className={styles.levelSection}>
            <div className={styles.levelHead}>
              <LevelStepper level={level} total={total} onChange={setLevel} />
              <LevelLegend />
            </div>
            {total > WINDOW && <LevelRuler marks={marks} level={level} onChange={setLevel} />}
            <LevelRow marks={marks} level={level} onChange={setLevel} />
          </section>

          <div className={styles.columns}>
            <section aria-label={`At level ${level}`} className={styles.colStats}>
              <div className={`frame ${styles.panel}`}>
                <span className="label">Attributes</span>
                {(["health", "magicka", "stamina"] as const).map((a) => (
                  <div key={a} className={styles.attr}>
                    <div className={styles.attrHead}>
                      {/* Wrapped so the row's baseline alignment (and height) is the text's, as before. */}
                      <span>
                        <IconLabel icon={<AttributeIcon name={a} />}>{ATTRIBUTE_NAMES[a]}</IconLabel>
                      </span>
                      <span className={styles.attrNum}>{s[a]}</span>
                    </div>
                    <div className={styles.bar}>
                      <div className={`${styles.barFill} ${styles[a]}`} style={{ width: `${(s[a] / attrScale) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <dl className={styles.stats}>
                <dt>Carry weight</dt>
                <dd>{s.carryWeight}</dd>
                <dt>Skill points carried over</dt>
                <dd>{level === 1 ? "0" : s.skillPointsBanked}</dd>
                <dt>Perk points left</dt>
                <dd>{s.perkPoints - s.perkPointsSpent}</dd>
                <dt>Destiny points left</dt>
                <dd>
                  {s.destinyPoints - s.destinyPointsSpent} of {s.destinyPoints}
                </dd>
                <dt>Standing stone</dt>
                <dd>{s.stone ? <IconLabel icon={<SignIcon name={s.stone} />}>The {s.stone}</IconLabel> : "None"}</dd>
                <dt>Trainer sessions used</dt>
                <dd>{s.trainerSessionsUsed}</dd>
              </dl>
              {s.issues.length > 0 && (
                <ul className={styles.issues} aria-label="Problems at this level">
                  {s.issues.map((i, n) => (
                    <li key={n}>{i.message}</li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-label={`Skills at level ${level}`} className={styles.colSkills}>
              <div className={styles.sectionHead}>
                <span className="label">Skills</span>
                <span className={styles.maxSkill}>
                  Max skill {s.maxSkill} at level {level}
                  <InfoTip label="About the skill limit" text="No skill can go above 50 plus your character level. Skills can reach 100 from level 50." />
                </span>
              </div>
              {d.skillGroups.map((g) => (
                <div key={g.group} className={styles.group}>
                  <span className={`sub-label ${styles.groupName}`}>{g.group}</span>
                  {g.skills.map((sk) => {
                    const v = s.skills[sk];
                    const d = v - s.skillsBefore[sk];
                    return (
                      <div key={sk} className={styles.skillRow}>
                        <SkillLabel name={sk} />
                        <span className={styles.skillVal}>{v}</span>
                        <div className={styles.bar3}>
                          <div className={`${styles.barFill} ${d > 0 ? styles.barChanged : styles.barPlain}`} style={{ width: `${Math.min(100, v)}%` }} />
                        </div>
                        <span className={styles.skillDelta}>{d > 0 ? `+${d}` : ""}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </section>

            <section aria-label="This level and perks" className={styles.colPerks}>
              <div className={`frame ${styles.panel}`}>
                <span className="label">{level === 1 ? "At level 1" : `Changes at level ${level}`}</span>
                <ChangesGrid changes={changes} level={level} />
                {noted.has(level) && <LevelNote key={level} doc={guide[`level:${level}`]} level={level} />}
              </div>
              <div className={styles.perkList}>
                <div className={styles.sectionHead}>
                  <span className="label">Perks by level {level}</span>
                  <button type="button" className={styles.linkButton} onClick={() => setTreesOpen((o) => !o)} aria-expanded={treesOpen}>
                    {treesOpen ? "Close perk trees" : "Open perk trees"}
                  </button>
                </div>
                {perks.length === 0 && <p className="muted">None yet.</p>}
                {perks.map((g) => (
                  <div key={g.tree} className={styles.perkGroup}>
                    <SkillLabel name={g.tree} className="muted" />
                    <span className={styles.perkNames}>
                      {g.perks.length === 0 && s.grantedTree === g.tree && <span className="soft">Every perk (Master of One)</span>}
                      {g.perks.map((p, i) => (
                        <span key={`${p.id}-${i}`} className={styles.perk}>
                          {p.name}
                          {p.rank ? ` ${p.rank}` : ""}
                          {p.book ? " (book)" : ""}
                          <span className="tag tag-sm num">Lv {p.level}</span>
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {treesOpen && (
            <section aria-label="Perk trees" className={styles.trees}>
              <TreeTabs state={s} active={tree} onChange={setTree} view={treeView} onView={setTreeView} />
              <div className={`frame ${styles.treeBox}`}>
                <Tree tree={tree} states={states} level={level} view={treeView} onView={setTreeView} />
              </div>
            </section>
          )}

          <div className={styles.bottom}>
            <section aria-label="Gear" className={styles.gear}>
              <span className="label">Gear</span>
              {plan.gear.length === 0 ? (
                <p className="muted">None listed.</p>
              ) : (
                <div className={styles.scroller}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Slot</th>
                        <th>Item</th>
                        <th>From level</th>
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.gear.map((g, i) => (
                        <tr key={i}>
                          <td className="muted">{g.slot}</td>
                          <td>{g.name}</td>
                          <td className="num">{g.fromLevel}</td>
                          <td className="soft">{g.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </GuideFactsProvider>
  );
}

function ChangesGrid({ changes, level }: { changes: ReturnType<typeof levelChanges>; level: number }) {
  const rows: [string, React.ReactNode][] = [];
  if (changes.attribute) rows.push(["Attribute", <IconLabel key="a" icon={<AttributeIcon name={changes.attribute} />}>+5 {ATTRIBUTE_NAMES[changes.attribute]}</IconLabel>]);
  if (changes.skills.length)
    rows.push([
      "Skills",
      <span key="s" className={styles.stack}>
        {changes.skills.map((c) => (
          <SkillLabel key={c.skill} name={c.skill}>
            {c.skill} {c.from} → {c.to}
          </SkillLabel>
        ))}
      </span>,
    ]);
  // Destiny perks are listed with the rest; the tree in brackets is left out when it is the perk's own name.
  const perkLines = [
    ...changes.perks.map((p, i) => (
      <SkillLabel key={`${p.id}-${i}`} name={p.tree}>
        {p.name}
        {p.rank ? ` ${p.rank}` : ""}{" "}
        <span className="muted">{p.book ? "(book)" : p.requirement ? `(${p.requirement})` : p.tree !== p.name ? `(${p.tree})` : ""}</span>
      </SkillLabel>
    )),
    ...changes.destiny.map((p) => (
      <SkillLabel key={p.id} name="Destiny">
        {p.name}
        {p.name !== "Destiny" && <span className="muted"> (Destiny)</span>}
      </SkillLabel>
    )),
  ];
  if (perkLines.length)
    rows.push([
      perkLines.length > 1 ? "Perks" : "Perk",
      <span key="p" className={styles.stack}>
        {perkLines}
      </span>,
    ]);
  if (changes.stone)
    rows.push(["Stone", changes.stone === "none" ? "No stone" : <IconLabel key="st" icon={<SignIcon name={changes.stone} />}>The {changes.stone}</IconLabel>]);
  if (changes.trainer.length) rows.push(["Trainer", changes.trainer.map((t) => `${t.skill} +${t.count}`).join(", ")]);
  if (changes.books.length) rows.push(["Skill books", changes.books.join(", ")]);
  if (changes.banked > 0) rows.push(["Banked", `${changes.banked} skill points`]);
  if (!rows.length) return <p className="muted">{level === 1 ? "No starting perks yet." : "Nothing yet."}</p>;
  return (
    <div className={styles.changes}>
      {rows.map(([k, v]) => (
        <div key={k} className={styles.changeRow}>
          <span className="muted">{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
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
  autoCopy,
}: {
  build: BuildViewData;
  updatedLabel: string;
  isOwner: boolean;
  signedIn: boolean;
  signInToCopy: React.ReactNode;
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
    <section aria-label="Build" className={`${styles.cover} ${build.coverImageUrl ? "" : styles.coverPlain}`} style={build.coverImageUrl ? { backgroundImage: `url("${build.coverImageUrl}")` } : undefined}>
      <div className={styles.coverFade} />
      <div className={`page ${styles.coverInner}`}>
        <div className={styles.coverText}>
          <h1 className={`title ${styles.h1}`}>{build.name}</h1>
          {build.description && <p className={`flavor ${styles.description}`}>{build.description}</p>}
          <div className={styles.byline}>
            <span className={styles.author}>
              <Avatar name={build.author.name} image={build.author.image} />
              <span className={styles.authorName}>{build.author.name}</span>
            </span>
            <span className="tag">LoreRim {build.gameVersion}</span>
            <span>Planned to level {build.plan.levels.length}</span>
            <span className={styles.pipe} aria-hidden="true">
              |
            </span>
            <span>Updated {updatedLabel}</span>
          </div>
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
