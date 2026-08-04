/** Public CDN base URL for browser + server. */
export function cdnBase(): string {
  return (
    process.env.NEXT_PUBLIC_CDN_PUBLIC_URL ||
    process.env.CDN_PUBLIC_URL ||
    'http://localhost:8080'
  ).replace(/\/$/, '');
}

export function liveSiteUrl(hospitalSlug: string): string {
  return `${cdnBase()}/${hospitalSlug}/`;
}
