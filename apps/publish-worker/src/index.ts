import { Worker, Job } from 'bullmq';
import { spawn } from 'child_process';
import { createServer } from 'http';
import { readdir, readFile, writeFile, mkdir, stat, rm } from 'fs/promises';
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
  const tokens = {
    ...DEFAULT_DESIGN_TOKENS,
    ...((hospital.designSystem?.tokens as object) ?? {}),
  } as DesignTokens;
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

  const siteData = {
    hospitalId: hospital.id,
    hospitalName: hospital.name,
    hospitalSlug: hospital.slug,
    seoTitle: hospital.seoTitle,
    seoDescription: hospital.seoDescription,
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

  console.log(
    `[build] wrote site.json for ${siteData.hospitalSlug} (${siteData.pages.length} pages)`,
  );

  await rm(join(SITE_RENDERER_ROOT, '.next'), { recursive: true, force: true });
  await rm(join(SITE_RENDERER_ROOT, 'out'), { recursive: true, force: true });

  await runCommand('npx', ['next', 'build'], SITE_RENDERER_ROOT, {
    ...process.env,
    SITE_BASE_PATH: `/${hospital.slug}`,
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
  const base = `/${hospital.slug}`;
  const sitemapUrls = [
    ...hospital.pages.map((p) => {
      const path = p.slug === 'home' ? `${base}/` : `${base}/${p.slug}/`;
      return `  <url><loc>${path}</loc></url>`;
    }),
    `  <url><loc>${base}/privacy/</loc></url>`,
  ].join('\n');
  files.push({
    path: 'robots.txt',
    body: `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
    contentType: 'text/plain; charset=utf-8',
  });
  files.push({
    path: 'sitemap.xml',
    body: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
    contentType: 'application/xml; charset=utf-8',
  });
  console.log(`[build] collected ${files.length} files from out/ (+ robots/sitemap)`);
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
