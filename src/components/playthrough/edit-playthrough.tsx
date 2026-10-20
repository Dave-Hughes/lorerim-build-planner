"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, useTransition } from "react";
import { useGameData } from "@/components/game-data";
import { Brand } from "@/components/ui/brand";
import { searchWithExtras, type ExtraMention } from "@/lib/guide/mention";
import { useItems } from "@/lib/items/items";
import * as act from "@/lib/playthroughs/actions";
import { objectiveRefusal } from "@/lib/playthroughs/status";
import type { BuildVisibility } from "@/lib/builds/validate";
import type { Detect, DoneBy, ObjectiveKind, ObjectiveLink, Reach } from "@/lib/playthroughs/types";
import { levelsInput } from "@/lib/playthroughs/validate";
import s from "./edit.module.css";

/**
 * Editing a playthrough by hand (WO-111), as the PlaythroughEdit board: the acts down the left, the
 * act's fields, its objectives in place with their beats between them, and the chapters list. Every
 * change goes through the same writes the assistants' tools use, and shows their refusal under the row.
 */

export interface EditObjective {
  id: number;
  text: string;
  kind: ObjectiveKind;
  link: ObjectiveLink | null;
  linkName: string | null;
  doneBy: DoneBy;
  detect: Detect | null;
  reach: Reach | null;
  why: string | null;
  suggestedBy: string | null;
  accepted: boolean;
}
export interface EditAct {
  id: number;
  n: string;
  name: string;
  levelFrom: number;
  levelTo: number | null;
  place: string;
  goal: string;
  standingRule: string | null;
  objectives: EditObjective[];
}
export interface EditChapter {
  id: number;
  kind: "chapter" | "entry" | "beat";
  title: string;
  actId: number | null;
  opensAfter: number | null;
  firstLine: string;
}
export interface EditData {
  id: string;
  name: string;
  line: string;
  buildId: string | null;
  visibility: BuildVisibility;
  draftedBy: string | null;
  showDrafted: boolean;
  /** The build's cover (WO-114), the character's one. */
  coverImageUrl: string | null;
  acts: EditAct[];
  chapters: EditChapter[];
  builds: { id: string; name: string }[];
}

type Result = { ok: true } | { ok: false; error: string };

function useSave(onSaved: () => void) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const save = (fn: () => Promise<Result | { ok: boolean; error?: string }>, refresh = false, then?: (r: { ok: boolean }) => void) =>
    start(async () => {
      const r = (await fn()) as { ok: boolean; error?: string };
      if (r.ok) {
        setError(null);
        onSaved();
        if (refresh) router.refresh();
      } else setError(r.error ?? "That didn't save. Try again.");
      then?.(r);
    });
  return { pending, error, save, setError };
}

