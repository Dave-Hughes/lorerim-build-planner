/**
 * Screenshots of places and people (WO-184 Part 1): the plain constants and the words a player reads. They are screenshots in every word
 * a player reads, never pictures or images (Dave, 30 Oct).
 */
export type ShotKind = "place" | "person";
export type ShotStatus = "review" | "live" | "removed";

export const SHOT_BYTES = 15 * 1024 * 1024;
export const SHOT_TYPES = ["image/png", "image/jpeg"] as const;
/** Uploads a player may make in a day, and how many may wait on an admin at once. */
export const SHOTS_A_DAY = 10;
export const SHOTS_WAITING = 20;

export const SHOT_WIDTH = 1600;
export const SHOT_THUMB = 320;

export const SHOT_WORDS = {
  tooBig: "That screenshot is over 15 MB. Save it as a smaller PNG or JPG.",
  notAShot: "That isn't a PNG or JPG. Choose a PNG or JPG screenshot.",
  needOwn: "Tick the box to say this is your own screenshot and it shows the place.",
  refused: "That screenshot wasn't accepted, so it won't be shown. Screenshots can't show sexual content.",
  dayLimit: "That's ten screenshots in a day. Try again tomorrow.",
  waitingLimit: "You have 20 screenshots waiting on an admin. Wait for some to be decided, or remove one.",
  signIn: "Sign in with Discord to add a screenshot.",
  gone: "That screenshot isn't there any more.",
  adminOnly: "Only admins can do that.",
} as const;

export const shotCaption = (name: string | null) => (name ? `Screenshot by ${name}` : "Screenshot");

/** The check's result in words, for an admin (never the scores). */
export function checkWords(check: string): string {
  return check === "passed" ? "Passed the automatic check" : check === "listed" ? "The check flagged it" : "The check wasn't sure";
}

/** What the page says of the page's name: "No screenshot of Neloth yet". */
export const noShotYet = (name: string) => `No screenshot of ${name} yet`;
