import { Worker, Job } from 'bullmq';
import { spawn } from 'child_process';
import { createServer } from 'http';
import { readdir, readFile, writeFile, mkdir, stat, rm } from 'fs/promises';
import { deflateSync } from 'zlib';
import { join, relative, extname } from 'path';
import { connection, PublishJobData, PUBLISH_QUEUE_NAME } from '@nabhicares/queue';
import { uploadBuildOutput, promoteToLive, BuildFile } from '@nabhicares/snapshot-store';
import { PrismaClient } from '@nabhicares/db-builder';
import type { Prisma } from '@prisma/client';
import {
  DEFAULT_DESIGN_TOKENS,
  migrateSectionContent,
  buildFaviconSvg,
  isFaviconPresetId,
  normalizeSystemPages,
  type DesignTokens,
  type FaviconPresetId,
} from '@nabhicares/section-registry';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.BUILDER_DATABASE_URL },
  },
});

const SITE_RENDERER_ROOT = join(__dirname, '../../../packages/site-renderer');

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2',
]);

const CONTENT_TYPES: Record<string, string> = {
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
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** WhatsApp/Meta need raster https images — SVG share cards are ignored. */
function shareImageScore(url: string): number {
  const path = url.split('?')[0].toLowerCase();
  if (path.endsWith('.svg')) return -1;
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 3;
  if (path.endsWith('.png')) return 2;
  if (path.endsWith('.webp')) return 1;
  if (path.endsWith('.gif')) return 0;
  return -1;
}

/**
 * Turn Studio/CDN media URLs into a live-site absolute URL WhatsApp can fetch.
 * Rewrites `https://cdn…/{slug}/assets/x.jpg` → `https://{slug}.…/assets/x.jpg`.
 */
function toLiveShareImageUrl(
  raw: string,
  publicOrigin: string,
  slug: string,
): string | null {
  const value = raw.trim();
  if (!value || shareImageScore(value) < 0) return null;
  const origin = publicOrigin.replace(/\/$/, '');

  let pathname = value;
  if (/^https?:\/\//i.test(value)) {
    try {
      pathname = new URL(value).pathname;
    } catch {
      return shareImageScore(value) >= 0 && value.startsWith('https://') ? value : null;
    }
  }

  const asset = pathname.match(
    new RegExp(`^(?:/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})?/assets/([^/]+)$`, 'i'),
  );
  if (asset) {
    return `${origin}/assets/${asset[1]}`;
  }

  if (value.startsWith('/') && shareImageScore(value) >= 0) {
    return `${origin}${value}`;
  }

  if (/^https:\/\//i.test(value)) return value;
  return null;
}

function pickResolvedOgImage(
  hospitalOgImage: string | null | undefined,
  ogCardStyle: string | null | undefined,
  pages: Array<{ sections: Array<{ type: string; content?: Record<string, unknown> | null }> }>,
  publicOrigin: string,
  slug: string,
): string {
  const style = (ogCardStyle || 'hero').toLowerCase();
  const origin = publicOrigin.replace(/\/$/, '');

  if (style === 'brand') {
    return `${origin}/og.png`;
  }

  if (style === 'custom') {
    const custom =
      typeof hospitalOgImage === 'string'
        ? toLiveShareImageUrl(hospitalOgImage, publicOrigin, slug)
        : null;
    return custom || `${origin}/og.png`;
  }

  // hero (default): prefer hospital hero photo, else branded fallback
  const candidates: string[] = [];
  for (const page of pages) {
    for (const section of page.sections) {
      if (section.type !== 'hero') continue;
      const img = section.content?.image;
      if (typeof img !== 'string') continue;
      const live = toLiveShareImageUrl(img, publicOrigin, slug);
      if (live) candidates.push(live);
    }
  }
  candidates.sort((a, b) => shareImageScore(b) - shareImageScore(a));
  return candidates[0] || `${origin}/og.png`;
}

/** Minimal solid-color PNG (1200×630) — no sharp/@vercel/og. */
function buildOgPng(accentHex: string): Buffer {
  const width = 1200;
  const height = 630;
  const hex = accentHex.replace('#', '').trim();
  const n = parseInt(hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex.slice(0, 6), 16);
  const r = Number.isFinite(n) ? (n >> 16) & 255 : 31;
  const g = Number.isFinite(n) ? (n >> 8) & 255 : 122;
  const b = Number.isFinite(n) ? n & 255 : 108;

  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x++) {
    const i = 1 + x * 3;
    row[i] = r;
    row[i + 1] = g;
    row[i + 2] = b;
  }
  const raw = Buffer.alloc(row.length * height);
  for (let y = 0; y < height; y++) row.copy(raw, y * row.length);
  const compressed = deflateSync(raw, { level: 9 });

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  })();
  const crc32 = (buf: Buffer) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Branded share-card SVG (1200×630) — no @vercel/og (that breaks static export). */
