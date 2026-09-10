import { prisma } from '@/lib/db';
import { json } from '@/lib/api';
import {
  issueExtensionToken,
  requireUser,
  writeAudit,
} from '@/lib/auth';
import {
  DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID,
  GEMINI_HOSPITAL_BUNDLE_PROMPT,
  GEMINI_HOSPITAL_BUNDLE_PROMPTS,
  listGeminiHospitalBundlePromptMeta,
} from '@nabhicares/section-registry';

/** GET — list tokens + Gemini prompts for extension setup */
export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const tokens = await prisma.extensionToken.findMany({
    where: { userId: auth.user.id, revokedAt: null },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      label: true,
      prefix: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return json({
    tokens,
    geminiPrompt: GEMINI_HOSPITAL_BUNDLE_PROMPT,
    geminiPromptId: DEFAULT_GEMINI_HOSPITAL_BUNDLE_PROMPT_ID,
    geminiPrompts: GEMINI_HOSPITAL_BUNDLE_PROMPTS.map(({ id, label, description, prompt }) => ({
      id,
      label,
      description,
      prompt,
    })),
    geminiPromptMeta: listGeminiHospitalBundlePromptMeta(),
    studioOrigin:
      process.env.NEXT_PUBLIC_STUDIO_URL ||
      process.env.STUDIO_PUBLIC_URL ||
      '',
  });
}

/** POST — issue a new extension token (raw returned once) */
export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('error' in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const label = typeof body.label === 'string' ? body.label : undefined;
  const issued = await issueExtensionToken(auth.user.id, label);

  await writeAudit({
    actorId: auth.user.id,
    action: 'extension_token.create',
    meta: { tokenId: issued.id, prefix: issued.prefix },
  });

  return json(
    {
      id: issued.id,
      token: issued.token,
      prefix: issued.prefix,
      label: issued.label,
      createdAt: issued.createdAt,
      warning: 'Copy this token now — it will not be shown again.',
    },
    201,
  );
}
