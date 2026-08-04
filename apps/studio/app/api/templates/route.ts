import { prisma } from '@/lib/db';
import { json } from '@/lib/api';
import { requireUser } from '@/lib/auth';

/** List templates; optional ?key=hero filters by section type. */
export async function GET(req: Request) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const key = new URL(req.url).searchParams.get('key');
  const templates = await prisma.template.findMany({
    where: key ? { key } : undefined,
    orderBy: [{ key: 'asc' }, { version: 'asc' }],
    select: {
      id: true,
      key: true,
      version: true,
      componentRef: true,
    },
  });
  return json(templates);
}
