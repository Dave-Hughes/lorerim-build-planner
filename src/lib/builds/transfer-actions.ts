"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { coverPrefix, imagePrefix, sniffImage, storeImage } from "@/lib/guide/images";
import { IMAGE_LIMITS } from "@/lib/guide/doc";
import { isAdmin } from "@/lib/users/admin";
import { BOT_MESSAGE, looksLikeBot } from "@/lib/moderation/bot";
import { newBuildId } from "./ids";
import { moveImages, parseImport, rewriteImages } from "./transfer";
import type { ActionResult } from "./actions";

/** An image fetched and stored again under `prefix`; null when it can't be fetched or isn't an image. */
async function copyImage(url: string, buildId: string, prefix: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > IMAGE_LIMITS.bytes) return null;
    const kind = sniffImage(bytes);
    if (!kind) return null;
    return await storeImage(buildId, bytes, kind, prefix);
  } catch {
    return null;
  }
}

/**
 * Imports a build an admin exported (WO-90): a new build owned by the admin, with a fresh id, the
 * file's visibility, no likes and not featured. The cover and every guide image are copied into this
 * environment's own Blob paths and the URLs rewritten, so nothing here points at another
 * environment's files. An image that can't be fetched is left out and named in `skipped`.
 */
export async function importBuild(text: string): Promise<ActionResult<{ id: string; skipped: string[]; droppedTags: string[] }>> {
  const userId = (await auth())?.user?.id ?? null;
  if (!userId || !(await isAdmin(userId))) return { ok: false, error: "Only admins can import builds." };
  if (await looksLikeBot()) return { ok: false, error: BOT_MESSAGE };
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return { ok: false, error: "The file isn't JSON. Pick a .lorerim-build.json file the planner exported." };
  }
  const known = new Set((await db().select({ slug: schema.tags.slug }).from(schema.tags)).map((t) => t.slug));
  const parsed = parseImport(input, known);
  if (!parsed.ok) return parsed;
  const p = parsed.value;

  const id = newBuildId();
  const { cover, moved, skipped } = await moveImages(p, { cover: coverPrefix(userId), guide: imagePrefix(id) }, (url, prefix) => copyImage(url, id, prefix));

  await db()
    .insert(schema.builds)
    .values({
      id,
      ownerId: userId,
      name: p.name,
      description: p.description,
      coverImageUrl: cover,
      writeupUrl: null,
      visibility: p.visibility,
      gameVersion: p.plan.gameVersion,
      plan: p.plan,
      likeCount: 0,
      featuredAt: null,
    });
  const writes = [
    ...(p.tags.length ? [db().insert(schema.buildTags).values(p.tags.map((tagSlug) => ({ buildId: id, tagSlug })))] : []),
    ...(p.guides.length
      ? [
          db()
            .insert(schema.buildGuides)
            .values(
              p.guides.map((g) => {
                const doc = rewriteImages(g.doc, moved);
                return { buildId: id, key: g.key, doc, textLength: g.textLength };
              }),
            ),
        ]
      : []),
  ];
  if (writes.length) await db().batch(writes as [(typeof writes)[number], ...(typeof writes)[number][]]);
  revalidatePath("/");
  revalidatePath("/me");
  return { ok: true, value: { id, skipped, droppedTags: p.droppedTags } };
}
