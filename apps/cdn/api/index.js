/**
 * Public hospital-site CDN — proxies MinIO via LIVE pointer.
 * Single entry so Vercel rewrites always land here.
 */
const MINIO = (process.env.MINIO_URL || process.env.SNAPSHOT_STORE_ENDPOINT || '').replace(
  /\/$/,
  '',
);
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
  '.xml': 'application/xml; charset=utf-8',
};

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

async function fetchMinio(key) {
  return fetch(`${MINIO}/${BUCKET}/${key}`);
}

function partsFromReq(req) {
  // Rewrite sends original path as ?p=...
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

module.exports = async function handler(req, res) {
  try {
    if (!MINIO) {
      res.statusCode = 500;
      res.end('CDN misconfigured: MINIO_URL missing');
      return;
    }

    const parts = partsFromReq(req);

    if (parts.length === 0 || parts[0] === 'health') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(parts[0] === 'health' ? 'ok\n' : 'nabhicares CDN — request /{hospital_slug}/\n');
      return;
    }

    const slug = parts[0];
    const rest = parts.slice(1).join('/');

    if (parts[1] === 'assets') {
      const assetKey = `${slug}/assets/${parts.slice(2).join('/')}`;
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

    const objectPath = normalizeSitePath(rest);
    const liveRes = await fetchMinio(`${slug}/LIVE`);
    let objectKey;
    if (liveRes.ok) {
      const publishId = (await liveRes.text()).trim();
      if (!publishId) {
        res.statusCode = 404;
        res.end('Live pointer empty');
        return;
      }
      objectKey = `${slug}/versions/${publishId}/${objectPath}`;
    } else {
      objectKey = `${slug}/current/${objectPath}`;
    }

    const upstream = await fetchMinio(objectKey);
    if (!upstream.ok) {
      res.statusCode = upstream.status;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Not found (${objectKey})`);
      return;
    }
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = 200;
    res.setHeader('Content-Type', guessType(objectPath));
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.end(buf);
  } catch (err) {
    console.error(err);
    res.statusCode = 502;
    res.end('CDN proxy error');
  }
};
