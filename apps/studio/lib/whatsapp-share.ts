import { liveSiteUrl, pathStyleLiveUrl } from '@/lib/cdn';

/** Digits only for wa.me — keep country code if provided. */
export function normalizeWhatsAppDigits(raw: string): string | null {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  // India local 10-digit → assume +91
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** Fallback when no per-hospital message and no campaign template. */
export const DEFAULT_WHATSAPP_TEMPLATE = [
  `Hi, this is Nabhi Labs.`,
  ``,
  `We put together a quick demo website for {{name}} so you can see how your hospital can look online.`,
  ``,
  `Open your demo here:`,
  `{{liveUrl}}`,
  `{{pathBackup}}`,
  ``,
  `Have a look when you get a moment. Happy to adjust anything for you.`,
  ``,
  `Team Nabhi Labs`,
].join('\n');

function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  return out
    .split('\n')
    .filter((line) => line !== '')
    .join('\n');
}

export function demoWhatsAppMessage(opts: {
  hospitalName: string;
  liveUrl: string;
  pathUrl?: string;
  /**
   * Priority (caller chooses): hospital.whatsappMessage, then campaign template, then default.
   * Placeholders: {{name}} {{liveUrl}} {{pathUrl}} {{pathBackup}}
   */
  template?: string | null;
}): string {
  const name = opts.hospitalName.trim() || 'your hospital';
  const liveUrl = opts.liveUrl || opts.pathUrl || '';
  const pathUrl = opts.pathUrl || '';
  const pathBackup =
    pathUrl && pathUrl !== liveUrl ? `(backup link: ${pathUrl})` : '';

  const template =
    (opts.template && opts.template.trim()) || DEFAULT_WHATSAPP_TEMPLATE;

  return fillTemplate(template, {
    name,
    liveUrl,
    pathUrl,
    pathBackup,
  });
}

export function whatsAppDeepLink(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}

export function hospitalPublicUrls(slug: string, customDomain?: string | null) {
  return {
    liveUrl: liveSiteUrl(slug, customDomain),
    pathUrl: pathStyleLiveUrl(slug),
  };
}
