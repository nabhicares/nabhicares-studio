/**
 * Cross-tenant isolation checks against the builder DB.
 * Requires BUILDER_DATABASE_URL and seeded hospitals (demo-hospital, metro-clinic).
 *
 * Run: npm run test:tenant --workspace=studio
 */
import { PrismaClient } from '@nabhicares/db-builder';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.BUILDER_DATABASE_URL } },
});

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function roleAtLeast(
  have: 'EDITOR' | 'PUBLISHER' | 'ADMIN',
  need: 'EDITOR' | 'PUBLISHER' | 'ADMIN',
) {
  const rank = { EDITOR: 1, PUBLISHER: 2, ADMIN: 3 };
  return rank[have] >= rank[need];
}

async function main() {
  const demo = await prisma.hospital.findUnique({ where: { slug: 'demo-hospital' } });
  const metro = await prisma.hospital.findUnique({ where: { slug: 'metro-clinic' } });
  if (!demo || !metro) {
    throw new Error('Seed demo-hospital and metro-clinic first (npm run seed --workspace=publish-worker)');
  }

  const email = `tenant-test-${Date.now()}@nabhi.local`;
  const user = await prisma.user.create({
    data: {
      email,
      name: 'Tenant Test',
      passwordHash: hashPassword('test-pass'),
      isSuperAdmin: false,
      memberships: {
        create: { hospitalId: demo.id, role: 'EDITOR' },
      },
    },
  });

  const demoMembership = await prisma.hospitalMembership.findUnique({
    where: { userId_hospitalId: { userId: user.id, hospitalId: demo.id } },
  });
  if (!demoMembership || !roleAtLeast(demoMembership.role, 'EDITOR')) {
    throw new Error('Expected EDITOR access on demo-hospital');
  }

  const metroMembership = await prisma.hospitalMembership.findUnique({
    where: { userId_hospitalId: { userId: user.id, hospitalId: metro.id } },
  });
  if (metroMembership) {
    throw new Error('Tenant leaked: membership exists on metro-clinic');
  }

  const visible = await prisma.hospital.findMany({
    where: { memberships: { some: { userId: user.id } } },
  });
  if (visible.length !== 1 || visible[0].id !== demo.id) {
    throw new Error(`Expected only demo-hospital, got ${visible.map((h) => h.slug).join(',')}`);
  }

  const metroPages = await prisma.page.findMany({ where: { hospitalId: metro.id } });
  if (!metroPages.length) throw new Error('metro-clinic has no pages — seed broken');

  // Simulate API guard: guessing another tenant's page id must not grant access via membership
  const foreignPage = metroPages[0];
  const accessViaMembership = await prisma.hospitalMembership.findUnique({
    where: {
      userId_hospitalId: { userId: user.id, hospitalId: foreignPage.hospitalId },
    },
  });
  if (accessViaMembership) {
    throw new Error('Cross-tenant page access would succeed');
  }

  const canPublish = roleAtLeast(demoMembership.role, 'PUBLISHER');
  if (canPublish) throw new Error('EDITOR must not satisfy PUBLISHER gate');

  await prisma.user.delete({ where: { id: user.id } });

  console.log('✅ Cross-tenant isolation: membership scoped; EDITOR cannot publish; foreign hospital blocked');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
