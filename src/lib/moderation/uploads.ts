import "server-only";
import { db, schema } from "@/db";
import { checkImage, REFUSED_MESSAGE } from "./check";
import { newAccountHold, overLimit, recordEvent } from "./limits";

/**
 * Every check's scores are kept until this date, so Dave can see where real LoreRim covers land and
 * tune the cut-offs; after it, only refused and listed ones (MOD_LOG_ALL_UNTIL, an ISO date).
 */
function logEverything(now = new Date()) {
  const until = new Date(process.env.MOD_LOG_ALL_UNTIL || "2026-11-12T00:00:00Z");
  return Number.isNaN(until.getTime()) || now < until;
}

/**
 * The gate an uploaded image passes before it's stored (WO-40), after the size and type checks: the
 * account must be 7 days old and under its upload limit, then the nudity check. A refused image is
 * logged and never stored. Otherwise call `stored(url)` once it's in the store: it logs the check
 * (listed and unchecked images go on the review list) and counts the upload.
 */
export async function screenUpload({
  bytes,
  type,
  userId,
  buildId,
  kind,
}: {
  bytes: Uint8Array;
  type: string;
  userId: string;
  buildId: string | null;
  kind: "cover" | "guide";
}): Promise<{ ok: false; status: number; error: string } | { ok: true; stored: (url: string) => Promise<void> }> {
  const hold = await newAccountHold(userId);
  if (hold) return { ok: false, status: 403, error: hold };
  const limit = await overLimit(userId, "upload");
  if (limit) return { ok: false, status: 429, error: limit };
  const { outcome, scores } = await checkImage(bytes, type);
  const row = { uploaderId: userId, buildId, kind, scores, outcome };
  if (outcome === "refused") {
    await db().insert(schema.imageChecks).values({ ...row, url: null });
    return { ok: false, status: 422, error: REFUSED_MESSAGE };
  }
  return {
    ok: true,
    stored: async (url) => {
      const listed = outcome === "listed" || outcome === "unchecked";
      if (listed || logEverything()) await db().insert(schema.imageChecks).values({ ...row, url, review: listed ? "open" : null });
      await recordEvent(userId, "upload");
    },
  };
}
