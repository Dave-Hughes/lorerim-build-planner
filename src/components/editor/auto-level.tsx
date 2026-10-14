"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useGameData } from "@/components/game-data";
import { InfoTip } from "@/components/ui/info-tip";
import { AttributeIcon, SkillIcon } from "@/components/ui/skill-icon";
import { MAX_LEVELS } from "@/lib/builds/validate";
import { keepInView } from "@/lib/keep-in-view";
import { ATTRIBUTE_NAMES } from "@/lib/rules/derive";
import { computeBuild } from "@/lib/rules/engine";
import { START_LIST_MAX } from "@/lib/rules/spells";
import { TOUR_EVENT, tourDone, tourDue } from "@/lib/tour";
import type { Attribute, BuildPlan } from "@/lib/rules/types";
import { fillToLevel, type FillSettings } from "./plan-ops";
import pick from "./spell-block.module.css";
import styles from "./auto-level.module.css";

const ATTRS: Attribute[] = ["health", "magicka", "stamina"];
const QUICK = [10, 20, 30, 50];
const noop = () => () => {};

/** Level-ups shared out evenly, Health first with any left over. */
function evenly(n: number): Record<Attribute, number> {
  const base = Math.floor(n / 3);
  const rest = n - 3 * base;
  return {
    health: base + (rest > 0 ? 1 : 0),
    magicka: base + (rest > 1 ? 1 : 0),
    stamina: base,
  };
}

/**
 * Auto level (WO-64), on a fresh build: the level to reach, skill targets, perks in order and the
 * attributes go in; the preview beside them is the rules engine's fill, worked out as you type.
 * Run writes levels 2 to N. The settings aren't saved: the levels are.
 */
