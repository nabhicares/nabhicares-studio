/** Public CDN base URL for browser + server (path-style fallback). */
export function cdnBase(): string {
  return (
    process.env.NEXT_PUBLIC_CDN_PUBLIC_URL ||
    process.env.CDN_PUBLIC_URL ||
    'http://localhost:8080'
  ).replace(/\/$/, '');
}

/** Apex/root domain for hospital subdomains, e.g. nabhicares.com */
export function cdnRootDomain(): string {
  return (
    process.env.NEXT_PUBLIC_CDN_ROOT_DOMAIN ||
    process.env.CDN_ROOT_DOMAIN ||
    ''
  )
    .replace(/^\./, '')
    .toLowerCase();
}

/** Preferred public URL: https://{slug}.{root}/ when root domain is set. */
export function liveSiteUrl(hospitalSlug: string, customDomain?: string | null): string {
  if (customDomain) {
    const host = customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${host}/`;
  }
  const root = cdnRootDomain();
  if (root && hospitalSlug) {
    return `https://${hospitalSlug}.${root}/`;
  }
  return `${cdnBase()}/${hospitalSlug}/`;
}

export function pathStyleLiveUrl(hospitalSlug: string): string {
  return `${cdnBase()}/${hospitalSlug}/`;
}

/** CNAME target shown in Studio DNS checklist (override if Vercel shows a different value). */
export function cdnDnsCnameTarget(): string {
  return (
    process.env.NEXT_PUBLIC_CDN_DNS_CNAME ||
    process.env.CDN_DNS_CNAME ||
    'cname.vercel-dns.com'
  ).replace(/\.$/, '');
}

export type DnsRecordHint = {
  type: string;
  name: string;
  value: string;
  note?: string;
};

/** One-time platform records at the CDN root domain provider (wildcard covers every hospital). */
export function platformDnsRecords(): DnsRecordHint[] {
  const root = cdnRootDomain();
  if (!root) return [];
  // Vercel Hobby commonly asks for A → 76.76.21.21; CNAME to cname.vercel-dns.com also works.
  const aTarget = process.env.NEXT_PUBLIC_CDN_DNS_A || '76.76.21.21';
  const cnameTarget = cdnDnsCnameTarget();
  return [
    {
      type: 'A',
      name: '*',
      value: aTarget,
      note: `Covers every hospital: {slug}.${root}. DNS only (grey cloud) in Cloudflare until Valid.`,
    },
    {
      type: 'A',
      name: '@',
      value: aTarget,
      note: 'Apex. Or use CNAME/ALIAS per Vercel Domains → View DNS configuration.',
    },
    {
      type: 'A',
      name: 'studio',
      value: aTarget,
      note: `Studio host studio.${root}. Never point at 127.0.0.1.`,
    },
    {
      type: 'CNAME',
      name: '*',
      value: cnameTarget,
      note: 'Alternative to A records if Vercel shows CNAME instead.',
    },
  ];
}

/** Records the hospital must add when using a custom domain. */
export function customDomainDnsRecords(customDomain: string): DnsRecordHint[] {
  const host = customDomain
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .toLowerCase()
    .trim();
  if (!host) return [];
  const target = cdnDnsCnameTarget();
  const parts = host.split('.');
  // www.example.com → name www; example.com → name @ (or ALIAS)
  const name = parts.length > 2 ? parts[0]! : '@';
  return [
    {
      type: 'CNAME',
      name,
      value: target,
      note: `Also add “${host}” under Vercel nabhi-cdn → Domains`,
    },
  ];
}
