/**
 * Same idea as CDN host-mode: strip /{slug} so the site runs at domain root.
 * Also rewrites absolute nabhi-cdn URLs to root-relative paths.
 */
export function rewriteSiteForRootHosting(text: string, slug: string): string {
  const prefix = `/${slug}`;
  const cdnBases = [
    process.env.CDN_PUBLIC_URL,
    process.env.NEXT_PUBLIC_CDN_PUBLIC_URL,
    'https://nabhi-cdn.vercel.app',
  ]
    .filter(Boolean)
    .map((u) => String(u).replace(/\/$/, ''));

  const uniqueBases = [...new Set(cdnBases)];
  let out = text;
  for (const base of uniqueBases) {
    out = out.split(`${base}${prefix}/`).join('/');
    out = out.split(`${base}${prefix}"`).join('/"');
    out = out.split(`${base}${prefix}'`).join("/'");
  }

  return out
    .split(`${prefix}/`)
    .join('/')
    .split(`"${prefix}"`)
    .join('"/"')
    .split(`'${prefix}'`)
    .join("'/'");
}

export function shouldRewriteExportPath(path: string): boolean {
  return /\.(html?|js|css|json|xml|txt|svg|map)$/i.test(path);
}
