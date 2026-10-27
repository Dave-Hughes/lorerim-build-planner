import type { PlayerWay, Proposal } from "./player-types";

/**
 * Sources and "changes nothing" for player facts (WO-146 Part 1b). Pure: the pages, the door, /admin and the tests share them.
 */

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** "Dave, found in game, 22 Oct 2026" and "@tapps, 23 Oct 2026" as "Dave, 22 Oct" and "@tapps, 23 Oct". */
export function shortSource(source: string): string {
  const name = source.split(",")[0].trim();
  const day = /(\d{1,2} [A-Za-z]{3})[a-z]*(?: \d{4})?\s*$/.exec(source)?.[1];
  return day ? `${name}, ${day}` : name;
}

/** Who a source names: its first part, without an @, lower case. */
export const whoOf = (source: string) => source.split(",")[0].replace(/^@/, "").trim().toLowerCase();

/** Whether a new source is someone already among these: a player can't confirm their own report. */
export const alreadyAmong = (sources: readonly string[], source: string) => sources.some((s) => whoOf(s) === whoOf(source));

/**
 * The sources as a page says them (WO-154 Part 4: no player's name on a page, ever): "A player's report", or "Players' reports (2)". The
 * names stay in the data for the record and for /admin, which uses shortSource.
 */
export function pageSources(first: string, also: readonly string[] | undefined): string {
  void first;
  return also?.length ? `Players' reports (${also.length + 1})` : "A player's report";
}

/** What get_quest says a player's way is: "a player's report, not the game files", or the several. */
export function doorSources(first: string, also: readonly string[] | undefined): string {
  void first;
  return also?.length ? `players' reports, not the game files (${also.length + 1})` : "a player's report, not the game files";
}

interface PageWay {
  how: string;
  who?: string;
  where?: string;
  whereIs?: string[];
}

/** The way on the page a proposal says the same as, if there is one: same words, and nothing in it the page lacks. */
export function matchingWay(way: PlayerWay | null, ways: readonly PageWay[]): PageWay | null {
  if (!way) return null;
  const w = ways.find((x) => words(x.how) === words(way.how));
  if (!w) return null;
  const has = (a: string[] | undefined, b: string[] | undefined) => (a ?? []).every((x) => (b ?? []).some((y) => words(y) === words(x)));
  const same = (a: string | undefined, b: string | undefined) => !a || (!!b && words(a) === words(b));
  return has(way.whereIs, w.whereIs) && same(way.who, w.who) && same(way.where, w.where) ? w : null;
}

/**
 * Whether a proposal changes nothing on the page (WO-146 Part 1b): its way says what a way already there says, or it agrees and
 * gives no way. Dave's first live Propose: "The note is on the board by Joslin's house" was already Running Wild's way.
 */
export function changesNothing(proposal: Proposal | null | undefined, ways: readonly PageWay[]): boolean {
  if (!proposal) return false;
  if (!proposal.way) return proposal.fits === "agrees";
  return matchingWay(proposal.way, ways) !== null;
}
