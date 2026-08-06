import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

const BUCKET = process.env.SNAPSHOT_BUCKET || 'nabhicares-sites';

export const s3 = new S3Client({
  endpoint: process.env.SNAPSHOT_STORE_ENDPOINT ?? 'http://localhost:9000',
  region: 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.SNAPSHOT_STORE_KEY ?? 'nabhicares',
    secretAccessKey: process.env.SNAPSHOT_STORE_SECRET ?? 'nabhicares_dev_pw',
  },
});

export type BuildFile = {
  path: string;
  body: string | Buffer;
  contentType: string;
};

export class IncompleteSnapshotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IncompleteSnapshotError';
  }
}

/** Recreate bucket after free MinIO wipes ephemeral storage. */
let bucketReady: Promise<void> | null = null;
export async function ensureSnapshotBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      try {
        await s3.send(new HeadBucketCommand({ Bucket: BUCKET }));
        return;
      } catch {
        /* create */
      }
      try {
        await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
        console.log(`[snapshot-store] created bucket ${BUCKET}`);
      } catch (err) {
        // Race: another process created it
        console.warn('[snapshot-store] CreateBucket', err);
      }
      try {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${BUCKET}/*`],
            },
          ],
        };
        await s3.send(
          new PutBucketPolicyCommand({
            Bucket: BUCKET,
            Policy: JSON.stringify(policy),
          }),
        );
      } catch (err) {
        console.warn('[snapshot-store] public policy skipped', err);
      }
    })().catch((err) => {
      bucketReady = null;
      throw err;
    });
  }
  await bucketReady;
}

function livePointerKey(hospitalKey: string) {
  return `${hospitalKey}/LIVE`;
}

function versionPrefix(hospitalKey: string, publishId: string) {
  return `${hospitalKey}/versions/${publishId}/`;
}

function completeKey(hospitalKey: string, publishId: string) {
  return `${versionPrefix(hospitalKey, publishId)}.complete`;
}

export async function uploadBuildOutput(
  hospitalKey: string,
  publishId: string,
  files: BuildFile[],
) {
  await ensureSnapshotBucket();
  for (const file of files) {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `${versionPrefix(hospitalKey, publishId)}${file.path}`,
        Body: file.body,
        ContentType: file.contentType,
      }),
    );
  }

  // Marker written last — promote refuses without it (retry-safe).
  const hasIndex = files.some(
    (f) => f.path === 'index.html' || f.path.endsWith('/index.html'),
  );
  if (!hasIndex) {
    throw new IncompleteSnapshotError('Build output missing index.html');
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: completeKey(hospitalKey, publishId),
      Body: JSON.stringify({
        publishId,
        fileCount: files.length,
        completedAt: new Date().toISOString(),
      }),
      ContentType: 'application/json',
    }),
  );
}

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** Ensure a version is fully uploaded before it can go live. */
export async function assertVersionComplete(hospitalKey: string, publishId: string) {
  const prefix = versionPrefix(hospitalKey, publishId);
  if (!(await objectExists(completeKey(hospitalKey, publishId)))) {
    throw new IncompleteSnapshotError(
      `Snapshot ${publishId} is incomplete (missing .complete marker)`,
    );
  }
  if (!(await objectExists(`${prefix}index.html`))) {
    throw new IncompleteSnapshotError(`Snapshot ${publishId} is missing index.html`);
  }

  const listed = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 5 }),
  );
  if (!listed.Contents?.length) {
    throw new IncompleteSnapshotError(`Snapshot ${publishId} has no files`);
  }
}

/**
 * Refuse LIVE for pre-SiteChrome "wireframe" builds (missing nabhi-site-header).
 * Runs on the object already in MinIO so a stale worker can't promote junk
 * if it shares this package version.
 */
export async function assertModernSiteChrome(hospitalKey: string, publishId: string) {
  const key = `${versionPrefix(hospitalKey, publishId)}index.html`;
  const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const html = res.Body ? await res.Body.transformToString() : '';
  if (!html.includes('nabhi-site-header')) {
    throw new IncompleteSnapshotError(
      `Refusing LIVE for ${hospitalKey}/${publishId}: index.html missing nabhi-site-header (wireframe/old renderer)`,
    );
  }
}

