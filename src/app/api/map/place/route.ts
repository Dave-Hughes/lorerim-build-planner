import { placeDrawer } from "@/lib/map/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const r = placeDrawer((new URL(req.url).searchParams.get("slug") ?? "").slice(0, 120));
  return r ? Response.json(r) : Response.json({ error: "No such place" }, { status: 404 });
}
