import { badRequest, notFound } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { liveSiteUrl } from '@/lib/cdn';
import { prisma } from '@/lib/db';
import { buildSiteSetupGuide } from '@/lib/site-export-guide';
import {
  rewriteSiteForRootHosting,
  shouldRewriteExportPath,
} from '@/lib/site-export-rewrite';
import { zipFiles } from '@/lib/zip-files';
import {
  downloadHospitalAssets,
  downloadLiveSiteFiles,
  IncompleteSnapshotError,
} from '@nabhicares/snapshot-store';

/**
 * GET /api/hospitals/:hospitalId/site-zip
 * Zip of the LIVE static site + SETUP.md for self-hosting.
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
  });
  if (!hospital) return badRequest('Hospital not found');

  let live;
  try {
    live = await downloadLiveSiteFiles(hospital.slug);
  } catch (err) {
    if (err instanceof IncompleteSnapshotError) {
      return badRequest(err.message);
    }
    const message = err instanceof Error ? err.message : 'Export failed';
    if (/limit|exceeds|files/i.test(message)) {
      return badRequest(message);
    }
    console.error('[site-zip] download live failed', err);
    return badRequest('Could not read live site from storage');
  }

  if (!live) {
    return notFound('No live site yet — publish first, then download the zip.');
  }

  let assets: { path: string; body: Buffer }[] = [];
  try {
    const siteBytes = live.files.reduce((n, f) => n + f.body.length, 0);
    assets = await downloadHospitalAssets(hospital.slug, { alreadyBytes: siteBytes });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Asset export failed';
    if (/limit|exceeds|files/i.test(message)) {
      return badRequest(message);
    }
    console.error('[site-zip] download assets failed', err);
    return badRequest('Could not read hospital media from storage');
  }

  const entries: { path: string; data: Buffer }[] = [];
  const seen = new Set<string>();

  for (const file of live.files) {
    let body = file.body;
    if (shouldRewriteExportPath(file.path)) {
      const text = body.toString('utf8');
      body = Buffer.from(rewriteSiteForRootHosting(text, hospital.slug), 'utf8');
    }
    const path = file.path.replace(/\\/g, '/');
    if (seen.has(path)) continue;
    seen.add(path);
    entries.push({ path, data: body });
  }

  for (const file of assets) {
    const path = file.path.replace(/\\/g, '/');
    if (seen.has(path)) continue;
    seen.add(path);
    entries.push({ path, data: file.body });
  }

  const exportedAt = new Date().toISOString();
  const guide = buildSiteSetupGuide({
    hospitalName: hospital.name,
    slug: hospital.slug,
    publishId: live.publishId,
    preferredHostedUrl: liveSiteUrl(hospital.slug, hospital.customDomain),
    exportedAt,
  });
  entries.push({
    path: 'SETUP.md',
    data: Buffer.from(guide, 'utf8'),
  });

  const zip = zipFiles(entries);
  await writeAudit({
    actorId: access.user.id,
    hospitalId: hospital.id,
    action: 'hospital.site_zip_download',
    meta: {
      publishId: live.publishId,
      fileCount: entries.length,
      zipBytes: zip.length,
    },
  });

  const filename = `${hospital.slug}-website.zip`;
  return new Response(new Uint8Array(zip), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
      'X-Nabhi-Site-Zip': `publish=${live.publishId};files=${entries.length}`,
    },
  });
}
