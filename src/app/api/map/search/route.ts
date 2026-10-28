import { mapSearch } from "@/lib/map/data";

export const dynamic = "force-dynamic";

/** The Map page's search (WO-169): places on the map, people and quests, as you type. */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 100);
  return Response.json(mapSearch(q), { headers: { "cache-control": "no-store" } });
}
