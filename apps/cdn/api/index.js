/**
 * Public hospital-site CDN — MinIO via LIVE pointer.
 *
 * Routing:
 * - Path:  https://cdn…/{slug}/…          (pilot)
 * - Subdomain: https://{slug}.{CDN_ROOT_DOMAIN}/…
 * - Custom: Host in _cdn/domain-map.json or CDN_DOMAIN_MAP env
 */
const MINIO = (process.env.MINIO_URL || process.env.SNAPSHOT_STORE_ENDPOINT || '').replace(
  /\/$/,
  '',
);
const BUCKET = process.env.SNAPSHOT_BUCKET || 'nabhicares-sites';
const ROOT_DOMAIN = (process.env.CDN_ROOT_DOMAIN || '').replace(/^\./, '').toLowerCase();
const RESERVED = new Set([
  'www',
  'api',
  'app',
  'studio',
  'cdn',
  'mail',
  'admin',
  'status',
  'assets',
]);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml; charset=utf-8',
};

let domainMapCache = { at: 0, map: /** @type {Record<string, string>} */ ({}) };

function guessType(path) {
  const i = path.lastIndexOf('.');
  if (i < 0) return 'application/octet-stream';
  return CONTENT_TYPES[path.slice(i).toLowerCase()] || 'application/octet-stream';
}

function normalizeSitePath(rest) {
  let p = rest || '';
  if (!p || p.endsWith('/')) p = `${p}index.html`;
  else if (!/\.[a-zA-Z0-9]+$/.test(p)) p = `${p}/index.html`;
  return p.replace(/^\/+/, '');
}

/** Missing routes that should get the themed hospital 404 page (not asset 404s). */
function looksLikeMissingPage(objectPath) {
  if (!objectPath) return true;
  if (objectPath.startsWith('_next/')) return false;
  if (objectPath.startsWith('assets/')) return false;
  if (objectPath.endsWith('.html') || objectPath.endsWith('/')) return true;
  return !/\.[a-zA-Z0-9]+$/.test(objectPath);
}

