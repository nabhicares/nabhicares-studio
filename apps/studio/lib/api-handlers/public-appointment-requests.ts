import { prisma } from '@/lib/db';

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now > row.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (row.count >= MAX_PER_WINDOW) return false;
  row.count += 1;
  return true;
}

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allow =
    !origin ||
    origin.includes('localhost') ||
    origin.endsWith('.nabhilabs.info') ||
    origin.includes('nabhi-cdn') ||
    origin.includes('nabhi-studio') ||
    origin.includes('vercel.app');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (allow && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  } else if (!origin) {
    headers['Access-Control-Allow-Origin'] = '*';
  }
  return headers;
}

function jsonCors(data: unknown, status: number, req: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(req) },
  });
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

/** Public: visitor booking request from live hospital site. */
export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  const slug = (params.slug || '').trim().toLowerCase();
  if (!slug) {
    return jsonCors({ error: 'slug required' }, 400, req);
  }

  const ip = clientIp(req);
  if (!rateLimit(`${slug}:${ip}`)) {
    return jsonCors({ error: 'Too many requests — try again shortly' }, 429, req);
  }

  const hospital = await prisma.hospital.findUnique({ where: { slug } });
  if (!hospital) {
    return jsonCors({ error: 'Hospital not found' }, 404, req);
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 40) : '';
  const email =
    typeof body.email === 'string' ? body.email.trim().slice(0, 160) : '';
  const message =
    typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';
  const preferredRaw =
    typeof body.preferredAt === 'string' ? body.preferredAt.trim() : '';

  if (!name || name.length < 2) {
    return jsonCors({ error: 'Name is required' }, 400, req);
  }
  if (!phone || phone.length < 6) {
    return jsonCors({ error: 'Phone is required' }, 400, req);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonCors({ error: 'Invalid email' }, 400, req);
  }

  let preferredAt: Date | null = null;
  if (preferredRaw) {
    const d = new Date(preferredRaw);
    if (Number.isNaN(d.getTime())) {
      return jsonCors({ error: 'Invalid preferred date/time' }, 400, req);
    }
    preferredAt = d;
  }

  const row = await prisma.appointmentRequest.create({
    data: {
      hospitalId: hospital.id,
      name,
      phone,
      email: email || null,
      preferredAt,
      message: message || null,
      status: 'new',
    },
    select: { id: true, createdAt: true },
  });

  return jsonCors({ ok: true, id: row.id, createdAt: row.createdAt }, 201, req);
}
