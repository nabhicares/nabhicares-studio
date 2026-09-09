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

function hasBearer(req: NextRequest): boolean {
  const a = req.headers.get('authorization');
  return !!a && a.toLowerCase().startsWith('bearer ');
}

function corsHeaders(req: NextRequest): HeadersInit {
  const origin = req.headers.get('origin') || '*';
  // Chrome extensions send chrome-extension://… Origin
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Authorization, Content-Type, X-Nabhi-Requested-With',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const bearer = hasBearer(req);

  if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
  }

  // Bearer extension tokens skip cookie CSRF (Origin is chrome-extension://)
  if (!bearer) {
    const csrfFail = assertCsrf(req);
    if (csrfFail) return csrfFail;
  }

  const publicPaths =
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  if (publicPaths) return NextResponse.next();

  if (bearer && pathname.startsWith('/api/')) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(corsHeaders(req))) {
      res.headers.set(k, v);
    }
    return res;
  }

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
