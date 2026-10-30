import { NextResponse, type NextRequest } from "next/server";
import { comingSoonOn, passesComingSoon } from "@/lib/coming-soon";
import { isPlaythroughPath, playthroughsOn } from "@/lib/playthroughs/gate";
import { SESSION_COOKIES, passesSession } from "@/lib/users/admin-session";

/**
 * The coming soon page (WO-84). With FEATURE_COMING_SOON on, every page shows it at its own URL
 * (a rewrite, so a 200 and no redirect), except for signed-in admins and players let in early by an
 * invite (WO-96), sign-in, an invite's page, the share card,
 * the API and files. Off, this does nothing. It also answers the playthrough addresses with not found while their switch is off (WO-182).
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Playthroughs are held back from launch (WO-182): with their switch off, every address that exists for them is not found.
  if (!playthroughsOn() && isPlaythroughPath(path)) return NextResponse.rewrite(new URL("/not-found-playthroughs", request.url), { status: 404 });
  if (!comingSoonOn()) return NextResponse.next();
  if (passesComingSoon(path)) return NextResponse.next();
  const token = SESSION_COOKIES.map((n) => request.cookies.get(n)?.value).find(Boolean);
  if (token && (await passesSession(token).catch(() => false))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  // Pages only: never Next's own files.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
