import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const PROTECTED_PREFIXES = [
    '/dashboard',
    '/workspaces',
    '/boards',
    '/team',
    '/settings',
  ];

  const AUTH_PAGES = ['/login', '/register'];

  const isProtectedPath = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const hasAccessToken = Boolean(request.cookies.get('accessToken')?.value);
  const hasRefreshToken = Boolean(request.cookies.get('refreshToken')?.value);
  const isAuthed = hasAccessToken || hasRefreshToken;

  if (isProtectedPath && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};                  