export function EditPlaythrough({ data, actId, tale, linkables }: { data: EditData; actId: number | null; tale: boolean; linkables: ExtraMention[] }) {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const onSaved = () => setSavedAt(new Date());
  const current = data.acts.find((a) => a.id === actId) ?? data.acts[0] ?? null;
  return (
    <>
      <header className={s.bar}>
        <div className={`page ${s.barIn}`}>
          <span className={s.barLeft}>
            <Brand />
            <span className={s.editing}>Editing {data.name}</span>
          </span>
          <span className={s.barRight}>
            {savedAt && (
              <span className={s.saved} role="status">
                Saved {savedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Link href={current ? `/p/${data.id}?act=${data.acts.indexOf(current) + 1}` : `/p/${data.id}`} className="btn btn-primary">
              Done
            </Link>
          </span>
        </div>
      </header>
      <main className={`page ${s.main}`}>
        <aside className={s.aside}>
          <Acts data={data} current={current} onSaved={onSaved} />
          <section className={s.panel} aria-labelledby="tale" style={{ gap: 12 }}>
            <h2 id="tale" className={`${s.h2} ${s.h2s}`}>
              The tale
            </h2>
            <span style={{ fontSize: 15, color: "var(--soft)" }}>
              Chapters from before the game, and the entries and beats in each act, open in the Story editor: text, up to 5 of your images a piece, captions.
            </span>
            <Link href={`/p/${data.id}/edit?tale=1`}>Edit the chapters ›</Link>
          </section>
          <Details data={data} onSaved={onSaved} />
        </aside>
        <div className={s.col}>
          {tale ? (
            <Chapters data={data} onSaved={onSaved} />
          ) : current ? (
            <>
              <ActFields key={current.id} pid={data.id} a={current} onSaved={onSaved} />
              <Objectives key={`o${current.id}`} data={data} a={current} linkables={linkables} onSaved={onSaved} />
              <Suggested a={current} />
            </>
          ) : (
            <p className="muted">No acts yet. Add the first.</p>
          )}
        </div>
      </main>
    </>
  );
}

function Moves({ onMove, first, last, label }: { onMove: (to: "up" | "down") => void; first: boolean; last: boolean; label: string }) {
  return (
    <span className={s.moves}>
      <button type="button" className={s.move} disabled={first} aria-label={`Move ${label} up`} onClick={() => onMove("up")}>
        ▲
      </button>
      <button type="button" className={s.move} disabled={last} aria-label={`Move ${label} down`} onClick={() => onMove("down")}>
        ▼
      </button>
    </span>
  );
}

function Acts({ data, current, onSaved }: { data: EditData; current: EditAct | null; onSaved: () => void }) {
  const router = useRouter();
  const { error, save } = useSave(onSaved);
  const last = data.acts.at(-1);
  return (
    <section aria-labelledby="acts" style={{ display: "flex", flexDirection: "column" }}>
      <span className={s.headRule}>
        <h2 id="acts" className={`${s.h2} ${s.h2s}`}>
          Acts
        </h2>
        <span className={s.note}>{data.acts.length}</span>
      </span>
      {data.acts.map((a, i) => (
        <div key={a.id} className={s.actRow} aria-current={a.id === current?.id ? "true" : undefined}>
          <span className={s.actN}>{a.n}</span>
          <Link href={`/p/${data.id}/edit?act=${a.id}`} className={s.actName} style={{ color: "inherit", textDecoration: "none" }}>
            {a.name}
          </Link>
          <Moves label={a.name} first={i === 0} last={i === data.acts.length - 1} onMove={(to) => save(() => act.moveAct(data.id, a.id, to), true)} />
        </div>
      ))}
      <span style={{ paddingTop: 14, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() =>
            save(async () => {
              const from = last ? (last.levelTo ?? last.levelFrom) : 1;
              const r = await act.newAct(data.id, { name: `Act ${data.acts.length + 1}`, levels: `${from} and up`, place: "", goal: "" });
              if (r.ok) router.push(`/p/${data.id}/edit?act=${r.value}`);
              return r;
            }, true)
          }
        >
          Add an act
        </button>
        {error && (
          <span role="alert" className={s.error}>
            {error}
          </span>
        )}
      </span>
    </section>
  );
}

function ActFields({ pid, a, onSaved }: { pid: string; a: EditAct; onSaved: () => void }) {
  const router = useRouter();
  const { error, save } = useSave(onSaved);
  const [v, setV] = useState({ name: a.name, levels: levelsInput(a.levelFrom, a.levelTo), place: a.place, goal: a.goal, standingRule: a.standingRule ?? "" });
  const blur = (key: keyof typeof v) => () => {
    const was = key === "levels" ? levelsInput(a.levelFrom, a.levelTo) : key === "standingRule" ? (a.standingRule ?? "") : a[key];
    if (v[key] === was) return;
    save(() => act.saveAct(pid, a.id, { [key]: key === "standingRule" ? v[key] || null : v[key] }), true);
  };
  const input = (key: keyof typeof v, label: string, max: number) => (
    <label className={s.field}>
      <span className={s.lbl}>{label}</span>
      <input className={`input ${s.in}`} value={v[key]} maxLength={max} onChange={(e) => setV({ ...v, [key]: e.target.value })} onBlur={blur(key)} />
    </label>
  );
  return (
    <section className={`frame ${s.panel}`} aria-labelledby="act" style={{ gap: 18 }}>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h2 id="act" className={s.h2}>
          Act {a.n}
        </h2>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            if (!window.confirm(`Remove Act ${a.n}, its objectives, entries and beats?`)) return;
            save(async () => {
              const r = await act.removeAct(pid, a.id);
              if (r.ok) router.push(`/p/${pid}/edit`);
              return r;
            }, true);
          }}
        >
          Remove the act
        </button>
      </span>
      <div className={`${s.row} ${s.three}`}>
        {input("name", "Name", 60)}
        {input("levels", "Levels", 30)}
        {input("place", "Place", 80)}
      </div>
      {input("goal", "The goal, in one line", 200)}
      <label className={s.field}>
        <span className={s.lbl}>Standing rule for the act, if any</span>
        <input
          className={`input ${s.in}`}
          value={v.standingRule}
          maxLength={200}
          placeholder="[What the player keeps doing: this isn't an objective]"
          onChange={(e) => setV({ ...v, standingRule: e.target.value })}
          onBlur={blur("standingRule")}
        />
      </label>
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </section>
  );
}

function Objectives({ data, a, linkables, onSaved }: { data: EditData; a: EditAct; linkables: ExtraMention[]; onSaved: () => void }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const { error, save } = useSave(onSaved);
  const beatsAfter = (oid: number) => data.chapters.filter((c) => c.kind === "beat" && c.opensAfter === oid);
  const openBeats = data.chapters.filter((c) => c.kind === "beat" && c.actId === a.id && c.opensAfter === null);
  const lastId = a.objectives.at(-1)?.id ?? null;
  const addBeat = (after: number | null) =>
    save(async () => {
      const r = await act.newChapter(data.id, { kind: "beat", title: "A new beat", actId: a.id, opensAfter: after });
      if (r.ok) router.push(`/p/${data.id}/edit/tale/${r.value}`);
      return r;
    });
  return (
    <section aria-labelledby="objs" style={{ display: "flex", flexDirection: "column" }}>
      <span className={s.headRule}>
        <h2 id="objs" className={`${s.h2} ${s.h2s}`}>
          Objectives
        </h2>
        <span className={s.note}>Move up or down to reorder</span>
      </span>
      {openBeats.map((c) => (
        <Beat key={c.id} pid={data.id} c={c} lastObjective={lastId} onSaved={onSaved} />
      ))}
      {a.objectives.map((o, i) => (
        <div key={o.id} style={{ display: "contents" }}>
          <ObjectiveRow pid={data.id} actId={a.id} o={o} linkables={linkables} first={i === 0} last={i === a.objectives.length - 1} onSaved={onSaved} onBeat={() => addBeat(o.id)} />
          {beatsAfter(o.id).map((c) => (
            <Beat key={c.id} pid={data.id} c={c} lastObjective={o.id} onSaved={onSaved} />
          ))}
        </div>
      ))}
      {adding && <ObjectiveRow pid={data.id} actId={a.id} o={null} linkables={linkables} first last onSaved={onSaved} onDone={() => setAdding(false)} />}
      <span className={s.add}>
        <button type="button" className="btn btn-sm" onClick={() => setAdding(true)} disabled={adding}>
          Add an objective
        </button>
        <button type="button" className="btn btn-sm" onClick={() => addBeat(lastId)}>
          Add a beat here
        </button>
        <span className={s.note}>@ to link a quest, a quest line, a spell, an item or a follower</span>
        {error && (
          <span role="alert" className={s.error}>
            {error}
          </span>
        )}
      </span>
    </section>
  );
}

const REACH_KINDS = [
  { v: "level", label: "Level" },
  { v: "skill", label: "A skill" },
  { v: "count", label: "A count" },
] as const;

function ObjectiveRow({
  pid,
  actId,
  o,
  linkables,
  first,
  last,
  onSaved,
  onBeat,
  onDone,
}: {
  pid: string;
  actId: number;
  o: EditObjective | null;
  linkables: ExtraMention[];
  first: boolean;
  last: boolean;
  onSaved: () => void;
  onBeat?: () => void;
  onDone?: () => void;
}) {
  const d = useGameData();
  const { error, save, setError } = useSave(onSaved);
  const [text, setText] = useState(o?.text ?? "");
  const [link, setLink] = useState<{ link: ObjectiveLink; name: string } | null>(o?.link && o.linkName ? { link: o.link, name: o.linkName } : null);
  const [kind, setKind] = useState<ObjectiveKind>(o?.kind ?? "once");
  const [doneBy, setDoneBy] = useState<DoneBy>(o?.doneBy ?? "hand");
  const [detect, setDetect] = useState<Detect | null>(o?.detect ?? null);
  const [reach, setReach] = useState<Reach>(o?.reach ?? { key: "level", target: 10 });
  const [why, setWhy] = useState(o?.why ?? "");
  const quests = useMemo(() => linkables.filter((x) => x.kind === "quest"), [linkables]);
  // The rule shows as you type, from the same words the save refuses.
  const refused = text.trim() ? objectiveRefusal(text, kind, kind === "once" ? doneBy : "save", kind === "reach" ? reach : null) : null;

  const values = (patch: Partial<{ kind: ObjectiveKind; doneBy: DoneBy; detect: Detect | null; reach: Reach; link: { link: ObjectiveLink; name: string } | null; text: string; why: string }> = {}) => {
    const k = patch.kind ?? kind;
    const db = patch.doneBy ?? doneBy;
    const l = patch.link === undefined ? link : patch.link;
    const det = patch.detect === undefined ? detect : patch.detect;
    const dflt = l?.link.kind === "quest" ? { quest: l.link.id } : null;
    return {
      text: (patch.text ?? text).trim(),
      kind: k,
      link: l?.link ?? null,
      doneBy: k === "reach" ? ("save" as const) : db,
      detect: k === "once" && db === "save" ? (det ?? dflt) : null,
      reach: k === "reach" ? (patch.reach ?? reach) : null,
      why: (patch.why ?? why).trim() || null,
    };
  };
  const commit = (patch: Parameters<typeof values>[0] = {}) => {
    const v = values(patch);
    if (!v.text) return;
    if (!o) save(() => act.newObjective(pid, actId, v), true, (r) => r.ok && onDone?.());
    else save(() => act.saveObjective(pid, o.id, v), true);
  };

  return (
    <div className={s.ob}>
      <span className={s.grip}>
        {o && (
          <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <button type="button" className={s.move} disabled={first} aria-label={`Move ${o.text} up`} onClick={() => save(() => act.moveObjective(pid, o.id, "up"), true)}>
              ▲
            </button>
            <button type="button" className={s.move} disabled={last} aria-label={`Move ${o.text} down`} onClick={() => save(() => act.moveObjective(pid, o.id, "down"), true)}>
              ▼
            </button>
          </span>
        )}
      </span>
      <div className={s.textWrap}>
        <span className={s.textLine}>
          {link && (
            <span className={s.mention}>
              {LINK_LABEL[link.link.kind]}: {link.name}
              <button
                type="button"
                aria-label={`Unlink ${link.name}`}
                onClick={() => {
                  setLink(null);
                  commit({ link: null });
                }}
              >
                ×
              </button>
            </span>
          )}
          <MentionInput
            d={d}
            value={text}
            linkables={linkables}
            bad={!!refused}
            autoFocus={!o}
            onChange={setText}
            onPick={(m, rest) => {
              const l = { link: { kind: m.kind as ObjectiveLink["kind"], id: m.id }, name: m.name };
              setLink(l);
              const t = rest || m.name;
              setText(t);
              if (m.kind === "quest" && kind === "once") {
                setDoneBy("save");
                setDetect({ quest: m.id });
                commit({ link: l, text: t, doneBy: "save", detect: { quest: m.id } });
              } else commit({ link: l, text: t });
            }}
            onBlur={() => {
              if (!o || text.trim() !== o.text) commit();
            }}
          />
        </span>
        {refused && <span className={s.warn}>{refused}</span>}
        {!refused && error && (
          <span role="alert" className={s.warn}>
            {error}
          </span>
        )}
        {o && !o.accepted && <span className={s.sug}>Suggested by {o.suggestedBy}. Accept or skip it on the quest log.</span>}
      </div>
      <span className={s.side}>
        <span className={s.seg}>
          <button
            type="button"
            aria-pressed={kind === "once"}
            onClick={() => {
              setKind("once");
              commit({ kind: "once" });
            }}
          >
            Done once
          </button>
          <button
            type="button"
            aria-pressed={kind === "reach"}
            onClick={() => {
              setKind("reach");
              commit({ kind: "reach" });
            }}
          >
            Reach a number
          </button>
        </span>
        {o ? (
          <span className={s.actions}>
            <button type="button" className="btn btn-sm" onClick={() => save(() => act.removeObjective(pid, o.id), true)}>
              Remove
            </button>
            {onBeat && (
              <button type="button" className="btn btn-sm" onClick={onBeat}>
                Add a beat after
              </button>
            )}
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setError(null);
              onDone?.();
            }}
          >
            Cancel
          </button>
        )}
      </span>
      <span className={s.sub}>
        {kind === "once" ? (
          <span className={s.field}>
            <span className={s.lbl}>Done when</span>
            <span className={s.seg}>
              <button
                type="button"
                aria-pressed={doneBy === "save"}
                onClick={() => {
                  setDoneBy("save");
                  commit({ doneBy: "save" });
                }}
              >
                The save says so{detect?.stage !== undefined ? `: stage ${detect.stage}` : ""}
              </button>
              <button
                type="button"
                aria-pressed={doneBy === "hand"}
                onClick={() => {
                  setDoneBy("hand");
                  commit({ doneBy: "hand" });
                }}
              >
                You tick it
              </button>
            </span>
            {doneBy === "save" && <QuestStage quests={quests} detect={detect ?? (link?.link.kind === "quest" ? { quest: link.link.id } : null)} onChange={(det) => (setDetect(det), commit({ detect: det }))} />}
          </span>
        ) : (
          <span className={s.field}>
            <span className={s.lbl}>The number</span>
            <ReachPick d={d.skills} reach={reach} onChange={(r) => (setReach(r), commit({ reach: r }))} />
          </span>
        )}
        <label className={s.field}>
          <span className={s.lbl}>Why, one line</span>
          <input className={`input ${s.in} ${s.sm}`} value={why} maxLength={300} onChange={(e) => setWhy(e.target.value)} onBlur={() => why.trim() !== (o?.why ?? "") && commit()} />
        </label>
      </span>
    </div>
  );
}

