# Production deploy — CDN, TLS, encryption, backups

This is the **ops runbook** for taking Nabhi Studio beyond Docker Desktop.
Local compose remains the sim; production swaps managed services (see README table).

## Target topology

| Concern | Recommended prod | Env / notes |
|---------|------------------|-------------|
| Studio UI + API | **Vercel** (`apps/studio`) | Auto **TLS**; set secrets in Vercel project |
| Publish worker | **Fly.io / Railway / VM** (Docker) | `apps/publish-worker/Dockerfile` |
| Builder Postgres | **Neon / RDS / Cloud SQL** | Encryption **at rest** on by default |
| Object store | **Cloudflare R2** (S3 API) | Encryption at rest; public bucket or Workers |
| CDN + TLS for sites | **Cloudflare** in front of R2 / Worker | Auto certs; purge on publish |
| Redis | **Upstash / ElastiCache** | TLS URL `rediss://…`; require auth |
| Secrets | Vercel / host secret store + GitHub Actions secrets | Never commit `.env` |

## 1. CDN + TLS (published hospital sites)

### Pattern (matches this repo)

1. Worker uploads versioned static files to R2: `{slug}/versions/{publishId}/…`
2. Worker writes atomic `{slug}/LIVE` pointer
3. Edge (Cloudflare Worker or R2 custom domain + Worker) reads `LIVE` and serves `versions/{id}/…` — same logic as `infra/cdn-sim/server.js`
4. On promote/rollback, `purgeCdnForHospital` calls Cloudflare purge API when configured

### Required env (worker + Studio)

```bash
SNAPSHOT_STORE_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
SNAPSHOT_STORE_KEY=...
SNAPSHOT_STORE_SECRET=...
SNAPSHOT_STORE_PUBLIC_URL=https://<accountid>.r2.cloudflarestorage.com   # or public bucket URL
CDN_PUBLIC_URL=https://sites.yourdomain.com          # HTTPS only in prod
NEXT_PUBLIC_CDN_PUBLIC_URL=https://sites.yourdomain.com
CLOUDFLARE_ZONE_ID=...
CLOUDFLARE_API_TOKEN=...   # Cache Purge permission
```

### TLS

- Studio: Vercel certificate (automatic).
- Sites: Cloudflare proxy / custom hostname (automatic HTTP→HTTPS).
- Do **not** expose MinIO/R2 or Redis on the public internet without TLS + auth.

Copy `infra/cdn-sim/server.js` into a Cloudflare Worker and point `MINIO_URL` at R2 public fetch or bind an R2 bucket.

## 2. Deploy Studio (Vercel)

```bash
cd apps/studio
npx vercel link
npx vercel env add BUILDER_DATABASE_URL production
npx vercel env add SESSION_SECRET production
npx vercel env add REDIS_URL production
npx vercel env add SNAPSHOT_STORE_ENDPOINT production
# … remaining from .env.example
```

GitHub Actions: `.github/workflows/deploy-studio.yml`  
Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## 3. Deploy publish-worker

```bash
docker build -f apps/publish-worker/Dockerfile -t nabhi-publish-worker .
# push to your registry; run with prod env (see .env.example)
```

Workflow: `.github/workflows/deploy-worker.yml` (needs registry secrets).

## 4. Encryption at rest (acceptance)

| System | Requirement | How we meet it |
|--------|-------------|----------------|
| Builder Postgres | Volume encrypted | Use Neon / RDS / Cloud SQL (AES-256 at rest). Document provider in this file when chosen: ________ |
| Object store | Bucket encrypted | R2 / S3 default SSE |
| Redis | Encrypted volume or managed | Upstash / ElastiCache |
| Backups | Encrypted at rest | Store dumps in R2 private bucket (`BACKUP_S3_BUCKET`) |

Local Docker volumes are **not** considered production encryption.

## 5. Backups (RPO / RTO)

| | Local | Production |
|---|--------|------------|
| Backup | `powershell -File scripts/backup-builder.ps1` | Nightly `.github/workflows/backup-builder.yml` |
| Restore drill | `powershell -File scripts/verify-backup-drill.ps1` | Restore into a scratch Neon branch / staging DB quarterly |
| **RPO (stated)** | Last successful dump | 24h (nightly) unless you shorten cron |
| **RTO (stated)** | < 30 min for small DB with this script | Document after first staging restore |

Restore (destructive to target DB):

```bash
# bash
./scripts/restore-builder.sh backups/builder-….sql.gz
# powershell (plain .sql from backup-builder.ps1)
powershell -File scripts/restore-builder.ps1 -File backups\builder-….sql
```

## 6. Legal gate

Complete and sign `docs/legal/DATA_CLASSIFICATION.md` before first external hospital.
Published sites include a `/privacy/` page template (customize per hospital later).

## 7. First production checklist

- [ ] Git remote + `main` branch; secrets only in Vercel / host / Actions  
- [ ] Managed Postgres (encrypted) + `prisma migrate deploy`  
- [ ] R2 bucket + Cloudflare zone + CDN Worker  
- [ ] Studio on Vercel (HTTPS)  
- [ ] Worker running with same DB/R2/Redis  
- [ ] `CLOUDFLARE_*` purge env verified (publish then check cache)  
- [ ] Nightly backup workflow green once  
- [ ] `verify-backup-drill` run against staging  
- [ ] Data classification signed  
- [ ] `SESSION_SECRET` ≥ 32 random bytes; Redis requires password  
- [ ] First admin created **manually** (not seed passwords) — `docs/ops/PILOT_ACCOUNTS.md`  
- [ ] Review-gate policy decided (self-attestation vs `REQUIRE_DISTINCT_APPROVER`)  
- [ ] Object-store retention accepted or second-bucket backup — `docs/ops/OBJECT_STORE_RETENTION.md`  
- [ ] `npm run test:pipeline --workspace=publish-worker` green after last schema/CDN changes  

