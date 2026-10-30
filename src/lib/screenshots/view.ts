import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/users/admin";
import { questsOn } from "@/lib/features";
import { shotsFor } from "./store";
import type { ShotKind } from "./words";

/** What the gallery on a page needs, in plain data (dates as text): this viewer's screenshots of the page and who they are. One look per request. */
export interface ShotData {
  id: number;
  url: string;
  thumbUrl: string;
  status: "live" | "review";
  lead: boolean;
  mine: boolean;
  byName: string | null;
  byImage: string | null;
  at: string;
  check: string;
  /** Under review because a player said it isn't this page. */
  reported: boolean;
}
export interface PageShots {
  shots: ShotData[];
  signedIn: boolean;
  admin: boolean;
}

export const pageShots = cache(async (kind: ShotKind, key: string): Promise<PageShots> => {
  if (!questsOn()) return { shots: [], signedIn: false, admin: false };
  const id = (await auth())?.user?.id ?? null;
  const admin = id ? await isAdmin(id) : false;
  const shots = await shotsFor(kind, key, { id, admin });
  return {
    signedIn: !!id,
    admin,
    shots: shots.map((s) => ({ id: s.id, url: s.url, thumbUrl: s.thumbUrl, status: s.status === "live" ? "live" : "review", lead: s.lead, mine: s.mine, byName: s.by.name, byImage: s.by.image, at: s.at.toISOString(), check: s.check, reported: s.reported !== null })),
  };
});