export function AutoLevel({
  plan,
  onRun,
  onCancel,
}: {
  plan: BuildPlan;
  onRun: (next: BuildPlan, to: number) => void;
  onCancel: () => void;
}) {
  const d = useGameData();
  const start = useMemo(() => computeBuild(plan, d)[0], [plan, d]);
  const [toText, setToText] = useState("20");
  const to = Math.min(MAX_LEVELS, Math.max(2, Math.round(Number(toText)) || 2));
  const [targets, setTargets] = useState<[string, number][]>(() => [
    ...plan.majors.map((s): [string, number] => [s, 100]),
    ...plan.minors.map((s): [string, number] => [s, 50]),
  ]);
  const [perks, setPerks] = useState<string[]>([]);
  const [attributes, setAttributes] = useState(() => evenly(19));
  const [first, setFirst] = useState<FillSettings["first"]>("even");

  // The level changes: the level-ups go to (or come off) the one taken first, then the rest.
  const setLevel = (text: string) => {
    setToText(text);
    const n =
      Math.min(MAX_LEVELS, Math.max(2, Math.round(Number(text)) || 2)) - 1;
    const order =
      first === "even" ? ATTRS : [first, ...ATTRS.filter((a) => a !== first)];
    const next = { ...attributes };
    let diff = n - ATTRS.reduce((t, a) => t + next[a], 0);
    if (diff > 0) next[order[0]] += diff;
    for (const a of [...order].reverse()) {
      if (diff >= 0) break;
      const off = Math.min(next[a], -diff);
      next[a] -= off;
      diff += off;
    }
    setAttributes(next);
  };

  const settings: FillSettings = { to, targets, perks, attributes, first };
  const shown = useDeferredValue(settings);
  const { report } = useMemo(
    () => fillToLevel(plan, shown, d),
    [plan, shown, d],
  );
  const used = ATTRS.reduce((t, a) => t + attributes[a], 0);

  const targetSkills = new Set(targets.map(([s]) => s));
  const addable = d.skills.filter((s) => !targetSkills.has(s));

  // Beside the preview on a wide screen; pinned to the bottom of the window on a narrow one.
  const actions = (where: string) => (
    <div className={`${styles.actions} ${where}`}>
      <div className={styles.buttons}>
        <button
          type="button"
          className={`btn btn-primary ${styles.run}`}
          disabled={used !== to - 1}
          onClick={() => onRun(fillToLevel(plan, settings, d).plan, to)}
        >
          Auto level to {to}
        </button>
        <button type="button" className="btn btn-quiet" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {used !== to - 1 && (
        <p className={`${styles.bad} ${styles.small}`}>
          The attributes take {to - 1} level-ups: {used} so far.
        </p>
      )}
    </div>
  );

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.head}>
        <button type="button" className="btn btn-quiet" onClick={onCancel}>
          ‹ Level 1
        </button>
        <h1 className={styles.title}>Auto level</h1>
      </div>
      <TappsCard />
      <div className={styles.columns}>
        <div className={styles.form}>
          <section className={styles.panel} aria-labelledby="al-to">
            <div className={styles.toRow}>
              <h2 id="al-to" className={styles.h2}>
                Level to reach
              </h2>
              <input
                className={`input ${styles.toInput}`}
                type="number"
                min={2}
                max={MAX_LEVELS}
                aria-labelledby="al-to"
                value={toText}
                onChange={(e) => setLevel(e.target.value)}
                onBlur={() => setToText(String(to))}
              />
              <span className={styles.chips}>
                {QUICK.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={to === n}
                    className={`${styles.chip} ${to === n ? styles.chipOn : ""}`}
                    onClick={() => setLevel(String(n))}
                  >
                    {n}
                  </button>
                ))}
              </span>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="al-targets">
            <div className={styles.panelHead}>
              <h2 id="al-targets" className={styles.h2}>
                Skill targets
              </h2>
              <InfoTip
                label="How targets are filled"
                text="Targets rise together, one point at a time, as far as each level's points, +5 and max skill allow."
              />
            </div>
            {targets.length > 0 && (
              <ul className={styles.rows}>
                <li
                  className={`${styles.trow} ${styles.rowHead}`}
                  aria-hidden="true"
                >
                  <span />
                  <span>Skill</span>
                  <span className={styles.num}>Now</span>
                  <span>Target</span>
                  <span />
                  <span />
                </li>
                {targets.map(([sk, target], i) => {
                  const r = report.targets.find((t) => t.skill === sk);
                  return (
                    <li key={sk} className={styles.trow}>
                      <SkillIcon name={sk} />
                      <span>{sk}</span>
                      <span className={`muted ${styles.num}`}>
                        {start.skills[sk] ?? 0}
                      </span>
                      <input
                        className={`input ${styles.targetInput}`}
                        type="number"
                        min={1}
                        max={100}
                        aria-label={`${sk} target`}
                        value={target}
                        onChange={(e) => {
                          const v = Math.min(
                            100,
                            Math.max(
                              0,
                              Math.round(Number(e.target.value)) || 0,
                            ),
                          );
                          setTargets(
                            targets.map((t, n) => (n === i ? [sk, v] : t)),
                          );
                        }}
                      />
                      <span
                        className={`${styles.status} ${r && r.reachedAt === null ? styles.warn : styles.ok}`}
                      >
                        {r?.reason}
                      </span>
                      <button
                        type="button"
                        className={styles.x}
                        aria-label={`Remove ${sk}`}
                        onClick={() =>
                          setTargets(targets.filter((_, n) => n !== i))
                        }
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {addable.length > 0 && (
              <select
                className={`select ${styles.addSkill}`}
                aria-label="Add a skill"
                value=""
                onChange={(e) =>
                  e.target.value &&
                  setTargets([
                    ...targets,
                    [
                      e.target.value,
                      Math.min(
                        100,
                        Math.max(50, (start.skills[e.target.value] ?? 0) + 10),
                      ),
                    ],
                  ])
                }
              >
                <option value="">Add a skill</option>
                {addable.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </section>

          <section className={styles.panel} aria-labelledby="al-perks">
            <div className={styles.panelHead}>
              <h2 id="al-perks" className={styles.h2}>
                Perks, in order
              </h2>
              <InfoTip
                label="How perks are placed"
                text="Each perk goes at the first level its skill and earlier perks allow."
              />
            </div>
            {perks.length > 0 && (
              <PerkRows perks={perks} setPerks={setPerks} report={report} />
            )}
            <AddPerk perks={perks} onAdd={(id) => setPerks([...perks, id])} />
          </section>

          <section className={styles.panel} aria-labelledby="al-attrs">
            <div className={styles.panelHead}>
              <h2 id="al-attrs" className={styles.h2}>
                Attributes
              </h2>
              <span className={`muted ${styles.small}`}>
                {used} of {to - 1} level-ups
              </span>
            </div>
            <div className={styles.attrs}>
              {ATTRS.map((a) => (
                <div
                  key={a}
                  className={`${styles.att} ${styles[a]} ${first === a ? styles.attFirst : ""}`}
                >
                  <span className={styles.attName}>
                    <AttributeIcon name={a} />
                    {ATTRIBUTE_NAMES[a]}
                    {first === a && (
                      <span className={styles.firstTag}>first</span>
                    )}
                  </span>
                  <span className={styles.stepper}>
                    <button
                      type="button"
                      aria-label={`Fewer ${ATTRIBUTE_NAMES[a]}`}
                      disabled={attributes[a] <= 0}
                      onClick={() =>
                        setAttributes({ ...attributes, [a]: attributes[a] - 1 })
                      }
                    >
                      −
                    </button>
                    <b aria-label={`${ATTRIBUTE_NAMES[a]} level-ups`}>
                      {attributes[a]}
                    </b>
                    <button
                      type="button"
                      aria-label={`More ${ATTRIBUTE_NAMES[a]}`}
                      disabled={used >= to - 1}
                      onClick={() =>
                        setAttributes({ ...attributes, [a]: attributes[a] + 1 })
                      }
                    >
                      +
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <label className={styles.firstRow}>
              <span className="muted">Take first</span>
              <select
                className={`select ${styles.firstSelect}`}
                value={first}
                onChange={(e) =>
                  setFirst(e.target.value as FillSettings["first"])
                }
              >
                {ATTRS.map((a) => (
                  <option key={a} value={a}>
                    {ATTRIBUTE_NAMES[a]}
                  </option>
                ))}
                <option value="even">Evenly</option>
              </select>
            </label>
          </section>
        </div>

        <aside className={styles.preview} aria-labelledby="al-preview">
          <section className={`${styles.panel} ${styles.previewPanel}`}>
            <h2 id="al-preview" className={styles.h2}>
              At level {shown.to}
            </h2>
            <div className={styles.hms}>
              {ATTRS.map((a) => (
                <div key={a}>
                  <b className={`${styles.hmsNum} ${styles[`${a}Text`]}`}>
                    {report[a]}
                  </b>
                  <span className={`muted ${styles.small}`}>
                    {ATTRIBUTE_NAMES[a]}
                  </span>
                </div>
              ))}
            </div>
            {report.targets.length > 0 && (
              <ul className={styles.ends}>
                {report.targets.map((t) => (
                  <li key={t.skill}>
                    <span>{t.skill}</span>
                    <span>
                      <span className="muted">{t.now} → </span>
                      <b
                        className={
                          t.reachedAt === null ? styles.warn : styles.ok
                        }
                      >
                        {t.end}
                      </b>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.stripBox}>
              <span className={`muted ${styles.small}`}>Perks by level</span>
              <div
                className={styles.strip}
                style={{
                  gridTemplateColumns: `repeat(${report.perLevel.length}, minmax(0, 1fr))`,
                }}
                aria-label={`Perks taken at each level, 1 to ${shown.to}`}
                role="img"
              >
                {report.perLevel.map((n, i) => (
                  <span
                    key={i}
                    className={styles.lv}
                    title={`Level ${i + 1}: ${n} perk${n === 1 ? "" : "s"}`}
                  >
                    {Array.from({ length: Math.min(n, 4) }, (_, k) => (
                      <span key={k} className={styles.dot} />
                    ))}
                  </span>
                ))}
              </div>
              <div className={`muted ${styles.stripScale}`}>
                <span>1</span>
                {shown.to >= 20 && (
                  <span>{Math.round(shown.to / 3 / 5) * 5 || 5}</span>
                )}
                {shown.to >= 20 && (
                  <span>{Math.round((2 * shown.to) / 3 / 5) * 5}</span>
                )}
                <span>{shown.to}</span>
              </div>
            </div>
            {(report.skillPointsLeft > 0 || report.perkPointsLeft > 0) && (
              <p className={styles.leftover}>
                <b className={styles.warn}>Left over at level {shown.to}:</b>{" "}
                {[
                  report.skillPointsLeft > 0 &&
                    `${report.skillPointsLeft} skill point${report.skillPointsLeft === 1 ? "" : "s"}`,
                  report.perkPointsLeft > 0 &&
                    `${report.perkPointsLeft} perk point${report.perkPointsLeft === 1 ? "" : "s"}`,
                ]
                  .filter(Boolean)
                  .join(" and ")}
                . Raise a target or add perks.
              </p>
            )}
            {actions(styles.actionsWide)}
          </section>
        </aside>
      </div>
      {actions(styles.actionsPinned)}
    </div>
  );
}

/** Tapps explains, the first time the page opens; Show me around brings him back. */
function TappsCard() {
  const due = useSyncExternalStore(
    noop,
    () => tourDue("autolevel"),
    () => false,
  );
  const [shown, setShown] = useState<boolean | null>(null);
  useEffect(() => {
    const again = () => setShown(true);
    window.addEventListener(TOUR_EVENT, again);
    return () => window.removeEventListener(TOUR_EVENT, again);
  }, []);
  if (!(shown ?? due)) return null;
  return (
    <div className={styles.tapps}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/tapps.svg"
        alt="Tapps"
        width={72}
        height={72}
        className={styles.tappsImg}
      />
      <div role="note" className={styles.tappsCard}>
        <span className={styles.tappsTail} aria-hidden="true" />
        <div className={styles.tappsWords}>
          <b className={styles.tappsTitle}>Tapps does the levels</b>
          <span>
            Tell Tapps the level, the skills and the perks. Tapps fills in every
            level between, by the rules. Can&apos;t happen by then? Tapps says
            so. Like Mighty Strike at level 30. Not happening.
          </span>
        </div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            tourDone("autolevel");
            setShown(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/** The perk list: drag a row by its grip (or Arrow up and down on the grip) to reorder; × removes. */
function PerkRows({
  perks,
  setPerks,
  report,
}: {
  perks: string[];
  setPerks: (p: string[]) => void;
  report: ReturnType<typeof fillToLevel>["report"];
}) {
  const d = useGameData();
  const [dragging, setDragging] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= perks.length || from === to) return;
    const next = [...perks];
    const [id] = next.splice(from, 1);
    next.splice(to, 0, id);
    setPerks(next);
  };
  return (
    <ul className={styles.rows}>
      {perks.map((id, i) => {
        const p = d.perkById.get(id);
        const r = report.perks[i];
        const name = p?.name ?? id;
        return (
          <li
            key={`${id}-${i}`}
            className={`${styles.prow} ${dragging === i ? styles.dragging : ""}`}
            data-perk-row={id}
            onDragOver={(e) => {
              if (dragging === null) return;
              e.preventDefault();
              if (dragging !== i) {
                move(dragging, i);
                setDragging(i);
              }
            }}
            onDrop={(e) => e.preventDefault()}
          >
            <button
              type="button"
              className={styles.grip}
              draggable
              aria-label={`Move ${name}: Arrow up or down`}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", id);
                setDragging(i);
              }}
              onDragEnd={() => setDragging(null)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                e.preventDefault();
                const to = i + (e.key === "ArrowUp" ? -1 : 1);
                move(i, to);
                requestAnimationFrame(() =>
                  document
                    .querySelectorAll<HTMLElement>(`.${styles.grip}`)
                    [to]?.focus(),
                );
              }}
            >
              ⋮⋮
            </button>
            <span>
              {name} <span className="muted">({p?.tree ?? "?"})</span>
            </span>
            <span
              className={`${styles.status} ${r?.level ? styles.ok : styles.bad}`}
            >
              {r ? (r.level ? `Level ${r.level}` : r.reason) : ""}
            </span>
            <button
              type="button"
              className={styles.x}
              aria-label={`Remove ${name}`}
              onClick={() => setPerks(perks.filter((_, n) => n !== i))}
            >
              ×
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Search perks and Destiny stars by name or tree. A ranked perk can be listed again for its next rank. */
function AddPerk({
  perks,
  onAdd,
}: {
  perks: string[];
  onAdd: (id: string) => void;
}) {
  const d = useGameData();
  const listId = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const found = useMemo(() => {
    if (!open) return [];
    const listed = (id: string) => perks.filter((x) => x === id).length;
    const all = d.perks.filter((p) => listed(p.id) < (p.ranks ?? 1));
    const ws = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!ws.length) return all.slice(0, START_LIST_MAX);
    return all
      .filter((p) =>
        ws.every((w) => `${p.name} ${p.tree}`.toLowerCase().includes(w)),
      )
      .sort(
        (a, b) =>
          Number(!a.name.toLowerCase().startsWith(ws[0])) -
          Number(!b.name.toLowerCase().startsWith(ws[0])),
      )
      .slice(0, 12);
  }, [d, perks, q, open]);
  const choose = (id: string) => {
    onAdd(id);
    setQ("");
    setIndex(0);
  };
  return (
    <span className={pick.addSearch}>
      <input
        className={`input ${styles.perkSearch}`}
        type="search"
        role="combobox"
        aria-label="Add a perk"
        aria-autocomplete="list"
        aria-expanded={found.length > 0}
        aria-controls={listId}
        aria-activedescendant={found.length ? `${listId}-${index}` : undefined}
        placeholder="Add a perk"
        autoComplete="off"
        value={q}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQ(e.target.value);
          setIndex(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") return q ? setQ("") : setOpen(false);
          if (!found.length) return;
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setIndex((i) =>
              keepInView(
                listId,
                (i + (e.key === "ArrowDown" ? 1 : -1) + found.length) %
                  found.length,
              ),
            );
          } else if (e.key === "Enter") {
            e.preventDefault();
            choose(found[Math.min(index, found.length - 1)].id);
          }
        }}
      />
      {found.length > 0 && (
        <ul
          role="listbox"
          id={listId}
          aria-label="Perks"
          className={pick.options}
        >
          {found.map((p, n) => (
            <li
              key={p.id}
              id={`${listId}-${n}`}
              role="option"
              aria-selected={n === index}
              className={pick.option}
              onMouseEnter={() => setIndex(n)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(p.id);
              }}
            >
              {p.tree === "Destiny" ? null : <SkillIcon name={p.tree} />}
              <span className={pick.optionName}>{p.name}</span>
              <span className="muted">
                {p.tree}
                {perks.includes(p.id)
                  ? `, rank ${perks.filter((x) => x === p.id).length + 1}`
                  : ""}
              </span>
            </li>
          ))}
          {!q.trim() && (
            <li role="presentation" className={`muted ${pick.optionRest}`}>
              Search for the rest
            </li>
          )}
        </ul>
      )}
    </span>
  );
}
