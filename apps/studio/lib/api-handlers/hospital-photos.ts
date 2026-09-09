import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireHospitalAccess, writeAudit } from '@/lib/auth';
import { CONTENT_SCHEMA_VERSION } from '@nabhicares/section-registry';

function asUrlList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const u = item.trim();
    if (!/^https:\/\//i.test(u)) continue;
    if (!out.includes(u)) out.push(u.slice(0, 500));
  }
  return out.slice(0, 40);
}

function parseUrlsFromText(text: string): string[] {
  return asUrlList(
    text
      .split(/[\n,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/**
 * GET /api/hospitals/:id/photos — candidates + current hero/about/og
 * PATCH — { photoCandidates?: string[] | string, assign?: { url, target } }
 */
export async function GET(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const hospital = await prisma.hospital.findUnique({
    where: { id: access.hospital.id },
    include: {
      pages: {
        where: { slug: 'home' },
        include: {
          sections: { include: { template: true }, orderBy: { order: 'asc' } },
        },
      },
    },
  });
  if (!hospital) return badRequest('Hospital not found');

  const home = hospital.pages[0];
  const hero = home?.sections.find((s) => s.template.key === 'hero');
  const about = home?.sections.find((s) => s.template.key === 'about');
  const gallery = home?.sections.find((s) => s.template.key === 'gallery');
  const heroImg =
    hero && typeof (hero.content as Record<string, unknown>)?.image === 'string'
      ? String((hero.content as Record<string, unknown>).image)
      : '';
  const aboutImg =
    about && typeof (about.content as Record<string, unknown>)?.image === 'string'
      ? String((about.content as Record<string, unknown>).image)
      : '';

  return json({
    photoCandidates: asUrlList(hospital.photoCandidates),
    current: {
      hero: heroImg,
      about: aboutImg,
      og: hospital.ogImage || '',
      galleryFirst:
        gallery &&
        Array.isArray((gallery.content as Record<string, unknown>)?.images) &&
        typeof (
          ((gallery.content as Record<string, unknown>).images as unknown[])[0] as {
            src?: string;
          }
        )?.src === 'string'
          ? String(
              (
                (gallery.content as Record<string, unknown>).images as { src?: string }[]
              )[0]?.src,
            )
          : '',
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { hospitalId: string } },
) {
  const access = await requireHospitalAccess(params.hospitalId, 'EDITOR', req);
  if ('error' in access) return access.error;

  const body = await req.json().catch(() => ({}));
  let candidatesUpdated = false;

  if (body.photoCandidates !== undefined) {
    let list: string[] = [];
    if (typeof body.photoCandidates === 'string') {
      list = parseUrlsFromText(body.photoCandidates);
    } else {
      list = asUrlList(body.photoCandidates);
    }
    await prisma.hospital.update({
      where: { id: access.hospital.id },
      data: { photoCandidates: list },
    });
    candidatesUpdated = true;
    await writeAudit({
      actorId: access.user.id,
      hospitalId: access.hospital.id,
      action: 'hospital.photo_candidates',
      meta: { count: list.length },
    });
  }

  if (body.addUrl && typeof body.addUrl === 'string') {
    const u = body.addUrl.trim();
    if (!/^https:\/\//i.test(u)) return badRequest('addUrl must be https://');
    const hospital = await prisma.hospital.findUnique({
      where: { id: access.hospital.id },
    });
    const prev = asUrlList(hospital?.photoCandidates);
    if (!prev.includes(u)) prev.unshift(u.slice(0, 500));
    await prisma.hospital.update({
      where: { id: access.hospital.id },
      data: { photoCandidates: prev.slice(0, 40) },
    });
    candidatesUpdated = true;
  }

  if (body.assign && typeof body.assign === 'object' && body.assign) {
    const url = typeof body.assign.url === 'string' ? body.assign.url.trim() : '';
    const target =
      typeof body.assign.target === 'string' ? body.assign.target.trim().toLowerCase() : '';
    if (!/^https:\/\//i.test(url)) return badRequest('assign.url must be https://');
    if (!['hero', 'about', 'og', 'gallery'].includes(target)) {
      return badRequest('assign.target must be hero|about|og|gallery');
    }

    if (target === 'og') {
      await prisma.hospital.update({
        where: { id: access.hospital.id },
        data: { ogImage: url.slice(0, 500), ogCardStyle: 'custom' },
      });
    } else {
      const home = await prisma.page.findFirst({
        where: { hospitalId: access.hospital.id, slug: 'home' },
        include: {
          sections: { include: { template: true }, orderBy: { order: 'asc' } },
        },
      });
      if (!home) return badRequest('Home page missing');

      if (target === 'hero' || target === 'about') {
        const section = home.sections.find((s) => s.template.key === target);
        if (!section) return badRequest(`${target} section missing`);
        const content = {
          ...((section.content as object) || {}),
          image: url,
        };
        await prisma.section.update({
          where: { id: section.id },
          data: { content, contentSchemaVersion: CONTENT_SCHEMA_VERSION },
        });
      } else if (target === 'gallery') {
        let section = home.sections.find((s) => s.template.key === 'gallery');
        if (!section) {
          const template = await prisma.template.findUnique({
            where: { key_version: { key: 'gallery', version: 1 } },
          });
          if (!template) return badRequest('gallery template missing');
          const max = await prisma.section.aggregate({
            where: { pageId: home.id },
            _max: { order: true },
          });
          section = await prisma.section.create({
            data: {
              pageId: home.id,
              templateId: template.id,
              order: (max._max.order ?? -1) + 1,
              enabled: true,
              content: { title: 'Gallery', images: [{ src: url, caption: '' }] },
              contentSchemaVersion: CONTENT_SCHEMA_VERSION,
            },
            include: { template: true },
          });
        } else {
          const prev = (section.content as Record<string, unknown>) || {};
          const images = Array.isArray(prev.images) ? [...prev.images] : [];
          if (
            images[0] &&
            typeof images[0] === 'object' &&
            images[0] !== null
          ) {
            images[0] = { ...(images[0] as object), src: url };
          } else {
            images.unshift({ src: url, caption: '' });
          }
          await prisma.section.update({
            where: { id: section.id },
            data: {
              content: { ...prev, images },
              contentSchemaVersion: CONTENT_SCHEMA_VERSION,
            },
          });
        }
      }
    }

    await writeAudit({
      actorId: access.user.id,
      hospitalId: access.hospital.id,
      action: 'hospital.photo_assign',
      meta: { target, url },
    });
  }

  if (!candidatesUpdated && !body.assign && !body.addUrl) {
    return badRequest('photoCandidates, addUrl, or assign required');
  }

  // Return refreshed GET shape
  return GET(req, { params });
}
