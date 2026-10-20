"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGameData } from "@/components/game-data";
import { InfoTip } from "@/components/ui/info-tip";
import type { ExtraMention } from "@/lib/guide/mention";
import * as act from "@/lib/playthroughs/actions";
import { objectiveRefusal } from "@/lib/playthroughs/status";
import type { Detect, DoneBy, ObjectiveKind, ObjectiveLink, Reach } from "@/lib/playthroughs/types";
import { LINK_LABEL, MentionInput, QuestStage, ReachPick, useSave, type EditAct, type EditChapter, type EditData, type EditObjective } from "./edit-parts";
import e from "./edit.module.css";
import s from "./play-edit.module.css";

/**
 * Play in edit (WO-117), as the EditPlay board: it looks like Play. The acts down the left (drag one,
 * or its handle's arrow keys, to move it; + Add an act at the foot), then the act's card as readers
 * see it (its picture, or a dashed slot for one; its name edited in place; its chapter's first lines
 * and the way to it in the Story), its fields, and its objectives as rows that open one at a time.
 * Every button in the work area is quiet; Done in the band is the one ember button.
 */
export function PlayEdit({ data, current, linkables, details }: { data: EditData; current: EditAct | null; linkables: ExtraMention[]; details: React.ReactNode }) {
  return (
    <main className={`page ${s.main}`}>
      <aside className={s.aside}>
        <ActsList data={data} current={current} />
        {details}
      </aside>
      <div className={s.col}>
        {current ? (
          <>
            <ActCard key={`c${current.id}`} data={data} a={current} />
            <ActFields key={`f${current.id}`} pid={data.id} a={current} last={data.acts.length === 1} />
            <Objectives key={`o${current.id}`} data={data} a={current} linkables={linkables} />
          </>
        ) : (
          <p className="muted">No acts yet. Add the first.</p>
        )}
      </div>
    </main>
  );
}

/** Drag to reorder (and a handle's arrow keys, for keyboards): `move(id, to)` with `to` 1-based. */
function useReorder(ids: number[], move: (id: number, to: number) => void) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const row = (id: number, i: number) => ({
    draggable: true,
    onDragStart: (ev: React.DragEvent) => {
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text/plain", String(id));
      setDragging(id);
    },
    onDragOver: (ev: React.DragEvent) => {
      if (dragging === null) return;
      ev.preventDefault();
      setOver(i);
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
    onDrop: (ev: React.DragEvent) => {
      ev.preventDefault();
      if (dragging !== null && dragging !== id) move(dragging, i + 1);
      setDragging(null);
      setOver(null);
    },
    "data-over": over === i && dragging !== id ? "" : undefined,
  });
  const keys = (id: number) => (ev: React.KeyboardEvent) => {
    const i = ids.indexOf(id);
    if (ev.key === "ArrowUp" && i > 0) move(id, i);
    else if (ev.key === "ArrowDown" && i < ids.length - 1) move(id, i + 2);
    else return;
    ev.preventDefault();
  };
  return { row, keys };
}

function Handle({ label, onKeyDown }: { label: string; onKeyDown: (e: React.KeyboardEvent) => void }) {
  return (
    <button type="button" className={s.handle} aria-label={`Move ${label}: drag, or the up and down arrows`} onKeyDown={onKeyDown}>
      ⋮⋮
    </button>
  );
}

