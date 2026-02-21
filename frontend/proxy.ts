// app/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths (add '/' if it's truly public / landing page)
  const publicPaths = ['/login', '/register', '/'];
  const isPublicPath = publicPaths.includes(pathname);

  // Extract cookies once — this is the fix for "not defined"
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const hasSession = request.cookies.has('user'); // or !!request.cookies.get('user')?.value

  // Start with next() — we'll modify it only if needed
  const response = NextResponse.next();

  // 1. Attempt silent refresh if access token missing but refresh token exists
  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // sends cookies if backend expects them
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const { accessToken: newAccess, refreshToken: newRefresh, user } = data;

        // Update the response with new cookies (they'll be set on client)
        response.cookies.set('accessToken', newAccess, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60, // 15 min
          path: '/',
        });

        if (newRefresh) {
          response.cookies.set('refreshToken', newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
          });
        }

        // Update user cookie too (if backend returns fresh user data)
        if (user) {
          response.cookies.set('user', JSON.stringify(user), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
          });
        }
      } else {
        // Refresh failed → clean up invalid tokens
        console.warn('Refresh failed:', refreshRes.status, await refreshRes.text());
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        response.cookies.delete('user');
      }
    } catch (err) {
      console.error('Refresh error:', err);
      // Clean up on network/error
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      response.cookies.delete('user');
    }
  }

  // 2. Protection / redirect logic (after possible refresh)
  if (!isPublicPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: redirect logged-in users away from auth pages
  if (isPublicPath && hasSession && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Everything ok → proceed
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};