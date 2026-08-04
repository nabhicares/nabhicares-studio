import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { assertCsrf } from '@/lib/csrf';

const COOKIE = 'nabhi_session';

/** Edge-safe shape check only — full HMAC verified in route handlers / RSC.
 * Token: userId.sessionVersion.exp.sig (4 parts). */
function looksLikeSession(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 4 && parts.every((p) => p.length > 0);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicPaths =
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  const csrfFail = assertCsrf(req);
  if (csrfFail) return csrfFail;

  if (publicPaths) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!looksLikeSession(token)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
    }
    const login = new URL('/login', req.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