function buildOgSvg(opts: {
  hospitalName: string;
  title: string;
  description: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
}): string {
  const name = escapeXml(opts.hospitalName.slice(0, 60));
  const title = escapeXml(opts.title.slice(0, 80));
  const desc = escapeXml(opts.description.slice(0, 140));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeXml(opts.accent)}" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="${escapeXml(opts.background)}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${escapeXml(opts.background)}"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="72" y="100" fill="${escapeXml(opts.accent)}" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="2">${name}</text>
  <text x="72" y="260" fill="${escapeXml(opts.foreground)}" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700">${title}</text>
  <text x="72" y="330" fill="${escapeXml(opts.muted)}" font-family="Segoe UI, Arial, sans-serif" font-size="26">${desc}</text>
  <rect x="72" y="520" width="160" height="48" rx="24" fill="${escapeXml(opts.accent)}"/>
  <text x="152" y="552" text-anchor="middle" fill="${escapeXml(opts.background)}" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700">Visit site</text>
</svg>`;
}

async function collectFiles(dir: string, base = dir): Promise<BuildFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: BuildFile[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full, base)));
      continue;
    }
    const rel = relative(base, full).replace(/\\/g, '/');
    const ext = extname(entry.name).toLowerCase();
    const buf = await readFile(full);
    files.push({
      path: rel,
      body: BINARY_EXTS.has(ext) ? buf : buf.toString('utf8'),
      contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
    });
  }
  return files;
}

function runCommand(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: true,
      stdio: 'inherit',
      env: { ...env },
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

async function resolveHospital(hospitalIdOrSlug: string) {
  const hospital = await prisma.hospital.findFirst({
    where: {
      OR: [{ id: hospitalIdOrSlug }, { slug: hospitalIdOrSlug }],
    },
    include: {
      designSystem: true,
      pages: {
        include: {
          sections: {
            where: { enabled: true },
            orderBy: { order: 'asc' },
            include: { template: true },
          },
        },
        orderBy: { slug: 'asc' },
      },
    },
  });
  if (!hospital) throw new Error(`Hospital not found: ${hospitalIdOrSlug}`);
  return hospital;
}

async function buildStaticSite(hospitalIdOrSlug: string) {
  const hospital = await resolveHospital(hospitalIdOrSlug);
  const rawTokens = {
    ...DEFAULT_DESIGN_TOKENS,
    ...((hospital.designSystem?.tokens as object) ?? {}),
  } as DesignTokens;
  const tokens: DesignTokens = {
    ...rawTokens,
    systemPages: normalizeSystemPages(rawTokens.systemPages),
  };
  const favicon: FaviconPresetId = isFaviconPresetId(tokens.favicon)
    ? tokens.favicon
    : 'initial';

  const pages = [];
  for (const page of hospital.pages) {
    const sections = [];
    for (const section of page.sections) {
      const migrated = migrateSectionContent(
        section.template.key,
        (section.content ?? {}) as Record<string, unknown>,
        section.contentSchemaVersion,
      );
      if (migrated.changed) {
        await prisma.section.update({
          where: { id: section.id },
          data: {
            content: migrated.content as Prisma.InputJsonValue,
            contentSchemaVersion: migrated.version,
          },
        });
      }
      sections.push({
        id: section.id,
        type: section.template.key,
        layoutVersion: section.template.version,
        order: section.order,
        content: migrated.content,
      });
    }
    pages.push({
      slug: page.slug,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      sections,
    });
  }

  const rootDomain = (process.env.CDN_ROOT_DOMAIN || process.env.NEXT_PUBLIC_CDN_ROOT_DOMAIN || '')
    .replace(/^\./, '')
    .toLowerCase();
  const publicOrigin = hospital.customDomain
    ? `https://${hospital.customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}/`
    : rootDomain
      ? `https://${hospital.slug}.${rootDomain}/`
      : `https://${hospital.slug}.localhost/`;

  const resolvedOgImage = pickResolvedOgImage(
    hospital.ogImage,
    hospital.ogCardStyle,
    pages,
    publicOrigin,
    hospital.slug,
  );

  const siteData = {
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hospitalSlug: hospital.slug,
    seoTitle: hospital.seoTitle,
    seoDescription: hospital.seoDescription,
    ogImage: hospital.ogImage,
    resolvedOgImage,
    publicOrigin,
    customDomain: hospital.customDomain,
    designTokens: tokens,
    favicon,
    builtAt: new Date().toISOString(),
    pages,
  };

  const dataDir = join(SITE_RENDERER_ROOT, 'data');
  await mkdir(dataDir, { recursive: true });
  await writeFile(join(dataDir, 'site.json'), JSON.stringify(siteData, null, 2), 'utf8');

  const faviconSvg = buildFaviconSvg({
    preset: favicon,
    hospitalName: hospital.name,
    accent: tokens.colors?.accent,
  });
  await writeFile(join(dataDir, 'favicon.svg'), faviconSvg, 'utf8');
  const publicDir = join(SITE_RENDERER_ROOT, 'public');
  await mkdir(publicDir, { recursive: true });
  await writeFile(join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');

  const ogTitle = (hospital.seoTitle?.trim() || hospital.name).slice(0, 80);
  const ogDescription = (
    hospital.seoDescription?.trim() || `${hospital.name} — care you can trust`
  ).slice(0, 140);
  const ogSvg = buildOgSvg({
    hospitalName: hospital.name,
    title: ogTitle,
    description: ogDescription,
    accent: tokens.colors?.accent || '#1F7A6C',
    background: tokens.colors?.background || '#F3F1EC',
    foreground: tokens.colors?.foreground || '#0F1C1A',
    muted: tokens.colors?.muted || '#5C6B67',
  });
  await writeFile(join(publicDir, 'og.svg'), ogSvg, 'utf8');
  await writeFile(join(dataDir, 'og.svg'), ogSvg, 'utf8');
  const ogPng = buildOgPng(tokens.colors?.accent || '#1F7A6C');
  await writeFile(join(publicDir, 'og.png'), ogPng);
  await writeFile(join(dataDir, 'og.png'), ogPng);

  console.log(
    `[build] wrote site.json for ${siteData.hospitalSlug} (${siteData.pages.length} pages) og=${resolvedOgImage}`,
  );

  await rm(join(SITE_RENDERER_ROOT, '.next'), { recursive: true, force: true });
  await rm(join(SITE_RENDERER_ROOT, 'out'), { recursive: true, force: true });

  await runCommand('npx', ['next', 'build'], SITE_RENDERER_ROOT, {
    ...process.env,
    SITE_BASE_PATH: `/${hospital.slug}`,
    CDN_ROOT_DOMAIN: rootDomain || process.env.CDN_ROOT_DOMAIN || '',
    SITE_PUBLIC_ORIGIN: publicOrigin.replace(/\/$/, ''),
    // Bake Studio origin into appointment forms on the static site.
    NEXT_PUBLIC_STUDIO_API_URL:
      process.env.NEXT_PUBLIC_STUDIO_API_URL ||
      process.env.STUDIO_PUBLIC_URL ||
      '',
  });

  const outDir = join(SITE_RENDERER_ROOT, 'out');
  const outStat = await stat(outDir).catch(() => null);
  if (!outStat?.isDirectory()) {
    throw new Error(`Next.js export produced no out/ directory at ${outDir}`);
  }

  const files = await collectFiles(outDir);
  // Gate on in-memory buffers (not a second disk read) so OneDrive/sync races
  // can't swap wireframe HTML between check and upload.
  const indexFile = files.find((f) => f.path === 'index.html');
  const indexHtml = indexFile ? String(indexFile.body) : '';
  if (!indexHtml.includes('nabhi-site-header')) {
    throw new Error(
      `Build rejected: out/index.html missing nabhi-site-header (wireframe/old renderer). ` +
        `SITE_RENDERER_ROOT=${SITE_RENDERER_ROOT}`,
    );
  }
  const notFoundFile = files.find((f) => f.path === '404.html' || f.path === '404/index.html');
  if (!notFoundFile) {
    throw new Error(
      `Build rejected: out/404.html missing (themed not-found page required for CDN). ` +
        `SITE_RENDERER_ROOT=${SITE_RENDERER_ROOT}`,
    );
  }
  // CDN always looks for 404.html at the version root.
  if (!files.some((f) => f.path === '404.html')) {
    files.push({
      path: '404.html',
      body: notFoundFile.body,
      contentType: 'text/html; charset=utf-8',
    });
  }

  // Share card assets. Meta/WhatsApp use og.png (or hero/custom https); SVG is optional.
  if (!files.some((f) => f.path === 'og.svg')) {
    files.push({
      path: 'og.svg',
      body: ogSvg,
      contentType: 'image/svg+xml',
    });
  }
  if (!files.some((f) => f.path === 'og.png')) {
    files.push({
      path: 'og.png',
      body: ogPng,
      contentType: 'image/png',
    });
  }
  // Remove any broken Next opengraph-image artifacts if present from older trees.
  const withoutBrokenOg = files.filter(
    (f) => !/(^|\/)opengraph-image/i.test(f.path),
  );
  files.length = 0;
  files.push(...withoutBrokenOg);
  const origin = publicOrigin.replace(/\/$/, '');
  const allowIndex = hospital.seoIndex !== false;
  const sitemapUrls = [
    ...hospital.pages.map((p) => {
      const path = p.slug === 'home' ? `/` : `/${p.slug}/`;
      return `  <url><loc>${origin}${path}</loc></url>`;
    }),
    `  <url><loc>${origin}/privacy/</loc></url>`,
  ].join('\n');
  const robotsBody = allowIndex
    ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  files.push({
    path: 'robots.txt',
    body: robotsBody,
    contentType: 'text/plain; charset=utf-8',
  });
  files.push({
    path: 'sitemap.xml',
    body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
    contentType: 'application/xml; charset=utf-8',
  });
  console.log(
    `[build] collected ${files.length} files from out/ (+ robots/sitemap) index=${allowIndex}`,
  );
  return { cdnKey: hospital.slug, hospitalDbId: hospital.id, files };
}

