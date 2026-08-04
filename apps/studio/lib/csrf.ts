import { NextRequest, NextResponse } from 'next/server';

/** Custom header browsers cannot set on classic cross-site form posts. */
export const CSRF_HEADER = 'x-nabhi-requested-with';
export const CSRF_HEADER_VALUE = 'studio';

/**
 * CSRF defense for cookie-authenticated mutating API routes:
 * 1) Require X-Nabhi-Requested-With: studio (not sent by naive form CSRF)
 * 2) If Origin/Referer present, host must match request Host
 * SameSite=Lax on the session cookie remains the first line of defense.
 */
export function assertCsrf(req: NextRequest): NextResponse | null {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return null;
  if (!req.nextUrl.pathname.startsWith('/api/')) return null;

  const marker = req.headers.get(CSRF_HEADER);
  if (marker !== CSRF_HEADER_VALUE) {
    return NextResponse.json(
      { error: 'Missing or invalid CSRF header' },
      { status: 403 },
    );
  }

  const host = req.headers.get('host');
  if (!host) {
    return NextResponse.json({ error: 'Invalid host' }, { status: 403 });
  }

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'CSRF origin mismatch' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'CSRF origin mismatch' }, { status: 403 });
    }
  }

  const referer = req.headers.get('referer');
  if (!origin && referer) {
    try {
      if (new URL(referer).host !== host) {
        return NextResponse.json({ error: 'CSRF referer mismatch' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'CSRF referer mismatch' }, { status: 403 });
    }
  }

  return null;
}
