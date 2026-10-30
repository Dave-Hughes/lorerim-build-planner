import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { questsOn } from "@/lib/features";
import { sniffImage } from "@/lib/guide/images";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { pageNamed } from "@/lib/pages/page-named";
import { addShot } from "@/lib/screenshots/store";
import { SHOT_BYTES, SHOT_WORDS } from "@/lib/screenshots/words";

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/**
 * Adds a player's screenshot of a place or a person (WO-184 Part 1). Signed in; a PNG or JPG up to 15 MB, checked from its bytes; the box that says it is
 * their own screenshot ticked. The check, the limits and whether it goes live or waits are the store's.
 */
export async function POST(req: Request) {
  if (!questsOn()) return fail(404, "Not found.");
  const userId = (await auth())?.user?.id;
  if (!userId) return fail(401, SHOT_WORDS.signIn);
  if (await looksLikeBot()) return fail(403, BOT_MESSAGE);
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, SHOT_WORDS.notAShot);
  }
  const kind = String(form.get("kind") ?? "");
  const key = String(form.get("key") ?? "").slice(0, 200);
  if ((kind !== "place" && kind !== "person") || !pageNamed(kind, key)) return fail(404, "That page isn't there.");
  if (!["on", "1", "true"].includes(String(form.get("own") ?? ""))) return fail(400, SHOT_WORDS.needOwn);
  const file = form.get("file");
  if (!(file instanceof File)) return fail(400, SHOT_WORDS.notAShot);
  if (file.size > SHOT_BYTES) return fail(413, SHOT_WORDS.tooBig);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type || (type.ext !== "png" && type.ext !== "jpg")) return fail(415, SHOT_WORDS.notAShot);
  const r = await addShot({ kind, key, userId, bytes, type: type.type, ext: type.ext });
  if (!r.ok) return fail(r.status, r.error);
  return NextResponse.json({ ok: true, id: r.shot.id, status: r.shot.status });
}
