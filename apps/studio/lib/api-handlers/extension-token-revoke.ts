import { prisma } from '@/lib/db';
import { badRequest, json } from '@/lib/api';
import { requireUser, writeAudit } from '@/lib/auth';

/** DELETE /api/extension/tokens/:tokenId — revoke */
export async function DELETE(
  req: Request,
  { params }: { params: { tokenId: string } },
) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const row = await prisma.extensionToken.findFirst({
    where: { id: params.tokenId, userId: auth.user.id },
  });
  if (!row) return badRequest('Token not found');

  await prisma.extensionToken.update({
    where: { id: row.id },
    data: { revokedAt: new Date() },
  });

  await writeAudit({
    actorId: auth.user.id,
    action: 'extension_token.revoke',
    meta: { tokenId: row.id },
  });

  return json({ ok: true });
}
