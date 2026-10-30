import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { answeredFor, sentFields } from "./store";
import type { TipKind } from "./words";

/** What a page's Information Confidence needs for "I know this" (WO-184 Part 2): is this player signed in, what have they already sent, and what has an admin put on the page from players. */
export const knowFor = cache(async (kind: TipKind, key: string) => {
  const userId = (await auth())?.user?.id ?? null;
  if (!questsOn()) return { signedIn: !!userId, sent: [] as string[], answered: [] as { field: string; words: string; by: string; at: string }[] };
  const [sent, answered] = await Promise.all([sentFields(kind, key, userId), answeredFor(kind, key)]);
  return { signedIn: !!userId, sent, answered: answered.map((a) => ({ ...a, at: a.at.toISOString() })) };
});
