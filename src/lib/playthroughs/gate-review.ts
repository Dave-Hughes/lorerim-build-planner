import type { Quest, QuestLine } from "@/lib/quests/types";
import { startChecked } from "@/lib/quests/types";
import type { Detect, ObjectiveLink } from "./types";

/**
 * Gate chains across acts (WO-148 item 6): advice for the assistant, as review.ts's, never a refusal. Walking the acts in order with
 * what the earlier ones contain, each quest or line an objective links is checked against what it waits for: the level (its line's,
 * and its first way in's), the lines it needs (a story's `opens` needs, a line's `after`), and the quests its first way in names
 * ("After Laid to Rest"). A gate the plan can't reach says what is missing and which earlier act it fits.
 *
 * Its first way in is the way the page lists first (Dawnguard's is Durak, who comes to find you at level 30 once Laid to Rest is done;
 * Agmaer at Fort Dawnguard needs neither, and the message says so). A line counts as done once an objective links the line, or its
 * last quest; that is approximate on purpose, as a plan can't say which quests she finishes.
 */

export interface GateWarning {
  code: "gate-chain";
  objective: string;
  message: string;
}

export interface GateAct {
  n: string;
  name: string;
  place: string;
  levelFrom: number;
  levelTo: number | null;
  route?: { place: string }[] | null;
  objectives: { id: number; text: string; link: ObjectiveLink | null; detect: Detect | null }[];
}

export interface GateWorld {
  lines: QuestLine[];
  /** What a story says a line needs to open, by the line's id (a story's `opens`). */
  opens: ReadonlyMap<string, { kind: string; level?: number; line?: string; text: string }[]>;
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const here = (town: string, place: string) => {
  const a = ` ${norm(town)} `;
  const b = ` ${norm(place)} `;
  return a.includes(b) || b.includes(a);
};

export function reviewGates(acts: readonly GateAct[], world: GateWorld): GateWarning[] {
  const lineById = new Map(world.lines.map((l) => [l.id, l]));
  const byEdid = new Map<string, { line: QuestLine; quest: Quest }>();
  const byName = new Map<string, { line: QuestLine; quest: Quest }[]>();
  for (const line of world.lines)
    for (const quest of line.quests) {
      byEdid.set(quest.edid, { line, quest });
      if (quest.name) byName.set(norm(quest.name), [...(byName.get(norm(quest.name)) ?? []), { line, quest }]);
    }
  const doneQuests = new Set<string>();
  const doneLines = new Set<string>();
  const out: GateWarning[] = [];
  const said = new Set<string>();

  /** The earlier act a missing thing fits, in words: by its town when an act is there, else by the level it needs. */
  const fitsIn = (before: number, name: string, line: QuestLine, quest: Quest | null): string => {
    const need = line.minLevel ?? 1;
    const towns = [...(quest?.start?.towns ?? []), line.where ?? ""].filter(Boolean);
    const reach = acts.slice(0, before).filter((a) => (a.levelTo ?? 100) >= need);
    const atTown = reach.find((a) => towns.some((t) => here(t, a.place) || (a.route ?? []).some((r) => here(t, r.place))));
    const act = atTown ?? reach.at(-1);
    if (!act) return `${name} needs level ${need}, which no earlier act reaches.`;
    return `${name} fits Act ${act.n}${atTown ? `, in ${atTown.place}` : ""}.`;
  };

  acts.forEach((a, ai) => {
    const top = a.levelTo ?? 100;
    for (const o of a.objectives) {
      const edid = o.detect?.quest ?? (o.link?.kind === "quest" ? o.link.id : null);
      const hit = edid ? byEdid.get(edid) : null;
      const line = o.link?.kind === "line" ? lineById.get(o.link.id) : hit?.line;
      if (!line) continue;
      const quest = hit?.quest ?? (o.link?.kind === "line" ? (line.quests.find((q) => q.edid === line.opening) ?? line.quests[0]) : null);
      const key = `${a.n}:${line.id}`;
      const theName = o.link?.kind === "line" || !hit ? line.name : hit.quest.name || line.name;
      if (!said.has(key)) {
        const parts: string[] = [];
        const fix: string[] = [];
        // The level: the line's own, a story's say of it, and the first way in's.
        const opens = world.opens.get(line.id) ?? [];
        const first = quest?.start && startChecked(quest.start) ? quest.start.ways?.[0] : undefined;
        const wayLevel = Math.max(0, ...(first?.needs ?? []).map((n) => Number(/^Level (\d+)$/.exec(n)?.[1] ?? 0)));
        const level = Math.max(line.minLevel ?? 0, wayLevel, ...opens.map((x) => x.level ?? 0));
        if (level && top < level) parts.push(`waits for level ${level}; the act runs only to level ${top}`);
        // The lines it needs first: a story's opens needs, and the line's `after` (the main quest is judged elsewhere).
        const needLines = [...new Set([...opens.flatMap((x) => (x.kind === "line" && x.line ? [x.line] : [])), ...line.after.filter((x) => x !== "main-quest")])].filter((id) => id !== line.id);
        for (const id of needLines) {
          const need = lineById.get(id);
          if (need && !doneLines.has(id)) {
            parts.push(`needs ${need.name}, which no earlier act has`);
            fix.push(fitsIn(ai, need.name, need, null));
          }
        }
        // The quests its first way in names, after which it starts.
        for (const n of first?.needs ?? []) {
          const m = /^After (.+)$/.exec(n);
          const named = m ? byName.get(norm(m[1].replace(/^"|"$/g, ""))) : undefined;
          if (named?.length === 1 && !doneQuests.has(named[0].quest.edid) && !needLines.includes(named[0].line.id)) {
            parts.push(`its first way in (${first!.how}) needs ${named[0].quest.name}, which no earlier act has`);
            fix.push(fitsIn(ai, named[0].quest.name, named[0].line, named[0].quest));
          }
        }
        if (parts.length) {
          said.add(key);
          const other = (quest?.start?.ways ?? []).slice(1).find((w) => !(w.needs ?? []).length);
          out.push({
            code: "gate-chain",
            objective: String(o.id),
            message: `Act ${a.n} ${a.name} links ${theName}, which ${parts.join(" and ")}. ${fix.join(" ")}${other ? ` (${other.how} needs nothing.)` : ""}`.replace(/\s+/g, " ").trim(),
          });
        }
      }
      // What this objective adds for the acts after it.
      if (edid) {
        doneQuests.add(edid);
        if (line.quests.length === 1 || line.quests.at(-1)?.edid === edid) doneLines.add(line.id);
      }
      if (o.link?.kind === "line") {
        doneLines.add(line.id);
        for (const q of line.quests) doneQuests.add(q.edid);
      }
    }
  });
  return out;
}
