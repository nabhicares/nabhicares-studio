import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { forbidden, json, unauthorized } from '@/lib/api';

const COOKIE = 'nabhi_session';
/** Max cookie lifetime — bump User.sessionVersion to revoke sooner. */
const MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 days

export type MembershipRole = 'EDITOR' | 'PUBLISHER' | 'ADMIN';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
};

const ROLE_RANK: Record<MembershipRole, number> = {
  EDITOR: 1,
  PUBLISHER: 2,
  ADMIN: 3,
};

function sessionSecret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  // ponytail: local-only fallback — prod must set SESSION_SECRET (≥16 chars)
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set (≥16 chars) in production');
  }
  return 'nabhi-local-dev-session-secret';
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, 'hex');
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

/** Token: userId.sessionVersion.exp.sig */
export function createSessionToken(userId: string, sessionVersion: number): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${userId}.${sessionVersion}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function parseSessionToken(
  token: string,
): { userId: string; sessionVersion: number } | null {
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [userId, verStr, expStr, sig] = parts;
  const payload = `${userId}.${verStr}.${expStr}`;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  const exp = Number(expStr);
  const sessionVersion = Number(verStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  if (!Number.isInteger(sessionVersion) || sessionVersion < 0) return null;
  return { userId, sessionVersion };
}

export async function setSessionCookie(userId: string, sessionVersion: number) {
  const token = createSessionToken(userId, sessionVersion);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie() {
  cookies().set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}

/** Invalidate all existing cookies for this user (HMAC kill switch). */
export async function bumpSessionVersion(userId: string): Promise<number> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { sessionVersion: { increment: 1 } },
    select: { sessionVersion: true },
  });
  return updated.sessionVersion;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const parsed = parseSessionToken(token);
  if (!parsed) return null;
  const user = await prisma.user.findUnique({ where: { id: parsed.userId } });
  if (!user) return null;
  if (user.sessionVersion !== parsed.sessionVersion) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isSuperAdmin: user.isSuperAdmin,
  };
}

export type AuthOk = { user: SessionUser };
export type AuthFail = { error: Response };
export type AuthResult = AuthOk | AuthFail;

export async function requireUser(): Promise<AuthResult> {
  const user = await getSessionUser();
  if (!user) return { error: unauthorized() };
  return { user };
}

export function roleAtLeast(have: MembershipRole, need: MembershipRole) {
  return ROLE_RANK[have] >= ROLE_RANK[need];
}

/** Resolve hospital by id or slug; enforce membership (or super admin). */
export async function requireHospitalAccess(
  hospitalIdOrSlug: string,
  minRole: MembershipRole = 'EDITOR',
): Promise<
  | { user: SessionUser; hospital: { id: string; slug: string; name: string }; role: MembershipRole | 'SUPER' }
  | AuthFail
> {
  const auth = await requireUser();
  if ('error' in auth) return auth;

  const hospital = await prisma.hospital.findFirst({
    where: { OR: [{ id: hospitalIdOrSlug }, { slug: hospitalIdOrSlug }] },
  });
  if (!hospital) return { error: json({ error: 'Hospital not found' }, 404) };

  if (auth.user.isSuperAdmin) {
    return { user: auth.user, hospital, role: 'SUPER' };
  }

  const membership = await prisma.hospitalMembership.findUnique({
    where: {
      userId_hospitalId: { userId: auth.user.id, hospitalId: hospital.id },
    },
  });
  if (!membership || !roleAtLeast(membership.role, minRole)) {
    return { error: forbidden('No access to this hospital') };
  }
  return { user: auth.user, hospital, role: membership.role };
}

/** For pageId / sectionId routes: load parent hospital and check access. */
export async function requirePageAccess(
  pageId: string,
  minRole: MembershipRole = 'EDITOR',
) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    select: { id: true, hospitalId: true },
  });
  if (!page) return { error: json({ error: 'Page not found' }, 404) } as AuthFail;
  const access = await requireHospitalAccess(page.hospitalId, minRole);
  if ('error' in access) return access;
  return { ...access, page };
}

export async function requireSectionAccess(
  sectionId: string,
  minRole: MembershipRole = 'EDITOR',
) {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: { id: true, page: { select: { hospitalId: true } } },
  });
  if (!section) return { error: json({ error: 'Section not found' }, 404) } as AuthFail;
  const access = await requireHospitalAccess(section.page.hospitalId, minRole);
  if ('error' in access) return access;
  return { ...access, section };
}

export async function writeAudit(opts: {
  actorId: string;
  hospitalId?: string;
  action: string;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: opts.actorId,
      hospitalId: opts.hospitalId,
      action: opts.action,
      meta: (opts.meta as object | undefined) ?? undefined,
    },
  });
}

export { COOKIE as SESSION_COOKIE, MAX_AGE_SEC };
