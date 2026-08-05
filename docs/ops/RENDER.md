# Render / CDN deploy — MinIO + publish-worker

Pilot: Studio + CDN on Vercel; MinIO on Render; publish-worker local until a Render Web Service is added.

## Live URLs

| Piece | URL |
|--------|-----|
| Studio | https://nabhi-studio.vercel.app |
| CDN (hospital sites) | https://nabhi-cdn.vercel.app/`{slug}`/ |
| MinIO | https://nabhicares-studio-1.onrender.com |

## CDN (Vercel `nabhi-cdn`)

Source: `apps/cdn`. Env: `MINIO_URL`, `SNAPSHOT_BUCKET=nabhicares-sites`.

Studio env:

```bash
CDN_PUBLIC_URL="https://nabhi-cdn.vercel.app"
NEXT_PUBLIC_CDN_PUBLIC_URL="https://nabhi-cdn.vercel.app"
```

## MinIO (free)

Without a disk, buckets vanish on sleep/redeploy. Recreate:

```bash
docker run --rm --entrypoint sh minio/mc -c "
  mc alias set render https://nabhicares-studio-1.onrender.com 'USER' 'PASSWORD' &&
  mc mb -p render/nabhicares-sites || true &&
  mc anonymous set download render/nabhicares-sites || true
"
```

Wake before publish: `…/minio/health/live`.

## Publish worker

**Now:** keep this running while testing publishes:

```bash
# from repo root, with .env loaded (no PORT=4000)
npx tsx apps/publish-worker/src/index.ts
```

**Render (optional):** New → Web Service → Docker `apps/publish-worker/Dockerfile`, context `.`, free plan, health `/`, env same as Studio + `PORT=10000`.

## Notes

- Publishes stay PENDING if no worker is listening on Upstash Redis.
- Free MinIO is ephemeral; prefer a paid disk, R2, or a home PC with persistent MinIO — see [HOME_MINIO_WINDOWS.md](./HOME_MINIO_WINDOWS.md).
