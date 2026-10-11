import "server-only";
import { del, list, put } from "@vercel/blob";
import { sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { currentEnvironment } from "@/db/environments";
import { IMAGE_LIMITS } from "./doc";

/**
 * Guide images in Vercel Blob. One store serves every environment, so paths start
 * with the environment: <production|staging|dev>/builds/<buildId>/<random>.<ext>
 */
export function imagePrefix(buildId: string): string {
  const env = currentEnvironment();
  return `${env === "development" ? "dev" : env}/builds/${buildId}/`;
}

/** Cover images, by who uploaded them (a new build has no id until it's saved): <env>/covers/<userId>/ */
export function coverPrefix(userId: string): string {
  const env = currentEnvironment();
  return `${env === "development" ? "dev" : env}/covers/${userId.replace(/[^a-zA-Z0-9_-]/g, "")}/`;
}

/** The store's public host, from its token (vercel_blob_rw_<storeId>_<secret>). */
function storeHost(): string | null {
  const id = /^vercel_blob_rw_([a-z0-9]+)_/i.exec(process.env.BLOB_READ_WRITE_TOKEN ?? "")?.[1];
  return id ? `${id.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

/** True for an image in this planner's own Blob store. */
export function isOurImage(url: string): boolean {
  const host = storeHost();
  try {
    return !!host && new URL(url).host === host;
  } catch {
    return false;
  }
}

export type ImageKind = { ext: "png" | "jpg" | "webp" | "gif"; type: string };

/** What a file really is, from its first bytes (never from its name or the browser's word). */
export function sniffImage(b: Uint8Array): ImageKind | null {
  const at = (i: number, ...v: number[]) => v.every((x, j) => b[i + j] === x);
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { ext: "png", type: "image/png" };
  if (at(0, 0xff, 0xd8, 0xff)) return { ext: "jpg", type: "image/jpeg" };
  if (at(0, 0x47, 0x49, 0x46, 0x38)) return { ext: "gif", type: "image/gif" };
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return { ext: "webp", type: "image/webp" };
  return null;
}

export async function countImages(buildId: string, prefix = imagePrefix(buildId)): Promise<number> {
  let n = 0;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    n += page.blobs.length;
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && n < IMAGE_LIMITS.perBuild);
  return n;
}

export async function storeImage(buildId: string, bytes: Uint8Array, kind: ImageKind, prefix = imagePrefix(buildId)): Promise<string> {
  const name = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  const blob = await put(`${prefix}${name}.${kind.ext}`, Buffer.from(bytes), {
    access: "public",
    contentType: kind.type,
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  return blob.url;
}

/** Of these images, the ones no guide or cover anywhere still shows (copies of a build share files). */
async function unreferenced(urls: Iterable<string>): Promise<string[]> {
  const out: string[] = [];
  for (const url of urls) {
    const rows = await db()
      .select({ key: schema.buildGuides.key })
      .from(schema.buildGuides)
      .where(sql`strpos(${schema.buildGuides.doc}::text, ${url}) > 0`)
      .limit(1);
    const covers = rows.length ? [] : await db().select({ id: schema.builds.id }).from(schema.builds).where(sql`${schema.builds.coverImageUrl} = ${url}`).limit(1);
    if (!rows.length && !covers.length) out.push(url);
  }
  return out;
}

/** Deletes images no guide shows any more. Only this planner's own store is ever touched. */
export async function deleteImagesIfUnused(urls: Iterable<string>): Promise<void> {
  const gone = await unreferenced([...urls].filter(isOurImage));
  if (gone.length) await del(gone);
}

/** After a build is deleted: every file under its folder that no other guide shows. */
export async function deleteBuildImages(buildId: string): Promise<void> {
  const urls: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: imagePrefix(buildId), cursor, limit: 1000 });
    urls.push(...page.blobs.map((b) => b.url));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  await deleteImagesIfUnused(urls);
}