const LINK_LABEL: Record<ObjectiveLink["kind"], string> = { quest: "Quest", line: "Quest line", spell: "Spell", item: "Item", follower: "Follower" };

/** The text, with `@` opening the mention menu: a quest, a quest line, a spell, an item or a follower. */
function MentionInput({
  d,
  value,
  linkables,
  bad,
  autoFocus,
  onChange,
  onPick,
  onBlur,
}: {
  d: ReturnType<typeof useGameData>;
  value: string;
  linkables: ExtraMention[];
  bad: boolean;
  autoFocus?: boolean;
  onChange: (v: string) => void;
  onPick: (m: ExtraMention, rest: string) => void;
  onBlur: () => void;
}) {
  useItems(d.version.id, true);
  const ref = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [at, setAt] = useState(0);
  const query = /@([^@]*)$/.exec(value)?.[1] ?? null;
  const hits = useMemo(() => (query === null ? [] : searchWithExtras(d, query, linkables, ["spell", "item"], 6)), [d, query, linkables]);
  const open = query !== null;
  const pick = (m: ExtraMention) => {
    const rest = value.replace(/@[^@]*$/, "").trim();
    onPick(m, rest ? `${rest} ${m.name}` : "");
  };
  return (
    <span style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <input
        ref={ref}
        className={`input ${s.in} ${bad ? s.bad : ""}`}
        value={value}
        maxLength={160}
        autoFocus={autoFocus}
        placeholder="[What to do: a quest, a person, a place, an item]"
        aria-label="Objective"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        onChange={(e) => {
          setAt(0);
          onChange(e.target.value);
        }}
        onBlur={() => {
          // A pick in the menu comes first.
          setTimeout(() => {
            if (document.activeElement !== ref.current) onBlur();
          }, 150);
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") setAt((n) => Math.min(n + 1, hits.length));
          else if (e.key === "ArrowUp") setAt((n) => Math.max(n - 1, 0));
          else if (e.key === "Enter") {
            if (hits[at]) pick(hits[at]);
            else onChange(value.replace(/@/, ""));
          } else if (e.key === "Escape") onChange(value.replace(/@([^@]*)$/, "$1"));
          else return;
          e.preventDefault();
        }}
      />
      {open && (
        <ul id={listId} className={s.pop} role="listbox">
          {hits.map((m, i) => (
            <li key={`${m.kind}:${m.id}`} role="option" aria-selected={i === at} onMouseDown={(e) => (e.preventDefault(), pick(m))}>
              {m.name}
              <small>{m.where}</small>
            </li>
          ))}
          <li role="option" aria-selected={at === hits.length} onMouseDown={(e) => (e.preventDefault(), onChange(value.replace(/@([^@]*)$/, "$1")))}>
            <span className="muted">Or leave it as your own words</span>
          </li>
        </ul>
      )}
    </span>
  );
}

