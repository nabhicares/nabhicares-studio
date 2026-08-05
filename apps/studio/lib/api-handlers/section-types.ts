import { SECTION_REGISTRY } from '@nabhicares/section-registry';
import { json } from '@/lib/api';
import { requireUser } from '@/lib/auth';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;
  return json(SECTION_REGISTRY);
}
