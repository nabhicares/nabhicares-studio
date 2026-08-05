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