function ActsList({ data, current }: { data: EditData; current: EditAct | null }) {
  const router = useRouter();
  const { error, save } = useSave(() => {});
  const last = data.acts.at(-1);
  const { row, keys } = useReorder(
    data.acts.map((a) => a.id),
    (id, to) => save(() => act.moveAct(data.id, id, to), true),
  );
  return (
    <section aria-labelledby="acts" className={s.acts}>
      <h2 id="acts" className={s.head}>
        Acts
      </h2>
      {data.acts.map((a, i) => (
        <div key={a.id} className={s.actRow} aria-current={a.id === current?.id ? "true" : undefined} {...row(a.id, i)}>
          <Handle label={`Act ${a.n} ${a.name}`} onKeyDown={keys(a.id)} />
          <Link href={`/p/${data.id}/edit/play?act=${a.id}`} scroll={false} className={s.actLink}>
            <span className={s.actName}>
              {a.n} {a.name}
            </span>
            <span className={s.actWhere}>{[levelsOf(a), a.place].filter(Boolean).join(" | ")}</span>
          </Link>
        </div>
      ))}
      <button
        type="button"
        className={s.add}
        onClick={() =>
          save(async () => {
            const from = last ? (last.levelTo ?? last.levelFrom) : 1;
            const r = await act.newAct(data.id, { name: `Act ${data.acts.length + 1}`, levels: `${from} and up`, place: "", goal: "" });
            if (r.ok) router.push(`/p/${data.id}/edit/play?act=${r.value}`);
            return r;
          }, true)
        }
      >
        + Add an act
      </button>
      {error && (
        <span role="alert" className={e.error}>
          {error}
        </span>
      )}
    </section>
  );
}

const levelsOf = (a: { levelFrom: number; levelTo: number | null }) => (a.levelTo === null ? `${a.levelFrom} and up` : `${a.levelFrom} to ${a.levelTo}`);

/** The act's card as readers see it: its picture or a dashed slot for one, its name in place, its chapter. */
function ActCard({ data, a }: { data: EditData; a: EditAct }) {
  const { error, save } = useSave(() => {});
  const [name, setName] = useState(a.name);
  const [uploading, setUploading] = useState(false);
  const [upError, setUpError] = useState<string | null>(null);
  const chapter = a.chapterId !== null ? data.chapters.find((c) => c.id === a.chapterId) : undefined;
  const story = `/p/${data.id}/edit/story/${chapter ? chapter.id : `act-${a.id}`}`;
  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUpError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/playthroughs/${data.id}/images`, { method: "POST", body: form }).catch(() => null);
    const body = (await res?.json().catch(() => ({}))) as { url?: string; error?: string } | undefined;
    setUploading(false);
    if (body?.url) save(() => act.saveActImage(data.id, a.id, body.url!), true);
    else setUpError(body?.error ?? "The upload didn't finish. Try again.");
  };
  const picker = (label: string) => (
    <label className="btn btn-sm" style={{ cursor: "pointer" }}>
      {uploading ? "Uploading" : label}
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(ev) => void upload(ev.target.files?.[0])} />
    </label>
  );
  return (
    <section aria-label={`Act ${a.n}'s card`} className={`${s.card} ${a.imageUrl ? "" : s.cardEmpty}`}>
      {a.imageUrl && (
        <>
          <img src={a.imageUrl} alt="" className={s.cardImage} />
          <div className={s.cardFade} aria-hidden="true" />
        </>
      )}
      <div className={s.cardIn}>
        <span className={s.kicker}>Act {a.n}</span>
        <input
          className={s.cardName}
          aria-label="The act's name"
          value={name}
          maxLength={60}
          onChange={(ev) => setName(ev.target.value)}
          onBlur={() => name.trim() && name !== a.name && save(() => act.saveAct(data.id, a.id, { name: name.trim() }), true)}
        />
        {chapter ? (
          <span className={s.cardLines}>
            {chapter.firstLine ? <span className={s.firstLine}>{chapter.firstLine}</span> : null} <Link href={story}>Edit it in the Story ›</Link>
          </span>
        ) : (
          <span className={s.cardNone}>
            No chapter for this act yet. <Link href={story}>Write it in the Story ›</Link>
          </span>
        )}
        {(error || upError) && (
          <span role="alert" className={e.error}>
            {error || upError}
          </span>
        )}
      </div>
      <span className={s.cardPicture}>
        {a.imageUrl ? (
          <>
            {picker("Change the picture")}
            <button type="button" className="btn btn-sm" onClick={() => save(() => act.saveActImage(data.id, a.id, null), true)}>
              Remove
            </button>
          </>
        ) : (
          picker("Add the act's picture")
        )}
      </span>
    </section>
  );
}

