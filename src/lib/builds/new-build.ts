import "server-only";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { newAccountHold, overLimit } from "@/lib/moderation/limits";
import type { BuildPlan } from "@/lib/rules/types";
import { buildDetailsSchema, parseBuildPlan, type BuildDetails } from "./validate";

/**
 * A new build's checks, before anything is written (WO-40): BotID, the day's build limit, the details,
 * the 7-day hold on Listed, and the plan. Shared by Create build and New character (WO-114).
 */
export async function checkNewBuild(userId: string, input: { details: unknown; plan: unknown }): Promise<{ ok: true; details: BuildDetails; plan: BuildPlan } | { ok: false; error: string }> {
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  const stop = await overLimit(userId, "build");
  if (stop) return { ok: false, error: stop };
  const details = buildDetailsSchema.safeParse(input.details);
  if (!details.success) return { ok: false, error: details.error.issues[0]?.message ?? "Check the build details." };
  if (details.data.visibility === "public") {
    const hold = await newAccountHold(userId);
    if (hold) return { ok: false, error: hold };
  }
  try {
    return { ok: true, details: details.data, plan: parseBuildPlan(input.plan) };
  } catch {
    return { ok: false, error: "The build's choices didn't pass validation." };
  }
}
