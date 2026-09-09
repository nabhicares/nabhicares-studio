import { liveSiteUrl, pathStyleLiveUrl } from '@/lib/cdn';

/** Digits only for wa.me — keep country code if provided. */
export function normalizeWhatsAppDigits(raw: string): string | null {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  // India local 10-digit → assume +91
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function demoWhatsAppMessage(opts: {
  hospitalName: string;
  liveUrl: string;
  pathUrl?: string;
}): string {
  const name = opts.hospitalName.trim() || 'your hospital';
  const url = opts.liveUrl || opts.pathUrl || '';
  return [
    `Hi — this is Nabhi Labs.`,
    ``,
    `We put together a quick demo website for ${name} so you can see how your hospital can look online.`,
    ``,
    `Open your demo here:`,
    url,
    opts.pathUrl && opts.pathUrl !== url ? `(backup link: ${opts.pathUrl})` : '',
    ``,
    `Have a look when you get a moment — happy to adjust anything for you.`,
    ``,
    `— Team Nabhi Labs`,
  ]
    .filter((line) => line !== '')
    .join('\n');
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
