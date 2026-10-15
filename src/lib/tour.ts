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
/**
 * The reader's tour skips its welcome (WO-80): the visitor already said yes or no to the sample build
 * on Browse, or opened it with Show me (`?tour=1`).
 */
export function tourSkipsWelcome(): boolean {
  if (read("reader") === "next") return true;
  try {
    return new URLSearchParams(window.location.search).get("tour") === "1";
  } catch {
    return false;
  }
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

/** The first visit's offer on Browse (WO-80): only while the reader's tour is still to come, and once. */
const OFFER_KEY = "planner.tour.offer";
export function offerDue(): boolean {
  if (seen.has("reader") || read("reader") === "done" || read("reader") === "next") return false;
  try {
    return window.localStorage.getItem(OFFER_KEY) !== "done";
  } catch {
    return false;
  }
}
/** Answered: Show me (the tour starts on the sample build) or No thanks (it starts on the next build opened). */
export function offerAnswered(showMe: boolean) {
  try {
    window.localStorage.setItem(OFFER_KEY, "done");
  } catch {
    // Blocked storage: it may ask again next visit.
  }
  if (!showMe) write("reader", "next");
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
  /** Skipped when the page doesn't have it (a build with no gear, no spells). */
  optional?: boolean;
  /** Scrolled to first, when the lit part shows only once the page has scrolled (the pinned bar). */
  scrollTo?: string;
}
export interface TourScript {
  welcome: { title: string; text: string; go: string; no: string };
  stops: TourStop[];
}

/**
 * The reader's tour (WO-80): the build page in page order. Plain lines (design rule 22): what each
 * part is and what you can do there.
 */
export const READER_TOUR = (tabs: { guide: boolean; story: boolean }): TourScript => ({
  welcome: { title: "Tapps here", text: "New here? Tapps can walk you through this build, one part of the page at a time.", go: "Show me", no: "No thanks" },
  stops: [
    { target: "level-row", title: "Levels", text: "Pick a level in the row or on the ruler, or step through them with ‹ and ›." },
    { target: "pinned-bar", scrollTo: "level-card", title: "The pinned bar", text: "It stays at the top as you scroll. It shows the level you're on and what changed there." },
    { target: "level-card", title: "The level card", text: "What was taken at this level. The author's note is beside it, under About this level." },
    { target: "attributes-skills", title: "Attributes and skills", text: "Where the character stands at this level: each attribute, and each skill's level." },
    { target: "perks", title: "Perk trees", text: "Each tree as it stands at this level. Click a star for its card." },
    { target: "gear", optional: true, title: "Gear", text: "What the build wears and wields, and the level where each piece changes." },
    { target: "spells", optional: true, title: "Spells", text: "The spells learned so far, by school." },
    ...(tabs.guide || tabs.story
      ? [
          tabs.guide && tabs.story
            ? { target: "build-tabs", title: "Guide and Story", text: "The Guide is the author's write-up of the build. The Story is the character's tale." }
            : tabs.guide
            ? { target: "build-tabs", title: "Guide", text: "The author's write-up of the whole build." }
            : { target: "build-tabs", title: "Story", text: "The character's tale, told by the author." },
        ]
      : []),
  ],
});

export const AUTHOR_TOUR: TourScript = {
  welcome: { title: "Build saved", text: "This is level 1. Tapps can show you the four parts you use on every level.", go: "Show me", no: "Later" },
  stops: [
    { target: "points", title: "Points to spend", text: "What this level gives you to spend. Points you don't spend carry over to the next level." },
    { target: "skills-tree", title: "Take a perk", text: "Pick a skill, click a ring in its tree, then Confirm. A ring is a perk you can take now." },
    { target: "note", title: "Your note", text: "Tell readers what to do at this level: where to go, what to buy, what to watch for." },
    { target: "footer", title: "On to level 2", text: "Continue to level 2, or Skip ahead to write the levels in between as one. From level 3 on, Repeat copies the level before. On the skill buttons, Shift-click moves 5 at a time and Ctrl- or ⌘-click goes as far as it can." },
  ],
};
