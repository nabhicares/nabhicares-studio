/**
 * CDN simulator — serves published hospital sites via an atomic LIVE pointer.
 * GET /{slug}/… → read {slug}/LIVE → proxy MinIO …/versions/{publishId}/…
 * GET /{slug}/assets/… → MinIO assets (unchanged).
 *
 * Falls back to legacy …/current/… if LIVE is missing (old publishes).
 */
const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 80);
const MINIO = (process.env.MINIO_URL || 'http://minio:9000').replace(/\/$/, '');
const BUCKET = process.env.SNAPSHOT_BUCKET || 'nabhicares-sites';

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
};

function guessType(path) {
  const i = path.lastIndexOf('.');
  if (i < 0) return 'application/octet-stream';
  return CONTENT_TYPES[path.slice(i).toLowerCase()] || 'application/octet-stream';
}

async function fetchMinio(key) {
  const res = await fetch(`${MINIO}/${BUCKET}/${key}`);
  return res;
}

function normalizeSitePath(rest) {
  let p = rest || '';
  if (!p || p.endsWith('/')) {
    p = `${p}index.html`;
  } else if (!/\.[a-zA-Z0-9]+$/.test(p)) {
    // /doctors (no trailing slash) → doctors/index.html
    p = `${p}/index.html`;
  }
  return p.replace(/^\/+/, '');
}

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

function inlineNotFoundHtml(slug) {
  const name = humanizeSlug(slug);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/><title>Page not found — ${name}</title>
<style>
body{margin:0;min-height:100vh;font-family:system-ui,sans-serif;background:#f3f1ec;color:#0f1c1a}
main{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:2rem 1.25rem}
.inner{max-width:34rem}.kicker{color:#1f7a6c;font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
.code{margin:0;font-size:4.5rem;font-weight:700;line-height:.9;color:#1f7a6c}
h1{margin:.85rem 0 .65rem}p{color:#5c6b67;line-height:1.65}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}
a{display:inline-flex;padding:.8rem 1.35rem;border-radius:6px;font-weight:600;text-decoration:none}
a.primary{background:#1f7a6c;color:#f3f1ec}a.secondary{border:1px solid #c5ccc9;color:#0f1c1a}
</style></head><body><main><div class="inner">
<p class="kicker">${name}</p><p class="code" aria-hidden="true">404</p>
<h1>Page not found</h1>
<p>This link may be outdated, or the page hasn’t been published yet.</p>
<div class="actions"><a class="primary" href="/${slug}/">Back to home</a>
<a class="secondary" href="/${slug}/contact/">Contact</a></div>
</div></main></body></html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length === 0) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('nabhicares CDN simulator - request /{hospital_slug}/ to view a published site\n');
      return;
    }

    const slug = parts[0];
    const rest = parts.slice(1).join('/');

    // Media assets
    if (parts[1] === 'assets') {
      const assetKey = `${slug}/assets/${parts.slice(2).join('/')}`;
      const upstream = await fetchMinio(assetKey);
      if (!upstream.ok) {
        res.writeHead(upstream.status);
        res.end('Not found');
        return;
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': guessType(assetKey),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Served-By': 'nabhicares-cdn-sim',
      });
      res.end(buf);
      return;
    }

    const objectPath = normalizeSitePath(rest);
    const liveRes = await fetchMinio(`${slug}/LIVE`);
    let objectKey;
    if (liveRes.ok) {
      const publishId = (await liveRes.text()).trim();
      if (!publishId) {
        res.writeHead(404);
        res.end('Live pointer empty');
        return;
      }
      objectKey = `${slug}/versions/${publishId}/${objectPath}`;
    } else {
      // Legacy fallback for sites published before LIVE pointer
      objectKey = `${slug}/current/${objectPath}`;
    }

    const upstream = await fetchMinio(objectKey);
    if (!upstream.ok) {
      if (looksLikeMissingPage(objectPath)) {
        const publishIdMatch = objectKey.match(/\/versions\/([^/]+)\//);
        const publishId = publishIdMatch ? publishIdMatch[1] : '';
        const candidates = publishId
          ? [
              `${slug}/versions/${publishId}/404.html`,
              `${slug}/versions/${publishId}/404/index.html`,
            ]
          : [`${slug}/current/404.html`, `${slug}/current/404/index.html`];
        for (const nfKey of candidates) {
          const nf = await fetchMinio(nfKey);
          if (!nf.ok) continue;
          const buf = Buffer.from(await nf.arrayBuffer());
          res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=60',
            'X-Served-By': 'nabhicares-cdn-sim',
            'X-Nabhi-Object-Key': nfKey,
          });
          res.end(buf);
          return;
        }
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60',
          'X-Served-By': 'nabhicares-cdn-sim',
          'X-Nabhi-Object-Key': 'inline-404',
        });
        res.end(inlineNotFoundHtml(slug));
        return;
      }
      res.writeHead(upstream.status);
      res.end(`Not found (${objectKey})`);
      return;
    }
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.writeHead(200, {
      'Content-Type': guessType(objectPath),
      'Cache-Control': 'public, max-age=60',
      'X-Served-By': 'nabhicares-cdn-sim',
    });
    res.end(buf);
  } catch (err) {
    console.error(err);
    res.writeHead(502);
    res.end('CDN proxy error');
  }
});

server.listen(PORT, () => {
  console.log(`cdn-sim listening on :${PORT} → ${MINIO}/${BUCKET}`);
});
