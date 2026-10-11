import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { IMAGE_LIMITS, IMAGE_TYPE_ERROR, imageTooBigMessage } from "@/lib/guide/doc";
import { countImages, coverPrefix, sniffImage, storeImage } from "@/lib/guide/images";

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/**
 * Uploads a cover image for a build (new or existing), kept under the uploader. Signed-in only.
 * PNG, JPEG, WebP or GIF (checked from the file's bytes), up to 4 MB, at most 40 per person.
 */
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Sign in to upload a cover image.");
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
  const prefix = coverPrefix(userId);
  if ((await countImages("", prefix)) >= IMAGE_LIMITS.perBuild) return fail(409, `You have uploaded ${IMAGE_LIMITS.perBuild} cover images, the most there can be.`);
  try {
    return NextResponse.json({ url: await storeImage("", bytes, kind, prefix) });
  } catch {
    return fail(502, "The image store didn't take it. Try again.");
  }
}
