import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { setSessionCookie, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return badRequest('email and password required');

    if (!process.env.BUILDER_DATABASE_URL) {
      return json({ error: 'Server misconfigured: BUILDER_DATABASE_URL missing' }, 500);
    }
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 16) {
      return json({ error: 'Server misconfigured: SESSION_SECRET missing' }, 500);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return json({ error: 'Invalid email or password' }, 401);
    }

    await setSessionCookie(user.id, user.sessionVersion);
    return json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isSuperAdmin: user.isSuperAdmin,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    console.error('[auth/login]', err);
    return json({ error: message }, 500);
  }
}
