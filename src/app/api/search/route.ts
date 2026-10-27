import { siteSearch } from "@/lib/search/site";

export const dynamic = "force-dynamic";

/** The suggestions under a search box and in the command palette (WO-154 Part 4): `?q=words`, and `&all=1` for builds and the guide too. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 100).trim();
  const results = await siteSearch(q, { all: url.searchParams.get("all") === "1", limit: 5 });
  return Response.json(results, { headers: { "cache-control": "no-store" } });
}