function ActFields({ pid, a, last }: { pid: string; a: EditAct; last: boolean }) {
  const router = useRouter();
  const { error, save } = useSave(() => {});
  const [from, setFrom] = useState(String(a.levelFrom));
  const [to, setTo] = useState(a.levelTo === null ? "" : String(a.levelTo));
  const [place, setPlace] = useState(a.place);
  const [goal, setGoal] = useState(a.goal);
  const [rule, setRule] = useState(a.standingRule ?? "");
  const levels = () => {
    const f = Number(from) || 1;
    const t = to.trim() ? Number(to) : null;
    const next = t === null ? `${f} and up` : `${f} to ${t}`;
    if (next !== levelsOf(a)) save(() => act.saveAct(pid, a.id, { levels: next }), true);
  };
  return (
    <section aria-label="The act" className={s.fields}>
      <div className={s.row3}>
        <label className={s.field}>
          <span className="label">From level</span>
          <input className={`input ${e.in}`} type="number" min={1} value={from} onChange={(ev) => setFrom(ev.target.value)} onBlur={levels} />
        </label>
        <label className={s.field}>
          <span className="label">To level</span>
          <input className={`input ${e.in}`} type="number" min={1} value={to} placeholder="And up" onChange={(ev) => setTo(ev.target.value)} onBlur={levels} />
        </label>
        <label className={s.field}>
          <span className="label">Place</span>
          <input className={`input ${e.in}`} value={place} maxLength={80} onChange={(ev) => setPlace(ev.target.value)} onBlur={() => place !== a.place && save(() => act.saveAct(pid, a.id, { place }), true)} />
        </label>
      </div>
      <div className={s.field}>
        <span className="label">
          <label htmlFor={`goal-${a.id}`}>Goal</label> <InfoTip label="About the goal" text="What the act is for, in one line. It shows under the act's card." />
        </span>
        <input id={`goal-${a.id}`} className={`input ${e.in}`} value={goal} maxLength={200} onChange={(ev) => setGoal(ev.target.value)} onBlur={() => goal !== a.goal && save(() => act.saveAct(pid, a.id, { goal }), true)} />
      </div>
      <div className={s.field}>
        <span className="label">
          <label htmlFor={`rule-${a.id}`}>Standing rule</label>{" "}
          <InfoTip label="About the standing rule" text="Something she keeps doing through the whole act. It has no box to tick, so it is not an objective." />
        </span>
        <input
          id={`rule-${a.id}`}
          className={`input ${e.in}`}
          value={rule}
          maxLength={200}
          placeholder="[What the player keeps doing: this isn't an objective]"
          onChange={(ev) => setRule(ev.target.value)}
          onBlur={() => rule !== (a.standingRule ?? "") && save(() => act.saveAct(pid, a.id, { standingRule: rule || null }), true)}
        />
      </div>
      <span className={s.fieldsFoot}>
        {error && (
          <span role="alert" className={e.error}>
            {error}
          </span>
        )}
        {!last && (
          <button
            type="button"
            className={s.remove}
            onClick={() => {
              if (!window.confirm(`Remove Act ${a.n}, its objectives, entries and beats?`)) return;
              save(async () => {
                const r = await act.removeAct(pid, a.id);
                if (r.ok) router.push(`/p/${pid}/edit/play`);
                return r;
              }, true);
            }}
          >
            Remove this act
          </button>
        )}
      </span>
    </section>
  );
}

function Objectives({ data, a, linkables }: { data: EditData; a: EditAct; linkables: ExtraMention[] }) {
  const [open, setOpen] = useState<number | "new" | null>(null);
  const { error, save } = useSave(() => {});
  const { row, keys } = useReorder(
    a.objectives.map((o) => o.id),
    (id, to) => save(() => act.moveObjective(data.id, id, to), true),
  );
  return (
    <section aria-labelledby="objs" className={s.objs}>
      <span className={s.headRow}>
        <h2 id="objs" className={s.head}>
          Objectives
        </h2>
        <span className="muted">
          {a.objectives.length} in this act
        </span>
      </span>
      {a.objectives.map((o, i) => (
        <ObjectiveRow
          key={o.id}
          data={data}
          a={a}
          o={o}
          linkables={linkables}
          open={open === o.id}
          onToggle={() => setOpen(open === o.id ? null : o.id)}
          drag={row(o.id, i)}
          onHandleKey={keys(o.id)}
        />
      ))}
      {open === "new" && <ObjectiveRow data={data} a={a} o={null} linkables={linkables} open onToggle={() => setOpen(null)} />}
      {open !== "new" && (
        <button type="button" className={s.add} onClick={() => setOpen("new")}>
          + Add an objective
        </button>
      )}
      {error && (
        <span role="alert" className={e.error}>
          {error}
        </span>
      )}
    </section>
  );
}