/**
 * Atomic promote: flip a single LIVE pointer object to this publishId.
 * CDN reads LIVE then serves versions/{id}/… — no mid-copy current/ tree.
 * After flip, purge Cloudflare edge cache when CLOUDFLARE_* env is set.
 */
export async function promoteToLive(hospitalKey: string, publishId: string) {
  await assertVersionComplete(hospitalKey, publishId);
  await assertModernSiteChrome(hospitalKey, publishId);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: livePointerKey(hospitalKey),
      Body: publishId,
      ContentType: 'text/plain; charset=utf-8',
      CacheControl: 'no-store',
    }),
  );

  await purgeCdnForHospital(hospitalKey);
}

/**
 * Purge CDN cache for a hospital prefix after publish/rollback.
 * No-op locally. Production: set CLOUDFLARE_ZONE_ID + CLOUDFLARE_API_TOKEN
 * and CDN_PUBLIC_URL (https://sites.example.com).
 */
export async function purgeCdnForHospital(hospitalKey: string): Promise<void> {
  const zone = process.env.CLOUDFLARE_ZONE_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const cdnBase = (process.env.CDN_PUBLIC_URL ?? '').replace(/\/$/, '');
  if (!zone || !token || !cdnBase.startsWith('https://')) {
    return;
  }

  const prefix = `${cdnBase}/${hospitalKey}/`;
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prefixes: [prefix] }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    console.error('[cdn-purge] failed', res.status, body);
    throw new Error(`Cloudflare purge failed: ${res.status}`);
  }
  console.log(`[cdn-purge] purged prefix ${prefix}`);
}

export async function readLivePublishId(hospitalKey: string): Promise<string | null> {
  try {
    const out = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: livePointerKey(hospitalKey) }),
    );
    const text = await out.Body?.transformToString();
    const id = text?.trim();
    return id || null;
  } catch {
    return null;
  }
}

/** Delete all objects under a hospital slug (versions, assets, LIVE, legacy current/). */
export async function purgeHospitalStorage(hospitalKey: string): Promise<number> {
  let deleted = 0;
  let token: string | undefined;
  do {
    const listed = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: `${hospitalKey}/`,
        ContinuationToken: token,
      }),
    );
    const keys = (listed.Contents ?? []).map((o) => o.Key).filter(Boolean) as string[];
    for (let i = 0; i < keys.length; i += 1000) {
      const chunk = keys.slice(i, i + 1000);
      if (!chunk.length) continue;
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
        }),
      );
      deleted += chunk.length;
    }
    token = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (token);
  return deleted;
}

/** Upload a hospital media asset. Returns a public URL (MinIO anonymous download). */
export async function uploadAsset(
  hospitalKey: string,
  filename: string,
  body: Buffer,
  contentType: string,
): Promise<{ key: string; url: string }> {
  await ensureSnapshotBucket();
  const key = `${hospitalKey}/assets/${filename}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  const endpoint = (
    process.env.SNAPSHOT_STORE_PUBLIC_URL ??
    process.env.SNAPSHOT_STORE_ENDPOINT ??
    'http://localhost:9000'
  ).replace(/\/$/, '');
  return { key, url: `${endpoint}/${BUCKET}/${key}` };
}

const DOMAIN_MAP_KEY = '_cdn/domain-map.json';

/** Host → hospital slug map for custom domains (CDN reads this). */
export async function readDomainMap(): Promise<Record<string, string>> {
  try {
    const out = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: DOMAIN_MAP_KEY }),
    );
    const text = await out.Body?.transformToString();
    const parsed = text ? JSON.parse(text) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function writeDomainMap(map: Record<string, string>): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: DOMAIN_MAP_KEY,
      Body: JSON.stringify(map, null, 2),
      ContentType: 'application/json',
      CacheControl: 'no-store',
    }),
  );
}

/** Bind or clear a custom hostname for a hospital slug. */
export async function setCustomDomainMapping(
  slug: string,
  host: string | null,
): Promise<void> {
  const map = await readDomainMap();
  for (const [h, s] of Object.entries(map)) {
    if (s === slug) delete map[h];
  }
  if (host) {
    const normalized = host.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (map[normalized] && map[normalized] !== slug) {
      throw new Error(`Domain ${normalized} is already mapped to ${map[normalized]}`);
    }
    map[normalized] = slug;
  }
  await writeDomainMap(map);
}
