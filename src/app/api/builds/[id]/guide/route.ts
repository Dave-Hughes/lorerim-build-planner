import { NextResponse } from "next/server";
import { saveGuideSection } from "@/lib/builds/actions";

/**
 * Saves one guide section, like the autosave's server action, for the moments a server action
 * can't be trusted to finish: leaving the page, or closing the tab (sent with `keepalive`).
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { key?: unknown; doc?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Nothing to save." }, { status: 400 });
  }
  if (typeof body.key !== "string") return NextResponse.json({ ok: false, error: "Unknown guide section." }, { status: 400 });
  const r = await saveGuideSection(id, body.key, body.doc);
  return NextResponse.json(r, { status: r.ok ? 200 : 400 });
}
