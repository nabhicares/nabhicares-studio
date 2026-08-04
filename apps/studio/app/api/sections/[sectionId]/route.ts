import { prisma } from '@/lib/db';
import { badRequest, json, notFound } from '@/lib/api';
import { requireSectionAccess } from '@/lib/auth';
import {
  CONTENT_SCHEMA_VERSION,
  migrateSectionContent,
  validateSectionContent,
} from '@nabhicares/section-registry';

export async function PATCH(
  req: Request,
  { params }: { params: { sectionId: string } },
) {
  const access = await requireSectionAccess(params.sectionId);
  if ('error' in access) return access.error;

  const body = await req.json();
  const section = await prisma.section.findUnique({
    where: { id: params.sectionId },
    include: { template: true },
  });
  if (!section) return notFound('Section not found');

  const data: {
    enabled?: boolean;
    content?: object;
    order?: number;
    templateId?: string;
    contentSchemaVersion?: number;
  } = {};
  if (typeof body.enabled === 'boolean') data.enabled = body.enabled;
  if (typeof body.order === 'number') data.order = body.order;
  if (typeof body.templateId === 'string') {
    const next = await prisma.template.findUnique({ where: { id: body.templateId } });
    if (!next) return badRequest('templateId is invalid');
    if (next.key !== section.template.key) {
      return badRequest('layout change must keep the same section type');
    }
    data.templateId = next.id;
  }
  if (body.content !== undefined) {
    if (typeof body.content !== 'object' || body.content === null || Array.isArray(body.content)) {
      return badRequest('content must be an object');
    }
    const existing = (section.content ?? {}) as Record<string, unknown>;
    // Bring legacy content forward before validating the new write
    const migrated = migrateSectionContent(
      section.template.key,
      existing,
      section.contentSchemaVersion,
    );
    const validated = validateSectionContent(
      section.template.key,
      body.content as Record<string, unknown>,
      migrated.content,
      { strictUnknown: false },
    );
    if (!validated.ok) return badRequest(validated.error);
    data.content = validated.content;
    data.contentSchemaVersion = CONTENT_SCHEMA_VERSION;
  }

  const updated = await prisma.section.update({
    where: { id: params.sectionId },
    data,
    include: { template: true },
  });
  return json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { sectionId: string } },
) {
  const access = await requireSectionAccess(params.sectionId);
  if ('error' in access) return access.error;

  const section = await prisma.section.findUnique({ where: { id: params.sectionId } });
  if (!section) return notFound('Section not found');
  await prisma.section.delete({ where: { id: params.sectionId } });
  return json({ ok: true, id: params.sectionId });
}
