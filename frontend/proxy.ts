import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const PROTECTED_PREFIXES = [
    "/dashboard",
    "/workspaces",
    "/boards",
    "/tasks-list",
    "/team",
    "/settings",
  ];

  const AUTH_PAGES = ["/login", "/register"];

  const isProtectedPath = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  const shouldClearSession =
    AUTH_PAGES.includes(pathname) && searchParams.get("session") === "expired";

  if (shouldClearSession) {
    const response = NextResponse.next();
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  if (isProtectedPath && !hasAccessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("session", hasRefreshToken ? "expired" : "required");

    const response = NextResponse.redirect(url);
    if (hasRefreshToken) {
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
    return response;
  }

  if (AUTH_PAGES.includes(pathname) && hasAccessToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
