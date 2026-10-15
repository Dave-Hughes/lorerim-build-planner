import { NextResponse, type NextRequest } from "next/server";
import { comingSoonOn, passesComingSoon } from "@/lib/coming-soon";
import { SESSION_COOKIES, isAdminSession } from "@/lib/users/admin-session";

/**
 * The coming soon page (WO-84). With FEATURE_COMING_SOON on, every page shows it at its own URL
 * (a rewrite, so a 200 and no redirect), except for signed-in admins, sign-in, the share card,
 * the API and files. Off, this does nothing.
 */
export async function proxy(request: NextRequest) {
  if (!comingSoonOn()) return NextResponse.next();
  const path = request.nextUrl.pathname;
  if (passesComingSoon(path)) return NextResponse.next();
  const token = SESSION_COOKIES.map((n) => request.cookies.get(n)?.value).find(Boolean);
  if (token && (await isAdminSession(token).catch(() => false))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/coming-soon", request.url));
}

export const config = {
  // Pages only: never Next's own files.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
