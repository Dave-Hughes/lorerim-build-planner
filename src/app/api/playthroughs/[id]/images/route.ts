import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isValidBuildId } from "@/lib/builds/ids";
import { playthroughsOn } from "@/lib/features";
import { IMAGE_COUNT_ERROR, IMAGE_LIMITS, IMAGE_TYPE_ERROR, imageTooBigMessage } from "@/lib/guide/doc";
import { countImages, playthroughImagePrefix, sniffImage, storeImage } from "@/lib/guide/images";
import { screenUpload } from "@/lib/moderation/uploads";
import { isOwner } from "@/lib/playthroughs/queries";

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/**
 * Uploads one image for a playthrough (WO-111): a chapter's, or its opening image. The same checks
 * as a build guide's images (WO-40), only by its owner, and never through the assistants' tools.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!playthroughsOn()) return fail(404, "Not found.");
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Your sign-in expired. Sign in again to add images.");
  if (!isValidBuildId(id)) return fail(404, "Unknown playthrough.");
  if (!(await isOwner(userId, id))) return fail(403, "Only the playthrough's author can add images.");

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
  const prefix = playthroughImagePrefix(id);
  if ((await countImages(id, prefix)) >= IMAGE_LIMITS.perBuild) return fail(409, IMAGE_COUNT_ERROR.replace("build", "playthrough"));

  const gate = await screenUpload({ bytes, type: kind.type, userId, buildId: null, kind: "guide" });
  if (!gate.ok) return fail(gate.status, gate.error);
  let url: string;
  try {
    url = await storeImage(id, bytes, kind, prefix);
  } catch {
    return fail(502, "The image store didn't take it. Try again.");
  }
  await gate.stored(url);
  return NextResponse.json({ url });
}
