# Render deploy — MinIO + CDN + publish-worker (no Cloudflare R2 required)

Pilot alternative to R2. Studio stays on Vercel; object store + CDN + worker run on Render.

## Step 0 — Redis on Vercel

In `.env`, `REDIS_URL` must be Upstash **`rediss://…`** (TLS), not localhost.
Add the same value in Vercel → `nabhi-studio` → Settings → Environment Variables → Production.

## Step 1 — Deploy MinIO only (do this first)

1. Push this repo to `nabhicares/nabhicares-studio` (includes `render.yaml` + `infra/minio-render`).
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect `nabhicares/nabhicares-studio`
4. For the first pass you can **remove/disable** `nabhi-cdn` and `nabhi-publish-worker` in the Blueprint UI and only create **nabhi-minio**
5. Set secrets when prompted:
   - `MINIO_ROOT_USER` = e.g. `nabhicares`
   - `MINIO_ROOT_PASSWORD` = long random password (save it)
6. Plan: **Starter** (needed for the 10 GB disk)
7. Apply → wait until MinIO is **Live**
8. Copy the service URL, e.g. `https://nabhi-minio.onrender.com`

### Create the bucket

From a machine with [mc](https://min.io/docs/minio/linux/reference/minio-mc.html) (or Docker):

```bash
docker run --rm -it minio/mc sh -c "
  mc alias set render https://nabhi-minio.onrender.com 'USER' 'PASSWORD' &&
  mc mb -p render/nabhicares-sites || true &&
  mc anonymous set download render/nabhicares-sites || true
"
```

## Step 2 — Point Studio at MinIO

Vercel + local `.env` (production values):

```bash
SNAPSHOT_STORE_ENDPOINT="https://nabhi-minio.onrender.com"
SNAPSHOT_STORE_KEY="<MINIO_ROOT_USER>"
SNAPSHOT_STORE_SECRET="<MINIO_ROOT_PASSWORD>"
```

Redeploy Studio after saving env.

## Step 3 — CDN service

Enable `nabhi-cdn` from Blueprint (or New → Web Service → Docker `infra/cdn-sim`).

Env:

```bash
MINIO_URL=https://nabhi-minio.onrender.com
SNAPSHOT_BUCKET=nabhicares-sites
PORT=10000
```

Then set:

```bash
CDN_PUBLIC_URL="https://nabhi-cdn.onrender.com"
NEXT_PUBLIC_CDN_PUBLIC_URL="https://nabhi-cdn.onrender.com"
```

## Step 4 — Publish worker

Enable `nabhi-publish-worker` with the same Neon / Redis / MinIO / CDN env as Studio.

## Notes

- MinIO on Render free tier without a disk **will lose data** on restart — use Starter + disk.
- Services may sleep on free plans; paid Starter stays warmer for demos.
- When you later add Cloudflare R2, only swap `SNAPSHOT_STORE_*` and CDN; no app rewrite.
