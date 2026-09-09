import { PrismaClient } from '@nabhicares/db-builder';
import {
  purgeHospitalStorage,
  setCustomDomainMapping,
} from '@nabhicares/snapshot-store';

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/** Hard-delete TRASHED hospitals past the 30-day window. */
export async function purgeExpiredTrashedHospitals(
  prisma: PrismaClient,
): Promise<number> {
  const cutoff = new Date(Date.now() - RETENTION_MS);
  const due = await prisma.hospital.findMany({
    where: {
      pipelineStatus: 'TRASHED',
      trashedAt: { lte: cutoff },
    },
    select: { id: true, slug: true, name: true },
  });

  let deleted = 0;
  for (const h of due) {
    try {
      try {
        await setCustomDomainMapping(h.slug, null);
      } catch (err) {
        console.error('[purge-trashed] domain map', h.slug, err);
      }
      await prisma.section.deleteMany({
        where: { page: { hospitalId: h.id } },
      });
      await prisma.page.deleteMany({ where: { hospitalId: h.id } });
      await prisma.publish.deleteMany({ where: { hospitalId: h.id } });
      await prisma.designSystem.deleteMany({ where: { hospitalId: h.id } });
      await prisma.hospitalMembership.deleteMany({ where: { hospitalId: h.id } });
      await prisma.appointmentRequest.deleteMany({ where: { hospitalId: h.id } });
      await prisma.hospital.delete({ where: { id: h.id } });
      try {
        await purgeHospitalStorage(h.slug);
      } catch (err) {
        console.error('[purge-trashed] MinIO', h.slug, err);
      }
      deleted += 1;
      console.log(`[purge-trashed] deleted ${h.slug} (${h.name})`);
    } catch (err) {
      console.error('[purge-trashed] failed', h.id, err);
    }
  }
  return deleted;
}
