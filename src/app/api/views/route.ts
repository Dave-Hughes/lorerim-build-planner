import { NextResponse } from "next/server";
import { questsOn } from "@/lib/features";
import { countView } from "@/lib/views/store";

/**
 * Counts one look at a quest, person or place page (WO-184 Part 3), for ordering Help fill the gaps. No cookie, address or account is read or kept; a
 * browser that says it is a robot is not counted.
 */
export async function POST(req: Request) {
  if (!questsOn()) return new NextResponse(null, { status: 404 });
  if (/bot|crawl|spider|slurp|preview|fetch|curl|wget|headless|lighthouse|monitor|facebookexternalhit|embedly|discord/i.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const body = (await req.json().catch(() => null)) as { kind?: string; key?: string } | null;
  const kind = body?.kind;
  const key = String(body?.key ?? "").slice(0, 200);
  if ((kind !== "quest" && kind !== "person" && kind !== "place") || !key) return new NextResponse(null, { status: 400 });
  await countView(kind, key);
  return new NextResponse(null, { status: 204 });
}