/** The quest and stage the save shows when it's done: a quest from the planner's quests, and a stage. */
function QuestStage({ quests, detect, onChange }: { quests: ExtraMention[]; detect: Detect | null; onChange: (d: Detect) => void }) {
  const named = detect ? quests.find((q) => q.id === detect.quest) : undefined;
  const [name, setName] = useState(named?.name ?? "");
  const [stage, setStage] = useState(detect?.stage === undefined ? "" : String(detect.stage));
  const listId = useId();
  const send = (n: string, st: string) => {
    const q = quests.find((x) => x.name.toLowerCase() === n.trim().toLowerCase());
    if (q) onChange({ quest: q.id, ...(st.trim() ? { stage: Number(st) } : {}) });
  };
  return (
    <span className={s.row} style={{ gridTemplateColumns: "minmax(0,1fr) 90px", gap: 10 }}>
      <input className={`input ${s.in} ${s.sm}`} list={listId} aria-label="Quest" placeholder="[The quest]" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => send(name, stage)} />
      <datalist id={listId}>
        {quests.map((q) => (
          <option key={q.id} value={q.name}>
            {q.where}
          </option>
        ))}
      </datalist>
      <input className={`input ${s.in} ${s.sm}`} type="number" min={0} aria-label="Stage" placeholder="Stage" value={stage} onChange={(e) => setStage(e.target.value)} onBlur={() => send(name, stage)} />
    </span>
  );
}

