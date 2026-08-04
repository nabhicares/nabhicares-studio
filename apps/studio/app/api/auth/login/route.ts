import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return badRequest('email and password required');

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
}