/**
 * One objective as a row like Play's: its handle, box, words and why line, its Story link and Edit.
 * Open, its fields sit under it: what to do, Kind and Done when, the quest or the number, why, its
 * story, and Move to another act and Remove.
 */
function ObjectiveRow({
  data,
  a,
  o,
  linkables,
  open,
  onToggle,
  drag,
  onHandleKey,
}: {
  data: EditData;
  a: EditAct;
  o: EditObjective | null;
  linkables: ExtraMention[];
  open: boolean;
  onToggle: () => void;
  drag?: React.HTMLAttributes<HTMLDivElement>;
  onHandleKey?: (e: React.KeyboardEvent) => void;
}) {
  const d = useGameData();
  const router = useRouter();
  const pid = data.id;
  const { error, save, setError } = useSave(() => {});
  const [text, setText] = useState(o?.text ?? "");
  const [link, setLink] = useState<{ link: ObjectiveLink; name: string } | null>(o?.link && o.linkName ? { link: o.link, name: o.linkName } : null);
  const [kind, setKind] = useState<ObjectiveKind>(o?.kind ?? "once");
  const [doneBy, setDoneBy] = useState<DoneBy>(o?.doneBy ?? "hand");
  const [detect, setDetect] = useState<Detect | null>(o?.detect ?? null);
  const [reach, setReach] = useState<Reach>(o?.reach ?? { key: "level", target: 10 });
  const [why, setWhy] = useState(o?.why ?? "");
  const quests = useMemo(() => linkables.filter((x) => x.kind === "quest"), [linkables]);
  const tale: EditChapter[] = o ? data.chapters.filter((c) => (c.kind === "entry" || c.kind === "beat") && c.opensAfter === o.id) : [];
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
    if (!o) save(() => act.newObjective(pid, a.id, v), true, (r) => r.ok && onToggle());
    else save(() => act.saveObjective(pid, o.id, v), true);
  };
  const addBeat = () =>
    o &&
    save(async () => {
      const r = await act.newChapter(pid, { kind: "beat", title: "A new beat", actId: a.id, opensAfter: o.id });
      if (r.ok) router.push(`/p/${pid}/edit/story/${r.value}`);
      return r;
    });
  const others = data.acts.filter((x) => x.id !== a.id);

  return (
    <div className={`${s.ob} ${open ? s.obOpen : ""} ${o && !o.accepted ? s.obSug : ""}`} {...(o && drag ? drag : {})} id={o ? `eo${o.id}` : undefined}>
      {o && (
        <div className={s.obRow}>
          {onHandleKey ? <Handle label={o.text} onKeyDown={onHandleKey} /> : <span />}
          <span className={s.box} aria-hidden="true" />
          <button type="button" className={s.obWords} onClick={onToggle} aria-expanded={open}>
            <span className={s.obText}>{o.text}</span>
            {o.why && <span className={s.obWhy}>{o.why}</span>}
          </button>
          <span className={s.obSide}>
            {tale.map((c) => (
              <Link key={c.id} href={`/p/${pid}/edit/story/${c.id}`} className={s.obStory}>
                Story: {c.title}
              </Link>
            ))}
            {o.accepted ? (
              <button type="button" className="btn btn-sm" onClick={onToggle} aria-expanded={open} aria-label={`${open ? "Close" : "Edit"} ${o.text}`}>
                {open ? "Close" : "Edit"}
              </button>
            ) : (
              <>
                <span className="muted">Suggested by your assistant</span>
                <button type="button" className="btn btn-sm" onClick={() => save(() => act.answer(pid, o.id, true), true)}>
                  Accept
                </button>
                <button type="button" className="btn btn-sm" onClick={() => save(() => act.answer(pid, o.id, false), true)}>
                  Skip
                </button>
              </>
            )}
          </span>
        </div>
      )}
      {open && (
        <div className={s.obBody}>
          <div className={s.field}>
            <span className="label">What to do</span>
            <span className={e.textLine}>
              {link && (
                <span className={e.mention}>
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
            {refused && <span className={e.warn}>{refused}</span>}
            {!refused && error && (
              <span role="alert" className={e.warn}>
                {error}
              </span>
            )}
          </div>
          <div className={s.segs}>
            <div className={s.field}>
              <span className="label">
                Kind{" "}
                <InfoTip label="About the kind" text="Done once: a quest, a stage, a person, a place, an item, or one thing she does. Reach a number: a level, a skill, or a count." />
              </span>
              <span className={s.seg} role="group" aria-label="Kind">
                {(["once", "reach"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => {
                      setKind(k);
                      commit({ kind: k });
                    }}
                  >
                    {k === "once" ? "Done once" : "Reach a number"}
                  </button>
                ))}
              </span>
            </div>
            {kind === "once" && (
              <div className={s.field}>
                <span className="label">
                  Done when <InfoTip label="About done when" text="The save says so: the planner ticks it from your save. You tick it: for things a save can't show." />
                </span>
                <span className={s.seg} role="group" aria-label="Done when">
                  {(["save", "hand"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={doneBy === v}
                      onClick={() => {
                        setDoneBy(v);
                        commit({ doneBy: v });
                      }}
                    >
                      {v === "save" ? "The save says so" : "You tick it"}
                    </button>
                  ))}
                </span>
              </div>
            )}
          </div>
          {kind === "once" ? (
            doneBy === "save" && (
              <div className={s.field}>
                <span className="label">
                  Quest <InfoTip label="About the quest" text="Link a planner quest and the save can tick it. Leave it empty for something of her own." />
                </span>
                <QuestStage quests={quests} detect={detect ?? (link?.link.kind === "quest" ? { quest: link.link.id } : null)} onChange={(det) => (setDetect(det), commit({ detect: det }))} />
              </div>
            )
          ) : (
            <div className={s.field}>
              <span className="label">What, and how many</span>
              <ReachPick d={d.skills} reach={reach} onChange={(r) => (setReach(r), commit({ reach: r }))} />
            </div>
          )}
          <label className={s.field}>
            <span className="label">Why</span>
            <input className={`input ${e.in}`} value={why} maxLength={300} onChange={(ev) => setWhy(ev.target.value)} onBlur={() => why.trim() !== (o?.why ?? "") && commit()} />
          </label>
          {o && (
            <div className={s.field}>
              <span className="label">Story</span>
              {tale.length ? (
                tale.map((c) => (
                  <span key={c.id} className={s.storyLine}>
                    {c.kind === "entry" ? "Entry" : "Beat"}: {c.title}, opens when this is done. <Link href={`/p/${pid}/edit/story/${c.id}`}>Open it in the Story ›</Link>
                  </span>
                ))
              ) : (
                <span className={s.storyLine}>
                  No entry or beat.{" "}
                  <button type="button" className={s.linkButton} onClick={addBeat}>
                    Add a beat ›
                  </button>
                </span>
              )}
            </div>
          )}
          <span className={s.obFoot}>
            {o ? (
              <>
                {others.length > 0 ? (
                  <select className={`select ${s.moveTo}`} aria-label="Move to another act" value="" onChange={(ev) => ev.target.value && save(() => act.moveObjective(pid, o.id, 1, Number(ev.target.value)), true)}>
                    <option value="">Move to another act ▾</option>
                    {others.map((x) => (
                      <option key={x.id} value={x.id}>
                        Act {x.n} {x.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span />
                )}
                <button type="button" className={s.remove} onClick={() => window.confirm(`Remove ${o.text}?`) && save(() => act.removeObjective(pid, o.id), true)}>
                  Remove
                </button>
              </>
            ) : (
              <>
                <span className="muted">@ links a quest, a quest line, a spell, an item or a follower</span>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setError(null);
                    onToggle();
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
