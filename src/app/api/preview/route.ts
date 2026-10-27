import { NextResponse } from "next/server";
import { questsOn } from "@/lib/features";
import { previewOf } from "@/lib/pages/preview";

/** The hover preview for a link to a person, place or quest (WO-157 Part 5): /api/preview?href=/people/captain-aldis. */
export async function GET(req: Request) {
  if (!questsOn()) return new NextResponse(null, { status: 404 });
  const href = new URL(req.url).searchParams.get("href") ?? "";
  const p = await previewOf(href.slice(0, 200));
  return p ? NextResponse.json(p, { headers: { "cache-control": "public, max-age=300" } }) : new NextResponse(null, { status: 404 });
}
