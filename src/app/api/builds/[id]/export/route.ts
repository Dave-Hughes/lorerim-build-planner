import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { getBuild } from "@/lib/builds/queries";
import { exportBuild, exportFileName } from "@/lib/builds/transfer";
import { isAdmin } from "@/lib/users/admin";

/**
 * A build as a .lorerim-build.json file (WO-90), for an admin to import into another environment:
 * the build, its tags and its guide, never its owner, ids, likes, featured or dates.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const userId = session?.user?.id ?? null;
  if (!userId || !(await isAdmin(userId))) return NextResponse.json({ error: "Only admins can export builds." }, { status: 403 });
  const build = await getBuild(id, userId);
  if (!build || build.isSample) return NextResponse.json({ error: "Unknown build." }, { status: 404 });
  const guides = await db().select({ key: schema.buildGuides.key, doc: schema.buildGuides.doc }).from(schema.buildGuides).where(eq(schema.buildGuides.buildId, build.id)).orderBy(schema.buildGuides.key);
  const file = exportBuild({ ...build, guides });
  return new NextResponse(JSON.stringify(file, null, 1), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // An ASCII name for old clients, the real one (any letters) for the rest.
      "content-disposition": `attachment; filename="${exportFileName(build.name).replace(/[^\x20-\x7e]|"/g, "_")}"; filename*=UTF-8''${encodeURIComponent(exportFileName(build.name))}`,
      "cache-control": "no-store",
    },
  });
}
