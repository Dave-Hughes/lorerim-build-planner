import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { sniffImage, storeImage } from "@/lib/guide/images";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { checkImage } from "@/lib/moderation/check";
import { newAccountHold } from "@/lib/moderation/limits";
import { SHOT_BYTES, SHOT_WIDTH, SHOT_WORDS } from "@/lib/screenshots/words";
import { fileTip, TipError } from "@/lib/tips/store";
import { HOW_OPTIONS, TIP_WORDS, type TipHow, type TipKind, type TipType } from "@/lib/tips/words";
import { currentEnvironment } from "@/db/environments";

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/**
 * "I know this" and Report a mistake (WO-184 Part 2): a signed-in player's words about a quest, a person or a place, with an optional screenshot, waiting on an
 * admin. A screenshot sent with it is checked like any other and kept for the admin only.
 */
export async function POST(req: Request) {
  if (!questsOn()) return fail(404, "Not found.");
  const userId = (await auth())?.user?.id;
  if (!userId) return fail(401, TIP_WORDS.signIn);
  if (await looksLikeBot()) return fail(403, BOT_MESSAGE);
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, TIP_WORDS.needWords);
  }
  const kind = String(form.get("kind") ?? "") as TipKind;
  const type = (String(form.get("type") ?? "know") === "mistake" ? "mistake" : "know") as TipType;
  const how = String(form.get("how") ?? "game") as TipHow;
  if (!["quest", "person", "place"].includes(kind) || !HOW_OPTIONS.some((h) => h.id === how)) return fail(400, TIP_WORDS.gone);
  let screenshotUrl: string | null = null;
  const file = form.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > SHOT_BYTES) return fail(413, SHOT_WORDS.tooBig);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const sniffed = sniffImage(bytes);
    if (!sniffed || (sniffed.ext !== "png" && sniffed.ext !== "jpg")) return fail(415, SHOT_WORDS.notAShot);
    const hold = await newAccountHold(userId);
    if (hold) return fail(403, hold);
    const checked = await checkImage(bytes, sniffed.type);
    if (checked.outcome === "refused") return fail(422, SHOT_WORDS.refused);
    try {
      const big = await sharp(bytes, { failOn: "none" }).rotate().resize({ width: SHOT_WIDTH, withoutEnlargement: true }).jpeg({ quality: 84 }).toBuffer();
      const env = currentEnvironment();
      screenshotUrl = await storeImage("", big, { ext: "jpg", type: "image/jpeg" }, `${env === "development" ? "dev" : env}/tips/${userId.replace(/[^a-zA-Z0-9_-]/g, "")}/`);
    } catch {
      return fail(502, "The screenshot store didn't take it. Try again.");
    }
  }
  try {
    const r = await fileTip({ userId, kind, key: String(form.get("key") ?? "").slice(0, 200), type, field: String(form.get("field") ?? ""), words: String(form.get("words") ?? ""), how, link: String(form.get("link") ?? ""), screenshotUrl });
    return NextResponse.json({ ok: true, id: r.id });
  } catch (e) {
    if (e instanceof TipError) return fail(400, e.message);
    throw e;
  }
}
