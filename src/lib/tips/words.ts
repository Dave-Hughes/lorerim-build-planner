/**
 * What a player tells the planner (WO-184 Part 2): "I know this" on a Not sure yet line, and Report a mistake. The plain constants and the words a player reads.
 */
export type TipKind = "quest" | "person" | "place";
export type TipType = "know" | "mistake";
export type TipHow = "game" | "guide" | "other";

export const TIP_MAX = 600;
export const TIP_LINK_MAX = 300;
/** An hour's and a day's worth, as for quest reports (WO-103). */
export const TIPS_AN_HOUR = 5;
export const TIPS_A_DAY = 20;

export const HOW_OPTIONS: { id: TipHow; label: string }[] = [
  { id: "game", label: "I saw it in my game" },
  { id: "guide", label: "A mod page or guide" },
  { id: "other", label: "Somewhere else, with a link" },
];
export const howWords = (how: TipHow) => HOW_OPTIONS.find((h) => h.id === how)?.label.replace(/^I saw/, "Saw").replace(" my game", " their game") ?? "";

export const TIP_WORDS = {
  signIn: "Sign in with Discord to tell us.",
  needWords: "Say what you know.",
  tooLong: "That's a bit long. Keep it to a few sentences.",
  limit: "You've sent a few already. Try again later.",
  gone: "That page isn't there.",
  sent: "Sent. Thanks.",
  adminOnly: "Only admins can do that.",
} as const;

/** What an admin reads under a tip: the status in words. */
export const tipStatusWords = (s: string): string =>
  s === "approved" ? "It's on the page" : s === "rejected" ? "Not used" : s === "fixed" ? "Fixed" : s === "sent" ? "Sent on" : s === "not a mistake" ? "Not a mistake" : "Waiting on an admin";
