import { auth } from "@/auth";
import { playthroughsOn } from "@/lib/features";
import { myCharacters } from "@/lib/map/data";

export const dynamic = "force-dynamic";

/** The signed-in player's characters with a run, for "where my character is" (WO-169); nothing when signed out. */
export async function GET() {
  const userId = (await auth())?.user?.id;
  if (!userId || !playthroughsOn()) return Response.json([], { headers: { "cache-control": "no-store" } });
  return Response.json(await myCharacters(userId), { headers: { "cache-control": "no-store" } });
}
