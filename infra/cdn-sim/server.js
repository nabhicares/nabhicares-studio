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
      res.writeHead(upstream.status);
      res.end('Not found');
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
