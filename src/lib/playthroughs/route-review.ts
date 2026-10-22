import "server-only";
import { questsData } from "@/lib/quests/data";
import type { Quest, QuestLine } from "@/lib/quests/types";
import type { Detect, ObjectiveLink, RouteStop } from "./types";
import { stopKey } from "./validate";

/**
 * An act's road, checked (WO-129 Part 3): advice for the assistant, as review.ts's, never a refusal. An objective whose
 * quest starts in a town the route has already left, or in a town not on the route at all (backtrack); an objective in an
 * act with a route but at no stop on it (no thread); and an objective that names a destination for a radiant job whose
 * name and objective carry none (a promise the game doesn't make: Missives, marked `destinationInName: false` in the data).
 */

export interface RouteWarning {
  code: "route-backtrack" | "route-no-stop" | "route-promise";
  objective: string;
  message: string;
}

export interface RoutedAct {
  n: string;
  route?: RouteStop[] | null;
  objectives: { id: number; text: string; why: string | null; stop?: string | null; link: ObjectiveLink | null; detect: Detect | null }[];
}

const ORDINAL = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];

/** A town and a stop are the same place when one's name holds the other's ("Riften" and "Riften Mistveil Keep"). */
const same = (town: string, place: string) => {
  const a = stopKey(town);
  const b = stopKey(place);
  return a === b || ` ${a} `.includes(` ${b} `) || ` ${b} `.includes(` ${a} `);
};

let quests: Map<string, { q: Quest; line: QuestLine }> | null = null;
/** A planner quest by its edid, with its line, once per server. */
function questOf(edid: string) {
  quests ??= new Map(questsData().lines.flatMap((line) => line.quests.map((q) => [q.edid, { q, line }] as const)));
  return quests.get(edid) ?? null;
}

/** "bound for Solitude", "deliver it to Markarth", "a letter for Dawnstar": the place a job is said to go to. */
const DESTINATION = [/\b(?:bound|headed|destined|going)\s+(?:for|to)\s+([A-Z][\w']+(?:\s+[A-Z][\w']+)*)/, /\bdeliver\w*\b[^.;]*?\bto\s+([A-Z][\w']+(?:\s+[A-Z][\w']+)*)/, /\b(?:missive|letter|delivery|package|parcel)s?\s+(?:for|to)\s+([A-Z][\w']+(?:\s+[A-Z][\w']+)*)/];

/**
 * Looking on the board for one bound somewhere is a real thing to do: a missive's note names its town on the board (the PC's
 * read for Part 4, 22 Oct). "Check the board for a delivery bound for Markarth" is no promise; "a missive bound for Solitude" is.
 */
const LOOKING = /\b(?:check|look(?:s|ing)? (?:at|on|over|for)|see (?:if|whether)|ask(?:s)? (?:if|whether|for)|is there|whether|any)\b[^.;]*\b(?:board|missive|letter|deliver\w*|job)\b/i;

/** The destination an objective's words promise for a particular job, or null. */
export function promisedDestination(text: string): string | null {
  if (LOOKING.test(text)) return null;
  for (const re of DESTINATION) {
    const m = re.exec(text);
    if (m) return m[1];
  }
  return null;
}

export function reviewRoutes(acts: readonly RoutedAct[]): RouteWarning[] {
  const out: RouteWarning[] = [];
  for (const a of acts) {
    const route = a.route ?? [];
    for (const o of a.objectives) {
      const edid = o.detect?.quest ?? (o.link?.kind === "quest" ? o.link.id : null);
      const hit = edid ? questOf(edid) : null;
      const line = hit?.line ?? (o.link?.kind === "line" ? (questsData().byId.get(o.link.id) ?? null) : null);

      // A promise the game doesn't make: its family's jobs carry no destination in their name or objective.
      if (line?.destinationInName === false) {
        const to = promisedDestination(`${o.text}. ${o.why ?? ""}`);
        if (to)
          out.push({
            code: "route-promise",
            objective: String(o.id),
            message: `'${o.text}' says it goes to ${to}, but ${line.name} jobs don't name where they go: the job is called ${hit?.q.name ?? "by its distance"} and its objective names only the item and a date. Make it "before she leaves for the next stop, check the board for a delivery bound there", and never name a destination.`,
          });
      }

      if (!route.length) continue;
      const at = o.stop ? route.findIndex((s) => stopKey(s.place) === stopKey(o.stop!)) : -1;
      if (at < 0) {
        out.push({ code: "route-no-stop", objective: String(o.id), message: `'${o.text}' has no stop on Act ${a.n}'s route. Put it at the stop where she does it (stop), or leave it out, or plant it for a later act that goes there.` });
      }

      // Backtrack: where its quest starts, against the road. A board's jobs start at every board, so they're never a trip back.
      const towns = hit && !line?.board ? (hit.q.start?.towns ?? []) : [];
      if (!towns.length) continue;
      const on = towns.flatMap((t) => route.flatMap((s, j) => (same(t, s.place) ? [{ town: t, j }] : [])));
      if (!on.length) {
        out.push({
          code: "route-backtrack",
          objective: String(o.id),
          message: `${hit!.q.name} starts in ${towns.join(" or ")}, which isn't on Act ${a.n}'s route. Move it to an act that goes there, or add the stop with a reason.`,
        });
      } else if (at >= 0 && on.every((x) => x.j < at)) {
        const first = on[0];
        out.push({
          code: "route-backtrack",
          objective: String(o.id),
          message: `${hit!.q.name} starts in ${first.town}; the route left ${first.town} at its ${ORDINAL[first.j] ?? `${first.j + 1}th`} stop. Move it to an act set in ${first.town}, or add the trip back with a reason.`,
        });
      }
    }
  }
  return out;
}
