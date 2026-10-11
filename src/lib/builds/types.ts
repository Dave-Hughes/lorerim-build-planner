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
  isSample?: boolean;
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
  updatedAt: Date;
  author: BuildAuthor;
  isSample?: boolean;
}