const worker = new Worker<PublishJobData>(
  PUBLISH_QUEUE_NAME,
  async (job: Job<PublishJobData>) => {
    const { hospitalId, publishId } = job.data;

    await prisma.publish.updateMany({
      where: { id: publishId },
      data: { status: 'BUILDING' },
    });

    try {
      console.log(`[publish ${publishId}] building site for ${hospitalId}`);
      const { cdnKey, hospitalDbId, files } = await buildStaticSite(hospitalId);

      await prisma.publish.updateMany({
        where: { id: publishId },
        data: { status: 'UPLOADING', snapshotPath: `${cdnKey}/versions/${publishId}/` },
      });

      console.log(`[publish ${publishId}] uploading under ${cdnKey}`);
      await uploadBuildOutput(cdnKey, publishId, files);

      // promoteToLive also re-reads MinIO index.html and refuses wireframe builds.
      console.log(`[publish ${publishId}] promoting to live (chrome gate)`);
      await promoteToLive(cdnKey, publishId);

      await prisma.$transaction([
        prisma.publish.updateMany({
          where: { hospitalId: hospitalDbId, isLive: true },
          data: { isLive: false },
        }),
        prisma.publish.updateMany({
          where: { id: publishId },
          data: { status: 'LIVE', isLive: true, completedAt: new Date() },
        }),
      ]);

      console.log(`[publish ${publishId}] done - live at http://localhost:8080/${cdnKey}/`);
    } catch (err) {
      await prisma.publish.updateMany({
        where: { id: publishId },
        data: { status: 'FAILED', completedAt: new Date() },
      });
      throw err;
    }
  },
  {
    connection,
    concurrency: 1,
    // Next export routinely exceeds BullMQ's 30s default lock.
    lockDuration: 15 * 60 * 1000,
  },
);

worker.on('completed', (job) => {
  console.log(`Publish job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Publish job ${job?.id} failed:`, err);
});

worker.on('stalled', (jobId) => {
  console.warn(`Publish job ${jobId} stalled — will retry`);
});

console.log(`Publish worker listening on queue "${PUBLISH_QUEUE_NAME}"...`);
console.log(`[worker] site-renderer root: ${SITE_RENDERER_ROOT}`);
console.log(`[worker] pid=${process.pid} cwd=${process.cwd()}`);
console.log(
  `[worker] SNAPSHOT_STORE_ENDPOINT=${process.env.SNAPSHOT_STORE_ENDPOINT ?? '(unset)'}`,
);

// On Render, bind PORT for the free-web health check. Skip locally (PORT may be HMS).
const healthPort = process.env.RENDER ? Number(process.env.PORT || 10000) : 0;
if (healthPort > 0) {
  createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
  }).listen(healthPort, () => {
    console.log(`health listening on :${healthPort}`);
  });
}
