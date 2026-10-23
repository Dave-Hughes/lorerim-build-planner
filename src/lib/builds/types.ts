import type { Mod } from "@/lib/mods";
import type { BuildPlan } from "@/lib/rules/types";
import type { BuildVisibility } from "./validate";

export interface BuildAuthor {
  name: string;
  image: string | null;
  /** Their public page is /u/<handle>; null until one is set (the name is then plain text). */
  handle: string | null;
}

export interface BuildRecord {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  coverImageUrl: string | null;
  writeupUrl: string | null;
  visibility: BuildVisibility;
  gameVersion: string;
  plan: BuildPlan;
  createdAt: Date;
  updatedAt: Date;
  author: BuildAuthor;
  /** Tag slugs (see tags.ts). */
  tags: string[];
  likeCount: number;
  /** Whether the viewer likes it (false when signed out). */
  likedByViewer: boolean;
  /** Its cover is waiting on an admin (WO-40): the page shows a plain hero with a note. */
  coverHeld?: boolean;
  /** When an admin featured it on Browse (WO-39); null when not featured. */
  featuredAt?: Date | null;
  isSample?: boolean;
  /** It's the sample build (WO-90): the page shows an Example tag. Worked out, never stored. */
  example?: boolean;
  /** The assistant that drafted it (WO-110), and whether the page says so. */
  draftedBy?: string | null;
  showDrafted?: boolean;
  /** Mods the character needs that LoreRim doesn't ship (WO-139 Part 4). */
  mods?: Mod[] | null;
}

/** What a list card needs; no plan, so lists stay light. */
export interface BuildSummary {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string | null;
  visibility: BuildVisibility;
  gameVersion: string;
  race: string;
  traits: string[];
  levels: number;
  /** Skip ahead (WO-69): the levels a build that skips writes; absent or null for one that writes every level. */
  writtenLevels?: number[] | null;
  updatedAt: Date;
  author: BuildAuthor;
  likeCount: number;
  /** Its cover is waiting on an admin (WO-40): the card shows a plain panel. */
  coverHeld?: boolean;
  /** Its video guide's YouTube id, when it has one (WO-39): cards show a Video badge. */
  videoId?: string | null;
  /** It has a Story (WO-79): cards show a small Story tag. */
  hasStory?: boolean;
  isSample?: boolean;
  /** It's the sample build (WO-90): the card shows an Example tag. */
  example?: boolean;
  /** The assistant that drafted it, when the author shows it (WO-110): My builds' card says so. */
  draftedBy?: string | null;
}
