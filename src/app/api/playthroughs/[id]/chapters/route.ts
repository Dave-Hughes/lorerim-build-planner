import { NextResponse } from "next/server";
import { saveChapterDoc, writeActChapter } from "@/lib/playthroughs/actions";

/** Saves a chapter's text while the page closes (sent with `keepalive`), as the guide's own route does. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { key?: unknown; doc?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nothing to save." }, { status: 400 });
  }
  const m = typeof body.key === "string" ? /^(chapter|act):(\d+)$/.exec(body.key) : null;
  if (!m) return NextResponse.json({ ok: false, error: "Unknown chapter." }, { status: 400 });
  // An act's chapter not written yet is made by its first word (WO-117).
  const r = m[1] === "act" ? await writeActChapter(id, Number(m[2]), { doc: body.doc }) : await saveChapterDoc(id, Number(m[2]), body.doc);
  return NextResponse.json(r, { status: r.ok ? 200 : 400 });
}
