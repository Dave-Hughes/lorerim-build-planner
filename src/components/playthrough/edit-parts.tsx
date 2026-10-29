"use client";

import type { Mod } from "@/lib/mods";
import { useRouter } from "next/navigation";
import { createContext, useContext, useId, useMemo, useRef, useState, useTransition } from "react";
import type { SaveState } from "@/components/editor/edit-bar";
import type { useGameData } from "@/components/game-data";
import { searchWithExtras, type ExtraMention } from "@/lib/guide/mention";
import { useItems } from "@/lib/items/items";
import type { BuildVisibility } from "@/lib/builds/validate";
import type { Answer, ChapterKind, Detect, DoneBy, ObjectiveKind, ObjectiveLink, Reach, RouteStop } from "@/lib/playthroughs/types";
import s from "./edit.module.css";

/**
 * The run editor's shared parts (WO-111, WO-117): its data, the save that tells the edit band how it
 * went, and the fields an objective is made of (the @ mention, the quest and stage, the number).
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
  /** Its stop on the act's route (WO-129). */
  stop: string | null;
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
  /** Its route (WO-129): the stops in order, each with why she goes there next. */
  route: RouteStop[];
  /** The act's image on its story card (WO-116), and what stays in view of it (WO-118). */
  imageUrl: string | null;
  imageFocus: { x: number; y: number } | null;
  /** The act's first chapter (WO-118), if written. */
  chapterId: number | null;
  objectives: EditObjective[];
}
export interface EditChapter {
  id: number;
  kind: ChapterKind;
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
  /** The character's pronouns, when set (WO-179). */
  pronoun: "she" | "he" | "they" | null;
  /** The Tale page's title and epigraph (WO-114). */
  taleTitle: string;
  taleLine: string;
  /** The Before you design answers (WO-139), in the player's words. */
  answers: Answer[];
  /** The mods the character needs (WO-139 Part 4). */
  mods: Mod[];
  acts: EditAct[];
  chapters: EditChapter[];
  builds: { id: string; name: string }[];
  /** Where you stand (WO-118): its one line on Play, and what Enter it by hand starts from. */
  /** The character's names, the run's (its own) then the build's, for Read a save's check (WO-112). */
  characters: string[];
  stand: { line: string | null; initial: { level: number | null; day: number | null; place: string; skills: Record<string, number>; counts: Record<string, number> }; skills: string[]; counts: string[] };
}

export type Result = { ok: true } | { ok: false; error: string };

/** Every save on the page tells the edit band how it went (WO-117). */
export const Report = createContext<(s: SaveState) => void>(() => {});

export function useSave(onSaved: () => void) {
  const router = useRouter();
  const report = useContext(Report);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const save = (fn: () => Promise<Result | { ok: boolean; error?: string }>, refresh = false, then?: (r: { ok: boolean }) => void) =>
    start(async () => {
      report({ state: "saving" });
      const r = (await fn()) as { ok: boolean; error?: string };
      if (r.ok) {
        setError(null);
        report({ state: "saved" });
        onSaved();
        if (refresh) router.refresh();
      } else {
        setError(r.error ?? "That didn't save. Try again.");
        report({ state: "failed", error: r.error ?? "That didn't save." });
      }
      then?.(r);
    });
  return { pending, error, save, setError };
}

export const REACH_KINDS = [
  { v: "level", label: "Level" },
  { v: "skill", label: "A skill" },
  { v: "count", label: "A count" },
] as const;

export const LINK_LABEL: Record<ObjectiveLink["kind"], string> = { quest: "Quest", line: "Quest line", spell: "Spell", item: "Item", follower: "Follower", place: "Place", person: "Person" };

