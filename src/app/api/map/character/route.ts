import { auth } from "@/auth";
import { progressTracking } from "@/lib/features";
import { characterOnMap } from "@/lib/map/data";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Her pin on the maps is progress tracking (WO-181): off for now.
  if (!progressTracking()) return Response.json({ error: "Progress tracking is off for now." }, { status: 404 });
  const userId = (await auth())?.user?.id;
  if (!userId) return Response.json({ error: "Sign in" }, { status: 401 });
  const r = await characterOnMap((new URL(req.url).searchParams.get("id") ?? "").slice(0, 20), userId);
  return r ? Response.json(r, { headers: { "cache-control": "no-store" } }) : Response.json({ error: "No such character" }, { status: 404 });
}
