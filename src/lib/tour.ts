/**
 * The first-time tours (WO-61), led by Tapps. Each shows once: finished, skipped or declined is
 * kept in localStorage. Reads and writes never throw: with storage blocked the tour shows at most
 * once a visit (`seen` below remembers it for the page's life).
 */
export type TourKind = "reader" | "author";

const KEY: Record<TourKind, string> = { reader: "planner.tour.reader", author: "planner.tour.author" };
const seen = new Set<TourKind>();

function read(kind: TourKind): string | null {
  try {
    return window.localStorage.getItem(KEY[kind]);
  } catch {
    return null;
  }
}
function write(kind: TourKind, value: string) {
  try {
    window.localStorage.setItem(KEY[kind], value);
  } catch {
    // Blocked storage: the tour just won't show again this visit.
  }
}

/**
 * Whether to offer the tour now. The reader's: never done. The
 * author's: a build was just made and it's not done.
 */
export function tourDue(kind: TourKind): boolean {
  if (seen.has(kind)) return false;
  const v = read(kind);
  return kind === "author" ? v === "pending" : v !== "done";
}
/** Finished, skipped or declined: never again (until Show me around). */
export function tourDone(kind: TourKind) {
  seen.add(kind);
  write(kind, "done");
}
/** "Later": not again this page, but next visit. */
export function tourLater(kind: TourKind) {
  seen.add(kind);
}
/** A build was just made: offer the author's tour on its level 1, once. */
export function authorTourPending() {
  if (read("author") !== "done") write("author", "pending");
}

/** "Show me around" (account menu, footer): restarts the tour for the page you're on. */
export const TOUR_EVENT = "planner:tour";
export function startTour() {
  window.dispatchEvent(new Event(TOUR_EVENT));
}

export interface TourStop {
  /** The element lit: a [data-tour] name. */
  target: string;
  title: string;
  text: string;
}
export interface TourScript {
  welcome: { title: string; text: string; go: string; no: string };
  stops: TourStop[];
}

/** Tapps' lines, from the canvas (TourReader, TourAuthor). */
export const READER_TOUR = (hasGuide: boolean): TourScript => ({
  welcome: { title: "Tapps here!", text: `First visit? Tapps show you around. ${hasGuide ? "Four" : "Three"} stops. Then mead.`, go: "Show me", no: "No thanks" },
  stops: [
    { target: "level-row", title: "Every level", text: "Pick a level, see what was taken there. The arrows go one at a time. Tapps likes arrows." },
    { target: "level-card", title: "What happened here", text: "Perks, gear and spells on the left. The author's note on the right. Read the note. Tapps never reads the note." },
    { target: "perks", title: "The perk trees", text: "Every tree as it stands at this level. Open a skill to see its stars. Shiny." },
    ...(hasGuide ? [{ target: "guide-tab", title: "The Guide", text: "The author's big story. Tapps looks at the pictures." }] : []),
  ],
});

export const AUTHOR_TOUR: TourScript = {
  welcome: { title: "Build saved!", text: "Tapps proud of you. Now level 1. Tapps show you four things.", go: "Show me", no: "Later" },
  stops: [
    { target: "points", title: "Points to spend", text: "What this level gives you. Don't spend them all? They wait for the next level. Like leftovers." },
    { target: "skills-tree", title: "Take a perk", text: "Pick a skill. Click a ring in its tree, then Confirm. A ring means you can take it now." },
    { target: "note", title: "Your note", text: "Tell readers what to do here. Where to go, what to buy, what bites." },
    { target: "footer", title: "On to level 2", text: "Done? Continue to level 2, or Skip ahead and write the levels in between as one. From level 3 on, Repeat copies the level before. On the skill buttons, Shift-click moves 5 at a time and Ctrl- or ⌘-click goes as far as it can." },
  ],
};