function humanizeSlug(slug) {
  return String(slug || 'Hospital')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Last-resort themed 404 when a publish has no 404.html yet. */
function inlineNotFoundHtml(slug, hostMode) {
  const name = humanizeSlug(slug);
  const home = hostMode ? '/' : `/${slug}/`;
  const contact = hostMode ? '/contact/' : `/${slug}/contact/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>Page not found — ${name}</title>
<style>
  :root {
    --bg: #f3f1ec; --fg: #0f1c1a; --accent: #1f7a6c; --muted: #5c6b67;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; font-family: "Segoe UI", system-ui, sans-serif;
    background:
      radial-gradient(120% 80% at 10% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%),
      var(--bg);
    color: var(--fg);
  }
  main {
    min-height: 70vh; display: flex; align-items: center; justify-content: center;
    padding: clamp(2rem, 6vw, 4rem) clamp(1.25rem, 4vw, 2rem);
  }
  .inner { width: min(100%, 34rem); }
  .kicker {
    margin: 0 0 0.75rem; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent);
  }
  .code {
    margin: 0; font-size: clamp(4.5rem, 14vw, 7rem); font-weight: 700;
    line-height: 0.9; letter-spacing: -0.06em;
    color: color-mix(in srgb, var(--accent) 55%, var(--fg));
  }
  h1 { margin: 0.85rem 0 0.65rem; font-size: clamp(1.75rem, 4vw, 2.35rem); letter-spacing: -0.03em; }
  p { margin: 0 0 1.75rem; font-size: 1.05rem; line-height: 1.65; color: var(--muted); max-width: 32rem; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  a.btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.8rem 1.35rem; border-radius: 6px; font-weight: 600;
    font-size: 0.95rem; text-decoration: none;
  }
  a.primary { background: var(--accent); color: var(--bg); }
  a.secondary {
    background: transparent; color: var(--fg);
    border: 1px solid color-mix(in srgb, var(--fg) 22%, transparent);
  }
</style>
</head>
<body>
<main>
  <div class="inner">
    <p class="kicker">${name}</p>
    <p class="code" aria-hidden="true">404</p>
    <h1>Page not found</h1>
    <p>This link may be outdated, or the page hasn’t been published yet. Head home or reach the hospital team from the contact page.</p>
    <div class="actions">
      <a class="btn primary" href="${home}">Back to home</a>
      <a class="btn secondary" href="${contact}">Contact</a>
    </div>
  </div>
</main>
</body>
</html>`;
}

async function fetchMinio(key) {
  return fetch(`${MINIO}/${BUCKET}/${key}`);
}

async function serveHospitalNotFound(res, { slug, liveId, hostMode }) {
  const candidates = liveId
    ? [
        `${slug}/versions/${liveId}/404.html`,
        `${slug}/versions/${liveId}/404/index.html`,
      ]
    : [`${slug}/current/404.html`, `${slug}/current/404/index.html`];

  for (const notFoundKey of candidates) {
    const nf = await fetchMinio(notFoundKey);
    if (!nf.ok) continue;
    let buf = Buffer.from(await nf.arrayBuffer());
    if (hostMode) {
      buf = Buffer.from(rewriteHtmlForHost(buf.toString('utf8'), slug), 'utf8');
    }
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('X-Nabhi-Object-Key', notFoundKey);
    if (liveId) res.setHeader('X-Nabhi-Live-Id', liveId);
    if (hostMode) res.setHeader('X-Nabhi-Tenant', slug);
    res.end(buf);
    return true;
  }

  const html = inlineNotFoundHtml(slug, hostMode);
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('X-Nabhi-Object-Key', 'inline-404');
  if (liveId) res.setHeader('X-Nabhi-Live-Id', liveId);
  if (hostMode) res.setHeader('X-Nabhi-Tenant', slug);
  res.end(html);
  return true;
}

function partsFromReq(req) {
  const q = req.query && req.query.p;
  if (typeof q === 'string' && q.length) {
    return q.split('/').filter(Boolean);
  }
  if (Array.isArray(q) && q[0]) {
    return String(q[0]).split('/').filter(Boolean);
  }
  const rawUrl = req.url || '/';
  let pathname;
  try {
    pathname = new URL(rawUrl, 'http://localhost').pathname;
  } catch {
    pathname = rawUrl.split('?')[0];
  }
  pathname = pathname.replace(/^\/api(\/|$)/, '/');
  return pathname.split('/').filter(Boolean);
}

function requestHost(req) {
  const xf = req.headers['x-forwarded-host'];
  const raw = (Array.isArray(xf) ? xf[0] : xf) || req.headers.host || '';
  return String(raw).split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
}

function envDomainMap() {
  try {
    const raw = process.env.CDN_DOMAIN_MAP || '{}';
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function loadDomainMap() {
  const now = Date.now();
  if (now - domainMapCache.at < 30_000) return domainMapCache.map;
  const map = { ...envDomainMap() };
  try {
    const res = await fetchMinio('_cdn/domain-map.json');
    if (res.ok) {
      const body = JSON.parse(await res.text());
      if (body && typeof body === 'object') Object.assign(map, body);
    }
  } catch {
    /* ignore */
  }
  domainMapCache = { at: now, map };
  return map;
}

/**
 * @returns {{ slug: string | null, hostMode: boolean, parts: string[] }}
 */
async function resolveTenant(req, parts) {
  const host = requestHost(req);
  const map = await loadDomainMap();

  if (host && map[host]) {
    return { slug: map[host], hostMode: true, parts };
  }

  if (ROOT_DOMAIN && host && host !== ROOT_DOMAIN && host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.slice(0, -(ROOT_DOMAIN.length + 1));
    if (sub && !sub.includes('.') && !RESERVED.has(sub)) {
      return { slug: sub, hostMode: true, parts };
    }
  }

  // Path-based: /{slug}/…
  if (parts[0] === 'health') {
    return { slug: null, hostMode: false, parts };
  }
  if (parts.length === 0) {
    return { slug: null, hostMode: false, parts };
  }
  return {
    slug: parts[0],
    hostMode: false,
    parts: parts.slice(1),
  };
}

/**
 * Hospital subdomains serve at /, so strip the path-style /{slug} prefix.
 * Absolute CDN URLs must become root-relative on this host — never
 * `https://cdn…/assets/…` (missing slug → 404). Prefer `/assets/…`.
 */
function rewriteHtmlForHost(html, slug) {
  const prefix = `/${slug}`;
  const cdnBases = [
    process.env.CDN_PUBLIC_URL,
    process.env.NEXT_PUBLIC_CDN_PUBLIC_URL,
  ]
    .filter(Boolean)
    .map((u) => String(u).replace(/\/$/, ''));

  // Always include the production CDN host used in stored media URLs.
  if (!cdnBases.includes('https://nabhi-cdn.vercel.app')) {
    cdnBases.push('https://nabhi-cdn.vercel.app');
  }

  let out = html;
  for (const base of cdnBases) {
    // https://cdn/{slug}/assets/x → /assets/x  (works on subdomain host)
    out = out.split(`${base}${prefix}/`).join('/');
    out = out.split(`${base}${prefix}"`).join('/"');
    out = out.split(`${base}${prefix}'`).join("/'");
  }

  // Relative path-style links: /{slug}/contact/ → /contact/
  out = out
    .split(`${prefix}/`)
    .join('/')
    .split(`"${prefix}"`)
    .join('"/"')
    .split(`'${prefix}'`)
    .join("'/'");

  return out;
}

module.exports = async function handler(req, res) {
  try {
    if (!MINIO) {
      res.statusCode = 500;
      res.end('CDN misconfigured: MINIO_URL missing');
      return;
    }

    const rawParts = partsFromReq(req);
    const { slug, hostMode, parts } = await resolveTenant(req, rawParts);

    if (!slug) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const tip = ROOT_DOMAIN
        ? `Path: /{slug}/  ·  Subdomain: https://{slug}.${ROOT_DOMAIN}/\n`
        : 'Path: /{hospital_slug}/\n';
      res.end(
        rawParts[0] === 'health'
          ? 'ok\n'
          : `nabhicares CDN\n${tip}`,
      );
      return;
    }

    // Prefixed asset URLs on a subdomain host: /{slug}/_next/… → strip
    let siteParts = parts;
    if (hostMode && siteParts[0] === slug) {
      siteParts = siteParts.slice(1);
    }

    if (siteParts[0] === 'assets') {
      const assetKey = `${slug}/assets/${siteParts.slice(1).join('/')}`;
      const upstream = await fetchMinio(assetKey);
      if (!upstream.ok) {
        res.statusCode = upstream.status;
        res.end('Not found');
        return;
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.statusCode = 200;
      res.setHeader('Content-Type', guessType(assetKey));
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.end(buf);
      return;
    }

    const objectPath = normalizeSitePath(siteParts.join('/'));
    const liveRes = await fetchMinio(`${slug}/LIVE`);
    let objectKey;
    let liveId = '';
    if (liveRes.ok) {
      liveId = (await liveRes.text()).trim();
      if (!liveId) {
        res.statusCode = 404;
        res.end('Live pointer empty');
        return;
      }
      objectKey = `${slug}/versions/${liveId}/${objectPath}`;
    } else {
      // Legacy fallback — prefer failing closed when LIVE is missing after migrate.
      objectKey = `${slug}/current/${objectPath}`;
    }

    const upstream = await fetchMinio(objectKey);
    if (!upstream.ok) {
      if (looksLikeMissingPage(objectPath)) {
        await serveHospitalNotFound(res, { slug, liveId, hostMode });
        return;
      }
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('X-Nabhi-Object-Key', objectKey);
      res.setHeader('X-Nabhi-Live-Id', liveId || 'none');
      res.setHeader('X-Nabhi-Minio', MINIO.replace(/^https?:\/\//, '').split('/')[0] || '');
      res.end(`Not found (${objectKey})`);
      return;
    }

    let buf = Buffer.from(await upstream.arrayBuffer());
    let contentType = guessType(objectPath);
    if (hostMode && contentType.includes('text/html')) {
      buf = Buffer.from(rewriteHtmlForHost(buf.toString('utf8'), slug), 'utf8');
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    const immutable =
      objectPath.includes('_next/static/') ||
      /\.(?:woff2?|png|jpe?g|webp|gif|svg|ico)$/i.test(objectPath);
    res.setHeader(
      'Cache-Control',
      immutable
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=60',
    );
    res.setHeader('X-Nabhi-Object-Key', objectKey);
    res.setHeader('X-Nabhi-Live-Id', liveId || 'legacy-current');
    res.setHeader('X-Nabhi-Minio', MINIO.replace(/^https?:\/\//, '').split('/')[0] || '');
    res.setHeader('X-Nabhi-Bytes', String(buf.length));
    if (hostMode) res.setHeader('X-Nabhi-Tenant', slug);
    res.end(buf);
  } catch (err) {
    console.error(err);
    res.statusCode = 502;
    res.end('CDN proxy error');
  }
};
