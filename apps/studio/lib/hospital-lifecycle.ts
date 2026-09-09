import { prisma } from '@/lib/db';
import { clearLivePointer, purgeHospitalStorage, setCustomDomainMapping } from '@nabhicares/snapshot-store';

/** Hard-delete hospital rows + MinIO objects (used by DELETE and 30-day trash purge). */
export async function hardDeleteHospital(hospitalId: string): Promise<{
  slug: string;
  name: string;
  objectsDeleted: number;
}> {
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) {
    throw new Error('Hospital not found');
  }
  const slug = hospital.slug;
  const name = hospital.name;

  try {
    await setCustomDomainMapping(slug, null);
  } catch (err) {
    console.error('[hardDeleteHospital] domain map clear failed', err);
  }

  await prisma.section.deleteMany({
    where: { page: { hospitalId } },
  });
  await prisma.page.deleteMany({ where: { hospitalId } });
  await prisma.publish.deleteMany({ where: { hospitalId } });
  await prisma.designSystem.deleteMany({ where: { hospitalId } });
  await prisma.hospitalMembership.deleteMany({ where: { hospitalId } });
  await prisma.appointmentRequest.deleteMany({ where: { hospitalId } });
  await prisma.hospital.delete({ where: { id: hospitalId } });

  let objectsDeleted = 0;
  try {
    objectsDeleted = await purgeHospitalStorage(slug);
  } catch (err) {
    console.error('[hardDeleteHospital] MinIO purge failed', err);
  }

  return { slug, name, objectsDeleted };
}

/** Soft-unpublish for trash/decline: clear LIVE + mark publishes not live. */
export async function softUnpublishHospital(hospitalId: string, slug: string) {
  await prisma.publish.updateMany({
    where: { hospitalId, isLive: true },
    data: { isLive: false },
  });
  try {
    await clearLivePointer(slug);
  } catch (err) {
    console.error('[softUnpublishHospital] clear LIVE failed', err);
  }
}
