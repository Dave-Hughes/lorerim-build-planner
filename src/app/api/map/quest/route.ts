import { questRoute } from "@/lib/map/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const r = questRoute((new URL(req.url).searchParams.get("slug") ?? "").slice(0, 120));
  return r ? Response.json(r) : Response.json({ error: "No such quest" }, { status: 404 });
}
