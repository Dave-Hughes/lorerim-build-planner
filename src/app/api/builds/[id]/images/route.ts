import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { isValidBuildId } from "@/lib/builds/ids";
import { IMAGE_COUNT_ERROR, IMAGE_LIMITS, IMAGE_TYPE_ERROR, imageTooBigMessage } from "@/lib/guide/doc";
import { countImages, sniffImage, storeImage } from "@/lib/guide/images";
import { screenUpload } from "@/lib/moderation/uploads";

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/**
 * Uploads one image for a build's guide. Only the build's author can. PNG, JPEG, WebP or
 * GIF (checked from the file's bytes), up to 4 MB, at most 40 per build.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Your sign-in expired. Sign in again to add images.");
  if (!isValidBuildId(id)) return fail(404, "Unknown build.");
  const owned = await db()
    .select({ id: schema.builds.id })
    .from(schema.builds)
    .where(and(eq(schema.builds.id, id), eq(schema.builds.ownerId, userId)))
    .limit(1);
  if (!owned[0]) return fail(403, "Only the build's author can add images.");

  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return fail(400, "No image in the upload.");
  }
  if (!(file instanceof File)) return fail(400, "No image in the upload.");
  if (file.size > IMAGE_LIMITS.bytes) return fail(413, imageTooBigMessage(file.size));
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) return fail(415, IMAGE_TYPE_ERROR);
  if ((await countImages(id)) >= IMAGE_LIMITS.perBuild) return fail(409, IMAGE_COUNT_ERROR);

  // New accounts, the upload limit, and the nudity check (WO-40), before anything is stored.
  const gate = await screenUpload({ bytes, type: kind.type, userId, buildId: id, kind: "guide" });
  if (!gate.ok) return fail(gate.status, gate.error);
  let url: string;
  try {
    url = await storeImage(id, bytes, kind);
  } catch {
    return fail(502, "The image store didn't take it. Try again.");
  }
  await gate.stored(url);
  return NextResponse.json({ url });
}
