/**
 * The image check (WO-40): Sightengine's nudity model, nothing else, so LoreRim's weapons, gore and
 * near-nudity pass while sexual content doesn't. The keys come from SIGHTENGINE_API_USER and
 * SIGHTENGINE_API_SECRET and are never logged; the cut-offs from MOD_REFUSE_AT and MOD_REVIEW_AT, so
 * Dave can loosen them without a release. If the check can't run, the upload goes ahead and waits on
 * the review list: a player is never blocked because Sightengine is down.
 */

export const SIGHTENGINE_URL = "https://api.sightengine.com/1.0/check.json";
/** The only model requested. */
export const MODEL = "nudity-2.1";
export const CHECK_TIMEOUT_MS = 8000;

export const REFUSED_MESSAGE = "This image can't be used here. Covers and guide images can't show sexual content.";

/** `passed`: stored. `listed`: stored and on the review list. `refused`: not stored. `unchecked`: stored and listed as not checked. */
export type Outcome = "passed" | "listed" | "refused" | "unchecked";

export interface CheckResult {
  outcome: Outcome;
  /** nudity-2.1's class scores, 0 to 1; null when the check didn't run. */
  scores: Record<string, number> | null;
}

type Env = Record<string, string | undefined>;

function number(v: string | undefined, fallback: number): number {
  const n = Number(v);
  return v !== undefined && v.trim() !== "" && Number.isFinite(n) ? n : fallback;
}

export function cutoffs(env: Env = process.env) {
  return { refuseAt: number(env.MOD_REFUSE_AT, 0.8), reviewAt: number(env.MOD_REVIEW_AT, 0.85) };
}

/** The rule: sexual activity or display refuses; erotica lists; the suggestive classes never count. */
export function decide(scores: Record<string, number>, c = cutoffs()): Outcome {
  if ((scores.sexual_activity ?? 0) >= c.refuseAt || (scores.sexual_display ?? 0) >= c.refuseAt) return "refused";
  if ((scores.erotica ?? 0) >= c.reviewAt) return "listed";
  return "passed";
}

/** Sends the image's bytes to Sightengine and decides. Any failure (no keys, a timeout, an error, over the plan's limits) is `unchecked`. */
export async function checkImage(
  bytes: Uint8Array,
  type: string,
  { fetch: fetchImpl = fetch, env = process.env, timeoutMs = CHECK_TIMEOUT_MS }: { fetch?: typeof fetch; env?: Env; timeoutMs?: number } = {},
): Promise<CheckResult> {
  const user = env.SIGHTENGINE_API_USER;
  const secret = env.SIGHTENGINE_API_SECRET;
  if (!user || !secret) return { outcome: "unchecked", scores: null };
  const form = new FormData();
  form.set("media", new Blob([bytes as Uint8Array<ArrayBuffer>], { type }), "image");
  form.set("models", MODEL);
  form.set("api_user", user);
  form.set("api_secret", secret);
  try {
    const res = await fetchImpl(SIGHTENGINE_URL, { method: "POST", body: form, signal: AbortSignal.timeout(timeoutMs) });
    const body = (await res.json().catch(() => null)) as { status?: string; nudity?: Record<string, unknown> } | null;
    if (!res.ok || body?.status !== "success" || !body.nudity) return { outcome: "unchecked", scores: null };
    const scores = Object.fromEntries(Object.entries(body.nudity).filter((e): e is [string, number] => typeof e[1] === "number"));
    return { outcome: decide(scores, cutoffs(env)), scores };
  } catch {
    return { outcome: "unchecked", scores: null };
  }
}