/** The text, with `@` opening the mention menu: a quest, a quest line, a spell, an item, a follower, a place or a person. */
export function MentionInput({
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
  // The menu is open while the box has focus and its words haven't been answered: a pick, Escape or leaving the box closes it, and it
  // stays closed for those very words (WO-179 Part 2); typing on opens it again.
  const [focused, setFocused] = useState(!!autoFocus);
  const [closedFor, setClosedFor] = useState<string | null>(null);
  // `@` opens the menu as it always did; and so does plain typing (WO-179): the last words typed are looked up as a quest, a place, a person, an item
  // or a spell, and the menu opens when something answers. The typed words are what a pick replaces.
  const { query, hits, strip, plain } = useMemo(() => {
    const at = /@([^@]*)$/.exec(value);
    if (at) return { query: at[1], hits: searchWithExtras(d, at[1], linkables, ["spell", "item"], 6), strip: /@[^@]*$/, plain: false };
    const words = value.trim().split(/\s+/).filter(Boolean);
    for (const n of [3, 2, 1]) {
      const q = words.slice(-n).join(" ");
      if (q.length < 3) continue;
      const found = searchWithExtras(d, q, linkables, ["spell", "item"], 6);
      if (found.length) return { query: q, hits: found, strip: new RegExp(`${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`), plain: true };
    }
    return { query: null as string | null, hits: [] as ExtraMention[], strip: /@[^@]*$/, plain: false };
  }, [d, value, linkables]);
  const open = query !== null && focused && closedFor !== value;
  const touched = useRef(false);
  const pick = (m: ExtraMention) => {
    const rest = value.replace(strip, "").trim();
    setClosedFor(rest ? `${rest} ${m.name}` : m.name);
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
        onFocus={() => setFocused(true)}
        onChange={(e) => {
          setAt(0);
          touched.current = false;
          setClosedFor(null);
          onChange(e.target.value);
        }}
        onBlur={() => {
          // The menu closes at once; a pick in it is made on mouse down, so it is never lost to this.
          setFocused(false);
          // A pick in the menu comes first.
          setTimeout(() => {
            if (document.activeElement !== ref.current) onBlur();
          }, 150);
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") {
            touched.current = true;
            setAt((n) => Math.min(n + 1, hits.length));
          } else if (e.key === "ArrowUp") {
            touched.current = true;
            setAt((n) => Math.max(n - 1, 0));
          } else if (e.key === "Enter") {
            // Typing plainly, Enter picks only what the arrow keys reached: the words may be the player's own.
            if (plain && !touched.current) return;
            if (hits[at]) pick(hits[at]);
            else {
              setClosedFor(value.replace(/@/, ""));
              onChange(value.replace(/@/, ""));
            }
          } else if (e.key === "Escape") {
            const kept = value.replace(/@([^@]*)$/, "$1");
            setClosedFor(kept);
            onChange(kept);
          } else return;
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
          <li
            role="option"
            aria-selected={at === hits.length}
            onMouseDown={(e) => {
              e.preventDefault();
              const kept = value.replace(/@([^@]*)$/, "$1");
              setClosedFor(kept);
              onChange(kept);
            }}
          >
            <span className="muted">Or leave it as your own words</span>
          </li>
        </ul>
      )}
    </span>
  );
}

/** The quest the save shows when it's done: a quest from the planner's quests (WO-179: a record's stage number is not something players know, so there is no Stage box; one already set stays). */
export function QuestStage({ quests, detect, onChange }: { quests: ExtraMention[]; detect: Detect | null; onChange: (d: Detect) => void }) {
  const named = detect ? quests.find((q) => q.id === detect.quest) : undefined;
  const [name, setName] = useState(named?.name ?? "");
  const listId = useId();
  const send = (n: string) => {
    const q = quests.find((x) => x.name.toLowerCase() === n.trim().toLowerCase());
    if (q) onChange({ quest: q.id, ...(detect?.quest === q.id && detect.stage !== undefined ? { stage: detect.stage } : {}) });
  };
  return (
    <span className={s.row} style={{ gridTemplateColumns: "minmax(0,1fr)", gap: 10 }}>
      <input className={`input ${s.in} ${s.sm}`} list={listId} aria-label="Quest" placeholder="[The quest]" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => send(name)} />
      <datalist id={listId}>
        {quests.map((q) => (
          <option key={q.id} value={q.name}>
            {q.where}
          </option>
        ))}
      </datalist>
    </span>
  );
}

export function ReachPick({ d, reach, onChange }: { d: readonly string[]; reach: Reach; onChange: (r: Reach) => void }) {
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
