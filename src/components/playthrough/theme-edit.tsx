"use client";

import { useState } from "react";
import { pro } from "@/lib/pronouns";
import * as act from "@/lib/playthroughs/actions";
import { PLAYTHROUGH_LIMITS as L, type Theme } from "@/lib/playthroughs/types";
import { checkTheme, type ThemeInput } from "@/lib/playthroughs/validate";
import { useSave, type EditData } from "./edit-parts";
import e from "./edit.module.css";
import s from "./theme-edit.module.css";

/**
 * Who she is, in the editor (WO-181): a backstory in plain paragraphs with its character count (never minutes), where she is from, her gods and her
 * goal in a line each, and three lists you add to, edit and reorder: what she will do, what she won't and the grey areas. The writing rules show
 * as you type, in the words the tool refuses with, and nothing is cut for you.
 */
export function ThemeEdit({ data }: { data: EditData }) {
  const { error, save } = useSave(() => {});
  const p = pro(data.pronoun);
  const t: Theme = data.theme;
  const [backstory, setBackstory] = useState(t.backstory ?? "");
  const [line, setLine] = useState({ from: t.from ?? "", gods: t.gods ?? "", goal: t.goal ?? "" });
  const [lists, setLists] = useState({ will: t.will ?? [], never: data.never, grey: t.grey ?? [] });
  const put = (input: ThemeInput) => {
    const r = checkTheme(input);
    if ("error" in r) return;
    save(() => act.saveTheme(data.id, input), true);
  };
  const refused = (input: ThemeInput) => {
    const r = checkTheme(input);
    return "error" in r ? r.error : null;
  };
  const who = p.subject === "they" ? "who they are" : `who ${p.subject} is`;
  const caps = p.subject.charAt(0).toUpperCase() + p.subject.slice(1);
  const names = { will: `${caps} will`, never: `${caps} won't`, grey: "Grey areas" } as const;
  const hints = {
    will: `Things ${p.subject} does in the game: work inn shifts, free captives.`,
    never: `Things ${p.subject} avoids in the game: steal from homes, take Dark Brotherhood contracts.`,
    grey: `Things ${p.subject} does and isn't proud of: loot bandit camps, pick a lock.`,
  } as const;
  const backRefused = refused({ backstory });
  const lineRefused = (k: "from" | "gods" | "goal") => refused({ [k]: line[k] } as ThemeInput);
  return (
    <section id="who" className={e.panel} aria-labelledby="who-h" style={{ gap: 18 }}>
      <h2 id="who-h" className={e.h2}>
        Write {who}
      </h2>
      <div className={s.field}>
        <label className={s.field}>
          <span className="label">Backstory</span>
          <textarea
            className={`input ${s.area}`}
            rows={9}
            value={backstory}
            aria-describedby="backstory-note"
            onChange={(ev) => setBackstory(ev.target.value)}
            onBlur={() => backstory.trim() !== (t.backstory ?? "") && put({ backstory })}
          />
        </label>
        <span id="backstory-note" className={s.count} aria-live="polite">
          {backstory.trim().length} of {L.backstory} characters
        </span>
        {backRefused && (
          <span role="alert" className={e.error}>
            {backRefused}
          </span>
        )}
        <span className="muted">
          Where {p.subject} {p.be} from, who raised {p.object}, what happened, and why {p.subject} {p.be} in Skyrim, in order, in flat sentences. A blank line starts a new paragraph.
        </span>
      </div>
      <div className={s.facts}>
        {(["from", "gods", "goal"] as const).map((k) => (
          <div key={k} className={s.field}>
            <label className={s.field}>
              <span className="label">{k === "from" ? "From" : k === "gods" ? "Gods" : "Goal"}</span>
              <input className={`input ${e.in}`} value={line[k]} maxLength={L.themeLine + 20} onChange={(ev) => setLine({ ...line, [k]: ev.target.value })} onBlur={() => line[k].trim() !== (t[k] ?? "") && put({ [k]: line[k] })} />
            </label>
            {lineRefused(k) && (
              <span role="alert" className={e.error}>
                {lineRefused(k)}
              </span>
            )}
          </div>
        ))}
      </div>
      {(["will", "never", "grey"] as const).map((k) => (
        <ListEdit
          key={k}
          title={names[k]}
          hint={hints[k]}
          items={lists[k]}
          refuse={(items) => refused({ [k]: items } as ThemeInput)}
          onChange={(items, commit) => {
            setLists({ ...lists, [k]: items });
            if (commit) put({ [k]: items } as ThemeInput);
          }}
        />
      ))}
      {error && (
        <span role="alert" className={e.error}>
          {error}
        </span>
      )}
    </section>
  );
}

function ListEdit({ title, hint, items, refuse, onChange }: { title: string; hint: string; items: string[]; refuse: (items: string[]) => string | null; onChange: (items: string[], commit: boolean) => void }) {
  const problem = refuse(items);
  const set = (i: number, v: string, commit = false) => onChange(items.map((x, j) => (j === i ? v : x)), commit);
  const move = (i: number, by: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(i + by, 0, x);
    onChange(next, true);
  };
  return (
    <fieldset className={s.list}>
      <legend className="label">{title}</legend>
      <span className="muted">{hint}</span>
      {items.map((x, i) => (
        <div key={i} className={s.row}>
          <input className={`input ${e.in}`} aria-label={`${title}, line ${i + 1}`} value={x} onChange={(ev) => set(i, ev.target.value)} onBlur={() => onChange(items.filter((y) => y.trim()), true)} />
          <button type="button" className="btn btn-sm btn-icon" aria-label={`Move ${title} line ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
            ↑
          </button>
          <button type="button" className="btn btn-sm btn-icon" aria-label={`Move ${title} line ${i + 1} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)}>
            ↓
          </button>
          <button type="button" className={s.remove} aria-label={`Remove ${title} line ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i), true)}>
            Remove
          </button>
        </div>
      ))}
      {items.length < L.themeLines && (
        <button type="button" className={s.add} onClick={() => onChange([...items, ""], false)}>
          + Add a line
        </button>
      )}
      {problem && (
        <span role="alert" className={e.error}>
          {problem}
        </span>
      )}
    </fieldset>
  );
}