function ReachPick({ d, reach, onChange }: { d: readonly string[]; reach: Reach; onChange: (r: Reach) => void }) {
  const type = reach.key === "level" ? "level" : reach.key.startsWith("skill:") ? "skill" : "count";
  const [target, setTarget] = useState(String(reach.target));
  const [label, setLabel] = useState(type === "count" ? reach.key.slice(6) : "");
  const t = Number(target) || 1;
  return (
    <span className={s.row} style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 90px", gap: 10 }}>
      <select
        className={`select ${s.sm}`}
        aria-label="What number"
        value={type}
        onChange={(e) => {
          const v = e.target.value;
          onChange({ key: v === "level" ? "level" : v === "skill" ? `skill:${d[0]}` : `count:${label || "books read"}`, target: t });
          if (v === "count" && !label) setLabel("books read");
        }}
      >
        {REACH_KINDS.map((k) => (
          <option key={k.v} value={k.v}>
            {k.label}
          </option>
        ))}
      </select>
      {type === "skill" ? (
        <select className={`select ${s.sm}`} aria-label="Skill" value={reach.key.slice(6)} onChange={(e) => onChange({ key: `skill:${e.target.value}`, target: t })}>
          {d.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      ) : type === "count" ? (
        <input className={`input ${s.in} ${s.sm}`} aria-label="Count of" maxLength={40} value={label} onChange={(e) => setLabel(e.target.value)} onBlur={() => label.trim() && onChange({ key: `count:${label.trim()}`, target: t })} />
      ) : (
        <span />
      )}
      <input className={`input ${s.in} ${s.sm}`} type="number" min={1} aria-label="Target" value={target} onChange={(e) => setTarget(e.target.value)} onBlur={() => onChange({ ...reach, target: t })} />
    </span>
  );
}

function Beat({ pid, c, lastObjective, onSaved }: { pid: string; c: EditChapter; lastObjective: number | null; onSaved: () => void }) {
  const { error, save } = useSave(onSaved);
  const waits = c.opensAfter !== null;
  return (
    <div className={s.beat}>
      <span className={s.beatHead}>
        <span className={s.beatTitle}>{c.title}</span>
        <span className={s.actions}>
          <Link href={`/p/${pid}/edit/tale/${c.id}`} className="btn btn-sm">
            Edit the scene
          </Link>
          <button type="button" className="btn btn-sm" onClick={() => window.confirm(`Remove the beat ${c.title}?`) && save(() => act.removeChapter(pid, c.id), true)}>
            Remove
          </button>
        </span>
      </span>
      <span className={s.field} style={{ maxWidth: 520 }}>
        <span className={s.lbl}>Opens when</span>
        <span className={s.seg}>
          <button type="button" aria-pressed={waits} disabled={lastObjective === null} onClick={() => !waits && lastObjective && save(() => act.saveChapter(pid, c.id, { opensAfter: lastObjective }), true)}>
            The objective above is done
          </button>
          <button type="button" aria-pressed={!waits} onClick={() => waits && save(() => act.saveChapter(pid, c.id, { opensAfter: null }), true)}>
            Right away
          </button>
        </span>
      </span>
      {c.firstLine && <p className={s.beatText}>{c.firstLine}</p>}
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </div>
  );
}

function Suggested({ a }: { a: EditAct }) {
  const waiting = a.objectives.filter((o) => !o.accepted);
  if (!waiting.length) return null;
  const by = waiting[0].suggestedBy ?? "an assistant";
  return (
    <section className={s.panel} aria-labelledby="sug" style={{ gap: 12 }}>
      <h2 id="sug" className={`${s.h2} ${s.h2s}`}>
        Suggested by {by}
      </h2>
      <span style={{ fontSize: 15, color: "var(--soft)" }}>
        {waiting.length} waiting in Act {a.n}: {waiting.map((o) => o.text).join(", ")}. Accept or skip {waiting.length === 1 ? "it" : "them"} on the quest log; nothing is added until you accept it.
      </span>
    </section>
  );
}

const KIND_LABEL = { chapter: "Before the game", entry: "Entry", beat: "Beat" } as const;

function Chapters({ data, onSaved }: { data: EditData; onSaved: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { error, save } = useSave(onSaved);
  const actName = (id: number | null) => {
    const a = data.acts.find((x) => x.id === id);
    return a ? `Act ${a.n}` : "";
  };
  const groups = [{ id: null as number | null, name: "Before Skyrim" }, ...data.acts.map((a) => ({ id: a.id as number | null, name: `Act ${a.n} ${a.name}` }))];
  return (
    <section aria-labelledby="chapters" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <span className={s.headRule}>
        <h2 id="chapters" className={`${s.h2} ${s.h2s}`}>
          The tale
        </h2>
        <Link href={`/p/${data.id}/tale`} className={s.note}>
          Read it ›
        </Link>
      </span>
      {groups.map((g) => {
        const mine = data.chapters.filter((c) => c.actId === g.id);
        if (!mine.length && g.id !== null) return null;
        return (
          <div key={String(g.id)}>
            <span className={s.lbl}>{g.name}</span>
            {mine.map((c, i) => (
              <div key={c.id} className={s.chapter}>
                <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span className={s.chapterTitle}>{c.title}</span>
                  <span className={s.note}>{[KIND_LABEL[c.kind], actName(c.actId)].filter(Boolean).join(" | ")}</span>
                </span>
                <span className={s.actions}>
                  <Moves label={c.title} first={i === 0} last={i === mine.length - 1} onMove={(to) => save(() => act.moveChapter(data.id, c.id, to), true)} />
                  <Link href={`/p/${data.id}/edit/tale/${c.id}`} className="btn btn-sm">
                    Edit
                  </Link>
                  <button type="button" className="btn btn-sm" onClick={() => window.confirm(`Remove ${c.title}?`) && save(() => act.removeChapter(data.id, c.id), true)}>
                    Remove
                  </button>
                </span>
              </div>
            ))}
            {g.id === null && !mine.length && <p className="muted">No chapters before the game yet.</p>}
          </div>
        );
      })}
      <form
        className={s.add}
        onSubmit={(e) => {
          e.preventDefault();
          save(async () => {
            const r = await act.newChapter(data.id, { kind: "chapter", title });
            if (r.ok) router.push(`/p/${data.id}/edit/tale/${r.value}`);
            return r;
          });
        }}
      >
        <input className={`input ${s.sm}`} style={{ flex: "1 1 260px" }} aria-label="New chapter's title" placeholder="[Chapter Five: The Road North]" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit" className="btn btn-sm">
          Add a chapter
        </button>
        <span className={s.note}>Up to 5 images a chapter, your own. Captions under each.</span>
        {error && (
          <span role="alert" className={s.error}>
            {error}
          </span>
        )}
      </form>
    </section>
  );
}

/** The playthrough's own details: name, line, build, the opening image, "Drafted with", delete. */
function Details({ data, onSaved }: { data: EditData; onSaved: () => void }) {
  const router = useRouter();
  const { error, save, setError } = useSave(onSaved);
  const [name, setName] = useState(data.name);
  const [line, setLine] = useState(data.line);
  const [uploading, setUploading] = useState(false);
  return (
    <section className={s.panel} aria-labelledby="details" style={{ gap: 14 }}>
      <h2 id="details" className={`${s.h2} ${s.h2s}`}>
        The playthrough
      </h2>
      <label className={s.field}>
        <span className={s.lbl}>Name</span>
        <input className={`input ${s.in}`} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} onBlur={() => name !== data.name && save(() => act.saveDetails(data.id, { name }), true)} />
      </label>
      <label className={s.field}>
        <span className={s.lbl}>One line</span>
        <textarea className={`textarea ${s.in}`} rows={3} value={line} maxLength={140} onChange={(e) => setLine(e.target.value)} onBlur={() => line !== data.line && save(() => act.saveDetails(data.id, { line }), true)} />
      </label>
      <label className={s.field}>
        <span className={s.lbl}>Build</span>
        <select className="select" value={data.buildId ?? ""} onChange={(e) => save(() => act.saveDetails(data.id, { buildId: e.target.value || null }), true)}>
          <option value="">No build yet</option>
          {data.builds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {/* The character's one cover is the build's (WO-114), uploaded as Set up uploads it. */}
      <span className={s.field}>
        <span className={s.lbl}>Cover</span>
        {data.buildId ? (
          <span className={s.actions} style={{ alignItems: "center" }}>
            <label className="btn btn-sm" style={{ cursor: "pointer" }}>
              {uploading ? "Uploading" : data.coverImageUrl ? "Change it" : "Add one"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const form = new FormData();
                  form.append("file", file);
                  const res = await fetch("/api/covers", { method: "POST", body: form }).catch(() => null);
                  const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
                  setUploading(false);
                  if (body?.url) save(() => act.saveCover(data.id, body.url!), true);
                  else setError(body?.error ?? "The upload didn't finish. Try again.");
                }}
              />
            </label>
            {data.coverImageUrl && (
              <button type="button" className="btn btn-sm" onClick={() => save(() => act.saveCover(data.id, null), true)}>
                Remove
              </button>
            )}
          </span>
        ) : (
          <span className={s.note}>The cover is the build&apos;s. Link a build to add one.</span>
        )}
      </span>
      {data.draftedBy && (
        <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 15 }}>
          <input type="checkbox" defaultChecked={data.showDrafted} onChange={(e) => save(() => act.saveDetails(data.id, { showDrafted: e.target.checked }), true)} />
          Show &quot;Drafted with {data.draftedBy}&quot;
        </label>
      )}
      <button
        type="button"
        className="btn btn-sm"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (!window.confirm(`Delete ${data.name}? Its acts, objectives and tale go with it.`)) return;
          save(async () => {
            const r = await act.removePlaythrough(data.id);
            if (r.ok) router.push("/me#playthroughs");
            return r;
          });
        }}
      >
        Delete the playthrough
      </button>
      {error && (
        <span role="alert" className={s.error}>
          {error}
        </span>
      )}
    </section>
  );
}
