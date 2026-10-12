import { readFile } from "node:fs/promises";
import path from "node:path";
import { shippedVersions } from "@/lib/rules/versions";

/**
 * A version's item index (src/data/lorerim-<version>/items.json, built by
 * scripts/gamedata/build.py), served as a static file with long caching so it never
 * weighs on a page. An empty list until the version's items are extracted.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return shippedVersions().map((v) => ({ version: v.id }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ version: string }> }) {
  const { version } = await params;
  let body = "[]";
  try {
    body = await readFile(path.join(process.cwd(), "src", "data", `lorerim-${version}`, "items.json"), "utf8");
  } catch {
    // Not extracted yet.
  }
  return new Response(body, {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800" },
  });
}
